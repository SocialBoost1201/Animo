'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

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

/**
 * 承認ハブで使う承認・却下ボタンペア。
 * Server Action を props で受け取り、useFormStatus でローディング状態を管理する。
 */
export function ApprovalActionPair({
  id,
  approveAction,
  rejectAction,
}: {
  id: string;
  approveAction: (formData: FormData) => Promise<void>;
  rejectAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="flex gap-2 pt-0.5">
      <form action={approveAction} className="flex-1">
        <input type="hidden" name="id" value={id} />
        <ApproveBtn />
      </form>
      <form action={rejectAction} className="flex-1">
        <input type="hidden" name="id" value={id} />
        <RejectBtn />
      </form>
    </div>
  );
}
