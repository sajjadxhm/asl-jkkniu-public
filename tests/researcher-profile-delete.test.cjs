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

function setup({ role = "SUPER_ADMIN", active = true, own = false, targetRole = null, leads = 0, profile = true } = {}) {
  const writes = [], routes = [];
  const tx = {
    user: {
      async findUnique() { return { role, isActive: active, personId: own ? "target" : "actor-profile" }; },
      async deleteMany(args) { writes.push(["user", args]); },
    },
    person: {
      async findUnique() { return { name: "Test Researcher", slug: "test-researcher", researcherProfile: profile ? { id: "profile" } : null,
        user: targetRole ? { id: "target-user", role: targetRole } : null, _count: { principalInvestigatorProjects: leads } }; },
      async delete(args) { writes.push(["person", args]); },
    },
    publicationAuthor: { async updateMany(args) { writes.push(["authors", args]); } },
  };
  const actions = load("src/features/researcher/profile-delete-actions.ts", {
    "@/lib/permissions/auth": { async requireRole(allowed) { if (!allowed.includes(role)) throw Error("denied"); return { id: "actor" }; } },
    "@/lib/db/prisma": { prisma: { async $transaction(fn, options) {
      assert.equal(options.isolationLevel, "Serializable"); return fn(tx);
    } } },
    "next/cache": { revalidatePath(route) { routes.push(route); } },
  });
  return { ...actions, writes, routes };
}
test("protects unauthorized actors, self, administrator profiles and project leads", async () => {
  for (const role of ["ADMIN", "RESEARCHER", "EDITOR"]) await assert.rejects(setup({role}).deleteResearcherProfile("target"), /denied/);
  for (const options of [{active:false}, {own:true}, {targetRole:"SUPER_ADMIN"}, {targetRole:"ADMIN"}, {targetRole:"EDITOR"}, {leads:1}, {profile:false}]) {
    const action=setup(options);
    assert.equal((await action.deleteResearcherProfile("target")).success, false);
    assert.equal(action.writes.length, 0);
  }
});
test("deletes profiles with or without login while preserving publication authorship and project records", async () => {
  for (const targetRole of [null, "RESEARCHER"]) {
    const action=setup({targetRole});
    assert.equal((await action.deleteResearcherProfile("target")).success, true);
    assert.deepEqual(action.writes.map(w=>w[0]), ["authors", "authors", "user", "person"]);
    assert.equal(action.writes[0][1].data.externalName, "Test Researcher");
    assert.equal(action.writes[1][1].data.personId, null);
    assert.equal(action.writes[2][1].where.role, "RESEARCHER");
    assert.equal(action.writes[3][1].where.id, "target");
    for (const route of ["/people", "/people/test-researcher", "/admin/people", "/admin/researchers"]) assert.ok(action.routes.includes(route));
  }
});
