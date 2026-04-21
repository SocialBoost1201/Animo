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
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-[#ffffff0a] bg-[#10141d] shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-[#ffffff0a] bg-[#131720] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#f7f4ed]">
            <AlertCircle className="h-4 w-4 text-[#e06a6a]" />
            未提出キャスト一覧
          </h2>
          <div className="mt-2 flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b7280]">
              対象週: <span className="text-[#c9a76a]">{targetWeekMonday.replace(/-/g, '/')}〜</span>
            </p>
            <p className="text-[10px] text-[#6b7280]">※毎週木・金曜日に自動で督促メールが送信されます</p>
          </div>
        </div>
        <div className="rounded-full border border-[#ffffff0a] bg-[#1a1f29] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[1px] text-[#8a8478]">
          全 {statuses.length} 名 / 未提出 <span className="text-[#e06a6a]">{unsubmitted.length} 名</span>
        </div>
      </div>

      <div className="divide-y divide-[#ffffff0a] bg-[#10141d]">
        {unsubmitted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center text-[13px] text-[#6b7280]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(51,179,107,0.2)] bg-[rgba(51,179,107,0.1)]">
              <CheckCircle2 className="h-6 w-6 text-[#33b36b]" />
            </div>
            <span className="font-bold">全員提出済みです</span>
          </div>
        ) : (
          unsubmitted.map(s => (
            <div key={s.cast.id} className="group flex items-center justify-between p-4 px-6 transition-colors hover:bg-[#131720]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f29] text-[12px] font-bold text-[#f7f4ed] transition-colors group-hover:text-[#c9a76a]">
                  {s.cast.stage_name.charAt(0)}
                </div>
                <span className="text-[14px] font-bold text-[#f7f4ed] transition-colors group-hover:text-white">
                  {s.cast.stage_name}
                </span>
              </div>
              
              {!s.hasAuthIndex && (
                 <span className="rounded-full border border-[#ffffff0a] bg-[#1a1f29] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6b7280]">
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
