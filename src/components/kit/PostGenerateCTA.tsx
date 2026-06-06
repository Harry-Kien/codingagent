"use client";

import type { ReactNode } from "react";
import { BookOpen, GitBranch, ListChecks, PackageCheck, Rocket } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { ExportButton } from "@/components/ExportButton";

function firstPrompt(project: ProjectKit) {
  return [
    "Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, API_SPEC.md, TASKS.md, IMPLEMENTATION_PHASES.md, REPO_REFERENCES.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md.",
    "",
    `Project: ${project.name}`,
    `App type: ${project.input.appType}`,
    `Timeline: ${project.input.timeline}`,
    "",
    "Implement only the first task from TASKS.md. Preserve local-first/demo behavior. Do not hardcode secrets. Do not clone external repos. Run the listed test command and report changed files.",
  ].join("\n");
}

export function PostGenerateCTA({
  project,
  onOpenSection,
}: {
  project: ProjectKit;
  onOpenSection?: (sectionKey: string) => void;
}) {
  const prompt = firstPrompt(project);

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-white">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-teal-950">Project kit ready</h2>
              <p className="text-sm text-teal-800">
                {Object.keys(project.sections).length} sections, {project.repoRecommendations?.length ?? 0} repo references, export packs ready.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton project={project} mode="agent-pack" packId="codex" label="Codex Pack" />
          <CopyButton text={prompt} label="Copy first prompt" />
          <ExportButton project={project} mode="zip" label="Download ZIP" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        <ActionButton icon={<ListChecks className="h-4 w-4" />} label="Open TASKS.md" onClick={() => onOpenSection?.("task-plan")} />
        <ActionButton icon={<BookOpen className="h-4 w-4" />} label="Review handoff" onClick={() => onOpenSection?.("ai-handoff")} />
        <ActionButton icon={<GitBranch className="h-4 w-4" />} label="Repo references" onClick={() => onOpenSection?.("repo-tool-map")} />
        <ActionButton icon={<Rocket className="h-4 w-4" />} label="Next actions" onClick={() => onOpenSection?.("next-actions")} />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" className="justify-start" onClick={onClick}>
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  );
}
