# Prisma application-table security

This is an explicit, repeatable deployment security script, not a Prisma schema migration. It does not edit the Prisma migration history or application data.

## Verified architecture (2026-09-16)

- Runtime DATABASE_URL and migration DIRECT_URL resolve to postgres with BYPASSRLS.
- postgres owns all 20 Prisma model tables plus _prisma_migrations in public.
- No table Data API/RPC/GraphQL use was found. The unused browser Supabase client is not imported.
- Server-side Supabase Storage uses SUPABASE_SECRET_KEY for researcher-photos. Storage policies and grants are out of scope.

## Run from the repository root

Use Node >=20.12 and the existing pg dependency. Supply variables through the environment; for local development:

```powershell
node --env-file=.env scripts/database-security.cjs --audit
node --env-file=.env scripts/database-security.cjs --dry-run
node --env-file=.env scripts/database-security.cjs --apply
node --env-file=.env scripts/database-security.cjs --verify
```

Review 20260916_lock_down_public.sql before applying. Dry run obtains table locks and executes the transaction's checks, then rolls back. Apply commits; verification checks both connections, browser-role denial, and unchanged Storage ACL/policy metadata. On a guard failure the transaction rolls back. A verification error after commit does not automatically undo the security change; inspect it before taking further action.

The script enables RLS without policies, revokes table privileges from anon/authenticated/PUBLIC, and removes postgres-created public table/sequence default grants to those roles. It preserves service_role, table ownership and existing Prisma access. No FORCE RLS, new roles, allow-all policies, Storage changes, or row mutations are performed.

A changed runtime role requires a new security review. Add new application tables to the SQL allowlist and enable their RLS in future migrations. Default privilege changes do not automatically enable RLS. Objects created by other owners (including Supabase-managed roles) require separate review; this script does not modify their defaults.

Optionally disable the unused Data API in Supabase after confirming no external integrations need it. This is defense in depth, not required for the table-level fix. Do not disable Storage or change bucket policies as part of this work. Supabase may show RLS-enabled-without-policy notices: default-deny is intentional for these Prisma-only tables.

Re-run the Advisor after application. Check login/password reset, public pages, CMS editing and photo upload/remove in the deployed app. Local environment checks do not verify Vercel's secret configuration. Do not paste connection strings into commands, tickets or committed files; rotate any exposed database password and update all environments.
