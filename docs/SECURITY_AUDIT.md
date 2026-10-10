# Security audit — 10 October 2026

Audited the local `asl-jkkniu-public` checkout at baseline `b106fc2`, matching the requested GitHub remote. Git status was clean before edits. Read the project handoff; examined dependencies/lockfile, environment template/ignore rules, Prisma schema and migrations, Auth.js callbacks and credentials provider, permission helpers, every server-action module, both API routes, private layouts/reads, public dynamic routes, Storage operations, bootstrap scripts, validation, URL/image/Markdown rendering, redirects and deployment security SQL. No middleware is present. No commit, push, deployment, live database mutation or policy change was performed.

Findings distinguish confirmed code issues from hardening and unverified infrastructure. The tests execute repository code with mocked database/auth/Storage boundaries; they are not live browser or deployed integration tests.

## Critical

No confirmed critical application vulnerability or real exposed credential was found within the inspected source and locally available history. Live Supabase policies are unverified; a permissive Data API policy could expose User password hashes independently of application authorization.

## High

| Affected files | Vulnerability / impact | Fix applied | Manual action | Rotation |
| --- | --- | --- | --- | --- |
| `src/auth.ts`, `src/lib/permissions/auth.ts` | Old JWTs retained effective access after account disabling, and stale roles remained authoritative for most protected operations. Existing password-reset sessions could survive a later password change. | All-role JWT DB refresh and disabled/deleted-account rejection; each permission helper reads current account state. A SHA-256 fingerprint of the password hash stays inside the encrypted JWT and revokes tokens after password replacement; it is never exposed in the session response. | Deploy; all pre-fix JWTs lack the fingerprint and require sign-in again. Password changes now sign out and return to login. | No |
| `pnpm-workspace.yaml`, `pnpm-lock.yaml` | Sharp 0.35.4 includes an upstream native SVG-decoder vulnerability, potentially serious on applicable Linux runtimes. Next's optimizer processes Storage-hosted images, and prior uploads trusted declared MIME types. Deployment exploitability was not reproduced. | Targeted transitive override to Sharp 0.35.5; image processing smoke test passed. | Redeploy to install patched native binaries. | No |

Sharp's maintainer describes the runtime prerequisites and patched native libraries in [GHSA-wq5f-xc86-pv6w](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w).

## Medium

| Affected files | Weakness / impact | Fix applied or remaining work | Manual action | Rotation |
| --- | --- | --- | --- | --- |
| `src/lib/validations/alumni.ts`, `publications.ts`, new `url.ts`; public People/contact/join/profile and publication components | Generic URL validation accepted non-web schemes. Some stored values were rendered directly as links. React's own JavaScript-URL protection reduces exploitability; this is not a reproduced React XSS bypass. | HTTP(S)-only validation and safe rendering of existing stored external links; direct profile-image update also validates its URL. | Verify existing links render correctly after deployment. | No |
| `src/features/researcher/actions.ts`, new `src/lib/validations/image.ts` | Multipart MIME declarations were trusted, allowing non-image bytes in the public photo bucket. | Reject empty/oversized files and JPEG/PNG/WebP signature mismatches. Paths remain derived from the authenticated Person, ignoring client filenames/IDs. | Verify bucket MIME/size restrictions and write/delete policies. | No |
| `src/features/people/researcher-actions.ts` | A linked account with no ResearcherProfile could be edited/deleted through researcher Alumni actions. The DB migration permits unlinking User when Person is deleted. | Both update and delete reject a linked User as well as a ResearcherProfile. | None beyond deployment. | No |
| `src/features/{people,publications,researcher}/queries.ts`, `publications/researcher-queries.ts` | Several management reads depended on calling pages/layouts. Researcher queries loaded full User scalars including passwordHash, although reviewed components did not serialize the hash publicly. | Reads enforce their own permissions; own-profile/publication reads check account identity. Researcher query selects required fields without the hash; public directory excludes login state, email and full profile metadata. | None beyond deployment. | No |
| `src/lib/validations/password.ts`, `src/features/researcher/validations.ts`, bootstrap scripts | New passwords up to 100 characters could exceed bcrypt's 72-byte limit and silently share the same effective password. | New-password validation uses the UTF-8 byte limit; bootstrap scripts use bcrypt's truncation check. Researcher creation also normalizes email case. | Legacy passwords remain accepted; replace any known overlong passwords. | No mandatory rotation identified |
| `next.config.ts` | Missing browser security headers. | Added nosniff, strict-origin-when-cross-origin, frame denial, restrictive object/base/frame CSP directives and camera/microphone/geolocation restrictions; removed X-Powered-By. CSP does not restrict scripts/styles/fonts/images, avoiding a speculative Next/Auth/Analytics breakage. | Check deployed headers, HTTPS and HSTS. A complete script CSP needs separate compatibility testing. | No |
| `src/auth.ts`, credentials endpoint | No distributed login throttling is implemented in source. Public password guessing can consume bcrypt CPU and attempt account takeover. Infrastructure protections are unknown. | Left infrastructure-dependent throttling for deployment configuration; no unreliable process-local limiter added. | Configure and test login rate limiting/bot protection in Vercel; include POST `/api/auth/callback/credentials`. | No |

