import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
const executable =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const port = Number(process.env.ILEARNNATION_E2E_PORT || 3130);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Use a valid unprivileged E2E port.');
const origin = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 20000 },
  reporter: 'list',
  use: { baseURL: origin, trace: 'retain-on-failure' },
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
    env: { ADMIN_PREVIEW: 'true' },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
