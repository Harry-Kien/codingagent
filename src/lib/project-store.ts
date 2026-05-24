"use client";

/**
 * Project Store — Unified abstraction over localStorage and Supabase.
 *
 * Rules:
 *  - If user is unauthenticated → use localStorage exclusively.
 *  - If user is authenticated → use Supabase (cloud) as source of truth.
 *  - If Supabase calls fail → keep local copy and flag sync failure.
 *  - localStorage is never removed — it serves as offline cache + guest mode.
 */

import type {
  McpConnection,
  ProjectKit,
  ProviderSettings,
} from "@/types/vibeforge";
import {
  getProjects as localGetProjects,
  getProject as localGetProject,
  saveProject as localSaveProject,
  deleteProject as localDeleteProject,
  duplicateProject as localDuplicateProject,
  getProviders as localGetProviders,
  saveProviders as localSaveProviders,
  getMcpConnections as localGetMcpConnections,
  saveMcpConnections as localSaveMcpConnections,
} from "@/lib/storage";
import { getSupabaseClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SyncStatus = "local-only" | "cloud-synced" | "sync-failed";

export type StoreMode = "local" | "cloud";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function mapProjectToRow(project: ProjectKit, userId: string) {
  return {
    id: project.id,
    user_id: userId,
    name: project.name,
    input_json: project.input,
    sections_json: project.sections,
    favorites_json: project.favorites,
    readiness_json: project.readinessScore,
    repo_recommendations_json: project.repoRecommendations,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    last_opened_at: project.lastOpenedAt ?? null,
  };
}

function mapRowToProject(row: Record<string, unknown>): ProjectKit {
  return {
    id: row.id as string,
    name: row.name as string,
    input: row.input_json as ProjectKit["input"],
    sections: row.sections_json as ProjectKit["sections"],
    favorites: (row.favorites_json as ProjectKit["favorites"]) ?? {},
    readinessScore: row.readiness_json as ProjectKit["readinessScore"],
    repoRecommendations:
      (row.repo_recommendations_json as ProjectKit["repoRecommendations"]) ??
      [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    lastOpenedAt: (row.last_opened_at as string) ?? undefined,
  };
}

function mapProviderToRow(provider: ProviderSettings, userId: string) {
  return {
    id: provider.id,
    user_id: userId,
    provider_name: provider.providerName,
    provider_type: provider.providerType,
    base_url: provider.baseUrl,
    default_model: provider.defaultModel,
    cheap_model: provider.cheapModel,
    strong_model: provider.strongModel,
    vision_model: provider.visionModel,
    token_limit: provider.tokenLimit,
    temperature: provider.temperature,
    enabled: provider.enabled,
    // NOTE: apiKey is NOT included — it stays in localStorage only
  };
}

function mapRowToProvider(row: Record<string, unknown>): ProviderSettings {
  return {
    id: row.id as string,
    providerName: (row.provider_name as string) ?? "",
    providerType:
      (row.provider_type as ProviderSettings["providerType"]) ??
      "openai-compatible",
    baseUrl: (row.base_url as string) ?? "",
    apiKey: "", // Always empty from cloud — filled from localStorage later
    defaultModel: (row.default_model as string) ?? "",
    cheapModel: (row.cheap_model as string) ?? "",
    strongModel: (row.strong_model as string) ?? "",
    visionModel: (row.vision_model as string) ?? "",
    maxBudgetPerGeneration: 0.5,
    temperature: Number(row.temperature) || 0.4,
    tokenLimit: Number(row.token_limit) || 6000,
    enabled: row.enabled !== false,
  };
}

function mapMcpToRow(conn: McpConnection, userId: string) {
  return {
    id: conn.id,
    user_id: userId,
    name: conn.name,
    type: conn.type,
    command_or_url: conn.commandOrUrl,
    environment_variables: conn.environmentVariables,
    status: conn.status,
    notes: conn.notes,
  };
}

function mapRowToMcp(row: Record<string, unknown>): McpConnection {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    type: (row.type as McpConnection["type"]) ?? "Custom MCP server",
    commandOrUrl: (row.command_or_url as string) ?? "",
    environmentVariables: (row.environment_variables as string) ?? "",
    status: (row.status as McpConnection["status"]) ?? "Not configured",
    notes: (row.notes as string) ?? "",
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getCloudProjects(userId: string): Promise<{
  data: ProjectKit[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: "Supabase not configured" };

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return {
    data: (data ?? []).map((row) =>
      mapRowToProject(row as Record<string, unknown>),
    ),
    error: null,
  };
}

export async function getCloudProject(
  projectId: string,
): Promise<{
  data: ProjectKit | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: "Supabase not configured" };

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) return { data: null, error: error.message };
  return {
    data: data
      ? mapRowToProject(data as unknown as Record<string, unknown>)
      : null,
    error: null,
  };
}

export async function saveCloudProject(
  project: ProjectKit,
  userId: string,
): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase not configured" };

  const row = mapProjectToRow(project, userId);
  const { error } = await client.from("projects").upsert(row, {
    onConflict: "id",
  });
  return { error: error?.message ?? null };
}

