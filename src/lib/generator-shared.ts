/**
 * Shared generator utilities used by both client and server.
 * This file has NO "use client" or "use server" directive so it can be imported from either side.
 */
import type {
  GenerationMetadata,
  ProjectInput,
  ProjectKit,
  ReadinessScore,
} from "@/types/vibeforge";
import { SECTION_ORDER } from "@/lib/kit-sections";
import { recommendRepos } from "@/lib/repo-data";
import { completeProjectInput, deriveProjectProfile, type ProjectProfile } from "@/lib/project-profile";
import { selectAppTemplate } from "@/lib/templates";
import { slugify, uid } from "@/lib/utils";

export function buildProjectKit(
  input: ProjectInput,
  sections: Record<string, string>,
  name?: string,
  generation?: GenerationMetadata,
): ProjectKit {
  const now = new Date().toISOString();
  const desiredOutput = input.desiredOutput || "the requested project output";
  const targetUsers = input.targetUsers || "the target users";
  const template = selectAppTemplate(input);
  const profile = deriveProjectProfile(input, template);
  const completedInput = completeProjectInput(input, profile);
  const isVideo = `${completedInput.idea} ${completedInput.appType}`.toLowerCase().includes("video");

  sections["stack-recommendation"] ||= `## Architecture Overview\n${name} should be built as a local-first Next.js product that turns the user's input into ${desiredOutput} for ${targetUsers}. The architecture should keep the first workflow simple, exportable, and easy for AI coding agents to modify.\n\n## Frontend\n- App Router pages under src/app, with / kept as the usable builder.\n- Builder form in src/components/builder/BuilderForm.tsx for idea, target users, problem, desired output, app type, timeline, budget, stack, providers, MCP, and automation settings.\n- Project cockpit in src/components/kit/* for readiness score, Start Build prompt, section tabs, version history, and exports.\n- Repo reference UI in src/components/repo/* and src/app/repo-map/page.tsx, showing URLs clearly and warning that repos are reference-only.\n\n## Backend And API Layer\n- Route handlers in src/app/api/* for provider-backed generation, section regeneration, provider testing, and health checks.\n- Zod validation should guard every route before provider calls.\n- Rate limiting should run before expensive AI requests.\n- Errors should return title, message, and suggested next step.\n\n## Storage\n- Default storage is browser localStorage so the core flow works without accounts or API keys.\n- ProjectKit records should include input, sections, repoRecommendations, readinessScore, generation metadata, timestamps, and optional section workspace history.\n- Supabase is optional production storage for projects, versions, provider profiles, generation logs, and MCP connections.\n\n## AI Provider Layer\n- Demo mode must remain deterministic and usable without keys.\n- Provider mode should call server routes and use the strong generator prompt contract.\n- Production provider profiles should keep API keys server-side and never return decrypted keys to the browser.\n- Provider failure must fall back safely to demo output without losing the user's work.\n\n## Auth And Permissions\n- No login is required for local-first usage.\n- Supabase Auth can be enabled for cloud sync.\n- Production tables need owner scoping and RLS before public rollout.\n\n## Deployment\n- Vercel is the recommended deployment path for the Next.js app.\n- Environment variables are optional for demo mode and required only for Supabase/provider-vault production paths.\n- Build checks should include lint, build, product checks, export checks, and production hardening checks.\n\n## Risks\n- Provider keys in browser localStorage are acceptable only for local MVP fallback, not shared-browser production use.\n- Repo references must stay URL-only unless the user approves license review and code reuse.\n- Heavy ${isVideo ? "video rendering, media queues, and storage" : "background automation and paid integrations"} should wait until the generated planning workflow proves demand.\n\n## Recommended Stack\n- Next.js App Router + TypeScript for the web app and API routes.\n- Tailwind CSS + shadcn-style components for a calm, dense builder UI.\n- lucide-react icons for action buttons and statuses.\n- Zod + React Hook Form for typed intake and API validation.\n- localStorage as the default storage path so the core flow works without accounts.\n- Supabase for optional auth, cloud sync, provider profiles, and generation logs.\n- JSZip for full kit and agent-pack exports.\n${template.stack.map((item) => `- ${item}`).join("\n")}\n\n## Acceptance Criteria\n- The first user can generate and export a complete kit without API keys.\n- Provider-backed generation uses server routes when configured and demo fallback otherwise.\n- ARCHITECTURE.md explains frontend, backend, storage, AI provider layer, auth, deployment, and risks.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run build\nnpm.cmd run check:product\n\`\`\``;

  sections["implementation-phases"] ||= `## Phase 0: Validate The Brief\nGoal: make sure the generated kit matches the user's actual request before code starts.\n\nFiles to review:\n- PRODUCT_REQUIREMENTS.md\n- MVP_SCOPE.md\n- REPO_REFERENCES.md\n- TASKS.md\n\nAcceptance criteria:\n- The target users, problem, desired output, and app type match the builder input.\n- The MVP avoids expensive or risky features that do not fit ${input.timeline}.\n- Repo references are URL-only and include do-not-clone guidance.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run check:product\n\`\`\`\n\n## Phase 1: Build The Smallest Working Flow\nGoal: implement one end-to-end flow that creates ${desiredOutput} for ${targetUsers}.\n\nLikely files:\n- src/app/page.tsx\n- src/components/builder/BuilderForm.tsx\n- src/lib/generator-shared.ts\n- src/lib/export.ts\n\nAcceptance criteria:\n- User can complete the primary flow without API keys.\n- Generated output can be copied or exported.\n- Empty, loading, and error states are clear.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n## Phase 2: Add Provider Quality Carefully\nGoal: use configured AI providers for deeper output while preserving demo fallback.\n\nLikely files:\n- src/app/api/generate-kit/route.ts\n- src/lib/server-generator.ts\n- src/lib/generation-client.ts\n- src/lib/user-facing-errors.ts\n\nAcceptance criteria:\n- Provider mode reflects the user's exact input.\n- Invalid provider key, timeout, quota, invalid model, and rate limit errors are clear.\n- Demo fallback never destroys user work.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run check:production\n\`\`\`\n\n## Phase 3: Productionize Only After The Core Works\nGoal: add account storage, logs, and provider vault only when the core kit is useful.\n\nLikely files:\n- src/lib/cloud-store.ts\n- src/lib/provider-vault.ts\n- src/lib/generation-logs.ts\n- supabase/migrations/*\n\nAcceptance criteria:\n- Local-first mode still works when Supabase is missing.\n- Provider keys stay server-side in production paths.\n- Generation logs do not contain secrets.\n\n## Do Not Build Yet\n- Team workspaces, billing, or marketplace features before beta users export useful kits.\n- Automatic repo cloning, code copying, or external repo execution.\n- Heavy ${isVideo ? "rendering queues and media storage" : "background automation"} before the first workflow proves demand.`;

  sections["ai-handoff"] ||= `## Purpose\nThis file is the safest single-file brief to upload into Codex, Cline, Cursor, Claude Code, or another AI coding agent. It tells the agent exactly what to build, which files to read first, what constraints to preserve, and how to verify the work.\n\n## Project Snapshot\n- Project: ${name?.trim() || inferName(input.idea)}\n- App type: ${input.appType}\n- Target users: ${targetUsers}\n- Problem: ${input.problem || "User needs a clearer, faster path from idea to implementation."}\n- Desired output: ${desiredOutput}\n- Timeline: ${input.timeline}\n- Skill level: ${input.skillLevel}\n- Budget sensitivity: ${input.budgetSensitivity}\n- Preferred stack: ${input.preferredStack.length ? input.preferredStack.join(", ") : "Use the recommended stack from ARCHITECTURE.md"}\n- Providers available: ${input.apiProviders.length ? input.apiProviders.join(", ") : "None specified; preserve demo/local fallback"}\n- MCP requested: ${input.wantsMcp ? "yes" : "no"}\n- Automation requested: ${input.wantsAutomation ? "yes" : "no"}\n\n## Upload These Files Together\n1. AI_HANDOFF.md\n2. PRODUCT_REQUIREMENTS.md\n3. MVP_SCOPE.md\n4. ARCHITECTURE.md\n5. API_SPEC.md\n6. TASKS.md\n7. IMPLEMENTATION_PHASES.md\n8. REPO_REFERENCES.md\n9. SECURITY_CHECKLIST.md\n10. TEST_PLAN.md\n11. VIBE_CODING_PROMPTS.md\n\n## Primary Agent Prompt\n\`\`\`text\nYou are the implementation agent for this project kit. Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, API_SPEC.md, TASKS.md, IMPLEMENTATION_PHASES.md, REPO_REFERENCES.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md before editing. Implement only the next highest-priority task from TASKS.md. Preserve the requested user outcome: ${desiredOutput}. Keep local/demo fallback working. Do not hardcode secrets. Do not clone external repositories automatically. Treat repo URLs as reference-only. Before editing, inspect the target files named by the task. After editing, run the listed test command and report changed files, checks run, and remaining risks.\n\`\`\`\n\n## Non-Negotiable Constraints\n- Match the user's stated target users, problem, desired output, timeline, stack, provider, MCP, and automation choices.\n- Build the smallest working workflow before adding production-only systems.\n- Keep API keys and secrets out of source code and prompts.\n- Do not execute user-supplied code.\n- Do not clone external repositories automatically.\n- Use repo URLs only for README/docs/architecture/package inspiration unless the user approves license review and code reuse.\n\n## Quality Gate Before Coding\nThe agent should not start implementation until it can answer:\n- What exact output should the user receive?\n- Which user problem does the MVP solve first?\n- Which files are likely to change in the next task?\n- What acceptance criteria prove the task is done?\n- What command verifies the task?\n- Which features are explicitly not part of the first build?\n\n## Definition Of Done\n- The implemented task satisfies its acceptance criteria.\n- Lint/build/check commands pass, or any blocker is reported with the root cause.\n- Demo/local-first behavior still works.\n- Exported Markdown/JSON/ZIP/agent packs still work.\n- No secrets, external repo code, or unrelated rewrites are introduced.`;

  return {
    id: uid("kit"),
    name: name?.trim() || inferName(input.idea),
    input: completedInput,
    sections: normalizeSections(sections),
    favorites: {},
    repoRecommendations: recommendRepos(completedInput),
    readinessScore: scoreProject(input),
    generation,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
}

export function generateMockKit(input: ProjectInput): ProjectKit {
  const now = new Date().toISOString();
  const name = inferName(input.idea);
  const template = selectAppTemplate(input);
  const profile = deriveProjectProfile(input, template);
  const completedInput = completeProjectInput(input, profile);
  const repoRecommendations = recommendRepos(completedInput);
  const repoLines = repoRecommendations
    .map(
      ({ tool, lane, reason }) =>
        `- **${tool.name}** (${lane.replace("-", " ")}): ${tool.url}\n  - Why useful: ${reason}\n  - How AI should use it: ${tool.suggestedPrompt}\n  - Use as: ${tool.howToUse}. ${tool.costNotes}`,
    )
    .join("\n");

  const isVideo = `${completedInput.idea} ${completedInput.appType}`.toLowerCase().includes("video");
  const desiredOutput = profile.desiredOutput;
  const targetUsers = profile.targetUsers;
  const problem = profile.problem;
  const searchQuery = encodeURIComponent(
    [profile.label, input.idea, input.preferredStack.join(" "), "github"]
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 160),
  );
  const githubSearchUrls = [
    `https://github.com/search?q=${searchQuery}&type=repositories&s=stars&o=desc`,
    `https://github.com/search?q=${encodeURIComponent(`${profile.label} Next.js starter`)}&type=repositories&s=stars&o=desc`,
    `https://github.com/search?q=${encodeURIComponent(`${profile.label} open source app example`)}&type=repositories&s=stars&o=desc`,
  ];
  const appSlug = profile.slug;
  const sections: Record<string, string> = {
    "product-strategy": `## Outcome\n${name} helps ${targetUsers} solve: ${problem}.\n\nThe first version should produce: ${desiredOutput}.\n\n## Primary Persona\n- User: ${targetUsers}\n- Skill level: ${input.skillLevel}\n- Budget sensitivity: ${input.budgetSensitivity}\n- Main job: ${problem}. The product gives them a fast, guided path to ${desiredOutput} without needing technical skills.\n\n## Job To Be Done\nWhen ${targetUsers} face ${problem}, they can use ${name} to quickly get ${desiredOutput} through a simple, guided workflow.\n\n## Product Promise\n${name} should produce ${desiredOutput} that is ready to use immediately. The interface should be simple enough for ${targetUsers} to operate without training. The first version must prove value with a single, complete workflow before adding advanced features.\n\n## Success Metrics\n- User completes the primary workflow in under 5 minutes.\n- User downloads or shares their ${desiredOutput} successfully.\n- 60% of users return within 48 hours to create another output.\n- Zero paid API calls required for the demo/preview flow.`,
    "mvp-scope": `## Build First\n${template.mvp.map((item) => `- ${item}`).join("\n")}\n- Simple intake form for ${targetUsers} to provide their input (${input.appType}-specific fields).\n- Core processing pipeline that transforms user input into ${desiredOutput}.\n- Preview and download flow so users can verify output before sharing.\n- Local-first storage so the app works without accounts or API keys.\n\n## Acceptance Criteria\n- ${targetUsers} can complete the primary workflow without technical knowledge.\n- The output (${desiredOutput}) is ready to use or share immediately.\n- Demo mode works without API keys or external services.\n- The app handles errors gracefully and shows clear status messages.\n\n## Do Not Build Yet\n- User accounts and cloud storage before the core workflow is validated.\n- Payment processing before demand is proven.\n- Advanced customization options before the default output is good enough.\n${template.avoid.map((item) => `- ${item}`).join("\n")}\n${isVideo ? "- Heavy video rendering pipeline before validating scripts, captions, and planning outputs.\n" : ""}`,
    "feature-roadmap": `## Phase 0: Demo-Ready Kit Generator\n- Builder intake at /.\n- Deterministic demo generation.\n- Project detail tabs and exports.\n- Repo reference URLs and coding-agent prompts.\n\n## Phase 1: Vibe Coding Engine\n- Upgrade every generated section into an implementation contract.\n- Add TASKS.md with phases, file paths, acceptance criteria, and test commands.\n- Add REPO_REFERENCES behavior through the Repo & Tool Map section.\n- Add Start Build prompt for Codex/Cline/Cursor.\n\n## Phase 2: Provider Quality\n- Use provider-backed deep planning mode for richer output.\n- Regenerate individual sections with the same quality contract.\n- Add structured provider errors and fallback behavior.\n\n## Phase 3: Production Layer\n- Supabase auth and cloud sync.\n- Server-side provider vault.\n- Generation logs, usage tracking, and shared rate limits.\n\n## Phase 4: Beta Launch\n- Onboarding, sample projects, launch checklist, docs, and public demo.`,
    "stack-recommendation": `## Architecture Overview\n${name} is built as a local-first Next.js web app that helps ${targetUsers} create ${desiredOutput}. The architecture keeps the first workflow simple, fast, and easy for AI coding agents to extend.\n\n## Frontend\n- App Router pages under src/app/.\n- Landing/intake page at src/app/page.tsx for ${input.appType} input.\n- Output preview at src/app/preview/page.tsx showing generated ${desiredOutput}.\n- History at src/app/history/page.tsx for past outputs.\n- ${input.appType}-specific components in src/components/${appSlug}/.\n\n## Backend And API Layer\n- Route handlers in src/app/api/ for ${input.appType}-specific processing.\n- POST /api/process — Main processing endpoint for user input.\n- POST /api/generate — AI-powered generation endpoint (when provider is configured).\n- GET /api/outputs/[id] — Retrieve a specific output.\n- Zod validation on every route before processing.\n- Rate limiting before expensive AI or external API calls.\n\n## Storage\n- Default: browser localStorage for the MVP (no accounts needed).\n- File uploads: local /tmp during dev, cloud storage (Cloudinary/S3) for production.\n- Supabase for optional user accounts and cloud sync later.\n\n## AI Provider Layer\n- Demo mode with deterministic output (no API keys needed).\n- Provider mode with OpenRouter/Gemini/OpenAI for richer generation.\n- Provider failure falls back safely to demo output.\n\n## Deployment\n- Vercel (recommended) for the Next.js app.\n- Environment variables optional for demo; required for AI provider and storage.\n\n## Risks\n- ${isVideo ? "Video rendering is compute-heavy; defer to Phase 2 after validating planning outputs." : "Complex processing should be deferred until the core workflow proves demand."}\n- External API costs should be controlled with rate limits and usage caps.\n- User uploads need size limits and type validation before processing.\n\n## Recommended Stack\n${template.stack.map((item) => `- ${item}`).join("\n")}\n- Next.js App Router + TypeScript\n- Tailwind CSS + shadcn/ui\n- Zod + React Hook Form\n- localStorage (default) → Supabase (optional)\n\n## Why This Stack Fits\nThis stack allows ${targetUsers} to start using the app immediately without setup. The Next.js App Router handles both the UI and API routes in one project. Local-first storage means no accounts are needed for the MVP.\n\n## Alternatives Considered\n- Vite: faster for static sites, but lacks built-in API routes needed for ${input.appType} processing.\n- Full backend first: unnecessary until the core workflow proves demand.\n- No-code platform: fast to prototype but limits customization for ${desiredOutput}.`,
    "repo-tool-map": `## Reference Policy\nRepo references are URLs and implementation inspiration only. Do not clone repositories automatically. Do not copy source code without license review and explicit user approval.\n\n## Recommended References\n${repoLines}\n\n## GitHub Discovery URLs\nUse these if the built-in repo map does not match the user's exact niche:\n${githubSearchUrls.map((url) => `- ${url}`).join("\n")}\n\n## Agent Discovery Prompt\nFind 5 reference repositories for this product idea. Use them only for architecture inspiration, package choices, and implementation patterns. Do not clone or copy code unless the user explicitly approves license review and code reuse.\n\n## How The Coding Agent Should Use Repo URLs\n- Read README/docs for patterns.\n- Extract architecture ideas, not source code.\n- Prefer official package installation over copying files.\n- Keep the generated product's scope smaller than the reference repo.`,
    "cost-aware-ai-plan": `## Cheap Model Tasks\n- Draft strategy\n- First-pass tasks\n- Repo summaries\n- Clarification questions\n\n## Strong Model Tasks\n- Final architecture\n- Security review\n- Production deployment plan\n- Complex tradeoff decisions\n\n## Cost Controls\n- Cache generated kits locally\n- Regenerate one section at a time\n- Keep reference repo summaries short\n- ${isVideo ? "Avoid real video rendering until storyboard demand is validated" : "Avoid expensive multi-step model chains until the core workflow is validated"}\n- Use ${input.budgetSensitivity === "high" ? "cheap defaults and strict token limits" : "stronger models only on final review"}`,
    "database-schema": `## Local MVP Collections\n\`\`\`ts\nprojects: ProjectKit[]\nproviders: ProviderSettings[]\nmcpConnections: McpConnection[]\n\`\`\`\n\n## ProjectKit Shape\n\`\`\`ts\ntype ProjectKit = {\n  id: string;\n  name: string;\n  input: ProjectInput;\n  sections: Record<string, string>;\n  favorites: Record<string, boolean>;\n  repoRecommendations: RepoRecommendation[];\n  readinessScore: ReadinessScore;\n  generation?: GenerationMetadata;\n  createdAt: string;\n  updatedAt: string;\n}\n\`\`\`\n\n## Supabase Production Tables\n| Table | Purpose | Key Columns |\n|---|---|---|\n| projects | Stores generated kits | id, user_id, name, input_json, sections_json, readiness_json, generation_json, created_at, updated_at |\n| project_versions | Stores meaningful section snapshots | id, project_id, user_id, sections_json, label, created_at |\n| provider_profiles | Stores provider metadata and encrypted keys | id, user_id, provider_name, provider_type, base_url, encrypted key fields |\n| generation_logs | Tracks provider usage and failures | id, user_id, project_id, route, provider_name, model, generation_mode, status, error_message |\n| mcp_connections | Stores external workflow configuration | id, user_id, name, type, command_or_url, env_vars, status |\n\n## Acceptance Criteria\n- Local mode works with no database.\n- Cloud mode is owner-scoped with RLS.\n- API keys are never stored in plaintext.\n- Old local projects can still open after schema additions.`,
    "api-specification": `## API Contract Principles\nAll API routes must validate input with Zod, return structured user-facing errors, apply rate limits before expensive calls, and never log secrets.\n\n## POST /api/process\nPurpose: Process user input and generate ${desiredOutput}.\n\nRequest body:\n\`\`\`json\n{\n  "title": "string",\n  "description": "string",\n  "targetAudience": "string",\n  "style": "string",\n  "options": {}\n}\n\`\`\`\n\nResponse body:\n\`\`\`json\n{\n  "id": "output_xxx",\n  "status": "processing | complete | failed",\n  "result": {},\n  "previewUrl": "string",\n  "downloadUrl": "string"\n}\n\`\`\`\n\nError cases:\n- 400 invalid_request — missing required fields\n- 413 file_too_large — upload exceeds size limit\n- 429 rate_limited — too many requests\n- 500 processing_failed — generation error\n\nFiles to implement:\n- src/app/api/process/route.ts\n- src/lib/processor.ts\n- src/lib/validation.ts\n\n## POST /api/generate\nPurpose: AI-powered enhanced generation (uses configured provider).\n\nRequest body:\n\`\`\`json\n{\n  "inputId": "string",\n  "mode": "fast | balanced | deep",\n  "providerProfileId": "optional"\n}\n\`\`\`\n\nResponse body:\n\`\`\`json\n{\n  "id": "gen_xxx",\n  "result": {},\n  "source": "demo | provider",\n  "model": "optional model id"\n}\n\`\`\`\n\nAcceptance criteria:\n- Demo mode works without any API keys.\n- Provider mode falls back safely to demo output.\n- API keys are never returned in responses.\n- Invalid input returns a clear error message.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n## GET /api/outputs/[id]\nPurpose: Retrieve a specific generated output.\n\nResponse body:\n\`\`\`json\n{\n  "id": "output_xxx",\n  "title": "string",\n  "result": {},\n  "previewUrl": "string",\n  "downloadUrl": "string",\n  "createdAt": "string"\n}\n\`\`\`\n\nAcceptance criteria:\n- Returns 404 for missing outputs.\n- Includes preview and download URLs.\n- Response is fast enough for polling.`,
    "ui-screens": `## Screen: / — Landing / Intake\nPrimary job: welcome ${targetUsers} and capture their input for ${input.appType}.\nKey controls: input form with fields specific to ${input.appType}, demo/sample button, submit button.\n\nAcceptance criteria:\n- ${targetUsers} can start in under 30 seconds.\n- Demo mode works without any setup.\n- Loading state shows progress clearly.\n- Error messages explain what went wrong and what to do next.\n\n## Screen: /preview/[id] — Output Preview\nPrimary job: show the generated ${desiredOutput} with options to download, share, or regenerate.\nKey panels: output preview area, download button, share button, edit/regenerate controls.\n\nAcceptance criteria:\n- Output is displayed immediately when ready.\n- Download works in all major browsers.\n- User can request regeneration with different options.\n\n## Screen: /history — Past Outputs\nPrimary job: show all previously generated outputs with search and filters.\n\n## Screen: /settings — Configuration\nPrimary job: configure AI provider (optional), account settings, and preferences.\n\n## Responsive Rules\n- Mobile-first layout for ${targetUsers} who may use phones.\n- Key actions (submit, download, share) are always visible.\n- Form inputs stack cleanly on small screens.`,
    "user-flows": `## Happy Path: First Kit In Demo Mode\n1. User opens /.\n2. User enters: ${input.idea || "a project idea"}.\n3. User chooses ${input.timeline} and ${input.skillLevel}.\n4. User clicks Generate.\n5. System creates a kit without API keys.\n6. User opens Start Build and copies the first coding-agent prompt.\n7. User exports Codex Pack or ZIP.\n\nSuccess criteria: user can hand the exported files to a coding agent without writing a new brief.\n\n## Happy Path: Provider-Backed Deep Planning\n1. User configures a provider in Settings.\n2. User chooses Deep planning.\n3. System generates richer architecture, tasks, repo references, and prompts.\n4. If provider fails, system returns demo fallback with explanation.\n\n## Failure Path: Provider Or Repo Reference Fallback\n1. Provider key is invalid, quota is exhausted, provider times out, or the model is wrong.\n2. System shows a clear user-facing error and preserves the user's form input.\n3. System can still create a demo kit and include fallback GitHub search URLs.\n4. Coding agent uses repo URLs as inspiration only and does not clone automatically.\n\n## Template-Specific Flow\n${template.outputs.map((item, index) => `${index + 1}. Produce or review ${item.toLowerCase()}.`).join("\n")}`,
    "coding-agent-rules": `# Agent Rules\n\n## Mission\nImplement the project from the generated kit files. Treat Markdown files as implementation contracts.\n\n## Hard Rules\n- Preserve local-first behavior unless the task explicitly moves a feature to server/cloud.\n- Do not require API keys for demo/core flow.\n- Do not clone external repositories automatically.\n- Do not copy code from reference repos without license review and user approval.\n- Do not hardcode secrets.\n- Keep changes focused and verify after each milestone.\n\n## Working Method\n1. Read PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, and SECURITY_CHECKLIST.md.\n2. Pick only the next task from TASKS.md.\n3. Inspect existing files before editing.\n4. Implement the smallest working slice.\n5. Run the listed test command.\n6. Report changed files and remaining risks.\n\n## Definition Of Done\n- Acceptance criteria are satisfied.\n- Build/lint/check commands pass or failures are explained.\n- Exports still work.\n- No unrelated rewrites.`,
    "ai-handoff": `## Purpose\nThis file is the safest single-file brief to upload into Codex, Cline, Cursor, Claude Code, or another AI coding agent. It tells the agent exactly what to build, which files to read first, what constraints to preserve, and how to verify the work.\n\n## Project Snapshot\n- Project: ${name}\n- App type: ${input.appType}\n- Target users: ${targetUsers}\n- Problem: ${problem}\n- Desired output: ${desiredOutput}\n- Timeline: ${input.timeline}\n- Skill level: ${input.skillLevel}\n- Budget sensitivity: ${input.budgetSensitivity}\n- Preferred stack: ${input.preferredStack.length ? input.preferredStack.join(", ") : "Use the recommended stack from ARCHITECTURE.md"}\n- Providers available: ${input.apiProviders.length ? input.apiProviders.join(", ") : "None specified; preserve demo/local fallback"}\n- MCP requested: ${input.wantsMcp ? "yes" : "no"}\n- Automation requested: ${input.wantsAutomation ? "yes" : "no"}\n\n## Upload These Files Together\n1. AI_HANDOFF.md\n2. PRODUCT_REQUIREMENTS.md\n3. MVP_SCOPE.md\n4. ARCHITECTURE.md\n5. API_SPEC.md\n6. TASKS.md\n7. IMPLEMENTATION_PHASES.md\n8. REPO_REFERENCES.md\n9. SECURITY_CHECKLIST.md\n10. TEST_PLAN.md\n11. VIBE_CODING_PROMPTS.md\n\n## Primary Agent Prompt\n\`\`\`text\nYou are the implementation agent for this project kit. Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, API_SPEC.md, TASKS.md, IMPLEMENTATION_PHASES.md, REPO_REFERENCES.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md before editing. Implement only the next highest-priority task from TASKS.md. Preserve the requested user outcome: ${desiredOutput}. Keep local/demo fallback working. Do not hardcode secrets. Do not clone external repositories automatically. Treat repo URLs as reference-only. Before editing, inspect the target files named by the task. After editing, run the listed test command and report changed files, checks run, and remaining risks.\n\`\`\`\n\n## Non-Negotiable Constraints\n- Match the user's stated target users, problem, desired output, timeline, stack, provider, MCP, and automation choices.\n- Build the smallest working workflow before adding production-only systems.\n- Keep API keys and secrets out of source code and prompts.\n- Do not execute user-supplied code.\n- Do not clone external repositories automatically.\n- Use repo URLs only for README/docs/architecture/package inspiration unless the user approves license review and code reuse.\n\n## Quality Gate Before Coding\nThe agent should not start implementation until it can answer:\n- What exact output should the user receive?\n- Which user problem does the MVP solve first?\n- Which files are likely to change in the next task?\n- What acceptance criteria prove the task is done?\n- What command verifies the task?\n- Which features are explicitly not part of the first build?\n\n## Definition Of Done\n- The implemented task satisfies its acceptance criteria.\n- Lint/build/check commands pass, or any blocker is reported with the root cause.\n- Demo/local-first behavior still works.\n- Exported Markdown/JSON/ZIP/agent packs still work.\n- No secrets, external repo code, or unrelated rewrites are introduced.`,
    "task-plan": `## Phase 1: Working ${template.label} MVP\n\n### Task 1: Build the ${input.appType} intake form\nFiles:\n- src/app/page.tsx\n- src/components/${appSlug}/IntakeForm.tsx\n- src/types/${appSlug}.ts\n\nImplementation notes:\n- Create a form for ${targetUsers} to provide their input (title, description, target audience, style preferences).\n- Keep defaults useful so users can submit with minimal input.\n- Show a demo/sample button to pre-fill the form.\n\nAcceptance criteria:\n- ${targetUsers} can submit the form with minimal required fields.\n- Validation explains what is missing in clear language.\n- Form works on mobile devices.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n### Task 2: Build the core processing pipeline\nFiles:\n- src/app/api/process/route.ts\n- src/lib/processor.ts\n- src/lib/validation.ts\n\nImplementation notes:\n- Accept user input from the intake form.\n- Process it into ${desiredOutput} using a deterministic demo pipeline first.\n- Return a preview-ready result.\n\nAcceptance criteria:\n- API endpoint accepts valid input and returns structured output.\n- Demo mode produces useful ${desiredOutput} without any API keys.\n- Invalid input returns clear error messages.\n- Processing completes in under 10 seconds for demo mode.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n### Task 3: Build the output preview and download page\nFiles:\n- src/app/preview/[id]/page.tsx\n- src/components/${appSlug}/OutputPreview.tsx\n- src/components/${appSlug}/DownloadButton.tsx\n\nAcceptance criteria:\n- User can see their generated ${desiredOutput} immediately.\n- Download button works in all major browsers.\n- User can regenerate with different options.\n- Empty and error states are handled gracefully.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n### Task 4: Build history and local storage\nFiles:\n- src/app/history/page.tsx\n- src/lib/storage.ts\n- src/components/${appSlug}/HistoryList.tsx\n\nAcceptance criteria:\n- Past outputs are saved to localStorage.\n- User can browse, search, and reopen past outputs.\n- Old outputs still load after app updates.\n\n## Phase 2: AI-Enhanced Generation\n- Add AI provider integration for richer ${desiredOutput}.\n- Add Fast/Balanced/Deep generation modes.\n- Add structured errors and demo fallback when provider fails.\n\n## Phase 3: Production Features\n- Add user accounts and cloud storage.\n- Add sharing and collaboration.\n- Add usage analytics and rate limiting.\n\n## Do Not Build Yet\n- Payment processing before demand is proven.\n- Team workspaces before single-user flow is solid.\n- Automatic repo cloning or external code execution.\n- Heavy ${isVideo ? "video rendering pipelines" : "background processing"} before the core workflow proves useful.`,
    "test-plan": `## Test Strategy\nThe test plan should prove that the user can move from rough idea to exportable AI-coding kit without hidden setup.\n\n## Manual Flow Checklist\n- Generate a kit in demo/mock mode with only an idea and defaults.\n- Generate a kit with target users, problem, desired output, MCP, and automation enabled.\n- Open generated project detail from history.\n- Copy one section and confirm Markdown stays readable.\n- Edit a section, save it, approve it, and confirm version history records the change.\n- Regenerate one section and confirm only that section changes.\n- Export Markdown, JSON, ZIP, Codex Pack, Cline Pack, Cursor Pack, and Claude Code Pack.\n- Save provider settings locally and confirm demo mode still works if the provider is disabled.\n- Add an MCP connection.\n- View repo recommendations for an AI video app.\n${template.tests.map((item) => `- ${item}`).join("\n")}\n\n## Automated Checks\n| Check | Purpose | Command |\n|---|---|---|\n| Lint | Catch invalid React/TypeScript patterns | npm.cmd run lint |\n| Build | Catch route, type, and bundling failures | npm.cmd run build |\n| Product check | Ensure kit sections, templates, repo lanes, and exports exist | npm.cmd run check:product |\n| Export check | Ensure Markdown/JSON/ZIP/agent packs still map to files | npm.cmd run check:exports |\n| Production check | Ensure provider hardening rules stay present | npm.cmd run check:production |\n\n## Acceptance Criteria\n- No test requires a real API key for the core flow.\n- Failed provider calls produce a useful error and do not erase generated work.\n- Exported TASKS.md includes file paths, acceptance criteria, and test commands.\n- Exported TOOLS.md includes repo URLs and reference-only guidance.`,
    "deployment-plan": `## MVP Deployment\n1. Deploy the Next.js app to Vercel.\n2. Leave provider and Supabase environment variables empty for demo-only launch.\n3. Confirm / opens the builder, not a landing page.\n4. Generate one demo kit and export ZIP from production.\n5. Confirm the localStorage warning is visible in Settings.\n\n## Production Environment Variables\n\`\`\`env\nNEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nSUPABASE_SERVICE_ROLE_KEY=\nVIBEFORGE_PROVIDER_KEY_SECRET=\nRATE_LIMIT_MAX=\nRATE_LIMIT_WINDOW_MS=\n\`\`\`\n\n## Supabase Launch Path\n- Create projects, project_versions, provider_profiles, generation_logs, and mcp_connections tables.\n- Enable RLS and owner scoping before inviting users.\n- Store provider keys only through server-owned provider profile routes.\n- Keep localStorage fallback available when Supabase is not configured.\n\n## Monitoring And Rollback\n- Track generation success, provider failures, rate-limit events, and export errors.\n- Roll back by disabling provider mode and keeping demo generation online.\n- Do not block users from exporting existing local projects during provider outages.`,
    "security-checklist": `## Secret Handling\n- No hardcoded API keys, tokens, or service-role keys.\n- Do not send saved provider API keys back to the browser.\n- Do not log provider API keys in console output, server logs, errors, or generation logs.\n- Local provider keys are acceptable only for local-first MVP with a visible warning.\n\n## Input And Provider Safety\n- Validate all generate, regenerate, test-provider, and export inputs with typed schemas.\n- Apply rate limits before provider calls.\n- Return structured user-facing errors for invalid key, timeout, quota, invalid model, unreachable provider, and rate limit.\n- Never execute user-supplied code.\n- Never clone external repositories automatically.\n\n## Repo Reference Safety\n- Provide repo URLs as inspiration only.\n- Ask for explicit approval before cloning, license review, or code reuse.\n- Prefer package installation and official docs over copying repository files.\n\n## Supabase Safety\n- Enable RLS for user-owned data.\n- Scope provider_profiles and generation_logs by user_id.\n- Encrypt provider keys at rest before production user rollout.\n- Document any encryption limitation in README before launch.`,
    "launch-kit": `## Positioning\nOne-line pitch: ${name} turns rough app ideas into AI-buildable project kits for vibe coding agents.\n\n## Demo Script\n1. Open the builder at /.\n2. Enter: ${input.idea || "a realistic customer problem"}.\n3. Fill target users: ${targetUsers}.\n4. Fill desired output: ${desiredOutput}.\n5. Generate the kit.\n6. Open Repo & Tool Map and show URL-only references.\n7. Open Task Plan and copy the first coding-agent task.\n8. Export Codex Pack or ZIP.\n\n## Beta Audience\n- Non-coders who want AI to build a first MVP.\n- Solo builders who need structure before opening Codex, Cline, Cursor, or Claude Code.\n- Agencies and freelancers who turn client ideas into implementation plans.\n\n## Launch Checklist\n- Seed 5 strong sample projects.\n- Add a short README showing demo mode, provider mode, export packs, and repo map behavior.\n- Verify all export formats.\n- Verify invalid provider key errors.\n- Publish a public demo without requiring login.\n\n## Success Metrics\n- 60% of beta users export at least one agent pack.\n- 40% copy the Start Build prompt.\n- 25% return to edit or regenerate a section within 48 hours.`,
    "next-actions": `## Next 5 Actions\n1. Generate a kit for the strongest target niche and review every section for specificity.\n2. Open TASKS.md in Codex and implement only Phase 1 Task 1.\n3. Expand Repo & Tool Map with more high-star URL references for the user's selected domain.\n4. Test exports: Markdown, JSON, ZIP, Codex Pack, Cline Pack, Cursor Pack, Claude Code Pack.\n5. Run lint, build, product checks, export checks, and production checks.\n\n## First Coding-Agent Handoff\nUse this prompt:\n\`\`\`text\nRead AGENTS.md, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, and SECURITY_CHECKLIST.md. Implement the first unchecked task only. Preserve local-first demo behavior. Do not clone external repos automatically. Before editing, inspect the target files listed in TASKS.md. After editing, run the listed test command and report changed files, checks, and risks.\n\`\`\`\n\n## Review Questions Before Building More\n- Does the output match the user's exact desired output?\n- Does every task name the files to edit?\n- Does every risky integration have a fallback?\n- Can a coding agent start without asking for another brief?`,
    "codex-cline-prompts": `## Codex Implementation Prompt\n\`\`\`text\nYou are the implementation agent for this VibeForge project kit. Read AGENTS.md, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, TEST_PLAN.md, and SECURITY_CHECKLIST.md first. Implement the next task from TASKS.md only. Keep the / route as the usable builder. Preserve local-first demo mode. Do not hardcode secrets. Do not clone external repositories automatically. Treat repo URLs as references only. Before editing, inspect the files named by the task. After editing, run the listed test command and report changed files, checks, and remaining risks.\n\`\`\`\n\n## Cline Implementation Prompt\n\`\`\`text\nUse the generated project kit as the source of truth. Start with the smallest vertical slice that proves the user's desired output. Make focused edits only. Do not add paid services, database requirements, repo cloning, or secret handling unless the task explicitly requires it. Keep exports working. Run lint/build or the task-specific command before finishing.\n\`\`\`\n\n## Cursor Implementation Prompt\n\`\`\`text\nRead .cursorrules, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, and API_SPEC.md. Implement the next milestone with minimal file changes. Use existing app patterns. Do not rewrite unrelated UI. Preserve demo mode and export behavior. Summarize changed files and verification commands.\n\`\`\`\n\n## Claude Code Review Prompt\n\`\`\`text\nReview this implementation against PROJECT_BRIEF.md, TASKS.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md. Prioritize bugs, security risks, broken local-first behavior, export regressions, missing validation, and unclear user-facing errors. Provide file/line findings first, then residual risks.\n\`\`\`\n\n## Section Regeneration Prompt\n\`\`\`text\nRegenerate only the requested section for this VibeForge kit. Make it specific to the user's idea, target users, problem, desired output, timeline, skill level, budget, stack, providers, MCP, and automation choices. Include concrete file paths, acceptance criteria, test commands, repo URL policy, and coding-agent instructions where relevant. Do not return generic advice.\n\`\`\``,
  };

  Object.assign(sections, adaptiveSections({ name, input, profile, repoLines, githubSearchUrls, isVideo }));

  sections["implementation-phases"] ||= `## Phase 0: Validate The Brief\nGoal: make sure the generated kit matches the user's actual request before code starts.\n\nFiles to review:\n- PRODUCT_REQUIREMENTS.md\n- MVP_SCOPE.md\n- REPO_REFERENCES.md\n- TASKS.md\n\nAcceptance criteria:\n- The target users, problem, desired output, and app type match the builder input.\n- The MVP avoids expensive or risky features that do not fit ${input.timeline}.\n- Repo references are URL-only and include do-not-clone guidance.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run check:product\n\`\`\`\n\n## Phase 1: Build The Smallest Working Flow\nGoal: implement one end-to-end flow that creates ${desiredOutput} for ${targetUsers}.\n\nLikely files:\n- src/app/page.tsx\n- src/components/builder/BuilderForm.tsx\n- src/lib/generator-shared.ts\n- src/lib/export.ts\n\nAcceptance criteria:\n- User can complete the primary flow without API keys.\n- Generated output can be copied or exported.\n- Empty, loading, and error states are clear.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\`\n\n## Phase 2: Add Provider Quality Carefully\nGoal: use configured AI providers for deeper output while preserving demo fallback.\n\nLikely files:\n- src/app/api/generate-kit/route.ts\n- src/lib/server-generator.ts\n- src/lib/generation-client.ts\n- src/lib/user-facing-errors.ts\n\nAcceptance criteria:\n- Provider mode reflects the user's exact input.\n- Invalid provider key, timeout, quota, invalid model, and rate limit errors are clear.\n- Demo fallback never destroys user work.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run check:production\n\`\`\`\n\n## Phase 3: Productionize Only After The Core Works\nGoal: add account storage, logs, and provider vault only when the core kit is useful.\n\nLikely files:\n- src/lib/cloud-store.ts\n- src/lib/provider-vault.ts\n- src/lib/generation-logs.ts\n- supabase/migrations/*\n\nAcceptance criteria:\n- Local-first mode still works when Supabase is missing.\n- Provider keys stay server-side in production paths.\n- Generation logs do not contain secrets.\n\n## Do Not Build Yet\n- Team workspaces, billing, or marketplace features before beta users export useful kits.\n- Automatic repo cloning, code copying, or external repo execution.\n- Heavy ${isVideo ? "rendering queues and media storage" : "background automation"} before the first workflow proves demand.`;

  return {
    id: uid("kit"),
    name,
    input: completedInput,
    sections: normalizeSections(sections),
    favorites: {},
    repoRecommendations,
    readinessScore: scoreProject(input),
    generation: {
      mode: "balanced",
      source: "demo",
      generatedAt: now,
      fallbackReason: "No active provider was used.",
    },
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
}

export function regenerateSection(project: ProjectKit, sectionKey: string): ProjectKit {
  const next = { ...project, sections: { ...project.sections }, updatedAt: new Date().toISOString() };
  next.sections[sectionKey] = `${next.sections[sectionKey] ?? ""}\n\n## Regenerated Note\nThis section was refreshed in demo mode. Re-check assumptions, keep scope small, and update downstream tasks if this changes implementation priorities.`;
  return next;
}

export function normalizeSections(sections: Record<string, string>) {
  return Object.fromEntries(
    SECTION_ORDER.map(([key, title]) => [key, sections[key] ?? `## ${title}\nTo be generated.`]),
  );
}

function adaptiveSections({
  name,
  input,
  profile,
  repoLines,
  githubSearchUrls,
  isVideo,
}: {
  name: string;
  input: ProjectInput;
  profile: ProjectProfile;
  repoLines: string;
  githubSearchUrls: string[];
  isVideo: boolean;
}) {
  const stack = input.preferredStack.length
    ? input.preferredStack.join(", ")
    : "Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, localStorage";
  const routes = profile.routes
    .map(
      (route) =>
        `## Screen: ${route.path} — ${route.name}\nPrimary job: ${route.job}.\nKey controls: ${route.controls}.\nStates: loading, empty, active, validation error, and saved confirmation states must fit on mobile without clipped text.`,
    )
    .join("\n\n");
  const entityTypes = profile.entities
    .map(
      (entity) =>
        `type ${entity.name} = {\n${entity.fields.map((field) => `  ${field}: ${fieldType(field)};`).join("\n")}\n}`,
    )
    .join("\n\n");
  const localCollections = profile.entities.map((entity) => `${collectionName(entity.name)}: ${entity.name}[]`).join("\n");
  const tableRows = profile.entities
    .map((entity) => `| ${tableName(entity.name)} | ${entity.purpose} | id, user_id later, ${entity.fields.slice(0, 4).join(", ")} |`)
    .join("\n");
  const apiBlocks = profile.apiEndpoints
    .map(
      (endpoint) => `## ${endpoint.method} ${endpoint.path}
Purpose: ${endpoint.purpose}.

Request body:
${endpoint.method === "GET" ? "None. Use query parameters for filters such as `?status=active` or `?date=YYYY-MM-DD`." : `\`\`\`json
${JSON.stringify(requestExample(endpoint, profile), null, 2)}
\`\`\``}

Response body:
\`\`\`json
${JSON.stringify(responseExample(endpoint, profile), null, 2)}
\`\`\`

Files to implement:
- ${endpointRouteFile(endpoint.path)}
- src/lib/${profile.slug}/validation.ts
- src/lib/${profile.slug}/storage.ts`,
    )
    .join("\n\n");
  const apiSpecBody = profile.apiEndpoints.length
    ? `${apiBlocks}

## Error cases
- 400 invalid_request: required fields are missing or invalid.
- 404 not_found: the requested record does not exist.
- 409 conflict: stale local/cloud version conflict.
- 429 rate_limited: too many provider-backed attempts if provider mode is later added.
- 500 processing_failed: unexpected processing or persistence failure.

## Acceptance criteria
- Request body and response body shapes are typed.
- Invalid input returns a clear message that a non-technical user can act on.
- API keys are never returned in responses.`
    : `## Core MVP API
No API routes are required for the core MVP. Keep the first build fully local-first with seeded data and browser persistence.

## Request body
None for the core MVP. The lesson player reads local seeded data and browser storage.

## Response body
None for the core MVP. UI state is derived from VideoLesson, LessonCard, and PlaybackState records.

## Error cases
- invalid_local_lesson: seeded or edited lesson data does not match the local schema.
- storage_unavailable: IndexedDB/localStorage is blocked or unavailable.
- speech_unavailable: Web Speech API is not supported; show text narration and keep playback usable.

## Local Modules Instead Of API Routes
- src/data/seed-lessons.ts: seeded lesson content.
- src/lib/${profile.slug}/storage.ts or src/lib/local-lessons.ts: local persistence.
- src/lib/${profile.slug}/validation.ts or src/lib/lesson-schema.ts: typed lesson/card validation.

## Future API Routes
- Add import/export or cloud sync routes only after the local player workflow works.
- Keep optional routes behind clear user actions; never require API keys for the first lesson.

## Acceptance criteria
- The app works offline after initial load where browser capabilities allow it.
- No core action depends on Supabase, Auth, Gemini, OpenRouter, or provider credentials.
- Any future API route validates input and returns user-safe errors.`;
  const taskBlocks = profile.tasks
    .map(
      (task, index) => `### Task ${index + 1}: ${task.title}
Files:
${task.files.map((file) => `- ${file}`).join("\n")}

Implementation notes:
- ${task.notes}
- Keep the UI specific to ${profile.label}; do not reuse generic output-generator screens unless the app actually needs them.

Acceptance criteria:
- ${task.acceptance}
- The flow remains local-first and usable without API keys.

Dependencies:
- ${index === 0 ? "None; start here." : `Complete Task ${index} first.`}

Test command:
\`\`\`powershell
${task.command}
\`\`\``,
    )
    .join("\n\n");
  const routeFlow = profile.routes.map((route, index) => `${index + 1}. User opens ${route.path} to ${route.job}.`).join("\n");
  const providerLine = profile.usesAiProvider
    ? "Optional provider mode may improve generated content, but demo/local mode must remain complete."
    : "No AI provider is required for the core workflow; keep provider settings out of the MVP unless the user asks.";

  return {
    "product-strategy": `## Product Brief
${name} is a ${profile.label} that helps ${profile.targetUsers} produce ${profile.desiredOutput} through one focused local-first workflow.

## Target Users
- Primary users: ${profile.targetUsers}
- Skill level assumption: ${input.skillLevel}
- Budget constraint: ${input.budgetSensitivity}
- Immediate job: ${profile.primaryAction}

## Outcome
${name} is a ${profile.label} for ${profile.targetUsers}. It solves: ${profile.problem}.

The first version should deliver ${profile.desiredOutput}.

## Primary Persona
- User: ${profile.targetUsers}
- Skill level: ${input.skillLevel}
- Budget sensitivity: ${input.budgetSensitivity}
- Main job: ${profile.primaryAction}.

## Job To Be Done
When ${profile.targetUsers} face ${profile.problem}, they can use ${name} to ${profile.primaryAction} and get ${profile.desiredOutput} without technical setup.

## Product Promise
The app should feel like a small, finished workflow for ${profile.label}, not a generic generator. Every screen, data object, task, and export should use this domain's language.

## Success Metrics
- ${profile.successMetric}.
- User can complete the first workflow without an account or API key.
- User can reopen previous local results after refreshing the browser.
- A coding agent can begin from TASKS.md without asking for another brief.`,
    "mvp-scope": `## Feature Scope
The MVP focuses only on the workflow that lets ${profile.targetUsers} ${profile.primaryAction}.

## MVP Requirements
${profile.mvp.map((item) => `- ${item}`).join("\n")}

## Build First
${profile.mvp.map((item) => `- ${item}`).join("\n")}

## Acceptance Criteria
- ${profile.targetUsers} can ${profile.primaryAction} without technical knowledge.
- The MVP produces ${profile.desiredOutput}.
- Demo/local mode works without API keys, accounts, or paid services.
- Mobile layouts stack cleanly and no important text is clipped.

## Do Not Build Yet
${profile.avoid.map((item) => `- ${item}`).join("\n")}
- Automatic repo cloning, code copying, billing, or team workspaces before the first workflow is proven.
${isVideo ? "- Heavy video rendering pipelines before validating the content-planning workflow.\n" : ""}`,
    "feature-roadmap": `## Phase 0: Domain Fit Check
- Generate the kit from natural-language input.
- Confirm all sections use ${profile.label} language, routes, data, and tasks.
- Reject sections that still describe an unrelated template.

## Phase 1: Working MVP
${profile.mvp.slice(0, 4).map((item) => `- ${item}`).join("\n")}

## Phase 2: Better Workflow
- Add editing, filtering, export, and clearer empty/error states.
- Add optional cloud sync only after local-first usage is proven.

## Phase 3: Production Readiness
- Add authentication, owner-scoped records, monitoring, and provider hardening only when needed.

## Phase 4: Launch
- Publish a demo, test the core workflow, and collect feedback from ${profile.launchAudience[0]}.`,
    "stack-recommendation": `## Technical Architecture
The system should stay local-first first, then add server/cloud/provider layers only when they improve ${profile.desiredOutput}.

## Architecture Overview
${name} should be built as a local-first ${profile.label}. The app should help ${profile.targetUsers} ${profile.primaryAction} and produce ${profile.desiredOutput}.

## Frontend
${profile.routes.map((route) => `- ${route.path}: ${route.name} for ${route.job}.`).join("\n")}
- Domain components live in src/components/${profile.slug}/.
- Shared local-first helpers live in src/lib/${profile.slug}/.

## Backend And API Layer
${profile.apiEndpoints.map((endpoint) => `- ${endpoint.method} ${endpoint.path}: ${endpoint.purpose}.`).join("\n")}
- Validate every route with Zod before reading or writing data.
- Keep server routes optional when localStorage is enough for the MVP.

## Storage
- Default storage: localStorage typed through src/lib/${profile.slug}/storage.ts.
- Core entities: ${profile.entities.map((entity) => entity.name).join(", ")}.
- Supabase can be added later for auth, sync, RLS, and shared records.

## Provider Layer
- ${providerLine}
- Provider failure must never erase local progress or saved records.

## Deployment
- Vercel is the recommended deployment path.
- Environment variables are optional for the local-first MVP.

## Recommended Stack
- ${stack}
- Zod for validation.
- lucide-react for common action icons.
- JSZip/export helpers only for kit/export surfaces that need them.

## Risks & Edge Cases
- Overbuilding production systems before ${profile.successMetric}.
- Reusing generic templates that do not match ${profile.label}.
- Reference repos must stay URL-only until license review and explicit approval.`,
    "repo-tool-map": `## Reference Policy
Repo references are URLs and implementation inspiration only. Do not clone repositories automatically. Do not copy source code without license review and explicit user approval.

## Recommended References
${repoLines}

## GitHub Discovery URLs
Use these searches to find references for ${profile.label}; inspect README/docs only unless reuse is approved:
${githubSearchUrls.map((url) => `- ${url}`).join("\n")}

## Agent Discovery Prompt
Find 5 reference repositories for a ${profile.label}. Use them only for route structure, package choices, and implementation patterns. Do not clone or copy code unless the user explicitly approves license review and code reuse.

## How The Coding Agent Should Use Repo URLs
- Read README/docs for patterns.
- Extract architecture ideas, not source code.
- Prefer official package installation over copying files.
- Keep ${name}'s MVP smaller than the reference repo.`,
    "database-schema": `## Data Models
The MVP data model centers on ${profile.entities.map((entity) => entity.name).join(", ")} and keeps records exportable.

## Local MVP Collections
\`\`\`ts
${localCollections}
projectKits: ProjectKit[]
\`\`\`

## Domain Types
\`\`\`ts
${entityTypes}
\`\`\`

## ProjectKit Export Wrapper
\`\`\`ts
type ProjectKit = {
  id: string;
  name: string;
  sections: Record<string, string>;
  repoRecommendations: RepoRecommendation[];
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## Supabase Production Tables
| Table | Purpose | Key Columns |
|---|---|---|
${tableRows}
| project_kits | Stores exported planning kits | id, user_id, name, sections_json, created_at, updated_at |

## RLS And Index Notes
- Add user_id to production tables before cloud sync.
- Enable RLS and owner-scoped select/insert/update policies.
- Add indexes for status, owner, updated_at, and the main list filters.

## Acceptance Criteria
- Local mode works with no database.
- Cloud mode is owner-scoped with RLS.
- Old local records can still open after schema additions.`,
    "api-specification": `## API Contract Principles
All API routes must validate input with Zod, return structured user-facing errors, and never log secrets. For the MVP, skip API routes when browser storage fully covers the flow.

${apiSpecBody}

Test command:
\`\`\`powershell
npm.cmd run lint
npm.cmd run build
\`\`\``,
    "ui-screens": `## Component Plan
- Domain components: src/components/${profile.slug}/
- Local storage helpers: src/lib/${profile.slug}/storage.ts
- Validation helpers: src/lib/${profile.slug}/validation.ts
- Export helpers: src/lib/${profile.slug}/export.ts

${routes}

## Responsive Rules
- Mobile-first layout for ${profile.targetUsers}.
- Common actions use lucide-react icons with accessible labels.
- No nested cards; use compact sections and repeated item cards only where useful.
- Long labels wrap cleanly and do not overlap controls.`,
    "user-flows": `## Core User Flow
The primary flow is: ${profile.primaryAction}, persist it locally, then export or reopen the result.

## Happy Path: First Local Workflow
${routeFlow}
${profile.routes.length + 1}. App saves the result locally and shows the next recommended action.

Success criteria: ${profile.successMetric}.

## Happy Path: Reopen Previous Progress
1. User refreshes or returns later.
2. App reads local records from storage.
3. User opens the latest saved item or progress state.
4. User continues without signing in.

## Failure Path: Invalid Input
1. User submits missing or invalid fields.
2. App keeps their input on screen.
3. Field-level messages explain exactly what to fix.
4. No partial or broken record is saved.

## Failure Path: Optional Provider Or Sync Fallback
1. Optional provider, cloud sync, or external service fails.
2. App keeps local data available.
3. User can continue in demo/local mode.
4. Coding agent uses repo URLs as inspiration only and does not clone automatically.`,
    "ai-handoff": `## Purpose
This is the single-file implementation brief for Codex, Cline, Cursor, Claude Code, or another coding agent. It describes the actual product to build, not the VibeForge generator.

## Project Snapshot
- Project: ${name}
- App type: ${profile.label}
- Target users: ${profile.targetUsers}
- Problem: ${profile.problem}
- Desired output: ${profile.desiredOutput}
- Timeline: ${input.timeline}
- Skill level: ${input.skillLevel}
- Budget sensitivity: ${input.budgetSensitivity}
- Preferred stack: ${stack}
- Core provider rule: ${providerLine}

## Upload These Files Together
1. AI_HANDOFF.md
2. PRODUCT_REQUIREMENTS.md
3. MVP_SCOPE.md
4. ARCHITECTURE.md
5. DATABASE_SCHEMA.md
6. API_SPEC.md
7. UI_SCREENS.md
8. USER_FLOWS.md
9. TASKS.md
10. IMPLEMENTATION_PHASES.md
11. TEST_PLAN.md
12. SECURITY_CHECKLIST.md

## Primary Agent Prompt
\`\`\`text
You are the implementation agent for ${name}, a ${profile.label}. Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, DATABASE_SCHEMA.md, API_SPEC.md, UI_SCREENS.md, USER_FLOWS.md, TASKS.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md before editing. Implement only the first task from TASKS.md. Build the smallest local-first workflow for: ${profile.desiredOutput}. Do not add unrelated generator, provider, account, billing, or repo-cloning behavior. Before editing, inspect the files named by the task. After editing, run the listed command and report changed files, checks run, and risks.
\`\`\`

## Repository Safety
- Do not clone external repositories automatically.
- Use repo URLs only for README/docs, architecture ideas, package choices, and implementation patterns.
- Do not copy source code from reference repos without license review and explicit user approval.

## Quality Gate
- The implementation visibly matches ${profile.label}.
- The main routes are ${profile.routes.map((route) => route.path).join(", ")}.
- The data model includes ${profile.entities.map((entity) => entity.name).join(", ")}.
- The core flow works without API keys.

## Definition Of Done
- The implemented task satisfies its acceptance criteria.
- Lint/build/check commands pass, or the root cause is reported.
- No secrets, external repo code, or unrelated rewrites are introduced.`,
    "task-plan": `## Implementation Tasks
Each task is designed for a coding agent to execute with concrete files, acceptance criteria, dependencies, and a command.

## Phase 1: Working ${profile.label} MVP

${taskBlocks}

## Phase 2: Polish The Domain Workflow
- Improve filters, empty states, keyboard/focus behavior, and export formatting.
- Add small analytics or local checklist only if it helps prove ${profile.successMetric}.

## Phase 3: Production Features
- Add account sync, RLS, monitoring, and provider-backed enhancements only after local MVP validation.

## Do Not Build Yet
${profile.avoid.map((item) => `- ${item}`).join("\n")}
- Automatic repo cloning or external code execution.`,
    "implementation-phases": `## Phase 0: Validate The Brief
Goal: confirm this kit describes ${profile.label}, not a generic template.

Files to review:
- PRODUCT_REQUIREMENTS.md
- MVP_SCOPE.md
- UI_SCREENS.md
- TASKS.md

Acceptance criteria:
- The target users, routes, data entities, and tasks match ${profile.label}.
- The MVP avoids risky features that do not fit ${input.timeline}.
- Repo references are URL-only and include do-not-clone guidance.

Test command:
\`\`\`powershell
npm.cmd run check:product
\`\`\`

## Phase 1: Build The Smallest Working Flow
Goal: ${profile.primaryAction} and save the result locally.

Likely files:
${profile.tasks[0]?.files.map((file) => `- ${file}`).join("\n") ?? "- src/app/page.tsx"}

Acceptance criteria:
- User can complete the primary flow without API keys.
- Local data survives refresh.
- Empty, loading, and error states are clear.

Test command:
\`\`\`powershell
${profile.tasks[0]?.command ?? "npm.cmd run build"}
\`\`\`

## Phase 2: Add The Remaining MVP Screens
Goal: implement ${profile.routes.map((route) => route.name).join(", ")}.

Acceptance criteria:
- All main routes render and use domain-specific labels.
- The app avoids unrelated project-generator or output-preview terminology.

## Phase 3: Productionize Only After The Core Works
Goal: add accounts, cloud storage, logs, and optional provider features only when useful.

Acceptance criteria:
- Local-first mode still works when Supabase/provider settings are missing.
- No generation logs or provider secrets leak to the browser.`,
    "test-plan": `## Test Checklist
Use this checklist before handing the project to users or a coding agent.

## Test Strategy
The test plan should prove that ${profile.targetUsers} can use the ${profile.label} MVP without hidden setup.

## Manual Flow Checklist
${profile.tests.map((item) => `- ${item}`).join("\n")}
- Refresh the browser and confirm local data is still available.
- Export Markdown, JSON, and ZIP from the VibeForge kit.
- Copy one generated section and confirm Markdown stays readable.
- Regenerate one section and confirm only that section changes.
- Confirm no core flow requires a real API key.

## Automated Checks
| Check | Purpose | Command |
|---|---|---|
| Lint | Catch invalid React/TypeScript patterns | npm.cmd run lint |
| Build | Catch route, type, and bundling failures | npm.cmd run build |
| Product check | Ensure kit sections, templates, repo lanes, and exports exist | npm.cmd run check:product |
| Export check | Ensure Markdown/JSON/ZIP/agent packs still map to files | npm.cmd run check:exports |

## Acceptance Criteria
- The core ${profile.label} workflow works in demo/local mode.
- Failed optional services do not erase local data.
- TASKS.md includes file paths, acceptance criteria, dependencies, and test commands.`,
    "launch-kit": `## Launch/Export Notes
Export the kit only after the local workflow, history reopen, copy/regenerate, and ZIP/JSON/Markdown checks are verified.

## Positioning
One-line pitch: ${name} helps ${profile.targetUsers} ${profile.primaryAction} through a focused ${profile.label} workflow.

## Demo Script
1. Open the app at /.
2. Show the primary action: ${profile.primaryAction}.
3. Complete the first local workflow.
4. Refresh the browser and show saved progress or records.
5. Open the next most important route: ${profile.routes[1]?.path ?? "/"}.
6. Export or copy the result if the workflow supports it.

## Beta Audience
${profile.launchAudience.map((item) => `- ${item}`).join("\n")}

## Launch Checklist
- Seed realistic demo data for ${profile.label}.
- Verify mobile layout on the primary route.
- Verify local-first storage and reset behavior.
- Verify no API key is required for the core flow.
- Publish a public demo without requiring login.

## Success Metrics
- ${profile.successMetric}.
- 60% of beta users complete the primary workflow.
- 25% return within 48 hours.`,
    "next-actions": `## Next 5 Actions
1. Review UI_SCREENS.md and confirm the routes match ${profile.label}.
2. Open TASKS.md and implement Task 1 only.
3. Build the local data model: ${profile.entities.map((entity) => entity.name).join(", ")}.
4. Run the listed task command, then run npm.cmd run build.
5. Export Codex Pack or ZIP only after the first workflow is verified.

## First Coding-Agent Handoff
Use this prompt:
\`\`\`text
Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, DATABASE_SCHEMA.md, API_SPEC.md, UI_SCREENS.md, TASKS.md, and SECURITY_CHECKLIST.md. Implement the first task only for ${name}, a ${profile.label}. Preserve local-first behavior. Do not add unrelated generator/provider/account features. Do not clone external repos automatically. Before editing, inspect the files listed in TASKS.md. After editing, run the listed test command and report changed files, checks, and risks.
\`\`\`

## Review Questions Before Building More
- Does every screen use ${profile.label} language?
- Can ${profile.targetUsers} complete the primary action?
- Does every task name files, acceptance criteria, dependencies, and a command?
- Can the app work without API keys?`,
    "codex-cline-prompts": `## Agent Prompts
Use these prompts after exporting the kit. They preserve local-first behavior and repo safety rules.

## Codex Implementation Prompt
\`\`\`text
You are implementing ${name}, a ${profile.label}. Read AGENTS.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, DATABASE_SCHEMA.md, API_SPEC.md, UI_SCREENS.md, TASKS.md, TEST_PLAN.md, and SECURITY_CHECKLIST.md first. Implement the next task from TASKS.md only. Preserve local-first behavior and the routes/data model in the kit. Do not add unrelated generator screens, provider setup, billing, team workspaces, or repo cloning. Run the listed command and report changed files, checks, and risks.
\`\`\`

## Cline Implementation Prompt
\`\`\`text
Use this kit as the source of truth for ${profile.label}. Start with the smallest visible workflow: ${profile.primaryAction}. Keep edits focused, inspect target files before changing them, and avoid paid services unless TASKS.md explicitly asks for them.
\`\`\`

## Cursor Implementation Prompt
\`\`\`text
Read PROJECT_BRIEF.md, UI_SCREENS.md, TASKS.md, API_SPEC.md, and DATABASE_SCHEMA.md. Implement the next milestone with minimal file changes. Use existing app patterns, domain-specific labels, and localStorage-first persistence.
\`\`\`

## Claude Code Review Prompt
\`\`\`text
Review this implementation for broken local-first behavior, generic-template leakage, missing validation, export regressions, leaked secrets, weak error states, and unapproved repo code reuse. Findings first, then residual risks.
\`\`\`

## Section Regeneration Prompt
\`\`\`text
Regenerate only the requested section for ${name}. It must stay specific to ${profile.label}, ${profile.targetUsers}, ${profile.problem}, and ${profile.desiredOutput}. Include concrete file paths, acceptance criteria, test commands, repo URL policy, and coding-agent instructions. Do not return generic output-generator advice.
\`\`\``,
  };
}

