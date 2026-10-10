const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(file, mocks = {}) {
  const module = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(output, { module, exports: module.exports, URL, TextEncoder, Uint8Array, File, FormData, console,
    require(name) {
      if (name in mocks) return mocks[name];
      if (["zod", "bcryptjs", "node:crypto"].includes(name)) return require(name);
      if (name === "@/lib/researcher-position") return load("src/lib/researcher-position.ts");
      if (name.startsWith("@/lib/validations/")) return load("src/lib/validations/" + name.split("/").pop() + ".ts");
      if (name === "./url") return load("src/lib/validations/url.ts");
      throw new Error("Unexpected dependency " + name);
    },
  });
  return module.exports;
}
function context(account, session = { user: { id: "actor", role: "SUPER_ADMIN" } }) {
  const calls = [];
  const db = new Proxy({ user: { async findUnique() { return account; } } }, {
    get(target, key) { if (key in target) return target[key]; throw Error("Unexpected DB access: " + String(key)); },
  });
  const permissions = load("src/lib/permissions/auth.ts", {
    "@/auth": { async auth() { return session; } },
    "@/lib/db/prisma": { prisma: db },
    "next/navigation": { redirect(url) { calls.push(url); throw Error("redirect:" + url); } },
  });
  return { permissions, db, calls };
}
const researcher = { id: "actor", role: "RESEARCHER", isActive: true, mustChangePassword: false };
test("permissions reject anonymous, missing and disabled accounts, and honor current role", async () => {
  for (const [account, session] of [[researcher, null], [null, undefined], [{ ...researcher, isActive: false }, undefined]]) {
    const { permissions } = context(account, session);
    await assert.rejects(permissions.requireUser(), /login/);
  }
  await assert.rejects(context(researcher).permissions.requireRole(["SUPER_ADMIN"]), /researcher\/dashboard/);
  assert.equal((await context(researcher).permissions.requireResearcher()).role, "RESEARCHER");
  const { permissions } = context({ ...researcher, mustChangePassword: true });
  await assert.rejects(permissions.requireResearcher(), /change-password/);
  assert.equal((await permissions.requireResearcherAccount()).id, "actor");
});

function authConfig(getAccount) {
  let config;
  load("src/auth.ts", {
    "@/lib/db/prisma": { prisma: { user: { async findUnique() { return getAccount(); } } } },
    "next-auth": (options) => { config = options; return {}; },
    "next-auth/providers/credentials": (options) => options,
  });
  return config;
}
test("credentials reject inactive accounts; JWTs revoke on disable, delete and password reset", async () => {
  const bcrypt = require("bcryptjs");
  let account = { ...researcher, name: "Example", email: "example@example.org", passwordHash: await bcrypt.hash("test-password-correct", 4) };
  const config = authConfig(() => account);
  assert.equal(await config.providers[0].authorize({ email: account.email, password: "wrong" }), null);
  const user = await config.providers[0].authorize({ email: account.email, password: "test-password-correct" });
  assert.ok(user);
  const token = await config.callbacks.jwt({ token: {}, user });
  assert.ok(token.passwordVersion);
  const session = await config.callbacks.session({ session: { user: {} }, token });
  assert.equal(session.user.passwordVersion, undefined);
  assert.equal(session.user.passwordHash, undefined);
  assert.equal(await config.callbacks.jwt({ token: { id: "actor", role: "RESEARCHER" } }), null);
  account.role = "EDITOR";
  assert.equal((await config.callbacks.jwt({ token, session: { role: "SUPER_ADMIN" }, trigger: "update" })).role, "EDITOR");
  account.isActive = false;
  assert.equal(await config.providers[0].authorize({ email: account.email, password: "test-password-correct" }), null);
  assert.equal(await config.callbacks.jwt({ token }), null);
  account.isActive = true;
  account.passwordHash = await bcrypt.hash("test-password-replacement", 4);
  assert.equal(await config.callbacks.jwt({ token }), null);
  account = null;
  assert.equal(await config.callbacks.jwt({ token }), null);
});

