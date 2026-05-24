/**
 * VibeForge Launch Readiness Checks
 *
 * Static checks to verify the app is ready for beta users.
 * Run: npm run check:launch
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    console.log(`  ❌ ${label}`);
    failures++;
  }
}

function fileContains(filePath, text) {
  if (!existsSync(filePath)) return false;
  return readFileSync(filePath, "utf8").includes(text);
}

function fileExists(filePath) {
  return existsSync(filePath);
}

console.log("\n🚀 VibeForge Launch Readiness Checks\n");

// 1. Route checks
console.log("Routes:");
check("/ imports BuilderForm", fileContains(join(root, "src/app/page.tsx"), "BuilderForm"));
check("Error boundary exists", fileExists(join(root, "src/app/error.tsx")));
check("404 page exists", fileExists(join(root, "src/app/not-found.tsx")));
check("Health check exists", fileExists(join(root, "src/app/api/health/route.ts")));

// 2. Export pack checks
console.log("\nExport Packs:");
const kitSections = readFileSync(join(root, "src/lib/kit-sections.ts"), "utf8");
check("Codex pack defined", kitSections.includes("codex"));
check("Cline pack defined", kitSections.includes("cline"));
check("Cursor pack defined", kitSections.includes("cursor"));
check("Claude Code pack defined", kitSections.includes("claude"));

// 3. UI component checks
console.log("\nUI Components:");
check("Start Build panel exists", fileExists(join(root, "src/components/kit/StartBuildPanel.tsx")));
check("Quick Start panel exists", fileExists(join(root, "src/components/builder/QuickStartPanel.tsx")));
check("Settings has demo fallback warning",
  fileContains(join(root, "src/components/settings/ProviderSettingsForm.tsx"), "local-first fallback") ||
  fileContains(join(root, "src/components/settings/ProviderSettingsForm.tsx"), "Local fallback")
);

// 4. Documentation checks
console.log("\nDocumentation:");
check("README.md exists", fileExists(join(root, "README.md")));
const readme = fileExists(join(root, "README.md")) ? readFileSync(join(root, "README.md"), "utf8") : "";
check("README has Getting Started", readme.includes("Getting Started"));
check("README has demo mode info", readme.includes("Demo") || readme.includes("demo"));
check("README has provider setup", readme.includes("Provider") || readme.includes("provider"));
check("ARCHITECTURE.md exists", fileExists(join(root, "ARCHITECTURE.md")));

// 5. Security checks
console.log("\nSecurity:");
const envExample = fileExists(join(root, ".env.example")) ? readFileSync(join(root, ".env.example"), "utf8") : "";
check(".env.example exists", fileExists(join(root, ".env.example")));
check("No real API keys in .env.example",
  !envExample.match(/sk-[a-zA-Z0-9]{20,}/) &&
  !envExample.match(/key_[a-zA-Z0-9]{20,}/)
);
check("Rate limiter exists", fileExists(join(root, "src/lib/rate-limit.ts")));
check("User-facing errors exist", fileExists(join(root, "src/lib/user-facing-errors.ts")));

// 6. Script checks
console.log("\nScripts:");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
check("dev script exists", Boolean(pkg.scripts?.dev));
check("build script exists", Boolean(pkg.scripts?.build));
check("lint script exists", Boolean(pkg.scripts?.lint));
check("test:e2e script exists", Boolean(pkg.scripts?.["test:e2e"]));
check("check:product script exists", Boolean(pkg.scripts?.["check:product"]));
check("check:exports script exists", Boolean(pkg.scripts?.["check:exports"]));

// 7. Provider vault
console.log("\nProvider Vault:");
check("Vault CRUD route exists", fileExists(join(root, "src/app/api/provider-profiles/route.ts")));
check("Vault client helpers exist", fileExists(join(root, "src/lib/vault-client.ts")));
check("Vault validation exists", fileExists(join(root, "src/lib/vault-validation.ts")));

console.log(`\n${failures === 0 ? "✅ All launch checks passed!" : `❌ ${failures} check(s) failed.`}\n`);
process.exit(failures > 0 ? 1 : 0);
