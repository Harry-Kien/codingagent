import { defineConfig, devices } from "@playwright/test";

const localWindowsChannel = process.platform === "win32" && !process.env.CI ? "chrome" : undefined;
const managedServer = process.env.VIBEFORGE_E2E_MANAGED_SERVER === "1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3007";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }]],
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: managedServer
    ? undefined
    : {
        command: "npx next dev --port 3007",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL ?? localWindowsChannel },
    },
  ],
});
