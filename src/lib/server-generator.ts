import type { ProjectInput, ProjectKit, ProviderSettings } from "@/types/vibeforge";
import { SECTION_ORDER, sectionTitle } from "@/lib/kit-sections";
import {
  buildProjectKit,
  generateMockKit,
  inferName,
  normalizeSections,
  regenerateSection,
} from "@/lib/generator";

const SYSTEM_PROMPT = `You are a senior product architect, software architect, AI workflow engineer, and vibe coding coach.

Convert rough app ideas into concrete, structured, implementation-ready project kits.
Always include MVP scope, what not to build yet, recommended stack, repo/tool map, task plan, coding agent rules, test plan, deployment plan, security checklist, Codex/Cline prompts, and a cost-aware AI provider plan.
Favor simple, shippable systems. Explain whether each repo should be installed, cloned, used externally, imported as workflow, or used only as reference.`;

const SECTION_KEYS = SECTION_ORDER.map(([key]) => key);
const PROVIDER_TIMEOUT_MS = 15_000;

type ProviderJson = {
  name?: unknown;
  sections?: unknown;
  section?: unknown;
};

export async function generateProjectKitServer(input: ProjectInput, provider?: ProviderSettings | null) {
  if (isProviderUsable(provider)) {
    const generated = await generateWithProvider(input, provider);
    if (generated) return generated;
  }

  return generateMockKit(input);
}

export async function regenerateSectionServer(
  project: ProjectKit,
  sectionKey: string,
  provider?: ProviderSettings | null,
) {
  if (!isSectionKey(sectionKey)) return project;

  if (isProviderUsable(provider)) {
    const content = await generateSectionWithProvider(project, sectionKey, provider);
    if (content) {
      return withSection(project, sectionKey, content);
    }
  }

  return regenerateSection(project, sectionKey);
}

export async function improveSectionServer(
  project: ProjectKit,
  sectionKey: string,
  instruction: string,
  provider?: ProviderSettings | null,
) {
  if (!isSectionKey(sectionKey)) return project;

  if (isProviderUsable(provider)) {
    const content = await generateSectionWithProvider(project, sectionKey, provider, instruction);
    if (content) {
      return withSection(project, sectionKey, content);
    }
  }

  return withSection(
    project,
    sectionKey,
    `${project.sections[sectionKey] ?? ""}\n\n## Improvement Note\n${instruction || "Review this section for clarity, scope, and implementation readiness."}`,
  );
}

function isProviderUsable(provider?: ProviderSettings | null): provider is ProviderSettings {
  if (!provider?.enabled || !provider.baseUrl.trim()) return false;
  if (provider.providerType === "ollama") return true;
  if (!provider.apiKey.trim()) return false;
  return ["openai-compatible", "openrouter", "gemini", "anthropic-compatible", "custom"].includes(
    provider.providerType,
  );
}

function isSectionKey(sectionKey: string) {
  return SECTION_KEYS.some((key) => key === sectionKey);
}

async function generateWithProvider(input: ProjectInput, provider: ProviderSettings) {
  const content = await requestChatCompletion(provider, [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Return only valid JSON with this shape: {"name":"Project name","sections":{"section-key":"Markdown content"}}.
Use exactly these section keys and no alternatives: ${SECTION_KEYS.join(", ")}.
Every section value must be useful Markdown, not placeholders.

Project input:
${JSON.stringify(input, null, 2)}`,
    },
  ]);

  const parsed = parseProviderJson(content);
  if (!parsed) return null;

  const sections = sectionsFromUnknown(parsed.sections);
  return buildProjectKit(input, sections, typeof parsed.name === "string" ? parsed.name : inferName(input.idea));
}

async function generateSectionWithProvider(
  project: ProjectKit,
  sectionKey: string,
  provider: ProviderSettings,
  instruction?: string,
) {
  const content = await requestChatCompletion(provider, [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Return only valid JSON with this shape: {"section":"Markdown content"}.
Regenerate only the "${sectionTitle(sectionKey)}" section for this project kit.
Keep it concrete, implementation-ready, and consistent with the other sections.
${instruction ? `Extra instruction: ${instruction}` : ""}

Project:
${JSON.stringify(
  {
    name: project.name,
    input: project.input,
    currentSection: project.sections[sectionKey],
    sectionKey,
  },
  null,
  2,
)}`,
    },
  ]);

  const parsed = parseProviderJson(content);
  if (!parsed) return null;
  if (typeof parsed.section === "string" && parsed.section.trim()) return parsed.section;

  const sections = sectionsFromUnknown(parsed.sections);
  return sections[sectionKey] || null;
}

