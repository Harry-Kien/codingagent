export type BudgetSensitivity = "low" | "medium" | "high";

export type ProjectInput = {
  idea: string;
  targetUsers?: string;
  problem?: string;
  desiredOutput?: string;
  appType: string;
  timeline: string;
  skillLevel: string;
  budgetSensitivity: BudgetSensitivity;
  preferredStack: string[];
  apiProviders: string[];
  wantsMcp: boolean;
  wantsAutomation: boolean;
};

export type GenerationMode = "fast" | "balanced" | "deep";

export type GenerationMetadata = {
  mode: GenerationMode;
  source: "demo" | "provider";
  providerName?: string;
  model?: string;
  generatedAt: string;
  fallbackReason?: string;
};

export type RepoTool = {
  id: string;
  name: string;
  url: string;
  category: string;
  useCase: string;
  whenToUse: string;
  whenNotToUse: string;
  howToUse:
    | "install"
    | "clone"
    | "reference-only"
    | "external-tool"
    | "import-workflow";
  difficulty: "easy" | "medium" | "hard";
  productionReadiness: "low" | "medium" | "high";
  riskNotes: string;
  costNotes: string;
  suggestedPrompt: string;
  tags: string[];
};

export type RepoRecommendation = {
  tool: RepoTool;
  lane: "use-now" | "use-later" | "reference-only" | "avoid-mvp";
  reason: string;
};

export type ReadinessScore = {
  productClarity: number;
  mvpFocus: number;
  technicalFeasibility: number;
  costEfficiency: number;
  agentReadiness: number;
  launchReadiness: number;
  strengths: string[];
  risks: string[];
  nextActions: string[];
};

export type SectionStatus = "Draft" | "Approved" | "Needs review";

export type SectionVersion = {
  id: string;
  content: string;
  status: SectionStatus;
  createdAt: string;
  note: string;
};

export type SectionWorkspaceState = {
  status: SectionStatus;
  updatedAt: string;
  history: SectionVersion[];
};

export type ProjectKit = {
  id: string;
  name: string;
  input: ProjectInput;
  sections: Record<string, string>;
  favorites: Record<string, boolean>;
  sectionMeta?: Record<string, SectionWorkspaceState>;
  repoRecommendations: RepoRecommendation[];
  readinessScore: ReadinessScore;
  generation?: GenerationMetadata;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
};

export type ProviderSettings = {
  id: string;
  providerName: string;
  providerType:
    | "openai-compatible"
    | "openrouter"
    | "gemini"
    | "anthropic-compatible"
    | "ollama"
    | "custom";
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
  cheapModel: string;
  strongModel: string;
  visionModel: string;
  maxBudgetPerGeneration: number;
  temperature: number;
  tokenLimit: number;
  enabled: boolean;
};

export type McpConnection = {
  id: string;
  name: string;
  type:
    | "IDE / editor"
    | "CLI coding agent"
    | "GitHub"
    | "Browser automation"
    | "Filesystem"
    | "Database"
    | "n8n"
    | "Custom MCP server";
  commandOrUrl: string;
  environmentVariables: string;
  status: "Not configured" | "Configured" | "Needs testing";
  notes: string;
};
