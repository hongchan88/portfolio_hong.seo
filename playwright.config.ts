import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:18000',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    launchOptions: {
      args: process.env.PLAYWRIGHT_GPU === 'metal' ? [
        '--enable-webgl', '--enable-gpu', '--use-angle=metal',
      ] : [
        '--enable-webgl',
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
      ],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      process.env.PLAYWRIGHT_SERVER_COMMAND ||
      'NEXT_TEST_BUILD=1 yarn next dev -H 127.0.0.1 -p 18000',
    url: 'http://127.0.0.1:18000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
