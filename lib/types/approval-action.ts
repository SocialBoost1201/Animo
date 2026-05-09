/**
 * 承認/却下系 Server Action の戻り値。
 * useActionState で client へ伝播し、ApprovalActionPair が
 * エラー時にユーザーへフィードバックを表示する。
 */
export type ApprovalActionState =
  | { success: true }
  | { success: false; error: string }
  | null;