async function requestChatCompletion(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
) {
  const model = provider.defaultModel || provider.strongModel || provider.cheapModel;

  try {
    if (provider.providerType === "ollama") {
      return await requestOllama(provider, messages, model);
    }

    if (provider.providerType === "gemini") {
      return await requestGemini(provider, messages, model);
    }

    if (provider.providerType === "anthropic-compatible") {
      return await requestAnthropic(provider, messages, model);
    }

    return await requestOpenAiCompatible(provider, messages, model);
  } catch {
    return null;
  }
}

async function requestOpenAiCompatible(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const endpoint = providerUrl(provider, "/chat/completions");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: provider.temperature,
      max_tokens: provider.tokenLimit,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : null;
}

async function requestOllama(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const endpoint = providerUrl(provider, "/api/chat");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      format: "json",
      options: {
        temperature: provider.temperature,
        num_predict: provider.tokenLimit,
      },
      messages,
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const content = json?.message?.content;
  return typeof content === "string" ? content : null;
}

async function requestGemini(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const system = messages.find((message) => message.role === "system")?.content ?? "";
  const user = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n\n");
  const endpoint = providerUrl(provider, `/models/${encodeURIComponent(model)}:generateContent`);
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: { "Content-Type": "application/json", "x-goog-api-key": provider.apiKey },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: provider.temperature,
        maxOutputTokens: provider.tokenLimit,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const content = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof content === "string" ? content : null;
}

async function requestAnthropic(
  provider: ProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  model: string,
) {
  const system = messages.find((message) => message.role === "system")?.content ?? undefined;
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => ({ role: "user", content: message.content }));

  const endpoint = providerUrl(provider, "/messages");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": provider.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system,
      max_tokens: provider.tokenLimit,
      temperature: provider.temperature,
      messages: userMessages,
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const content = json?.content?.[0]?.text;
  return typeof content === "string" ? content : null;
}

function parseProviderJson(content: string | null): ProviderJson | null {
  if (!content) return null;

  const candidates = [
    content.trim(),
    stripJsonFence(content),
    extractJsonObject(content),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed as ProviderJson;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function stripJsonFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function providerUrl(provider: ProviderSettings, routePath: string) {
  try {
    const base = new URL(provider.baseUrl.trim());
    if (!["https:", "http:"].includes(base.protocol)) return null;
    if (base.username || base.password) return null;
    if (base.protocol === "http:" && !isLocalHostname(base.hostname)) return null;

    base.username = "";
    base.password = "";
    base.search = "";
    base.hash = "";
    base.pathname = `${base.pathname.replace(/\/+$/, "")}/${routePath.replace(/^\/+/, "")}`;
    return base.toString();
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string) {
  const clean = hostname.toLowerCase();
  return clean === "localhost" || clean === "127.0.0.1" || clean === "::1";
}

function extractJsonObject(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end <= start) return "";
  return content.slice(start, end + 1);
}

function sectionsFromUnknown(value: unknown) {
  if (!value || typeof value !== "object") return {};

  const record = value as Record<string, unknown>;
  const sections: Record<string, string> = {};
  for (const key of SECTION_KEYS) {
    const section = record[key];
    if (typeof section === "string" && section.trim()) {
      sections[key] = section;
    }
  }

  return normalizeSections(sections);
}

function withSection(project: ProjectKit, sectionKey: string, content: string): ProjectKit {
  return {
    ...project,
    sections: normalizeSections({ ...project.sections, [sectionKey]: content }),
    updatedAt: new Date().toISOString(),
  };
}
