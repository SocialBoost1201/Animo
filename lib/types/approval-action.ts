/**
 * 承認/却下系 Server Action の戻り値。
 * useActionState で client へ伝播し、ApprovalActionPair が
 * エラー時にユーザーへフィードバックを表示する。
 */
export type ApprovalActionState =
  | { success: true }
  | { success: false; error: string }
  | null;

/**
 * Server Action 内部で `{success?, error?}` 形式の結果を
 * `ApprovalActionState` に正規化するヘルパー。
 *
 * - success が true なら成功扱い
 * - それ以外は失敗扱いで、result.error があればそれを、無ければ fallback を使う
 */
export function asApprovalActionState(
  result: { success?: boolean; error?: string } | null | undefined,
  fallback: string,
): ApprovalActionState {
  if (result?.success) return { success: true };
  return { success: false, error: result?.error ?? fallback };
}
