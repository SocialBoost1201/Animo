'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import type { ApprovalActionState } from '@/lib/types/approval-action';

function ApproveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center h-8 text-[11px] font-bold rounded-[8px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : '承認'}
    </button>
  );
}

function RejectBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center h-8 text-[11px] font-bold rounded-[8px] border border-[#c8823226] bg-[#c882321a] text-[#c8884d] hover:bg-[#c8823230] transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin text-[#c8884d]" /> : '却下'}
    </button>
  );
}

type ApprovalAction = (
  prev: ApprovalActionState,
  formData: FormData,
) => Promise<ApprovalActionState>;

/**
 * 承認ハブで使う承認・却下ボタンペア。
 * useActionState で Server Action の結果（成功/失敗）を受け取り、
 * 失敗時はボタン下にエラーメッセージを表示する。
 *
 * 成功時は Server Action 側の revalidatePath で
 * 対象アイテムが一覧から消えるため、UI の追加表示は不要。
 */
export function ApprovalActionPair({
  id,
  approveAction,
  rejectAction,
}: {
  id: string;
  approveAction: ApprovalAction;
  rejectAction: ApprovalAction;
}) {
  const [approveState, approveFormAction] = useActionState<ApprovalActionState, FormData>(
    approveAction,
    null,
  );
  const [rejectState, rejectFormAction] = useActionState<ApprovalActionState, FormData>(
    rejectAction,
    null,
  );

  const errorMessage =
    (approveState && approveState.success === false ? approveState.error : null) ??
    (rejectState && rejectState.success === false ? rejectState.error : null);

  return (
    <div className="flex flex-col gap-1 pt-0.5">
      <div className="flex gap-2">
        <form action={approveFormAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <ApproveBtn />
        </form>
        <form action={rejectFormAction} className="flex-1">
          <input type="hidden" name="id" value={id} />
          <RejectBtn />
        </form>
      </div>
      {errorMessage && (
        <p
          role="alert"
          className="text-[10px] leading-tight text-[#c8884d] font-medium px-1"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
