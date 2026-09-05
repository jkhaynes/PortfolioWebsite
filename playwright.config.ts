import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3002",
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
    command: "npm run dev",
    url: "http://127.0.0.1:3002",
    reuseExistingServer: !process.env.CI,
  },
});
