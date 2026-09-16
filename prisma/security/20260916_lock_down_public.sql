-- Application-table security only. Never change auth/storage policies here.
-- Run scripts/database-security.cjs --dry-run first, then --apply.
-- Verified deployment: DATABASE_URL and DIRECT_URL both use postgres/BYPASSRLS.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $security$
DECLARE
  targets CONSTANT text[] := ARRAY[
    'User', 'Person', 'ResearcherProfile', 'ResearchArea',
    'PersonResearchArea', 'Publication', 'PublicationAuthor',
    'PublicationResearchArea', 'Project', 'ProjectMember',
    'ProjectResearchArea', 'Dataset', 'DatasetResearchArea',
    'Award', 'News', 'Media', 'SiteSettings', 'LandingPage',
    'LandingPageSection', 'LandingPagePermission', '_prisma_migrations'
  ];
  target text;
  relation_oid oid;
  browser_role text;
BEGIN
  IF current_user <> 'postgres' OR NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = current_user AND rolbypassrls
  ) THEN
    RAISE EXCEPTION 'Expected the verified postgres/BYPASSRLS migration role';
  END IF;

  FOREACH browser_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_roles
      WHERE rolname = browser_role AND NOT rolbypassrls AND NOT rolsuper
    ) THEN
      RAISE EXCEPTION 'Unexpected API-role configuration: %', browser_role;
    END IF;
  END LOOP;

  -- Abort instead of claiming that an unexpected/new table is protected.
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
      AND NOT (c.relname = ANY(targets))
  ) THEN
    RAISE EXCEPTION 'Additional public relations require security review';
  END IF;

  FOREACH target IN ARRAY targets LOOP
    relation_oid := to_regclass(format('public.%I', target));
    IF relation_oid IS NULL OR NOT EXISTS (
      SELECT 1 FROM pg_class c
      WHERE c.oid = relation_oid AND c.relkind = 'r'
        AND pg_get_userbyid(c.relowner) = current_user
        AND NOT c.relforcerowsecurity
    ) THEN
      RAISE EXCEPTION 'Unexpected table, ownership or FORCE RLS: %', target;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = relation_oid) THEN
      RAISE EXCEPTION 'Existing policies require review: %', target;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target);
    EXECUTE format(
      'REVOKE ALL PRIVILEGES ON TABLE public.%I FROM anon, authenticated, PUBLIC', target
    );

    -- Detect inherited/column grants rather than silently leaving a bypass.
    FOREACH browser_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF has_table_privilege(browser_role, relation_oid,
           'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
         OR has_any_column_privilege(browser_role, relation_oid,
           'SELECT,INSERT,UPDATE,REFERENCES') THEN
        RAISE EXCEPTION 'Residual API privileges on % for %', target, browser_role;
      END IF;
    END LOOP;
    IF row_security_active(relation_oid) THEN
      RAISE EXCEPTION 'Migration role would be restricted by RLS on %', target;
    END IF;
  END LOOP;
END;
$security$;

-- Prevent automatic browser grants on future objects created by Prisma's role.
-- This does not enable RLS on future tables: update the allowlist and rerun.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated, PUBLIC;

COMMIT;
