# VibeForge - Codex Master Build Prompt

Use this file as the master instruction for Codex/Cline/OpenHands or another AI coding agent.

## Role

You are a senior full-stack product engineer, product architect, UI/UX designer, QA engineer, and cost-aware AI systems architect.

Your mission is to build a complete production-quality web application called **VibeForge** from scratch.

VibeForge helps non-technical users turn rough software ideas into complete AI-buildable project systems. It should generate project strategy, repo/tool recommendations, project files, coding-agent instructions, test plans, deployment plans, API settings, MCP connection plans, and launch kits.

This is not a basic ChatGPT wrapper. It must create usable artifacts, structured project kits, configuration-ready workflows, and practical outputs that can be exported and used by Codex/Cline/Cursor/Claude Code/Gemini CLI or other AI coding tools.

## Product Vision

VibeForge is an **AI Project Operating System for vibe coding**.

The user enters a rough idea:

```text
I want to build an AI video app for small shops.
```

The app generates:

```text
- Product strategy
- MVP scope
- Feature roadmap
- Recommended stack
- Repo/tool map
- Cost-aware AI model plan
- PROJECT_BRIEF.md
- TASKS.md
- AGENTS.md
- TOOLS.md
- REPO_MAP.md
- DATABASE_SCHEMA.md
- API_SPEC.md
- UI_SCREENS.md
- USER_FLOWS.md
- TEST_PLAN.md
- DEPLOYMENT_PLAN.md
- SECURITY_CHECKLIST.md
- CODEX_PROMPTS.md
- LAUNCH_KIT.md
```

The final product must feel like a polished SaaS app, not a demo.

## Core Differentiation

VibeForge must be better than asking ChatGPT directly because it:

1. Uses a fixed product-building workflow.
2. Produces structured files and exports.
3. Recommends repos/tools based on the job to be done.
4. Separates "use directly", "install", "clone", and "reference only".
5. Creates prompts for AI coding agents.
6. Supports cost-aware model routing.
7. Supports settings for API providers and MCP connections.
8. Saves project history.
9. Generates test, deployment, and launch plans.
10. Has a beautiful, easy-to-use UI for non-technical users.

## Target Users

- Non-coders who want to build apps with AI coding agents.
- Freelancers building MVPs for clients.
- AI automation agency owners.
- Course creators teaching vibe coding.
- Indie hackers looking for fast project planning.
- Developers who want structured project kits before coding.

## Build Requirements

### Recommended Stack

Use this stack unless the existing project clearly uses something else:

```text
Frontend: Next.js App Router + TypeScript
Styling: Tailwind CSS
UI: shadcn/ui + lucide-react icons
State: React hooks / Zustand only if needed
Forms: React Hook Form + Zod
Database: Supabase optional, localStorage fallback required
AI Providers: OpenAI-compatible API, OpenRouter, Gemini-compatible configuration
Export: Markdown + ZIP export
Testing: npm build, lint, basic component/unit tests if available
Deployment target: Vercel
```

### Important UI/UX Rules

The UI is critical. Build a polished product interface.

Requirements:

- The first screen must be the actual usable builder, not a marketing landing page.
- The user must understand what to do within 5 seconds.
- Use a calm, premium SaaS interface.
- Avoid clutter, excessive gradients, or decorative blobs.
- Use cards only for repeated items, result panels, settings panels, and project history items.
- Do not put cards inside cards.
- Use icons from `lucide-react` for actions.
- Use tabs for generated output sections.
- Use segmented controls for app type, timeline, and skill level.
- Use toggles or checkboxes for optional modules.
- Use tooltips for advanced settings.
- Use clear loading, empty, success, and error states.
- Use responsive layout for mobile and desktop.
- No overlapping text.
- No tiny unreadable text.
- Every button must have clear purpose.
- The result screen must feel like a professional project cockpit.

### Visual Direction

Use a clean, modern interface:

```text
Background: soft off-white or neutral light
Text: deep charcoal
Accent colors: teal, blue, amber, coral, restrained green
Avoid: one-color purple/blue gradient theme
Cards: max 8px border radius unless existing design requires otherwise
Typography: compact, readable, not oversized
```

The app should look suitable for founders, creators, freelancers, and non-technical users.

## Main Features

### 1. Project Intake Builder

Build a guided form where users enter:

```text
- Project idea
- Target users
- Problem being solved
- Desired output
- App type
- Timeline
- Skill level
- Budget sensitivity
- Preferred stack
- API providers they already have
- Whether they want MCP/IDE/CLI integration
```

App types:

```text
- SaaS
- AI tool
- AI video app
- Automation tool
- n8n workflow
- Dashboard
- Content tool
- E-commerce helper
- Internal business tool
- Mobile app idea
- Other
```

