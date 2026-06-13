# VibeForge — AI Project OS for Vibe Coding

> Turn rough app ideas into complete, AI-buildable project kits. Export structured files for Codex, Cline, Cursor, Claude Code, and Gemini CLI.

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#scripts)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](#tech-stack)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

---

## What is VibeForge?

VibeForge is a local-first AI project operating system. You describe an app idea in plain language, and VibeForge generates a structured project kit with exportable sections covering product brief, target users, core flow, scope, architecture, data models, UI screens, implementation tasks, tests, risks, launch notes, and coding-agent prompts.

**Core workflow:**

```
Rough idea → Builder intake → Clarification → Kit generation → Section editing → Export → Hand to AI agent
```

Works entirely in demo mode without API keys. Optionally connects to OpenAI, Gemini, Anthropic, Ollama, or any OpenAI-compatible provider for richer generation. MVP provider keys can stay local; production deployments can use an encrypted server-side provider vault.

---

## Current Product Surface

- `/` - usable builder and create task/run flow.
- `/dashboard` - launch cockpit with latest run, product flow, and demo checklist.
- `/projects` - project/repo management history.
- `/projects/[id]` - result/report view with agent plan tabs, quality checks, section editing, copy, regenerate, and exports.
- `/repo-map` - curated/live repo map viewer with reference-only policy.
- `/agent-kit` - eight agent roles: Code Reviewer, Bug Fixer, UI Builder, Repo Mapper, Test Writer, Documentation, Deployment, and Product Manager.
- `/settings` - production readiness, server-provider test, local provider settings, and MCP connection planner.

Required launch docs are maintained in `PRODUCT_AUDIT.md`, `PRODUCT_STRUCTURE.md`, `REPO_MAP.md`, `repo-map.json`, `AGENT_KIT.md`, `MEMORY_DESIGN.md`, `ROADMAP.md`, `UPGRADE_REPORT.md`, and `DEPLOY_REPORT.md`.

---

## Vibe Coding Output Quality

VibeForge is designed to produce more than a generic AI answer. Each generated kit should give builders and coding agents:

- Product requirements tied to the user's exact input
- MVP scope with build-first and do-not-build-yet boundaries
- Architecture notes for frontend, backend, storage, provider layer, auth, deployment, and risks
- Task plans with phases, file paths, acceptance criteria, and test commands
- Repo references as URLs only, with instructions for how an AI agent should use them
- `AI_HANDOFF.md` as the single upload-ready brief for Codex, Cline, Cursor, Claude Code, or another AI coding agent
- Prompt packs for Codex, Cline, Cursor, Claude Code, section regeneration, and security review
- Exportable Markdown files that can be dropped into another coding-agent workflow

### Repo reference policy

Repo references are inspiration and implementation guidance only. VibeForge does not clone external repos, run code from external repos, or copy source code into your project. If a user's idea does not strongly match the built-in repo map, the generated `REPO_REFERENCES.md` includes GitHub search URLs based on the app type, desired output, and stack so the agent can inspect likely references safely.

Use repo URLs to study README files, architecture patterns, package choices, and workflow ideas. Clone or reuse code only after explicit user approval and license review.

---

## Features

