'use client';

import { useActionState } from 'react';
import type { ReactNode } from 'react';
import type { ApprovalActionState } from '@/lib/types/approval-action';

type PostAction = (
  prev: ApprovalActionState,
  formData: FormData,
) => Promise<ApprovalActionState>;

/**
 * /admin/posts の単一ボタンフォーム用クライアントラッパー。
 * useActionState で Server Action の結果を受け取り、失敗時はボタン下に
 * エラーメッセージを表示する。成功時は revalidatePath で対象アイテムが
 * 一覧から消えるため追加表示は不要。
 *
 * 既存ボタンの見た目をそのまま使うため、children として button を渡す。
 */
export function PostActionForm({
  id,
  action,
  children,
  className,
}: {
  id: string;
  action: PostAction;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState<ApprovalActionState, FormData>(action, null);
  const error = state && state.success === false ? state.error : null;

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="id" value={id} />
      {children}
      {error && (
        <p
          role="alert"
          className="text-[10px] leading-tight text-[#c8884d] font-medium mt-1"
        >
          {error}
        </p>
      )}
    </form>
  );
}
