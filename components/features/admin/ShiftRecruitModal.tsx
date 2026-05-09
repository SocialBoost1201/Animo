'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { sendShiftRecruitment } from '@/lib/actions/shift-recruit';
import { toast } from 'sonner';

type Props = {
  targetDate: string;
  onClose: () => void;
};

export function ShiftRecruitModal({ targetDate, onClose }: Props) {
  const [message, setMessage] = useState(
    `本日のシフトに空きがある方はご連絡ください。よろしくお願いします。`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    const result = await sendShiftRecruitment(targetDate, message);
    setSending(false);
    if (result.success) {
      toast.success('キャストグループLINEに送信しました');
      onClose();
    } else {
      toast.error(result.error ?? '送信に失敗しました');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-[20px] border border-[#dfbd6940] bg-[#17181c] p-6 space-y-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#8a8478] uppercase tracking-wider font-semibold">出勤募集</p>
            <h2 className="text-[16px] font-bold text-[#f4f1ea] mt-0.5">{targetDate}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#5a5650] hover:text-[#c7c0b2] hover:bg-[#ffffff0a] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message input */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#8a8478] font-semibold">メッセージ</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-[12px] border border-[#ffffff14] bg-[#0d0e11] px-4 py-3 text-[13px] text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-[#dfbd6940] resize-none"
          />
          <p className="text-[10px] text-[#5a5650]">
            送信先: キャストグループLINE<br />
            プレビュー: 【出勤募集】{targetDate}<br />{message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[12px] border border-[#ffffff14] text-[#8a8478] text-[13px] font-semibold hover:text-[#c7c0b2] hover:bg-[#ffffff08] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="flex-1 h-11 rounded-[12px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : null}
            募集する
          </button>
        </div>
      </div>
    </div>
  );
}