| Category | Details |
|---|---|
| **20 Kit Sections** | Product strategy, MVP scope, roadmap, stack, repo map, AI plan, database, API spec, UI screens, user flows, agent rules, AI handoff, tasks, implementation phases, next actions, tests, deployment, security, launch kit, Codex/Cline prompts |
| **4 Agent Export Packs** | Codex, Cline, Cursor, Claude Code — each includes the right files for that agent's workflow |
| **Domain Templates & Presets** | AI video, SaaS dashboard, n8n automation, internal tool, content tool, e-commerce, education, clinic, local business, marketplace, freelancer CRM, habit tracker mobile, and custom web apps |
| **Multi-Provider AI** | OpenAI-compatible, OpenRouter, Gemini, Anthropic, Ollama, custom endpoints |
| **Demo Mode** | Full deterministic generation without any API keys |
| **Section Workspace** | Edit sections inline, track status (Draft/Approved/Needs review), version history |
| **Cloud Sync** | Optional Supabase integration with RLS-secured storage |
| **MCP Registry** | Configure IDE, CLI agent, GitHub, browser, filesystem, database, n8n connections |
| **Export Formats** | Markdown, JSON, ZIP, individual sections, agent-specific packs |
| **Readiness Score** | 6-dimension project readiness assessment |
| **Repo Navigator** | Curated tool/repo catalog with search, filters, and agent prompts |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Icons:** lucide-react
- **Forms:** React Hook Form + Zod validation
- **Storage:** localStorage (default), Supabase (optional cloud)
- **Export:** JSZip for ZIP downloads
- **Testing:** Playwright E2E
- **Auth:** Supabase Auth (optional)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── generate-kit/   # POST — full kit generation
│   │   ├── regenerate-section/  # POST — single section regeneration
│   │   ├── improve-section/     # POST — section improvement with instruction
│   │   └── health/         # GET — health check
│   ├── projects/           # Project history + detail pages
│   ├── repo-map/           # Tool/repo navigator
│   ├── settings/           # Provider & MCP configuration
│   ├── about/              # About page
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Badge, etc.)
│   ├── app/                # AppShell (sidebar + mobile nav)
│   ├── auth/               # AuthPanel, SyncStatusBadge
│   ├── builder/            # BuilderForm (project intake)
│   ├── kit/                # ProjectKitTabs, MarkdownSection, ReadinessScore
│   ├── history/            # ProjectHistoryList
│   ├── repo/               # RepoRecommendationPanel, RepoCard
│   └── settings/           # ProviderSettingsForm, McpConnectionCard
├── lib/
│   ├── generator.ts        # Client-side kit generation (demo mode)
│   ├── server-generator.ts # Server-side AI provider generation
│   ├── generation-client.ts # Client → server API caller
│   ├── validation.ts       # Zod schemas for all inputs/outputs
│   ├── rate-limit.ts       # In-memory rate limiter
│   ├── export.ts           # Markdown/JSON/ZIP/agent-pack exports
│   ├── kit-sections.ts     # Section definitions + agent pack configs
│   ├── section-workspace.ts # Section status tracking + version history
│   ├── storage.ts          # localStorage helpers
│   ├── use-project-store.ts # Unified store (local ↔ cloud)
│   ├── cloud-store.ts      # Supabase CRUD operations
│   ├── auth-context.tsx    # Auth state management
│   ├── supabase-client.ts  # Supabase browser client
│   ├── repo-data.ts        # Curated repo/tool catalog
│   ├── templates.ts        # App-type templates
│   └── utils.ts            # Shared utilities
└── types/
    └── vibeforge.ts        # All TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/Harry-Kien/codingagent.git
cd codingagent
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

**All variables are optional.** The app works fully in demo mode without any configuration.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL (enables cloud sync) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Server-only key for provider vault and generation logs |
| `VIBEFORGE_PROVIDER_KEY_SECRET` | Production only | Server-only encryption secret for provider API keys |
| `VIBEFORGE_REDIS_REST_URL` | Production only | Redis/Upstash REST URL for durable rate limiting |
| `VIBEFORGE_REDIS_REST_TOKEN` | Production only | Redis/Upstash REST token |
| `ERROR_WEBHOOK_URL` | Production only | Optional error monitoring webhook |

> Provider API keys configured through the Settings page still work as a local-first fallback. For production, store keys through the server-side provider vault and never expose service keys or encryption secrets through `NEXT_PUBLIC_*` variables.

---

## Demo / Mock Mode

VibeForge works without any API keys. Demo mode generates deterministic project kits using built-in templates, domain presets, project type detection, rule-based enrichment, repo recommendations, and structured section validation. This is the default behavior when no provider is configured.

To try it:
1. Open the Builder (`/`)
2. Click **"Load AI video sample"** or type your own idea, such as `local CRM for freelancers` or `habit tracker mobile app`
3. Click **"Generate project kit"**
4. Browse sections, export files, and explore the project cockpit

