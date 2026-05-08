'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { requestProfileTextChange } from '@/lib/actions/cast-profile-requests';
import { toast } from 'sonner';

const QUIZ_TAG_OPTIONS = [
  { value: 'gentle',       label: '癒し系・優しい' },
  { value: 'cool',         label: 'クール・大人っぽい' },
  { value: 'energetic',    label: '元気・明るい' },
  { value: 'intellectual', label: 'インテリ・話が弾む' },
  { value: 'cute',         label: 'キュート・ガーリー' },
  { value: 'sexy',         label: 'セクシー・魅力的' },
  { value: 'funny',        label: '笑いが絶えない' },
  { value: 'outdoor',      label: 'アウトドア・スポーティ' },
  { value: 'music',        label: '音楽好き' },
  { value: 'fashion',      label: 'ファッション・おしゃれ' },
];

type Props = {
  currentHobby:    string | null;
  currentComment:  string | null;
  currentQuizTags: string[] | null;
};

export function ProfileTextChangeForm({ currentHobby, currentComment, currentQuizTags }: Props) {
  const [hobby,        setHobby]        = useState(currentHobby    ?? '');
  const [comment,      setComment]      = useState(currentComment   ?? '');
  const [selectedTags, setSelectedTags] = useState<string[]>(currentQuizTags ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  function toggleTag(value: string) {
    setSelectedTags(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
    setSubmitted(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('変更申請を送信しています。少しお待ちください。');
    try {
      const fd = new FormData();
      fd.append('hobby',   hobby);
      fd.append('comment', comment);
      selectedTags.forEach(t => fd.append('quiz_tags', t));

      const result = await requestProfileTextChange(fd);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('申請を送信しました。店長が確認後に反映されます。');
        setSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 趣味 */}
      <div className="space-y-1.5">
        <label htmlFor="cast-profile-hobby" className="text-[11px] uppercase tracking-[0.16em] text-[#8f96a3]">趣味</label>
        <input
          id="cast-profile-hobby"
          type="text"
          value={hobby}
          onChange={e => { setHobby(e.target.value); setSubmitted(false); }}
          placeholder={currentHobby ?? '例：映画鑑賞、カフェ巡り'}
          className="w-full rounded-[12px] border px-4 py-3 text-[13px] text-[#f7f4ed] placeholder-[#8f96a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/50"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
          maxLength={100}
        />
      </div>

      {/* AI診断タグ */}
      <div className="space-y-2">
        <div id="cast-profile-tags-label" className="text-[11px] uppercase tracking-[0.16em] text-[#8f96a3]">AI診断タグ（複数選択可）</div>
        <div className="flex flex-wrap gap-2">
          {QUIZ_TAG_OPTIONS.map(tag => {
            const active = selectedTags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                aria-pressed={active}
                aria-describedby="cast-profile-tags-label"
                className="min-h-11 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/50"
                style={{
                  background: active ? 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)' : 'rgba(255,255,255,0.06)',
                  color:      active ? '#0b0b0d' : '#9ca3af',
                  border:     active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 一言コメント */}
      <div className="space-y-1.5">
        <label htmlFor="cast-profile-comment" className="text-[11px] uppercase tracking-[0.16em] text-[#8f96a3]">一言コメント</label>
        <textarea
          id="cast-profile-comment"
          value={comment}
          onChange={e => { setComment(e.target.value); setSubmitted(false); }}
          placeholder={currentComment ?? '自己紹介や来てほしいお客様へのメッセージなど'}
          rows={4}
          className="w-full rounded-[12px] border px-4 py-3 text-[13px] text-[#f7f4ed] placeholder-[#8f96a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/50 resize-none"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
          maxLength={400}
        />
        <p className="text-right text-[10px] text-[#8f96a3]">{comment.length} / 400</p>
      </div>

      {/* 送信済み */}
      {submitted && (
        <div
          className="flex items-center gap-2 rounded-[12px] px-4 py-3"
          style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          <CheckCircle2 className="h-[14px] w-[14px] shrink-0 text-green-400" />
          <span className="text-[12px] text-green-400">申請を受け付けました。店長の確認後に反映されます。</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] py-3 text-[13px] font-bold transition-opacity disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/50"
        style={{
          background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          color: '#0b0b0d',
        }}
      >
        {isSubmitting
          ? <><Loader2 className="h-[14px] w-[14px] animate-spin" />申請送信中…</>
          : '変更を申請する'}
      </button>
      <p className="min-h-[18px] text-center text-[11px] text-[#8f96a3]" aria-live="polite">
        {isSubmitting ? '変更申請を送信しています。画面を閉じずにお待ちください。' : ''}
      </p>
    </form>
  );
}
