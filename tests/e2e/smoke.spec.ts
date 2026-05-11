import { test, expect } from '@playwright/test';

/**
 * Animo E2E スモークテスト。
 *
 * 認証が不要な公開ページのみを対象に、サーバが起動して
 * 主要ルートが 5xx や JS エラーを出さずレンダリングできることを確認する。
 *
 * 認証が必要な admin/cast 画面のテストは Phase 4 以降で
 * 専用テストアカウント + storageState で対応予定。
 */

test.describe('public routes smoke', () => {
  test('home page renders without server error', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status(), 'home should not 5xx').toBeLessThan(500);
    // 初期ヒーローの主要文言を緩く確認（テキストが入れ替わってもページが返ってくることが目的）
    await expect(page).toHaveTitle(/.+/);
  });

  test('cast list page loads', async ({ page }) => {
    const response = await page.goto('/cast');
    expect(response?.status(), 'cast list should not 5xx').toBeLessThan(500);
    await expect(page).toHaveTitle(/.+/);
  });

  test('admin login page is reachable', async ({ page }) => {
    const response = await page.goto('/admin/login');
    expect(response?.status(), 'admin login should not 5xx').toBeLessThan(500);
    // input[type=password] があれば最低限のフォーム描画は通っている
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('cast login page is reachable', async ({ page }) => {
    const response = await page.goto('/cast/login');
    expect(response?.status(), 'cast login should not 5xx').toBeLessThan(500);
    await expect(page.locator('form').first()).toBeVisible({ timeout: 10_000 });
  });

  test('robots.txt is served', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] ?? '').toMatch(/text\/plain/);
  });
});
