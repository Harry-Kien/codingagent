import { z } from "zod";

/**
 * Zod schemas for Provider Vault CRUD operations.
 * URL validation: only https://, http://localhost, http://127.0.0.1, http://[::1].
 * No username:password in URL.
 */

const safeUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (url) => {
      if (!url) return true; // empty is allowed (not all providers need URL)
      try {
        const parsed = new URL(url);
        if (parsed.username || parsed.password) return false;
        if (parsed.protocol === "https:") return true;
        if (parsed.protocol === "http:") {
          const host = parsed.hostname;
          return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1";
        }
        return false;
      } catch {
        return false;
      }
    },
    { message: "URL must be https:// or http://localhost. No credentials allowed in URL." },
  );

export const createProviderProfileSchema = z.object({
  providerName: z.string().trim().min(1).max(100),
  providerType: z.enum([
    "openai-compatible",
    "openrouter",
    "gemini",
    "anthropic-compatible",
    "ollama",
    "custom",
  ]),
  baseUrl: safeUrlSchema.default(""),
  apiKey: z.string().max(500).optional().default(""),
  defaultModel: z.string().max(200).default(""),
  cheapModel: z.string().max(200).default(""),
  strongModel: z.string().max(200).default(""),
  visionModel: z.string().max(200).default(""),
  maxBudgetPerGeneration: z.coerce.number().nonnegative().max(100).default(0.5),
  temperature: z.coerce.number().min(0).max(2).default(0.4),
  tokenLimit: z.coerce.number().int().positive().max(32000).default(6000),
  enabled: z.boolean().default(true),
});

export const updateProviderProfileSchema = createProviderProfileSchema.partial();

export type CreateProviderProfileInput = z.infer<typeof createProviderProfileSchema>;
export type UpdateProviderProfileInput = z.infer<typeof updateProviderProfileSchema>;
