'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendShiftRemindEmail } from '@/lib/actions/admin-shifts';
import { toast } from 'sonner';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type CastStatus = {
  cast: { id: string; stage_name: string; auth_user_id: string | null };
  hasAuthIndex: boolean;
  status: string;
};

export function UnsubmittedCastsList({ statuses, targetWeekMonday }: { statuses: CastStatus[], targetWeekMonday: string }) {
  const unsubmitted = statuses.filter(s => s.status === 'unsubmitted' || s.status === 'rejected');

  return (
    <div className="bg-black/94 rounded-[18px] border border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] overflow-hidden font-sans">
      <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center sm:items-start flex-col sm:flex-row gap-4">
        <div>
          <h2 className="font-bold text-[#f4f1ea] flex items-center gap-2 tracking-tight">
            <AlertCircle className="w-4 h-4 text-gold" />
            未提出キャスト一覧
          </h2>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-[11px] text-[#8a8478] font-medium flex items-center gap-1.5">
              対象週: <span className="text-gold/80">{targetWeekMonday.replace(/-/g, '/')}〜</span>
            </p>
            <p className="text-[10px] text-[#5a5650] italic">※毎週木・金曜日に自動で督促メールが送信されます</p>
          </div>
        </div>
        <div className="text-[10px] font-bold bg-white/5 text-[#8a8478] px-4 py-1.5 rounded-full border border-white/10 tracking-[1px] uppercase">
          全 {statuses.length} 名 / 未提出 {unsubmitted.length} 名
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {unsubmitted.length === 0 ? (
          <div className="p-10 text-center text-[#5a5650] text-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <span className="font-medium">全員提出済みです</span>
          </div>
        ) : (
          unsubmitted.map(s => (
            <div key={s.cast.id} className="flex justify-between items-center p-4 px-6 hover:bg-white/2 transition-colors group">
              <span className="font-bold text-[#f4f1ea] group-hover:text-white transition-colors tracking-tight">{s.cast.stage_name}</span>
              
              {!s.hasAuthIndex && (
                 <span className="text-[10px] text-[#5a5650] border border-white/10 bg-white/5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                   No Account
                 </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
