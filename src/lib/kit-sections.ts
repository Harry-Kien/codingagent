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

export const ZIP_FILE_MAP: Record<string, string> = {
  "product-strategy": "PROJECT_BRIEF.md",
  "mvp-scope": "PRODUCT_STRATEGY.md",
  "task-plan": "TASKS.md",
  "coding-agent-rules": "AGENTS.md",
  "repo-tool-map": "TOOLS.md",
  "database-schema": "DATABASE_SCHEMA.md",
  "api-specification": "API_SPEC.md",
  "ui-screens": "UI_SCREENS.md",
  "user-flows": "USER_FLOWS.md",
  "test-plan": "TEST_PLAN.md",
  "deployment-plan": "DEPLOYMENT_PLAN.md",
  "security-checklist": "SECURITY_CHECKLIST.md",
  "codex-cline-prompts": "CODEX_PROMPTS.md",
  "launch-kit": "LAUNCH_KIT.md",
};