Timeline options:

```text
- 1 night MVP
- 1 day MVP
- 7 day build
- 30 day product
- Full production system
```

Skill level:

```text
- Non-coder
- Beginner
- Builder
- Developer
```

### 2. Clarification Engine

If the user input is vague, generate 3-5 clarification questions.

Also provide a button:

```text
AI choose sensible defaults
```

The user must not get stuck.

### 3. AI Project Kit Generator

Generate structured output sections:

```text
1. Product Strategy
2. MVP Scope
3. Feature Roadmap
4. Stack Recommendation
5. Repo & Tool Map
6. Cost-Aware AI Plan
7. Database Schema
8. API Specification
9. UI Screens
10. User Flows
11. Coding Agent Rules
12. Task Plan
13. Test Plan
14. Deployment Plan
15. Security Checklist
16. Launch Kit
17. Codex/Cline Prompts
```

Each section must be displayed in its own tab or organized panel.

Each section must support:

```text
- Copy
- Download markdown
- Regenerate section
- Mark as favorite/approved
```

### 4. Repo & Tool Navigator

Create a built-in curated repo/tool database. Store it as local structured data first.

Each repo/tool item must include:

```text
- Name
- URL
- Category
- Use case
- When to use
- When not to use
- How to use: install / clone / reference only / import workflow
- Difficulty
- Production readiness
- License/risk notes
- Cost notes
- Suggested Codex prompt
```

Seed with at least these items:

```text
Codex CLI
https://github.com/openai/codex
Use: main coding agent / terminal coding workflow
How: external tool, do not copy into app

Cline
https://github.com/cline/cline
Use: IDE agent in VS Code
How: external IDE extension/tool

Superpowers
https://github.com/obra/superpowers
Use: agentic development methodology and skills
How: plugin/workflow instructions

OpenHands
https://github.com/OpenHands/OpenHands
Use: AI software engineering agent platform
How: reference or advanced orchestration

shadcn/ui
https://github.com/shadcn-ui/ui
Use: UI components
How: install/use in app

Supabase
https://github.com/supabase/supabase
Use: auth, database, storage
How: use service + SDK

n8n
https://github.com/n8n-io/n8n
Use: automation workflows
How: external automation service, import workflows

Remotion
https://github.com/remotion-dev/remotion
Use: video rendering with React
How: install when building video apps

VideoSOS
https://github.com/timoncool/videosos
Use: AI video editor architecture reference
How: reference only unless explicitly using its code

StoryGen-Atelier
https://github.com/0xsline/StoryGen-Atelier
Use: storyboard to AI video pipeline reference
How: reference only

short-video-maker
https://github.com/gyoridavid/short-video-maker
Use: faceless short video automation, Remotion/FFmpeg/TTS/captions
How: reference or fork for short-video workflows
```

The repo navigator must recommend tools based on the user's project type.

Example:

For AI video app:

```text
Use directly:
- Next.js
- Supabase
- shadcn/ui
- Remotion
- FFmpeg

Reference:
- VideoSOS
- StoryGen-Atelier
- short-video-maker

Agent workflow:
- Codex CLI
- Superpowers
- Cline
```

### 5. AI Provider & Cost Settings

Build a settings area where users can configure providers.

Support provider configuration UI for:

```text
- OpenAI-compatible endpoint
- OpenRouter
- Gemini
- Anthropic-compatible placeholder
- Local/Ollama-compatible placeholder
- Custom provider
```

Settings fields:

```text
- Provider name
- Base URL
- API key
- Default model
- Fast/cheap model
- Strong/reasoning model
- Vision model
- Max budget per generation
- Temperature
- Token/output limits
```

Store settings safely for MVP:

- If no backend auth exists, store only in localStorage and warn the user.
- Do not hardcode real API keys.
- Do not commit secrets.
- Provide `.env.example`.

### 6. Cost-Aware Model Router

Implement a simple routing system:

```text
Cheap model:
- draft strategy
- first-pass tasks
- repo summaries

Strong model:
- final project architecture
- difficult reasoning
- security review
- production plan

Custom provider:
- user-selected advanced workflow
```

The generated project kit should explain:

```text
- what can run on cheap model
- what needs strong model
- how to reduce API cost
- what to cache
- what to regenerate only when needed
```

### 7. MCP & External System Settings

Add a Settings > Integrations area for MCP/external connections.

This MVP does not need to fully implement every MCP server. It must provide:

```text
- MCP connection registry UI
- Add connection form
- Provider type selector
- Connection status placeholder
- Recommended MCP templates
- Copyable config snippets
```

Integration types:

```text
- IDE / editor
- CLI coding agent
- GitHub
- Browser automation
- Filesystem
- Database
- n8n
- Custom MCP server
```

