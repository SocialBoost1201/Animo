/**
 * `castRegister`（lib/actions/cast-auth.ts）が返す `code` と UI エラー見出しの対応。
 * 変更時は docs/agent-system/cast-register-errors.md と同期すること。
 */
export const CAST_REGISTER_ERROR_TITLE_MAP: Record<string, string> = {
  VALIDATION_INCOMPLETE: '入力不備',
  INVALID_PHONE: '携帯番号',
  MATCH_LOOKUP_FAILED: '照合処理失敗',
  MULTIPLE_MATCHES: '重複候補',
  NO_MATCH: '照合失敗',
  ALREADY_REGISTERED: '既登録',
  AUTH_SIGNUP_FAILED: 'Auth作成失敗',
  AUTH_RECOVERY_FAILED: 'Auth照合失敗',
  AUTH_MULTIPLE_USERS: 'Auth重複',
  AUTH_USER_MISSING: 'Auth作成失敗',
  ROLE_INSERT_FAILED: '権限付与失敗',
  CAST_LINK_FAILED: 'キャスト紐付け失敗',
  UNEXPECTED: '想定外エラー',
};
