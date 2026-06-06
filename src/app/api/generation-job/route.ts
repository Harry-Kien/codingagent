import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateKitRequestSchema } from "@/lib/validation";
import { resolveProviderForRequest } from "@/lib/provider-vault";
import { generateProjectKitServer } from "@/lib/server-generator";
import { getRequestUser } from "@/lib/server-auth";
import type { ProjectKit } from "@/types/vibeforge";

/**
 * PRODUCTION READINESS SCAFFOLD: Async Generation Job Queue
 *
 * For extremely long LLM generations (like deep planning mode), synchronous HTTP requests
 * can timeout in cloud environments (e.g. Vercel 10s-60s serverless limits).
 * This endpoint now returns a completed project in the POST response when the work
 * finishes inside the serverless time budget. That avoids losing in-memory jobs
 * across Vercel instances. The GET polling shape remains available as a local/demo
 * compatibility surface, but durable production polling requires Redis or Postgres.
 *
 * How to adopt for production:
 * 1. Replace the in-memory `jobs` store with Redis (e.g. Upstash) or a PostgreSQL queue (e.g. PG Boss).
 * 2. Delegate the actual `generateProjectKitServer` call to a background worker (e.g. Inngest, Trigger.dev, or BullMQ).
 * 3. Update the frontend client to poll the GET endpoint using status triggers.
 */

type JobStatus = "queued" | "processing" | "completed" | "failed";
type JobEntry = {
  id: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  error?: string | null;
  project?: ProjectKit | null;
};

// In-Memory mock store for jobs (scaffold only)
const jobs = new Map<string, JobEntry>();

export const maxDuration = 60;

/**
 * POST /api/generation-job
 * Creates a background generation job. Returns immediately with a job ID.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = generateKitRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const jobId = `job_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const newJob: JobEntry = {
    id: jobId,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };

  jobs.set(jobId, newJob);

  // Resolve provider
  const user = await getRequestUser(request);
  const resolved = await resolveProviderForRequest({
    inlineProvider: parsed.data.provider,
    providerProfileId: parsed.data.providerProfileId,
    userId: user?.id,
  });

  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  jobs.set(jobId, { ...newJob, status: "processing", updatedAt: new Date().toISOString() });

  try {
    const project = await generateProjectKitServer(
      parsed.data.input,
      resolved.provider,
      parsed.data.generationMode,
    );
    const completed: JobEntry = {
      id: jobId,
      status: "completed",
      createdAt: now,
      updatedAt: new Date().toISOString(),
      project,
    };
    jobs.set(jobId, completed);

    return NextResponse.json({
      jobId,
      status: "completed",
      pollUrl: `/api/generation-job?jobId=${jobId}`,
      project,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Async generation failed.";
    const failed: JobEntry = {
      id: jobId,
      status: "failed",
      createdAt: now,
      updatedAt: new Date().toISOString(),
      error: message,
    };
    jobs.set(jobId, failed);

    return NextResponse.json({
      jobId,
      status: "failed",
      pollUrl: `/api/generation-job?jobId=${jobId}`,
      error: message,
    }, { status: 500 });
  }
}

/**
 * GET /api/generation-job?jobId=...
 * Polls the status and results of a background generation job.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId parameter." }, { status: 400 });
  }

  const job = jobs.get(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error,
    project: job.project,
  });
}