Signature checks do not prove complete image validity or remove metadata. Public photo URLs remain public even when a Person/profile is hidden; do not place confidential media in this bucket.

## Low

| Affected files | Weakness / impact | Fix applied | Manual action | Rotation |
| --- | --- | --- | --- | --- |
| `prisma/seed.ts`, `prisma/create-super-admin.ts`, `.env.example` | Seed upsert could promote/reset an existing account on rerun. The alternate bootstrap set a forced-change flag that only researcher flows enforce. | Both are create-only. Bootstrap uses a private permanent password with minimum length/byte checks; alternate script sets the flag false. Documented its env variable names. | Supply a unique strong permanent admin password; keep bootstrap passwords out of persistent Vercel runtime configuration. | No |
| Publication action/form files | Temporary diagnostics logged submissions and identifiers. | Removed debug console logs and the creation-only diagnostic reread; retained update integrity verification. | None. | No |
| Historical `.env.example` | One older ADMIN_PASSWORD looked like a credential. | Preserved history/evidence. You confirmed it was only an example. Historical DB URL/password and AUTH_SECRET entries are templates. | Do not reuse examples as actual credentials. | No, based on your confirmation |
| `src/lib/db/prisma.ts` | Database module lacked an explicit server-only import boundary. | Added `server-only`, matching the existing Supabase privileged-client boundary. | None. | No |
| `src/app/api/health/db/route.ts` | Anonymous requests could probe DB availability and issue a query without authentication. No credentials were returned. | Restricts diagnostics to an active Super Admin and sets no-store responses. | Adjust any existing health monitoring. | No |

## Secret scan and repository hygiene

- Examined 156 initially tracked files and 338 historical blobs reachable from all local refs (41 commits). No committed real `.env`, service-role key, database credential, private key or token was identified by the heuristic scan and candidate review. Unknown secret formats, unreachable objects, remote-only refs, GitHub artifacts and platform secret stores are outside this result.
- The historical password example was introduced in commit `4964498` and removed by `bdab67d`; the flagged blob is `0acba20b8d93bd25b6b45f2ddbf1184d2b894c9d`. Values are deliberately omitted.
- Added `scripts/security-secret-scan.cjs`; `--current-only` checks tracked working-tree files. Full-history mode intentionally reports the old password-like example as a candidate and exits nonzero; candidates require review.
- `.env*`, backups, generated Prisma output and Vercel metadata are ignored. Architecture/security documentation and public bootstrap scripts are useful and retained. The Supabase hostname in image configuration is a public identifier, not a secret.

## Dependency results

Initial `pnpm audit`: 23 findings — 1 critical, 12 high, 10 moderate. Final: **22 findings — 1 critical, 11 high, 10 moderate**. Full machine-readable detail is in `../security-audit-dependencies.json`.

