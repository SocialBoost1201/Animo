'use client';

import { useState, useRef } from 'react';
import { sendInquiryReply } from '@/lib/actions/inquiries';
import { SendHorizonal, CheckCircle2, Loader2 } from 'lucide-react';

interface ReplyFormProps {
  id: string;
  table: 'contacts' | 'recruit_applications';
  customerName: string;
  toEmail: string; // contact_method or email
  repliedAt?: string | null;
  replyText?: string | null;
}

export function ReplyForm({ id, table, customerName, toEmail, repliedAt, replyText }: ReplyFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; emailSent?: boolean } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 返信済みの場合は履歴表示
  if (repliedAt) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-sm">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={14} className="text-green-600" />
          <span className="text-xs font-bold text-green-700 tracking-widest uppercase">返信済み</span>
          <span className="text-xs text-gray-400 ml-auto">{repliedAt.slice(0, 16).replace('T', ' ')}</span>
        </div>
        <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{replyText}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const res = await sendInquiryReply(fd);
    setSubmitting(false);
    setResult(res);
    if (res?.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  };

  const hasEmail = toEmail && toEmail.includes('@');

  return (
    <div className="mt-4">
      {!open ? (
        <div className="flex items-center justify-end gap-4">
          {result?.success && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> 返信が完了しました{result.emailSent ? '（メール送信済み）' : '（DB保存のみ）'}
            </span>
          )}
          {result?.error && (
            <span className="text-xs text-red-600">{result.error}</span>
          )}
          <button
            onClick={() => setOpen(true)}
            className="text-xs font-bold tracking-widest uppercase px-4 py-2 border border-gold text-gold hover:bg-gold/5 transition-colors flex items-center gap-2 rounded-sm"
          >
            <SendHorizonal size={12} />
            返信する
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-2 bg-gray-50 border border-gray-100 rounded-sm p-4 space-y-3">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="table" value={table} />
          <input type="hidden" name="customerName" value={customerName} />

          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-400 mb-1">
              返信先 (Email)
            </label>
            <input
              name="toEmail"
              type="text"
              defaultValue={hasEmail ? toEmail : ''}
              placeholder={hasEmail ? toEmail : 'メールアドレスを入力（任意）'}
              className="w-full text-xs border border-gray-200 bg-white px-3 py-2 outline-none focus:border-gold transition-colors rounded-sm"
            />
            {!hasEmail && (
              <p className="text-xs text-amber-600 mt-1">
                ※ 連絡先がメールアドレス形式ではないため、メール送信はスキップされます（DB保存のみ）。
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-400 mb-1">
              返信内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              name="replyText"
              required
              rows={6}
              placeholder={`${customerName} 様への返信内容を入力してください`}
              className="w-full text-xs border border-gray-200 bg-white px-3 py-2 outline-none focus:border-gold transition-colors rounded-sm resize-none leading-relaxed"
            />
          </div>

          {result?.error && (
            <p className="text-xs text-red-600">{result.error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 tracking-widest uppercase transition-colors px-3 py-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-xs font-bold tracking-widest uppercase px-5 py-2 bg-[#171717] text-white hover:bg-[#333] transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 size={12} className="animate-spin" /> : <SendHorizonal size={12} />}
              {submitting ? '送信中...' : '送信する'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
