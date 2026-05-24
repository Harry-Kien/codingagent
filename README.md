# VibeForge

VibeForge is a local-first AI Project Operating System for vibe coding. It turns rough software ideas into structured, exportable project kits for Codex, Cline, Cursor, Claude Code, Gemini CLI, and similar AI coding tools.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works without API keys through deterministic demo/mock generation. Provider settings and MCP connections are stored in browser localStorage for the MVP.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Core Routes

- `/` - project intake builder
- `/projects` - project history (local or cloud)
- `/projects/[id]` - generated project cockpit
- `/repo-map` - repo/tool navigator
- `/settings` - AI provider and MCP settings
- `/about` - short product explanation

## Exported Kit Files

ZIP export includes `PROJECT_BRIEF.md`, `TASKS.md`, `AGENTS.md`, `TOOLS.md`, `REPO_MAP.md`, `DATABASE_SCHEMA.md`, `API_SPEC.md`, `UI_SCREENS.md`, `USER_FLOWS.md`, `TEST_PLAN.md`, `DEPLOYMENT_PLAN.md`, `SECURITY_CHECKLIST.md`, `CODEX_PROMPTS.md`, `LAUNCH_KIT.md`, and `project.json`.

## Local-Only Mode (Default)

VibeForge works fully without Supabase or any cloud service:

- All projects, provider settings, and MCP connections are stored in browser `localStorage`.
- No Supabase env vars needed. No sign-in required.
- Demo generation works without API keys.
- The sidebar shows "Local-only mode" when Supabase is not configured.

## Cloud Sync (Optional — Supabase)

Cloud sync is entirely optional. The app runs fully local without it.

### Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to **Settings → API** and copy your project URL and anon key.
3. Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the SQL migration in the Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

This creates five tables: `profiles`, `projects`, `project_versions`, `provider_profiles`, and `mcp_connections`, all with Row Level Security enabled.

5. Enable the auth providers you want (email/password, GitHub, Google) in **Authentication → Providers**.

### How It Works

| State | Storage | Behavior |
|-------|---------|----------|
| No Supabase env vars | localStorage | Full local-only mode, no auth UI shown |
| Supabase configured, not signed in | localStorage | Auth panel appears in sidebar |
| Supabase configured, signed in | Supabase (cloud) | Projects sync to cloud, local import available |
| Cloud save fails | localStorage fallback | Data is never lost — falls back to local storage |

### Importing Local Projects to Cloud

When you sign in for the first time, the Projects page shows an import panel:
- Lists all projects currently in your browser's localStorage.
- Each project can be imported to the cloud with one click.
- The import checks for duplicate IDs — you cannot import the same project twice.
- Import status is shown per-project: "Imported ✓", "Already in cloud", or "Failed — retry".

### API Key Safety

- **API keys are never stored in the cloud database.** They stay in browser `localStorage` only, even when cloud sync is active.
- The `provider_profiles` SQL table stores model configuration and metadata only — there is explicitly **no `api_key` column**.
- The UI shows a visible warning: "API keys are saved only in your browser's localStorage and are never sent to the cloud."

### RLS (Row Level Security)

All database tables use RLS with `auth.uid() = user_id` policies:
- `profiles` — owner can SELECT and UPDATE their own row.
- `projects` — owner can SELECT, INSERT, UPDATE, DELETE.
- `project_versions` — owner can SELECT, INSERT, DELETE (no UPDATE — append-only).
- `provider_profiles` — owner can SELECT, INSERT, UPDATE, DELETE.
- `mcp_connections` — owner can SELECT, INSERT, UPDATE, DELETE.

No policy allows cross-user access. The anon key has no admin privileges. The service role key should **never** be exposed to the frontend.

## Safety

- No hardcoded API keys or secrets.
- Demo mode works without external providers.
- External repositories are recommended as install, external tool, import workflow, or reference-only; they are not auto-cloned.
- Local API key storage is clearly marked as MVP-only.
- Cloud sync is opt-in and gracefully degrades to local-only.
- Cloud save failures fall back to localStorage — data is never lost.