function fieldType(field: string) {
  const lower = field.toLowerCase();
  if (lower.includes("at") || lower.includes("date")) return "string";
  if (lower.includes("score") || lower.includes("count") || lower.includes("price") || lower.includes("quantity") || lower.includes("stock") || lower.includes("duration") || lower.includes("minutes")) return "number";
  if (lower.includes("words") || lower.includes("choices") || lower.includes("questions") || lower.includes("sentences")) return "string[]";
  if (lower.includes("completed") || lower.includes("enabled")) return "boolean";
  return "string";
}

function requestExample(endpoint: ProjectProfile["apiEndpoints"][number], profile: ProjectProfile) {
  const primary = profile.entities[0];
  const target = entityForEndpoint(endpoint, profile) ?? primary;
  const payload = Object.fromEntries(
    (target?.fields ?? ["title", "input"])
      .filter((field) => !["id", "createdAt", "updatedAt", "completedAt"].includes(field))
      .slice(0, endpoint.method === "PATCH" ? 4 : 8)
      .map((field) => [field, sampleValue(field)]),
  );

  return {
    clientRequestId: "req_demo_123",
    payload,
  };
}

function responseExample(endpoint: ProjectProfile["apiEndpoints"][number], profile: ProjectProfile) {
  const target = entityForEndpoint(endpoint, profile) ?? profile.entities[0];
  const record = target ? sampleEntity(target) : { id: "record_demo_123" };
  return {
    ok: true,
    data: endpoint.method === "GET" && !endpoint.path.includes("[") ? [record] : record,
    error: null,
  };
}