---

## AI Provider Setup

1. Go to **Settings** (`/settings`)
2. Click **"Add provider"**
3. Configure:
   - **Provider type**: OpenAI-compatible, OpenRouter, Gemini, Anthropic, or Ollama
   - **Base URL**: The provider's API endpoint
   - **API key**: Your key (local-first fallback; production should use the server-side vault)
   - **Model**: Default, cheap, strong, and vision models
4. Enable the provider
5. New kit generations will use the server-side route (`/api/generate-kit`)
6. Use **Settings -> Production readiness -> Test server provider** to confirm the production server provider works before relying on AI Provider Mode.

### Supported Providers

| Provider | Base URL | Notes |
|---|---|---|
| OpenRouter | `https://openrouter.ai/api/v1` | Many models, pay-per-token |
| OpenAI | `https://api.openai.com/v1` | GPT-4, GPT-3.5 |
| Gemini | `https://generativelanguage.googleapis.com/v1beta` | Google AI Studio |
| Anthropic | `https://api.anthropic.com/v1` | Claude models |
| Ollama | `http://localhost:11434` | Local, no API key needed |

---

## Supabase Setup (Optional)

For cloud sync and authentication:

1. Create a Supabase project
2. Run the migrations: `supabase/migrations/001_initial_schema.sql` and `supabase/migrations/002_production_provider_vault.sql`
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
4. Restart the dev server

The app automatically detects Supabase and shows login/sync options.

## Production Setup & Production Readiness Checklist

Production setup is the required hardening path before deploying VibeForge for public beta or shared team usage.

Deploying VibeForge to production for public beta users requires hardening the system against resource limits, multi-instance scaling, and API rate limits. Follow this production checklist:

### 1. Multi-Instance Rate Limiting (Redis Abstraction)
The default in-memory rate limiter tracks requests in-memory per server process, which is insufficient for multi-instance load-balanced production clusters (like Vercel, AWS ECS, or Kubernetes).
*   **Action**: Set the following environment variables to activate the zero-dependency Upstash/Redis HTTP rate limiter:
    ```env
    VIBEFORGE_REDIS_REST_URL=https://your-upstash-redis-rest-url.com
    VIBEFORGE_REDIS_REST_TOKEN=your-upstash-redis-rest-token
    ```
*   **Benefit**: Request limits are synchronized globally across all server instances, preventing API abuse while maintaining a fast, zero-dependency offline fallback if Redis goes down.

### 2. OpenRouter Default Server Provider Setup
For public beta deployments, you can configure a default server-side provider via env so users can use the generation engine instantly without putting in their own keys:
*   **Action**: Add these variables to your server environment:
    ```env
    VIBEFORGE_OPENROUTER_API_KEY=sk-or-v1-your-key
    VIBEFORGE_OPENROUTER_PROVIDER_NAME=OpenRouter
    VIBEFORGE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
    VIBEFORGE_OPENROUTER_DEFAULT_MODEL=moonshotai/kimi-k2.6:free
    VIBEFORGE_OPENROUTER_CHEAP_MODEL=openrouter/free
    VIBEFORGE_OPENROUTER_STRONG_MODEL=moonshotai/kimi-k2.6:free
    VIBEFORGE_OPENROUTER_TOKEN_LIMIT=12000
    VIBEFORGE_OPENROUTER_TEMPERATURE=0.4
    NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_ENABLED=true
    NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_NAME=OpenRouter
    NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_MODEL=kimi-k2.6:free
    ```
*   **Security**: The `VIBEFORGE_OPENROUTER_API_KEY` stays strictly on the server-side and is never exposed to the client.

