import type { GenerationMode, ProjectInput, ProjectKit, ProviderSettings } from "@/types/vibeforge";
import { SECTION_ORDER, sectionTitle } from "@/lib/kit-sections";
import { recommendRepos } from "./repo-data";
import {
  buildProjectKit,
  generateMockKit,
  inferName,
  normalizeSections,
  regenerateSection,
} from "@/lib/generator-shared";
import { completeProjectInput, deriveProjectProfile } from "@/lib/project-profile";
import { selectAppTemplate } from "@/lib/templates";

const SYSTEM_PROMPT = `You are a world-class Principal Software Architect, Principal Product Architect, AI Workflow Engineer, and Vibe Coding Coach with 20+ years of experience designing and building high-performance, production-grade SaaS systems.

Your mission: Convert raw app ideas into extremely high-fidelity, production-grade, and 100% implementation-ready project kits that a development team or AI coding agent (Cursor, Cline, Aider, Claude Code) can execute immediately with zero errors.

## Quality Standards (Principal Engineer Caliber)
- **Absolute Specificity**: Never use placeholder text like "TBD", "TODO", "Add later", or "[insert here]". Every recommendation must be detailed and contextually customized.
- **Copy-Pasteable Schemas**: Do not just describe tables. Provide complete, valid SQL CREATE TABLE DDL commands, including exact columns, datatypes (UUID, VARCHAR, TIMESTAMP, etc.), PRIMARY KEY, FOREIGN KEY constraints, INDEXES, default values, and Supabase Row Level Security (RLS) policies.
- **High-Fidelity API Specifications**: Provide full, syntactically correct JSON mock payloads for both request body and response body of every endpoint. Include explicit error responses (400, 401, 403, 404, 500) and matching TypeScript interfaces.
- **Executable AI Handoff Tasks**: The Task Plan must be a sequence of 2-4 hour tasks. Each task must explicitly state:
  1. File paths to read and file paths to modify.
  2. Concrete implementation guidelines.
  3. Direct copy-pasteable prompt text to feed to the AI coding agent.
  4. Precise acceptance criteria.
  5. CLI commands to verify the work (e.g., \`npm run test\`, \`tsc --noEmit\`).
- **Resilient Engineering Guardrails**:
  - Enforce absolute type safety: Strictly forbid the use of the \`any\` type. Use explicit interfaces and return typings.
  - Implement strict data validation using Zod schemas for all API payloads and forms.
  - Establish a solid global error-handling boundary, client-side toast notifications, and detailed telemetry log shapes.
  - Formulate a local-first offline fallback strategy for every external service or database interaction.
- **Folder and Component Hierarchy**: Specify the exact file path structure (e.g., \`src/components/dashboard/PriorityList.tsx\`), outlining exact props typing, responsive CSS behavior, state management (loading, empty, error, active), and transition effects.
- **Security Checklists**: Detail explicit rules for API rate-limiting, secure cookie settings, CORS origins, environment variable sanitation, and Supabase RLS policies.

Favor robust, shippable, and production-ready designs. Be opinionated and explain the exact engineering tradeoffs (rationales) behind every decision.`;

const VIBE_CODING_SYSTEM_PROMPT = `You are the VibeForge generation engine: a Principal Software Architect, Principal Product Architect, and AI Coding Workflow Engineer.

Mission: Convert the user's exact input into an elite, implementation-ready project kit that Codex, Cline, Cursor, Claude Code, or another AI coding agent can immediately build with zero guesswork and zero mistakes.

## Non-negotiable output contract
- Return practical, high-fidelity Markdown for every requested section. Absolutely no placeholders, no generic boilerplate, and no vague advice.
- Perfectly capture and align with the user's idea, target persona, core problem, desired output, app type, timeline, skill level, budget, preferred stack, providers, MCP requirements, and automation needs.
- Every major section must visibly reuse the user's actual domain words, audience, workflow, and desired output. If the idea is an English-learning app, write lesson, practice, progress, AI tutor, learner, curriculum, speaking, listening, and spaced repetition details. If it is a clinic app, write appointment, patient, staff role, clinic workflow, and health-data safety details.
- When the user's input is short, infer a complete but conservative product from the domain. Do not ask for more information, do not say "depends", and do not return generic template text.
- Every recommendation must explain WHY it is chosen for this specific project and detail the tradeoffs created.
- Include concrete file paths, route paths, component names, database table names, SQL DDL statements, API endpoints, request/response JSON payloads, Zod schemas, acceptance criteria, and terminal commands.
- Keep the MVP small, modular, and shippable. Add a clear "Do not build yet" list for features that are high-risk, expensive, or too complex for the current timeline.
- Repo references are URL-only inspiration. Never instruct the AI agent to clone repositories automatically. Do not copy code without license compliance and user authorization.
- Coding-agent prompts in the Task Plan must be directly executable: specify files to read, files to edit, exact features to code, things to avoid modifying, and the validation checks to run.

## Required section behavior
- **Product Requirements**: Clear outcome, target personas with demographics, competitive analysis, unique value proposition, success metrics with KPIs, and non-goals.
- **MVP Scope**: Explicit feature list prioritized (P0/P1/P2), what to build first, what NOT to build yet, and precise acceptance criteria.
- **Architecture**: In-depth breakdown of frontend, backend/API, storage/database, AI provider layers, authentication, CI/CD deployment, observability, and technical risks.
- **Repo References**: Repo/tool URLs, why they are useful, how the AI should reference them, and no-clone safeguards.
- **Database Schema**: Full database schema with valid SQL CREATE TABLE DDL commands, relationships, indexes, local-first mock structures, and Supabase RLS rules.
- **API Specification**: Complete endpoint list with HTTP methods, full request/response JSON bodies, Zod validation models, error handling strategies, and files to edit.
- **UI Screens**: Detailed page/screen layouts, precise React component folder hierarchy, props interfaces, active/empty/loading states, CSS transitions, and accessibility guidelines.
- **User Flows**: Happy path user journeys, edge cases, error states, AI provider fallbacks, and local export/import behaviors.
- **Task Plan and Implementation Phases**: Highly granular phased tasks (2-4 hours each). Each task must contain title, file paths, executable AI prompts, concrete acceptance criteria, CLI test/verification commands, and dependencies.
- **Test Plan**: Manual verification steps, automated unit tests, and E2E playbooks with terminal test commands.
- **Security Checklist**: Environment variables, secure cookies, rate limiting, SQL injection defense, CORS, input sanitization, and RLS validation.
- **AI Handoff Brief**: A single copy-pasteable master brief for AI coding agents detailing project snapshot, files to read first, main instructions, constraints, quality gates, and definition of done.
- **Vibe Coding Prompts**: Actionable prompt snippets for Cursor, Cline, Claude Code, Aider, and section regeneration.
- **Next Actions**: The next five immediate, build-first steps a developer must take.

Depth rules:
- Fast mode: Concise but still concrete, actionable, and specific; prioritize P0 scope, tasks, and next actions.
- Balanced mode: Rich practical detail across all sections; enough for a senior engineer to begin coding.
- Deep mode: Maximum detail; include full SQL schemas, JSON API examples, phased breakdowns, security setups, and concrete verification commands.

Return only valid JSON when the user asks for JSON.`;

