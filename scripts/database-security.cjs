// Node >=20.12. Run from the repository root with --env-file=.env.
// Never print URLs, credentials, application rows, or raw database errors.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { Client } = require("pg");
const mode = process.argv[2] || "--audit";
if (!["--audit", "--dry-run", "--apply", "--verify"].includes(mode)) {
  throw new Error("Use --audit, --dry-run, --apply, or --verify");
}
const root = path.join(__dirname, "..");
const sql = fs.readFileSync(path.join(root, "prisma/security/20260916_lock_down_public.sql"), "utf8");
const expected = [...fs.readFileSync(path.join(root, "prisma/schema.prisma"), "utf8").matchAll(/^model (\w+)\s*\{/gm)].map(m => m[1]).concat("_prisma_migrations").sort();
const quote = name => '"' + name.replaceAll('"', '""') + '"';
async function inventory(db) {
  const actor = (await db.query("SELECT current_user AS role, current_database() AS database, rolbypassrls FROM pg_roles WHERE rolname=current_user")).rows[0];
  const tables = (await db.query(
    "SELECT c.oid, c.relname AS name, pg_get_userbyid(c.relowner) AS owner, c.relrowsecurity AS rls, c.relforcerowsecurity AS forced, row_security_active(c.oid) AS runtime_rls, has_table_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') OR has_any_column_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,REFERENCES') AS anon_access, has_table_privilege('authenticated',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') OR has_any_column_privilege('authenticated',c.oid,'SELECT,INSERT,UPDATE,REFERENCES') AS authenticated_access FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p') ORDER BY c.relname"
  )).rows;
  return { actor, tables };
}
async function storageSnapshot(db) {
  const tables = (await db.query("SELECT c.relname,c.relacl::text,c.relrowsecurity,c.relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='storage' ORDER BY c.relname")).rows;
  const policies = (await db.query("SELECT * FROM pg_policies WHERE schemaname='storage' ORDER BY tablename,policyname")).rows;
  return JSON.stringify({ tables, policies });
}
function checkRole(snapshot) {
  assert.equal(snapshot.actor.role, "postgres", "Runtime/migration role has changed: re-audit before applying");
  assert.equal(snapshot.actor.rolbypassrls, true, "Prisma role must retain its verified BYPASSRLS configuration");
  assert.deepEqual(snapshot.tables.map(t => t.name).sort(), expected, "Live tables differ from the Prisma inventory");
  for (const t of snapshot.tables) {
    assert.equal(t.owner, "postgres", "Table ownership changed");
    assert.equal(t.forced, false, "Unexpected FORCE RLS");
    assert.equal(t.runtime_rls, false, "Prisma connection is subject to RLS");
  }
}
async function verify(db) {
  const snapshot = await inventory(db);
  checkRole(snapshot);
  for (const t of snapshot.tables) {
    assert.equal(t.rls, true, "RLS missing: " + t.name);
    assert.equal(t.anon_access, false, "anon access remains: " + t.name);
    assert.equal(t.authenticated_access, false, "authenticated access remains: " + t.name);
    await db.query("SELECT 1 FROM public." + quote(t.name) + " LIMIT 0");
    for (const permission of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
      const result = await db.query("SELECT has_table_privilege(current_user,$1::oid,$2) AS allowed", [t.oid, permission]);
      assert.equal(result.rows[0].allowed, true, "Prisma privilege missing");
    }
  }
  assert.equal((await db.query("SELECT count(*)::int AS count FROM pg_policies WHERE schemaname='public'")).rows[0].count, 0);
  // Exercise actual browser-role access without fetching any application data.
  for (const role of ["anon", "authenticated"]) {
    await db.query("BEGIN READ ONLY");
    try {
      await db.query("SET LOCAL ROLE " + quote(role));
      for (const name of expected) {
        await db.query("SAVEPOINT denied_read");
        let denied = false;
        try { await db.query("SELECT 1 FROM public." + quote(name) + " LIMIT 0"); }
        catch (error) { if (error.code !== "42501") throw error; denied = true; }
        await db.query("ROLLBACK TO SAVEPOINT denied_read");
        await db.query("RELEASE SAVEPOINT denied_read");
        assert.ok(denied, "Browser role unexpectedly reached " + name);
      }
    } finally { await db.query("ROLLBACK"); }
  }
  return snapshot.tables.length;
}
(async () => {
  const connections = [];
  try {
    for (const variable of ["DATABASE_URL", "DIRECT_URL"]) {
      if (!process.env[variable]) throw new Error("Missing required variable: " + variable);
      const db = new Client({ connectionString: process.env[variable], connectionTimeoutMillis: 15000, statement_timeout: 30000 });
      connections.push(db);
      await db.connect();
    }
    const [runtime, migration] = connections;
    const before = await inventory(runtime);
    const direct = await inventory(migration);
    checkRole(before); checkRole(direct);
    assert.equal(before.actor.database, direct.actor.database, "Connections target different databases");
    assert.deepEqual(before.tables.map(t => [t.name,t.oid]), direct.tables.map(t => [t.name,t.oid]), "Connections target different catalogs");
    console.log("Both connections: verified postgres/BYPASSRLS; " + expected.length + " owned tables.");
    if (mode === "--audit") {
      console.table(before.tables.map(({ name, rls, anon_access, authenticated_access }) => ({ name, rls, anon_access, authenticated_access })));
      return;
    }
    const storageBefore = await storageSnapshot(migration);
    if (mode === "--dry-run" || mode === "--apply") {
      await migration.query(mode === "--dry-run" ? sql.replace(/COMMIT;\s*$/, "ROLLBACK;") : sql);
      console.log(mode === "--dry-run" ? "SQL checks passed; transaction rolled back." : "Security SQL committed.");
    }
    assert.equal(await storageSnapshot(migration), storageBefore, "Storage catalog changed unexpectedly");
    if (mode === "--dry-run") {
      assert.deepEqual(await inventory(runtime), before, "Dry run did not preserve original state");
    } else {
      console.log("Verified " + await verify(runtime) + " tables through DATABASE_URL.");
      console.log("Verified " + await verify(migration) + " tables through DIRECT_URL.");
    }
    console.log("Storage policies/ACLs unchanged; no application rows read or modified.");
  } catch (error) {
    // Constraint/connection errors can embed credentials or row values. Suppress them.
    console.error("Security check failed. Safe code: " + (error.code || "CHECK_FAILED"));
    if (error.code === "ERR_ASSERTION") console.error(error.message.split("\n")[0]);
    process.exitCode = 1;
  } finally {
    for (const db of connections) {
      await db.query("ROLLBACK").catch(() => {});
      await db.end().catch(() => {});
    }
  }
})();
