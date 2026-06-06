import { NextResponse } from "next/server";
import { improveSectionServer } from "@/lib/server-generator";
import { improveSectionRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { writeGenerationLog } from "@/lib/generation-logs";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { getRequestUser } from "@/lib/server-auth";
import { classifyUserFacingError, userFacingError } from "@/lib/user-facing-errors";

export const maxDuration = 60;

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  const ip = getClientIp(request);
  const rl = await checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    void writeGenerationLog({
      route: "improve-section",
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
  const parsed = improveSectionRequestSchema.safeParse(body);

  if (!parsed.success) {
    console.warn("[API] improve-section: invalid request body");
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
        projectId: parsed.data.project.id,
        route: "improve-section",
        providerProfileId: parsed.data.providerProfileId,
        status: "error",
        source: "vault",
        mode: parsed.data.generationMode,
        startedAt,
        error: resolved.error,
      });
      return NextResponse.json({ error: classifyUserFacingError(resolved.error) }, { status: 400 });
    }

    console.info(`[API] improve-section: starting (section=${parsed.data.sectionKey})`);
    const project = await improveSectionServer(
      parsed.data.project,
      parsed.data.sectionKey,
      parsed.data.instruction,
      resolved.provider,
      parsed.data.generationMode,
    );
    await writeGenerationLog({
      userId: user?.id,
      projectId: project.id,
      route: "improve-section",
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
    const message = err instanceof Error ? err.message : "Section improvement failed.";
    await writeGenerationLog({
      projectId: parsed.data.project.id,
      route: "improve-section",
      status: "error",
      source: "none",
      mode: parsed.data.generationMode,
      startedAt,
      error: message,
    });
    console.error("[API] improve-section: failed", message);
    return NextResponse.json({ error: classifyUserFacingError(message) }, { status: 500 });
  }
}