const PROVIDER_SYSTEM_PROMPT = `${VIBE_CODING_SYSTEM_PROMPT}

Baseline expertise: ${SYSTEM_PROMPT.split("\n")[0]}`;

const FAST_PROVIDER_SYSTEM_PROMPT = `You are VibeForge's production kit generator.
Return only valid JSON. Be concrete, project-specific, and concise.
Never use placeholders, never clone repos automatically, and never include secrets.
Do not clone repositories automatically; repo references and GitHub search URLs are inspiration only.
Do not reuse a different app template. If the project is an AI video app, never turn it into a weekly social media planner.
Keep the whole response small enough for a serverless API route.`;

const SECTION_KEYS = SECTION_ORDER.map(([key]) => key);
const PROVIDER_TIMEOUT_MS = Number(process.env.VIBEFORGE_PROVIDER_TIMEOUT_MS ?? 50_000);
const CORE_PROVIDER_SECTION_KEYS = [
  "product-strategy",
  "mvp-scope",
  "stack-recommendation",
  "task-plan",
];
const BALANCED_PROVIDER_SECTION_KEYS = [
  ...CORE_PROVIDER_SECTION_KEYS,
  "api-specification",
  "repo-tool-map",
  "ai-handoff",
  "next-actions",
];
const DEEP_PROVIDER_SECTION_KEYS = [
  ...BALANCED_PROVIDER_SECTION_KEYS,
  "database-schema",
  "security-checklist",
  "implementation-phases",
  "test-plan",
  "codex-cline-prompts",
];

type ProviderJson = {
  name?: unknown;
  sections?: unknown;
  section?: unknown;
};

type ChatCompletionResult = {
  content: string | null;
  model: string;
  error?: string;
};

type ProviderGenerationResult = {
  project: ProjectKit | null;
  error?: string;
  model?: string;
};

type ProviderSectionResult = {
  content: string | null;
  error?: string;
  model?: string;
};

export async function generateProjectKitServer(
  input: ProjectInput,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
) {
  const completedInput = completeInputForGeneration(input);
  if (isProviderUsable(provider)) {
    const generated = await generateWithProvider(completedInput, provider, generationMode);
    if (generated?.project) return generated.project;

    return {
      ...generateMockKit(completedInput),
      generation: {
        mode: generationMode,
        source: "demo" as const,
        generatedAt: new Date().toISOString(),
        fallbackReason: generated?.error ?? "Provider generation failed; demo fallback was used.",
      },
    };
  }

  return {
    ...generateMockKit(completedInput),
    generation: {
      mode: generationMode,
      source: "demo" as const,
      generatedAt: new Date().toISOString(),
      fallbackReason: "No active provider was used.",
    },
  };
}

function completeInputForGeneration(input: ProjectInput) {
  const template = selectAppTemplate(input);
  const profile = deriveProjectProfile(input, template);
  return completeProjectInput(input, profile);
}

export async function regenerateSectionServer(
  project: ProjectKit,
  sectionKey: string,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
) {
  if (!isSectionKey(sectionKey)) return project;

  if (isProviderUsable(provider)) {
    const result = await generateSectionWithProvider(project, sectionKey, provider, undefined, generationMode);
    if (result.content) {
      return withSection(project, sectionKey, result.content);
    }
  }

  return regenerateSection(project, sectionKey);
}

export async function improveSectionServer(
  project: ProjectKit,
  sectionKey: string,
  instruction: string,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
) {
  if (!isSectionKey(sectionKey)) return project;

  if (isProviderUsable(provider)) {
    const result = await generateSectionWithProvider(project, sectionKey, provider, instruction, generationMode);
    if (result.content) {
      return withSection(project, sectionKey, result.content);
    }
  }

  return withSection(
    project,
    sectionKey,
    `${project.sections[sectionKey] ?? ""}\n\n## Improvement Note\n${instruction || "Review this section for clarity, scope, and implementation readiness."}`,
  );
}

