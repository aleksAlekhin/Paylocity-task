const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "reports/html" }],
    ["list"]
  ],
  use: {
    baseURL: process.env.API_URL,
    extraHTTPHeaders: {
      Authorization: `Basic ${process.env.AUTH_TOKEN}`,
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "api",
      testMatch: "**/api/**/*.spec.js",
    },
    {
      name: "ui",
      testMatch: "**/ui/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});