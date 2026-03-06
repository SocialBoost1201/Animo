'use client'

import { useState } from 'react'
import { updateShifts } from '@/lib/actions/shifts'
import { Button } from '@/components/ui/Button'
import { Check, Loader2, Plus, Trash2 } from 'lucide-react'

const DAYS = ['月', '火', '水', '木', '金', '土', '日']

const TIME_OPTIONS = [
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', 'LAST'
]

type ShiftEntry = {
  cast_id: string
  date: string
  start_time: string
  end_time: string
  isNew?: boolean
}

export function ShiftManager({ initialData }: { initialData: any }) {
  const { casts, shifts, dates } = initialData
  
  // Build initial entries from DB shifts
  const [entries, setEntries] = useState<ShiftEntry[]>(() => {
    return (shifts || []).map((s: any) => ({
      cast_id: s.cast_id,
      date: s.date,
      start_time: s.start_time || '20:00',
      end_time: s.end_time || 'LAST',
    }))
  })

  const [isPending, setIsPending] = useState(false)
  
  // Track which date is selected for adding new entries (mobile-friendly)
  const [selectedDate, setSelectedDate] = useState<string>(dates[0])

  // Add a new entry
  const addEntry = () => {
    if (!casts || casts.length === 0) return
    setEntries(prev => [...prev, {
      cast_id: casts[0].id,
      date: selectedDate,
      start_time: '20:00',
      end_time: 'LAST',
      isNew: true,
    }])
  }

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof ShiftEntry, value: string) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  // Compute updates for save
  const getUpdates = () => {
    const updates: any[] = []
    const originalKeys = new Set(
      (shifts || []).map((s: any) => `${s.cast_id}_${s.date}`)
    )
    const currentKeys = new Set(
      entries.map(e => `${e.cast_id}_${e.date}`)
    )

    // Inserts: in current but not in original
    entries.forEach(e => {
      const key = `${e.cast_id}_${e.date}`
      if (!originalKeys.has(key)) {
        updates.push({
          action: 'insert',
          cast_id: e.cast_id,
          date: e.date,
          start_time: e.start_time,
          end_time: e.end_time,
        })
      }
    })

    // Deletes: in original but not in current
    ;(shifts || []).forEach((s: any) => {
      const key = `${s.cast_id}_${s.date}`
      if (!currentKeys.has(key)) {
        updates.push({
          action: 'delete',
          cast_id: s.cast_id,
          date: s.date,
        })
      }
    })

    return updates
  }

  async function handleSave() {
    setIsPending(true)
    const updates = getUpdates()

    if (updates.length === 0) {
      alert('変更されたシフトはありません')
      setIsPending(false)
      return
    }

    const formData = new FormData()
    formData.append('updates', JSON.stringify(updates))

    const result = await updateShifts(formData)
    if (result.error) {
      alert(result.error)
    } else {
      alert('シフトを更新しました')
    }

    setIsPending(false)
  }

  const hasChanges = getUpdates().length > 0

  // Group entries by date for display
  const entriesByDate = (date: string) => entries.filter(e => e.date === date)

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-sm">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase">Week Schedule</h2>
          <p className="text-xs text-gray-500 mt-1">{dates[0]} 〜 {dates[6]}</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isPending}
          className="text-sm font-bold tracking-widest px-6 w-full sm:w-auto"
        >
          {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          変更を保存
        </Button>
      </div>

      {/* Date Tabs (モバイルフレンドリー) */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {dates.map((date: string, i: number) => {
          const count = entriesByDate(date).length
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-1 min-w-[60px] py-3 px-2 text-center text-xs tracking-widest transition-colors border-b-2 ${
                selectedDate === date
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/5 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="font-bold">{DAYS[i]}</div>
              <div className="text-[10px] mt-0.5">{date.slice(5).replace('-', '/')}</div>
              {count > 0 && (
                <div className="text-[9px] mt-1 text-[var(--color-gold)]">{count}名</div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Entries */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            {selectedDate} のシフト
          </h3>
          <button
            onClick={addEntry}
            className="flex items-center gap-1 text-xs text-[var(--color-gold)] hover:underline font-bold tracking-widest"
          >
            <Plus className="w-3 h-3" /> 追加
          </button>
        </div>

        {entriesByDate(selectedDate).length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            この日のシフトはまだ登録されていません。
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              if (entry.date !== selectedDate) return null
              return (
                <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border border-gray-100 rounded-sm bg-gray-50/50">
                  {/* キャスト選択 */}
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Cast</label>
                    <select
                      value={entry.cast_id}
                      onChange={e => updateEntry(index, 'cast_id', e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors bg-white"
                    >
                      {casts?.map((cast: any) => (
                        <option key={cast.id} value={cast.id}>{cast.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 出勤時間 */}
                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">From</label>
                    <select
                      value={entry.start_time}
                      onChange={e => updateEntry(index, 'start_time', e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors bg-white"
                    >
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 退勤時間 */}
                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">To</label>
                    <select
                      value={entry.end_time}
                      onChange={e => updateEntry(index, 'end_time', e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors bg-white"
                    >
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 削除 */}
                  <div className="flex items-end">
                    <button
                      onClick={() => removeEntry(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