### 3. Asynchronous Job Polling Scaffold
Deep planning generations can exceed standard serverless function timeout limits (10s on Vercel Hobby, 60s on Pro).
*   **Action**: Utilize the async polling queue API scaffolded at `/api/generation-job`. For full production:
    1.  Replace the mock in-memory job store with Upstash Redis or a PostgreSQL job table.
    2.  Spawn background worker processes (e.g., BullMQ, Inngest, or Trigger.dev) to perform the kit generation.
    3.  Update the frontend UI to poll `/api/generation-job?jobId=...` dynamically.

### 4. Supabase Secure Vault & RLS Rules
If enabling user database provider profiles:
*   **Action**: Run both Supabase migrations: `supabase/migrations/001_initial_schema.sql` and `supabase/migrations/002_production_provider_vault.sql`.
*   **Encryption**: Set `VIBEFORGE_PROVIDER_KEY_SECRET` to a cryptographically secure 32-character key for AES-256-GCM encryption of user keys.
*   **Safety**: Ensure Supabase Row Level Security (RLS) is enabled on `provider_profiles` and `projects` tables so users can only fetch their own files.

### Production Provider Vault

For production, add these server-only variables:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VIBEFORGE_PROVIDER_KEY_SECRET=at-least-32-random-characters
```

Route handlers can resolve a saved `providerProfileId` for the signed-in user, decrypt the API key server-side, call the provider, and write a row to `generation_logs`. Browser-submitted provider keys remain available for local-first usage, but the vault path is the production-safe option.

### Provider Profiles

Provider profiles are owner-scoped with Supabase RLS. Production profiles store provider metadata plus encrypted key fields (`api_key_ciphertext`, `api_key_iv`, `api_key_tag`, `api_key_hint`). The decrypted API key is never returned to the browser; it is used inside route handlers only.

### Generation logs

`generation_logs` records route, provider, model, generation mode, source, status, error message, timestamps, and duration. This gives you a production audit trail for cost, failures, and model behavior.

Provider error text is redacted before logs are written. Do not put provider keys in prompts, generated content, project names, or support messages.

### Rate limiting

Generation and provider-test routes use per-IP in-memory rate limiting and return `Retry-After` when throttled. For multi-region production, configure Redis/Upstash REST env vars so request limits are shared across instances. Redis keys are URL-encoded and Redis REST calls have timeout boundaries; if Redis is unavailable, VibeForge falls back to the in-memory limiter.

### Production readiness panel

Open `/settings` and review **Production readiness** before public rollout. The panel checks:

- AI provider env presence
- Provider vault env readiness
- Durable Redis/Upstash rate limiting
- External monitoring env
- Supabase browser/admin configuration
- Analytics and secret exposure guards

Use **Test server provider** whenever provider env vars change. A configured key is not enough; the provider must accept the key and model.

---

## MCP Registry

The Settings page includes an MCP (Model Context Protocol) connection registry. You can configure connections for:

- IDE / editor (VS Code, Cursor)
- CLI coding agents (Codex, Claude Code)
- GitHub
- Browser automation
- Filesystem
- Database
- n8n
- Custom MCP servers

These are stored locally and exported with your project kit.

---

## Export Formats

| Format | Description |
|---|---|
| **Markdown** | All sections as a single `.md` file |
| **JSON** | Full project data as `.json` |
| **ZIP** | Each section as a separate `.md` file in a ZIP archive, including `AI_HANDOFF.md` |
| **Codex Pack** | `AGENTS.md`, `PROJECT_BRIEF.md`, `PRODUCT_REQUIREMENTS.md`, `TASKS.md`, `REPO_REFERENCES.md`, `IMPLEMENTATION_PHASES.md`, `TEST_PLAN.md`, `SECURITY_CHECKLIST.md`, `AI_HANDOFF.md`, `NEXT_ACTIONS.md`, `VIBE_CODING_PROMPTS.md`, `CODEX_PROMPTS.md` |
| **Cline Pack** | `.clinerules`, `PROJECT_BRIEF.md`, `PRODUCT_REQUIREMENTS.md`, `TASKS.md`, `REPO_REFERENCES.md`, `AI_HANDOFF.md`, `NEXT_ACTIONS.md`, `VIBE_CODING_PROMPTS.md` |
| **Cursor Pack** | `.cursorrules`, `PROJECT_BRIEF.md`, `PRODUCT_REQUIREMENTS.md`, `TASKS.md`, `REPO_REFERENCES.md`, `AI_HANDOFF.md`, `NEXT_ACTIONS.md`, `VIBE_CODING_PROMPTS.md` |
| **Claude Code Pack** | `CLAUDE.md`, `PROJECT_BRIEF.md`, `PRODUCT_REQUIREMENTS.md`, `TASKS.md`, `REPO_REFERENCES.md`, `AI_HANDOFF.md`, `NEXT_ACTIONS.md`, `VIBE_CODING_PROMPTS.md` |

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run check:product` | Product integrity checks (sections, templates, repo count, quality markers) |
| `npm run check:exports` | Export pack verification (all packs, file mappings, quality terms) |
| `npm run check:sample-output` | Sample project-kit output verification across common ideas |
| `npm run check:production` | Production hardening checks (vault, logs, rate limits, secrets) |
| `npm run check:api-flows` | API flow verification against `VIBEFORGE_API_BASE_URL` |
| `npm run check:production-readiness` | Calls `/api/production-readiness` for deployment readiness |
| `npm run check:vercel-env` | Inspects Vercel production env names |
| `npm run check:launch` | Launch readiness verification |

