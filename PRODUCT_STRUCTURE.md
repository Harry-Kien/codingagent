# Product Structure

## Product Routes

| Route | Purpose | Key Files |
|---|---|---|
| `/` | Usable builder for creating a project kit. This must not become a marketing-only landing page. | `src/app/page.tsx`, `src/components/builder/BuilderForm.tsx` |
| `/dashboard` | Launch cockpit for flow, latest run, readiness checklist, and CTAs. | `src/app/dashboard/page.tsx` |
| `/projects` | Project/repo management history with open, duplicate, delete, and ZIP export actions. | `src/app/projects/page.tsx`, `src/components/history/ProjectHistoryList.tsx` |
| `/projects/[id]` | Result/report view with agent plan tabs, quality checklist, repo recommendations, and exports. | `src/app/projects/[id]/page.tsx`, `src/components/kit/ProjectDetailClient.tsx` |
| `/repo-map` | Repo/tool navigator with curated and live GitHub trend references. | `src/app/repo-map/page.tsx`, `src/lib/repo-data.ts` |
| `/agent-kit` | Role catalog for coding agents and copy-ready prompts. | `src/app/agent-kit/page.tsx`, `src/lib/agent-kit.ts` |
| `/settings` | Provider profiles and MCP/external connection settings. | `src/app/settings/page.tsx`, `src/components/settings/*` |
| `/about` | Product explanation and constraints. | `src/app/about/page.tsx` |

## Core Data Flow

1. User enters an idea in the Builder.
2. `BuilderForm` validates input with Zod and React Hook Form.
3. Demo mode calls `generateProjectKit` and `generateMockKit`; provider mode calls server generation first and falls back to demo.
4. `ProjectKit` is saved through `useProjectStore`, using localStorage by default and cloud storage when authenticated.
5. Project detail opens from `/projects/[id]`.
6. Users review sections in tabs, copy, edit, approve, regenerate, improve, and export.
7. Exports are generated from `src/lib/export.ts` and `src/lib/export-core.ts`.

## API Surface

| API | Purpose |
|---|---|
| `GET /api/health` | Runtime health, provider/database configuration hints without secrets. |
| `POST /api/generate-kit` | Server/provider-backed kit generation with validation and fallback handling. |
| `POST /api/regenerate-section` | Regenerate one section. |
| `POST /api/improve-section` | Improve one section with provider or local fallback. |
| `POST /api/test-provider` | Validate provider settings. |
| `GET/POST /api/provider-profiles` | Manage server-side provider vault profiles. |
| `PATCH/DELETE /api/provider-profiles/[id]` | Update/delete provider vault profiles. |
| `GET/POST /api/generation-job` | Generation job status/path support. |
| `GET /api/trending-repos` | Live GitHub trend data for repo map. |

## Product Screens Required For Demo

- Landing/builder: `/`
- Dashboard: `/dashboard`
- Project/repo management: `/projects`
- Repo Map Viewer: `/repo-map`
- Agent Kit: `/agent-kit`
- Create task/run: builder submit
- Agent plan: `TASKS.md`, `AI_HANDOFF.md`, `IMPLEMENTATION_PHASES.md` tabs
- Agent execution log: section version history and quality checklist
- Result/report: project detail, readiness score, export buttons
- Settings: `/settings`