Dependencies changed: Sharp **0.35.4 → 0.35.5** through a targeted override. Added **dotenv 17.4.2 as an explicit development dependency**, already present transitively in the lockfile: Prisma config/bootstrap scripts import it directly, and clean pnpm validation failed without it. No Next/React/Prisma/Auth versions changed.

| Remaining package | Findings | Application impact review |
| --- | ---: | --- |
| `proxy-addr` | 1 critical | Transitive through shadcn CLI's Express/MCP tooling. No application Express server or proxy trust checks found. Not a confirmed public-site critical issue. |
| `postcss` | 4 | Build/source-map/CSS processing; no user CSS upload, parsing service or CSS-to-HTML stringification path found. |
| `deepmerge-ts` | 1 | Prisma configuration tooling; no untrusted recursive-object input path found. Major-version override avoided. |
| `mysql2` | 2 | Prisma transitive tooling; application uses PostgreSQL/pg, not MySQL. |
| `fast-uri` | 1 | AJV/tooling/transitive alternate resolvers; application uses Zod, not these host checks. |
| `ip-address` | 2 | shadcn tooling; no runtime subnet allowlist or attacker-facing Address6 parsing found. |
| `brace-expansion` | 6 | Lint/glob/tooling; no public user-controlled glob execution found. |
| `braces` | 1 | Glob/tooling; no public pattern-input path found; audit reports no published patched version. |
| `source-map-js` | 1 | Build/source-map processing; no public indexed-source-map input found. |
| `@modelcontextprotocol/sdk` | 1 | shadcn CLI OAuth tooling; no application MCP/OAuth client path found. |
| `next` | 2 moderate | One affects self-hosted Pages Router SSG/ISR; this is App Router targeting Vercel. The other requires a root catch-all page, absent here. Reassess before hosting/routing changes. |

Next's applicability statements are in [GHSA-4jqv-mc3x-m676](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) and [GHSA-mcj8-r9mp-w47p](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p). Tooling advisories still matter when processing untrusted repositories/assets; they are not dismissed as universally harmless.

## Validation

| Check | Result |
| --- | --- |
| Prisma migration required | **No** — schema/migration files unchanged |
| `pnpm prisma validate` | Passed |
| `pnpm prisma generate` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `node --test tests/*.test.cjs` | **34 passed, 0 failed** |
| Native Sharp smoke test | Passed; Next resolves Sharp 0.35.5 and successfully creates a PNG |
| `pnpm build` | **Blocked**: Geist/Geist Mono downloads from Google Fonts fail in this environment. Build did not reach DB-backed prerendering. |
| `pnpm audit` | Nonzero; 22 findings remain, classified above |
| `git diff --check` | Passed |

Validation used inert local connection placeholders, never a live Supabase database. Prisma's existing cached schema engine was referenced read-only to bypass a sandbox cache-write error. The ignored `next-env.d.ts` type references were restored locally because the fresh checkout omits them; they are not a committed source change. Re-run a complete production build with authorized environment variables and working font downloads.

## Required security test matrix

| Scenario | Evidence / result |
| --- | --- |
| 1. Anonymous cannot call Admin mutations | All exported mutations exercised with real permission helpers; denied before target DB/Storage work |
| 2. Researcher cannot perform Super Admin actions | Reset/status/account/profile deletion tests pass; existing role checks retained |
| 3. Disabled User cannot authenticate | Actual credentials authorize callback rejects disabled account |
| 4. Disabled User with old session cannot operate | JWT callback rejects disabled/deleted accounts; every mutation denies disabled DB account despite stale claims |
| 5. Hidden Person absent from People listing | Active/public Prisma filters tested |
| 6. Non-public profile unavailable publicly | Query requires isPublic; page and metadata return not-found behavior on no result; source review plus query tests |
| 7. Unauthorized password reset | Role denial test passes |
| 8. Unauthorized Storage upload/delete | Anonymous/disabled tests pass; owned-prefix and spoofed MIME/filename tests pass |
| 9. Publication/project authorization | Every mutation denial; publication nonauthor rejection; existing project tests pass |
| 10. Public passwordHash/secret exposure | Public-query/session selections reviewed; session exposure tests pass; researcher read no longer returns hash |
| 11. Malicious input safely rejected | Unsafe schemes, excessive UTF-8 passwords, fake/empty/oversized images, dates, duplicate project relations and Markdown raw HTML tests pass |
| 12. No real current tracked secrets | Heuristic scan and candidate review; historical example classified with your confirmation |

