'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ShiftRequest, ShiftRequestResponse } from '@/lib/actions/admin-shift-requests';
import { submitShiftRequestResponse } from '@/lib/actions/cast-shift-requests';

// @ts-ignore
export function CastHelpRequestList({
  activeRequests,
  myResponses
}: {
  activeRequests: ShiftRequest[];
  myResponses: ShiftRequestResponse[];
}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('21:00');
  const [endTime, setEndTime] = useState('LAST');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeRequests.length === 0) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;
    
    setIsSubmitting(true);
    try {
      await submitShiftRequestResponse(selectedRequestId, startTime, endTime);
      alert('応募が完了しました。店舗からの承認をお待ちください。');
      setSelectedRequestId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : '応募に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />
        <h2 className="text-sm uppercase tracking-[0.2em] text-[#171717] font-bold">出勤リクエスト（急募）</h2>
      </div>

      <div className="space-y-3">
        {activeRequests.map(req => {
          // 既に応募済みかチェック
          const response = myResponses.find(r => r.request_id === req.id);
          const isSelected = selectedRequestId === req.id;

          return (
            <div key={req.id} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              {/* 装飾 */}
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>

              <div className="pr-4">
                <div className="font-bold text-[#171717] mb-1">
                  {format(new Date(req.target_date), 'M月d日 (E)', { locale: ja })} の出勤募集
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{req.message}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200/50">
                {response ? (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    {response.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    {response.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {response.status === 'rejected' && <XCircle className="w-5 h-5 text-red-500" />}
                    
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        {response.proposed_start_time}〜{response.proposed_end_time} で応募済み
                      </p>
                      <p className={`text-sm font-bold ${
                        response.status === 'approved' ? 'text-green-700' : 
                        response.status === 'rejected' ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        {response.status === 'pending' ? '承認待ち' : 
                         response.status === 'approved' ? '承認されました！スケジュールに反映済' : '今回は見送りとなりました'}
                      </p>
                    </div>
                  </div>
                ) : isSelected ? (
                  <form onSubmit={handleApply} className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-[#171717] mb-2">出勤可能な時間を入力して応募</p>
                    <div className="flex items-center gap-2">
                      <select 
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-black outline-none"
                      >
                        {Array.from({ length: 9 }).map((_, i) => {
                          const hour = 19 + i;
                          return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                        })}
                      </select>
                      <span className="text-gray-400">〜</span>
                      <select 
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-black outline-none"
                      >
                        <option value="LAST">LAST</option>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const hour = 23 + i;
                          const displayHour = hour >= 24 ? `翌${hour - 24}` : hour;
                          return <option key={hour} value={`${hour >= 24 ? '0' + (hour-24) : hour}:00`}>{displayHour}:00</option>;
                        })}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setSelectedRequestId(null)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200"
                        disabled={isSubmitting}
                      >
                        キャンセル
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-2 bg-[#171717] text-white text-sm font-bold rounded-lg hover:bg-black disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? '送信中...' : '応募する'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setSelectedRequestId(req.id)}
                    className="w-full py-3 bg-amber-400 text-amber-950 text-sm font-bold rounded-xl hover:bg-amber-500 transition-colors shadow-sm"
                  >
                    この募集に応募する
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
