import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration.
 *
 * Runs tests across Chromium, Firefox, and WebKit in CI.
 * Locally defaults to Chromium only for speed.
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir:  './tests',

  // Every UI test drives one shared, free-tier external host
  // (the-internet.herokuapp.com). Its response times swing widely when
  // several workers hit it at once, and GitHub's shared runners add their
  // own network latency on top. These budgets are sized for that target,
  // not for a local app — they are not masking a product bug.
  timeout:  60_000,         // per-test timeout
  expect:   { timeout: 15_000 },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Parallel workers. The suite is bound by one external host, not by local
  // CPU, so extra workers mostly add contention on that host rather than
  // throughput — 4 workers made login/dynamic-loading steps time out.
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL:           process.env.BASE_URL ?? 'https://the-internet.herokuapp.com',
    trace:             'on-first-retry',   // capture trace on flaky retries
    screenshot:        'only-on-failure',  // screenshot on failure
    video:             'on-first-retry',   // video on flaky retries
    actionTimeout:     20_000,  // a form submit click also waits out the navigation
    navigationTimeout: 30_000,
  },

  projects: [
    // --- Setup project (global auth state) ---
    {
      name:    'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // --- Chromium (default for all environments) ---
    {
      name:         'chromium',
      use:          { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // --- Firefox + WebKit in CI only ---
    ...(process.env.CI ? [
      {
        name:         'firefox',
        use:          { ...devices['Desktop Firefox'] },
        dependencies: ['setup'],
      },
      {
        name:         'webkit',
        use:          { ...devices['Desktop Safari'] },
        dependencies: ['setup'],
      },
      // Mobile viewports
      {
        name: 'mobile-chrome',
        use:  { ...devices['Pixel 7'] },
        dependencies: ['setup'],
      },
      {
        name: 'mobile-safari',
        use:  { ...devices['iPhone 15'] },
        dependencies: ['setup'],
      },
    ] : []),
  ],
});
