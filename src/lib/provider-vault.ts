import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { ProviderSettings } from "@/types/vibeforge";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

type ProviderProfileRow = {
  id: string;
  user_id: string;
  provider_name: string;
  provider_type: ProviderSettings["providerType"];
  base_url: string;
  default_model: string;
  cheap_model: string;
  strong_model: string;
  vision_model: string;
  max_budget: number;
  temperature: number;
  token_limit: number;
  enabled: boolean;
  api_key_ciphertext?: string | null;
  api_key_iv?: string | null;
  api_key_tag?: string | null;
};

export type ProviderResolution =
  | { provider: ProviderSettings | null; source: "inline" | "vault" | "env" | "none" }
  | { provider: null; source: "vault"; error: string };

export async function resolveProviderForRequest({
  inlineProvider,
  providerProfileId,
  userId,
}: {
  inlineProvider?: ProviderSettings | null;
  providerProfileId?: string | null;
  userId?: string | null;
}): Promise<ProviderResolution> {
  if (providerProfileId) {
    return getVaultProvider(providerProfileId, userId);
  }

  if (inlineProvider) {
    return { provider: inlineProvider, source: "inline" };
  }

  const envProvider = getEnvironmentProvider();
  if (envProvider) {
    return { provider: envProvider, source: "env" };
  }

  return { provider: null, source: "none" };
}

function getEnvironmentProvider(): ProviderSettings | null {
  const apiKey =
    process.env.VIBEFORGE_SERVER_PROVIDER_API_KEY ||
    process.env.VIBEFORGE_OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    "";
  if (!apiKey.trim()) return null;
  const providerType = providerTypeFromEnv(
    process.env.VIBEFORGE_SERVER_PROVIDER_TYPE ||
      (process.env.VIBEFORGE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY ? "openrouter" : undefined),
  );

  return {
    id: "env-provider",
    providerName:
      process.env.VIBEFORGE_SERVER_PROVIDER_NAME ||
      process.env.VIBEFORGE_OPENROUTER_PROVIDER_NAME ||
      (providerType === "openrouter" ? "OpenRouter" : "Server Provider"),
    providerType,
    baseUrl:
      process.env.VIBEFORGE_SERVER_PROVIDER_BASE_URL ||
      process.env.VIBEFORGE_OPENROUTER_BASE_URL ||
      "https://openrouter.ai/api/v1",
    apiKey,
    defaultModel:
      process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
      process.env.VIBEFORGE_OPENROUTER_DEFAULT_MODEL ||
      "openai/gpt-4.1-mini",
    cheapModel:
      process.env.VIBEFORGE_SERVER_PROVIDER_CHEAP_MODEL ||
      process.env.VIBEFORGE_OPENROUTER_CHEAP_MODEL ||
      process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
      "openai/gpt-4.1-mini",
    strongModel:
      process.env.VIBEFORGE_SERVER_PROVIDER_STRONG_MODEL ||
      process.env.VIBEFORGE_OPENROUTER_STRONG_MODEL ||
      process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
      "openai/gpt-4.1",
    visionModel:
      process.env.VIBEFORGE_SERVER_PROVIDER_VISION_MODEL ||
      process.env.VIBEFORGE_OPENROUTER_VISION_MODEL ||
      process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
      "google/gemini-2.5-flash",
    maxBudgetPerGeneration: Number(
      process.env.VIBEFORGE_SERVER_PROVIDER_MAX_BUDGET ??
        process.env.VIBEFORGE_OPENROUTER_MAX_BUDGET ??
        0,
    ),
    temperature: Number(
      process.env.VIBEFORGE_SERVER_PROVIDER_TEMPERATURE ??
        process.env.VIBEFORGE_OPENROUTER_TEMPERATURE ??
        0.4,
    ),
    tokenLimit: Number(
      process.env.VIBEFORGE_SERVER_PROVIDER_TOKEN_LIMIT ??
        process.env.VIBEFORGE_OPENROUTER_TOKEN_LIMIT ??
        12000,
    ),
    enabled: true,
  };
}

function providerTypeFromEnv(value?: string): ProviderSettings["providerType"] {
  if (
    value === "openai-compatible" ||
    value === "openrouter" ||
    value === "gemini" ||
    value === "anthropic-compatible" ||
    value === "ollama" ||
    value === "custom"
  ) {
    return value;
  }
  return "openai-compatible";
}

export function encryptProviderApiKey(apiKey: string) {
  const key = encryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    hint: keyHint(apiKey),
  };
}

function decryptProviderApiKey(row: ProviderProfileRow) {
  if (!row.api_key_ciphertext || !row.api_key_iv || !row.api_key_tag) return "";

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(row.api_key_iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(row.api_key_tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(row.api_key_ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

async function getVaultProvider(providerProfileId: string, userId?: string | null): Promise<ProviderResolution> {
  if (!userId) {
    return { provider: null, source: "vault", error: "Sign in again before using a saved provider profile." };
  }

  const client = getSupabaseAdminClient();
  if (!client) {
    return { provider: null, source: "vault", error: "Server provider vault is not configured." };
  }

  const { data, error } = await client
    .from("provider_profiles")
    .select("*")
    .eq("id", providerProfileId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return { provider: null, source: "vault", error: "Provider profile was not found for this user." };
  }

  const row = data as ProviderProfileRow;
  let apiKey = "";
  try {
    apiKey = decryptProviderApiKey(row);
  } catch {
    return { provider: null, source: "vault", error: "Provider key could not be decrypted. Re-save the key." };
  }

  if (row.provider_type !== "ollama" && !apiKey) {
    return { provider: null, source: "vault", error: "Provider profile is missing an encrypted API key." };
  }

  return {
    source: "vault",
    provider: {
      id: row.id,
      providerName: row.provider_name,
      providerType: row.provider_type,
      baseUrl: row.base_url,
      apiKey,
      defaultModel: row.default_model,
      cheapModel: row.cheap_model,
      strongModel: row.strong_model,
      visionModel: row.vision_model,
      maxBudgetPerGeneration: Number(row.max_budget),
      temperature: Number(row.temperature),
      tokenLimit: Number(row.token_limit),
      enabled: row.enabled,
    },
  };
}

function encryptionKey() {
  const secret = process.env.VIBEFORGE_PROVIDER_KEY_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("VIBEFORGE_PROVIDER_KEY_SECRET must be at least 32 characters.");
  }
  return createHash("sha256").update(secret).digest();
}

function keyHint(apiKey: string) {
  if (apiKey.length <= 8) return "configured";
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}
