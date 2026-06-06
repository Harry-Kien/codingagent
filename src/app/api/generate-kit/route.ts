import { NextResponse } from "next/server";
import { generateProjectKitServer } from "@/lib/server-generator";
import { generateKitRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { writeGenerationLog } from "@/lib/generation-logs";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";
import { classifyUserFacingError, userFacingError } from "@/lib/user-facing-errors";
import { logInfo, reportError } from "@/lib/monitoring";

export const maxDuration = 60;

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = await checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "generate-kit",
      status: "rate_limited",
      source: "none",
      startedAt,
      error: "Too many requests.",
    });
    return NextResponse.json(
      { error: userFacingError("rate_limited") },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = generateKitRequestSchema.safeParse(body);

  if (!parsed.success) {
    logInfo("generate-kit invalid request body", { route: "/api/generate-kit", ip: ip ?? "unknown" });
    return NextResponse.json({ error: userFacingError("invalid_request") }, { status: 400 });
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
      return NextResponse.json({ error: classifyUserFacingError(resolved.error) }, { status: 400 });
    }

    logInfo("generate-kit started", { route: "/api/generate-kit", appType: parsed.data.input.appType });
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
    logInfo("generate-kit completed", { route: "/api/generate-kit", projectId: project.id, source: project.generation?.source ?? "unknown" });
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
    await reportError(err, { route: "/api/generate-kit", mode: parsed.data.generationMode });
    return NextResponse.json({ error: classifyUserFacingError(message) }, { status: 500 });
  }
}
