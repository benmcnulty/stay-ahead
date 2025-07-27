import * as path from 'path';
import { test, expect } from '@playwright/test';

// Basic smoke test

test('index page has expected content', async ({ page }) => {
  const filePath = path.join(process.cwd(), 'src', 'index.html');
  await page.goto(new URL(`file://${filePath}`).href);
  await expect(page.locator('h1')).toHaveText('Hello, StayAhead!');
});
