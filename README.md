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
- `/projects` - local project history (or cloud when logged in)
- `/projects/[id]` - generated project cockpit
- `/repo-map` - repo/tool navigator
- `/settings` - AI provider and MCP settings
- `/about` - short product explanation

## Exported Kit Files

ZIP export includes `PROJECT_BRIEF.md`, `TASKS.md`, `AGENTS.md`, `TOOLS.md`, `REPO_MAP.md`, `DATABASE_SCHEMA.md`, `API_SPEC.md`, `UI_SCREENS.md`, `USER_FLOWS.md`, `TEST_PLAN.md`, `DEPLOYMENT_PLAN.md`, `SECURITY_CHECKLIST.md`, `CODEX_PROMPTS.md`, `LAUNCH_KIT.md`, and `project.json`.

## Safety

- No hardcoded API keys.
- Demo mode works without external providers.
- External repositories are recommended as install, external tool, import workflow, or reference-only; they are not auto-cloned.
- Local API key storage is clearly marked as MVP-only.
- API keys are **never** stored in Supabase — only in browser localStorage.

## Supabase Cloud Sync (Phase 2)

VibeForge supports optional Supabase integration for cloud sync. When configured, logged-in users can persist projects, provider settings (excluding API keys), and MCP connections to the cloud.

### Local-Only Mode (Default)

The app works fully without Supabase. Leave `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` empty in `.env` and everything stays in browser localStorage.

### Enabling Cloud Sync

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run the SQL migration in `supabase/001_initial_schema.sql` in the Supabase SQL editor.
3. Copy your project URL and anon key to `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server. The sidebar will show sign-in/sign-up options.

### Fallback Behavior

| Condition | Behavior |
|---|---|
| No Supabase env vars | App runs in local-only mode. No auth UI shown. |
| Supabase configured, not logged in | App runs in local-only mode. Auth UI visible. |
| Supabase configured, logged in | Cloud sync active. Projects/settings sync to Supabase. |
| Supabase configured, logged in, sync fails | Falls back to local data. Shows "Sync failed" badge. |

### Data Storage

| Data | Local (localStorage) | Cloud (Supabase) |
|---|---|---|
| Projects | ✅ Always | ✅ When logged in |
| Provider metadata | ✅ Always | ✅ When logged in |
| API keys | ✅ Always | ❌ Never |
| MCP connections | ✅ Always | ✅ When logged in |

### Database Schema

The migration (`supabase/001_initial_schema.sql`) creates:

- **profiles** — user profile linked to auth.users
- **projects** — project kits with JSON columns for sections, favorites, readiness
- **project_versions** — section-level version history
- **provider_profiles** — AI provider config (no API key column)
- **mcp_connections** — MCP/external integration config

All tables have Row Level Security (RLS) enabled. Users can only access their own rows.

### Importing Local Projects

When a user signs in for the first time, they can click "Import local projects to cloud" on the Projects page to migrate their localStorage projects to Supabase.
