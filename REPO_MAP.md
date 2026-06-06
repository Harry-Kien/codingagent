# VibeForge Repo Map

Updated: 2026-06-05

## Summary

VibeForge is a local-first Next.js App Router app that turns a rough product idea into exportable AI-coding project kits. The root route (`/`) is the builder experience, not a landing page. The core path must keep working without API keys, accounts, Supabase, or external repo cloning.

## Runtime And Scripts

- Framework: Next.js 16.1.6, React 19.2.4, TypeScript strict mode.
- Package manager: npm with `package-lock.json`.
- Main scripts:
  - `npm.cmd run dev`
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - `npm.cmd run check:product`
  - `npm.cmd run check:exports`
  - `npm.cmd run check:sample-output`
  - `npm.cmd run check:api-flows`
  - `npm.cmd run check:production`
  - `npm.cmd run test:e2e`

## Main Routes

- `/`: usable builder powered by `src/components/builder/BuilderForm.tsx`.
- `/dashboard`: launch cockpit with latest run, normalized flow, readiness checklist, and CTAs.
- `/projects`: saved kit history from browser storage or cloud storage.
- `/projects/[id]`: kit cockpit with section tabs, quality checks, exports, repo recommendations, copy, improve, and regenerate actions.
- `/repo-map`: curated and live repo/tool navigator with filters and no-clone policy.
- `/agent-kit`: role-specific coding agent catalog and copy-ready prompts.
- `/settings`: local provider settings and MCP connection registry.
- `/about`: product explanation and feature overview.

`repo-map.json` mirrors this map in machine-readable form for agent handoff.

## API Routes

- `src/app/api/health/route.ts`: health and configuration status.
- `src/app/api/generate-kit/route.ts`: full kit generation, rate limiting, provider resolution, logging, demo fallback.
- `src/app/api/regenerate-section/route.ts`: section regeneration.
- `src/app/api/improve-section/route.ts`: section improvement.
- `src/app/api/test-provider/route.ts`: provider connectivity check.
- `src/app/api/trending-repos/route.ts`: GitHub trend lookup with local curated fallback behavior.
- `src/app/api/provider-profiles/*`: server-side provider profile CRUD.
- `src/app/api/generation-job/route.ts`: async generation job surface.

## Component Areas

- `src/components/app/AppShell.tsx`: desktop sidebar, mobile nav, auth wrapper, sync/provider status.
- `src/components/builder/*`: builder form, templates, quick start panel.
- `src/components/kit/*`: project detail cockpit, tabs, markdown section editor, readiness score, post-generate CTA, start-build panel.
- `src/components/history/ProjectHistoryList.tsx`: saved project list, duplicate/delete/export/import.
- `src/components/repo/*`: repo recommendation cards and panels.
- `src/components/settings/*`: provider and MCP forms.
- `src/components/ui/*`: local shadcn-style primitives.

## Core Libraries

- `src/lib/generator-shared.ts`: deterministic demo generator, project naming, sections, readiness.
- `src/lib/server-generator.ts`: provider-backed generation and provider output validation.
- `src/lib/generation-client.ts`: client API calls with timeout protection and fallback-friendly errors.
- `src/lib/project-profile.ts`: app-template/domain inference.
- `src/lib/templates.ts`: app templates and aliases.
- `src/lib/repo-data.ts`: curated URL-only repo/tool catalog.
- `src/lib/export-core.ts` and `src/lib/export.ts`: Markdown, JSON, ZIP, section, quality report, and agent pack exports.
- `src/lib/storage.ts`: localStorage persistence.
- `src/lib/use-project-store.ts`: local/cloud storage abstraction.
- `src/lib/cloud-store.ts`: Supabase storage.
- `src/lib/provider-vault.ts`: server-side provider profile resolution.
- `src/lib/validation.ts`: Zod schemas for route and kit validation.

## Data Models

- `ProjectInput`: user idea, audience, constraints, stack, providers, MCP/automation flags.
- `ProjectKit`: generated kit with sections, readiness, recommendations, metadata, timestamps.
- `SectionWorkspaceState`: status and history per generated section.
- `ProviderSettings`: optional local/provider profile config. Do not hardcode real keys.
- `McpConnection`: local/cloud MCP integration notes.

## Risk Areas

- Provider generation can be slow or fail; demo fallback and bounded client requests must remain intact.
- Project/domain inference can leak adjacent template language; sample-output checks should cover AI video, content planner, English learning, booking, and inventory cases.
- Export buttons appear in multiple sections; accessible names should stay unique enough for users and browser tests.
- Local/cloud sync must never drop local projects when Supabase or auth fails.
- Repo references must stay URL-only. Do not add auto-clone behavior or user-supplied code execution.
- `.env.local`, provider keys, Supabase service role keys, and Vercel tokens must never be committed.

## Improvement Backlog

- Add a visible provider-timeout state when provider mode falls back to demo.
- Add search/filter controls to `/projects` once history grows.
- Add a compact import/export bundle for moving local projects between browsers.
- Add more Playwright assertions for mobile menu, settings persistence, and repo filter combinations.
