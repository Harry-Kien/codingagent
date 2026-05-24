"use client";

import { useState } from "react";
import type { ProjectKit, SectionStatus } from "@/types/vibeforge";
import { SECTION_ORDER } from "@/lib/kit-sections";
import { regenerateSection } from "@/lib/generator";
import {
  normalizeProjectWorkspace,
  updateSectionContent,
  updateSectionStatus,
} from "@/lib/section-workspace";
import { saveProject } from "@/lib/storage";
import { MarkdownSection } from "@/components/kit/MarkdownSection";

export function ProjectKitTabs({
  initialProject,
  onProjectChange,
}: {
  initialProject: ProjectKit;
  onProjectChange?: (project: ProjectKit) => void;
}) {
  const [project, setProject] = useState(() => normalizeProjectWorkspace(initialProject));
  const [active, setActive] = useState<string>(SECTION_ORDER[0][0]);

  function update(next: ProjectKit) {
    setProject(next);
    saveProject(next);
    onProjectChange?.(next);
  }

  function saveSection(sectionKey: string, content: string) {
    update(updateSectionContent(project, sectionKey, content, "Saved edit", "Draft"));
  }

  function setSectionStatus(sectionKey: string, status: SectionStatus) {
    update(updateSectionStatus(project, sectionKey, status));
  }

  function refresh(sectionKey: string) {
    update(regenerateSection(project, sectionKey));
  }

  function sectionStatus(sectionKey: string) {
    return project.sectionMeta?.[sectionKey]?.status ?? "Draft";
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-lg border border-zinc-200 bg-white p-2">
        <div className="grid max-h-[720px] gap-1 overflow-auto" role="tablist" aria-label="Project kit sections">
          {SECTION_ORDER.map(([key, title]) => {
            const status = sectionStatus(key);
            return (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active === key}
                onClick={() => setActive(key)}
                className={`rounded-md px-3 py-2 text-left text-sm transition ${
                  active === key
                    ? "bg-teal-50 font-semibold text-teal-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                <span className="block truncate">{title}</span>
                <span
                  className={`text-xs ${
                    status === "Approved"
                      ? "text-green-700"
                      : status === "Needs review"
                        ? "text-amber-700"
                        : "text-zinc-500"
                  }`}
                >
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <MarkdownSection
        project={project}
        sectionKey={active}
        onSave={saveSection}
        onSetStatus={setSectionStatus}
        onRegenerate={refresh}
      />
    </div>
  );
}
