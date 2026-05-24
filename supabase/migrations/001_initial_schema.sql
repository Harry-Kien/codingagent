-- ============================================================================
-- VibeForge Phase 2: Supabase Schema + RLS Policies
-- Run this in the Supabase SQL Editor to set up the database.
-- ============================================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. User profiles (auto-created on sign-up via trigger)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  display_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only create the trigger if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Projects table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  input_json      JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections_json   JSONB NOT NULL DEFAULT '{}'::jsonb,
  favorites_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  repo_recommendations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  readiness_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_opened_at  TIMESTAMPTZ
);

-- Index for listing projects by user
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Owner-only: SELECT
CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Owner-only: INSERT
CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner-only: UPDATE
CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner-only: DELETE
CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Project versions table (snapshots on meaningful changes only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sections_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  label       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_user_id ON project_versions(user_id);

-- RLS
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "versions_select_own"
  ON project_versions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "versions_insert_own"
  ON project_versions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "versions_delete_own"
  ON project_versions FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Provider profiles (metadata only — API keys are NEVER stored here)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provider_profiles (
  id              TEXT PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_name   TEXT NOT NULL DEFAULT '',
  provider_type   TEXT NOT NULL DEFAULT 'openrouter',
  base_url        TEXT NOT NULL DEFAULT '',
  default_model   TEXT NOT NULL DEFAULT '',
  cheap_model     TEXT NOT NULL DEFAULT '',
  strong_model    TEXT NOT NULL DEFAULT '',
  vision_model    TEXT NOT NULL DEFAULT '',
  max_budget      NUMERIC NOT NULL DEFAULT 0.5,
  temperature     NUMERIC NOT NULL DEFAULT 0.4,
  token_limit     INTEGER NOT NULL DEFAULT 6000,
  enabled         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  -- NOTE: There is NO api_key column. API keys stay in localStorage only.
);

CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);

ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "provider_profiles_select_own"
  ON provider_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "provider_profiles_insert_own"
  ON provider_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "provider_profiles_update_own"
  ON provider_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "provider_profiles_delete_own"
  ON provider_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. MCP connections table (optional cloud storage)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mcp_connections (
  id              TEXT PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  type            TEXT NOT NULL DEFAULT 'Custom MCP server',
  command_or_url  TEXT NOT NULL DEFAULT '',
  env_vars        TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'Not configured',
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_connections_user_id ON mcp_connections(user_id);

ALTER TABLE mcp_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mcp_select_own"
  ON mcp_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "mcp_insert_own"
  ON mcp_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mcp_update_own"
  ON mcp_connections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mcp_delete_own"
  ON mcp_connections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- IMPORTANT SECURITY NOTES:
--
-- 1. API keys (ProviderSettings.apiKey) are NEVER stored in this database.
--    They remain in browser localStorage only. The provider_profiles table
--    stores model configuration and metadata only.
--
-- 2. All tables use RLS with auth.uid() = user_id (or id) policies.
--    Users can only access their own data.
--
-- 3. The anon key used by the browser client has no admin privileges.
--    Service role key should NEVER be exposed to the frontend.
--
-- 4. project_versions are append-only from the client perspective.
--    Only SELECT, INSERT, DELETE are allowed (no UPDATE).
--
-- 5. The profiles table is auto-populated via a trigger on auth.users insert.
--    No manual insert policy is needed; the trigger runs as SECURITY DEFINER.
-- ============================================================================
