"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ProjectKit } from "@/types/vibeforge";
import { useAuth } from "@/lib/auth-context";
import * as local from "@/lib/storage";
import * as cloud from "@/lib/cloud-store";

export type StoreMode = "local" | "cloud";

/**
 * Unified project store hook.
 * - Unauthenticated users → localStorage (local)
 * - Authenticated users → Supabase (cloud) with localStorage fallback on failure
 *
 * API keys are NEVER included in cloud operations.
 */
export function useProjectStore() {
  const { user } = useAuth();
  const mode: StoreMode = user ? "cloud" : "local";

  // Keep a stable ref to user so callbacks don't need user in their dep arrays.
  // This prevents effect re-runs when auth state changes.
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  const getProjects = useCallback(async (): Promise<ProjectKit[]> => {
    if (mode === "cloud") {
      const cloudProjects = await cloud.cloudGetProjects();
      // If cloud returns empty and is possibly a transient failure,
      // the user still sees nothing (RLS means empty = no data or no auth).
      return cloudProjects;
    }
    return local.getProjects();
  }, [mode]);

  const getProject = useCallback(
    async (id: string): Promise<ProjectKit | null> => {
      if (mode === "cloud") {
        const cloudProject = await cloud.cloudGetProject(id);
        // Fallback to local if cloud returned null (could be network failure)
        if (!cloudProject) {
          const localProject = local.getProject(id);
          if (localProject) return localProject;
        }
        return cloudProject;
      }
      return local.getProject(id);
    },
    [mode],
  );

  const saveProject = useCallback(
    async (project: ProjectKit): Promise<boolean> => {
      const currentUser = userRef.current;
      if (mode === "cloud" && currentUser) {
        const success = await cloud.cloudSaveProject(project, currentUser.id);
        if (!success) {
          // CRITICAL SAFETY: if cloud save fails, persist to localStorage
          // so the user does not lose their work.
          console.warn("[VibeForge] Cloud save failed, falling back to localStorage.");
          local.saveProject(project);
        }
        return success;
      }
      local.saveProject(project);
      return true;
    },
    [mode],
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      if (mode === "cloud") {
        return cloud.cloudDeleteProject(id);
      }
      local.deleteProject(id);
      return true;
    },
    [mode],
  );

  const duplicateProject = useCallback(
    async (id: string): Promise<ProjectKit | null> => {
      const project = await getProject(id);
      if (!project) return null;

      const now = new Date().toISOString();
      const copy: ProjectKit = {
        ...project,
        id: `kit_${crypto.randomUUID()}`,
        name: `${project.name} copy`,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
      };
      await saveProject(copy);
      return copy;
    },
    [getProject, saveProject],
  );

  /**
   * Import a local project to the cloud. Safe: checks for existing ID.
   */
  const importToCloud = useCallback(
    async (project: ProjectKit): Promise<"imported" | "exists" | "error"> => {
      const currentUser = userRef.current;
      if (!currentUser) return "error";
      return cloud.cloudImportProject(project, currentUser.id);
    },
    [],
  );

  /**
   * Save a project version snapshot (only on meaningful changes).
   */
  const saveVersion = useCallback(
    async (projectId: string, sections: Record<string, string>, label: string) => {
      const currentUser = userRef.current;
      if (mode === "cloud" && currentUser) {
        return cloud.cloudSaveVersion(projectId, currentUser.id, sections, label);
      }
      // Local mode: no versioning in MVP
      return false;
    },
    [mode],
  );

  return useMemo(
    () => ({
      mode,
      getProjects,
      getProject,
      saveProject,
      deleteProject,
      duplicateProject,
      importToCloud,
      saveVersion,
    }),
    [mode, getProjects, getProject, saveProject, deleteProject, duplicateProject, importToCloud, saveVersion],
  );
}
