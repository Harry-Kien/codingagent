/**
 * Simple in-memory rate limiter for API routes.
 *
 * Uses a sliding window per IP. Safe for single-instance serverless/local usage.
 * For multi-instance production, replace with Redis or similar.
 */

const windowMs = 60_000; // 1 minute
const maxRequests = 30; // per window per IP

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Periodic cleanup to prevent memory leaks
let cleanupTimer: ReturnType<typeof setInterval> | null = null;
function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, windowMs);
}

/**
 * Check whether a request from the given IP should be allowed.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(
  ip: string | null,
  opts?: { maxRequests?: number; windowMs?: number },
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const max = opts?.maxRequests ?? maxRequests;
  const window = opts?.windowMs ?? windowMs;
  const key = ip ?? "unknown";
  const now = Date.now();

  ensureCleanup();

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + window });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? null;
}
