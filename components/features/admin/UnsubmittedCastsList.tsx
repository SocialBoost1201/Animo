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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-[#171717] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            未提出キャスト一覧
          </h2>
          <p className="text-xs text-gray-500 mt-1">対象週: {targetWeekMonday.replace(/-/g, '/')}〜</p>
          <p className="text-[10px] text-gray-400 mt-0.5">※毎週木・金曜日に自動で督促メールが送信されます</p>
        </div>
        <div className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-gray-200">
          全 {statuses.length} 名中 / 未提出 {unsubmitted.length} 名
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {unsubmitted.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
            全員提出済みです
          </div>
        ) : (
          unsubmitted.map(s => (
            <div key={s.cast.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-[#171717]">{s.cast.stage_name}</span>
              
              {!s.hasAuthIndex && (
                 <span className="text-[10px] text-gray-400 border border-gray-100 bg-gray-50 px-2 py-1 rounded">
                   アカウント未登録
                 </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