test("every exported mutation denies anonymous and disabled sessions before database or Storage work", async () => {
  const files = ["people/actions", "people/researcher-actions", "publications/actions", "publications/researcher-actions", "researcher/actions", "researcher/account-actions", "researcher/profile-delete-actions", "auth/password-actions", "projects/actions"];
  for (const account of [null, { ...researcher, isActive: false }]) {
    const { permissions, db } = context(account);
    const projectPermissions = load("src/features/projects/permissions.ts", {
      "@/lib/permissions/auth": permissions, "@/lib/db/prisma": { prisma: db },
      "next/navigation": { redirect(url) { throw Error("redirect:" + url); } },
    });
    for (const file of files) {
      const actions = load("src/features/" + file + ".ts", {
        "@/lib/permissions/auth": permissions, "@/lib/db/prisma": { prisma: db },
        "next/cache": { revalidatePath() {} },
        "@/lib/supabase/server": { supabaseServer: {} },
        "@/generated/prisma/client": { Prisma: {} },
        "./permissions": projectPermissions,
        "./validations": file.startsWith("projects") ? load("src/features/projects/validations.ts") : load("src/features/researcher/validations.ts"),
      });
      for (const [name, action] of Object.entries(actions)) {
        await assert.rejects(action("target", {}), /redirect:\/login/, name);
      }
    }
  }
});
test("researchers cannot invoke Super Admin password resets, status changes or deletions", async () => {
  const { permissions, db } = context(researcher);
  for (const file of ["auth/password-actions", "researcher/account-actions", "researcher/profile-delete-actions"]) {
    const actions = load("src/features/" + file + ".ts", {
      "@/lib/permissions/auth": permissions, "@/lib/db/prisma": { prisma: db }, "next/cache": { revalidatePath() {} },
    });
    for (const [name, action] of Object.entries(actions)) {
      if (name !== "changeMyPassword") await assert.rejects(action("target", false), /researcher\/dashboard/);
    }
  }
});
test("URL validation rejects executable and non-web schemes; bcrypt rejects truncated new passwords", () => {
  const { httpUrl, safeHttpUrl } = load("src/lib/validations/url.ts");
  for (const url of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "file:///etc/passwd", "ftp://example.org", "invalid"]) {
    assert.equal(httpUrl.safeParse(url).success, false);
    assert.equal(safeHttpUrl(url), undefined);
  }
  assert.equal(httpUrl.safeParse("https://example.org").success, true);
  const { changePasswordSchema } = load("src/lib/validations/password.ts");
  for (const password of ["a".repeat(73), "😀".repeat(19)]) assert.equal(changePasswordSchema.safeParse({ currentPassword: "old", newPassword: password, confirmPassword: password }).success, false);
});

test("database health is denied before querying for anonymous/researcher users and is not cached", async () => {
  for (const actor of [null, researcher, { role: "SUPER_ADMIN" }]) {
    let queries = 0;
    const route = load("src/app/api/health/db/route.ts", {
      "@/lib/permissions/auth": { async getCurrentUser() { return actor; } },
      "@/lib/db/prisma": { prisma: { async $queryRaw() { queries++; } } },
      "next/server": { NextResponse: { json(body, options) { return { body, ...options }; } } },
    });
    const response = await route.GET();
    assert.equal(response.headers["Cache-Control"], "no-store");
    assert.equal(queries, actor?.role === "SUPER_ADMIN" ? 1 : 0);
    if (actor?.role !== "SUPER_ADMIN") assert.equal(response.status, 401);
  }
});
test("image signatures reject spoofed HTML, empty files and mismatched MIME types", () => {
  const { matchesImageType } = load("src/lib/validations/image.ts");
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.equal(matchesImageType(new TextEncoder().encode("<html>malicious</html>"), type), false);
    assert.equal(matchesImageType(new Uint8Array(), type), false);
  }
  assert.equal(matchesImageType(Uint8Array.from([255, 216, 255]), "image/jpeg"), true);
  assert.equal(matchesImageType(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]), "image/png"), true);
});
test("public directory filters hidden people and private profiles; management reads authorize themselves", async () => {
  const calls = [];
  const { permissions } = context(null);
  const queries = load("src/features/people/queries.ts", {
    "@/lib/permissions/auth": permissions,
    "@/lib/db/prisma": { prisma: { person: { async findMany(args) { calls.push(args); return []; }, async findFirst(args) { calls.push(args); return null; } } } },
  });
  await queries.getPeople();
  assert.equal(calls[0].where.isActive, true);
  assert.equal(calls[0].where.OR[1].researcherProfile.isPublic, true);
  assert.equal(calls[0].select.user, undefined);
  assert.equal(calls[0].select.email, undefined);
  await queries.getPublicResearcherBySlug("private");
  assert.equal(calls[1].where.researcherProfile.isPublic, true);
  await assert.rejects(queries.getPeopleForManagement(), /login/);
  await assert.rejects(queries.getPersonById("private"), /login/);
  await assert.rejects(queries.getAlumniAndCoResearchersForManagement(), /login/);
  assert.equal(calls.length, 2);
});

