'use client'

import { useState } from 'react'
import { submitCheckin } from '@/lib/actions/today'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle } from 'lucide-react'

type ExistingCheckin = {
  has_change: boolean
  change_note?: string
  is_absent: boolean
  memo?: string
} | null

export function CheckinForm({ existing }: { existing: ExistingCheckin }) {
  const [isAbsent, setIsAbsent] = useState(existing?.is_absent ?? false)
  const [hasChange, setHasChange] = useState(existing?.has_change ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!existing)

  const inputClass = 'w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const fd = new FormData(e.currentTarget)
    fd.set('has_change', hasChange ? 'true' : 'false')
    fd.set('is_absent', isAbsent ? 'true' : 'false')
    const result = await submitCheckin(fd)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('本日の確認を送信しました')
      setSubmitted(true)
    }
    setIsSubmitting(false)
  }

  if (submitted && !isAbsent && !hasChange) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-700">本日の確認済み</p>
          <p className="text-xs text-green-500 mt-0.5">変更・欠勤なし</p>
        </div>
        <button onClick={() => setSubmitted(false)} className="ml-auto text-xs text-gray-400 hover:text-gold">修正</button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">本日の確認</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 欠勤 */}
        <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isAbsent ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}>
          <input
            type="checkbox"
            checked={isAbsent}
            onChange={e => setIsAbsent(e.target.checked)}
            className="w-5 h-5 accent-red-500"
          />
          <div>
            <span className="text-sm font-bold text-[#171717]">本日は欠勤</span>
            <p className="text-xs text-gray-400 mt-0.5">出勤できない場合にチェック</p>
          </div>
          {isAbsent && <AlertCircle size={16} className="text-red-400 ml-auto" />}
        </label>

        {/* 変更あり */}
        {!isAbsent && (
          <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${hasChange ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
            <input
              type="checkbox"
              checked={hasChange}
              onChange={e => setHasChange(e.target.checked)}
              className="w-5 h-5 accent-orange-500"
            />
            <div>
              <span className="text-sm font-bold text-[#171717]">出勤変更あり</span>
              <p className="text-xs text-gray-400 mt-0.5">時間変更・遅刻・早退など</p>
            </div>
          </label>
        )}

        {/* 変更内容 */}
        {hasChange && !isAbsent && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">変更内容</label>
            <input
              name="change_note"
              type="text"
              defaultValue={existing?.change_note || ''}
              placeholder="例: 22:00 → 23:00"
              className={inputClass}
            />
          </div>
        )}

        {/* メモ */}
        {!isAbsent && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">メモ（任意）</label>
            <input
              name="memo"
              type="text"
              defaultValue={existing?.memo || ''}
              placeholder="同伴あり、など"
              className={inputClass}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#171717] hover:bg-gold text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : (submitted ? '更新する' : '確認を送信する')}
        </button>
      </form>
    </div>
  )
}