function isProviderUsable(provider?: ProviderSettings | null): provider is ProviderSettings {
  if (!provider?.enabled || !provider.baseUrl.trim()) return false;
  if (provider.providerType === "ollama") return true;
  if (!provider.apiKey.trim()) return false;
  return ["openai-compatible", "openrouter", "gemini", "anthropic-compatible", "custom"].includes(
    provider.providerType,
  );
}

function isSectionKey(sectionKey: string) {
  return SECTION_KEYS.some((key) => key === sectionKey);
}

export async function testProviderConnection(provider?: ProviderSettings | null) {
  if (!isProviderUsable(provider)) {
    return { ok: false, message: "Provider is disabled, missing base URL, or missing API key." };
  }

  const model = selectModel(provider, "fast");
  const result = await requestChatCompletion(provider, [
    { role: "system", content: "Return only valid JSON." },
    { role: "user", content: 'Return {"ok":true,"message":"connected"}.' },
  ], "fast");

  if (!result.content) {
    return {
      ok: false,
      message: result.error ?? "Provider request failed. Check the key, credits, model, and base URL.",
      model,
    };
  }

  return { ok: true, message: "Provider connected successfully.", model };
}

async function generateWithProvider(
  input: ProjectInput,
  provider: ProviderSettings,
  generationMode: GenerationMode,
): Promise<ProviderGenerationResult> {
  const recommendations = recommendRepos(input);
  const repoList = recommendations.slice(0, 5).map(rec => ({
    name: rec.tool.name,
    url: rec.tool.url,
    category: rec.tool.category,
    useCase: rec.tool.useCase,
    howToUse: rec.tool.howToUse,
    recommendedLane: rec.lane,
    reason: rec.reason,
    suggestedPrompt: rec.tool.suggestedPrompt
  }));

  const requestedSections = providerSectionKeys(generationMode);
  const wordTarget = providerWordTarget(generationMode, requestedSections.length);
  const result = await requestChatCompletion(provider, [
    { role: "system", content: generationMode === "deep" ? PROVIDER_SYSTEM_PROMPT : FAST_PROVIDER_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Return only valid JSON with this shape: {"name":"Project name","sections":{"section-key":"Markdown content"}}.
Use exactly these section keys and no alternatives: ${requestedSections.join(", ")}.

Rules:
- Return exactly the requested section keys, no extra keys.
- Each section must be ${wordTarget}.
- Use the user's exact domain words.
- In task-plan, use 2-4 concrete tasks. Each task must include labels exactly named "Files:", "Acceptance criteria:", "Dependencies:", and "Test command:".
- Test commands must be real CLI commands such as npm.cmd run lint, npm.cmd run build, npm.cmd run test:e2e, or npx tsc --noEmit.
- Include frontend, backend/API, storage, provider, and deployment in stack-recommendation.
- Follow these section-specific contracts when a key is requested:
${sectionContracts(requestedSections)}
- No placeholders. No generic SaaS/CRUD advice.
- Repo references are URL-only inspiration; do not clone automatically.
- Mention these repo references briefly where relevant:
${JSON.stringify(repoList, null, 2)}
- Include these project anchors: ${projectAnchorTerms(input).join(", ") || "project name, target users, problem, desired output, app type"}.
- Forbidden unrelated terms for this request: ${forbiddenDomainTerms(input).join(", ") || "none"}.
- Any route, schema, API, screen, task, launch metric, or entity must match this exact project input, not a previous template.

Project input:
${JSON.stringify(input, null, 2)}

Generation mode: ${generationModeInstruction(generationMode)}`,
    },
  ], generationMode);

  const parsed = parseProviderJson(result.content);
  if (!parsed) {
    return {
      project: null,
      error: result.error ?? "Provider returned invalid JSON. Demo fallback was used.",
      model: result.model,
    };
  }

  const providerSections = repairProviderSections(input, sectionsFromUnknown(parsed.sections), requestedSections);
  const sectionIssues = providerProjectSectionIssues(input, providerSections, requestedSections);
  const fallbackSectionKeys = Array.from(new Set([
    ...sectionIssues.missing,
    ...sectionIssues.weak.map((issue) => issue.key),
  ]));
  const usableProviderSections = { ...providerSections };
  for (const key of fallbackSectionKeys) delete usableProviderSections[key];

  const validProviderSectionCount = requestedSections.filter((key) => usableProviderSections[key]?.trim()).length;
  if (validProviderSectionCount === 0) {
    return {
      project: null,
      error: sectionIssues.firstMessage ?? "Provider output did not include usable project sections.",
      model: result.model,
    };
  }

  const baseProject = generateMockKit(input);
  const sections = { ...baseProject.sections, ...usableProviderSections };
  const fallbackReason = fallbackSectionKeys.length
    ? `Provider was used, but local fallback filled sections that did not pass quality checks: ${fallbackSectionKeys.map(sectionTitle).join(", ")}. ${sectionIssues.firstMessage ?? ""}`.trim()
    : undefined;

  return {
    project: buildProjectKit(input, sections, typeof parsed.name === "string" ? parsed.name : inferName(input.idea), {
      mode: generationMode,
      source: "provider",
      providerName: provider.providerName,
      model: result.model,
      generatedAt: new Date().toISOString(),
      fallbackReason,
    }),
    model: result.model,
  };
}

async function generateSectionWithProvider(
  project: ProjectKit,
  sectionKey: string,
  provider: ProviderSettings,
  instruction?: string,
  generationMode: GenerationMode = "balanced",
): Promise<ProviderSectionResult> {
  const result = await requestChatCompletion(provider, [
    { role: "system", content: FAST_PROVIDER_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Return only valid JSON with this shape: {"section":"Markdown content"}.
Regenerate only the "${sectionTitle(sectionKey)}" section for this project kit.
Keep it concrete, implementation-ready, and consistent with the other sections.
The regenerated section must be specific to the project input, include file paths, tests, acceptance criteria, dependencies, and repo URL policy where relevant.
Follow this section contract:
${sectionContracts([sectionKey])}
If this is a repo/reference section, include URL-only references and the warning: do not clone repositories automatically.
If this is Task Plan or MVP Scope, the first workflow must be local-first and usable without accounts, Supabase, Gemini, OpenRouter, OpenAI, or provider API keys. Provider work is optional after the demo/local flow works.
Do not return generic SaaS or CRUD advice. Reuse the exact project domain, target users, desired output, timeline, stack, and constraints from the project input.
${instruction ? `Extra instruction: ${instruction}` : ""}

Project:
${JSON.stringify(
  {
    name: project.name,
    input: project.input,
    currentSection: project.sections[sectionKey],
    sectionKey,
  },
  null,
  2,
)}`,
    },
  ], generationMode);

  const parsed = parseProviderJson(result.content);
  if (!parsed) return { content: null, error: result.error ?? "Provider returned invalid JSON.", model: result.model };
  if (typeof parsed.section === "string" && parsed.section.trim()) {
    const repaired = repairProviderSection(project.input, sectionKey, parsed.section);
    const qualityError = validateProviderSection(project.input, sectionKey, repaired);
    if (qualityError) return { content: null, error: qualityError, model: result.model };
    return { content: repaired, model: result.model };
  }

  const sections = sectionsFromUnknown(parsed.sections);
  const content = sections[sectionKey] ? repairProviderSection(project.input, sectionKey, sections[sectionKey]) : null;
  if (content) {
    const qualityError = validateProviderSection(project.input, sectionKey, content);
    if (qualityError) return { content: null, error: qualityError, model: result.model };
  }
  return { content, model: result.model };
}

