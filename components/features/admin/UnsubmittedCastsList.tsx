'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type CastStatus = {
  cast: { id: string; stage_name: string; auth_user_id: string | null };
  hasAuthIndex: boolean;
  status: string;
};

export function UnsubmittedCastsList({ statuses, targetWeekMonday }: { statuses: CastStatus[], targetWeekMonday: string }) {
  const unsubmitted = statuses.filter(s => s.status === 'unsubmitted' || s.status === 'rejected');

  return (
    <div className="bg-[#17181c] rounded-[18px] border-[0.56px] border-[#ffffff0f] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 h-[56px] border-b border-[#ffffff08]">
        <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#d4785a1a] rounded-[6px]">
          <AlertCircle size={14} className="text-[#d4785a]" strokeWidth={2.5} />
        </div>
        <p className="text-[12px] font-semibold text-[#f4f1ea]">未提出キャスト一覧</p>
        <span className="ml-auto text-[9px] font-bold bg-[#ffffff08] text-[#8a8478] px-2 py-0.5 rounded-full">
          {unsubmitted.length} 名
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="px-1">
          <p className="text-[10px] text-[#5a5650] font-bold tracking-[0.05em] uppercase mb-1">対象週: {targetWeekMonday.replace(/-/g, '/')}〜</p>
          <p className="text-[10px] text-[#5a5650] leading-relaxed">※毎週木・金曜日に自動で督促メールが送信されます</p>
        </div>

        <div className="space-y-1">
          {unsubmitted.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <CheckCircle2 size={24} className="text-[#72b894] opacity-40" />
              <p className="text-[11px] text-[#5a5650] italic">全員提出済みです</p>
            </div>
          ) : (
            unsubmitted.map(s => (
              <div key={s.cast.id} className="flex justify-between items-center h-[38px] px-3 bg-[#ffffff03] hover:bg-[#ffffff06] border border-[#ffffff05] rounded-[10px] transition-colors group">
                <span className="text-[12px] font-medium text-[#c7c0b2] group-hover:text-[#f4f1ea] transition-colors">{s.cast.stage_name}</span>
                
                {!s.hasAuthIndex && (
                   <span className="text-[9px] font-bold text-[#5a5650] border border-[#ffffff0a] px-1.5 py-0.5 rounded-[6px]">
                     アカウント未登録
                   </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