Each integration entry:

```text
- Name
- Type
- Command or URL
- Environment variables
- Status: Not configured / Configured / Needs testing
- Notes
```

For now, MCP settings can be stored locally and exported as JSON.

Generate config snippets for:

```text
- Codex/Cline project instructions
- Generic MCP server config
- n8n webhook integration plan
- GitHub repo integration plan
```

### 8. Export System

Users must be able to export:

```text
- Single markdown file
- Full project kit as ZIP
- JSON project data
- TOOLS.md only
- AGENTS.md only
- TASKS.md only
- CODEX_PROMPTS.md only
```

ZIP must include:

```text
PROJECT_BRIEF.md
PRODUCT_STRATEGY.md
TASKS.md
AGENTS.md
TOOLS.md
REPO_MAP.md
DATABASE_SCHEMA.md
API_SPEC.md
UI_SCREENS.md
USER_FLOWS.md
TEST_PLAN.md
DEPLOYMENT_PLAN.md
SECURITY_CHECKLIST.md
CODEX_PROMPTS.md
LAUNCH_KIT.md
project.json
```

### 9. Project History

Save generated project kits locally at minimum.

History item:

```text
- Project name
- App type
- Created date
- Timeline
- Recommended stack summary
- Last opened
```

Actions:

```text
- Open
- Duplicate
- Delete
- Export
```

### 10. Quality Reports

Generate a "Build Readiness Score" for each project kit:

```text
Product clarity: 0-100
MVP focus: 0-100
Technical feasibility: 0-100
Cost efficiency: 0-100
Agent readiness: 0-100
Launch readiness: 0-100
```

Show strengths, risks, and next actions.

## Required Pages / Routes

Implement these routes:

```text
/                Main builder
/projects        Project history
/projects/[id]   Project kit detail/result
/repo-map        Repo/tool navigator
/settings        API/MCP/settings
/about           Short product explanation
```

If dynamic routes are too much for the current project, implement equivalent state-based navigation in a single app shell, but keep the code structured so routes can be added later.

## Required Components

Create reusable components:

```text
AppShell
BuilderForm
ClarificationPanel
ProjectKitTabs
MarkdownSection
CopyButton
ExportButton
RepoCard
RepoRecommendationPanel
ProviderSettingsForm
McpConnectionCard
ProjectHistoryList
ReadinessScore
EmptyState
LoadingState
ErrorState
```

## Data Models

Use TypeScript types.

Core types:

```ts
type ProjectInput = {
  idea: string;
  targetUsers?: string;
  problem?: string;
  desiredOutput?: string;
  appType: string;
  timeline: string;
  skillLevel: string;
  budgetSensitivity: "low" | "medium" | "high";
  preferredStack: string[];
  wantsMcp: boolean;
  wantsAutomation: boolean;
};

type ProjectKit = {
  id: string;
  name: string;
  input: ProjectInput;
  sections: Record<string, string>;
  repoRecommendations: RepoRecommendation[];
  readinessScore: ReadinessScore;
  createdAt: string;
  updatedAt: string;
};

type RepoTool = {
  id: string;
  name: string;
  url: string;
  category: string;
  useCase: string;
  whenToUse: string;
  whenNotToUse: string;
  howToUse: "install" | "clone" | "reference-only" | "external-tool" | "import-workflow";
  difficulty: "easy" | "medium" | "hard";
  productionReadiness: "low" | "medium" | "high";
  riskNotes: string;
  costNotes: string;
  suggestedPrompt: string;
};
```

## AI Generation Requirements

Create an AI generation service that:

1. Accepts `ProjectInput`.
2. Builds a structured prompt.
3. Calls configured provider if available.
4. Falls back to mock/demo generation if no API key exists.
5. Parses or structures output into sections.
6. Stores result in local history.

The app must work even without API keys.

### System Prompt for Internal AI

Use this as the base system prompt:

```text
You are a senior product architect, software architect, AI workflow engineer, and vibe coding coach.

Your job is to convert rough app ideas into complete AI-buildable project kits.

Do not give vague advice.
Do not merely answer like a chatbot.
Produce concrete, structured, implementation-ready artifacts.

Always include:
- MVP scope
- what not to build yet
- recommended stack
- repo/tool map
- task plan
- coding agent rules
- test plan
- deployment plan
- security checklist
- Codex/Cline prompts
- cost-aware AI provider plan

Favor simple, shippable systems.
Use repo recommendations only when they match the actual job.
Explain whether each repo should be installed, cloned, used externally, imported as workflow, or used only as reference.
Make outputs usable by non-technical users and AI coding agents.
```

## Safety and Security Requirements

