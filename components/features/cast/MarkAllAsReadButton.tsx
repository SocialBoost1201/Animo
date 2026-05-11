'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ApprovalActionState } from '@/lib/types/approval-action';

type Action = (
  prev: ApprovalActionState,
  formData: FormData,
) => Promise<ApprovalActionState>;

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-[10px] border border-white/8 bg-[#181d27] px-3 py-[9px] text-[12px] font-medium leading-[18px] text-[#a9afbc] disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-[13px] w-[13px] animate-spin" />
      ) : (
        <CheckCheck className="h-[13px] w-[13px]" />
      )}
      すべて既読
    </button>
  );
}

/**
 * /cast/notices の「すべて既読」ボタン。
 * useActionState で Server Action の結果を受け取り、
 * 成功/失敗に応じて sonner toast を出す（モバイルUIなのでインライン非表示）。
 *
 * 成功時は revalidatePath('/cast/notices') によりリストが自動更新される。
 */
export function MarkAllAsReadButton({ action }: { action: Action }) {
  const [state, formAction] = useActionState<ApprovalActionState, FormData>(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success('お知らせを既読にしました');
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <SubmitBtn />
    </form>
  );
}
