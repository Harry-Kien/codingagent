# VibeForge — AI Project OS for Vibe Coding

> Turn rough app ideas into complete, AI-buildable project kits. Export structured files for Codex, Cline, Cursor, Claude Code, and Gemini CLI.

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#scripts)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](#tech-stack)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

---

## What is VibeForge?

VibeForge is a local-first AI project operating system. You describe an app idea in plain language, and VibeForge generates a structured project kit — 18 exportable sections covering strategy, architecture, tasks, security, deployment, and coding agent prompts.

**Core workflow:**

```
Rough idea → Builder intake → Clarification → Kit generation → Section editing → Export → Hand to AI agent
```

Works entirely in demo mode without API keys. Optionally connects to OpenAI, Gemini, Anthropic, Ollama, or any OpenAI-compatible provider for richer generation. MVP provider keys can stay local; production deployments can use an encrypted server-side provider vault.

---

## Features

| Category | Details |
|---|---|
| **18 Kit Sections** | Product strategy, MVP scope, roadmap, stack, repo map, AI plan, database, API spec, UI screens, user flows, agent rules, tasks, next actions, tests, deployment, security, launch kit, Codex/Cline prompts |
| **4 Agent Export Packs** | Codex, Cline, Cursor, Claude Code — each includes the right files for that agent's workflow |
| **6 App Templates** | AI video, SaaS dashboard, n8n automation, internal tool, content tool, e-commerce |
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

> Provider API keys configured through the Settings page still work as a local-first fallback. For production, store keys through the server-side provider vault and never expose service keys or encryption secrets through `NEXT_PUBLIC_*` variables.

---

## Demo / Mock Mode

VibeForge works without any API keys. Demo mode generates deterministic project kits using built-in templates and repo data. This is the default behavior when no provider is configured.

To try it:
1. Open the Builder (`/`)
2. Click **"Load AI video sample"** or type your own idea
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

## Production setup

1. Run both Supabase migrations.
2. Configure public Supabase browser variables.
3. Configure server-only `SUPABASE_SERVICE_ROLE_KEY` and `VIBEFORGE_PROVIDER_KEY_SECRET`.
4. Use saved provider profiles for production provider calls.
5. Verify generation logs and rate limiting before sharing the app publicly.

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

### Rate limiting

Generation and provider-test routes use per-IP in-memory rate limiting and return `Retry-After` when throttled. For multi-region production, replace the in-memory store with Redis or another shared limiter.

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
| **ZIP** | Each section as a separate `.md` file in a ZIP archive |
| **Codex Pack** | `AGENTS.md`, `PROJECT_BRIEF.md`, `TASKS.md`, `TOOLS.md`, `NEXT_ACTIONS.md`, `CODEX_PROMPTS.md` |
| **Cline Pack** | `.clinerules`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md` |
| **Cursor Pack** | `.cursorrules`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md` |
| **Claude Code Pack** | `CLAUDE.md`, `PROJECT_BRIEF.md`, `TASKS.md`, `NEXT_ACTIONS.md` |

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run check:product` | Product integrity checks |
| `npm run check:exports` | Export pack verification |

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
npm run lint
npm run build
npm run check:product
npm run check:exports
npm run check:production
npm run test:e2e
```

---

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

Set environment variables in the Vercel dashboard if using Supabase.

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
- **Generation logs** track provider, model, mode, status, and errors for production observability.
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
