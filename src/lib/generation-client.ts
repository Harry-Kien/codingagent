"use client";

import type { GenerationMode, ProjectInput, ProjectKit, ProviderSettings } from "@/types/vibeforge";
import { getSupabaseClient } from "@/lib/supabase-client";
import { projectKitSchema } from "@/lib/validation";

const SERVER_GENERATION_TIMEOUT_MS = 58_000;
const SERVER_SECTION_TIMEOUT_MS = 40_000;
const SERVER_TEST_TIMEOUT_MS = 15_000;

export function hasServerProvider(provider?: ProviderSettings | null) {
  if (process.env.NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_ENABLED === "true") return true;
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
  const response = await serverPost(
    "/api/generate-kit",
    { input, provider, providerProfileId, generationMode },
    SERVER_GENERATION_TIMEOUT_MS,
    headers,
  );

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
  const response = await serverPost(
    "/api/regenerate-section",
    { project, sectionKey, provider, providerProfileId, generationMode },
    SERVER_SECTION_TIMEOUT_MS,
    headers,
  );

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
  const response = await serverPost(
    "/api/improve-section",
    { project, sectionKey, instruction, provider, providerProfileId, generationMode },
    SERVER_SECTION_TIMEOUT_MS,
    headers,
  );

  if (!response.ok) throw new Error(await errorMessage(response, "Server section improvement failed."));
  const json = await response.json();
  return parseProject(json.project);
}

export async function testProvider(provider: ProviderSettings, providerProfileId?: string | null) {
  let response: Response;
  try {
    response = await serverPost("/api/test-provider", { provider, providerProfileId }, SERVER_TEST_TIMEOUT_MS);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Provider test timed out or failed.",
      model: undefined,
    };
  }
  const json = await response.json().catch(() => null);
  const detail =
    typeof json?.error?.title === "string" && typeof json?.error?.nextStep === "string"
      ? `${json.error.title}: ${json.error.message ?? "Provider test failed."} ${json.error.nextStep}`
      : undefined;
  return {
    ok: response.ok && Boolean(json?.ok),
    message: detail ?? (typeof json?.message === "string" ? json.message : "Provider test failed."),
    model: typeof json?.model === "string" ? json.model : undefined,
  };
}

async function serverPost(
  route: string,
  payload: unknown,
  timeoutMs: number,
  headers?: Record<string, string>,
) {
  const requestHeadersValue = headers ?? (await requestHeaders());
  try {
    return await fetch(route, {
      method: "POST",
      headers: requestHeadersValue,
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      throw new Error(`Server generation exceeded ${Math.round(timeoutMs / 1000)}s. Demo fallback was used.`);
    }
    throw error;
  }
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
  if (typeof json?.error?.message === "string") {
    const nextStep = typeof json.error.nextStep === "string" ? ` ${json.error.nextStep}` : "";
    return `${json.error.message}${nextStep}`;
  }
  if (typeof json?.error === "string") return json.error;
  if (typeof json?.message === "string") return json.message;
  return fallback;
}
