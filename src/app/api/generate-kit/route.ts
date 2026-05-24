import { NextResponse } from "next/server";
import { generateProjectKitServer } from "@/lib/server-generator";
import { generateKitRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { writeGenerationLog } from "@/lib/generation-logs";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "generate-kit",
      status: "rate_limited",
      source: "none",
      startedAt,
      error: "Too many requests.",
    });
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = generateKitRequestSchema.safeParse(body);

  if (!parsed.success) {
    console.warn("[API] generate-kit: invalid request body");
    return NextResponse.json({ error: "Invalid generation request." }, { status: 400 });
  }

  try {
    const user = await getRequestUser(request);
    const resolved = await resolveProviderForRequest({
      inlineProvider: parsed.data.provider,
      providerProfileId: parsed.data.providerProfileId,
      userId: user?.id,
    });
    if ("error" in resolved) {
      await writeGenerationLog({
        userId: user?.id,
        route: "generate-kit",
        providerProfileId: parsed.data.providerProfileId,
        status: "error",
        source: "vault",
        mode: parsed.data.generationMode,
        startedAt,
        error: resolved.error,
      });
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }

    console.info(`[API] generate-kit: starting (appType=${parsed.data.input.appType})`);
    const project = await generateProjectKitServer(
      parsed.data.input,
      resolved.provider,
      parsed.data.generationMode,
    );
    const fellBack = Boolean(resolved.provider && project.generation?.source === "demo");
    await writeGenerationLog({
      userId: user?.id,
      projectId: project.id,
      route: "generate-kit",
      providerProfileId: parsed.data.providerProfileId,
      providerName: resolved.provider?.providerName,
      model: project.generation?.model,
      mode: parsed.data.generationMode,
      status: fellBack ? "fallback" : "success",
      source: resolved.source,
      startedAt,
      error: project.generation?.fallbackReason,
    });
    console.info(`[API] generate-kit: success (id=${project.id})`);
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    await writeGenerationLog({
      route: "generate-kit",
      status: "error",
      source: "none",
      mode: parsed.data.generationMode,
      startedAt,
      error: message,
    });
    console.error("[API] generate-kit: failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
