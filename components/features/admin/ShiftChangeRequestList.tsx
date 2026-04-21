'use client';

import React, { useEffect, useState } from 'react';
import { approveShiftChangeRequest, rejectShiftChangeRequest, ShiftChangeRequestWithCast } from '@/lib/actions/admin-change-requests';
import { toast } from 'sonner';
import { Check, X, Loader2, CalendarDays, Edit2, Ban } from 'lucide-react';

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
    if (!window.confirm(`${stageName} の ${dateStr} の変更申請を却下しますか？`)) return;
    
    const previousRequests = requestItems;
    setIsProcessing(id);
    setRequestItems((current) => current.filter((request) => request.id !== id));
    const { success, error } = await rejectShiftChangeRequest(id);
    
    if (success) {
      toast.success(`${stageName} の変更申請を却下しました`);
    } else {
      setRequestItems(previousRequests);
      toast.error(`却下に失敗しました: ${error}`);
    }
    
    setIsProcessing(null);
  };

  if (!requestItems || requestItems.length === 0) {
    return (
      <div className="bg-black/95 rounded-2xl border border-white/10 p-8 text-center shadow-sm">
        <p className="text-[#8a8478] font-bold">承認待ちの変更申請はありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requestItems.map((req) => {
        const isActioning = isProcessing === req.id;
        const submitDate = new Date(req.created_at).toLocaleString('ja-JP', {
          month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const targetDate = req.target_date.replace(/-/g, '/');

        return (
          <div key={req.id} className="bg-black/80 rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch transition-all hover:border-gold/30 hover:shadow-gold/5">
            
            {/* 左側: キャスト情報・申請種別 */}
            <div className={`p-5 border-b sm:border-b-0 sm:border-r border-white/10 sm:w-64 flex flex-col justify-between ${
              req.action_type === 'cancel' ? 'bg-red-500/10' : 'bg-blue-500/10'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider border ${
                    req.action_type === 'cancel' 
                      ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                      : 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                  }`}>
                    {req.action_type === 'cancel' ? '休み(取消)申請' : '時間変更申請'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#f4f1ea]">{req.casts.stage_name}</h3>
                <p className="text-xs text-[#5a5650] mt-1">申請日時: {submitDate}</p>
              </div>
            </div>

            {/* 右側: 変更内容とアクション */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-black/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-gold mb-0.5" />
                  <span className="text-xs font-bold text-[#f4f1ea]">{req.target_date.slice(5).replace('-','/')}</span>
                </div>
                
                <div className="pt-1">
                  {req.action_type === 'cancel' ? (
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <Ban className="w-4 h-4" />
                      シフトの取り消し（休み）を希望
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#f4f1ea] font-bold">
                      <Edit2 className="w-4 h-4 text-gold" />
                      変更後: {req.new_start_time?.slice(0,5)} 〜 {req.new_end_time?.slice(0,5)}
                    </div>
                  )}
                </div>
              </div>

              {/* 承認ボタン群 */}
              <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleReject(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-[#8a8478] hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  却下
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.casts.stage_name, targetDate)}
                  disabled={isProcessing !== null}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-[#f4f1ea] text-black hover:bg-white transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
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
