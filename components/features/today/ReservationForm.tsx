'use client'

import { useState, useTransition } from 'react'
import { addReservation, deleteReservation } from '@/lib/actions/today'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Reservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  reservation_type: string
  note?: string
  approval_status?: 'pending' | 'approved' | 'rejected'
  visit_certainty?: 'confirmed' | 'maybe' | 'contacting'
}

const CERTAINTY_OPTIONS = [
  { value: 'confirmed', label: '確定',   activeClass: 'border-[rgba(51,179,107,0.35)] bg-[rgba(51,179,107,0.15)] text-[#33b36b]' },
  { value: 'maybe',     label: '来るかも', activeClass: 'border-[rgba(230,162,60,0.35)]  bg-[rgba(230,162,60,0.15)]  text-[#e6a23c]' },
  { value: 'contacting',label: '連絡中',  activeClass: 'border-[rgba(130,130,220,0.35)] bg-[rgba(130,130,220,0.15)] text-[#9090e0]' },
] as const

type CertaintyValue = typeof CERTAINTY_OPTIONS[number]['value']

export function ReservationForm({
  reservations,
  isSubmissionClosed,
  deadlineLabel,
}: {
  reservations: Reservation[]
  isSubmissionClosed: boolean
  deadlineLabel: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [selectedCertainty, setSelectedCertainty] = useState<CertaintyValue>('maybe')

  const inputClass = 'h-[39px] w-full rounded-[10px] border border-[#ffffff0a] bg-black/40 px-3 text-[13px] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.4)] focus:outline-none focus:ring-1 focus:ring-[#c9a76a] transition-all'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('visit_certainty', selectedCertainty)
    startTransition(async () => {
      const result = await addReservation(fd)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || '来店予定を追加しました')
        if ('warning' in result && result.warning) {
          toast.error(result.warning)
        }
        setShowForm(false)
        setSelectedCertainty('maybe')
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteReservation(id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="rounded-[18px] border border-[#ffffff0a] bg-[#10141d] p-4">
      <p className="mb-4 text-[10px] font-bold tracking-[1.2px] uppercase text-[#6b7280]">03 — 来店予定</p>

      {isSubmissionClosed ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          本日の提出締切 {deadlineLabel} を過ぎたため、現在は編集できません。
        </p>
      ) : null}

      {reservations.length > 0 ? (
        <div className="mb-4 space-y-3">
          {reservations.map(r => {
            const certainty = r.visit_certainty ?? 'maybe'
            return (
              <div key={r.id} className="rounded-[16px] border border-[#ffffff0a] bg-[#131720] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[11px] font-bold">{reservations.findIndex((item) => item.id === r.id) + 1}</span>
                    {reservations.findIndex((item) => item.id === r.id) + 1}組目
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="text-[#6b7280]">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="text-[13px] text-[#f7f4ed]">{r.guest_name}様</div>
                    <div className="text-[13px] font-medium text-[#f7f4ed]">{r.visit_time.substring(0, 5)}</div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-3">
                    <div className="rounded-[10px] bg-[#131720] px-3 py-2 text-[13px] text-[#f7f4ed]">{r.guest_count ?? 1}名</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CERTAINTY_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className={`rounded-[8px] px-2 py-2 text-center text-[11px] font-bold border ${
                            certainty === opt.value
                              ? opt.activeClass
                              : 'border-white/8 bg-[#131720] text-[#6b7280]'
                          }`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  {r.note ? <div className="rounded-[10px] bg-[#131720] px-3 py-2 text-[13px] text-[#a9afbc]">{r.note}</div> : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mb-4 text-[13px] text-[#a9afbc]">来店予定がある方は入力してください</p>
      )}

      {showForm && !isSubmissionClosed ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-[16px] border border-[#ffffff0a] bg-[#131720] p-4">
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">時間 *</label>
            <input name="visit_time" type="time" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">お客様名 *</label>
            <input name="guest_name" type="text" required placeholder="山田" className={inputClass} />
            <p className="mt-1 text-[11px] text-[#6b7280]">「様」はつけずに入力してください</p>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">人数</label>
            <input
              name="guest_count"
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="2"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">種別 *</label>
            <select name="reservation_type" required className={inputClass}>
              <option value="">選択してください</option>
              <option value="douhan">同伴</option>
              <option value="reservation">来店予定</option>
            </select>
          </div>

          {/* 来店状況（確度）選択 */}
          <div>
            <label className="mb-2 block text-[11px] text-[#6b7280]">来店状況 *</label>
            <div className="grid grid-cols-3 gap-2">
              {CERTAINTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedCertainty(opt.value)}
                  className={`rounded-[10px] border py-2.5 text-[12px] font-bold transition-all ${
                    selectedCertainty === opt.value
                      ? opt.activeClass
                      : 'border-white/8 bg-[#0b0d12] text-[#6b7280]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">メモ（任意）</label>
            <input name="note" type="text" placeholder="テーブル、備考など" className={inputClass} />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-[12px] bg-[#c9a76a] py-3 text-[13px] font-bold text-[#0b0d12] disabled:opacity-50"
            >
              {isPending ? '追加中...' : '追加する'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setSelectedCertainty('maybe') }}
              className="rounded-[12px] border border-white/8 px-4 py-3 text-[13px] text-[#6b7280]"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <button
          disabled={isSubmissionClosed}
          onClick={() => setShowForm(true)}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-white/14 text-[13px] text-[#6b7280] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          来店予定を追加
        </button>
      )}
    </div>
  )
}

