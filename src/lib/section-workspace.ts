"use client";

import type { ProjectKit, SectionStatus, SectionVersion, SectionWorkspaceState } from "@/types/vibeforge";
import { SECTION_ORDER, sectionTitle } from "@/lib/kit-sections";
import { uid } from "@/lib/utils";

const STATUS_VALUES: SectionStatus[] = ["Draft", "Approved", "Needs review"];
const MAX_HISTORY_ITEMS = 8;

function isSectionStatus(value: unknown): value is SectionStatus {
  return typeof value === "string" && STATUS_VALUES.includes(value as SectionStatus);
}

export function normalizeProjectWorkspace(project: ProjectKit): ProjectKit {
  const sections = { ...project.sections };
  const favorites = { ...(project.favorites ?? {}) };
  const sectionMeta: Record<string, SectionWorkspaceState> = {};
  const now = project.updatedAt || project.createdAt || new Date().toISOString();

  SECTION_ORDER.forEach(([key, title]) => {
    sections[key] = sections[key] ?? defaultSectionContent(project, key, title);
    const existing = project.sectionMeta?.[key];
    const status = isSectionStatus(existing?.status)
      ? existing.status
      : favorites[key]
        ? "Approved"
        : "Draft";
    const history = Array.isArray(existing?.history)
      ? existing.history.filter(isSectionVersion).slice(0, MAX_HISTORY_ITEMS)
      : [];

    sectionMeta[key] = {
      status,
      updatedAt: existing?.updatedAt ?? now,
      history,
    };
    favorites[key] = status === "Approved";
  });

  return {
    ...project,
    sections,
    favorites,
    sectionMeta,
  };
}

export function getSectionStatus(project: ProjectKit, sectionKey: string): SectionStatus {
  return normalizeProjectWorkspace(project).sectionMeta?.[sectionKey]?.status ?? "Draft";
}

export function updateSectionStatus(
  project: ProjectKit,
  sectionKey: string,
  status: SectionStatus,
): ProjectKit {
  const normalized = normalizeProjectWorkspace(project);
  const now = new Date().toISOString();
  return {
    ...normalized,
    favorites: { ...normalized.favorites, [sectionKey]: status === "Approved" },
    sectionMeta: {
      ...normalized.sectionMeta,
      [sectionKey]: {
        ...(normalized.sectionMeta?.[sectionKey] ?? { history: [] }),
        status,
        updatedAt: now,
      },
    },
    updatedAt: now,
  };
}

export function updateSectionContent(
  project: ProjectKit,
  sectionKey: string,
  content: string,
  note: string,
  status: SectionStatus = "Draft",
): ProjectKit {
  const normalized = normalizeProjectWorkspace(project);
  const now = new Date().toISOString();
  const previousContent = normalized.sections[sectionKey] ?? "";
  const previousMeta = normalized.sectionMeta?.[sectionKey] ?? {
    status: "Draft" as SectionStatus,
    updatedAt: now,
    history: [],
  };
  const history =
    previousContent.trim() === content.trim()
      ? previousMeta.history
      : [
          {
            id: uid("version"),
            content: previousContent,
            status: previousMeta.status,
            createdAt: now,
            note,
          },
          ...previousMeta.history,
        ].slice(0, MAX_HISTORY_ITEMS);

  return {
    ...normalized,
    sections: { ...normalized.sections, [sectionKey]: content },
    favorites: { ...normalized.favorites, [sectionKey]: status === "Approved" },
    sectionMeta: {
      ...normalized.sectionMeta,
      [sectionKey]: {
        status,
        updatedAt: now,
        history,
      },
    },
    updatedAt: now,
  };
}

export function createInitialSectionMeta(sections: Record<string, string>) {
  const now = new Date().toISOString();
  return Object.fromEntries(
    SECTION_ORDER.map(([key]) => [
      key,
      {
        status: "Draft",
        updatedAt: now,
        history: sections[key] ? [] : [],
      } satisfies SectionWorkspaceState,
    ]),
  );
}

function isSectionVersion(version: unknown): version is SectionVersion {
  if (!version || typeof version !== "object") return false;
  const candidate = version as Partial<SectionVersion>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.note === "string" &&
    isSectionStatus(candidate.status)
  );
}

function defaultSectionContent(project: ProjectKit, key: string, title: string) {
  if (key === "next-actions") {
    const actions = project.readinessScore?.nextActions?.length
      ? project.readinessScore.nextActions
      : ["Pick the smallest buildable workflow", "Export the kit", "Open TASKS.md in a coding agent"];

    return `## Immediate Priorities\n${actions.map((action, index) => `${index + 1}. ${action}`).join("\n")}\n\n## Workspace Review\n- Approve sections that are ready for implementation\n- Mark unclear sections as needs review\n- Regenerate only the section that needs sharper guidance`;
  }

  return `## ${sectionTitle(key) || title}\nTo be generated.`;
}
