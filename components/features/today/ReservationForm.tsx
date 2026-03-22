'use client'

import { useState, useTransition } from 'react'
import { addReservation, deleteReservation } from '@/lib/actions/today'
import { toast } from 'sonner'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Reservation = {
  id: string
  visit_time: string
  guest_name: string
  reservation_type: string
  note?: string
}

export function ReservationForm({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)

  const inputClass = 'w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await addReservation(fd)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('来店予定を追加しました')
        setShowForm(false)
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteReservation(id)
      router.refresh()
    })
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">来店予定</p>

      {reservations.length > 0 ? (
        <div className="space-y-2 mb-4">
          {reservations.map(r => (
            <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <Clock size={14} className="text-gold shrink-0" />
              <span className="text-sm font-bold text-gold w-12 shrink-0">{r.visit_time.substring(0, 5)}</span>
              <span className="text-sm text-gray-700">{r.guest_name}様</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${r.reservation_type === 'douhan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                {r.reservation_type === 'douhan' ? '同伴' : '来店予定'}
              </span>
              <button onClick={() => handleDelete(r.id)} className="ml-auto shrink-0">
                <Trash2 size={13} className="text-gray-300 hover:text-red-400 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300 mb-4">本日の来店予定はまだ登録されていません</p>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="block text-xs text-gray-500 mb-1">時間 *</label>
            <input name="visit_time" type="time" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">お客様名 *</label>
            <input name="guest_name" type="text" required placeholder="山田" className={inputClass} />
            <p className="text-xs text-gray-300 mt-1">「様」はつけずに入力してください</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">種別 *</label>
            <select name="reservation_type" required className={inputClass}>
              <option value="">選択してください</option>
              <option value="douhan">同伴</option>
              <option value="reservation">来店予定</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">メモ（任意）</label>
            <input name="note" type="text" placeholder="人数、テーブルなど" className={inputClass} />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 bg-[#171717] text-white text-xs font-bold rounded-xl disabled:opacity-50"
            >
              {isPending ? '追加中...' : '追加する'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 text-xs text-gray-500 rounded-xl border"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-gray-400 hover:text-gold border border-dashed border-gray-200 rounded-xl transition-colors"
        >
          <Plus size={14} />
          来店予定を追加
        </button>
      )}
    </div>
  )
}
