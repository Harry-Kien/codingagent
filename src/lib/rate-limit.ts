/**
 * Rate Limiter abstraction for multi-instance production readiness.
 * Supports standard In-Memory tracking and optional Upstash/Redis HTTP REST rate limiting.
 *
 * NOTE FOR MULTI-INSTANCE PRODUCTION:
 * The default in-memory rate limiter is not synchronized across multiple application instances.
 * For load-balanced production clusters, configure VIBEFORGE_REDIS_REST_URL and VIBEFORGE_REDIS_REST_TOKEN.
 */

export interface RateLimiter {
  check(key: string, max: number, windowMs: number): Promise<{ allowed: boolean; retryAfterMs: number }>;
}

// In-Memory Rate Limiter Implementation (Safe for single-instance, serverless fallback)
class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  private ensureCleanup(windowMs: number) {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store) {
        if (entry.resetAt <= now) this.store.delete(key);
      }
      if (this.store.size === 0 && this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
    }, windowMs);
  }

  async check(key: string, max: number, windowMs: number): Promise<{ allowed: boolean; retryAfterMs: number }> {
    const now = Date.now();
    this.ensureCleanup(windowMs);

    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }

    if (entry.count >= max) {
      return { allowed: false, retryAfterMs: entry.resetAt - now };
    }

    entry.count++;
    return { allowed: true, retryAfterMs: 0 };
  }
}

// Optional Zero-Dependency Redis HTTP REST Limiter (Upstash compatible)
class UpstashRedisRateLimiter implements RateLimiter {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url.replace(/\/$/, "");
    this.token = token;
  }

  async check(key: string, max: number, windowMs: number): Promise<{ allowed: boolean; retryAfterMs: number }> {
    const redisKey = `vibeforge:ratelimit:${key}`;
    try {
      // 1. Increment key
      const incrRes = await fetch(`${this.url}/incr/${redisKey}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}` },
        signal: AbortSignal.timeout(4000), // 4s timeout boundary
      });
      if (!incrRes.ok) throw new Error("Redis INCR REST call failed");
      const { result: count } = await incrRes.json();

      // 2. If first request, set TTL expiration
      if (count === 1) {
        await fetch(`${this.url}/pexpire/${redisKey}/${windowMs}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${this.token}` },
        });
      }

      // 3. Fetch TTL for accurate Retry-After header
      const ttlRes = await fetch(`${this.url}/pttl/${redisKey}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      let ttl = windowMs;
      if (ttlRes.ok) {
        const { result } = await ttlRes.json();
        if (result > 0) ttl = result;
      }

      if (count > max) {
        return { allowed: false, retryAfterMs: ttl };
      }

      return { allowed: true, retryAfterMs: 0 };
    } catch (err) {
      console.warn("[RateLimit] Upstash Redis call failed. Falling back to In-Memory:", err);
      return fallbackLimiter.check(key, max, windowMs);
    }
  }
}

const fallbackLimiter = new InMemoryRateLimiter();

function getActiveRateLimiter(): RateLimiter {
  const url = process.env.VIBEFORGE_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.VIBEFORGE_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new UpstashRedisRateLimiter(url, token);
  }

  return fallbackLimiter;
}

const limiter = getActiveRateLimiter();

/**
 * Check whether a request from the given IP should be allowed.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export async function checkRateLimit(
  ip: string | null,
  opts?: { maxRequests?: number; windowMs?: number },
): Promise<{ allowed: true } | { allowed: false; retryAfterMs: number }> {
  const max = opts?.maxRequests ?? 30;
  const window = opts?.windowMs ?? 60_000;
  const key = ip ?? "unknown";

  const result = await limiter.check(key, max, window);
  if (result.allowed) {
    return { allowed: true };
  }
  return { allowed: false, retryAfterMs: result.retryAfterMs };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? null;
}
