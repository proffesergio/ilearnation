import { defineConfig, devices, chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';
const executable =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync(chromium.executablePath())
    ? chromium.executablePath()
    : existsSync('/usr/bin/google-chrome')
      ? '/usr/bin/google-chrome'
      : undefined);
const port = Number(process.env.ILEARNNATION_E2E_PORT || 3130);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Use a valid unprivileged E2E port.');
const origin = `http://127.0.0.1:${port}`;
const databasePath =
  process.env.ILEARNNATION_E2E_DB ||
  path.resolve('.local-data', `e2e-${process.pid}-${Date.now()}.sqlite`);
process.env.ILEARNNATION_E2E_DB = databasePath;
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 20000 },
  reporter: 'list',
  use: {
    baseURL: origin,
    trace: 'retain-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: executable, args: ['--no-sandbox'] },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
        launchOptions: { executablePath: executable, args: ['--no-sandbox'] },
      },
    },
  ],
  webServer: {
    command: `npm run start --workspace=@ilearnnation/web -- --port ${port}`,
    url: origin,
    env: {
      DATABASE_MODE: 'sqlite',
      DATABASE_URL: '',
      LOCAL_DATABASE_PATH: databasePath,
      AUTH_URL: origin,
      AUTH_SECRET: 'test-only-ilearnation-secret-not-for-a-live-service-2026',
      AUTH_GOOGLE_ID: '',
      AUTH_GOOGLE_SECRET: '',
      ALLOW_SQLITE_PRODUCTION: 'true',
      ALLOW_INSECURE_LOCAL_AUTH: 'true',
      VERCEL: '',
    },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
