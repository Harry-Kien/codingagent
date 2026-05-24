"use client";

import type { GenerationMode, ProjectInput, ProjectKit, ProviderSettings } from "@/types/vibeforge";
import { getSupabaseClient } from "@/lib/supabase-client";
import { projectKitSchema } from "@/lib/validation";

export function hasServerProvider(provider?: ProviderSettings | null) {
  if (!provider?.enabled || !provider.baseUrl.trim()) return false;
  if (provider.providerType === "ollama") return true;
  return (
    Boolean(provider.apiKey.trim()) &&
    ["openai-compatible", "openrouter", "gemini", "anthropic-compatible", "custom"].includes(provider.providerType)
  );
}

export async function generateKitFromServer(
  input: ProjectInput,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
  providerProfileId?: string | null,
) {
  const headers = await requestHeaders();
  const response = await fetch("/api/generate-kit", {
    method: "POST",
    headers,
    body: JSON.stringify({ input, provider, providerProfileId, generationMode }),
  });

  if (!response.ok) throw new Error(await errorMessage(response, "Server generation failed."));
  const json = await response.json();
  return parseProject(json.project);
}

export async function regenerateSectionFromServer(
  project: ProjectKit,
  sectionKey: string,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
  providerProfileId?: string | null,
) {
  const headers = await requestHeaders();
  const response = await fetch("/api/regenerate-section", {
    method: "POST",
    headers,
    body: JSON.stringify({ project, sectionKey, provider, providerProfileId, generationMode }),
  });

  if (!response.ok) throw new Error(await errorMessage(response, "Server section regeneration failed."));
  const json = await response.json();
  return parseProject(json.project);
}

export async function improveSectionFromServer(
  project: ProjectKit,
  sectionKey: string,
  instruction: string,
  provider?: ProviderSettings | null,
  generationMode: GenerationMode = "balanced",
  providerProfileId?: string | null,
) {
  const headers = await requestHeaders();
  const response = await fetch("/api/improve-section", {
    method: "POST",
    headers,
    body: JSON.stringify({ project, sectionKey, instruction, provider, providerProfileId, generationMode }),
  });

  if (!response.ok) throw new Error(await errorMessage(response, "Server section improvement failed."));
  const json = await response.json();
  return parseProject(json.project);
}

export async function testProvider(provider: ProviderSettings, providerProfileId?: string | null) {
  const headers = await requestHeaders();
  const response = await fetch("/api/test-provider", {
    method: "POST",
    headers,
    body: JSON.stringify({ provider, providerProfileId }),
  });
  const json = await response.json().catch(() => null);
  return {
    ok: response.ok && Boolean(json?.ok),
    message: typeof json?.message === "string" ? json.message : "Provider test failed.",
    model: typeof json?.model === "string" ? json.model : undefined,
  };
}

function parseProject(value: unknown): ProjectKit {
  const parsed = projectKitSchema.safeParse(value);
  if (!parsed.success) throw new Error("Server returned an invalid project.");
  return parsed.data;
}

async function requestHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const client = getSupabaseClient();
  const session = client ? (await client.auth.getSession()).data.session : null;
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  return headers;
}

async function errorMessage(response: Response, fallback: string) {
  const json = await response.json().catch(() => null);
  if (typeof json?.error === "string") return json.error;
  if (typeof json?.message === "string") return json.message;
  return fallback;
}
