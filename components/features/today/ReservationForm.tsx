'use client'

import { useEffect, useState, useTransition } from 'react'
import { deleteReservation } from '@/lib/actions/today'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

type SavedReservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  reservation_type: string
  note?: string
}

export type PendingReservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  note?: string
}

function createTempId() {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sortByTime<T extends { visit_time: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.visit_time.localeCompare(b.visit_time))
}

export function ReservationForm({
  reservations,
  isSubmissionClosed,
  deadlineLabel,
  pendingReservations = [],
  onAddPending,
  onRemovePending,
}: {
  reservations: SavedReservation[]
  isSubmissionClosed: boolean
  deadlineLabel: string
  pendingReservations?: PendingReservation[]
  onAddPending?: (r: PendingReservation) => void
  onRemovePending?: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [localReservations, setLocalReservations] = useState(reservations)
  const [showForm, setShowForm] = useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])

  useEffect(() => {
    setLocalReservations(reservations)
  }, [reservations])

  const inputClass =
    'h-[48px] w-full rounded-[12px] bg-black/40 border-none px-3 text-[13px] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.4)] focus:outline-hidden focus:ring-1 focus:ring-[#c9a76a] transition-all'

  function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const guestCountValue = String(fd.get('guest_count') ?? '').trim()

    if (onAddPending) {
      // pending mode: just add to local list, no server call
      onAddPending({
        id: createTempId(),
        visit_time: String(fd.get('visit_time') ?? ''),
        guest_name: String(fd.get('guest_name') ?? '').trim(),
        guest_count: guestCountValue ? Number.parseInt(guestCountValue, 10) : null,
        note: String(fd.get('note') ?? '').trim() || undefined,
      })
      e.currentTarget.reset()
      setShowForm(false)
      return
    }

    // standalone mode (no parent shell): kept for backward compatibility
    toast.error('送信ハンドラが接続されていません')
  }

  function handleDeleteSaved(id: string) {
    const previousReservations = localReservations
    setLocalReservations(current => current.filter(r => r.id !== id))
    setPendingDeleteIds(current => [...current, id])

    startTransition(async () => {
      const result = await deleteReservation(id)
      setPendingDeleteIds(current => current.filter(pid => pid !== id))
      if (result.error) {
        setLocalReservations(previousReservations)
        toast.error(result.error)
      }
    })
  }

  const sortedSaved = sortByTime(localReservations)
  const sortedPending = sortByTime(pendingReservations)
  const totalCount = sortedSaved.length + sortedPending.length

  return (
    <div className="rounded-[18px] card-premium-skin">
      <div className="card-premium-skin__surface rounded-[18px] overflow-hidden p-4">
        <p className="mb-2 text-[10px] font-bold tracking-[1.2px] uppercase text-[#6b7280]">
          02 — 通常来店予定
        </p>

        {/* ② 説明文 */}
        <p className="mb-4 text-[11px] leading-relaxed text-[#8f96a3]">
          同伴以外の通常来店予定を入力してください
        </p>

        {isSubmissionClosed ? (
          <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            本日の提出締切 {deadlineLabel} を過ぎたため、現在は編集できません。
          </p>
        ) : null}

        {/* Saved reservations */}
        {totalCount > 0 ? (
          <div className="mb-4 space-y-3">
            {sortedSaved.map((r, i) => (
              <div key={r.id} className="rounded-[16px] bg-[#131720] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[11px] font-bold">
                      {i + 1}
                    </span>
                    {i + 1}組目
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSaved(r.id)}
                    disabled={pendingDeleteIds.includes(r.id) || isPending}
                    className="text-[#6b7280] disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="text-[13px] text-[#f7f4ed]">{r.guest_name}様</div>
                    <div className="text-[13px] font-medium text-[#f7f4ed]">
                      {r.visit_time.substring(0, 5)}
                    </div>
                  </div>
                  <div className="text-[12px] text-[#6b7280]">{r.guest_count ?? 1}名</div>
                </div>
              </div>
            ))}

            {/* Pending (not yet submitted) reservations */}
            {sortedPending.map((r, i) => (
              <div key={r.id} className="rounded-[16px] bg-[#131720] p-4 ring-1 ring-[#c9a76a]/20">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[11px] font-bold">
                      {sortedSaved.length + i + 1}
                    </span>
                    {sortedSaved.length + i + 1}組目
                    <span className="rounded-full bg-[rgba(201,167,106,0.15)] px-2 py-0.5 text-[9px] font-bold text-[#c9a76a]">
                      未送信
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemovePending?.(r.id)}
                    className="text-[#6b7280]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="text-[13px] text-[#f7f4ed]">{r.guest_name}様</div>
                    <div className="text-[13px] font-medium text-[#f7f4ed]">
                      {r.visit_time.substring(0, 5)}
                    </div>
                  </div>
                  <div className="text-[12px] text-[#6b7280]">{r.guest_count ?? 1}名</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-4 text-[13px] text-[#a9afbc]">来店予定がある方は入力してください</p>
        )}

        {/* Add form */}
        {showForm && !isSubmissionClosed ? (
          <form onSubmit={handleAddSubmit} className="space-y-4 rounded-[16px] bg-[#131720] p-4">
            <div>
              <label className="mb-1 block text-[11px] text-[rgba(247,244,237,0.7)]">時間 *</label>
              <input name="visit_time" type="time" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#6b7280]">お客様名 *</label>
              <input
                name="guest_name"
                type="text"
                required
                placeholder="山田"
                className={inputClass}
              />
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
            <input type="hidden" name="reservation_type" value="reservation" />
            <div>
              <label className="mb-1 block text-[11px] text-[rgba(247,244,237,0.7)]">
                メモ（任意）
              </label>
              <input
                name="note"
                type="text"
                placeholder="テーブル、備考など"
                className={inputClass}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-[12px] bg-[#c9a76a] py-3 text-[13px] font-bold text-[#0b0d12] disabled:opacity-50"
              >
                リストに追加
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-[12px] bg-white/5 hover:bg-white/10 px-4 py-3 text-[13px] text-[#f7f4ed] transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            disabled={isSubmissionClosed}
            onClick={() => setShowForm(true)}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[rgba(255,255,255,0.03)] text-[13px] text-[#f7f4ed]/70 hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
            来店予定を追加
          </button>
        )}
      </div>
    </div>
  )
}
