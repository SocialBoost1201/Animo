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
      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 disabled:opacity-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 size={16} />
    </button>
  )
}
