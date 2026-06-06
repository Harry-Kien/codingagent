"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Pencil, RefreshCw, Save, Wand2 } from "lucide-react";
import type { ProjectKit, SectionStatus } from "@/types/vibeforge";
import { CopyButton } from "@/components/CopyButton";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { sectionTitle } from "@/lib/kit-sections";

const statusVariants: Record<SectionStatus, "neutral" | "green" | "amber"> = {
  Draft: "neutral",
  Approved: "green",
  "Needs review": "amber",
};

export function MarkdownSection({
  project,
  sectionKey,
  onSave,
  onSetStatus,
  onRegenerate,
  onImprove,
  isRegenerating = false,
  isImproving = false,
  qualityIssues = [],
}: {
  project: ProjectKit;
  sectionKey: string;
  onSave: (sectionKey: string, content: string) => void;
  onSetStatus: (sectionKey: string, status: SectionStatus) => void;
  onRegenerate: (sectionKey: string) => void | Promise<void>;
  onImprove?: (sectionKey: string) => void | Promise<void>;
  isRegenerating?: boolean;
  isImproving?: boolean;
  qualityIssues?: string[];
}) {
  const content = project.sections[sectionKey] ?? "";
  const meta = project.sectionMeta?.[sectionKey];
  const status = meta?.status ?? (project.favorites[sectionKey] ? "Approved" : "Draft");
  const [editor, setEditor] = useState({
    sectionKey,
    isEditing: false,
    draft: content,
  });
  const isEditing = editor.sectionKey === sectionKey && editor.isEditing;
  const draft = isEditing ? editor.draft : content;

  function saveDraft() {
    onSave(sectionKey, draft);
    setEditor({ sectionKey, isEditing: false, draft });
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-950">{sectionTitle(sectionKey)}</h2>
              <Badge variant={statusVariants[status]}>{status}</Badge>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Updated {new Date(meta?.updatedAt ?? project.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={isEditing ? "secondary" : "outline"}
              size="sm"
              aria-pressed={isEditing}
              onClick={() =>
                setEditor((value) => ({
                  sectionKey,
                  isEditing: value.sectionKey === sectionKey ? !value.isEditing : true,
                  draft: value.sectionKey === sectionKey && value.isEditing ? value.draft : content,
                }))
              }
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="primary" size="sm" onClick={saveDraft} disabled={!isEditing || draft.trim() === content.trim()}>
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              variant={status === "Approved" ? "primary" : "outline"}
              size="sm"
              aria-pressed={status === "Approved"}
              onClick={() => onSetStatus(sectionKey, "Approved")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant={status === "Needs review" ? "secondary" : "outline"}
              size="sm"
              aria-pressed={status === "Needs review"}
              onClick={() => onSetStatus(sectionKey, "Needs review")}
            >
              <AlertTriangle className="h-4 w-4" />
              Needs review
            </Button>
            <CopyButton text={isEditing ? draft : content} />
            <ExportButton project={project} mode="section" sectionKey={sectionKey} />
            {onImprove ? (
              <Button variant="secondary" size="sm" onClick={() => onImprove(sectionKey)} disabled={isImproving}>
                <Wand2 className={`h-4 w-4 ${isImproving ? "animate-pulse" : ""}`} />
                {isImproving ? "Improving" : qualityIssues.length ? "Improve weak section" : "Improve"}
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={() => onRegenerate(sectionKey)} disabled={isRegenerating}>
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating" : "Regenerate"}
            </Button>
          </div>
        </div>
        {qualityIssues.length ? (
          <div className="border-b border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">This section needs public-beta polish.</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-5">
                  {qualityIssues.slice(0, 3).map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-h-[720px] overflow-auto p-5">
            {isEditing ? (
              <textarea
                aria-label={`${sectionTitle(sectionKey)} markdown`}
                value={draft}
                onChange={(event) =>
                  setEditor({
                    sectionKey,
                    isEditing: true,
                    draft: event.target.value,
                  })
                }
                className="min-h-[520px] w-full resize-y rounded-md border border-zinc-300 bg-white p-4 font-mono text-sm leading-6 text-zinc-900 shadow-inner outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                spellCheck={false}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-800">{content}</pre>
            )}
          </article>
          <aside className="border-t border-zinc-100 p-4 lg:border-l lg:border-t-0">
            <h3 className="text-sm font-semibold text-zinc-900">Version history</h3>
            {meta?.history.length ? (
              <div className="mt-3 grid gap-2">
                {meta.history.map((version) => (
                  <div key={version.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariants[version.status]}>{version.status}</Badge>
                      <span className="text-xs text-zinc-500">{new Date(version.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-zinc-700">{version.note}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {version.content.replace(/^#+\s*/gm, "").trim() || "Previous empty draft"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-zinc-500">No previous versions yet.</p>
            )}
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}
