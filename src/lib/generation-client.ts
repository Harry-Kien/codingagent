"use client";

import type { ProjectInput, ProjectKit, ProviderSettings } from "@/types/vibeforge";
import { projectKitSchema } from "@/lib/validation";

export function hasServerProvider(provider?: ProviderSettings | null) {
  if (!provider?.enabled || !provider.baseUrl.trim()) return false;
  if (provider.providerType === "ollama") return true;
  return (
    Boolean(provider.apiKey.trim()) &&
    ["openai-compatible", "openrouter", "gemini", "anthropic-compatible", "custom"].includes(provider.providerType)
  );
}

export async function generateKitFromServer(input: ProjectInput, provider?: ProviderSettings | null) {
  const response = await fetch("/api/generate-kit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, provider }),
  });

  if (!response.ok) throw new Error("Server generation failed.");
  const json = await response.json();
  return parseProject(json.project);
}

export async function regenerateSectionFromServer(
  project: ProjectKit,
  sectionKey: string,
  provider?: ProviderSettings | null,
) {
  const response = await fetch("/api/regenerate-section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, sectionKey, provider }),
  });

  if (!response.ok) throw new Error("Server section regeneration failed.");
  const json = await response.json();
  return parseProject(json.project);
}

export async function improveSectionFromServer(
  project: ProjectKit,
  sectionKey: string,
  instruction: string,
  provider?: ProviderSettings | null,
) {
  const response = await fetch("/api/improve-section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, sectionKey, instruction, provider }),
  });

  if (!response.ok) throw new Error("Server section improvement failed.");
  const json = await response.json();
  return parseProject(json.project);
}

function parseProject(value: unknown): ProjectKit {
  const parsed = projectKitSchema.safeParse(value);
  if (!parsed.success) throw new Error("Server returned an invalid project.");
  return parsed.data;
}
