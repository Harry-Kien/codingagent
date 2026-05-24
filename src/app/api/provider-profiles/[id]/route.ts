import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getRequestUser } from "@/lib/server-auth";
import { encryptProviderApiKey } from "@/lib/provider-vault";
import { updateProviderProfileSchema } from "@/lib/vault-validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { userFacingError } from "@/lib/user-facing-errors";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * PATCH  /api/provider-profiles/[id] — Update a vault profile (partial).
 * DELETE /api/provider-profiles/[id] — Delete a vault profile.
 */

export async function PATCH(request: Request, props: RouteParams) {
  const { id } = await props.params;
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
  const parsed = updateProviderProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: userFacingError("invalid_request", { message: parsed.error.issues[0]?.message ?? "Invalid update." }) },
      { status: 400 },
    );
  }

  const input = parsed.data;

  // Build update payload — only include fields that were provided
  const update: Record<string, unknown> = {};
  if (input.providerName !== undefined) update.provider_name = input.providerName;
  if (input.providerType !== undefined) update.provider_type = input.providerType;
  if (input.baseUrl !== undefined) update.base_url = input.baseUrl;
  if (input.defaultModel !== undefined) update.default_model = input.defaultModel;
  if (input.cheapModel !== undefined) update.cheap_model = input.cheapModel;
  if (input.strongModel !== undefined) update.strong_model = input.strongModel;
  if (input.visionModel !== undefined) update.vision_model = input.visionModel;
  if (input.maxBudgetPerGeneration !== undefined) update.max_budget = input.maxBudgetPerGeneration;
  if (input.temperature !== undefined) update.temperature = input.temperature;
  if (input.tokenLimit !== undefined) update.token_limit = input.tokenLimit;
  if (input.enabled !== undefined) update.enabled = input.enabled;

  // Re-encrypt API key if provided
  if (input.apiKey) {
    try {
      const encrypted = encryptProviderApiKey(input.apiKey);
      update.api_key_ciphertext = encrypted.ciphertext;
      update.api_key_iv = encrypted.iv;
      update.api_key_tag = encrypted.tag;
      update.api_key_hint = encrypted.hint;
    } catch (err) {
      console.error("[API] provider-profiles PATCH: encryption failed", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: userFacingError("generation_failed", { message: "Could not encrypt provider key." }) },
        { status: 500 },
      );
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true });
  }

  update.updated_at = new Date().toISOString();

  const { error } = await client
    .from("provider_profiles")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.warn("[API] provider-profiles PATCH:", error.message);
    return NextResponse.json(
      { error: userFacingError("generation_failed", { message: "Could not update provider profile." }) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, props: RouteParams) {
  const { id } = await props.params;
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: userFacingError("supabase_not_configured") }, { status: 503 });
  }

  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: userFacingError("unauthorized") }, { status: 401 });
  }

  const { error } = await client
    .from("provider_profiles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.warn("[API] provider-profiles DELETE:", error.message);
    return NextResponse.json(
      { error: userFacingError("generation_failed", { message: "Could not delete provider profile." }) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