function providerSectionKeys(generationMode: GenerationMode) {
  if (generationMode === "deep") {
    return DEEP_PROVIDER_SECTION_KEYS;
  }
  if (generationMode === "balanced") {
    return BALANCED_PROVIDER_SECTION_KEYS;
  }
  return CORE_PROVIDER_SECTION_KEYS;
}

function providerWordTarget(generationMode: GenerationMode, sectionCount: number) {
  if (generationMode === "deep") return sectionCount > 8 ? "90-140 words" : "140-220 words";
  if (generationMode === "balanced") return sectionCount > 6 ? "80-130 words" : "120-180 words";
  return "70-110 words";
}

function sectionContracts(sectionKeys: string[]) {
  const contracts: Record<string, string> = {
    "product-strategy": "product-strategy: include Outcome, target users, user problem, success metrics, and non-goals.",
    "mvp-scope": "mvp-scope: include Build First, Acceptance Criteria, Do Not Build Yet, and a local-first demo guarantee.",
    "stack-recommendation": "stack-recommendation: cover frontend, backend/API, storage/database, optional provider layer, deployment, and risks.",
    "task-plan": "task-plan: include 2-4 tasks. Every task must contain Files:, Implementation notes:, Acceptance criteria:, Dependencies:, and Test command:. The first task must build the local/demo workflow before provider work.",
    "api-specification": "api-specification: include endpoint paths, method names, request body, response body, error cases, and files to edit.",
    "repo-tool-map": "repo-tool-map: include GitHub/tool URLs, why each reference helps, how the agent should use it, and do-not-clone guidance.",
    "ai-handoff": "ai-handoff: include Upload These Files Together, Primary Agent Prompt, Quality Gate, and Definition Of Done.",
    "next-actions": "next-actions: list five immediate actions after kit generation; never tell the user to generate the first kit again.",
    "database-schema": "database-schema: include local storage shape, production tables, owner scoping/RLS, indexes, and migration notes.",
    "security-checklist": "security-checklist: include secrets, API validation, rate limits, CORS, RLS/auth, logging, and repo-reference safety.",
    "implementation-phases": "implementation-phases: include Phase 0 through Phase 3 with goals, files, acceptance criteria, and commands.",
    "test-plan": "test-plan: include manual checks, automated checks, export checks, provider-failure checks, and concrete CLI commands.",
    "codex-cline-prompts": "codex-cline-prompts: include copy-paste prompts for Codex, Cline, Cursor, Claude Code, and security review.",
  };

  return sectionKeys
    .map((key) => contracts[key])
    .filter(Boolean)
    .map((line) => `  - ${line}`)
    .join("\n") || "  - Use the general output contract.";
}

function repairProviderSections(
  input: ProjectInput,
  sections: Record<string, string>,
  requestedSections: string[],
) {
  return Object.fromEntries(
    requestedSections.map((key) => [key, repairProviderSection(input, key, sections[key] ?? "")]),
  );
}

