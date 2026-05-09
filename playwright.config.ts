import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Animo E2E smoke tests.
 *
 * Default behavior:
 *   - Reuses an existing dev server at http://localhost:3000 if reachable
 *   - Otherwise starts `pnpm dev` automatically
 *   - Runs tests under tests/e2e/
 *
 * To run against staging/production, set PLAYWRIGHT_BASE_URL.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
