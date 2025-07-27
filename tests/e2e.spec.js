
import { test, expect } from '@playwright/test';

// Basic smoke test

test('index page has expected content', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('h1')).toHaveText('Hello, StayAhead!');
});