All twelve require a deployed-browser smoke test to verify cookies, redirects, policies and actual integration behavior. Person directory visibility, published profile visibility and login status intentionally remain separate: a former member's published profile may remain reachable while hidden from the directory. Publications/projects have no draft/private fields; all are public by current design. Public profile email/phone are deliberately rendered contact fields, never the authentication User record.

## Manual Supabase / Vercel / GitHub steps and remaining risks

1. **Supabase:** run the existing `scripts/database-security.cjs --audit` and `--verify` against authorized DATABASE_URL/DIRECT_URL configurations. Confirm RLS/revoked anon/authenticated grants on every application table. If checks fail, review the existing SQL before applying it; this audit did not run/apply it. Check exposed views, RPC/security-definer functions and any external integrations separately. Optionally disable unused Data API access.
2. **Supabase Storage:** inspect `researcher-photos` bucket policies. Anonymous and Supabase-authenticated browser clients must not upload/update/delete/list private metadata; NextAuth is a separate identity system. Privileged server writes bypass RLS, so preserve server authorization. Verify bucket type/size restrictions, public-photo intent, and removal behavior.
3. **Vercel:** verify server-only secrets and DATABASE_URL/DIRECT_URL deployment roles; configure login abuse controls, check HTTPS/HSTS and returned headers, and run the build/deployed matrix above. Verify the hosting service's image optimizer uses patched libraries. If monitoring previously used the public DB health endpoint, adjust it for the new Super Admin protection.
4. **GitHub:** review secret-scanning and dependency alerts, remote branches/tags, Actions logs/artifacts and old deployments, which local Git inspection cannot cover. No history rewrite or secret rotation is required based on reviewed evidence and your confirmation.
5. **Deployment behavior:** all existing sessions must sign in again after this patch. Password reset/change invalidates previous tokens; test first-login change and reset in two browsers, then disable an already-signed-in account and repeat a direct mutation. Also verify role demotion, deleted accounts and 404 behavior.

No live exploit testing or infrastructure policy verification was performed. Login throttling, Storage/Data API grants, production build, platform image processing and deployment behavior remain outstanding. This report does not certify the repository as fully secure.

## Files changed

Modified existing files and added files are listed below; no files were removed. Changes are authorization/validation/header/dependency fixes, focused cleanup, regression tests and audit artifacts.

```text
.env.example
docs/SECURITY_AUDIT.md
next.config.ts
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
prisma/create-super-admin.ts
prisma/seed.ts
scripts/security-secret-scan.cjs
security-audit-dependencies.json
src/app/(public)/contact/page.tsx
src/app/(public)/join-us/page.tsx
src/app/(public)/people/[slug]/page.tsx
src/app/(public)/people/page.tsx
src/app/api/health/db/route.ts
src/auth.ts
src/features/auth/components/change-password-form.tsx
src/features/auth/password-actions.ts
src/features/people/queries.ts
src/features/people/researcher-actions.ts
src/features/publications/actions.ts
src/features/publications/components/publication-entry.tsx
src/features/publications/components/publication-form.tsx
src/features/publications/queries.ts
src/features/publications/researcher-queries.ts
src/features/researcher/actions.ts
src/features/researcher/queries.ts
src/features/researcher/validations.ts
src/lib/db/prisma.ts
src/lib/permissions/auth.ts
src/lib/validations/alumni.ts
src/lib/validations/image.ts
src/lib/validations/password.ts
src/lib/validations/publications.ts
src/lib/validations/url.ts
src/types/next-auth.d.ts
tests/researcher-account-visibility.test.cjs
tests/security-audit.test.cjs
```
