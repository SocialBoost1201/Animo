'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { approveShiftChangeRequest, rejectShiftChangeRequest, ShiftChangeRequestWithCast } from '@/lib/actions/admin-change-requests'
import { toast } from 'sonner'
import { Check, X, Loader2, CalendarDays, Edit2, Ban } from 'lucide-react'

export function ShiftChangeRequestList({ requests }: { requests: ShiftChangeRequestWithCast[] }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleApprove = async (id: string, stageName: string, dateStr: string) => {
    setIsProcessing(id)
    const { success, error } = await approveShiftChangeRequest(id)
    if (success) {
      toast.success(`${stageName} の ${dateStr} の変更申請を承認しました`)
      router.refresh()
    } else {
      toast.error(`承認に失敗しました: ${error}`)
    }
    setIsProcessing(null)
  }

  const handleReject = async (id: string, stageName: string, dateStr: string) => {
    if (!window.confirm(`${stageName} の ${dateStr} の変更申請を却下しますか？`)) return
    setIsProcessing(id)
    const { success, error } = await rejectShiftChangeRequest(id)
    if (success) {
      toast.success(`${stageName} の変更申請を却下しました`)
      router.refresh()
    } else {
      toast.error(`却下に失敗しました: ${error}`)
    }
    setIsProcessing(null)
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-10 text-center">
        <p className="text-[13px] font-bold text-[#5a5650]">承認待ちの変更申請はありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const isActioning = isProcessing === req.id
        const submitDate = new Date(req.created_at).toLocaleString('ja-JP', {
          month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        const targetDate = req.target_date.replace(/-/g, '/')
        const isCancel = req.action_type === 'cancel'

        return (
          <div
            key={req.id}
            className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden flex flex-col sm:flex-row items-stretch transition-all hover:border-[#ffffff1a]"
          >

            {/* 左側: キャスト情報・申請種別 */}
            <div className={`p-5 border-b sm:border-b-0 sm:border-r sm:w-60 flex flex-col justify-between ${
              isCancel ? 'border-[#d4785a20] bg-[#d4785a06]' : 'border-[#dfbd6920] bg-[#dfbd6906]'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                    isCancel
                      ? 'bg-[#d4785a14] text-[#d4785a] border border-[#d4785a30]'
                      : 'bg-[#dfbd6914] text-[#dfbd69] border border-[#dfbd6930]'
                  }`}>
                    {isCancel ? '休み申請' : '時間変更'}
                  </span>
                </div>
                <h3 className="font-bold text-[14px] text-[#f4f1ea]">{req.casts.stage_name}</h3>
                <p className="text-[11px] text-[#5a5650] mt-1">申請: {submitDate}</p>
              </div>
            </div>

            {/* 右側: 変更内容とアクション */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-[44px] h-[44px] bg-[#ffffff05] rounded-[10px] border border-[#ffffff0f] flex flex-col items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-[#5a5650] mb-0.5" />
                  <span className="text-[10px] font-bold text-[#f4f1ea]">{req.target_date.slice(5).replace('-', '/')}</span>
                </div>

                <div className="pt-1">
                  {isCancel ? (
                    <div className="flex items-center gap-2 text-[#d4785a] font-bold text-[13px]">
                      <Ban className="w-4 h-4" />
                      シフトの取り消し（休み）を希望
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#f4f1ea] font-bold text-[13px]">
                      <Edit2 className="w-4 h-4 text-[#dfbd69]" />
                      変更後: {req.new_start_time?.slice(0, 5)} 〜 {req.new_end_time?.slice(0, 5)}
                    </div>
                  )}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-[#ffffff08]">
                <button
                  onClick={() => handleReject(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="h-[35px] px-4 rounded-[8px] text-[11px] font-bold text-[#5a5650] hover:text-[#d4785a] hover:bg-[#d4785a0a] border border-[#ffffff0f] hover:border-[#d4785a20] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  却下
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="h-[35px] px-5 rounded-[8px] text-[11px] font-bold text-[#0b0b0d] flex items-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                  style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
                >
                  {isActioning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  )}
                  {isCancel ? '取消を承認する' : '変更を承認する'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
