"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportButton } from "@/components/ExportButton";
import { ProjectKitTabs } from "@/components/kit/ProjectKitTabs";
import { ReadinessScore } from "@/components/kit/ReadinessScore";
import { RepoRecommendationPanel } from "@/components/repo/RepoRecommendationPanel";
import { SyncStatusBadge } from "@/components/app/SyncStatusBadge";
import {
  localGetProject,
  localSaveProject,
  getCloudProject,
  saveCloudProject,
  resolveStoreMode,
  type SyncStatus,
} from "@/lib/project-store";
import { useAuth } from "@/lib/auth";

export function ProjectDetailClient({ id }: { id: string }) {
  const { user, isAuthenticated, isSupabaseAvailable } = useAuth();
  const storeMode = resolveStoreMode(isAuthenticated, isSupabaseAvailable);

  const [project, setProject] = useState<ProjectKit | null | undefined>(undefined);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local-only");

  const loadProject = useCallback(async () => {
    let found: ProjectKit | null = null;

    if (storeMode === "cloud") {
      const result = await getCloudProject(id);
      if (result.error) {
        setSyncStatus("sync-failed");
        // Fall back to local
        found = localGetProject(id);
      } else {
        setSyncStatus("cloud-synced");
        found = result.data;
      }
    } else {
      setSyncStatus("local-only");
      found = localGetProject(id);
    }

    if (found) {
      const next = { ...found, lastOpenedAt: new Date().toISOString() };
      // Save updated last_opened_at
      localSaveProject(next);
      if (storeMode === "cloud" && user) {
        void saveCloudProject(next, user.id);
      }
      setProject(next);
    } else {
      setProject(null);
    }
  }, [id, storeMode, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProject(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProject]);

  const handleProjectChange = useCallback(
    (updated: ProjectKit) => {
      setProject(updated);
      localSaveProject(updated);
      if (storeMode === "cloud" && user) {
        saveCloudProject(updated, user.id).then((result) => {
          if (result.error) {
            setSyncStatus("sync-failed");
          } else {
            setSyncStatus("cloud-synced");
          }
        });
      }
    },
    [storeMode, user],
  );

  if (project === undefined) return <LoadingState label="Loading project..." />;
  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This kit is not in local history for this browser."
        action={
          <Link href="/projects">
            <Button>Back to history</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950">
            <ArrowLeft className="h-4 w-4" />
            Projects
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="teal">{project.input.appType}</Badge>
            <Badge variant="blue">{project.input.timeline}</Badge>
            <Badge variant="amber">{project.input.budgetSensitivity} budget sensitivity</Badge>
            <SyncStatusBadge status={syncStatus} />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">{project.name}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-600">{project.input.idea}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton project={project} mode="markdown" />
          <ExportButton project={project} mode="json" />
          <ExportButton project={project} mode="zip" />
        </div>
      </div>
      <ReadinessScore score={project.readinessScore} />
      <RepoRecommendationPanel recommendations={project.repoRecommendations} />
      <ProjectKitTabs initialProject={project} onProjectChange={handleProjectChange} />
    </div>
  );
}
