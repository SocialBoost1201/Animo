'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteNotice } from '@/lib/actions/internal-notices';
import { toast } from 'sonner';

export function NoticeDeleteButton({ noticeId }: { noticeId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('このお知らせを削除しますか？\n（キャストの既読記録も削除されます）\n\n※この操作は元に戻せません。')) {
      return;
    }
    
    startTransition(async () => {
      const result = await deleteNotice(noticeId);
      if (result.success) {
        toast.success('お知らせを削除しました');
      } else {
        toast.error(result.error || '削除に失敗しました');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="削除"
    >
      <Trash2 size={18} />
    </button>
  );
}
