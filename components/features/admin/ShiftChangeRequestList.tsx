'use client';

import React, { useEffect, useState } from 'react';
import { approveShiftChangeRequest, rejectShiftChangeRequest, ShiftChangeRequestWithCast } from '@/lib/actions/admin-change-requests';
import { toast } from 'sonner';
import { Check, X, Loader2, CalendarDays, ArrowRight, Ban } from 'lucide-react';

export function ShiftChangeRequestList({ requests }: { requests: ShiftChangeRequestWithCast[] }) {
  const [requestItems, setRequestItems] = useState(requests);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setRequestItems(requests);
  }, [requests]);

  const handleApprove = async (id: string, stageName: string, dateStr: string) => {
    const previousRequests = requestItems;
    setIsProcessing(id);
    setRequestItems((current) => current.filter((request) => request.id !== id));
    const { success, error } = await approveShiftChangeRequest(id);

    if (success) {
      toast.success(`${stageName} の ${dateStr} の変更申請を承認しました`);
    } else {
      setRequestItems(previousRequests);
      toast.error(`承認に失敗しました: ${error}`);
    }

    setIsProcessing(null);
  };

  const handleReject = async (id: string, stageName: string, dateStr: string) => {
    if (!confirm('この変更申請を却下しますか？')) return;
    const previousRequests = requestItems;
    setIsProcessing(id);
    setRequestItems((current) => current.filter((request) => request.id !== id));
    const { success, error } = await rejectShiftChangeRequest(id);

    if (success) {
      toast.success(`${stageName} の ${dateStr} の変更申請を却下しました`);
    } else {
      setRequestItems(previousRequests);
      toast.error(`却下に失敗しました: ${error}`);
    }

    setIsProcessing(null);
  };

  if (requestItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#60a5fa33] bg-[#08090c] py-16 text-center shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#60a5fa14] text-[#60a5fa]">
          <Check className="h-5 w-5" />
        </div>
        <p className="text-[13px] font-bold text-[#6f7480]">該当する変更申請はありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requestItems.map((req) => {
        const dateStr = req.target_date;
        const d = dateStr ? new Date(dateStr) : null;
        const dateLabel = d
          ? `${d.getMonth() + 1}/${d.getDate()} (${['日','月','火','水','木','金','土'][d.getDay()]})`
          : '–';
        const isCancel = req.action_type === 'cancel';
        const newTimeLabel = `${req.new_start_time?.slice(0, 5) ?? '–'} 〜 ${req.new_end_time?.slice(0, 5) ?? '–'}`;

        return (
          <div
            key={req.id}
            className="flex flex-col gap-4 rounded-[20px] border border-[#60a5fa33] bg-[linear-gradient(180deg,rgba(96,165,250,0.08),rgba(255,255,255,0.01)),#08090c] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.42)] transition-all hover:border-[#60a5fa66] sm:flex-row sm:items-center"
          >
            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#60a5fa14] text-[#60a5fa]">
                  <CalendarDays className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#f7f4ed]">{req.casts?.stage_name}</span>
                  <div className="mt-0.5 text-[10px] text-[#6b7280]">{dateLabel}</div>
                </div>
                {isCancel ? (
                  <span className="ml-auto rounded-full border border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.1)] px-2.5 py-1 text-[10px] font-bold text-[#e06a6a]">
                    キャンセル申請
                  </span>
                ) : (
                  <span className="ml-auto rounded-full border border-[#60a5fa33] bg-[#60a5fa14] px-2.5 py-1 text-[10px] font-bold text-[#60a5fa]">
                    時間変更申請
                  </span>
                )}
              </div>

              {!isCancel && (
                <div className="flex items-center gap-2 rounded-[16px] border border-white/8 bg-[#11131a] px-4 py-3 text-[12px]">
                  <span className="text-[#6b7280]">変更後</span>
                  <ArrowRight className="h-3 w-3 text-[#60a5fa]" />
                  <span className="font-bold text-[#f7f4ed]">{newTimeLabel}</span>
                </div>
              )}

              {isCancel && (
                <div className="flex items-center gap-2 rounded-[16px] border border-white/8 bg-[#11131a] px-4 py-3 text-[12px] text-[#6b7280]">
                  <Ban className="h-3.5 w-3.5 text-[#e06a6a]" />
                  {dateLabel} の出勤をキャンセルする申請
                </div>
              )}

              <p className="text-[11px] text-[#6b7280]">申請日時: {new Date(req.created_at).toLocaleString('ja-JP')}</p>
            </div>

            {/* Actions */}
            {req.status === 'pending' && (
              <div className="flex gap-2 sm:flex-col sm:gap-2">
                <button
                  onClick={() => handleReject(req.id, req.casts?.stage_name ?? '', dateLabel)}
                  disabled={isProcessing === req.id}
                  className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[16px] border border-white/10 px-4 text-[12px] font-bold text-[#8a8478] transition-all hover:border-[rgba(224,106,106,0.3)] hover:bg-[rgba(224,106,106,0.08)] hover:text-[#e06a6a] disabled:opacity-50 sm:flex-none sm:px-5"
                >
                  {isProcessing === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><X className="h-3.5 w-3.5" /> 却下</>}
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.casts?.stage_name ?? '', dateLabel)}
                  disabled={isProcessing === req.id}
                  className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[16px] bg-linear-to-r from-[#60a5fa] to-[#1d4ed8] px-4 text-[12px] font-bold text-white shadow-lg shadow-blue-500/10 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 sm:flex-none sm:px-5"
                >
                  {isProcessing === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> 承認</>}
                </button>
              </div>
            )}

            {req.status !== 'pending' && (
              <div className={`shrink-0 rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wider ${
                req.status === 'approved'
                  ? 'border-[rgba(51,179,107,0.2)] bg-[rgba(51,179,107,0.1)] text-[#33b36b]'
                  : 'border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.1)] text-[#e06a6a]'
              }`}>
                {req.status === 'approved' ? '承認済' : '却下済'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
