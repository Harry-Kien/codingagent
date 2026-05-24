import { z } from "zod";
import { SECTION_ORDER } from "@/lib/kit-sections";

const budgetSensitivitySchema = z.enum(["low", "medium", "high"]);
const sectionKeys = SECTION_ORDER.map(([key]) => key) as [string, ...string[]];
export const sectionKeySchema = z.enum(sectionKeys);

export const projectInputSchema = z.object({
  idea: z.string().min(12),
  targetUsers: z.string().optional().default(""),
  problem: z.string().optional().default(""),
  desiredOutput: z.string().optional().default(""),
  appType: z.string().min(1),
  timeline: z.string().min(1),
  skillLevel: z.string().min(1),
  budgetSensitivity: budgetSensitivitySchema,
  preferredStack: z.array(z.string()).default([]),
  apiProviders: z.array(z.string()).default([]),
  wantsMcp: z.boolean(),
  wantsAutomation: z.boolean(),
}).passthrough();

export const providerSettingsSchema = z.object({
  id: z.string().min(1),
  providerName: z.string().min(1),
  providerType: z.enum([
    "openai-compatible",
    "openrouter",
    "gemini",
    "anthropic-compatible",
    "ollama",
    "custom",
  ]),
  baseUrl: z.string().trim().max(500).default(""),
  apiKey: z.string().default(""),
  defaultModel: z.string().default(""),
  cheapModel: z.string().default(""),
  strongModel: z.string().default(""),
  visionModel: z.string().default(""),
  maxBudgetPerGeneration: z.coerce.number().nonnegative().default(0),
  temperature: z.coerce.number().min(0).max(2).default(0.4),
  tokenLimit: z.coerce.number().int().positive().max(32000).default(6000),
  enabled: z.boolean().default(false),
}).passthrough();

const readinessScoreSchema = z.object({
  productClarity: z.number(),
  mvpFocus: z.number(),
  technicalFeasibility: z.number(),
  costEfficiency: z.number(),
  agentReadiness: z.number(),
  launchReadiness: z.number(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  nextActions: z.array(z.string()),
}).passthrough();

const repoToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  category: z.string(),
  useCase: z.string(),
  whenToUse: z.string(),
  whenNotToUse: z.string(),
  howToUse: z.enum(["install", "clone", "reference-only", "external-tool", "import-workflow"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  productionReadiness: z.enum(["low", "medium", "high"]),
  riskNotes: z.string(),
  costNotes: z.string(),
  suggestedPrompt: z.string(),
  tags: z.array(z.string()),
}).passthrough();

const repoRecommendationSchema = z.object({
  tool: repoToolSchema,
  lane: z.enum(["use-directly", "install", "reference", "agent-workflow", "future"]),
  reason: z.string(),
}).passthrough();

export const projectKitSchema = z.object({
  id: z.string(),
  name: z.string(),
  input: projectInputSchema,
  sections: z.record(z.string(), z.string()),
  favorites: z.record(z.string(), z.boolean()),
  repoRecommendations: z.array(repoRecommendationSchema),
  readinessScore: readinessScoreSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  lastOpenedAt: z.string().optional(),
}).passthrough();

export const generateKitRequestSchema = z.object({
  input: projectInputSchema,
  provider: providerSettingsSchema.optional().nullable(),
});

export const regenerateSectionRequestSchema = z.object({
  project: projectKitSchema,
  sectionKey: sectionKeySchema,
  provider: providerSettingsSchema.optional().nullable(),
});

export const improveSectionRequestSchema = regenerateSectionRequestSchema.extend({
  instruction: z.string().max(1200).optional().default("Improve this section while preserving concrete, exportable guidance."),
});
