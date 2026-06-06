import { execSync } from "node:child_process";

const required = [
  "VIBEFORGE_SERVER_PROVIDER_API_KEY",
  "VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VIBEFORGE_PROVIDER_KEY_SECRET",
  "VIBEFORGE_REDIS_REST_URL",
  "VIBEFORGE_REDIS_REST_TOKEN",
  "ERROR_WEBHOOK_URL",
];

let output = "";
try {
  output = execSync("npx vercel env ls production", {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });
} catch (error) {
  const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr ?? "").trim() : "";
  const message = stderr || (error instanceof Error ? error.message : "Unknown Vercel CLI error.");
  console.error("Could not inspect Vercel production env.");
  console.error(message);
  process.exit(1);
}

const present = new Set();
for (const line of output.split(/\r?\n/)) {
  const name = line.trim().split(/\s+/)[0];
  if (/^[A-Z0-9_]+$/.test(name)) present.add(name);
}

const missing = required.filter((name) => !present.has(name));
console.log(`Vercel production env present: ${required.length - missing.length}/${required.length}`);
if (missing.length) {
  console.log("Missing production env:");
  for (const name of missing) console.log(`- ${name}`);
  process.exitCode = 1;
} else {
  console.log("All required production env names are present.");
}
