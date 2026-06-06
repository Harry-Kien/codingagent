import {
  Bug,
  ClipboardCheck,
  Code2,
  FileText,
  Map,
  Palette,
  Rocket,
  TestTube2,
  type LucideIcon,
} from "lucide-react";

export type AgentRole = {
  id: string;
  name: string;
  icon: LucideIcon;
  mission: string;
  useWhen: string;
  reads: string[];
  outputs: string[];
  guardrails: string[];
  prompt: string;
};

export const AGENT_ROLES: AgentRole[] = [
  {
    id: "code-reviewer",
    name: "Code Reviewer Agent",
    icon: ClipboardCheck,
    mission: "Review diffs for correctness, regressions, security, and missing verification.",
    useWhen: "Before merging generated or hand-written implementation work.",
    reads: ["AGENTS.md", "PRODUCT_REQUIREMENTS.md", "TASKS.md", "TEST_PLAN.md", "SECURITY_CHECKLIST.md"],
    outputs: ["Review findings", "Risk list", "Required fixes", "Verification gaps"],
    guardrails: ["Findings first", "Reference files and lines", "Do not rewrite unrelated code"],
    prompt:
      "Act as a senior code reviewer. Read the project rules and current diff. Report bugs, regressions, security issues, missing tests, and launch blockers first. Include file and line references. Do not summarize before findings.",
  },
  {
    id: "bug-fixer",
    name: "Bug Fixer Agent",
    icon: Bug,
    mission: "Reproduce, isolate, fix, and verify one concrete defect at a time.",
    useWhen: "A build, route, export, provider, or browser flow is failing.",
    reads: ["AGENTS.md", "REPO_MAP.md", "TEST_PLAN.md", "relevant source files", "runtime logs"],
    outputs: ["Root cause", "Focused patch", "Regression check", "Remaining risk"],
    guardrails: ["Reproduce first", "Fix the root cause", "Run the narrowest useful verification"],
    prompt:
      "Debug systematically. Reproduce the failure, identify the smallest root cause, patch only the relevant files, then run the failing check again plus one regression check.",
  },
  {
    id: "ui-builder",
    name: "UI Builder Agent",
    icon: Palette,
    mission: "Build dense, calm SaaS/developer-tool UI with clear states and responsive behavior.",
    useWhen: "Adding or polishing product screens, forms, cards, nav, empty states, and action flows.",
    reads: ["AGENTS.md", "PRODUCT_STRUCTURE.md", "src/components/ui/*", "src/app/*"],
    outputs: ["Responsive UI changes", "Loading/empty/error states", "Accessibility notes", "Browser screenshots"],
    guardrails: ["Keep / as the usable builder", "Use lucide-react icons", "Avoid nested cards and oversized marketing layout"],
    prompt:
      "Improve the UI as a practical SaaS developer tool. Preserve the app's existing design system, local-first flow, and responsive behavior. Add clear states and CTAs without turning / into a landing page.",
  },
  {
    id: "repo-mapper",
    name: "Repo Mapper Agent",
    icon: Map,
    mission: "Map routes, components, APIs, dependencies, risks, and TODO/FIXME markers.",
    useWhen: "Before large changes, onboarding, audits, or handoff to another coding agent.",
    reads: ["src/app", "src/components", "src/lib", "package.json", "README.md"],
    outputs: ["REPO_MAP.md", "repo-map.json", "Risk map", "Route/API/component inventory"],
    guardrails: ["Inspect real files", "Do not guess routes or schemas", "Flag generated/output folders separately"],
    prompt:
      "Create a repo map from the actual filesystem. Include route map, component map, API map, dependency map, risk map, TODO/FIXME scan, and recommended first files to read.",
  },
  {
    id: "test-writer",
    name: "Test Writer Agent",
    icon: TestTube2,
    mission: "Add focused tests around core flows and regressions.",
    useWhen: "A behavior is important enough to protect or a bug has just been fixed.",
    reads: ["TEST_PLAN.md", "e2e/*", "scripts/*", "src/lib/*", "src/app/*"],
    outputs: ["Unit/product/e2e checks", "Manual checklist updates", "Test data"],
    guardrails: ["Test user outcomes", "Avoid brittle visual assertions", "Keep demo mode working without keys"],
    prompt:
      "Write focused tests for the changed behavior. Cover demo generation, history detail, exports, copy/regenerate, provider settings, MCP connections, and repo recommendations when relevant.",
  },
  {
    id: "documentation",
    name: "Documentation Agent",
    icon: FileText,
    mission: "Keep launch, product, architecture, memory, and handoff docs accurate.",
    useWhen: "After product or architecture changes and before demo/launch handoff.",
    reads: ["README.md", "PRODUCT_AUDIT.md", "PRODUCT_STRUCTURE.md", "REPO_MAP.md", "AGENT_KIT.md"],
    outputs: ["Updated docs", "Upgrade report", "Deploy report", "Known risks"],
    guardrails: ["No secrets", "No vague placeholders", "Mirror the code that actually exists"],
    prompt:
      "Update product docs from the current codebase. Include changed files, checks run, known limits, and concrete launch/demo instructions. Do not invent deployed URLs or capabilities.",
  },
  {
    id: "deployment",
    name: "Deployment Agent",
    icon: Rocket,
    mission: "Prepare, deploy, and smoke-test production without leaking secrets.",
    useWhen: "Build passes and a Vercel project link is available.",
    reads: ["package.json", "next.config.ts", ".vercel/project.json", "DEPLOY_REPORT.md"],
    outputs: ["Production build", "Deployment URL", "Smoke test results", "Rollback notes"],
    guardrails: ["Run build before deploy", "Do not print secrets", "Open production URL after deploy"],
    prompt:
      "Verify production readiness, run build checks, deploy with vercel --prod when linked and authenticated, then smoke-test the production URL and document the result.",
  },
  {
    id: "product-manager",
    name: "Product Manager Agent",
    icon: Code2,
    mission: "Keep scope, roadmap, user value, and launch criteria coherent.",
    useWhen: "Deciding what to build next, trimming scope, or preparing a demo narrative.",
    reads: ["PRODUCT_AUDIT.md", "PRODUCT_STRUCTURE.md", "ROADMAP.md", "UPGRADE_REPORT.md"],
    outputs: ["Prioritized roadmap", "Demo script", "Success metrics", "Scope cuts"],
    guardrails: ["Protect local-first MVP", "Prefer concrete exportable outputs", "Defer paid integrations until validated"],
    prompt:
      "Act as product manager for VibeForge. Prioritize work that helps users move from rough idea to structured implementation artifacts. Cut anything that weakens demo reliability.",
  },
];

export function agentKitMarkdown() {
  return AGENT_ROLES.map((agent) => {
    return [
      `## ${agent.name}`,
      `Mission: ${agent.mission}`,
      `Use when: ${agent.useWhen}`,
      "",
      "Reads:",
      ...agent.reads.map((item) => `- ${item}`),
      "",
      "Outputs:",
      ...agent.outputs.map((item) => `- ${item}`),
      "",
      "Guardrails:",
      ...agent.guardrails.map((item) => `- ${item}`),
      "",
      "Prompt:",
      "```text",
      agent.prompt,
      "```",
    ].join("\n");
  }).join("\n\n");
}
