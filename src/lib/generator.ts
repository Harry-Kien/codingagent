"use client";

import type {
  ProjectInput,
  ProjectKit,
  ProviderSettings,
  ReadinessScore,
} from "@/types/vibeforge";
import { SECTION_ORDER, sectionTitle } from "@/lib/kit-sections";
import { recommendRepos } from "@/lib/repo-data";
import { slugify, uid } from "@/lib/utils";

const SYSTEM_PROMPT = `You are a senior product architect, software architect, AI workflow engineer, and vibe coding coach.

Convert rough app ideas into concrete, structured, implementation-ready project kits.
Always include MVP scope, what not to build yet, recommended stack, repo/tool map, task plan, coding agent rules, test plan, deployment plan, security checklist, Codex/Cline prompts, and a cost-aware AI provider plan.
Favor simple, shippable systems. Explain whether each repo should be installed, cloned, used externally, imported as workflow, or used only as reference.`;

export function clarificationQuestions(input: Partial<ProjectInput>) {
  const questions: string[] = [];
  if (!input.idea || input.idea.trim().split(/\s+/).length < 8) {
    questions.push("What exact user result should the first version produce?");
  }
  if (!input.targetUsers) questions.push("Who is the first paying or active user group?");
  if (!input.problem) questions.push("What painful workflow does this replace or speed up?");
  if (!input.desiredOutput) questions.push("What should the generated output look like?");
  if (input.appType === "Other") questions.push("Which existing app is closest to the idea?");
  return questions.slice(0, 5);
}

export async function generateProjectKit(
  input: ProjectInput,
  provider?: ProviderSettings,
): Promise<ProjectKit> {
  if (provider?.apiKey && provider.baseUrl && provider.providerType !== "ollama") {
    try {
      const kit = await generateWithProvider(input, provider);
      if (kit) return kit;
    } catch {
      // Fall through to deterministic demo generation.
    }
  }
  return generateMockKit(input);
}

