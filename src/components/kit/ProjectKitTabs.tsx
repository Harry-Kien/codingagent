"use client";

import { useState } from "react";
import type { ProjectKit } from "@/types/vibeforge";
import { SECTION_ORDER } from "@/lib/kit-sections";
import { regenerateSection } from "@/lib/generator";
import { saveProject } from "@/lib/storage";
import { MarkdownSection } from "@/components/kit/MarkdownSection";

export function ProjectKitTabs({
  initialProject,
  onProjectChange,
}: {
  initialProject: ProjectKit;
  onProjectChange?: (project: ProjectKit) => void;
}) {
  const [project, setProject] = useState(initialProject);
  const [active, setActive] = useState<string>(SECTION_ORDER[0][0]);

  function update(next: ProjectKit) {
    setProject(next);
    saveProject(next);
    onProjectChange?.(next);
  }

  function toggleFavorite(sectionKey: string) {
    update({
      ...project,
      favorites: { ...project.favorites, [sectionKey]: !project.favorites[sectionKey] },
      updatedAt: new Date().toISOString(),
    });
  }

  function refresh(sectionKey: string) {
    update(regenerateSection(project, sectionKey));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-lg border border-zinc-200 bg-white p-2">
        <div className="grid max-h-[720px] gap-1 overflow-auto">
          {SECTION_ORDER.map(([key, title]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`rounded-md px-3 py-2 text-left text-sm transition ${
                active === key
                  ? "bg-teal-50 font-semibold text-teal-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <span className="block truncate">{title}</span>
              {project.favorites[key] ? <span className="text-xs text-green-700">Approved</span> : null}
            </button>
          ))}
        </div>
      </div>
      <MarkdownSection
        project={project}
        sectionKey={active}
        onToggleFavorite={toggleFavorite}
        onRegenerate={refresh}
      />
    </div>
  );
}
