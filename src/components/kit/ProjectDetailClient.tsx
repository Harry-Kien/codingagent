"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportButton } from "@/components/ExportButton";
import { SyncStatusBadge } from "@/components/auth/SyncStatusBadge";
import { ProjectKitTabs } from "@/components/kit/ProjectKitTabs";
import { ReadinessScore } from "@/components/kit/ReadinessScore";
import { StartBuildPanel } from "@/components/kit/StartBuildPanel";
import { RepoRecommendationPanel } from "@/components/repo/RepoRecommendationPanel";
import { PostGenerateCTA } from "@/components/kit/PostGenerateCTA";
import { AGENT_EXPORT_PACKS, SECTION_ORDER } from "@/lib/kit-sections";
import { deriveReadinessScore, evaluateKitQuality, getWeakSectionKeys } from "@/lib/kit-quality";
import { polishWeakSections } from "@/lib/kit-polish";
import { getActiveProvider } from "@/lib/storage";
import { hasServerProvider, improveSectionFromServer } from "@/lib/generation-client";
import { useProjectStore } from "@/lib/use-project-store";
import { useAuth } from "@/lib/auth-context";

export function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<ProjectKit | null | undefined>(undefined);
  const [activeSection, setActiveSection] = useState("task-plan");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isProviderPolishing, setIsProviderPolishing] = useState(false);
  const kitTabsRef = useRef<HTMLDivElement | null>(null);
  const store = useProjectStore();
  const { user } = useAuth();
  const storageMode = user ? "Cloud" : "Local";

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
          // Only persist lastOpenedAt; this is a trivial update, no version snapshot.
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

  function openSection(sectionKey: string) {
    setActiveSection(sectionKey);
    window.setTimeout(() => {
      kitTabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  async function polishProject() {
    if (!project) return;
    setIsPolishing(true);
    try {
      const next = polishWeakSections(project);
      await store.saveProject(next);
      await store.saveVersion(next.id, next.sections, "Auto-polished weak sections");
      setProject(next);
    } finally {
      setIsPolishing(false);
    }
  }

  async function providerPolishProject() {
    if (!project) return;
    const provider = getActiveProvider();
    setIsProviderPolishing(true);
    try {
      let next = project;
      const providerActive = hasServerProvider(provider);
      if (providerActive) {
        const generationMode = project.generation?.mode ?? "balanced";
        for (const [sectionKey, title] of SECTION_ORDER) {
          const issues = evaluateKitQuality(next)
            .filter((check) => !check.passed && check.sectionKey === sectionKey)
            .map((check) => check.guidance)
            .join(" ");
          const improved = await improveSectionFromServer(
            next,
            sectionKey,
            `Regenerate and polish the full ${title} section for professional public-beta quality. ${issues ? `Address these known gaps: ${issues}.` : "Even if no checklist gap is present, tighten specificity, implementation detail, and agent usability."} Keep it specific to the project and include file paths, acceptance criteria, dependencies, verification commands, and no-clone repo policy where relevant.`,
            provider,
            generationMode,
          ).catch(() => null);
          if (improved) next = improved;
        }
      }

      next = polishWeakSections(next);
      await store.saveProject(next);
      await store.saveVersion(next.id, next.sections, providerActive ? "Provider-polished all sections" : "Auto-polished weak sections");
      setProject(next);
    } finally {
      setIsProviderPolishing(false);
    }
  }

  const readinessScore = deriveReadinessScore(project);
  const stableDemoSelected = project.generation?.fallbackReason?.includes("Stable demo generation was selected");

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
            {project.generation ? (
              <Badge variant={project.generation.source === "provider" ? "green" : "neutral"}>
                {project.generation.source === "provider"
                  ? `AI: ${project.generation.providerName ?? "Provider"}`
                  : stableDemoSelected
                    ? "AI: Demo stable"
                    : "AI: Demo fallback"}
              </Badge>
            ) : null}
            <Badge variant={storageMode === "Cloud" ? "blue" : "neutral"}>
              Storage: {storageMode}
            </Badge>
            <SyncStatusBadge />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">{project.name}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-600">{project.input.idea}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton project={project} mode="markdown" />
          <ExportButton project={project} mode="quality-report" />
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
      {project.generation?.fallbackReason ? (
        <div className={`rounded-lg border p-4 text-sm leading-6 ${
          stableDemoSelected
            ? "border-green-200 bg-green-50 text-green-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}>
          <div className="flex items-start gap-2">
            {stableDemoSelected ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div>
              <p className="font-semibold">
                {stableDemoSelected
                  ? "Stable demo kit generated."
                  : project.generation.source === "provider"
                  ? "Provider output was completed with local fallback."
                  : "Demo fallback was used for this kit."}
              </p>
              <p className="mt-1">{project.generation.fallbackReason}</p>
              <p className={`mt-1 text-xs ${stableDemoSelected ? "text-green-800" : "text-amber-800"}`}>
                {project.generation.source === "provider"
                  ? "The kit is still exportable. Regenerate the fallback sections if you want another provider pass."
                  : "The kit is still exportable. Re-test provider settings when you want provider-backed generation."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <PostGenerateCTA project={project} onOpenSection={openSection} />
      <div ref={kitTabsRef}>
        <ProjectKitTabs
          initialProject={project}
          onProjectChange={setProject}
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <ReadinessScore score={readinessScore} />
          <KitQualityChecklist
            project={project}
            isPolishing={isPolishing}
            isProviderPolishing={isProviderPolishing}
            onPolish={polishProject}
            onProviderPolish={providerPolishProject}
          />
        </div>
        <StartBuildPanel project={project} readinessScore={readinessScore} />
      </div>
      <RepoRecommendationPanel recommendations={project.repoRecommendations} />
    </div>
  );
}

function KitQualityChecklist({
  project,
  isPolishing,
  isProviderPolishing,
  onPolish,
  onProviderPolish,
}: {
  project: ProjectKit;
  isPolishing: boolean;
  isProviderPolishing: boolean;
  onPolish: () => void | Promise<void>;
  onProviderPolish: () => void | Promise<void>;
}) {
  const checks = useMemo(() => evaluateKitQuality(project), [project]);
  const passCount = checks.filter((c) => c.passed).length;
  const allPassed = passCount === checks.length;
  const weakSections = getWeakSectionKeys(project);

  return (
    <div className={`rounded-lg border p-4 ${allPassed ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {allPassed ? (
            <CheckCircle2 className="h-4 w-4 text-green-700" />
          ) : (
            <XCircle className="h-4 w-4 text-amber-700" />
          )}
          <span className={allPassed ? "text-green-900" : "text-amber-900"}>
            Kit Quality: {passCount}/{checks.length} checks passed
          </span>
        </div>
        {!allPassed ? (
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-xs leading-5 text-amber-800">
              Focus next on {weakSections.slice(0, 3).join(", ") || "the flagged sections"} before handing this kit to an agent.
            </p>
            <Button size="sm" onClick={onPolish} disabled={isPolishing}>
              <Sparkles className="h-3.5 w-3.5" />
              {isPolishing ? "Polishing" : "Auto polish weak sections"}
            </Button>
            <Button size="sm" variant="secondary" onClick={onProviderPolish} disabled={isProviderPolishing}>
              <Sparkles className="h-3.5 w-3.5" />
              {isProviderPolishing ? "Provider polishing" : "Provider polish all"}
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            {check.passed ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            )}
            <span className={check.passed ? "text-green-800" : "text-amber-800"}>{check.label}</span>
          </div>
        ))}
      </div>
      {!allPassed ? (
        <div className="mt-3 grid gap-2 text-xs leading-5 text-amber-900 md:grid-cols-2">
          {checks.filter((check) => !check.passed).slice(0, 4).map((check) => (
            <p key={`${check.label}-guidance`} className="rounded-md border border-amber-200 bg-white/70 p-2">
              <span className="font-semibold">{check.label}:</span> {check.guidance}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
