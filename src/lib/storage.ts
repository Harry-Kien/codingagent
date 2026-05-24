"use client";

import type { McpConnection, ProjectKit, ProviderSettings } from "@/types/vibeforge";

const PROJECTS_KEY = "vibeforge.projects";
const PROVIDERS_KEY = "vibeforge.providers";
const MCP_KEY = "vibeforge.mcpConnections";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getProjects() {
  return readJson<ProjectKit[]>(PROJECTS_KEY, []);
}

export function getProject(id: string) {
  return getProjects().find((project) => project.id === id) ?? null;
}

export function saveProject(project: ProjectKit) {
  const projects = getProjects();
  const next = [project, ...projects.filter((item) => item.id !== project.id)];
  writeJson(PROJECTS_KEY, next);
}

export function deleteProject(id: string) {
  writeJson(
    PROJECTS_KEY,
    getProjects().filter((project) => project.id !== id),
  );
}

export function duplicateProject(id: string) {
  const project = getProject(id);
  if (!project) return null;
  const now = new Date().toISOString();
  const copy: ProjectKit = {
    ...project,
    id: `kit_${crypto.randomUUID()}`,
    name: `${project.name} copy`,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
  saveProject(copy);
  return copy;
}

export function getProviders() {
  return readJson<ProviderSettings[]>(PROVIDERS_KEY, []);
}

export function saveProviders(providers: ProviderSettings[]) {
  writeJson(PROVIDERS_KEY, providers);
}

export function getActiveProvider() {
  return getProviders().find(
    (provider) => provider.enabled && (provider.apiKey || provider.providerType === "ollama"),
  );
}

export function getMcpConnections() {
  return readJson<McpConnection[]>(MCP_KEY, []);
}

export function saveMcpConnections(connections: McpConnection[]) {
  writeJson(MCP_KEY, connections);
}
