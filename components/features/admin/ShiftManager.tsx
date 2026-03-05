'use client'

import { useState, useMemo } from 'react'
import { updateShifts } from '@/lib/actions/shifts'
import { Button } from '@/components/ui/Button'
import { Check, Loader2 } from 'lucide-react'

// 日付のマスタ（月〜日）
const DAYS = ['月', '火', '水', '木', '金', '土', '日']

export function ShiftManager({ initialData }: { initialData: any }) {
  const { casts, shifts, dates } = initialData
  
  // localShiftState: { [castId_date]: true/false }
  const [localState, setLocalState] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {}
    shifts?.forEach((s: any) => {
      state[`${s.cast_id}_${s.date}`] = true
    })
    return state
  })
  
  const [isPending, setIsPending] = useState(false)

  // 変更分のみを抽出する（保存時）
  const getUpdates = () => {
    const updates = []
    
    casts?.forEach((cast: any) => {
      dates.forEach((date: string) => {
        const key = `${cast.id}_${date}`
        const isCurrentlyChecked = localState[key] || false
        const wasOriginallyChecked = shifts?.some((s: any) => s.cast_id === cast.id && s.date === date)
        
        if (isCurrentlyChecked && !wasOriginallyChecked) {
          updates.push({ action: 'insert', cast_id: cast.id, date })
        } else if (!isCurrentlyChecked && wasOriginallyChecked) {
          updates.push({ action: 'delete', cast_id: cast.id, date })
        }
      })
    })
    
    return updates
  }

  const toggleShift = (castId: string, date: string) => {
    setLocalState(prev => ({
      ...prev,
      [`${castId}_${date}`]: !prev[`${castId}_${date}`]
    }))
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

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase">Week Schedule</h2>
          <p className="text-xs text-gray-500 mt-1">{dates[0]} 〜 {dates[6]}</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isPending}
          className="text-sm font-bold tracking-widest px-6"
        >
          {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          変更を保存
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 border-r border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-widest w-48">Cast</th>
              {dates.map((date: string, i: number) => (
                <th key={date} className="p-4 text-center font-bold text-xs text-gray-500 tracking-widest min-w-[80px]">
                  <div className="mb-1">{DAYS[i]}</div>
                  <div className="font-normal text-[10px]">{date.slice(5).replace('-', '/')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {casts?.map((cast: any) => (
              <tr key={cast.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 border-r border-gray-100">
                  <span className="font-bold text-[#171717] text-sm">{cast.name}</span>
                </td>
                {dates.map((date: string) => {
                  const isChecked = localState[`${cast.id}_${date}`] || false
                  return (
                    <td key={`${cast.id}_${date}`} className="p-0 text-center relative hover:bg-gray-50 transition-colors">
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleShift(cast.id, date)}
                          className="w-5 h-5 accent-[var(--color-gold)] rounded bg-gray-100 border-gray-300"
                        />
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
            
            {(!casts || casts.length === 0) && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-gray-500">
                  公開中のキャストがいません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
