import { defineConfig, devices } from '@playwright/test';

/**
 * The suite drives the built site, not the dev server: `npm run preview` serves
 * `dist/`, which is what deploys, and the islands only behave correctly once
 * their chunks are split the way the build splits them.
 *
 * Run `npm run build` first (or let `test:e2e` do it).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