test("Storage uses only the authenticated person's prefix and rejects spoofed uploads and URLs", async () => {
  const uploads = [], deletes = [], writes = [];
  const storage = {
    async upload(...args) { uploads.push(args); return {}; },
    getPublicUrl(path) { return { data: { publicUrl: "https://example.org/" + path } }; },
    async list(prefix) { assert.equal(prefix, "researchers/own-person"); return { data: [{ name: "profile.jpg" }], error: null }; },
    async remove(paths) { deletes.push(paths); return {}; },
  };
  const actions = load("src/features/researcher/actions.ts", {
    "@/lib/permissions/auth": { async requireResearcher() { return researcher; } },
    "@/lib/db/prisma": { prisma: {
      user: { async findUnique() { return { personId: "own-person" }; } },
      person: { async update(args) { writes.push(args); } },
    } },
    "@/lib/supabase/server": { supabaseServer: { storage: { from(bucket) { assert.equal(bucket, "researcher-photos"); return storage; } } } },
    "next/cache": { revalidatePath() {} },
    "./validations": load("src/features/researcher/validations.ts"),
  });
  for (const file of [new File(["<html>"], "fake.jpg", { type: "image/jpeg" }), new File([], "empty.jpg", { type: "image/jpeg" }), new File([new Uint8Array(1024 * 1024 + 1)], "large.png", { type: "image/png" })]) {
    const form = new FormData(); form.set("file", file);
    assert.equal((await actions.uploadResearcherProfileImage(form)).success, false);
  }
  assert.equal(uploads.length, 0);
  assert.equal((await actions.updateResearcherProfileImage("javascript:alert(1)")).success, false);
  assert.equal(writes.length, 0);
  const form = new FormData(); form.set("file", new File([Uint8Array.from([255,216,255])], "../../other.jpg", { type: "image/jpeg" }));
  assert.equal((await actions.uploadResearcherProfileImage(form)).success, true);
  assert.equal(uploads[0][0], "researchers/own-person/profile.jpg");
  assert.equal((await actions.removeResearcherProfileImage()).success, true);
  assert.equal(deletes[0][0], "researchers/own-person/profile.jpg");
  assert.equal(writes[0].where.id, "own-person");
});
test("researchers cannot edit/delete publications where they are not an author", async () => {
  const actions = load("src/features/publications/researcher-actions.ts", {
    "@/lib/permissions/auth": { async requireResearcher() { return researcher; } },
    "@/lib/db/prisma": { prisma: {
      user: { async findUnique() { return { personId: "own" }; } },
      publication: { async findUnique() { return { id: "other-publication", authors: [{ personId: "other", person: { slug: "other" } }] }; } },
    } },
    "next/cache": { revalidatePath() {} },
  });
  const input = { title: "Example publication", publicationType: "OTHER", citationCount: 0, isFeatured: false, authors: [{ type: "PERSON", personId: "own" }], researchAreaIds: [] };
  assert.equal((await actions.updateResearcherPublication("other-publication", input)).success, false);
  assert.equal((await actions.deleteResearcherPublication("other-publication")).success, false);
});
test("a linked account without ResearcherProfile cannot be modified through Alumni actions", async () => {
  const actions = load("src/features/people/researcher-actions.ts", {
    "@/lib/permissions/auth": { async requireResearcher() { return researcher; } },
    "@/lib/db/prisma": { prisma: { person: { async findUnique() { return { id: "other", user: { id: "admin" }, researcherProfile: null }; } } } },
    "next/cache": { revalidatePath() {} },
  });
  assert.equal((await actions.updateAlumni("other", { name: "Other", isActive: true })).success, false);
  assert.equal((await actions.deleteAlumni("other")).success, false);
});