function entityForEndpoint(endpoint: ProjectProfile["apiEndpoints"][number], profile: ProjectProfile) {
  const haystack = `${endpoint.path} ${endpoint.purpose}`.toLowerCase();
  return profile.entities.find((entity) => {
    const name = entity.name.toLowerCase();
    const table = tableName(entity.name).replace(/_/g, "-");
    return haystack.includes(name) || haystack.includes(table) || entity.purpose.toLowerCase().split(" ").some((word) => word.length > 5 && haystack.includes(word));
  });
}

function sampleEntity(entity: ProjectProfile["entities"][number]) {
  return Object.fromEntries(entity.fields.slice(0, 10).map((field) => [field, sampleValue(field)]));
}

function sampleValue(field: string) {
  const lower = field.toLowerCase();
  if (lower === "id" || lower.endsWith("id")) return `${lower.replace(/id$/, "") || "record"}_demo_123`;
  if (lower.includes("date") || lower.includes("at") || lower.includes("deadline")) return "2026-06-10T09:00:00.000Z";
  if (lower.includes("minutes") || lower.includes("duration") || lower.includes("dayindex") || lower.includes("score") || lower.includes("count")) return 25;
  if (lower.includes("status")) return "active";
  if (lower.includes("level")) return "beginner";
  if (lower.includes("goal")) return "Practice business English for 25 minutes per day";
  if (lower.includes("subject")) return "Business English";
  if (lower.includes("style")) return "short daily exercises";
  if (lower.includes("areas")) return ["speaking", "listening"];
  if (lower.includes("milestones")) return ["Week 1: build core vocabulary", "Week 2: practice short conversations"];
  if (lower.includes("dailyplan")) return ["Day 1: vocabulary drill", "Day 2: listening practice"];
  if (lower.includes("instructions")) return "Complete one focused practice exercise and mark it done.";
  if (lower.includes("prompt")) return "Review yesterday's weak vocabulary and answer one applied question.";
  if (lower.includes("label")) return "Complete today's practice exercise";
  if (lower.includes("source") || lower.includes("mode")) return "demo";
  if (lower.includes("provider") || lower.includes("model")) return "";
  return `${field}_demo`;
}

