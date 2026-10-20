import { defineConfig, devices } from "@playwright/test";

// E2E_PORT lets a worktree test on its own port, so it never reuses another
// checkout's server on the default 3010 (docs/worktrees.md).
const port = process.env.E2E_PORT ?? "3010";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // Half the cores (Playwright's default) overloads WebKit on Windows and page loads time out.
  workers: process.env.CI ? undefined : "25%",
  reporter: "list",
  use: {
    baseURL,
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
      testMatch:
        /(?:theme-toggle|ribbon-roundup|pokemon-polish|hero)\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch:
        /(?:theme-toggle|ribbon-roundup|pokemon-polish|hero)\.spec\.ts/,
    },
  ],
  webServer: {
    // E2E_SERVER=start serves the production build (`next build` first), which scripts/check
    // and CI use: it answers fast, where a cold dev server compiling every route times out
    // under parallel load. Without it, tests run against `next dev`.
    command:
      process.env.E2E_SERVER === "start"
        ? `npx next start -p ${port}`
        : `npx next dev -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