export async function deleteCloudProject(
  projectId: string,
): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase not configured" };

  const { error } = await client
    .from("projects")
    .delete()
    .eq("id", projectId);
  return { error: error?.message ?? null };
}

export async function importLocalProjectsToCloud(
  userId: string,
): Promise<{ imported: number; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { imported: 0, error: "Supabase not configured" };

  const localProjects = localGetProjects();
  if (!localProjects.length) return { imported: 0, error: null };

  const rows = localProjects.map((project) =>
    mapProjectToRow(project, userId),
  );

  const { error } = await client
    .from("projects")
    .upsert(rows, { onConflict: "id" });

  if (error) return { imported: 0, error: error.message };
  return { imported: localProjects.length, error: null };
}

// ---------------------------------------------------------------------------
// Project Versions
// ---------------------------------------------------------------------------

export async function saveProjectVersion(
  projectId: string,
  userId: string,
  sectionKey: string,
  content: string,
  changeNote: string,
): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase not configured" };

  const { error } = await client.from("project_versions").insert({
    project_id: projectId,
    user_id: userId,
    section_key: sectionKey,
    content,
    change_note: changeNote,
  });
  return { error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// Provider Profiles
// ---------------------------------------------------------------------------

export async function getCloudProviders(userId: string): Promise<{
  data: ProviderSettings[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: "Supabase not configured" };

  const { data, error } = await client
    .from("provider_profiles")
    .select("*")
    .eq("user_id", userId);

  if (error) return { data: [], error: error.message };

  // Merge cloud provider metadata with local API keys
  const localProviders = localGetProviders();
  const localKeyMap = new Map(
    localProviders.map((provider) => [provider.id, provider.apiKey]),
  );

  const cloudProviders = (data ?? []).map((row) => {
    const provider = mapRowToProvider(row as Record<string, unknown>);
    provider.apiKey = localKeyMap.get(provider.id) ?? "";
    return provider;
  });

  return { data: cloudProviders, error: null };
}

export async function saveCloudProviders(
  providers: ProviderSettings[],
  userId: string,
): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase not configured" };

  // Delete existing and re-insert (upsert all)
  const rows = providers.map((provider) =>
    mapProviderToRow(provider, userId),
  );

  // Delete all existing for this user first
  await client
    .from("provider_profiles")
    .delete()
    .eq("user_id", userId);

  if (rows.length) {
    const { error } = await client.from("provider_profiles").insert(rows);
    if (error) return { error: error.message };
  }

  // Always save API keys locally — cloud never stores them
  localSaveProviders(providers);
  return { error: null };
}

// ---------------------------------------------------------------------------
// MCP Connections
// ---------------------------------------------------------------------------

export async function getCloudMcpConnections(userId: string): Promise<{
  data: McpConnection[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: "Supabase not configured" };

  const { data, error } = await client
    .from("mcp_connections")
    .select("*")
    .eq("user_id", userId);

  if (error) return { data: [], error: error.message };
  return {
    data: (data ?? []).map((row) =>
      mapRowToMcp(row as Record<string, unknown>),
    ),
    error: null,
  };
}

export async function saveCloudMcpConnections(
  connections: McpConnection[],
  userId: string,
): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase not configured" };

  await client
    .from("mcp_connections")
    .delete()
    .eq("user_id", userId);

  if (connections.length) {
    const rows = connections.map((conn) => mapMcpToRow(conn, userId));
    const { error } = await client.from("mcp_connections").insert(rows);
    if (error) return { error: error.message };
  }

  // Also save locally as offline cache
  localSaveMcpConnections(connections);
  return { error: null };
}

// ---------------------------------------------------------------------------
// Unified store hook helpers
// ---------------------------------------------------------------------------

/**
 * Determine store mode: if user is authenticated and Supabase is configured → cloud.
 * Otherwise → local.
 */
export function resolveStoreMode(
  isAuthenticated: boolean,
  isSupabaseAvailable: boolean,
): StoreMode {
  if (isAuthenticated && isSupabaseAvailable) return "cloud";
  return "local";
}

// Re-export local functions for convenience
export {
  localGetProjects,
  localGetProject,
  localSaveProject,
  localDeleteProject,
  localDuplicateProject,
  localGetProviders,
  localSaveProviders,
  localGetMcpConnections,
  localSaveMcpConnections,
};