function repairProviderSection(input: ProjectInput, sectionKey: string, content: string) {
  const trimmed = content
    .replace(/\bplaceholders?\b/gi, "sample drafts")
    .trim();
  if (!trimmed) return "";

  const anchors = projectAnchorTerms(input).slice(0, 6).join(", ");
  const name = inferName(input.idea);
  const targetUsers = input.targetUsers || "the target users";
  const desiredOutput = input.desiredOutput || "the requested output";
  const appSlug = slugForPath(input.appType || name);
  const localFirstGuardrail = `\n\n## Local-First Guardrail\n- Build the first usable workflow with browser storage, deterministic demo data, and export/copy behavior before any provider work.\n- Optional provider work, Supabase, auth, Gemini, OpenRouter, OpenAI, and paid rendering are follow-up layers after the local demo workflow works.\n- Preserve the user's domain anchors: ${anchors || input.appType || name}.`;

  if (sectionKey === "mvp-scope" && !/local-first|without\s+(?:api\s+keys|accounts)|browser\s+storage|demo\s+workflow/i.test(trimmed)) {
    return `${trimmed}${localFirstGuardrail}`;
  }

  if (sectionKey === "task-plan") {
    let repairedTaskPlan = trimmed;
    if (!/optional\s+provider|provider[\s\S]{0,80}optional/i.test(repairedTaskPlan)) {
      repairedTaskPlan = `${repairedTaskPlan}${localFirstGuardrail}`;
    }
    const hasTaskContract =
      /files:/i.test(repairedTaskPlan) &&
      /acceptance\s+criteria:/i.test(repairedTaskPlan) &&
      /dependencies:/i.test(repairedTaskPlan) &&
      /test\s+command:/i.test(repairedTaskPlan) &&
      /(?:src\/|src\\|\.tsx?|\.md)/i.test(repairedTaskPlan);
    const providerMandatory =
      /\bgemini\b|\bopenrouter\b|\bopenai\b|api\s+calls\s+return|connect\s+(?:gemini|openrouter|openai)|integrate\s+(?:gemini|openrouter|openai)|openai\s+api|provider\s+sdk|pages\/api/i.test(repairedTaskPlan) &&
      !/optional\s+provider|demo\s+generator|local\s+demo|fallback\s+to\s+demo|without\s+(?:an?\s+)?api\s+key/i.test(repairedTaskPlan);

    const taskPatch = `\n\n### Task 0: Prove the local-first ${input.appType || "app"} workflow\nFiles:\n- src/app/page.tsx\n- src/components/${appSlug}/MvpWorkflow.tsx\n- src/lib/${appSlug}/validation.ts\n- src/lib/${appSlug}/local-store.ts\n- src/lib/${appSlug}/export.ts\n\nImplementation notes:\n- Build the smallest workflow for ${targetUsers} to produce ${desiredOutput} without login, Supabase, Gemini, OpenRouter, OpenAI, or provider API keys.\n- Keep provider work as an optional provider layer after the local demo workflow passes.\n- Do not clone external repositories automatically.\n\nAcceptance criteria:\n- A user can enter the minimum project input, see a useful preview, copy/export the result, refresh the page, and reopen saved local work.\n- Empty, loading, validation, provider-disabled, and export states are visible and do not clip on mobile.\n- No API key, account, paid rendering, or cloud database is required for the first workflow.\n\nDependencies:\n- None; complete this before provider integrations, cloud sync, billing, or media rendering.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\nnpm.cmd run check:exports\n\`\`\``;

    if (!hasTaskContract || providerMandatory) {
      return `${repairedTaskPlan}${taskPatch}`;
    }

    return repairedTaskPlan;
  }

  if (sectionKey === "stack-recommendation" && !/frontend[\s\S]*(backend|api)[\s\S]*(storage|database)[\s\S]*(deployment|provider)/i.test(trimmed)) {
    return `${trimmed}\n\n## Required Architecture Coverage\n- Frontend: route-level UI and reusable components for ${targetUsers}.\n- Backend/API: typed route handlers only where the local workflow cannot handle the job.\n- Storage/database: localStorage first, Supabase owner-scoped tables later.\n- Provider layer: optional provider calls with deterministic fallback.\n- Deployment: Vercel build, smoke tests, and rollback notes.`;
  }

  return trimmed;
}

function providerProjectSectionIssues(
  input: ProjectInput,
  sections: Record<string, string>,
  requiredSections: string[],
) {
  const missing = requiredSections.filter((key) => !sections[key]?.trim());
  const weak = requiredSections
    .filter((key) => !missing.includes(key))
    .map((key) => ({ key, message: validateProviderSection(input, key, sections[key] ?? "") }))
    .filter((issue): issue is { key: string; message: string } => Boolean(issue.message));

  let genericMessage: string | null = null;
  const all = Object.values(sections).join("\n").toLowerCase();
  const leakedTerms = forbiddenDomainTerms(input).filter((term) => all.includes(term.toLowerCase()));
  if (leakedTerms.length) {
    genericMessage = `Provider output leaked unrelated template terms: ${leakedTerms.slice(0, 6).join(", ")}.`;
  }
  const anchors = projectAnchorTerms(input);
  const anchorHits = anchors.filter((term) => all.includes(term.toLowerCase()));
  const minimumHits = Math.min(4, Math.max(2, Math.ceil(anchors.length / 4)));
  if (!genericMessage && anchors.length >= 4 && anchorHits.length < minimumHits) {
    genericMessage = `Provider output is too generic. It did not reuse enough project-specific terms. Expected terms like: ${anchors.slice(0, 8).join(", ")}.`;
  }

  return {
    missing,
    weak,
    firstMessage: missing.length
      ? `Provider output is incomplete. Missing required sections: ${missing.join(", ")}.`
      : weak[0]?.message ?? genericMessage,
  };
}

