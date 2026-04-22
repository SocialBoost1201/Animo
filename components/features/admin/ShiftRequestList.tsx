'use client';

import React, { useEffect, useState } from 'react';
import { approveShiftSubmission, rejectShiftSubmission } from '@/lib/actions/admin-shifts';
import { toast } from 'sonner';
import { CalendarDays, Loader2 } from 'lucide-react';
import { D } from '@/lib/design/attendance-approval';

type Submission = {
  id: string;
  cast_id: string;
  target_week_monday: string;
  status: string;
  shifts_data: Record<string, { type: string; start?: string; end?: string }>;
  submitted_at: string;
  casts: { stage_name: string; slug: string };
};

export function ShiftRequestList({
  initialSubmissions,
  currentStatus,
}: {
  initialSubmissions: Submission[];
  currentStatus: string;
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const result = await approveShiftSubmission(id);
    if (result.success) {
      setSubmissions((cur) =>
        currentStatus === 'pending'
          ? cur.filter((s) => s.id !== id)
          : cur.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
      );
      toast.success('シフトを承認し、公開設定に反映しました。');
    } else {
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('この提出を却下しますか？')) return;
    setIsProcessing(id);
    const result = await rejectShiftSubmission(id);
    if (result.success) {
      setSubmissions((cur) =>
        currentStatus === 'pending'
          ? cur.filter((s) => s.id !== id)
          : cur.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
      );
      toast.success('提出を却下しました。');
    } else {
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  if (submissions.length === 0) {
    return (
      <div
        className="p-12 text-center text-white/40"
        style={{
          borderRadius: D.radius.card,
          border: `1.5px solid ${D.border.gold}`,
          background: D.gradients.cardBg,
        }}
      >
        該当するシフト提出はありません。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {submissions.map((sub) => {
        const shifts = sub.shifts_data;
        const dates = Object.keys(shifts).sort();
        const submittedAt = new Date(sub.submitted_at);
        const isPending = sub.status === 'pending';
        const isApproved = sub.status === 'approved';
        const processing = isProcessing === sub.id;

        const badgeGradient = isPending
          ? D.gradients.statusPending
          : isApproved
          ? D.gradients.statusApproved
          : null;
        const badgeLabel = isPending ? 'PENDING' : isApproved ? 'APPROVED' : sub.status.toUpperCase();

        return (
          <div
            key={sub.id}
            className="flex flex-col overflow-hidden"
            style={{
              borderRadius: D.radius.card,
              border: `2px solid ${D.border.gold}`,
              background: D.gradients.cardBg,
            }}
          >
            {/* ── Header: name + status badge ── */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                {/* Cast name */}
                <span
                  className="text-white leading-tight"
                  style={{
                    fontFamily: D.font.mincho,
                    fontSize: '28px',
                    fontWeight: 600,
                    letterSpacing: '1.28px',
                  }}
                >
                  {sub.casts?.stage_name}
                </span>

                {/* Status badge */}
                {badgeGradient && (
                  <span
                    className="shrink-0 inline-flex items-center justify-center text-white font-bold tracking-wider"
                    style={{
                      background: badgeGradient,
                      borderRadius: D.radius.tab,
                      border: `1.5px solid ${D.border.lightGold}`,
                      minWidth: '120px',
                      height: '42px',
                      padding: '0 14px',
                      fontSize: '12px',
                    }}
                  >
                    {badgeLabel}
                  </span>
                )}
              </div>

              {/* Meta: target week + submitted time */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} style={{ color: D.border.lightGold, flexShrink: 0 }} />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: D.font.mincho,
                      fontSize: '18px',
                      fontWeight: 400,
                    }}
                  >
                    対象週: {sub.target_week_monday.replace(/-/g, '/')}〜
                  </span>
                </div>
                <div
                  className="text-white/40 text-[13px]"
                  style={{ paddingLeft: '24px' }}
                >
                  送信:{' '}
                  {submittedAt.toLocaleDateString('ja-JP')}{' '}
                  {submittedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* ── Shift rows ── */}
            <div className="flex-1 px-5 pb-2">
              {dates.map((dateStr) => {
                const d = new Date(dateStr);
                const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
                const dayStr = dayLabels[d.getDay()];
                const shift = shifts[dateStr];
                const isWork = shift.type === 'work';
                const isSun = d.getDay() === 0;

                return (
                  <div
                    key={dateStr}
                    className="flex items-center justify-between"
                    style={{
                      height: '56px',
                      borderTop: `1px solid ${D.border.gold}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: D.font.mincho,
                        fontSize: '15px',
                        color: isSun ? '#f87171' : D.text.white,
                      }}
                    >
                      {d.getMonth() + 1}/{d.getDate()} ({dayStr})
                    </span>
                    {isWork ? (
                      <span
                        className="font-medium text-white text-[15px]"
                        style={{ fontFamily: D.font.sans }}
                      >
                        {shift.start} - {shift.end ?? 'LAST'}
                      </span>
                    ) : (
                      <span className="text-white/30 text-[14px] italic">休み</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Action buttons ── */}
            {isPending && (
              <div
                className="flex gap-3 items-center justify-center p-4"
                style={{ borderTop: `1px solid ${D.border.gold}` }}
              >
                {/* 却下 */}
                <button
                  onClick={() => handleReject(sub.id)}
                  disabled={isProcessing !== null}
                  className="inline-flex items-center justify-center font-bold transition-all active:scale-[0.97] disabled:opacity-50"
                  style={{
                    width: '180px',
                    height: '69px',
                    borderRadius: D.radius.button,
                    background: D.gradients.rejectSilver,
                    color: '#1a1a1a',
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      却下中...
                    </>
                  ) : (
                    '却下'
                  )}
                </button>

                {/* 承認して公開 */}
                <button
                  onClick={() => handleApprove(sub.id)}
                  disabled={isProcessing !== null}
                  className="inline-flex items-center justify-center font-bold transition-all active:scale-[0.97] disabled:opacity-50"
                  style={{
                    width: '180px',
                    height: '69px',
                    borderRadius: D.radius.button,
                    background: D.gradients.ctaGold,
                    color: '#1a1a1a',
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-black" />
                      承認中...
                    </>
                  ) : (
                    '承認して公開'
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
