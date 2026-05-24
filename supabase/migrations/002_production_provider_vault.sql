-- ============================================================================
-- VibeForge Production Hardening: Provider Vault + Generation Logs
-- Run after 001_initial_schema.sql.
-- ============================================================================

-- Keep newer ProjectKit metadata in cloud sync.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS section_meta_json JSONB,
  ADD COLUMN IF NOT EXISTS generation_json JSONB;

-- Store provider keys only as encrypted server-side fields.
-- The app decrypts these only from trusted route handlers using
-- VIBEFORGE_PROVIDER_KEY_SECRET and the Supabase service role key.
ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS api_key_ciphertext TEXT,
  ADD COLUMN IF NOT EXISTS api_key_iv TEXT,
  ADD COLUMN IF NOT EXISTS api_key_tag TEXT,
  ADD COLUMN IF NOT EXISTS api_key_hint TEXT,
  ADD COLUMN IF NOT EXISTS last_tested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_test_status TEXT;

CREATE TABLE IF NOT EXISTS generation_logs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id          TEXT,
  route               TEXT NOT NULL,
  provider_profile_id TEXT,
  provider_name       TEXT,
  model               TEXT,
  generation_mode     TEXT,
  status              TEXT NOT NULL,
  source              TEXT NOT NULL,
  error_message       TEXT,
  started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms         INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id ON generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_project_id ON generation_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON generation_logs(created_at DESC);

ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "generation_logs_select_own"
  ON generation_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Inserts are performed by server routes with the service role key.
-- No client INSERT policy is intentionally provided.

-- Security notes:
-- 1. Never expose SUPABASE_SERVICE_ROLE_KEY or VIBEFORGE_PROVIDER_KEY_SECRET
--    to NEXT_PUBLIC_* variables.
-- 2. Rotate VIBEFORGE_PROVIDER_KEY_SECRET only with a re-encryption plan.
-- 3. Treat inline browser provider keys as local-first fallback, not the
--    recommended production path.