function validateProviderSection(input: ProjectInput, sectionKey: string, content: string) {
  const trimmed = content.trim();
  if (trimmed.length < 180) {
    return `Provider output for ${sectionTitle(sectionKey)} is too thin. Ask the provider to include concrete project-specific details, file paths, acceptance criteria, and test commands where relevant.`;
  }

  if (/\b(TODO|TBD|lorem ipsum|coming soon|placeholder|to be generated)\b/i.test(trimmed)) {
    return `Provider output for ${sectionTitle(sectionKey)} contains placeholder language.`;
  }

  const lower = trimmed.toLowerCase();
  const genericPhrases = [
    "users can manage items",
    "dashboard for data",
    "simple crud",
    "generic dashboard",
    "content generation app",
    "add features as needed",
    "saved work",
    "detail view",
    "primary workspace",
  ];
  if (genericPhrases.some((phrase) => lower.includes(phrase))) {
    return `Provider output for ${sectionTitle(sectionKey)} is too generic and does not describe the user's actual project.`;
  }

  const leakedTerms = forbiddenDomainTerms(input).filter((term) => lower.includes(term.toLowerCase()));
  if (leakedTerms.length) {
    return `Provider output for ${sectionTitle(sectionKey)} leaked unrelated template terms: ${leakedTerms.slice(0, 4).join(", ")}.`;
  }

  if (sectionKey === "task-plan" || sectionKey === "mvp-scope") {
    const requiresCloudFirst =
      /sign\s+up\s+and\s+log\s+in|users?\s+can\s+sign\s+in|user\s+auth|supabase\s+client\s+setup|data\s+saved\s+in\s+supabase|requires\s+(?:supabase|auth)|authentication\s+before|gemini\s+api\s+keys?|openrouter\s+sdk|requires?\s+api\s+keys?/i.test(trimmed);
    const mentionsLocalFallback = /localStorage|browser\s+storage|local-first|without\s+(?:api\s+keys|accounts)|no\s+(?:api\s+key|login)/i.test(trimmed);
    if (requiresCloudFirst && !mentionsLocalFallback) {
      return `Provider output for ${sectionTitle(sectionKey)} violates the local-first MVP requirement by making auth or Supabase mandatory too early.`;
    }

    if (
      sectionKey === "task-plan" &&
      /\bgemini\b|\bopenrouter\b|\bopenai\b|api\s+calls\s+return|connect\s+(?:gemini|openrouter|openai)|integrate\s+(?:gemini|openrouter|openai)|openai\s+api|provider\s+sdk|pages\/api/i.test(trimmed) &&
      !/optional\s+provider|demo\s+generator|local\s+demo|fallback\s+to\s+demo|without\s+(?:an?\s+)?api\s+key/i.test(trimmed)
    ) {
      return `Provider output for ${sectionTitle(sectionKey)} makes provider work mandatory before the local demo workflow exists.`;
    }

    const isVideoProject = /\bvideo\b|showcase|product photo|tiktok shop|shopee/i.test(
      `${input.appType} ${input.idea} ${input.desiredOutput ?? ""}`,
    );
    if (isVideoProject && /generate\s+30-second\s+videos?|real\s+video\s+generation|downloadable\s+video/i.test(trimmed) && !/storyboard|render\s+placeholder|export\s+plan/i.test(trimmed)) {
      return `Provider output for ${sectionTitle(sectionKey)} overbuilds video rendering before the storyboard MVP is validated.`;
    }
  }

  const coreContextSections = new Set([
    "product-strategy",
    "mvp-scope",
    "stack-recommendation",
    "task-plan",
    "ai-handoff",
  ]);
  if (coreContextSections.has(sectionKey)) {
    const anchors = projectAnchorTerms(input);
    const hasProjectContext = anchors.length < 3 || anchors.some((term) => lower.includes(term.toLowerCase()));
    if (!hasProjectContext) {
      return `Provider output for ${sectionTitle(sectionKey)} does not mention the user's project domain. Expected terms like: ${anchors.slice(0, 6).join(", ")}.`;
    }
  }

  const sectionRules: Record<string, { pattern: RegExp; message: string }> = {
    "task-plan": {
      pattern: /(?=[\s\S]*(?:src\/|src\\|\.tsx?|\.jsx?|\.md))(?=[\s\S]*acceptance\s+criteria)(?=[\s\S]*(?:dependencies|depends on|phase\s+\d))(?=[\s\S]*(?:test\s+command|npm(?:\.cmd)?\s+run))/i,
      message: "Task Plan must include file paths, dependencies or phases, acceptance criteria, and test commands.",
    },
    "api-specification": {
      pattern: /(?=[\s\S]*(?:GET|POST|PUT|PATCH|DELETE|endpoint))(?=[\s\S]*(?:request\s+body|request))(?=[\s\S]*(?:response\s+body|response))/i,
      message: "API Specification must include endpoints plus request and response examples.",
    },
    "database-schema": {
      pattern: /(?=[\s\S]*(?:CREATE\s+TABLE|table|schema))(?=[\s\S]*(?:user_id|owner|rls|index|foreign\s+key))/i,
      message: "Database Schema must include concrete tables plus ownership/RLS/index guidance.",
    },
    "stack-recommendation": {
      pattern: /(?=[\s\S]*frontend)(?=[\s\S]*(?:backend|api))(?=[\s\S]*(?:storage|database))(?=[\s\S]*(?:deployment|provider))/i,
      message: "Architecture must cover frontend, backend/API, storage, provider layer, and deployment.",
    },
    "ai-handoff": {
      pattern: /(?=[\s\S]*(?:primary\s+agent\s+prompt|upload\s+these\s+files))(?=[\s\S]*(?:definition\s+of\s+done|quality\s+gate))/i,
      message: "AI Handoff must include an upload-ready prompt plus a quality gate or definition of done.",
    },
  };
  const rule = sectionRules[sectionKey];
  if (rule && !rule.pattern.test(trimmed)) return `Provider output for ${sectionTitle(sectionKey)} is incomplete. ${rule.message}`;

  return null;
}

