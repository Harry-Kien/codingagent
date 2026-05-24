export const SECTION_ORDER = [
  ["product-strategy", "Product Strategy", "PROJECT_BRIEF.md"],
  ["mvp-scope", "MVP Scope", "PRODUCT_STRATEGY.md"],
  ["feature-roadmap", "Feature Roadmap", "ROADMAP.md"],
  ["stack-recommendation", "Stack Recommendation", "STACK_RECOMMENDATION.md"],
  ["repo-tool-map", "Repo & Tool Map", "TOOLS.md"],
  ["cost-aware-ai-plan", "Cost-Aware AI Plan", "AI_PLAN.md"],
  ["database-schema", "Database Schema", "DATABASE_SCHEMA.md"],
  ["api-specification", "API Specification", "API_SPEC.md"],
  ["ui-screens", "UI Screens", "UI_SCREENS.md"],
  ["user-flows", "User Flows", "USER_FLOWS.md"],
  ["coding-agent-rules", "Coding Agent Rules", "AGENTS.md"],
  ["task-plan", "Task Plan", "TASKS.md"],
  ["next-actions", "Next Actions", "NEXT_ACTIONS.md"],
  ["test-plan", "Test Plan", "TEST_PLAN.md"],
  ["deployment-plan", "Deployment Plan", "DEPLOYMENT_PLAN.md"],
  ["security-checklist", "Security Checklist", "SECURITY_CHECKLIST.md"],
  ["launch-kit", "Launch Kit", "LAUNCH_KIT.md"],
  ["codex-cline-prompts", "Codex/Cline Prompts", "CODEX_PROMPTS.md"],
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number][0];

export function sectionTitle(key: string) {
  return SECTION_ORDER.find(([sectionKey]) => sectionKey === key)?.[1] ?? key;
}

export function sectionFilename(key: string) {
  return SECTION_ORDER.find(([sectionKey]) => sectionKey === key)?.[2] ?? `${key}.md`;
}

export const ZIP_FILE_MAP: Record<string, string> = Object.fromEntries(
  SECTION_ORDER.map(([key, , filename]) => [key, filename]),
);

export type AgentExportPackId = "codex" | "cline" | "cursor" | "claude-code";

export type AgentExportPack = {
  id: AgentExportPackId;
  label: string;
  description: string;
  files: string[];
};

export const AGENT_EXPORT_PACKS: AgentExportPack[] = [
  {
    id: "codex",
    label: "Codex Pack",
    description: "Terminal coding workflow with explicit repo rules, tasks, tools, and prompts.",
    files: [
      "AGENTS.md",
      "PROJECT_BRIEF.md",
      "TASKS.md",
      "TOOLS.md",
      "NEXT_ACTIONS.md",
      "CODEX_PROMPTS.md",
    ],
  },
  {
    id: "cline",
    label: "Cline Pack",
    description: "VS Code agent workflow with Cline rules and implementation tasks.",
    files: [".clinerules", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
  },
  {
    id: "cursor",
    label: "Cursor Pack",
    description: "Cursor rules plus the core project brief and next implementation actions.",
    files: [".cursorrules", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
  },
  {
    id: "claude-code",
    label: "Claude Code Pack",
    description: "Claude Code project memory and the core planning files.",
    files: ["CLAUDE.md", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
  },
];
