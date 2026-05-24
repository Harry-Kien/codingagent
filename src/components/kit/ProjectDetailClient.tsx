"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportButton } from "@/components/ExportButton";
import { SyncStatusBadge } from "@/components/auth/SyncStatusBadge";
import { ProjectKitTabs } from "@/components/kit/ProjectKitTabs";
import { ReadinessScore } from "@/components/kit/ReadinessScore";
import { RepoRecommendationPanel } from "@/components/repo/RepoRecommendationPanel";
import { AGENT_EXPORT_PACKS } from "@/lib/kit-sections";
import { useProjectStore } from "@/lib/use-project-store";

export function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<ProjectKit | null | undefined>(undefined);
  const store = useProjectStore();
  // Stable ref to store so the effect only re-runs on `id` changes,
  // not when the store object reference changes (e.g. auth state transition).
  const storeRef = useRef(store);
  useEffect(() => { storeRef.current = store; }, [store]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const s = storeRef.current;
        const found = await s.getProject(id);
        if (cancelled) return;
        if (found) {
          const next = { ...found, lastOpenedAt: new Date().toISOString() };
          // Only persist lastOpenedAt — this is a trivial update, no version snapshot.
          void s.saveProject(next);
          setProject(next);
        } else {
          setProject(null);
        }
      })();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id]);

  if (project === undefined) return <LoadingState label="Loading project..." />;
  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This kit is not in your history. Try checking your local or cloud storage."
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
            <SyncStatusBadge />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">{project.name}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-600">{project.input.idea}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton project={project} mode="markdown" />
          <ExportButton project={project} mode="json" />
          <ExportButton project={project} mode="zip" />
          {AGENT_EXPORT_PACKS.map((pack) => (
            <ExportButton
              key={pack.id}
              project={project}
              mode="agent-pack"
              packId={pack.id}
              label={pack.label}
            />
          ))}
        </div>
      </div>
      <ReadinessScore score={project.readinessScore} />
      <RepoRecommendationPanel recommendations={project.repoRecommendations} />
      <ProjectKitTabs initialProject={project} onProjectChange={setProject} />
    </div>
  );
}
