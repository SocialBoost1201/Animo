'use client'

import { useState, useTransition } from 'react'
import { X, Send, Copy, Check } from 'lucide-react'
import { sendShiftRequestNotification } from '@/lib/actions/notifications'
import { MINIMUM_REQUIRED_CASTS } from '@/lib/config/shift-staffing'

type ModalCast = { id: string; stage_name: string }

type Props = {
  date: string                    // YYYY-MM-DD
  scheduledCount: number          // casts already on the schedule for this date
  allCasts: ModalCast[]           // all active casts
  scheduledCastIds: Set<string>   // cast IDs already scheduled for this date
  onClose: () => void
}

function formatDateLabel(date: string): string {
  const [, month, day] = date.split('-')
  return `${parseInt(month)}月${parseInt(day)}日`
}

function buildDefaultMessage(date: string): string {
  const [, month, day] = date.split('-')
  return `${parseInt(month)}月${parseInt(day)}日の出勤キャストが不足しているため、出勤可能な方を探しています。\n出勤可能な場合は、アニモ公式LINEへ返信をお願いします。`
}

export function AttendanceRequestModal({
  date,
  scheduledCount,
  allCasts,
  scheduledCastIds,
  onClose,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    new Set(allCasts.filter(c => !scheduledCastIds.has(c.id)).map(c => c.id))
  )
  const [message, setMessage] = useState(() => buildDefaultMessage(date))
  const [result, setResult] = useState<{ copyMessage: string; requestedCount: number; skippedCount: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const shortage = Math.max(0, MINIMUM_REQUIRED_CASTS - scheduledCount)
  const dateLabel = formatDateLabel(date)

  function toggleCast(id: string): void {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll(): void {
    setSelectedIds(new Set(allCasts.map(c => c.id)))
  }

  function selectNoneScheduled(): void {
    setSelectedIds(new Set(allCasts.filter(c => !scheduledCastIds.has(c.id)).map(c => c.id)))
  }

  function handleCopy(): void {
    if (!result) return
    navigator.clipboard.writeText(result.copyMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSubmit(): void {
    if (selectedIds.size === 0) return
    startTransition(async () => {
      const res = await sendShiftRequestNotification({
        businessDate: date,
        castIds: [...selectedIds],
        message,
      })
      if (res.success) {
        setResult({ copyMessage: res.copyMessage, requestedCount: res.requestedCount, skippedCount: res.skippedCount })
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0f0f12] border border-white/10 rounded-[16px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div>
            <p className="text-[14px] font-bold text-[#f4f1ea] tracking-tight">
              {dateLabel} — 出勤依頼
            </p>
            <p className="text-[11px] text-[#8a8478] mt-1">
              出勤予定 {scheduledCount}名 / 最低 {MINIMUM_REQUIRED_CASTS}名 / 不足 {shortage}名
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5a5650] hover:text-[#f4f1ea] transition-colors mt-0.5"
            aria-label="閉じる"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {result ? (
            /* ── Success state ── */
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#72b89420] border border-[#72b89440] flex items-center justify-center">
                  <Check size={11} className="text-[#72b894]" />
                </div>
                <p className="text-[12px] text-[#72b894] font-bold">
                  {result.requestedCount}名に依頼ログを記録しました
                  {result.skippedCount > 0 && (
                    <span className="text-[#8a8478] font-normal ml-1">（{result.skippedCount}名は重複のためスキップ）</span>
                  )}
                </p>
              </div>

              <p className="text-[11px] text-[#5a5650]">
                このメッセージをコピーしてLINEから送信してください。
              </p>

              <div className="bg-black/40 border border-white/8 rounded-[10px] p-4">
                <p className="text-[12px] text-[#f4f1ea] whitespace-pre-wrap leading-relaxed">
                  {result.copyMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-[12px] font-bold border transition-all ${
                  copied
                    ? 'bg-[#72b89420] border-[#72b89440] text-[#72b894]'
                    : 'bg-white/5 border-white/10 text-[#f4f1ea] hover:bg-white/8'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'コピーしました' : 'メッセージをコピー'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-[11px] text-[#5a5650] hover:text-[#8a8478] transition-colors py-1"
              >
                閉じる
              </button>
            </div>
          ) : (
            /* ── Selection state ── */
            <div className="p-6 space-y-5">
              {/* Cast selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-[#8a8478] uppercase tracking-wider">
                    依頼対象キャスト
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectNoneScheduled}
                      className="text-[10px] text-[#5a5650] hover:text-[#dfbd69] transition-colors"
                    >
                      未予定のみ
                    </button>
                    <span className="text-[#3a3830]">·</span>
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-[10px] text-[#5a5650] hover:text-[#dfbd69] transition-colors"
                    >
                      全員
                    </button>
                  </div>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-0.5 pr-0.5">
                  {allCasts.map(cast => {
                    const isScheduled = scheduledCastIds.has(cast.id)
                    const isSelected = selectedIds.has(cast.id)
                    return (
                      <label
                        key={cast.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[8px] cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-[#dfbd6910] border border-[#dfbd6920]'
                            : 'border border-transparent hover:bg-white/3'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCast(cast.id)}
                          className="w-4 h-4 rounded accent-[#dfbd69] shrink-0"
                        />
                        <span className="text-[13px] text-[#f4f1ea] flex-1 truncate">
                          {cast.stage_name}
                        </span>
                        {isScheduled && (
                          <span className="text-[9px] text-[#8a8478] bg-white/5 px-1.5 py-0.5 rounded-full shrink-0">
                            出勤予定
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>

                <p className="text-[10px] text-[#5a5650] mt-1.5">{selectedIds.size}名選択中</p>
              </div>

              {/* Message */}
              <div>
                <p className="text-[11px] font-bold text-[#8a8478] uppercase tracking-wider mb-2">
                  メッセージ
                </p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[8px] px-3 py-2.5 text-[12px] text-[#f4f1ea] resize-none focus:outline-none focus:border-[#dfbd6940] transition-colors leading-relaxed"
                />
                <p className="text-[10px] text-[#5a5650] mt-1">
                  ※ LINE送信はしません。ログ記録後にコピーして手動送信してください。
                </p>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || selectedIds.size === 0}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[linear-gradient(90deg,rgba(223,189,105,0.12)_0%,rgba(146,111,52,0.12)_100%)] border border-[#dfbd6940] text-[#dfbd69] text-[12px] font-bold rounded-[8px] hover:bg-[linear-gradient(90deg,rgba(223,189,105,0.22)_0%,rgba(146,111,52,0.22)_100%)] transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Send size={13} />
                {isPending ? '記録中...' : `${selectedIds.size}名に依頼ログを記録する`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
