import { NextResponse } from "next/server";
import { testProviderConnection } from "@/lib/server-generator";
import { testProviderRequestSchema } from "@/lib/validation";
import { writeGenerationLog } from "@/lib/generation-logs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "test-provider",
      status: "rate_limited",
      source: "none",
      startedAt,
      error: "Too many requests.",
    });
    return NextResponse.json(
      { ok: false, message: "Too many provider tests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = testProviderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid provider settings." },
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
    return NextResponse.json({ ok: false, message: resolved.error }, { status: 400 });
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
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