function collectionName(name: string) {
  return `${name.charAt(0).toLowerCase()}${name.slice(1)}Records`;
}

function tableName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function endpointRouteFile(endpointPath: string) {
  return `src/app${endpointPath}/route.ts`;
}

export function inferName(idea: string) {
  const asciiIdea = idea
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  const lowerIdea = asciiIdea.toLowerCase();
  if (/\b(video-style|video style|timed cards|lesson player|video lesson)\b/.test(lowerIdea)) {
    return "Local-First English Video-Style Lesson App";
  }
  if (/\b(ai video app|product showcase videos?|product videos?|video app|short social videos?|video content plan|storyboard)\b/.test(lowerIdea)) {
    return "AI Video App For Small Shops";
  }
  if (/\b(content planner|content plan|social media|instagram|tiktok|caption|hashtags)\b/.test(lowerIdea)) {
    return "Weekly Social Media Content Planner";
  }
  if (/\b(local crm|crm for freelancers|freelancer crm|client pipeline|client follow-up|follow-ups|proposal tracking)\b/.test(lowerIdea)) {
    return "Local CRM For Freelancers";
  }
  if (/\b(habit tracker|habit tracking|daily habits|streaks|check-ins|check in|routine tracker|mobile habit)\b/.test(lowerIdea)) {
    return "Habit Tracker Mobile App";
  }
  if (/\b(tieng anh|english|vocabulary|listening|quiz)\b/.test(lowerIdea)) {
    return "Easy English Daily";
  }

  const clean = asciiIdea
    .replace(/^i want to build\s+/i, "")
    .replace(/^toi muon (lam|tao|xay dung)\s+/i, "")
    .replace(/^build\s+/i, "")
    .replace(/^create\s+/i, "")
    .split(/[.?!]/)[0]
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = clean.split(/\s+/);
  // Use up to 10 words, but try to end at a natural break
  const maxWords = Math.min(words.length, 10);
  let endIdx = maxWords;
  // Try to avoid cutting mid-phrase by trimming trailing prepositions/articles
  const trailingStopWords = ["for", "from", "with", "and", "the", "a", "an", "to", "in", "of", "that", "which"];
  while (endIdx > 3 && trailingStopWords.includes(words[endIdx - 1]?.toLowerCase())) {
    endIdx--;
  }
  const name = words
    .slice(0, endIdx)
    .join(" ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return name || "New Project";
}

export function scoreProject(input: ProjectInput): ReadinessScore {
  const source = `${input.appType} ${input.idea} ${input.desiredOutput ?? ""}`.toLowerCase();
  const isVideo = /\bvideo\b|showcase|storyboard|product photos/.test(source);
  const isLearningPlanner = /lesson plan|practice exercises|review schedule|progress checklist|adult learners|learning app/.test(source);
  const isLeadAutomation = /lead generation|lead capture|lead scoring|qualified leads|crm push|slack notification|n8n|workflow/.test(source);
  const detailScore =
    45 +
    Math.min(input.idea.length, 180) / 4 +
    (input.targetUsers ? 8 : 0) +
    (input.problem ? 8 : 0) +
    (input.desiredOutput ? 8 : 0);
  const cap = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  return {
    productClarity: cap(detailScore),
    mvpFocus: cap(input.timeline.includes("7") || input.timeline.includes("day") ? 84 : 74),
    technicalFeasibility: cap(input.skillLevel === "Non-coder" ? 76 : 86),
    costEfficiency: cap(input.budgetSensitivity === "high" ? 88 : 78),
    agentReadiness: 86,
    launchReadiness: cap(input.targetUsers ? 78 : 66),
    strengths: [
      "Clear exportable artifact workflow",
      "Browser-storage path keeps the MVP usable without accounts or API keys",
      "Repo recommendations are separated by direct use, workflow, and reference",
    ],
    risks: [
      "Provider usage needs cost and quota monitoring before production growth",
      "Reference repos require license review before code reuse",
      isVideo
        ? "Video rendering should wait until storyboard demand is validated"
        : isLearningPlanner
          ? "Provider-generated learning content needs review before learners rely on it"
          : isLeadAutomation
            ? "Real CRM, Slack, n8n, and provider credentials should stay optional until the local workflow proves routing value"
            : "Production-only integrations should wait until the first workflow is validated",
    ],
    nextActions: [
      "Open TASKS.md and approve the first build task",
      "Export the Codex or Cline pack for the selected coding agent",
      "Build the smallest working product workflow before adding paid services",
    ],
  };
}

export function projectSlug(project: ProjectKit) {
  return slugify(project.name);
}
