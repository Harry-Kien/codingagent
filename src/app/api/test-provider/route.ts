import { NextResponse } from "next/server";
import { testProviderConnection } from "@/lib/server-generator";
import { testProviderRequestSchema } from "@/lib/validation";
import { writeGenerationLog } from "@/lib/generation-logs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";
import { classifyUserFacingError, userFacingError } from "@/lib/user-facing-errors";

export const maxDuration = 60;

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = await checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "test-provider",
      status: "rate_limited",
      source: "none",
      startedAt,
      error: "Too many requests.",
    });
    const error = userFacingError("rate_limited");
    return NextResponse.json(
      { ok: false, message: error.message, error },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  // Support empty body by falling back to {} to test server-side environment provider
  let body = null;
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text);
    }
  } catch {
    body = {};
  }
  const parsed = testProviderRequestSchema.safeParse(body || {});

  if (!parsed.success) {
    const error = userFacingError("invalid_request");
    return NextResponse.json(
      { ok: false, message: error.message, error },
      { status: 400 },
    );
  }

  const user = await getRequestUser(request);
  const resolved = await resolveProviderForRequest({
    inlineProvider: parsed.data.provider,
    providerProfileId: parsed.data.providerProfileId,
    userId: user?.id,
  });

  if ("error" in resolved) {
    await writeGenerationLog({
      userId: user?.id,
      route: "test-provider",
      providerProfileId: parsed.data.providerProfileId,
      status: "error",
      source: "vault",
      startedAt,
      error: resolved.error,
    });
    const error = classifyUserFacingError(resolved.error);
    return NextResponse.json({ ok: false, message: error.message, error }, { status: 400 });
  }

  const result = await testProviderConnection(resolved.provider);
  await writeGenerationLog({
    userId: user?.id,
    route: "test-provider",
    providerProfileId: parsed.data.providerProfileId,
    providerName: resolved.provider?.providerName,
    model: result.model,
    status: result.ok ? "success" : "error",
    source: resolved.source,
    startedAt,
    error: result.ok ? null : result.message,
  });
  if (!result.ok) {
    const error = classifyUserFacingError(result.message);
    return NextResponse.json({ ...result, ok: false, message: error.message, error }, { status: 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
