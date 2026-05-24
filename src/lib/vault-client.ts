"use client";

import { getSupabaseClient } from "@/lib/supabase-client";

/**
 * Client-side helpers for Provider Vault CRUD.
 * All requests attach the Supabase auth bearer token automatically.
 */

export type VaultProfile = {
  id: string;
  providerName: string;
  providerType: string;
  baseUrl: string;
  defaultModel: string;
  cheapModel: string;
  strongModel: string;
  visionModel: string;
  maxBudgetPerGeneration: number;
  temperature: number;
  tokenLimit: number;
  enabled: boolean;
  apiKeyHint: string | null;
  lastTestedAt: string | null;
  lastTestStatus: string | null;
};

async function vaultHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured. Use local fallback instead.");
  const { data } = await client.auth.getSession();
  if (!data.session?.access_token) throw new Error("Sign in to use the provider vault.");
  headers.Authorization = `Bearer ${data.session.access_token}`;
  return headers;
}

async function handleResponse<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const msg = json?.error?.message ?? json?.error ?? fallback;
    throw new Error(typeof msg === "string" ? msg : fallback);
  }
  return response.json();
}

export async function listProviderProfiles(): Promise<VaultProfile[]> {
  const headers = await vaultHeaders();
  const response = await fetch("/api/provider-profiles", { headers });
  const json = await handleResponse<{ profiles: VaultProfile[] }>(response, "Could not load provider profiles.");
  return json.profiles;
}

export async function createProviderProfile(input: {
  providerName: string;
  providerType: string;
  baseUrl: string;
  apiKey?: string;
  defaultModel?: string;
  cheapModel?: string;
  strongModel?: string;
  visionModel?: string;
  maxBudgetPerGeneration?: number;
  temperature?: number;
  tokenLimit?: number;
  enabled?: boolean;
}): Promise<string> {
  const headers = await vaultHeaders();
  const response = await fetch("/api/provider-profiles", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  const json = await handleResponse<{ id: string }>(response, "Could not save provider profile.");
  return json.id;
}

export async function updateProviderProfile(
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const headers = await vaultHeaders();
  const response = await fetch(`/api/provider-profiles/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(patch),
  });
  await handleResponse(response, "Could not update provider profile.");
}

export async function deleteProviderProfile(id: string): Promise<void> {
  const headers = await vaultHeaders();
  const response = await fetch(`/api/provider-profiles/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(response, "Could not delete provider profile.");
}
