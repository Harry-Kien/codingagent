"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import type { ProjectKit, SectionStatus } from "@/types/vibeforge";
import { SECTION_ORDER } from "@/lib/kit-sections";
import { regenerateSection } from "@/lib/generator";
import { hasServerProvider, improveSectionFromServer, regenerateSectionFromServer } from "@/lib/generation-client";
import { getSectionQualityIssues, getWeakSectionKeys } from "@/lib/kit-quality";
import {
  normalizeProjectWorkspace,
  updateSectionContent,
  updateSectionStatus,
} from "@/lib/section-workspace";
import { getActiveProvider } from "@/lib/storage";
import { useProjectStore } from "@/lib/use-project-store";
import { MarkdownSection } from "@/components/kit/MarkdownSection";

export function ProjectKitTabs({
  initialProject,
  onProjectChange,
  activeSection,
  onActiveSectionChange,
}: {
  initialProject: ProjectKit;
  onProjectChange?: (project: ProjectKit) => void;
  activeSection?: string;
  onActiveSectionChange?: (sectionKey: string) => void;
}) {
  const [project, setProject] = useState(() => normalizeProjectWorkspace(initialProject));
  const [localActive, setLocalActive] = useState<string>(SECTION_ORDER[0][0]);
  const [regenerating, setRegenerating] = useState("");
  const [improving, setImproving] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SectionStatus | "All" | "Weak">("All");
  const store = useProjectStore();
  const active = activeSection ?? localActive;
  const weakSections = getWeakSectionKeys(project);
  const sectionCounts = SECTION_ORDER.reduce(
    (counts, [key]) => {
      counts[sectionStatus(key)] += 1;
      return counts;
    },
    { Draft: 0, Approved: 0, "Needs review": 0 } as Record<SectionStatus, number>,
  );
  const visibleSections = SECTION_ORDER.filter(([key, title]) => {
    const matchesQuery = `${title} ${key}`.toLowerCase().includes(query.trim().toLowerCase());
    const status = sectionStatus(key);
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Weak" ? weakSections.includes(key) : status === statusFilter);
    return matchesQuery && matchesStatus;
  });

  function chooseSection(sectionKey: string) {
    setLocalActive(sectionKey);
    onActiveSectionChange?.(sectionKey);
  }

  function update(next: ProjectKit, isRegeneration = false) {
    setProject(next);
    // Delegate persistence to the store abstraction, which
    // handles both local and cloud storage based on auth state.
    void store.saveProject(next);
    onProjectChange?.(next);

    // Save a version snapshot only on meaningful changes (regeneration),
    // not on favorites, trivial edits, or renders.
    if (isRegeneration) {
      void store.saveVersion(next.id, next.sections, `Regenerated ${active}`);
    }
  }

  function saveSection(sectionKey: string, content: string) {
    update(updateSectionContent(project, sectionKey, content, "Saved edit", "Draft"));
  }

  function setSectionStatus(sectionKey: string, status: SectionStatus) {
    update(updateSectionStatus(project, sectionKey, status));
  }

  async function refresh(sectionKey: string) {
    setRegenerating(sectionKey);
    try {
      const provider = getActiveProvider();
      const generationMode = project.generation?.mode ?? "balanced";
      const serverProject = shouldUseServerSectionActions(project, provider)
        ? await regenerateSectionFromServer(project, sectionKey, provider, generationMode).catch(() => null)
        : null;

      update(normalizeProjectWorkspace(serverProject ?? regenerateSection(project, sectionKey)), true);
    } finally {
      setRegenerating("");
    }
  }

  async function improve(sectionKey: string) {
    setImproving(sectionKey);
    try {
      const issues = getSectionQualityIssues(project, sectionKey);
      const instruction = issues.length
        ? `Improve this section for public-beta quality. Address: ${issues.join(" ")}`
        : "Improve this section with more concrete file paths, acceptance criteria, test commands, and AI-agent handoff guidance.";
      const provider = getActiveProvider();
      const generationMode = project.generation?.mode ?? "balanced";
      const serverProject = shouldUseServerSectionActions(project, provider)
        ? await improveSectionFromServer(project, sectionKey, instruction, provider, generationMode).catch(() => null)
        : null;

      if (serverProject) {
        update(normalizeProjectWorkspace(serverProject), true);
      } else {
        const current = project.sections[sectionKey] ?? "";
        update(
          updateSectionContent(
            project,
            sectionKey,
            `${current.trim()}\n\n## Public-Beta Improvement Notes\n${instruction}\n\nAcceptance criteria:\n- This section names concrete files, routes, or data models where relevant.\n- It gives a coding agent a clear next step and verification command.\n- It preserves local-first/demo behavior and the no-clone repo policy.`,
            "Improved section guidance",
            "Needs review",
          ),
          true,
        );
      }
    } finally {
      setImproving("");
  }
}

function shouldUseServerSectionActions(project: ProjectKit, provider: ReturnType<typeof getActiveProvider>) {
  return hasServerProvider(provider) && (project.generation?.source === "provider" || Boolean(provider));
}

  function sectionStatus(sectionKey: string) {
    return project.sectionMeta?.[sectionKey]?.status ?? "Draft";
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-lg border border-zinc-200 bg-white p-2">
        <div className="space-y-2 border-b border-zinc-100 p-2">
          <label className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-700">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sections"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-600">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as SectionStatus | "All" | "Weak")}
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 outline-none"
              aria-label="Filter sections"
            >
              <option>All</option>
              <option>Draft</option>
              <option>Approved</option>
              <option>Needs review</option>
              <option>Weak</option>
            </select>
          </label>
          <div className="grid grid-cols-3 gap-1 text-center text-[11px] leading-4 text-zinc-500">
            <span>{sectionCounts.Draft} draft</span>
            <span>{sectionCounts.Approved} approved</span>
            <span>{weakSections.length} weak</span>
          </div>
        </div>
        <div className="grid max-h-[720px] gap-1 overflow-auto" role="tablist" aria-label="Project kit sections">
          {visibleSections.map(([key, title]) => {
            const status = sectionStatus(key);
            const isWeak = weakSections.includes(key);
            return (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active === key}
                onClick={() => chooseSection(key)}
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
                  {status}{isWeak ? " - weak" : ""}
                </span>
              </button>
            );
          })}
          {!visibleSections.length ? (
            <p className="px-3 py-4 text-sm leading-5 text-zinc-500">No sections match this filter.</p>
          ) : null}
        </div>
      </div>
      <MarkdownSection
        project={project}
        sectionKey={active}
        onSave={saveSection}
        onSetStatus={setSectionStatus}
        onRegenerate={refresh}
        onImprove={improve}
        isRegenerating={regenerating === active}
        isImproving={improving === active}
        qualityIssues={getSectionQualityIssues(project, active)}
      />
    </div>
  );
}
