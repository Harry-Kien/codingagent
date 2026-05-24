import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getRequestUser } from "@/lib/server-auth";
import { encryptProviderApiKey } from "@/lib/provider-vault";
import { createProviderProfileSchema } from "@/lib/vault-validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { userFacingError } from "@/lib/user-facing-errors";

/**
 * GET  /api/provider-profiles  — List vault profiles for the authenticated user.
 * POST /api/provider-profiles  — Create a new vault profile.
 *
 * GET never returns apiKey, ciphertext, iv, or tag.
 */

const SAFE_COLUMNS = [
  "id",
  "provider_name",
  "provider_type",
  "base_url",
  "default_model",
  "cheap_model",
  "strong_model",
  "vision_model",
  "max_budget",
  "temperature",
  "token_limit",
  "enabled",
  "api_key_hint",
  "last_tested_at",
  "last_test_status",
  "created_at",
  "updated_at",
].join(",");

export async function GET(request: Request) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: userFacingError("supabase_not_configured") }, { status: 503 });
  }

  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: userFacingError("unauthorized") }, { status: 401 });
  }

  const { data, error } = await client
    .from("provider_profiles")
    .select(SAFE_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[API] provider-profiles GET:", error.message);
    return NextResponse.json({ error: userFacingError("generation_failed", { message: "Could not load provider profiles." }) }, { status: 500 });
  }

  // Map snake_case → camelCase for client
  type Row = Record<string, unknown>;
  const profiles = ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id as string,
    providerName: row.provider_name as string,
    providerType: row.provider_type as string,
    baseUrl: row.base_url as string,
    defaultModel: row.default_model as string,
    cheapModel: row.cheap_model as string,
    strongModel: row.strong_model as string,
    visionModel: row.vision_model as string,
    maxBudgetPerGeneration: Number(row.max_budget),
    temperature: Number(row.temperature),
    tokenLimit: Number(row.token_limit),
    enabled: row.enabled as boolean,
    apiKeyHint: (row.api_key_hint as string) ?? null,
    lastTestedAt: (row.last_tested_at as string) ?? null,
    lastTestStatus: (row.last_test_status as string) ?? null,
  }));

  return NextResponse.json({ profiles });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: userFacingError("rate_limited") },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: userFacingError("supabase_not_configured") }, { status: 503 });
  }

  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: userFacingError("unauthorized") }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProviderProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: userFacingError("invalid_request", { message: parsed.error.issues[0]?.message ?? "Invalid provider profile." }) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  let encrypted: { ciphertext: string; iv: string; tag: string; hint: string } | null = null;
  if (input.apiKey) {
    try {
      encrypted = encryptProviderApiKey(input.apiKey);
    } catch (err) {
      console.error("[API] provider-profiles POST: encryption failed", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: userFacingError("generation_failed", { message: "Could not encrypt provider key. Check server configuration." }) },
        { status: 500 },
      );
    }
  }

  const { data, error } = await client
    .from("provider_profiles")
    .insert({
      user_id: user.id,
      provider_name: input.providerName,
      provider_type: input.providerType,
      base_url: input.baseUrl,
      default_model: input.defaultModel,
      cheap_model: input.cheapModel,
      strong_model: input.strongModel,
      vision_model: input.visionModel,
      max_budget: input.maxBudgetPerGeneration,
      temperature: input.temperature,
      token_limit: input.tokenLimit,
      enabled: input.enabled,
      api_key_ciphertext: encrypted?.ciphertext ?? null,
      api_key_iv: encrypted?.iv ?? null,
      api_key_tag: encrypted?.tag ?? null,
      api_key_hint: encrypted?.hint ?? (input.providerType === "ollama" ? "not required" : null),
    })
    .select("id")
    .single();

  if (error) {
    console.warn("[API] provider-profiles POST:", error.message);
    return NextResponse.json(
      { error: userFacingError("generation_failed", { message: "Could not save provider profile." }) },
      { status: 500 },
    );
  }

  console.info(`[API] provider-profiles: created ${data.id} for user ${user.id}`);
  return NextResponse.json({ id: data.id }, { status: 201 });
}
