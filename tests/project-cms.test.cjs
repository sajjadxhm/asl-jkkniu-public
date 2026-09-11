const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(relativePath, mocks) {
  const filename = path.join(__dirname, "..", relativePath);
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  vm.runInNewContext(outputText, {
    module, exports: module.exports, URL, Date, console: { error() {} },
    require(name) { if (name in mocks) return mocks[name]; throw new Error("Unexpected import: " + name); },
  }, { filename });
  return module.exports;
}
const validations = load("src/features/projects/validations.ts", { zod: require("zod") });
const valid = {
  title: "Lab project", slug: "lab-project", description: "", status: "ONGOING",
  startDate: "2026-09-01", endDate: "2026-10-01", principalInvestigatorId: "pi",
  memberIds: ["member"], researchAreaIds: ["area"], fundingSource: "", projectUrl: "https://example.org/project", isFeatured: false,
};
test("form accepts optional empty values and each supported status", () => {
  for (const status of validations.projectStatuses) {
    assert.equal(validations.projectSchema.safeParse({ ...valid, status, startDate: "", endDate: "", projectUrl: "", memberIds: [], researchAreaIds: [] }).success, true);
  }
  assert.equal(validations.projectSlug(" ASL: A New Project! "), "asl-a-new-project");
});
test("rejects invalid dates, reversed dates, unsafe URLs, duplicate relations and invalid identifiers", () => {
  for (const bad of [
    { startDate: "2026-02-30" }, { endDate: "2026-08-31" }, { startDate: "not-a-date" },
    { projectUrl: "javascript:alert(1)" }, { projectUrl: "ftp://example.org" }, { projectUrl: "bad" },
    { memberIds: ["member", "member"] }, { researchAreaIds: ["area", "area"] },
    { principalInvestigatorId: "" }, { slug: "Not A Slug" }, { title: " " }, { status: "DRAFT" },
  ]) assert.equal(validations.projectSchema.safeParse({ ...valid, ...bad }).success, false, JSON.stringify(bad));
  assert.equal(validations.projectSchema.safeParse({ ...valid, startDate: "2024-02-29", endDate: "2024-02-29" }).success, true);
});
function permissions(role, account) {
  return load("src/features/projects/permissions.ts", {
    "next/navigation": { redirect(destination) { throw new Error("redirect:" + destination); } },
    "@/lib/permissions/auth": { async requireRole(allowed) {
      if (!allowed.includes(role)) throw new Error("role denied");
      return { id: "user", role };
    } },
    "@/lib/db/prisma": { prisma: { user: { async findUnique() { return account; } } } },
  });
}
test("only active Super Admin and researchers with completed password changes can mutate projects", async () => {
  for (const role of ["SUPER_ADMIN", "RESEARCHER"]) {
    assert.equal((await permissions(role, { role, isActive: true, mustChangePassword: false }).requireProjectAccess()).role, role);
  }
  for (const role of ["ADMIN", "EDITOR"]) await assert.rejects(permissions(role, {}).requireProjectAccess(), /role denied/);
  await assert.rejects(permissions("RESEARCHER", { role: "RESEARCHER", isActive: false }).requireProjectAccess(), /login/);
  await assert.rejects(permissions("RESEARCHER", { role: "RESEARCHER", isActive: true, mustChangePassword: true }).requireProjectAccess(), /change-password/);
  await assert.rejects(permissions("RESEARCHER", { role: "RESEARCHER", isActive: true }).requireProjectAccess("admin"), /role denied/);
  await assert.rejects(permissions("SUPER_ADMIN", { role: "SUPER_ADMIN", isActive: true }).requireProjectAccess("researcher"), /role denied/);
});
function actions(options = {}) {
  const calls = [], invalidated = [];
  class KnownError extends Error { constructor(code) { super(code); this.code = code; } }
  function record(name, result) {
    return async (args) => {
      calls.push({ name, args });
      if (options.error && ["create", "update", "delete"].includes(name)) throw new KnownError(options.error);
      return result;
    };
  }
  const project = { create: record("create", { id: "project" }), update: record("update", { id: "project" }), delete: record("delete", {}) };
  const tx = {
    person: { findMany: record("people", options.people ?? [{ id: "pi" }, { id: "member" }]) },
    researchArea: { findMany: record("areas", options.areas ?? [{ id: "area" }]) },
    project,
    projectMember: { deleteMany: record("remove-members", {}), createMany: record("add-members", {}) },
    projectResearchArea: { deleteMany: record("remove-areas", {}), createMany: record("add-areas", {}) },
  };
  const exported = load("src/features/projects/actions.ts", {
    "next/cache": { revalidatePath: (...args) => invalidated.push(args) },
    "@/lib/db/prisma": { prisma: { project, $transaction: async (fn) => fn(tx) } },
    "@/generated/prisma/client": { Prisma: { PrismaClientKnownRequestError: KnownError } },
    "./permissions": { async requireProjectAccess() { if (options.denied) throw new Error("denied"); } },
    "./validations": validations,
  });
  return { ...exported, calls, invalidated };
}
test("create saves fields and both join tables, then invalidates both portals and public pages", async () => {
  const api = actions();
  assert.equal((await api.createProject(valid)).success, true);
  assert.equal(api.calls.find(({ name }) => name === "create").args.data.startDate.toISOString(), "2026-09-01T00:00:00.000Z");
  assert.equal(api.calls.find(({ name }) => name === "add-members").args.data[0].personId, "member");
  assert.equal(api.calls.find(({ name }) => name === "add-areas").args.data[0].researchAreaId, "area");
  for (const route of ["/admin/projects", "/researcher/projects", "/projects", "/people", "/researcher/dashboard"]) {
    assert.ok(api.invalidated.some(([value]) => value === route), route);
  }
});
test("update retains member roles and removes only relationships deselected in the form", async () => {
  const api = actions();
  assert.equal((await api.updateProject("project", valid)).success, true);
  const removed = api.calls.find(({ name }) => name === "remove-members").args;
  assert.equal(removed.where.personId.notIn[0], "member");
  const added = api.calls.find(({ name }) => name === "add-members").args;
  assert.equal(added.skipDuplicates, true);
  assert.equal("role" in added.data[0], false);
  assert.equal(api.calls.some(({ name }) => name === "create"), false);
});
test("invalid relations return field errors without writing", async () => {
  const api = actions({ people: [], areas: [] });
  const result = await api.createProject(valid);
  assert.equal(result.success, false);
  assert.ok(result.errors.principalInvestigatorId && result.errors.memberIds && result.errors.researchAreaIds);
  assert.equal(api.calls.some(({ name }) => name === "create"), false);
  assert.equal(api.invalidated.length, 0);
});
test("duplicate slug and missing project failures have useful responses", async () => {
  const duplicate = await actions({ error: "P2002" }).createProject(valid);
  assert.ok(duplicate.errors.slug);
  assert.match((await actions({ error: "P2025" }).updateProject("missing", valid)).message, /no longer exists/);
});
test("authorization blocks every mutation, including direct calls", async () => {
  const api = actions({ denied: true });
  await assert.rejects(api.createProject(valid), /denied/);
  await assert.rejects(api.updateProject("project", valid), /denied/);
  await assert.rejects(api.deleteProject("project"), /denied/);
  assert.equal(api.calls.length, 0);
});
test("delete removes the project without modifying People or Research Areas", async () => {
  const api = actions();
  assert.equal((await api.deleteProject("project")).success, true);
  assert.equal(api.calls.length, 1);
  assert.equal(api.calls[0].name, "delete");
});
