const baseUrl = process.env.VIBEFORGE_PRODUCTION_URL || process.env.VIBEFORGE_API_BASE_URL || "https://vibeforge-seven.vercel.app";
const allowPartial = process.env.VIBEFORGE_ALLOW_PARTIAL_PRODUCTION === "1";

const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/production-readiness`, {
  signal: AbortSignal.timeout(30_000),
});

const report = await response.json().catch(() => null);
if (!report?.checks) {
  throw new Error(`Production readiness endpoint returned invalid payload from ${baseUrl}`);
}

console.log(`Production readiness target: ${baseUrl}`);
console.log(`Status: ${report.status}`);

for (const [key, check] of Object.entries(report.checks)) {
  const marker = check.ok ? "PASS" : "MISSING";
  console.log(`${marker} ${key}: ${check.detail}`);
}

if (report.status !== "ready" && !allowPartial) {
  throw new Error("Production readiness is not ready. Set VIBEFORGE_ALLOW_PARTIAL_PRODUCTION=1 only for public-beta deploys.");
}
