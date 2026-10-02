import { test, expect } from '@playwright/test';

// Browser regression: the real static page must load without runtime errors.
test('index page has expected content without browser errors', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/index.html');
  await expect(page.locator('h1')).toHaveText('Hello, StayAhead!');
  expect(errors).toEqual([]);
});

test('preview serves declared assets and keeps repository files private', async ({
  request,
}) => {
  const style = await request.get('/style.css');
  expect(style.status()).toBe(200);
  expect(style.headers()['content-type']).toContain('text/css');
  expect((await request.get('/package.json')).status()).toBe(404);
  expect((await request.post('/index.html')).status()).toBe(405);
});
