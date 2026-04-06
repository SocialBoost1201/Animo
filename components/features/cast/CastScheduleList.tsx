'use client';

import React, { useState } from 'react';
import { ShiftChangeActionType, submitShiftChangeRequest } from '@/lib/actions/cast-change-requests';
import { toast } from 'sonner';
import { CalendarDays, Clock, Edit2, Loader2, X } from 'lucide-react';

type ConfirmedSchedule = {
  id: string;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
};

type PendingRequest = {
  target_date: string;
  action_type: string;
  status: string;
};

export function CastScheduleList({
  castId,
  schedules,
  pendingRequests,
}: {
  castId: string;
  schedules: ConfirmedSchedule[];
  pendingRequests: PendingRequest[];
}) {
  const [selectedDate, setSelectedDate] = useState<ConfirmedSchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [actionType, setActionType] = useState<ShiftChangeActionType>('update');
  const [newStart, setNewStart] = useState<string>('21:00');
  const [newEnd, setNewEnd] = useState<string>('LAST');

  const openModal = (schedule: ConfirmedSchedule) => {
    setSelectedDate(schedule);
    setActionType('update');
    setNewStart(schedule.start_time || '21:00');
    setNewEnd(schedule.end_time || 'LAST');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;
    setIsSubmitting(true);
    
    // 変更前と同じ内容の場合はエラー
    if (actionType === 'update' && newStart === selectedDate.start_time && newEnd === selectedDate.end_time) {
        toast.error('時間が変更されていません');
        setIsSubmitting(false);
        return;
    }

    const { success, error } = await submitShiftChangeRequest(
      castId,
      selectedDate.work_date,
      actionType,
      newStart,
      newEnd
    );

    setIsSubmitting(false);

    if (success) {
      toast.success('シフトの変更申請を送信しました');
      closeModal();
    } else {
      toast.error(`申請に失敗しました: ${error}`);
    }
  };

  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
        <p className="text-sm text-gray-400">確定済みのスケジュールはありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-serif mb-2 flex items-center gap-2">
        <CalendarDays className="w-3.5 h-3.5" />
        確定済みスケジュール
      </h2>

      {schedules.map((schedule) => {
        // 現在申請中かどうかを判定
        const isPending = pendingRequests.some(r => r.target_date === schedule.work_date);
        
        const dateObj = new Date(schedule.work_date.replace(/-/g, '/'));
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        const dayStr = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];

        return (
          <div key={schedule.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:border-gold/30 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-100 group-hover:bg-gold/5 group-hover:border-gold/20 transition-colors">
                <span className="text-xs text-gray-400 font-bold leading-none">{dayStr}</span>
                <span className="text-sm text-[#171717] font-serif font-bold mt-1 leading-none">{dateStr}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#171717] text-sm">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  {schedule.start_time ? schedule.start_time.slice(0, 5) : '未定'} 〜 {schedule.end_time ? schedule.end_time.slice(0, 5) : 'LAST'}
                </div>
                {isPending && (
                  <p className="text-xs text-yellow-600 font-bold mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    変更申請中
                  </p>
                )}
              </div>
            </div>

            <button
               onClick={() => openModal(schedule)}
               disabled={isPending}
               className="p-2 text-gray-400 hover:text-[#171717] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
               title="シフトを変更・取消"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      {/* 変更申請用モーダル */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="p-5 flex justify-between items-center border-b border-gray-100 relative">
              <h3 className="font-serif font-bold text-[#171717] text-lg">シフトの変更申請</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pb-safe space-y-6">
              <div className="text-center">
                <p className="text-sm font-bold text-[#171717] bg-gray-50 py-2 rounded-lg">
                  対象日: {selectedDate.work_date.replace(/-/g, '/')}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  現在のシフト: {selectedDate.start_time?.slice(0,5)} 〜 {selectedDate.end_time?.slice(0,5)}
                </p>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActionType('update')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    actionType === 'update' ? 'bg-white text-[#171717] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  時間を変更
                </button>
                <button
                  onClick={() => setActionType('cancel')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    actionType === 'cancel' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  休み（取消）にする
                </button>
              </div>

              {actionType === 'update' && (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-bold mb-1">変更後の開始</label>
                    <select
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#171717] rounded-xl p-3 focus:outline-hidden focus:border-gold"
                    >
                      {['19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','00:00','01:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-300 font-bold mt-5">〜</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-bold mb-1">変更後の終了</label>
                    <select
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#171717] rounded-xl p-3 focus:outline-hidden focus:border-gold"
                    >
                      {['LAST','00:00','00:30','01:00','01:30','02:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {actionType === 'cancel' && (
                <div className="text-center p-4 bg-red-50 rounded-xl text-red-600 text-sm font-bold border border-red-100">
                  この日のシフトを完全に取り消します。<br/>管理者の承認後に反映されます。
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#171717] hover:bg-gold text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '申請を送信する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
