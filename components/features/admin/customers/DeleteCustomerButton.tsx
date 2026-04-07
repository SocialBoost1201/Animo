'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteCustomer } from '@/lib/actions/customers';

interface DeleteCustomerButtonProps {
  customerId: string;
  customerName: string;
}

export function DeleteCustomerButton({ customerId, customerName }: DeleteCustomerButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`顧客「${customerName || '名称未設定'}」を本当に削除しますか？\nこの操作は元に戻せません。`)) {
      startTransition(async () => {
        try {
          const result = await deleteCustomer(customerId);
          if (result && 'error' in result && result.error) {
            alert(`削除エラー: ${result.error}`);
          }
        } catch (e: unknown) {
          if (e instanceof Error) {
            alert(`削除エラー: ${e.message}`);
          } else {
            alert('削除エラーが発生しました');
          }
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-1.5 rounded-md transition-colors ${
        isPending
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-[#8a8478] hover:text-[#f87171] hover:bg-[#ff00001a]'
      }`}
      title="削除"
      aria-label="顧客データを削除"
    >
      <Trash2 size={13} />
    </button>
  );
}
