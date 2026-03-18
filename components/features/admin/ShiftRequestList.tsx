'use client';

import React, { useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const TABS = [
    { label: '未承認 (Pending)', value: 'pending' },
    { label: '承認済 (Approved)', value: 'approved' },
    { label: 'すべて (All)', value: 'all' },
  ];

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const result = await approveShiftSubmission(id);
    if (result.success) {
      toast.success('シフトを承認し、公開設定に反映しました。');
      router.refresh();
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
      toast.success('提出を却下しました。');
      router.refresh();
    } else {
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

      {initialSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-500">
          該当するシフト提出はありません。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialSubmissions.map((sub: Submission) => {
            const shifts = sub.shifts_data;
            const dates = Object.keys(shifts).sort();
            const submittedAt = new Date(sub.submitted_at);

            return (
              <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/admin/casts`} className="font-serif text-lg font-bold text-[#171717] hover:text-gold transition-colors">
                      {sub.casts?.stage_name}
                    </Link>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                      sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    対象週: {sub.target_week_monday.replace(/-/g, '/')}〜
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    提出: {submittedAt.toLocaleDateString('ja-JP')} {submittedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="p-5 flex-1 bg-gray-50/50">
                  <div className="space-y-2">
                    {dates.map((dateStr) => {
                      const d = new Date(dateStr);
                      const dayStr = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
                      const shift = shifts[dateStr];
                      const isWork = shift.type === 'work';

                      return (
                        <div key={dateStr} className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-serif">
                            {d.getMonth()+1}/{d.getDate()} ({dayStr})
                          </span>
                          {isWork ? (
                            <span className="font-bold text-[#171717]">
                              {shift.start} - {shift.end}
                            </span>
                          ) : (
                            <span className="text-gray-400">休み</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {sub.status === 'pending' && (
                  <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {isProcessing === sub.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '却下する'}
                    </button>
                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="flex-1 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-gold text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isProcessing === sub.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '承認して公開'}
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