function projectAnchorTerms(input: ProjectInput) {
  const stopWords = new Set([
    "about",
    "across",
    "after",
    "app",
    "application",
    "build",
    "create",
    "danh",
    "dung",
    "giup",
    "have",
    "into",
    "muon",
    "need",
    "nguoi",
    "project",
    "should",
    "that",
    "their",
    "this",
    "tool",
    "user",
    "users",
    "want",
    "web",
    "with",
  ]);
  const source = [
    input.appType,
    input.idea,
    input.targetUsers,
    input.problem,
    input.desiredOutput,
    ...input.preferredStack,
    ...input.apiProviders,
  ]
    .filter(Boolean)
    .join(" ");

  const words = source
    .toLowerCase()
    .normalize("NFC")
    .match(/[\p{L}\p{N}][\p{L}\p{N}-]{3,}/gu) ?? [];

  return Array.from(new Set(words.filter((word) => !stopWords.has(word)))).slice(0, 16);
}

function slugForPath(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "app";
}

function forbiddenDomainTerms(input: ProjectInput) {
  const source = `${input.appType} ${input.idea} ${input.problem ?? ""} ${input.desiredOutput ?? ""}`.toLowerCase();
  const isCodingAgentKit = /coding agent|project kit|codex|cline|cursor|ai handoff|mcp settings|repo recommendations|markdown json zip|agent pack|local-first/i.test(source);
  if (isCodingAgentKit) {
    return [
      "Inventory approval",
      "InventoryItem",
      "InventoryRequest",
      "AuditEvent",
      "/approvals",
      "/api/requests",
      "BookingRequest",
      "ClinicAppointment",
      "LeadSubmission",
      "CrmPushResult",
    ];
  }

  const isVideo = /\bvideo\b|showcase|product photo|tiktok shop|shopee/.test(source);
  const isWeeklyPlanner = /weekly social|content planner|content plan|caption|hashtag/.test(source);

  if (isVideo && !isWeeklyPlanner) {
    return [
      "Weekly social media content planner",
      "weekly content plan",
      "7-day social media content plan",
      "/plan/new",
      "/plan/[id]",
      "PlanInput",
      "ContentPlan",
      "PlanDay",
      "SocialPost",
      "PlatformSettings",
      "/api/generate-plan",
      "/api/plans",
    ];
  }

  const isLearningPlanner = /lesson plan|practice exercises|review schedule|progress checklist|adult learners|structured practice|momentum lessons|learning app/.test(source);
  if (isLearningPlanner) {
    return [
      "/api/items",
      "/items",
      "/items/[id]",
      "AppItem",
      "UserPreference",
      "Primary workspace",
      "Saved work",
      "generic item",
      "main record for the app workflow",
    ];
  }

  const isLeadAutomation = /lead generation|lead capture|lead qualification|lead scoring|qualified leads|crm push|form submissions|enrich(?:es)? leads|slack notification|marketing agencies|marketing teams/.test(source);
  if (isLeadAutomation) {
    return [
      "/api/items",
      "/items",
      "/items/[id]",
      "AppItem",
      "UserPreference",
      "Primary workspace",
      "Saved work",
      "generic item",
      "main record for the app workflow",
    ];
  }

  const isClinicIntake = /clinic appointment|patient intake|small clinics|visit notes|appointment status|clinic app|medical appointment|patient forms/.test(source);
  if (isClinicIntake) {
    return [
      "/api/items",
      "/items",
      "/items/[id]",
      "AppItem",
      "UserPreference",
      "Primary workspace",
      "Saved work",
      "generic item",
      "marketplace discovery",
      "deposits",
      "loyalty points",
    ];
  }

  if (isWeeklyPlanner && !isVideo) {
    return [
      "product showcase video",
      "StoryboardScene",
      "VideoJob",
      "/videos/[id]",
      "/api/video-jobs",
    ];
  }

  return [];
}

async function requestChatCompletion(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  generationMode: GenerationMode = "balanced",
): Promise<ChatCompletionResult> {
  const model = selectModel(provider, generationMode);
  const requestProvider = capProviderTokens(provider, generationMode);

  try {
    const content = await withProviderDeadline(generationMode, async () => {
      if (provider.providerType === "ollama") {
        return requestOllama(requestProvider, messages, model);
      }

      if (provider.providerType === "gemini") {
        return requestGemini(requestProvider, messages, model);
      }

      if (provider.providerType === "anthropic-compatible") {
        return requestAnthropic(requestProvider, messages, model);
      }

      return requestOpenAiCompatible(requestProvider, messages, model);
    });
    return { content, model };
  } catch (error) {
    return { content: null, model, error: providerErrorMessage(error) };
  }
}

