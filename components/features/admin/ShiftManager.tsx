'use client'

import { useState, useTransition, useCallback } from 'react'
import { saveSchedules } from '@/lib/actions/schedules'
import { toast } from 'sonner'
import { Clock, Save, Loader2, Check, CalendarDays, List } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TIME_OPTIONS = [
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', 'LAST'
]

const DAYS_SHORT = ['月', '火', '水', '木', '金', '土', '日']

type CastData = { id: string; stage_name: string; [key: string]: unknown }
type ShiftData = { cast_id: string; date?: string; work_date?: string; start_time: string | null; end_time: string | null; [key: string]: unknown }

type ShiftKey = string // `${castId}_${date}`
type ShiftMap = Map<ShiftKey, { start_time: string; end_time: string }>

export function ShiftManager({ initialData, viewType = 'week' }: {
  initialData: { casts: CastData[]; shifts: ShiftData[]; dates: string[] }
  viewType?: 'week' | 'month'
}) {
  const { casts, shifts, dates } = initialData
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Build edit map from existing shifts
  const [shiftMap, setShiftMap] = useState<ShiftMap>(() => {
    const map = new Map<ShiftKey, { start_time: string; end_time: string }>()
    ;(shifts || []).forEach((s) => {
      const d = s.work_date || s.date || ''
      map.set(`${s.cast_id}_${d}`, {
        start_time: s.start_time || '21:00',
        end_time: s.end_time || 'LAST',
      })
    })
    return map
  })

  const [editingCell, setEditingCell] = useState<{ castId: string; date: string } | null>(null)

  const toggleShift = useCallback((castId: string, date: string) => {
    setShiftMap(prev => {
      const next = new Map(prev)
      const key = `${castId}_${date}`
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.set(key, { start_time: '21:00', end_time: 'LAST' })
      }
      return next
    })
  }, [])

  const updateTime = useCallback((castId: string, date: string, field: 'start_time' | 'end_time', value: string) => {
    setShiftMap(prev => {
      const next = new Map(prev)
      const key = `${castId}_${date}`
      const existing = next.get(key)
      if (existing) {
        next.set(key, { ...existing, [field]: value })
      }
      return next
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const originalMap = new Map<string, true>()
      ;(shifts || []).forEach((s) => {
        const d = s.work_date || s.date || ''
        originalMap.set(`${s.cast_id}_${d}`, true)
      })

      const updates: Record<string, unknown>[] = []

      // Insertions
      for (const [key, val] of shiftMap.entries()) {
        if (!originalMap.has(key)) {
          const [castId, date] = key.split('_')
          updates.push({ action: 'insert', cast_id: castId, date, ...val })
        }
      }

      // Deletions
      for (const [key] of originalMap.entries()) {
        if (!shiftMap.has(key)) {
          const s = (shifts || []).find(s => {
            const d = s.work_date || s.date || ''
            return `${s.cast_id}_${d}` === key
          })
          if (s) {
            const d = s.work_date || s.date || ''
            updates.push({ action: 'delete', cast_id: s.cast_id, date: d })
          }
        }
      }

      if (updates.length === 0) {
        toast.info('変更はありません')
        return
      }

      const fd = new FormData()
      fd.append('updates', JSON.stringify(updates))
      const result = await saveSchedules(fd)
      if (result?.error) {
        toast.error('保存に失敗しました: ' + result.error)
      } else {
        toast.success(`${updates.length}件のシフトを保存しました`)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-[14px]">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[14px]">
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[4px] bg-[#dfbd691a] border border-[#dfbd6940]" />
            <span className="text-[11px] font-medium text-[#c7c0b2]">出勤あり</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[4px] bg-[#ffffff05] border border-[#ffffff0f]" />
            <span className="text-[11px] font-medium text-[#5a5650]">未設定</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center h-[37px] bg-[#ffffff06] rounded-[10px] border border-[#8a8478] p-[3px]">
            <button
              onClick={() => router.push('?view=week')}
              className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-bold rounded-[7px] transition-all ${
                viewType === 'week' ? 'bg-[#ffffff12] text-[#f4f1ea]' : 'text-[#8a8478] hover:text-[#c7c0b2]'
              }`}
            >
              <List size={12} />
              週
            </button>
            <button
              onClick={() => router.push('?view=month')}
              className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-bold rounded-[7px] transition-all ${
                viewType === 'month' ? 'bg-[#ffffff12] text-[#f4f1ea]' : 'text-[#8a8478] hover:text-[#c7c0b2]'
              }`}
            >
              <CalendarDays size={12} />
              月
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 h-[37px] px-5 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            保存
          </button>
        </div>
      </div>

      {/* ── Grid Container ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#ffffff08] bg-[#ffffff02]">
                <th className="sticky left-0 z-10 px-5 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em] w-[140px] bg-[#17181c]">
                  キャスト
                </th>
                {dates.map((date, i) => {
                  const d = new Date(date)
                  const isSun = d.getDay() === 0
                  return (
                    <th key={date} className="px-2 py-3 text-center min-w-[48px] border-l border-[#ffffff05]">
                      <p className={`text-[10px] font-bold tracking-[0.05em] ${isSun ? 'text-[#d4785a]' : 'text-[#8a8478]'}`}>
                        {DAYS_SHORT[i % 7]}
                      </p>
                      <p className="text-[13px] font-bold text-[#f4f1ea] leading-tight">
                        {d.getDate()}
                      </p>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff05]">
              {casts?.map((cast) => (
                <tr key={cast.id} className="hover:bg-[#ffffff02] group/row transition-colors h-[64px]">
                  {/* Cast Name Cell */}
                  <td className="sticky left-0 z-10 px-5 py-2 font-medium bg-[#17181c] group-hover/row:bg-[#1a1c21] transition-colors border-r border-[#ffffff05]">
                    <p className="text-[12px] font-bold text-[#f4f1ea] truncate underline decoration-[#dfbd6940] underline-offset-4 decoration-2">
                      {cast.stage_name}
                    </p>
                    <p className="text-[9px] font-bold text-[#5a5650] mt-1 uppercase tracking-wider">
                      {dates.filter(d => shiftMap.has(`${cast.id}_${d}`)).length} / {dates.length} Days
                    </p>
                  </td>

                  {/* Shift Cells */}
                  {dates.map((date) => {
                    const key = `${cast.id}_${date}`
                    const hasShift = shiftMap.has(key)
                    const shift = shiftMap.get(key)
                    const isEditing = editingCell?.castId === cast.id && editingCell?.date === date

                    return (
                      <td key={date} className="px-1 py-1 text-center align-middle border-l border-[#ffffff03]">
                        {isEditing && hasShift ? (
                          <div className="flex flex-col gap-1 items-center bg-[#1c1d22] border border-[#dfbd6940] p-1.5 rounded-[8px] shadow-xl z-20">
                            <select
                              value={shift?.start_time}
                              onChange={e => updateTime(cast.id, date, 'start_time', e.target.value)}
                              className="text-[9px] font-bold bg-[#0e0e10] text-[#f4f1ea] border border-[#ffffff14] rounded px-1 py-1 w-full outline-none focus:border-[#dfbd6940]"
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select
                              value={shift?.end_time}
                              onChange={e => updateTime(cast.id, date, 'end_time', e.target.value)}
                              className="text-[9px] font-bold bg-[#0e0e10] text-[#f4f1ea] border border-[#ffffff14] rounded px-1 py-1 w-full outline-none focus:border-[#dfbd6940]"
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingCell(null); }}
                              className="text-[9px] font-bold text-[#dfbd69] hover:text-[#f4f1ea] transition-colors pt-1"
                            >
                              DONE
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 group/cell">
                            <button
                              onClick={() => toggleShift(cast.id, date)}
                              className={`w-10 h-10 rounded-[8px] border transition-all flex items-center justify-center ${
                                hasShift
                                  ? 'bg-[#dfbd6914] border-[#dfbd6940] text-[#dfbd69] shadow-[inset_0_0_8px_rgba(223,189,105,0.1)]'
                                  : 'bg-transparent border-[#ffffff08] text-[#5a5650] hover:border-[#ffffff14]'
                              }`}
                            >
                              {hasShift ? <Check size={14} strokeWidth={3} /> : <span className="text-[14px] opacity-20 group-hover/cell:opacity-100">+</span>}
                            </button>
                            {hasShift && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingCell({ castId: cast.id, date }); }}
                                className="flex items-center gap-0.5 text-[9px] font-semibold text-[#8a8478] hover:text-[#dfbd69] transition-colors"
                              >
                                <Clock size={9} />
                                {shift?.start_time?.slice(0, 5)}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {(!casts || casts.length === 0) && (
                <tr>
                  <td colSpan={dates.length + 1} className="px-6 py-20 text-center">
                    <p className="text-[13px] text-[#5a5650] font-medium italic">キャストが登録されていません</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-[11px] font-medium text-[#5a5650] px-2 pt-1 uppercase tracking-widest">
        <span>
          {casts?.length ?? 0} Casts · {[...shiftMap.keys()].length} Shifts Total
        </span>
      </div>

      {/* Mobile Indicator */}
      <div className="md:hidden p-4 bg-[#d4785a08] border border-[#d4785a20] rounded-[12px]">
        <p className="text-[11px] text-[#d4785a] leading-relaxed flex items-center gap-2">
          <Clock size={12} />
          <span>タブレット・PCでの閲覧を推奨（グリッド表示用）</span>
        </p>
      </div>
    </div>
  )
}
