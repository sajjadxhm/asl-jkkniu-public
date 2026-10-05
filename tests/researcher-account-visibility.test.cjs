const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, mocks) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, console, URL,
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
const positions = load("src/lib/researcher-position.ts", {});
const validation = load("src/lib/validations/people.ts", { zod: require("zod"), "@/lib/researcher-position": positions });
test("visibility update preserves independent Person status and never writes User", async () => {
  for (const hasProfile of [true, false]) {
    for (const [isPublic, isActive] of [[true, true], [true, false], [false, true], [false, false]]) {
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
      assert.equal((await actions.updatePerson("person", { name: "Test Person", isActive, isPublic })).success, true);
      assert.equal(writes[0].isActive, isActive);
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


test("all six positions retain labels, hierarchy, and validation compatibility", () => {
  const expected = ["PRINCIPAL_INVESTIGATOR", "ASSOCIATE_RESEARCH_LEAD", "LEAD_RESEARCHER", "SENIOR_RESEARCHER", "RESEARCHER", "RESEARCH_INTERN"];
  assert.deepEqual(Array.from(positions.RESEARCHER_POSITIONS), expected);
  assert.equal(positions.getResearcherPositionLabel("RESEARCHER"), "Research Assistant");
  assert.equal(positions.getResearcherPositionLabel("SENIOR_RESEARCHER"), "Senior Researcher");
  assert.equal(positions.getResearcherPositionLabel("RESEARCH_INTERN"), "Research Intern");
  const schemas = load("src/features/researcher/validations.ts", { zod: require("zod"), "@/lib/researcher-position": positions });
  for (const schema of [schemas.createResearcherSchema, schemas.researcherProfileSchema, validation.personSchema]) {
    for (const position of expected) assert.equal(schema.shape.position.safeParse(position).success, true);
    for (const role of ["SUPER_ADMIN", "ADMIN", "EDITOR"]) assert.equal(schema.shape.position.safeParse(role).success, false);
  }
});

test("Admin position updates affect existing profiles only and preserve visibility", async () => {
  for (const hasProfile of [true, false]) {
    for (const position of positions.RESEARCHER_POSITIONS) {
      let written;
      const actions = load("src/features/people/actions.ts", {
        "@/lib/permissions/auth": { async requireRole() {} },
        "@/lib/validations/people": validation,
        "next/cache": { revalidatePath() {} },
        "@/lib/db/prisma": { prisma: { person: {
          async findUnique() { return { id: "person", slug: "person", researcherProfile: hasProfile ? { id: "profile" } : null }; },
          async update(args) { written=args.data; return {id:"person"}; },
        } } },
      });
      assert.equal((await actions.updatePerson("person", {name:"Example Person",isActive:true,position})).success,true);
      assert.equal(written.isActive,true);
      if (hasProfile) {
        assert.equal(written.researcherProfile.update.position,position);
        assert.equal(written.researcherProfile.update.isPublic,undefined);
      } else assert.equal(written.researcherProfile,undefined);
      assert.equal(written.user,undefined);
    }
  }
});


test("published profile queries and sitemap do not depend on directory or login status", async () => {
  const queries = [];
  const methods = load("src/features/people/queries.ts", {
    "@/lib/db/prisma": { prisma: { person: {
      async findFirst(args) { queries.push(args); return null; },
      async findMany(args) { queries.push(args); return []; },
    } } },
  });
  await methods.getPublicResearcherBySlug("former-researcher");
  await methods.getPublicResearcherProfileUrls();
  for (const {where} of queries) {
    assert.equal(where.researcherProfile.isPublic, true);
    assert.equal(where.isActive, undefined);
    assert.equal(where.user, undefined);
  }
  assert.equal(queries[0].where.slug, "former-researcher");
});

test("inactive published authors keep ASL links; unpublished authors use safe fallback", () => {
  const {PublicationAuthor} = load("src/features/publications/components/publication-author.tsx", {
    "next/link": { default: "internal-link" },
    "react/jsx-runtime": require("react/jsx-runtime"),
  });
  for (const isActive of [true, false]) {
    const person = { name: "Example", slug: "example", isActive, linkedinUrl: "https://www.linkedin.com/in/example", researcherProfile: {isPublic:true} };
    const published = PublicationAuthor({author:{person,externalName:null}});
    assert.equal(published.type,"internal-link");
    assert.equal(published.props.href,"/people/example");
    person.researcherProfile.isPublic=false;
    const external = PublicationAuthor({author:{person,externalName:null}});
    assert.equal(external.type,"a");
    assert.equal(external.props.rel,"noopener noreferrer");
    assert.equal(external.props.target,"_blank");
    person.linkedinUrl=null;
    assert.equal(PublicationAuthor({author:{person,externalName:null}}).type,"span");
  }
});
