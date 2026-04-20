'use client'

import { useState } from 'react'
import { submitCheckin } from '@/lib/actions/today'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

type ExistingCheckin = {
  has_change: boolean
  change_note?: string
  is_absent: boolean
  memo?: string
  approval_status?: 'pending' | 'approved' | 'rejected'
} | null

export function CheckinForm({
  existing,
  isSubmissionClosed,
  deadlineLabel,
}: {
  existing: ExistingCheckin
  isSubmissionClosed: boolean
  deadlineLabel: string
}) {
  const [isAbsent, setIsAbsent] = useState(existing?.is_absent ?? false)
  const [hasChange, setHasChange] = useState(existing?.has_change ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!existing)
  const [approvalStatus, setApprovalStatus] = useState(existing?.approval_status ?? null)

  const inputClass = 'h-[42px] w-full rounded-[12px] border border-[#ffffff0a] bg-black/40 px-3 text-[13px] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.4)] focus:outline-none focus:ring-1 focus:ring-[#c9a76a] transition-all'

  const currentType = isAbsent ? 'off' : hasChange ? 'accompany' : 'scheduled'
  const getAttendanceButtonClass = (type: 'scheduled' | 'accompany' | 'off') => {
    const base = 'flex-1 rounded-[14px] border-[1.2px] px-3 py-4 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-none'
    if (currentType !== type) {
      return `${base} border-white/10 bg-white/[0.03] text-white/40 hover:text-white/60`
    }
    if (type === 'scheduled') {
      return `${base} border-white text-white shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_0_18px_rgba(255,255,255,0.14)]`
    }
    if (type === 'accompany') {
      return `${base} border-[#C9A45C] bg-[#C9A45C]/10 text-[#E7C988] shadow-[0_0_18px_rgba(201,164,92,0.22)]`
    }
    return `${base} border-[#B3261E] bg-[#B3261E]/10 text-[#FF8A80] shadow-[0_0_18px_rgba(179,38,30,0.18)]`
  }

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
      toast.success(result.message || '本日の確認を送信しました')
      if ('warning' in result && result.warning) {
        toast.error(result.warning)
      }
      setSubmitted(true)
      setApprovalStatus('pending')
    }
    setIsSubmitting(false)
  }

  if (submitted && approvalStatus === 'approved' && !isAbsent && !hasChange) {
    return (
      <div className="rounded-[18px] border border-[rgba(51,179,107,0.27)] bg-[rgba(51,179,107,0.12)] p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#33b36b]">本日の確認承認済み</p>
          <p className="text-xs text-[#33b36b] mt-0.5">変更・欠勤なし</p>
        </div>
        {!isSubmissionClosed ? (
          <button onClick={() => setSubmitted(false)} className="ml-auto text-xs text-gray-400 hover:text-gold">修正</button>
        ) : null}
      </div>
    )
  }

  const statusLabel = approvalStatus === 'pending'
    ? '店長承認待ち'
    : approvalStatus === 'rejected'
      ? '差し戻し'
      : approvalStatus === 'approved'
        ? '承認済み'
        : '未提出'

  return (
    <div className="rounded-[18px] border border-[#ffffff0a] bg-[#10141d] px-[18px] py-[18px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#6b7280]">01 — 本日の出勤確認</p>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
          approvalStatus === 'approved'
            ? 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]'
            : approvalStatus === 'rejected'
              ? 'bg-[rgba(224,106,106,0.12)] text-[#e06a6a]'
              : approvalStatus === 'pending'
                ? 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]'
                : 'bg-[rgba(255,255,255,0.08)] text-[#6b7280]'
        }`}>
          {statusLabel}
        </span>
      </div>

      {isSubmissionClosed ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          本日の提出締切 {deadlineLabel} を過ぎたため、現在は編集できません。
        </p>
      ) : approvalStatus === 'pending' ? (
        <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          提出済みです。店長の承認後に管理画面の本日の営業状況へ反映されます。
        </p>
      ) : approvalStatus === 'rejected' ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          差し戻しされています。内容を見直して再提出してください。
        </p>
      ) : null}

      <div className="mb-4 text-[12px] text-[#6b7280]">予定出勤 21:00〜</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => { setIsAbsent(false); setHasChange(false) }}
            className={getAttendanceButtonClass('scheduled')}
          >
            <div className="text-[14px] font-bold leading-[21px]">予定通り</div>
            <div className="mt-1 text-[10px] opacity-60">出勤</div>
          </button>
          <button
            type="button"
            onClick={() => { setIsAbsent(false); setHasChange(true) }}
            className={getAttendanceButtonClass('accompany')}
          >
            <div className="text-[14px] font-bold leading-[21px]">同伴</div>
            <div className="mt-1 text-[10px] opacity-60">出勤</div>
          </button>
          <button
            type="button"
            onClick={() => { setIsAbsent(true); setHasChange(false) }}
            className={getAttendanceButtonClass('off')}
          >
            <div className="text-[14px] font-bold leading-[21px]">休み</div>
          </button>
        </div>

        {hasChange && !isAbsent && (
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">変更内容</label>
            <input
              name="change_note"
              type="text"
              defaultValue={existing?.change_note || ''}
              placeholder="例: 22:00 → 23:00"
              disabled={isSubmissionClosed || approvalStatus === 'approved'}
              className={inputClass}
            />
          </div>
        )}

        {!isAbsent && (
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">メモ（任意）</label>
            <input
              name="memo"
              type="text"
              defaultValue={existing?.memo || ''}
              placeholder="同伴あり、など"
              disabled={isSubmissionClosed || approvalStatus === 'approved'}
              className={inputClass}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isSubmissionClosed || approvalStatus === 'approved'}
          className="h-[52px] w-full rounded-[14px] bg-[rgba(255,255,255,0.05)] text-[14px] font-bold text-[#a9afbc] transition-all disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : (submitted ? '提出内容を更新する' : '確認を送信する')}
        </button>
      </form>
    </div>
  )
}
