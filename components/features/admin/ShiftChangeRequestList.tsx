'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveShiftChangeRequest, rejectShiftChangeRequest, ShiftChangeRequestWithCast } from '@/lib/actions/admin-change-requests';
import { toast } from 'sonner';
import { Check, X, Loader2, CalendarDays, Edit2, Ban } from 'lucide-react';

export function ShiftChangeRequestList({ requests }: { requests: ShiftChangeRequestWithCast[] }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleApprove = async (id: string, stageName: string, dateStr: string) => {
    setIsProcessing(id);
    const { success, error } = await approveShiftChangeRequest(id);
    
    if (success) {
      toast.success(`${stageName} の ${dateStr} の変更申請を承認しました`);
      router.refresh();
    } else {
      toast.error(`承認に失敗しました: ${error}`);
    }
    
    setIsProcessing(null);
  };

  const handleReject = async (id: string, stageName: string, dateStr: string) => {
    if (!window.confirm(`${stageName} の ${dateStr} の変更申請を却下しますか？`)) return;
    
    setIsProcessing(id);
    const { success, error } = await rejectShiftChangeRequest(id);
    
    if (success) {
      toast.success(`${stageName} の変更申請を却下しました`);
      router.refresh();
    } else {
      toast.error(`却下に失敗しました: ${error}`);
    }
    
    setIsProcessing(null);
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
        <p className="text-gray-500 font-bold">承認待ちの変更申請はありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const isActioning = isProcessing === req.id;
        const submitDate = new Date(req.created_at).toLocaleString('ja-JP', {
          month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const targetDate = req.target_date.replace(/-/g, '/');

        return (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch transition-all hover:border-gold/30 hover:shadow-md">
            
            {/* 左側: キャスト情報・申請種別 */}
            <div className={`p-5 border-b sm:border-b-0 sm:border-r border-gray-100 sm:w-64 flex flex-col justify-between ${
              req.action_type === 'cancel' ? 'bg-red-50/50' : 'bg-blue-50/50'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                    req.action_type === 'cancel' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {req.action_type === 'cancel' ? '休み(取消)申請' : '時間変更申請'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#171717]">{req.casts.stage_name}</h3>
                <p className="text-xs text-gray-400 mt-1">申請日時: {submitDate}</p>
              </div>
            </div>

            {/* 右側: 変更内容とアクション */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-gray-400 mb-0.5" />
                  <span className="text-xs font-bold text-[#171717]">{req.target_date.slice(5).replace('-','/')}</span>
                </div>
                
                <div className="pt-1">
                  {req.action_type === 'cancel' ? (
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <Ban className="w-4 h-4" />
                      シフトの取り消し（休み）を希望
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#171717] font-bold">
                      <Edit2 className="w-4 h-4 text-gold" />
                      変更後: {req.new_start_time?.slice(0,5)} 〜 {req.new_end_time?.slice(0,5)}
                    </div>
                  )}
                </div>
              </div>

              {/* 承認ボタン群 */}
              <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleReject(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  却下
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-[#171717] text-white hover:bg-gold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isActioning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {req.action_type === 'cancel' ? '取消を承認する' : '変更を承認する'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
