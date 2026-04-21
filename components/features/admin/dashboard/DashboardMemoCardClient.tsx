'use client';

import { useState, useTransition } from 'react';
import { StickyNote, Pencil, Check, X } from 'lucide-react';
import { upsertDailyMemo } from '@/lib/actions/dashboard';
import { toast } from 'sonner';

type MemoType = 'vip' | 'event' | 'urgent';

type MemoItem = {
  type: MemoType;
  label: string;
  content: string | null;
};

const TYPE_STYLES: Record<MemoType, {
  card: string;
  tag: string;
  tagBg: string;
  border: string;
}> = {
  vip:    { card: 'border-[#dfbd6926]', tag: 'text-[#dfbd69]', tagBg: 'bg-[#dfbd691a]', border: 'border-[#dfbd6950]' },
  event:  { card: 'border-[#ffffff0f]', tag: 'text-[#8a8478]', tagBg: 'bg-[#ffffff0a]', border: 'border-[#ffffff30]' },
  urgent: { card: 'border-[#c8823226]', tag: 'text-[#c8884d]', tagBg: 'bg-[#c882321a]', border: 'border-[#c8884d50]' },
};

function MemoRow({ item, onSave }: {
  item: MemoItem;
  onSave: (type: MemoType, content: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.content ?? '');
  const [isPending, startTransition] = useTransition();
  const s = TYPE_STYLES[item.type];

  const save = () => {
    startTransition(async () => {
      await onSave(item.type, draft);
      setEditing(false);
    });
  };

  const cancel = () => {
    setDraft(item.content ?? '');
    setEditing(false);
  };

  return (
    <div className={`rounded-[12px] border px-4 py-3 ${s.card}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[9px] font-bold tracking-[1.4px] uppercase px-1.5 py-0.5 rounded-full ${s.tag} ${s.tagBg}`}>
          {item.label}
        </span>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded-md text-[#5a5650] hover:text-[#dfbd69] hover:bg-[#dfbd6914] transition-colors"
            title="メモを編集"
          >
            <Pencil size={11} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={save}
              disabled={isPending}
              className="p-1 rounded-md text-[#72b894] hover:bg-[#72b89414] transition-colors disabled:opacity-50"
              title="保存"
            >
              <Check size={11} />
            </button>
            <button
              onClick={cancel}
              className="p-1 rounded-md text-[#5a5650] hover:text-[#f87171] hover:bg-[#f871711a] transition-colors"
              title="キャンセル"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className={`w-full text-[12px] text-[#cbc3b3] bg-[#0b0b0d] border ${s.border} rounded-[8px] px-3 py-2 outline-none resize-none placeholder-[#5a5650] transition-colors`}
          placeholder="メモを入力..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
            if (e.key === 'Escape') cancel();
          }}
        />
      ) : (
        <p className="text-[12px] text-[#cbc3b3] leading-relaxed min-h-[18px]">
          {item.content ?? <span className="text-[#5a5650] italic">未入力 — クリックして編集</span>}
        </p>
      )}
    </div>
  );
}

type Props = {
  vipMemo: string | null;
  eventMemo: string | null;
  urgentMemo: string | null;
};

export function DashboardMemoCardClient({ vipMemo, eventMemo, urgentMemo }: Props) {
  const [memos, setMemos] = useState<MemoItem[]>([
    { type: 'vip',    label: '重要顧客', content: vipMemo },
    { type: 'event',  label: 'イベント', content: eventMemo },
    { type: 'urgent', label: '要対応', content: urgentMemo },
  ]);

  const handleSave = async (type: MemoType, content: string) => {
    const result = await upsertDailyMemo(type, content);
    if (result.success) {
      setMemos((prev) =>
        prev.map((m) => (m.type === type ? { ...m, content: content.trim() || null } : m))
      );
      toast.success('メモを保存しました');
    } else {
      toast.error('保存に失敗しました: ' + result.error);
    }
  };

  return (
    <div className="flex flex-col bg-black/94 rounded-[18px] overflow-hidden border-[1.5px] border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] font-sans h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
            <StickyNote size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">営業メモ</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">本日の特記事項（鉛筆アイコンで編集）</p>
          </div>
        </div>
      </div>

      {/* Memo Cards */}
      <div className="flex-1 p-4 space-y-2.5 overflow-y-auto custom-scrollbar">
        {memos.map((m) => (
          <MemoRow key={m.type} item={m} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
}
