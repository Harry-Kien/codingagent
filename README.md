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
- `/projects` - local project history
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
