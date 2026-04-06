import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium', channel: 'chrome', headless: true });

test('load admin login', async ({ page }) => {
  await page.goto('http://127.0.0.1:3003/admin/login', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Admin System')).toBeVisible({ timeout: 15000 });
});
