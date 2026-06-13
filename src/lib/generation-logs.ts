import "server-only";

import type { GenerationMode } from "@/types/vibeforge";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export type GenerationLogInput = {
  userId?: string | null;
  projectId?: string | null;
  route: "generate-kit" | "regenerate-section" | "improve-section" | "test-provider";
  providerProfileId?: string | null;
  providerName?: string | null;
  model?: string | null;
  mode?: GenerationMode | null;
  status: "success" | "fallback" | "error" | "rate_limited";
  source: "demo" | "inline" | "vault" | "env" | "none";
  error?: string | null;
  startedAt: string;
  finishedAt?: string;
};

export async function writeGenerationLog(input: GenerationLogInput) {
  const finishedAt = input.finishedAt ?? new Date().toISOString();
  const client = getSupabaseAdminClient();

  if (!client) {
    console.info("[VibeForge] generation log", {
      route: input.route,
      status: input.status,
      source: input.source,
      providerName: input.providerName,
      model: input.model,
      mode: input.mode,
      error: sanitizeGenerationLogValue(input.error),
    });
    return;
  }

  const { error } = await client.from("generation_logs").insert({
    user_id: input.userId ?? null,
    project_id: input.projectId ?? null,
    route: input.route,
    provider_profile_id: input.providerProfileId ?? null,
    provider_name: input.providerName ?? null,
    model: input.model ?? null,
    generation_mode: input.mode ?? null,
    status: input.status,
    source: input.source,
    error_message: sanitizeGenerationLogValue(input.error),
    started_at: input.startedAt,
    finished_at: finishedAt,
    duration_ms: Math.max(0, new Date(finishedAt).getTime() - new Date(input.startedAt).getTime()),
  });

  if (error) {
    console.warn("[VibeForge] generation log failed:", error.message);
  }
}

function sanitizeGenerationLogValue(value?: string | null) {
  if (!value) return null;
  return value
    .replace(/\b(sk-[a-z0-9_-]{8,}|sk-or-v1-[a-z0-9_-]{8,}|AIza[a-z0-9_-]{12,})\b/gi, "[redacted-secret]")
    .replace(/\b(Bearer\s+)[a-z0-9._-]{12,}\b/gi, "$1[redacted-secret]")
    .replace(/\b(api[_-]?key|authorization|password|secret|token)\s*[:=]\s*['\"]?[^'\"\s,;]+/gi, "$1=[redacted-secret]");
}
