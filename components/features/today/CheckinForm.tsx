'use client'

import { useState } from 'react'
import { submitCheckin } from '@/lib/actions/today'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

type Status = 'work' | 'douhan' | 'absent'

type ExistingCheckin = {
  has_change: boolean
  change_note?: string
  is_absent: boolean
  memo?: string
  approval_status?: 'pending' | 'approved' | 'rejected'
} | null

type ExistingDouhanReservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  note?: string | null
} | null

function deriveInitialStatus(
  existing: ExistingCheckin,
  existingDouhan: ExistingDouhanReservation,
): Status {
  if (existingDouhan) return 'douhan'
  if (existing?.is_absent) return 'absent'
  return 'work'
}

export function CheckinForm({
  existing,
  existingDouhan,
  isSubmissionClosed,
  deadlineLabel,
}: {
  existing: ExistingCheckin
  existingDouhan?: ExistingDouhanReservation
  isSubmissionClosed: boolean
  deadlineLabel: string
}) {
  const [status, setStatus] = useState<Status>(() =>
    deriveInitialStatus(existing, existingDouhan ?? null)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!(existing || existingDouhan))
  const [approvalStatus, setApprovalStatus] = useState(
    existing?.approval_status ?? null
  )

  const inputClass =
    'h-[42px] w-full rounded-[12px] border border-white/8 bg-[#131720] px-3 text-[13px] text-[#f7f4ed] placeholder:text-[rgba(247,244,237,0.5)] focus:outline-hidden'

  const isLocked = isSubmissionClosed || approvalStatus === 'approved'

  async function handleAbsentClick(): Promise<void> {
    if (isLocked) return
    if (status !== 'absent') {
      const confirmed = window.confirm(
        '本日を欠勤として提出します。よろしいですか？'
      )
      if (!confirmed) return
    }
    setStatus('absent')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (isLocked) return

    if (status === 'douhan') {
      const guestName = (
        e.currentTarget.querySelector<HTMLInputElement>('[name="douhan_guest_name"]')?.value ?? ''
      ).trim()
      const visitTime =
        e.currentTarget.querySelector<HTMLInputElement>('[name="douhan_visit_time"]')?.value ?? ''
      if (!guestName || !visitTime) {
        toast.error('同伴のお客様名と時間を入力してください')
        return
      }
    }

    setIsSubmitting(true)
    const fd = new FormData(e.currentTarget)
    fd.set('status', status)
    fd.set('has_change', 'false')
    fd.set('is_absent', status === 'absent' ? 'true' : 'false')

    const result = await submitCheckin(fd)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.message ?? '本日の確認を送信しました')
      if ('warning' in result && result.warning) {
        toast.error(result.warning as string)
      }
      setSubmitted(true)
      setApprovalStatus('pending')
    }
    setIsSubmitting(false)
  }

  // ── Approved + no changes → compact green banner ──
  if (
    submitted &&
    approvalStatus === 'approved' &&
    status !== 'absent'
  ) {
    return (
      <div className="rounded-[18px] border border-[rgba(51,179,107,0.27)] bg-[rgba(51,179,107,0.12)] p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#33b36b]">本日の確認 承認済み</p>
          <p className="text-xs text-[#33b36b] mt-0.5">
            {status === 'douhan' ? '同伴あり出勤' : '予定通り出勤'}
          </p>
        </div>
        {!isSubmissionClosed ? (
          <button
            onClick={() => setSubmitted(false)}
            className="ml-auto text-xs text-gray-400 hover:text-gold"
          >
            修正
          </button>
        ) : null}
      </div>
    )
  }

  const statusLabel =
    approvalStatus === 'pending'
      ? '店長承認待ち'
      : approvalStatus === 'rejected'
        ? '差し戻し'
        : approvalStatus === 'approved'
          ? '承認済み'
          : '未提出'

  // ── Card style helpers ──
  function cardClass(s: Status): string {
    const base = 'flex-1 rounded-[14px] border-[1.5px] px-3 py-4 text-center transition-all duration-200'
    if (status !== s) {
      return `${base} border-white/8 bg-[rgba(255,255,255,0.03)] text-[#6b7280]`
    }
    if (s === 'work') {
      return `${base} border-[#c9a76a]/60 bg-[rgba(201,167,106,0.12)] text-[#c9a76a] shadow-[0_0_16px_rgba(201,167,106,0.15)]`
    }
    if (s === 'douhan') {
      return `${base} border-[#dfbd69]/70 bg-[rgba(223,189,105,0.15)] text-[#dfbd69] shadow-[0_0_20px_rgba(223,189,105,0.2)]`
    }
    // absent
    return `${base} border-[rgba(224,106,106,0.4)] bg-[rgba(224,106,106,0.12)] text-[#e06a6a] shadow-[0_0_16px_rgba(224,106,106,0.15)]`
  }

  return (
    <div className="rounded-[18px] border border-white/8 bg-[#131720] px-[18px] py-[18px]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#6b7280]">
          01 — 本日の出勤確認
        </p>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            approvalStatus === 'approved'
              ? 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]'
              : approvalStatus === 'rejected'
                ? 'bg-[rgba(224,106,106,0.12)] text-[#e06a6a]'
                : approvalStatus === 'pending'
                  ? 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]'
                  : 'bg-[rgba(255,255,255,0.08)] text-[#6b7280]'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Status banners */}
      {isSubmissionClosed ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          本日の提出締切 {deadlineLabel} を過ぎたため、現在は編集できません。
        </p>
      ) : approvalStatus === 'pending' ? (
        <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          提出済みです。店長の承認後に管理画面へ反映されます。
        </p>
      ) : approvalStatus === 'rejected' ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          差し戻しされています。内容を見直して再提出してください。
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── 3-state selector ── */}
        <div className="grid grid-cols-3 gap-2">
          {/* 予定通り */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => setStatus('work')}
            className={cardClass('work')}
          >
            <div className="text-[14px] font-bold leading-[21px]">予定通り</div>
            <div className="mt-1 text-[10px] opacity-70">出勤</div>
          </button>

          {/* 同伴 */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => setStatus('douhan')}
            className={cardClass('douhan')}
          >
            <div className="text-[14px] font-bold leading-[21px]">同伴</div>
            <div className="mt-1 text-[10px] opacity-70">出勤</div>
          </button>

          {/* 休み */}
          <button
            type="button"
            disabled={isLocked}
            onClick={handleAbsentClick}
            className={cardClass('absent')}
          >
            <div className="text-[14px] font-bold leading-[21px]">休み</div>
            <div className="mt-1 text-[10px] opacity-70">欠勤</div>
          </button>
        </div>

        {/* ── 同伴フォーム（必須）── */}
        {status === 'douhan' && (
          <div className="rounded-[14px] border border-[#dfbd69]/20 bg-[rgba(223,189,105,0.06)] p-4 space-y-3">
            <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#dfbd69]/70 mb-1">
              同伴情報（必須）
            </p>
            <div>
              <label className="mb-1 block text-[11px] text-[#6b7280]">
                時間 <span className="text-[#dfbd69]">*</span>
              </label>
              <input
                name="douhan_visit_time"
                type="time"
                required={status === 'douhan'}
                defaultValue={existingDouhan?.visit_time?.slice(0, 5) ?? ''}
                disabled={isLocked}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#6b7280]">
                お客様名 <span className="text-[#dfbd69]">*</span>
              </label>
              <input
                name="douhan_guest_name"
                type="text"
                required={status === 'douhan'}
                defaultValue={existingDouhan?.guest_name ?? ''}
                placeholder="山田"
                disabled={isLocked}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-[#6b7280]">「様」はつけずに入力してください</p>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#6b7280]">人数</label>
              <input
                name="douhan_guest_count"
                type="number"
                min="1"
                inputMode="numeric"
                placeholder="2"
                defaultValue={existingDouhan?.guest_count ?? ''}
                disabled={isLocked}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#6b7280]">メモ（任意）</label>
              <input
                name="douhan_note"
                type="text"
                placeholder="テーブル、備考など"
                defaultValue={existingDouhan?.note ?? ''}
                disabled={isLocked}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ── メモ（予定通りのみ）── */}
        {status === 'work' && (
          <div>
            <label className="mb-1 block text-[11px] text-[#6b7280]">メモ（任意）</label>
            <input
              name="memo"
              type="text"
              defaultValue={existing?.memo ?? ''}
              placeholder="遅刻・早退など"
              disabled={isLocked}
              className={inputClass}
            />
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isSubmitting || isLocked}
          className="h-[52px] w-full rounded-[14px] bg-[rgba(255,255,255,0.05)] text-[14px] font-bold text-[#a9afbc] transition-all disabled:opacity-50 hover:bg-[rgba(255,255,255,0.08)]"
        >
          {isSubmitting
            ? '送信中...'
            : submitted
              ? '提出内容を更新する'
              : '確認を送信する'}
        </button>
      </form>
    </div>
  )
}
