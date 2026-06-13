import "server-only";

type MonitorContext = Record<string, string | number | boolean | null | undefined>;

export function logInfo(message: string, context: MonitorContext = {}) {
  console.info(JSON.stringify(sanitizeLogPayload({ level: "info", message, ...context })));
}

export async function reportError(error: unknown, context: MonitorContext = {}) {
  const payload = sanitizeLogPayload({
    level: "error",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });

  console.error(JSON.stringify(payload));

  const webhook = process.env.ERROR_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    console.warn("[monitoring] error webhook failed", err instanceof Error ? err.message : err);
  }
}

function sanitizeLogPayload(payload: Record<string, unknown>) {
  const blocked = /api[_-]?key|authorization|password|secret|token|ciphertext|service[_-]?role/i;
  return Object.fromEntries(
    Object.entries({
      timestamp: new Date().toISOString(),
      service: "vibeforge",
      ...payload,
    })
      .filter(([key, value]) => !blocked.test(key) && typeof value !== "function")
      .map(([key, value]) => [key, typeof value === "string" ? redactSecretText(value) : value]),
  );
}

function redactSecretText(value: string) {
  return value
    .replace(/\b(sk-[a-z0-9_-]{8,}|sk-or-v1-[a-z0-9_-]{8,}|AIza[a-z0-9_-]{12,})\b/gi, "[redacted-secret]")
    .replace(/\b(Bearer\s+)[a-z0-9._-]{12,}\b/gi, "$1[redacted-secret]")
    .replace(/\b(api[_-]?key|authorization|password|secret|token)\s*[:=]\s*['\"]?[^'\"\s,;]+/gi, "$1=[redacted-secret]");
}
