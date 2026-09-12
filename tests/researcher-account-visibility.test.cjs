const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, mocks) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, console,
    require(name) { if (name in mocks) return mocks[name]; throw Error("Unexpected dependency: " + name); },
  });
  return module.exports;
}
function deletion(role = "SUPER_ADMIN", active = true, targetRole = "RESEARCHER") {
  const mutations = [], routes = [];
  const actions = load("src/features/researcher/account-actions.ts", {
    "@/lib/permissions/auth": { async requireRole(roles) {
      if (!roles.includes(role)) throw Error("denied");
      return { id: "actor" };
    } },
    "@/lib/db/prisma": { prisma: { user: {
      async findUnique() { return { role, isActive: active }; },
      async deleteMany(args) { mutations.push(args); return { count: args.where.role === targetRole ? 1 : 0 }; },
    } } },
    "next/cache": { revalidatePath(route) { routes.push(route); } },
  });
  return { ...actions, mutations, routes };
}
test("deletion rejects unauthorized roles, inactive actors, self and invalid IDs", async () => {
  for (const role of ["ADMIN", "EDITOR", "RESEARCHER"]) {
    const action = deletion(role);
    await assert.rejects(action.deleteResearcherAccount("target"), /denied/);
    assert.equal(action.mutations.length, 0);
  }
  for (const [active, id] of [[false, "target"], [true, "actor"], [true, ""]]) {
    const action = deletion("SUPER_ADMIN", active);
    assert.equal((await action.deleteResearcherAccount(id)).success, false);
    assert.equal(action.mutations.length, 0);
  }
});
test("only researcher Users can be deleted; no academic model is accessed", async () => {
  for (const role of ["SUPER_ADMIN", "ADMIN", "EDITOR"]) {
    const action = deletion("SUPER_ADMIN", true, role);
    assert.equal((await action.deleteResearcherAccount("target")).success, false);
    assert.equal(action.routes.length, 0);
  }
  const action = deletion();
  assert.equal((await action.deleteResearcherAccount("target")).success, true);
  assert.equal(JSON.stringify(action.mutations), JSON.stringify([{ where: { id: "target", role: "RESEARCHER" } }]));
  assert.deepEqual(action.routes, ["/admin/researchers", "/admin"]);
});
const validation = load("src/lib/validations/people.ts", { zod: require("zod") });
test("visibility update preserves independent Person status and never writes User", async () => {
  for (const hasProfile of [true, false]) {
    for (const isPublic of [true, false]) {
      const writes = [], routes = [];
      const actions = load("src/features/people/actions.ts", {
        "@/lib/permissions/auth": { async requireRole() {} },
        "@/lib/validations/people": validation,
        "next/cache": { revalidatePath(route) { routes.push(route); } },
        "@/lib/db/prisma": { prisma: { person: {
          async findUnique() { return { id: "person", slug: "person", researcherProfile: hasProfile ? { id: "profile" } : null }; },
          async update(args) { writes.push(args.data); return { id: "person" }; },
        } } },
      });
      assert.equal((await actions.updatePerson("person", { name: "Test Person", isActive: true, isPublic })).success, true);
      assert.equal(writes[0].isActive, true);
      if (hasProfile) assert.equal(writes[0].researcherProfile.update.isPublic, isPublic);
      else assert.equal(writes[0].researcherProfile, undefined);
      for (const route of ["/people", "/people/person", "/join-us", "/contact"]) assert.ok(routes.includes(route));
    }
  }
});
test("public directory excludes private profiles without requiring a login; management stays unfiltered", async () => {
  const queries = [];
  const actions = load("src/features/people/queries.ts", {
    "@/lib/db/prisma": { prisma: { person: { async findMany(args) { queries.push(args); return []; } } } },
  });
  await actions.getPeople();
  await actions.getPeopleForManagement();
  const where = queries[0].where;
  assert.equal(where.isActive, true);
  assert.equal(where.OR[0].researcherProfile, null);
  assert.equal(where.OR[1].researcherProfile.isPublic, true);
  assert.equal(where.user, undefined);
  assert.equal(queries[1].where, undefined);
});