function withProviderDeadline<T>(generationMode: GenerationMode, operation: () => Promise<T>) {
  const timeoutMs = providerDeadlineMs(generationMode);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Provider request exceeded ${Math.round(timeoutMs / 1000)}s route budget.`)), timeoutMs);
  });
  return Promise.race([operation(), timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function providerDeadlineMs(generationMode: GenerationMode) {
  const configured = Number(process.env.VIBEFORGE_PROVIDER_DEADLINE_MS);
  if (Number.isFinite(configured) && configured >= 5_000) return configured;
  if (generationMode === "deep") return 52_000;
  if (generationMode === "balanced") return 42_000;
  return 28_000;
}

function capProviderTokens(provider: ProviderSettings, generationMode: GenerationMode): ProviderSettings {
  const modeCap = generationMode === "deep" ? 4200 : generationMode === "balanced" ? 3000 : 1400;
  return {
    ...provider,
    tokenLimit: Math.max(300, Math.min(provider.tokenLimit || modeCap, modeCap)),
  };
}

function selectModel(provider: ProviderSettings, generationMode: GenerationMode) {
  if (generationMode === "fast") {
    return provider.cheapModel || provider.defaultModel || provider.strongModel;
  }
  if (generationMode === "deep") {
    return provider.strongModel || provider.defaultModel || provider.cheapModel;
  }
  return provider.defaultModel || provider.strongModel || provider.cheapModel;
}

function generationModeInstruction(generationMode: GenerationMode) {
  if (generationMode === "fast") {
    return "Fast draft mode. Keep each section concise but still concrete and actionable. Aim for 150-300 words per section. Focus on the most critical decisions and skip detailed specifications.";
  }
  if (generationMode === "deep") {
    return "Deep planning mode. This is a comprehensive project specification. Each section should be 300-800 words with maximum detail. Include database schemas with column types, API endpoints with request/response examples, specific task breakdowns with hour estimates, detailed security analysis, and production deployment checklists. Think like a $300/hr consultant delivering a project blueprint.";
  }
  return "Balanced mode. Each section should be 200-500 words with practical detail. Include specific technology choices with rationale, concrete implementation steps, and enough detail for a developer to start coding immediately.";
}

async function assertProviderResponse(response: Response) {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  throw new Error(classifyProviderResponse(response.status, body));
}

function classifyProviderResponse(status: number, body: string) {
  const text = body.toLowerCase();
  if (status === 401 || status === 403) return "Provider rejected the API key or permissions.";
  if (status === 404 || text.includes("model")) return "Provider model was not found. Check the model ID.";
  if (status === 408 || status === 504) return "Provider timed out. Try a faster model or lower token limit.";
  if (status === 429) return "Provider rate limit or quota was reached. Check credits and limits.";
  if (status >= 500) return "Provider service is unavailable. Try again shortly.";
  if (text.includes("quota") || text.includes("credit") || text.includes("billing")) {
    return "Provider quota, credits, or billing limit was reached.";
  }
  return "Provider request failed. Check base URL, model, key, and JSON support.";
}

function providerErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return "Provider request timed out. Try Fast mode, a lower token limit, or another model.";
    }
    return error.message;
  }
  return "Provider request failed. Check key, credits, model, and base URL.";
}

async function requestOpenAiCompatible(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const endpoint = providerUrl(provider, "/chat/completions");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: provider.temperature,
      max_tokens: provider.tokenLimit,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  await assertProviderResponse(response);
  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : null;
}

async function requestOllama(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const endpoint = providerUrl(provider, "/api/chat");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      format: "json",
      options: {
        temperature: provider.temperature,
        num_predict: provider.tokenLimit,
      },
      messages,
    }),
  });

  await assertProviderResponse(response);
  const json = await response.json();
  const content = json?.message?.content;
  return typeof content === "string" ? content : null;
}

async function requestGemini(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const system = messages.find((message) => message.role === "system")?.content ?? "";
  const user = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n\n");
  const endpoint = providerUrl(provider, `/models/${encodeURIComponent(model)}:generateContent`);
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: { "Content-Type": "application/json", "x-goog-api-key": provider.apiKey },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: provider.temperature,
        maxOutputTokens: provider.tokenLimit,
        responseMimeType: "application/json",
      },
    }),
  });

  await assertProviderResponse(response);
  const json = await response.json();
  const content = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof content === "string" ? content : null;
}

async function requestAnthropic(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const system = messages.find((message) => message.role === "system")?.content ?? undefined;
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => ({ role: "user", content: message.content }));

  const endpoint = providerUrl(provider, "/messages");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": provider.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system,
      max_tokens: provider.tokenLimit,
      temperature: provider.temperature,
      messages: userMessages,
    }),
  });

  await assertProviderResponse(response);
  const json = await response.json();
  const content = json?.content?.[0]?.text;
  return typeof content === "string" ? content : null;
}

function parseProviderJson(content: string | null): ProviderJson | null {
  if (!content) return null;

  const candidates = [
    content.trim(),
    stripJsonFence(content),
    extractJsonObject(content),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed as ProviderJson;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function stripJsonFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function providerUrl(provider: ProviderSettings, routePath: string) {
  try {
    const base = new URL(provider.baseUrl.trim());
    if (!["https:", "http:"].includes(base.protocol)) return null;
    if (base.username || base.password) return null;
    if (base.protocol === "http:" && !isLocalHostname(base.hostname)) return null;

    base.username = "";
    base.password = "";
    base.search = "";
    base.hash = "";
    base.pathname = `${base.pathname.replace(/\/+$/, "")}/${routePath.replace(/^\/+/, "")}`;
    return base.toString();
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string) {
  const clean = hostname.toLowerCase();
  return clean === "localhost" || clean === "127.0.0.1" || clean === "::1";
}

function extractJsonObject(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end <= start) return "";
  return content.slice(start, end + 1);
}

function sectionsFromUnknown(value: unknown) {
  if (!value || typeof value !== "object") return {};

  const record = value as Record<string, unknown>;
  const sections: Record<string, string> = {};
  for (const key of SECTION_KEYS) {
    const section = record[key];
    if (typeof section === "string" && section.trim()) {
      sections[key] = section;
    }
  }

  return sections;
}

function withSection(project: ProjectKit, sectionKey: string, content: string): ProjectKit {
  return {
    ...project,
    sections: normalizeSections({ ...project.sections, [sectionKey]: content }),
    updatedAt: new Date().toISOString(),
  };
}

