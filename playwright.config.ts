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
  timeout:  30_000,         // per-test timeout
  expect:   { timeout: 5_000 },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Parallel workers
  workers: process.env.CI ? 4 : undefined,

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
    actionTimeout:     10_000,
    navigationTimeout: 20_000,
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