async function generateWithProvider(input: ProjectInput, provider: ProviderSettings) {
  const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.defaultModel || provider.strongModel,
      temperature: provider.temperature,
      max_tokens: provider.tokenLimit,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Return JSON with keys name and sections. Section keys must be: ${SECTION_ORDER.map(([key]) => key).join(", ")}.\n\nProject input:\n${JSON.stringify(input, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) return null;
  const parsed = JSON.parse(content.replace(/^```json|```$/g, "").trim());
  const now = new Date().toISOString();
  const fullInput = input;
  return {
    id: uid("kit"),
    name: parsed.name ?? inferName(input.idea),
    input: fullInput,
    sections: normalizeSections(parsed.sections ?? {}),
    favorites: {},
    repoRecommendations: recommendRepos(fullInput),
    readinessScore: scoreProject(fullInput),
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  } satisfies ProjectKit;
}

export function generateMockKit(input: ProjectInput): ProjectKit {
  const now = new Date().toISOString();
  const name = inferName(input.idea);
  const repoRecommendations = recommendRepos(input);
  const repoLines = repoRecommendations
    .map(
      ({ tool, lane, reason }) =>
        `- **${tool.name}** (${lane.replace("-", " ")}): ${reason} Use as: ${tool.howToUse}. ${tool.costNotes}`,
    )
    .join("\n");

  const isVideo = `${input.idea} ${input.appType}`.toLowerCase().includes("video");
  const sections: Record<string, string> = {
    "product-strategy": `## Outcome\n${name} helps ${input.targetUsers || "a focused first user segment"} turn a rough need into ${input.desiredOutput || "a practical, exportable result"}.\n\n## Job To Be Done\nWhen users face ${input.problem || "an unclear build or content workflow"}, they can describe the goal once and receive a structured plan they can hand to AI coding tools.\n\n## Positioning\nA local-first, guided project system that produces concrete artifacts rather than open-ended chat replies.`,
    "mvp-scope": `## Build First\n- Guided intake with sensible defaults\n- Demo/mock project generation with structured sections\n- Local history and export to Markdown, JSON, and ZIP\n- Provider settings stored locally with warnings\n- MCP connection registry and copyable snippets\n\n## Do Not Build Yet\n- Full multi-user auth\n- Paid subscriptions\n- Automatic repo cloning\n- Arbitrary code execution\n${isVideo ? "- Heavy video rendering pipeline before validating scripts and prompts\n" : ""}`,
    "feature-roadmap": `## 1 Night MVP\n- Usable builder\n- Mock generation\n- Exportable artifacts\n\n## 7 Day Build\n- Provider-backed generation\n- Better repo recommendations\n- Saved settings and history\n\n## 30 Day Product\n- Supabase sync\n- Team workspaces\n- Versioned kits\n- Template marketplace`,
    "stack-recommendation": `## Recommended Stack\n- Next.js App Router + TypeScript\n- Tailwind CSS + shadcn-style components\n- lucide-react icons\n- Zod + React Hook Form\n- localStorage first, Supabase later\n- JSZip for full kit export\n\n## Rationale\nThis stack keeps the MVP deployable on Vercel, usable without API keys, and easy for AI coding agents to modify.`,
    "repo-tool-map": `## Recommendations\n${repoLines}\n\n## Use Directly\nUse Next.js, shadcn/ui, local storage, and provider configuration inside the app.\n\n## Reference Only\nReference repos are for architecture study unless a human explicitly approves code reuse and license review.`,
    "cost-aware-ai-plan": `## Cheap Model Tasks\n- Draft strategy\n- First-pass tasks\n- Repo summaries\n- Clarification questions\n\n## Strong Model Tasks\n- Final architecture\n- Security review\n- Production deployment plan\n- Complex tradeoff decisions\n\n## Cost Controls\n- Cache generated kits locally\n- Regenerate one section at a time\n- Keep reference repo summaries short\n- Avoid video rendering or vision models until needed\n- Use ${input.budgetSensitivity === "high" ? "cheap defaults and strict token limits" : "stronger models only on final review"}`,
    "database-schema": `## Local MVP\nUse localStorage collections:\n\n\`\`\`ts\nprojects: ProjectKit[]\nproviders: ProviderSettings[]\nmcpConnections: McpConnection[]\n\`\`\`\n\n## Supabase Later\n- projects(id, user_id, name, input_json, sections_json, readiness_json, created_at, updated_at)\n- provider_profiles(id, user_id, name, base_url, models_json)\n- mcp_connections(id, user_id, name, type, command_or_url, env_json, status)`,
    "api-specification": `## MVP Client Services\n- generateProjectKit(input, provider?)\n- regenerateSection(project, sectionKey)\n- exportMarkdown(project)\n- exportZip(project)\n\n## Future API Routes\n- POST /api/generate-kit\n- POST /api/regenerate-section\n- GET /api/projects\n- POST /api/projects\n\nAll server routes must validate input with Zod and apply rate limits before provider calls.`,
    "ui-screens": `## Screens\n- / Builder intake with clarification panel\n- /projects History list with open, duplicate, delete, export\n- /projects/[id] Project cockpit with tabs, score, exports\n- /repo-map Curated repo/tool navigator\n- /settings Provider and MCP configuration\n- /about Short explanation`,
    "user-flows": `## Main Flow\n1. User enters idea and constraints.\n2. App shows clarification questions if the idea is vague.\n3. User chooses sensible defaults or edits details.\n4. App generates a project kit in demo mode or provider mode.\n5. User reviews tabs, copies sections, exports ZIP, and reopens from history.\n\n## Settings Flow\n1. User adds provider or MCP connection.\n2. Settings are stored locally.\n3. Exported kit includes instructions for external agent setup.`,
    "coding-agent-rules": `# Agent Rules\n- Preserve local-first behavior.\n- Do not require API keys for the core flow.\n- Do not clone external repos automatically.\n- Use generated Markdown files as implementation contracts.\n- Work one task at a time and verify with build/lint.\n- Keep UI dense, calm, and usable.`,
    "task-plan": `## Milestone 1: Working Builder\n- Implement intake form\n- Add validation\n- Save generated kits locally\n\n## Milestone 2: Project Cockpit\n- Tabs for all sections\n- Copy and export actions\n- Readiness score\n\n## Milestone 3: Settings\n- Provider settings\n- MCP registry\n- Export snippets\n\n## Milestone 4: Production Hardening\n- Server-side provider route\n- Auth and database\n- Rate limits\n- Audit logging`,
    "test-plan": `## Manual Tests\n- Generate a kit in demo/mock mode\n- Open generated project detail from history\n- Export Markdown, JSON, and ZIP\n- Copy a section\n- Regenerate a section\n- Save provider settings locally\n- Add an MCP connection\n- View repo recommendations for an AI video app\n\n## Automated Tests Later\n- Zod schema validation\n- Recommendation matching\n- Export file map\n- Storage migration behavior`,
    "deployment-plan": `## Vercel MVP\n- Set environment variables only when server provider routes are added\n- Deploy Next.js app\n- Verify no secrets are committed\n- Confirm localStorage warning is visible\n\n## Production Later\n- Add Supabase auth and persistence\n- Add provider calls through server routes\n- Add rate limits and request logging`,
    "security-checklist": `- No hardcoded API keys\n- API keys stored locally only for MVP with clear warning\n- Do not execute user-supplied code\n- Do not clone external repos automatically\n- Validate forms with Zod\n- Treat reference repos as reference-only unless reviewed\n- Add server-side rate limits before production provider calls`,
    "launch-kit": `## Launch Assets\n- One-line pitch: ${name} turns rough app ideas into AI-buildable project kits.\n- Demo script: enter the sample idea, generate kit, export ZIP, open history, show settings.\n- First audience: ${input.targetUsers || "non-technical builders and freelancers"}.\n- Success metric: user exports a complete kit within 10 minutes.`,
    "codex-cline-prompts": `## Codex Prompt\nRead PROJECT_BRIEF.md, AGENTS.md, TASKS.md, and TOOLS.md. Implement the next task without changing unrelated files. Run lint and build before reporting completion.\n\n## Cline Prompt\nUse the project kit as the source of truth. Start with the smallest working vertical slice, ask before adding paid services, and keep exports working.\n\n## Section Regeneration Prompt\nRegenerate only "${sectionTitle("mvp-scope")}" for the current idea. Preserve file names and avoid vague advice.`,
  };

  return {
    id: uid("kit"),
    name,
    input,
    sections: normalizeSections(sections),
    favorites: {},
    repoRecommendations,
    readinessScore: scoreProject(input),
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

function normalizeSections(sections: Record<string, string>) {
  return Object.fromEntries(
    SECTION_ORDER.map(([key, title]) => [key, sections[key] ?? `## ${title}\nTo be generated.`]),
  );
}

function inferName(idea: string) {
  const clean = idea
    .replace(/^i want to build\s+/i, "")
    .replace(/^build\s+/i, "")
    .split(/[.?!]/)[0]
    .trim();
  const name = clean
    .split(/\s+/)
    .slice(0, 7)
    .join(" ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return name || "VibeForge Project";
}

function scoreProject(input: ProjectInput): ReadinessScore {
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
      "Local-first path keeps the MVP usable without accounts or API keys",
      "Repo recommendations are separated by direct use, workflow, and reference",
    ],
    risks: [
      "Provider API calls need server-side rate limits before production",
      "Reference repos require license review before code reuse",
      "Video rendering should wait until content planning is validated",
    ],
    nextActions: [
      "Generate the first kit and export ZIP",
      "Open TASKS.md in a coding agent",
      "Build the smallest working product workflow before adding paid services",
    ],
  };
}

export function defaultInput(): ProjectInput {
  return {
    idea: "",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "AI tool",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: true,
    wantsAutomation: false,
  };
}

export function sampleVideoInput(): ProjectInput {
  return {
    idea: "I want to build an AI video app for small shops. The user enters a product description and the app creates a 7-day video content plan, scripts, captions, and prompts for Veo/Gemini/Sora.",
    targetUsers: "Small shop owners who need weekly product videos but do not have a marketing team.",
    problem: "They do not know what to post, what to say, or how to turn product details into a video campaign.",
    desiredOutput: "A 7-day content plan with scripts, captions, shot lists, and AI video prompts.",
    appType: "AI video app",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
    apiProviders: ["Gemini", "OpenRouter"],
    wantsMcp: true,
    wantsAutomation: true,
  };
}

export function projectSlug(project: ProjectKit) {
  return slugify(project.name);
}
