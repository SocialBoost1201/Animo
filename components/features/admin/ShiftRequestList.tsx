'use client';

import React, { useEffect, useState } from 'react';
import { approveShiftSubmission, rejectShiftSubmission } from '@/lib/actions/admin-shifts';
import { toast } from 'sonner';
import { CalendarDays, Clock, CheckCircle, XCircle, Loader2, User } from 'lucide-react';
import Link from 'next/link';

type Submission = {
  id: string;
  cast_id: string;
  target_week_monday: string;
  status: string;
  shifts_data: Record<string, { type: string, start?: string, end?: string }>;
  submitted_at: string;
  casts: { stage_name: string; slug: string };
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function ShiftRequestList({ initialSubmissions, currentStatus }: { initialSubmissions: Submission[], currentStatus: string }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  const handleApprove = async (id: string) => {
    const previousSubmissions = submissions;
    setIsProcessing(id);
    setSubmissions((current) => {
      if (currentStatus === 'pending') {
        return current.filter((submission) => submission.id !== id);
      }
      return current.map((submission) =>
        submission.id === id ? { ...submission, status: 'approved' } : submission
      );
    });
    const result = await approveShiftSubmission(id);
    if (result.success) {
      toast.success('シフトを承認し、公開設定に反映しました。');
    } else {
      setSubmissions(previousSubmissions);
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('この提出を却下しますか？')) return;
    const previousSubmissions = submissions;
    setIsProcessing(id);
    setSubmissions((current) => {
      if (currentStatus === 'pending') {
        return current.filter((submission) => submission.id !== id);
      }
      return current.map((submission) =>
        submission.id === id ? { ...submission, status: 'rejected' } : submission
      );
    });
    const result = await rejectShiftSubmission(id);
    if (result.success) {
      toast.success('提出を却下しました。');
    } else {
      setSubmissions(previousSubmissions);
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-5">
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#d6b56d26] bg-[#08090c] py-16 text-center shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#d6b56d14] text-[#d6b56d]">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="text-[13px] font-bold text-[#6f675a]">該当するシフト提出はありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {submissions.map((sub: Submission) => {
            const shifts = sub.shifts_data;
            const dates = Object.keys(shifts).sort();
            const submittedAt = new Date(sub.submitted_at);
            const workDays = dates.filter(d => shifts[d].type === 'work').length;

            const statusConfig = {
              approved: { label: '承認済', bg: 'bg-[rgba(51,179,107,0.12)]', text: 'text-[#33b36b]', border: 'border-[rgba(51,179,107,0.2)]' },
              pending:  { label: '未承認',  bg: 'bg-[rgba(201,167,106,0.12)]', text: 'text-[#c9a76a]', border: 'border-[rgba(201,167,106,0.2)]' },
              rejected: { label: '却下',   bg: 'bg-[rgba(224,106,106,0.12)]', text: 'text-[#e06a6a]', border: 'border-[rgba(224,106,106,0.2)]' },
            }[sub.status] ?? { label: sub.status, bg: 'bg-white/5', text: 'text-[#6b7280]', border: 'border-white/10' };

            return (
              <div
                key={sub.id}
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#d6b56d26] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01)),#08090c] shadow-[0_20px_60px_rgba(0,0,0,0.42)] transition-all hover:border-[#d6b56d66]"
              >
                {/* Header */}
                <div className="border-b border-[#d6b56d1f] bg-[#11131a] px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[rgba(201,167,106,0.1)] text-[#c9a76a]">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <Link
                          href="/admin/human-resources"
                          className="block text-[15px] font-bold text-[#f7f4ed] transition-colors hover:text-[#c9a76a]"
                        >
                          {sub.casts?.stage_name}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#6b7280]">
                          <CalendarDays className="h-3 w-3" />
                          {sub.target_week_monday.replace(/-/g, '/')}〜
                        </div>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-[#6b7280]">
                    <Clock className="h-3 w-3" />
                    送信: {submittedAt.toLocaleDateString('ja-JP')} {submittedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    <span className="ml-auto font-bold text-[#c9a76a]">出勤 {workDays}日</span>
                  </div>
                </div>

                {/* Shift Grid */}
                <div className="flex-1 bg-black/20 px-5 py-4">
                  <div className="space-y-2">
                    {dates.map((dateStr) => {
                      const d = new Date(dateStr);
                      const dayStr = WEEKDAYS[d.getDay()];
                      const shift = shifts[dateStr];
                      const isWork = shift.type === 'work';
                      const isSun = d.getDay() === 0;

                      return (
                        <div key={dateStr} className="flex items-center justify-between rounded-[12px] border border-white/5 bg-white/[0.025] px-3 py-2 text-[12px]">
                          <span className={`w-[72px] font-medium ${isSun ? 'text-[#e06a6a]' : 'text-[#6b7280]'}`}>
                            {d.getMonth() + 1}/{d.getDate()} ({dayStr})
                          </span>
                          {isWork ? (
                            <span className="rounded-[6px] bg-[rgba(201,167,106,0.1)] px-2.5 py-1 font-bold text-[#f7f4ed]">
                              {shift.start} – {shift.end}
                            </span>
                          ) : (
                            <span className="text-[#6b7280]">休み</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                {sub.status === 'pending' && (
                  <div className="flex gap-3 border-t border-[#d6b56d1f] bg-black/45 px-5 py-4">
                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[16px] border border-white/10 text-[12px] font-bold text-[#8a8478] transition-all hover:border-[rgba(224,106,106,0.3)] hover:bg-[rgba(224,106,106,0.08)] hover:text-[#e06a6a] disabled:opacity-50"
                    >
                      {isProcessing === sub.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><XCircle className="h-3.5 w-3.5" /> 却下</>
                      }
                    </button>
                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[16px] bg-linear-to-r from-[#f3d27a] to-[#a9782d] text-[12px] font-bold text-[#0b0d12] shadow-lg shadow-gold/10 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing === sub.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><CheckCircle className="h-3.5 w-3.5" /> 承認して公開</>
                      }
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
