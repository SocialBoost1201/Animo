'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

type ActionResult = { success: boolean; error?: string };

type Props = {
  id: string;
  action: (formData: FormData) => Promise<ActionResult>;
  label: string;
  pendingLabel?: string;
  className: string;
  successMessage: string;
  fallbackErrorMessage?: string;
};

export function ApprovalActionButton({
  id,
  action,
  label,
  pendingLabel = '処理中...',
  className,
  successMessage,
  fallbackErrorMessage = '操作に失敗しました',
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      try {
        const result = await action(formData);
        if (result?.success) {
          toast.success(successMessage);
        } else {
          toast.error(result?.error || fallbackErrorMessage);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : fallbackErrorMessage;
        toast.error(message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending}
      className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}
