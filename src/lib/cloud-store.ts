"use client";

import type { ProjectKit } from "@/types/vibeforge";
import { getSupabaseClient } from "@/lib/supabase-client";

// ---------------------------------------------------------------------------
// Cloud project operations – all owner-scoped via RLS
// ---------------------------------------------------------------------------

export async function cloudGetProjects(): Promise<ProjectKit[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[VibeForge] cloudGetProjects:", error.message);
    return [];
  }
  return (data ?? []).map(rowToKit);
}

export async function cloudGetProject(id: string): Promise<ProjectKit | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[VibeForge] cloudGetProject:", error.message);
    return null;
  }
  return data ? rowToKit(data) : null;
}

export async function cloudSaveProject(project: ProjectKit, userId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const row = kitToRow(project, userId);
  const { error } = await client.from("projects").upsert(row, { onConflict: "id" });

  if (error) {
    console.error("[VibeForge] cloudSaveProject:", error.message);
    return false;
  }
  return true;
}

export async function cloudDeleteProject(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client.from("projects").delete().eq("id", id);

  if (error) {
    console.error("[VibeForge] cloudDeleteProject:", error.message);
    return false;
  }
  return true;
}

/**
 * Write a version snapshot. Only called on meaningful saves (regenerate, import).
 * Not called on trivial renders, opens, or favorites.
 */
export async function cloudSaveVersion(
  projectId: string,
  userId: string,
  sections: Record<string, string>,
  label: string,
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client.from("project_versions").insert({
    project_id: projectId,
    user_id: userId,
    sections_json: sections,
    label,
  });

  if (error) {
    console.error("[VibeForge] cloudSaveVersion:", error.message);
    return false;
  }
  return true;
}

/**
 * Import a local project to the cloud. Checks for existing ID to avoid duplicates.
 */
export async function cloudImportProject(
  project: ProjectKit,
  userId: string,
): Promise<"imported" | "exists" | "error"> {
  const client = getSupabaseClient();
  if (!client) return "error";

  // Check if this project already exists in the cloud
  const { data: existing } = await client
    .from("projects")
    .select("id")
    .eq("id", project.id)
    .maybeSingle();

  if (existing) return "exists";

  const saved = await cloudSaveProject(project, userId);
  return saved ? "imported" : "error";
}

// ---------------------------------------------------------------------------
// Row <-> Kit mapping
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToKit(row: any): ProjectKit {
  return {
    id: row.id,
    name: row.name,
    input: row.input_json,
    sections: row.sections_json,
    favorites: row.favorites_json ?? {},
    repoRecommendations: row.repo_recommendations_json ?? [],
    readinessScore: row.readiness_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at ?? undefined,
  };
}

function kitToRow(kit: ProjectKit, userId: string) {
  return {
    id: kit.id,
    user_id: userId,
    name: kit.name,
    input_json: kit.input,
    sections_json: kit.sections,
    favorites_json: kit.favorites,
    repo_recommendations_json: kit.repoRecommendations,
    readiness_json: kit.readinessScore,
    created_at: kit.createdAt,
    updated_at: kit.updatedAt,
    last_opened_at: kit.lastOpenedAt ?? null,
  };
}
