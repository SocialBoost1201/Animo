/**
 * 公開エンドポイントで使う origin / UUID 検証ユーティリティ。
 * Pure function 構成にすることで unit test を容易にする。
 */

// UUID v1〜v5 の標準形式（36文字）
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Same-origin 判定。
 * 許可される origin は環境変数 NEXT_PUBLIC_APP_URL と localhost (dev) のみ。
 *
 * @param origin Origin ヘッダーの値
 * @param appUrl process.env.NEXT_PUBLIC_APP_URL の値（任意、未設定なら localhost のみ）
 */
export function isAllowedOrigin(
  origin: string | null | undefined,
  appUrl: string | null | undefined,
): boolean {
  if (!origin) return false;
  const allowed = [appUrl, 'http://localhost:3000', 'http://127.0.0.1:3000']
    .filter((u): u is string => Boolean(u));
  return allowed.some((u) => origin === u);
}

/**
 * 文字列が UUID v1〜v5 形式か判定。
 */
export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}
