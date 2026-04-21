'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveShiftSubmission, rejectShiftSubmission } from '@/lib/actions/admin-shifts';
import { toast } from 'sonner';
import { Clock, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AdminTabs } from '@/components/ui/AdminTabs';

type Submission = {
  id: string;
  cast_id: string;
  target_week_monday: string;
  status: string;
  shifts_data: Record<string, { type: string, start?: string, end?: string }>;
  submitted_at: string;
  casts: { stage_name: string; slug: string };
};

export function ShiftRequestList({ initialSubmissions, currentStatus }: { initialSubmissions: Submission[], currentStatus: string }) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  const TABS = [
    { label: '未承認 (Pending)', value: 'pending' },
    { label: '承認済 (Approved)', value: 'approved' },
    { label: 'すべて (All)', value: 'all' },
  ];

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
    <div className="space-y-6">
      <AdminTabs
        options={TABS}
        value={currentStatus}
        onChange={(val) => router.push(`/admin/shift-requests?status=${val}`)}
      />

      {submissions.length === 0 ? (
        <div className="bg-black/95 rounded-lg border border-white/10 p-12 text-center text-[#5a5650]">
          該当するシフト提出はありません。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub: Submission) => {
            const shifts = sub.shifts_data;
            const dates = Object.keys(shifts).sort();
            const submittedAt = new Date(sub.submitted_at);

            return (
              <div key={sub.id} className="bg-black/95 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col group transition-all hover:border-gold/30">
                <div className="p-5 border-b border-white/5 bg-white/2">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/admin/human-resources`} className="font-serif text-lg font-bold text-[#f4f1ea] hover:text-gold transition-colors tracking-tight">
                      {sub.casts?.stage_name}
                    </Link>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-wider ${
                      sub.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      sub.status === 'pending' ? 'bg-gold/10 text-gold border border-gold/20' :
                      'bg-white/5 text-[#8a8478] border border-white/10'
                    }`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-[#8a8478] flex items-center gap-2 mt-2 font-medium">
                    <CalendarDays className="w-3.5 h-3.5 text-[#5a5650]" />
                    対象週: {sub.target_week_monday.replace(/-/g, '/')}〜
                  </div>
                  <div className="text-[11px] text-[#5a5650] flex items-center gap-2 mt-1 italic">
                    <Clock className="w-3.5 h-3.5" />
                    送信: {submittedAt.toLocaleDateString('ja-JP')} {submittedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="p-5 flex-1 bg-white/1">
                  <div className="space-y-2.5">
                    {dates.map((dateStr) => {
                      const d = new Date(dateStr);
                      const dayStr = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
                      const shift = shifts[dateStr];
                      const isWork = shift.type === 'work';

                      return (
                        <div key={dateStr} className="flex justify-between items-center text-xs">
                          <span className={`${d.getDay() === 0 ? 'text-red-400' : 'text-[#8a8478]'} font-serif font-medium`}>
                            {d.getMonth()+1}/{d.getDate()} ({dayStr})
                          </span>
                          {isWork ? (
                            <span className="font-bold text-[#f4f1ea] bg-white/5 px-2 py-0.5 rounded-sm">
                              {shift.start} - {shift.end}
                            </span>
                          ) : (
                            <span className="text-[#5a5650] italic px-2 py-0.5">休み</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {sub.status === 'pending' && (
                  <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3">
                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex-1 py-2.5 rounded-sm border border-white/10 text-[#8a8478] text-[11px] font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all disabled:opacity-50"
                    >
                      {isProcessing === sub.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : '却下'}
                    </button>
                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex-1 py-2.5 rounded-sm bg-gold hover:bg-gold/90 text-black text-[11px] font-bold transition-all shadow-lg shadow-gold/10 active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing === sub.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-black" /> : '承認して公開'}
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
