'use client'

import { Trash2 } from 'lucide-react'
import { deleteCast } from '@/lib/actions/casts'
import { useTransition } from 'react'

export function DeleteCastButton({ castId, castName }: { castId: string, castName: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`${castName} を削除してもよろしいですか？`)) return
    startTransition(async () => {
      await deleteCast(castId)
    })
  }

  return (
    <button
      type="button"
      className="p-2 text-[#b7af9f] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 size={16} />
    </button>
  )
}