---

## Testing

### E2E Tests (Playwright)

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run tests
npm run test:e2e

# Run with UI
npx playwright test --ui
```

Tests cover:
- Builder form rendering and interaction
- Kit generation (demo mode)
- Project detail tabs, exports, readiness score
- Project history (save + reopen)
- Repo map filtering
- Settings page
- API health check
- Navigation (no crashes on any route)

### How to run checks

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd run check:product
npm.cmd run check:exports
npm.cmd run check:production
npm.cmd run check:sample-output
npm.cmd run check:api-flows
npm.cmd run test:e2e -- --list
npm.cmd run test:e2e
```

---

## Deployment

### Vercel (Recommended)

```bash
npx.cmd vercel deploy --prod --yes
```

Set environment variables in the Vercel dashboard if using Supabase.

### Production audit checklist

Before promoting production, run:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run check:product
npm.cmd run check:exports
npm.cmd run check:sample-output
```

After deploy, verify `https://vibeforge-seven.vercel.app/` in a real browser across desktop, tablet, and mobile. Check the root builder, project generation in demo mode, project history, Markdown/JSON/ZIP exports, section copy/regeneration, settings persistence, MCP connections, repo recommendations for an AI video app, console errors, and network failures.

If AI Provider Mode must be production-ready, run:

```powershell
$env:VIBEFORGE_API_BASE_URL="https://vibeforge-seven.vercel.app"
$env:VIBEFORGE_REQUIRE_PROVIDER="1"
npm.cmd run check:api-flows
```

This intentionally fails when the production provider key/model is invalid, even if Local/Demo Mode is healthy.

### Docker

```bash
docker build -t vibeforge .
docker run -p 3000:3000 vibeforge
```

### Self-hosted

```bash
npm run build
npm start
```

---

## Security

- **API keys** can stay in browser `localStorage` for local-first fallback. Production should use encrypted server-side provider profiles.
- **Supabase RLS** policies ensure users can only access their own projects.
- **Input validation** uses Zod schemas on all API routes.
- **Rate limiting** protects API routes from abuse (in-memory, per-IP).
- **Generation logs** track provider, model, mode, status, and redacted errors for production observability.
- **Monitoring payloads** redact secret-like text before webhook delivery.
- **No hardcoded secrets** in the codebase.
- **URL sanitization** prevents SSRF in provider configurations.

---

## Roadmap

- [ ] Dark mode
- [ ] Real-time collaboration
- [ ] Version diff viewer
- [ ] Template marketplace
- [ ] Team workspaces
- [ ] OpenAPI spec for API routes
- [ ] Webhook notifications
- [ ] Plugin system for custom sections

---

## License

MIT
