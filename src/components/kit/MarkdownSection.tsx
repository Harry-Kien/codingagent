"use client";

import { RefreshCw, Star } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { CopyButton } from "@/components/CopyButton";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sectionTitle } from "@/lib/kit-sections";

export function MarkdownSection({
  project,
  sectionKey,
  onToggleFavorite,
  onRegenerate,
  isRegenerating = false,
}: {
  project: ProjectKit;
  sectionKey: string;
  onToggleFavorite: (sectionKey: string) => void;
  onRegenerate: (sectionKey: string) => void;
  isRegenerating?: boolean;
}) {
  const content = project.sections[sectionKey] ?? "";
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">{sectionTitle(sectionKey)}</h2>
            <p className="mt-1 text-xs text-zinc-500">Copy, download, approve, or regenerate this section only.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={content} />
            <ExportButton project={project} mode="section" sectionKey={sectionKey} />
            <Button
              variant={project.favorites[sectionKey] ? "primary" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(sectionKey)}
            >
              <Star className="h-4 w-4" />
              {project.favorites[sectionKey] ? "Approved" : "Approve"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onRegenerate(sectionKey)} disabled={isRegenerating}>
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating" : "Regenerate"}
            </Button>
          </div>
        </div>
        <article className="prose-vibeforge max-h-[680px] overflow-auto p-5">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-800">{content}</pre>
        </article>
      </CardContent>
    </Card>
  );
}