- Never hardcode API keys.
- Add `.env.example`.
- Add warnings for localStorage API key storage.
- Validate form inputs with Zod.
- Handle API errors gracefully.
- Add rate-limit placeholder or TODO if no backend exists.
- Do not execute arbitrary user code.
- Do not clone external repos automatically in MVP.
- Clearly distinguish reference repos from installed dependencies.

## Testing Requirements

Before reporting completion:

1. Install dependencies.
2. Run lint if available.
3. Run build.
4. Run tests if available.
5. Start local dev server.
6. Manually verify core flow:

```text
- Open builder
- Submit sample idea
- Generate project kit with mock mode
- Generate project kit with API mode if key exists
- Switch tabs
- Copy a section
- Export markdown
- Export ZIP
- Save to history
- Reopen from history
- Add API provider setting
- Add MCP connection placeholder
- View repo map
- Confirm responsive UI
```

If any step fails:

```text
Fix the root cause.
Run verification again.
Do not declare completion until the core flow works.
```

## Performance Requirements

- Keep first load reasonably fast.
- Avoid unnecessary large dependencies.
- Lazy-load heavy export libraries if practical.
- Cache generated project kits locally.
- Avoid repeated AI calls when regenerating only a section.

## Implementation Process for Codex

Follow this process strictly:

### Phase 1: Discovery

Inspect the current folder.
Determine whether a project already exists.
If no app exists, create a new Next.js TypeScript app.
If an app exists, adapt to existing conventions.

### Phase 2: Planning Files

Before building, create:

```text
PROJECT_BRIEF.md
TASKS.md
AGENTS.md
TOOLS.md
```

These files should describe this app and guide future agents.

### Phase 3: Foundation

Set up:

```text
Next.js
TypeScript
Tailwind
shadcn/ui
lucide-react
Zod
JSZip or equivalent export helper
```

### Phase 4: UI Shell

Build polished app shell:

```text
Sidebar/top nav
Main builder
Project history
Repo map
Settings
```

### Phase 5: Data and Logic

Implement:

```text
Types
Repo database
Local storage service
AI provider settings
Project kit generation service
Export service
```

### Phase 6: Core Flow

Implement:

```text
Builder form
Generate project kit
Result tabs
Copy/export
History save/reopen
Repo recommendations
Readiness score
```

### Phase 7: Settings and MCP

Implement:

```text
API provider settings
Cost-aware model preferences
MCP connection registry
Export MCP config JSON/snippets
```

### Phase 8: Verification

Run all checks and fix failures.

### Phase 9: Final Report

At the end, report:

```text
- What was built
- Main features completed
- Files changed
- How to run the app
- What tests/checks passed
- Known limitations
- Recommended next upgrades
```

## Non-Negotiables

- The app must be usable without an API key through demo/mock mode.
- UI must be polished and easy for non-technical users.
- Generated output must be structured and exportable.
- Repo recommendations must be practical and categorized by use.
- Settings must include API provider and MCP connection configuration.
- Do not claim tests passed unless they actually ran.
- Do not stop at a plan. Implement the app.
- Do not add unrelated features.
- Do not copy large external repo code.
- Use external repos as tools, dependencies, or references based on their purpose.

## Sample User Input for Testing

Use this sample to verify the app:

```text
I want to build an AI video app for small shops. The user enters a product description and the app creates a 7-day video content plan, scripts, captions, and prompts for Veo/Gemini/Sora. I am a non-coder and want to build the MVP in 7 days with low API cost.
```

Expected generated recommendations:

```text
Direct use:
- Next.js
- shadcn/ui
- Supabase
- OpenRouter/OpenAI/Gemini provider settings

Video-related future tools:
- Remotion
- FFmpeg

Reference repos:
- VideoSOS
- StoryGen-Atelier
- short-video-maker

Agent workflow:
- Codex CLI
- Superpowers
- Cline
```

Expected exported files:

```text
PROJECT_BRIEF.md
TASKS.md
AGENTS.md
TOOLS.md
REPO_MAP.md
DATABASE_SCHEMA.md
API_SPEC.md
UI_SCREENS.md
USER_FLOWS.md
TEST_PLAN.md
DEPLOYMENT_PLAN.md
SECURITY_CHECKLIST.md
CODEX_PROMPTS.md
LAUNCH_KIT.md
project.json
```

## Final Instruction

Build the best complete MVP possible within the current environment.

Prioritize:

1. Working end-to-end flow.
2. Excellent UI/UX.
3. High-quality generated project kit.
4. Easy API/MCP configuration.
5. Exportable artifacts.
6. Cost-aware model/provider design.
7. Clear verification and final report.

Continue implementing, testing, fixing, and improving until the application is genuinely usable.

