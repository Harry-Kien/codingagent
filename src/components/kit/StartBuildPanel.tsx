"use client";

import { ArrowRight, CheckCircle2, TerminalSquare } from "lucide-react";
import type { ProjectKit, ReadinessScore } from "@/types/vibeforge";
import { CopyButton } from "@/components/CopyButton";
import { ExportButton } from "@/components/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StartBuildPanel({
  project,
  readinessScore = project.readinessScore,
}: {
  project: ProjectKit;
  readinessScore?: ReadinessScore;
}) {
  const prompt = firstBuildPrompt(project);
  const actions = readinessScore.nextActions.length
    ? readinessScore.nextActions
    : [
        "Export the Codex Pack.",
        "Open the project folder in Codex or Cline.",
        "Implement the first milestone from TASKS.md.",
      ];

  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle>Start Build</CardTitle>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Hand this kit to a coding agent and start with the smallest working milestone.
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <CopyButton text={prompt} label="Copy first build prompt" />
            <ExportButton project={project} mode="agent-pack" packId="codex" label="Codex Pack" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <TerminalSquare className="h-4 w-4 text-teal-700" />
            First build prompt
          </div>
          <pre className="mt-3 max-h-56 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100 [overflow-wrap:anywhere]">
            {prompt}
          </pre>
        </div>
        <div className="min-w-0 rounded-lg border border-teal-100 bg-teal-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-950">
            <ArrowRight className="h-4 w-4" />
            Next actions
          </div>
          <div className="mt-3 grid gap-2">
            {actions.slice(0, 5).map((action) => (
              <div key={action} className="flex gap-2 text-sm leading-6 text-teal-900">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function firstBuildPrompt(project: ProjectKit) {
  return [
    "Read AGENTS.md, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, and NEXT_ACTIONS.md from this VibeForge kit.",
    "",
    `Project: ${project.name}`,
    `App type: ${project.input.appType}`,
    `Timeline: ${project.input.timeline}`,
    `Skill level: ${project.input.skillLevel}`,
    "",
    "Implement the first milestone only. Preserve local-first behavior, do not require API keys for the core flow, and do not clone external repositories automatically.",
    "Before changing code, inspect the existing structure. Make small focused edits, then run lint and build.",
    "",
    "Start with TASKS.md and report the files changed plus checks run.",
  ].join("\n");
}
