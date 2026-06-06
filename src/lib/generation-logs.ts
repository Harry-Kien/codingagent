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
      error: input.error,
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
    error_message: input.error ?? null,
    started_at: input.startedAt,
    finished_at: finishedAt,
    duration_ms: Math.max(0, new Date(finishedAt).getTime() - new Date(input.startedAt).getTime()),
  });

  if (error) {
    console.warn("[VibeForge] generation log failed:", error.message);
  }
}
