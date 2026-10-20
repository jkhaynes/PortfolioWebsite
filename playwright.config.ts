import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // Half the cores (Playwright's default) overloads WebKit on Windows and page loads time out.
  workers: process.env.CI ? undefined : "25%",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3010",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /(?:theme-toggle|ribbon-roundup|pokemon-polish)\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: /(?:theme-toggle|ribbon-roundup|pokemon-polish)\.spec\.ts/,
    },
  ],
  webServer: {
    // E2E_SERVER=start serves the production build (`next build` first), which scripts/check
    // and CI use: it answers fast, where a cold dev server compiling every route times out
    // under parallel load. Without it, tests run against `npm run dev`.
    command:
      process.env.E2E_SERVER === "start" ? "npm run start" : "npm run dev",
    url: "http://127.0.0.1:3010",
    reuseExistingServer: !process.env.CI,
  },
});
