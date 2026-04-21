/**
 * マスターアカウント設定
 *
 * 締切後テストや管理者オーバーライドを許可するメールアドレス一覧。
 * 将来的に複数アカウントへ拡張する場合はここに追記する。
 */
export const MASTER_TEST_EMAILS: readonly string[] = [
  'takuma12010309@gmail.com',
]

/**
 * ログイン済みユーザーのメールアドレスがマスターアカウントか判定する。
 * 大文字小文字・前後スペースを正規化してから比較する。
 */
export function isMasterAccount(email: string | null | undefined): boolean {
  if (!email) return false
  return MASTER_TEST_EMAILS.includes(email.trim().toLowerCase())
}
