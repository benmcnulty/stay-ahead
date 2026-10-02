import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';
export default defineConfig({
  testDir: 'tests',
  testMatch: 'e2e.spec.js',
  workers: 1,
  use: { baseURL },
  webServer: {
    command: 'node scripts/serve.js',
    url: baseURL,
    env: { PORT: '4173' },
    reuseExistingServer: false,
    timeout: 15000,
  },
});
