-- ============================================================================
-- VibeForge Production Hardening: RLS, Data API grants, and private functions
-- Run after 001_initial_schema.sql and 002_production_provider_vault.sql.
--
-- Supabase note:
-- New SQL-created tables may need explicit GRANTs before they are available
-- through the Data API. RLS still controls row access after table access is
-- granted. This migration grants authenticated access only and keeps anon out.
-- ============================================================================

-- Keep privileged helper functions out of the exposed public schema.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon;
REVOKE ALL ON SCHEMA private FROM authenticated;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

DROP FUNCTION IF EXISTS public.handle_new_user();

-- Explicit Data API table privileges. RLS policies remain the source of truth
-- for which rows authenticated users can access.
REVOKE ALL ON TABLE
  public.profiles,
  public.projects,
  public.project_versions,
  public.provider_profiles,
  public.mcp_connections,
  public.generation_logs
FROM anon;

GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.project_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.provider_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mcp_connections TO authenticated;
GRANT SELECT ON TABLE public.generation_logs TO authenticated;

-- Generation logs are server-inserted only. Keep direct client inserts blocked.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.generation_logs FROM authenticated;

-- Ensure RLS remains enabled after grant changes.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- Basic indexes for production list/read paths.
CREATE INDEX IF NOT EXISTS idx_projects_user_updated_at ON public.projects(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_updated_at ON public.provider_profiles(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_connections_user_updated_at ON public.mcp_connections(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_created_at ON public.generation_logs(user_id, created_at DESC);

-- Documentation marker used by production hardening checks:
-- Data API grants are authenticated-only; anon remains revoked.
