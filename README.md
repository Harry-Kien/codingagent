# VibeForge

VibeForge is a local-first AI Project Operating System for vibe coding. It turns rough software ideas into structured, exportable project kits for Codex, Cline, Cursor, Claude Code, Gemini CLI, and similar AI coding tools.

The `/` route is the usable builder. The core flow works without API keys through deterministic demo/mock generation, and projects, provider settings, and MCP connections are stored in browser localStorage for the MVP.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Core Routes

- `/` - project intake builder
- `/projects` - local project history
- `/projects/[id]` - generated project cockpit
- `/repo-map` - repo/tool navigator
- `/settings` - AI provider and MCP settings
- `/about` - short product explanation

## App Templates

The generator includes templates for:

- AI video app
- SaaS dashboard
- n8n automation
- Internal business tool
- Content tool
- E-commerce helper

Templates shape MVP scope, stack recommendations, outputs, automation notes, and test plans while preserving the local-first fallback.

## Export Formats

VibeForge exports:

- Full Markdown project kit
- Full JSON project data
- Full ZIP kit with Markdown sections and `project.json`
- Individual section Markdown files
- Codex Pack: `AGENTS.md`, `PROJECT_BRIEF.md`, `TASKS.md`, `TOOLS.md`, `NEXT_ACTIONS.md`, `CODEX_PROMPTS.md`
- Cline Pack: `.clinerules`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md`
- Cursor Pack: `.cursorrules`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md`
- Claude Code Pack: `CLAUDE.md`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md`

## Provider Setup

Provider use is optional. Demo mode works without API keys.

For local provider testing:

1. Open `/settings`.
2. Add an OpenAI-compatible, OpenRouter, Gemini, Anthropic-compatible, Ollama, or custom provider profile.
3. Save the profile locally.
4. Generate a kit from `/`.

MVP warning: provider API keys are stored in browser localStorage. Do not treat localStorage as a production secret vault.

## MCP Setup

Open `/settings` and add MCP connections for IDE/editor, CLI coding agent, GitHub, browser automation, filesystem, database, n8n, or custom servers. Connections are stored locally and can be exported as JSON.

## Supabase Setup

Supabase is planned as the production persistence layer, not a requirement for the local MVP.

Suggested production tables:

- `projects(id, user_id, name, input_json, sections_json, readiness_json, created_at, updated_at)`
- `provider_profiles(id, user_id, name, base_url, models_json)`
- `mcp_connections(id, user_id, name, type, command_or_url, env_json, status)`

Before enabling Supabase in production, add authentication, row-level security policies, server-side provider routes, rate limits, and migration tests.

## Production Setup

For production hardening:

- Keep demo/mock generation available as a fallback.
- Move provider calls to server routes.
- Store secrets in platform environment variables, never in source.
- Add request validation, rate limits, audit logging, and provider budget limits.
- Add Supabase auth and persistence only after the local flow is stable.
- Verify Markdown, JSON, ZIP, and agent-pack exports before release.

## Repo Recommendations

Recommendations are labeled:

- Use now - strong fit for the first build path or agent workflow
- Use later - useful after the validated workflow is working
- Reference only - architecture study only, with license review before reuse
- Avoid for MVP - too much setup, cost, or operational risk for the first version

VibeForge recommends repositories and tools only. It does not auto-clone external repos or execute user-supplied code.

## Safety

- No hardcoded API keys.
- Demo mode works without external providers.
- External repositories are recommended as install, external tool, import workflow, or reference-only; they are not auto-cloned.
- Local API key storage is clearly marked as MVP-only.
