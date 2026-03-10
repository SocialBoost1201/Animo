'use client'

import { useState, useTransition, useCallback } from 'react'
import { saveSchedules } from '@/lib/actions/schedules'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Clock, Save, Loader2, Check } from 'lucide-react'

const TIME_OPTIONS = [
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', 'LAST'
]

const DAYS_SHORT = ['月', '火', '水', '木', '金', '土', '日']

type CastData = { id: string; stage_name: string; [key: string]: unknown }
type ShiftData = { cast_id: string; date?: string; work_date?: string; start_time: string | null; end_time: string | null; [key: string]: unknown }

type ShiftKey = string // `${castId}_${date}`
type ShiftMap = Map<ShiftKey, { start_time: string; end_time: string }>

export function ShiftManager({ initialData }: {
  initialData: { casts: CastData[]; shifts: ShiftData[]; dates: string[] }
}) {
  const { casts, shifts, dates } = initialData
  const [isPending, startTransition] = useTransition()

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
      // Build diff vs original shifts
      const originalMap = new Map<string, true>()
      ;(shifts || []).forEach((s) => {
        const d = s.work_date || s.date || ''
        originalMap.set(`${s.cast_id}_${d}`, true)
      })

      const updates: Record<string, unknown>[] = []

      // Insertions (new shifts)
      for (const [key, val] of shiftMap.entries()) {
        if (!originalMap.has(key)) {
          const [castId, date] = key.split('_')
          updates.push({ action: 'insert', cast_id: castId, date, ...val })
        }
      }

      // Deletions (removed shifts)
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
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Shifts</h1>
          <p className="text-sm text-gray-400 mt-1">
            セルをタップして出勤ON/OFF。時計アイコンで時間を調整。
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-[#171717] hover:bg-gold text-white px-5 py-2.5 text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-60"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? '保存中...' : '保存する'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gold/20 border border-gold/40" />
          <span>出勤あり</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span>未設定</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-xs text-gray-400 font-normal w-32 bg-gray-50/70">
                キャスト
              </th>
              {dates.map((date, i) => {
                const d = new Date(date)
                const isSat = d.getDay() === 6
                const isSun = d.getDay() === 0
                return (
                  <th key={date} className="px-2 py-3 text-center bg-gray-50/70 border-l border-gray-50">
                    <p className={`text-[10px] font-bold tracking-widest ${isSat ? 'text-blue-500' : isSun ? 'text-red-500' : 'text-gray-500'}`}>
                      {DAYS_SHORT[i]}
                    </p>
                    <p className="text-sm font-serif text-[#171717] mt-0.5">{d.getDate()}</p>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {casts?.map((cast) => (
              <tr key={cast.id} className="hover:bg-gray-50/40 transition-colors">
                {/* Cast Name */}
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-[#171717] truncate max-w-[120px]">
                    {cast.stage_name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {dates.filter(d => shiftMap.has(`${cast.id}_${d}`)).length}日出勤
                  </p>
                </td>
                {/* Date Cells */}
                {dates.map((date) => {
                  const key = `${cast.id}_${date}`
                  const hasShift = shiftMap.has(key)
                  const shift = shiftMap.get(key)
                  const isEditing = editingCell?.castId === cast.id && editingCell?.date === date

                  return (
                    <td key={date} className="px-2 py-2 border-l border-gray-50 text-center align-middle">
                      {isEditing && hasShift ? (
                        /* Time Picker Popup */
                        <div className="flex flex-col gap-1 items-center">
                          <select
                            value={shift?.start_time}
                            onChange={e => updateTime(cast.id, date, 'start_time', e.target.value)}
                            className="text-[10px] border border-gray-200 rounded px-1 py-0.5 w-20 text-center"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={shift?.end_time}
                            onChange={e => updateTime(cast.id, date, 'end_time', e.target.value)}
                            className="text-[10px] border border-gray-200 rounded px-1 py-0.5 w-20 text-center"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="text-[10px] text-gold font-bold flex items-center gap-1"
                          >
                            <Check size={10} /> 完了
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {/* Toggle button */}
                          <button
                            onClick={() => toggleShift(cast.id, date)}
                            className={`w-9 h-9 rounded-md transition-all duration-200 flex items-center justify-center text-[10px] font-bold ${
                              hasShift
                                ? 'bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25'
                                : 'bg-gray-50 border border-gray-200 text-gray-300 hover:border-gray-300'
                            }`}
                          >
                            {hasShift ? <Check size={14} strokeWidth={3} /> : <span className="text-base">+</span>}
                          </button>
                          {/* Time display + edit button */}
                          {hasShift && (
                            <button
                              onClick={() => setEditingCell({ castId: cast.id, date })}
                              className="flex items-center gap-0.5 text-[9px] text-gray-400 hover:text-gold transition-colors"
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
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                  キャストが登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
        <span>
          {casts?.length ?? 0}名 / 週合計{' '}
          {[...shiftMap.keys()].length}枠登録済み
        </span>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-1.5 text-gold hover:text-gold/80 font-bold transition-colors"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          保存
        </button>
      </div>
    </div>
  )
}
