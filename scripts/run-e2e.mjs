import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3007";
if (!/^\d+$/.test(port)) {
  throw new Error("PORT must be numeric for the E2E runner.");
}
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const isWindows = process.platform === "win32";
const npmBin = isWindows ? "npm.cmd" : "npm";

let serverProcess = null;

async function main() {
  const existing = await isHealthy();
  if (!existing) {
    serverProcess = spawnCommand(npmBin, ["run", "dev", "--", "--port", port], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    serverProcess.stdout.on("data", (chunk) => process.stdout.write(chunk));
    serverProcess.stderr.on("data", (chunk) => process.stderr.write(chunk));
    await waitForHealth();
  }

  const status = await runPlaywright();
  await stopServer();
  process.exit(status);
}

async function isHealthy() {
  try {
    const response = await fetch(`${baseURL}/api/health`, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth() {
  const started = Date.now();
  const timeoutMs = 120_000;
  while (Date.now() - started < timeoutMs) {
    if (await isHealthy()) return;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for ${baseURL}`);
}

function runPlaywright() {
  return new Promise((resolve) => {
    const child = spawnCommand(npmBin, ["exec", "--", "playwright", "test"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: baseURL,
        VIBEFORGE_E2E_MANAGED_SERVER: "1",
        ...(isWindows ? { PLAYWRIGHT_CHANNEL: process.env.PLAYWRIGHT_CHANNEL ?? "chrome" } : {}),
      },
      stdio: "inherit",
    });
    child.on("exit", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

function spawnCommand(command, args, options) {
  if (!isWindows) return spawn(command, args, options);
  return spawn([command, ...args].join(" "), [], { ...options, shell: true });
}

async function stopServer() {
  if (!serverProcess?.pid) return;
  if (isWindows) {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(serverProcess.pid), "/t", "/f"], {
        stdio: "ignore",
      });
      killer.on("exit", resolve);
      killer.on("error", resolve);
    });
    return;
  }
  serverProcess.kill("SIGTERM");
}

process.on("SIGINT", async () => {
  await stopServer();
  process.exit(130);
});

process.on("SIGTERM", async () => {
  await stopServer();
  process.exit(143);
});

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await stopServer();
  process.exit(1);
});
