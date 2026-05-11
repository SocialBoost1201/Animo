'use client';

import React, { useState } from 'react';
import { X, Loader2, Clock, BanIcon, RotateCcw } from 'lucide-react';
import { adminOverrideCastShift } from '@/lib/actions/monthly-shifts';
import { toast } from 'sonner';
import type { MonthlyShiftDetail } from '@/lib/actions/monthly-shifts';

const TIME_OPTIONS = [
  '21:00', '21:30', '22:00', '22:30',
  '23:00', '23:30', '24:00',
];

// "24:00" を DB 保存用 "00:00" に変換
function toDbTime(display: string): string {
  return display === '24:00' ? '00:00' : display;
}

type Props = {
  castId: string;
  stageName: string;
  workDate: string; // "YYYY-MM-DD"
  displayDate: string; // "M/D"
  currentDetail: MonthlyShiftDetail | undefined;
  onClose: () => void;
};

export function ShiftEditModal({ castId, stageName, workDate, displayDate, currentDetail, onClose }: Props) {
  const [mode, setMode] = useState<'available' | 'unavailable' | 'clear'>(
    currentDetail?.status === 'available' ? 'available'
    : currentDetail?.status === 'unavailable' ? 'unavailable'
    : 'clear'
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    currentDetail?.startTime === '00:00' ? '24:00'
    : currentDetail?.startTime ?? '21:00'
  );
  const [saving, setSaving] = useState(false);

  const hasExistingOverride = !!currentDetail;

  const handleSave = async () => {
    setSaving(true);
    const result = await adminOverrideCastShift(
      castId,
      workDate,
      mode === 'clear' ? null : mode,
      mode === 'available' ? toDbTime(selectedTime) : null,
    );
    setSaving(false);

    if (result.success) {
      toast.success(mode === 'clear' ? 'オーバーライドを解除しました' : 'シフトを更新しました');
      onClose();
    } else {
      toast.error(result.error ?? '保存に失敗しました');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-[20px] border border-[#ffffff14] bg-[#17181c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ffffff08]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">シフト手動設定</p>
            <h2 className="text-[15px] font-bold text-[#f4f1ea] mt-0.5">
              {stageName} <span className="text-[#dfbd69]">{displayDate}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#5a5650] hover:text-[#c7c0b2] hover:bg-[#ffffff0a] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Status selection */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-[#5a5650] uppercase tracking-wider">ステータス</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMode('available')}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] border text-[12px] font-semibold transition-all ${
                  mode === 'available'
                    ? 'bg-[#72b89420] border-[#72b89450] text-[#72b894]'
                    : 'border-[#ffffff10] text-[#5a5650] hover:text-[#c7c0b2] hover:border-[#ffffff20]'
                }`}
              >
                <Clock size={14} />
                出勤
              </button>
              <button
                onClick={() => setMode('unavailable')}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] border text-[12px] font-semibold transition-all ${
                  mode === 'unavailable'
                    ? 'bg-[#d4785a20] border-[#d4785a50] text-[#d4785a]'
                    : 'border-[#ffffff10] text-[#5a5650] hover:text-[#c7c0b2] hover:border-[#ffffff20]'
                }`}
              >
                <BanIcon size={14} />
                休み
              </button>
              <button
                onClick={() => setMode('clear')}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] border text-[12px] font-semibold transition-all ${
                  mode === 'clear'
                    ? 'bg-[#ffffff08] border-[#ffffff20] text-[#8a8478]'
                    : 'border-[#ffffff10] text-[#5a5650] hover:text-[#c7c0b2] hover:border-[#ffffff20]'
                }`}
              >
                <RotateCcw size={14} />
                解除
              </button>
            </div>
            {mode === 'clear' && (
              <p className="text-[10px] text-[#5a5650]">
                手動設定を解除し、シフト申請データに戻します
              </p>
            )}
          </div>

          {/* Time selection (only when 出勤) */}
          {mode === 'available' && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#5a5650] uppercase tracking-wider">出勤時間</p>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-[9px] border text-[11px] font-semibold transition-all ${
                      selectedTime === t
                        ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] border-transparent text-[#0b0b0d]'
                        : 'border-[#ffffff10] text-[#5a5650] hover:text-[#c7c0b2] hover:border-[#ffffff20]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current state indicator */}
          {hasExistingOverride && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#dfbd6908] border border-[#dfbd6920]">
              <span className="text-[10px] text-[#8a8478]">現在のオーバーライド:</span>
              <span className="text-[10px] font-semibold text-[#dfbd69]">
                {currentDetail?.status === 'available'
                  ? `出勤${currentDetail.startTime ? ` ${currentDetail.startTime}` : ''}`
                  : currentDetail?.status === 'unavailable'
                  ? '休み'
                  : '—'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[11px] border border-[#ffffff14] text-[#8a8478] text-[12px] font-semibold hover:text-[#c7c0b2] hover:bg-[#ffffff06] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-10 rounded-[11px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] text-[12px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : null}
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
