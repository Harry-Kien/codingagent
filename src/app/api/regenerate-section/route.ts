import { NextResponse } from "next/server";
import { regenerateSectionServer } from "@/lib/server-generator";
import { regenerateSectionRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { writeGenerationLog } from "@/lib/generation-logs";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "regenerate-section",
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
  const parsed = regenerateSectionRequestSchema.safeParse(body);

  if (!parsed.success) {
    console.warn("[API] regenerate-section: invalid request body");
    return NextResponse.json({ error: "Invalid section regeneration request." }, { status: 400 });
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
        projectId: parsed.data.project.id,
        route: "regenerate-section",
        providerProfileId: parsed.data.providerProfileId,
        status: "error",
        source: "vault",
        mode: parsed.data.generationMode,
        startedAt,
        error: resolved.error,
      });
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }

    console.info(`[API] regenerate-section: starting (section=${parsed.data.sectionKey})`);
    const project = await regenerateSectionServer(
      parsed.data.project,
      parsed.data.sectionKey,
      resolved.provider,
      parsed.data.generationMode,
    );
    await writeGenerationLog({
      userId: user?.id,
      projectId: project.id,
      route: "regenerate-section",
      providerProfileId: parsed.data.providerProfileId,
      providerName: resolved.provider?.providerName,
      model: project.generation?.model,
      mode: parsed.data.generationMode,
      status: "success",
      source: resolved.source,
      startedAt,
    });
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Section regeneration failed.";
    await writeGenerationLog({
      projectId: parsed.data.project.id,
      route: "regenerate-section",
      status: "error",
      source: "none",
      mode: parsed.data.generationMode,
      startedAt,
      error: message,
    });
    console.error("[API] regenerate-section: failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
