'use client'

import { useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { submitDailyCheckAndVisits } from '@/lib/actions/today'

type AttendanceStatus = 'work' | 'douhan' | 'off'
type ExistingCheckin = {
  attendance_status?: AttendanceStatus | null
  is_absent?: boolean | null
} | null

type ExistingReservation = {
  sort_order?: number | null
  visit_time?: string | null
  reservation_type?: 'douhan' | 'reservation' | string | null
  guest_name?: string | null
  guest_count?: number | null
  note?: string | null
}

type VisitRow = {
  visit_time: string
  visit_type: '' | 'douhan' | 'reservation'
  customer_name: string
  guest_count: string
  note: string
}

function resolveInitialAttendance(existing: ExistingCheckin): AttendanceStatus {
  const raw = existing?.attendance_status
  if (raw === 'work' || raw === 'douhan' || raw === 'off') return raw
  return existing?.is_absent ? 'off' : 'work'
}

function buildInitialRows(reservations: ExistingReservation[]): VisitRow[] {
  const sorted = [...reservations]
    .filter((r) => r && (r.visit_time || r.guest_name || r.note || r.guest_count || r.reservation_type))
    .sort((a, b) => {
      const orderA = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER
      const orderB = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      const timeA = a.visit_time ?? '99:99'
      const timeB = b.visit_time ?? '99:99'
      return timeA.localeCompare(timeB)
    })
    .slice(0, 5)

  const result: VisitRow[] = Array.from({ length: 5 }, () => ({
    visit_time: '',
    visit_type: '',
    customer_name: '',
    guest_count: '',
    note: '',
  }))

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i]
    result[i] = {
      visit_time: r.visit_time?.slice(0, 5) ?? '',
      visit_type: r.reservation_type === 'douhan' || r.reservation_type === 'reservation' ? r.reservation_type : '',
      customer_name: r.guest_name ?? '',
      guest_count: typeof r.guest_count === 'number' ? String(r.guest_count) : '',
      note: r.note ?? '',
    }
  }

  return result
}

export function CastDailyCheckForm({
  existingCheckin,
  existingReservations,
}: {
  existingCheckin: ExistingCheckin
  existingReservations: ExistingReservation[]
}) {
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(() => resolveInitialAttendance(existingCheckin))
  const [rows, setRows] = useState<VisitRow[]>(() => buildInitialRows(existingReservations))
  const [isPending, startTransition] = useTransition()
  const [savedOnce, setSavedOnce] = useState(false)

  const isVisitEnabled = attendanceStatus !== 'off'

  const warningText = useMemo(() => {
    if (attendanceStatus === 'off') return '休みを選択中のため、来店確認は入力できません。'
    return null
  }, [attendanceStatus])

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors'

  function updateRow(index: number, patch: Partial<VisitRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    startTransition(async () => {
      const formData = new FormData(form)
      formData.set('attendance_status', attendanceStatus)

      const result = await submitDailyCheckAndVisits(formData)
      if ('error' in result && result.error) {
        toast.error(result.error)
        return
      }

      toast.success('本日の入力を保存しました')
      setSavedOnce(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 出勤確認 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500">本日の出勤確認</p>
            <p className="mt-2 text-sm text-gray-600">
              本日の状況を選択してください。休みの場合は来店確認の入力は不要です。
            </p>
          </div>
          {savedOnce ? <span className="text-xs font-bold text-gold">SAVED</span> : null}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {([
            { value: 'work' as const, label: '出勤' },
            { value: 'douhan' as const, label: '同伴' },
            { value: 'off' as const, label: '休み' },
          ]).map((opt) => {
            const isActive = attendanceStatus === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendanceStatus(opt.value)}
                className={[
                  'min-h-[44px] rounded-xl border text-sm font-bold transition-colors',
                  isActive ? 'border-gold bg-gold/10 text-[#171717]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                ].join(' ')}
                aria-pressed={isActive}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-[11px] font-semibold text-red-500">
          ※当日欠勤は罰金の対象となります。
        </p>
      </section>

      {/* 来店確認 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-500">来店確認</p>
        <p className="mt-2 text-sm text-gray-600">本日の来店情報を最大5件まで入力できます（未入力行は保存時に無視されます）。</p>
        {warningText ? <p className="mt-2 text-xs text-gray-400">{warningText}</p> : null}

        <div className={`mt-4 space-y-4 ${isVisitEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
          {rows.map((row, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 p-4 bg-[#fbfaf8]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-widest text-gray-400">#{idx + 1}</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">時間</label>
                  <input
                    type="time"
                    name={`visit_time_${idx + 1}`}
                    value={row.visit_time}
                    onChange={(e) => updateRow(idx, { visit_time: e.target.value })}
                    className={inputClass}
                    disabled={!isVisitEnabled}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">同伴 / 来店</label>
                  <select
                    name={`visit_type_${idx + 1}`}
                    value={row.visit_type}
                    onChange={(e) => updateRow(idx, { visit_type: e.target.value as VisitRow['visit_type'] })}
                    className={inputClass}
                    disabled={!isVisitEnabled}
                  >
                    <option value="">選択</option>
                    <option value="douhan">同伴</option>
                    <option value="reservation">来店</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">顧客名</label>
                  <input
                    type="text"
                    name={`customer_name_${idx + 1}`}
                    value={row.customer_name}
                    onChange={(e) => updateRow(idx, { customer_name: e.target.value })}
                    placeholder="山田"
                    className={inputClass}
                    disabled={!isVisitEnabled}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">人数</label>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    name={`guest_count_${idx + 1}`}
                    value={row.guest_count}
                    onChange={(e) => updateRow(idx, { guest_count: e.target.value })}
                    placeholder="2"
                    className={inputClass}
                    disabled={!isVisitEnabled}
                  />
                </div>

                <div className="md:col-span-12">
                  <label className="block text-xs text-gray-500 mb-1">備考</label>
                  <input
                    type="text"
                    name={`note_${idx + 1}`}
                    value={row.note}
                    onChange={(e) => updateRow(idx, { note: e.target.value })}
                    placeholder="備考"
                    className={inputClass}
                    disabled={!isVisitEnabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-[#171717] hover:bg-gold text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50"
      >
        {isPending ? '保存中...' : '保存する'}
      </button>

      {/* Hidden field for server parsing (kept in sync on submit) */}
      <input type="hidden" name="attendance_status" value={attendanceStatus} readOnly />
    </form>
  )
}

