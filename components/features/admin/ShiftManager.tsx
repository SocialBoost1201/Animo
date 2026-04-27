'use client'

import { useState, useTransition, useCallback } from 'react'
import { saveSchedules } from '@/lib/actions/schedules'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Clock, Save, Loader2, Check, CalendarDays, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type DailyStaffing } from '@/lib/config/shift-staffing'
import { AttendanceRequestModal } from '@/components/features/admin/AttendanceRequestModal'

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
  initialData: { casts: CastData[]; shifts: ShiftData[]; dates: string[]; dailyStaffing?: Record<string, DailyStaffing> }
  viewType?: 'week' | 'month'
}) {
  const { casts, shifts, dates, dailyStaffing } = initialData
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
  const [selectedRequestDate, setSelectedRequestDate] = useState<string | null>(null)

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
          <h1 className="text-2xl font-serif tracking-widest text-[#f4f1ea]">Shifts</h1>
          <p className="text-sm text-[#8a8478] mt-1">
            セル・日付をタップして出勤ON/OFF切替。時間は時計アイコンで調整。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
            <button
              onClick={() => router.push('?view=week')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm ${
                viewType === 'week' ? 'bg-white/10 shadow-lg text-[#f4f1ea]' : 'text-[#8a8478] hover:text-[#f4f1ea]'
              }`}
            >
              <List size={13} /> 1週間
            </button>
            <button
              onClick={() => router.push('?view=month')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm ${
                viewType === 'month' ? 'bg-white/10 shadow-lg text-[#f4f1ea]' : 'text-[#8a8478] hover:text-[#f4f1ea]'
              }`}
            >
              <CalendarDays size={13} /> 1ヶ月
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 px-5 py-2 text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-60 rounded-sm shadow-xl"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isPending ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-[#5a5650]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gold/20 border border-gold/40" />
          <span>出勤あり</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
          <span>未設定</span>
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden md:block bg-black/95 border border-white/10 shadow-2xl rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-xs text-[#8a8478] font-normal w-32 bg-white/5">
                キャスト
              </th>
              {dates.map((date, i) => {
                const d = new Date(date)
                const isSat = d.getDay() === 6
                const isSun = d.getDay() === 0
                const staffing = dailyStaffing?.[date]
                const staffingLevel = staffing?.level
                const staffingCount = staffing?.scheduledWorkingCount
                return (
                  <th key={date} className="px-2 py-3 text-center bg-white/5 border-l border-white/5">
                    <p className={`text-xs font-bold tracking-widest ${isSat ? 'text-blue-400' : isSun ? 'text-red-400' : 'text-[#8a8478]'}`}>
                      {DAYS_SHORT[i]}
                    </p>
                    <p className="text-sm font-serif text-[#f4f1ea] mt-0.5">{d.getDate()}</p>
                    {staffing && (
                      <div className="mt-1 flex flex-col items-center gap-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          staffingLevel === 'critical' ? 'text-[#e08080] bg-[#e0808015]' :
                          staffingLevel === 'low' ? 'text-[#dfbd69] bg-[#dfbd6915]' :
                          'text-[#72b894] bg-[#72b89415]'
                        }`}>
                          {staffingCount}名
                        </span>
                        {(staffingLevel === 'low' || staffingLevel === 'critical') && (
                          <button
                            type="button"
                            onClick={() => setSelectedRequestDate(date)}
                            className="text-[9px] font-bold text-[#dfbd69] border border-[#dfbd6940] rounded-full px-1.5 py-0.5 hover:bg-[#dfbd6915] transition-colors"
                          >
                            依頼
                          </button>
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {casts?.map((cast) => (
              <tr key={cast.id} className="hover:bg-gray-50/40 transition-colors">
                {/* Cast Name */}
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-[#f4f1ea] truncate max-w-[120px]">
                    {cast.stage_name}
                  </p>
                  <p className="text-xs text-[#5a5650] mt-0.5">
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
                    <td key={date} className="px-2 py-2 border-l border-white/5 text-center align-middle">
                      {isEditing && hasShift ? (
                        /* Time Picker Popup */
                        <div className="flex flex-col gap-1 items-center">
                          <select
                            value={shift?.start_time}
                            onChange={e => updateTime(cast.id, date, 'start_time', e.target.value)}
                            className="text-xs border border-white/10 rounded px-1 py-0.5 w-20 text-center bg-black text-[#f4f1ea]"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={shift?.end_time}
                            onChange={e => updateTime(cast.id, date, 'end_time', e.target.value)}
                            className="text-xs border border-white/10 rounded px-1 py-0.5 w-20 text-center bg-black text-[#f4f1ea]"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="text-xs text-gold font-bold flex items-center gap-1"
                          >
                            <Check size={10} /> 完了
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {/* Toggle button */}
                          <button
                            onClick={() => toggleShift(cast.id, date)}
                            className={`w-9 h-9 rounded-md transition-all duration-200 flex items-center justify-center text-xs font-bold ${
                              hasShift
                                ? 'bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25'
                                : 'bg-white/5 border border-white/10 text-[#5a5650] hover:border-white/20'
                            }`}
                          >
                            {hasShift ? <Check size={14} strokeWidth={3} /> : <span className="text-base">+</span>}
                          </button>
                          {/* Time display + edit button */}
                          {hasShift && (
                            <button
                              onClick={() => setEditingCell({ castId: cast.id, date })}
                              className="flex items-center gap-0.5 text-xs text-[#5a5650] hover:text-gold transition-colors"
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

      {/* Mobile staffing summary */}
      {dailyStaffing && (
        <div className="md:hidden overflow-x-auto pb-1">
          <div className="flex gap-1.5 min-w-max py-1">
            {dates.map(date => {
              const staffing = dailyStaffing[date]
              if (!staffing) return null
              const { scheduledWorkingCount: count, level } = staffing
              const d = new Date(date)
              const dDay = d.getDay() === 0 ? 6 : d.getDay() - 1
              const dLabel = DAYS_SHORT[dDay] ?? ''
              return (
                <div
                  key={date}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-[8px] border min-w-[44px] ${
                    level === 'critical' ? 'border-[#e08080]/40 bg-[#e0808010]' :
                    level === 'low' ? 'border-[#dfbd69]/40 bg-[#dfbd6910]' :
                    'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-[9px] text-[#8a8478]">{d.getDate()}({dLabel})</span>
                  <span className={`text-[11px] font-bold ${
                    level === 'critical' ? 'text-[#e08080]' :
                    level === 'low' ? 'text-[#dfbd69]' : 'text-[#72b894]'
                  }`}>{count}</span>
                  {(level === 'low' || level === 'critical') && (
                    <button
                      type="button"
                      onClick={() => setSelectedRequestDate(date)}
                      className="text-[8px] font-bold text-[#dfbd69] border border-[#dfbd6940] rounded-full px-1.5 py-0.5 hover:bg-[#dfbd6915] transition-colors"
                    >
                      依頼
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile Card UI */}
      <div className="md:hidden space-y-4">
        {(!casts || casts.length === 0) ? (
          <div className="bg-white dark:bg-[#141414] border dark:border-white/5 text-center py-10 text-sm text-gray-400 dark:text-gray-500">キャストが登録されていません</div>
        ) : casts.map((cast) => {
          const shiftCount = dates.filter(d => shiftMap.has(`${cast.id}_${d}`)).length;
          return (
            <div key={cast.id} className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 shadow-sm rounded-sm overflow-hidden">
              <div className="bg-gray-50/50 dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="font-bold text-[#171717] dark:text-gray-100 text-sm tracking-widest">{cast.stage_name}</span>
                <span className="text-xs bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 font-bold">
                  {shiftCount}枠 / {dates.length}日
                </span>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  {dates.map((date) => {
                     const key = `${cast.id}_${date}`;
                     const hasShift = shiftMap.has(key);
                     const shift = shiftMap.get(key);
                     const isEditing = editingCell?.castId === cast.id && editingCell?.date === date;
                     const dObj = new Date(date);
                     const dDay = dObj.getDay() === 0 ? 6 : dObj.getDay() - 1; // Mon=0, Sun=6
                     const dLabel = DAYS_SHORT[dDay] || '';
                     const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;

                     // スマホ用は月次モードだと枠が多すぎるため、コンパクトなバッジ形式にする
                     return (
                       <div key={date} className="relative flex flex-col items-center">
                         {isEditing && hasShift ? (
                           <div className="absolute top-0 left-0 bg-black/95 border border-white/10 shadow-xl p-2 rounded-sm z-50 flex flex-col gap-1.5 min-w-section-mobile">
                             <p className="text-xs text-[#8a8478] font-bold border-b border-white/10 pb-1 text-center">{dObj.getDate()}日({dLabel})</p>
                             <select
                               value={shift?.start_time}
                               onChange={e => updateTime(cast.id, date, 'start_time', e.target.value)}
                               className="text-xs border border-white/10 rounded px-1 py-1 w-full text-center bg-black text-[#f4f1ea]"
                             >
                               {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             <select
                               value={shift?.end_time}
                               onChange={e => updateTime(cast.id, date, 'end_time', e.target.value)}
                               className="text-xs border border-white/10 rounded px-1 py-1 w-full text-center bg-black text-[#f4f1ea]"
                             >
                               {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             <button
                               onClick={() => setEditingCell(null)}
                               className="w-full bg-gold text-black text-xs font-bold py-1 rounded-sm mt-1"
                             >
                               完了
                             </button>
                           </div>
                         ) : null}

                         <div className="flex flex-col items-center gap-1 group">
                            {/* Toggle Body */}
                            <button
                              onClick={() => toggleShift(cast.id, date)}
                              className={`w-11 h-11 rounded border transition-colors flex flex-col items-center justify-center ${
                                hasShift 
                                  ? 'bg-gold/10 border-gold text-gold' 
                                  : 'bg-white/5 border-white/10 text-[#5a5650]'
                              }`}
                            >
                              <span className={`text-xs font-bold mb-0.5 ${!hasShift && isWeekend ? (dObj.getDay()===0?'text-red-400':'text-blue-400') : ''}`}>
                                {dObj.getDate()}{dLabel}
                              </span>
                              {hasShift ? <Check size={12} strokeWidth={3} /> : <span className="text-gray-300 text-xs">+</span>}
                            </button>
                            {/* Time Display */}
                            <div className="h-4">
                              {hasShift && (
                                <button
                                  onClick={() => setEditingCell({ castId: cast.id, date })}
                                  className="flex items-center gap-0.5 text-xs text-[#5a5650] px-1 hover:text-gold"
                                >
                                  <Clock size={8} />{shift?.start_time?.slice(0, 5)}
                                </button>
                              )}
                            </div>
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Request Modal */}
      {selectedRequestDate && (
        <AttendanceRequestModal
          date={selectedRequestDate}
          scheduledCount={dailyStaffing?.[selectedRequestDate]?.scheduledWorkingCount ?? 0}
          allCasts={casts.map(c => ({ id: c.id, stage_name: c.stage_name }))}
          scheduledCastIds={new Set(casts.filter(c => shiftMap.has(`${c.id}_${selectedRequestDate}`)).map(c => c.id))}
          onClose={() => setSelectedRequestDate(null)}
        />
      )}

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-[#8a8478] pt-2">
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
