import { StickyNote } from 'lucide-react';

const TYPE_STYLES: Record<string, string> = {
  info:    'border-[#dfbd6930] bg-[#dfbd6908] text-[#f4f1ea]',
  warning: 'border-[#f97;31630] bg-[#f9731608] text-[#fbbf24]',
  note:    'border-[#ffffff10] bg-[#ffffff04] text-[#cbc3b3]',
};

export async function DashboardMemoCard() {
  // placeholder until memo data action is connected
  const memos: { type: string; content: string | null }[] = [];

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
              <StickyNote size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">営業メモ</p>
              <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">本日の特記事項</p>
            </div>
          </div>
        </div>

        {/* Memo Cards */}
        <div className="flex-1 p-4 space-y-2.5 overflow-y-auto custom-scrollbar">
          {memos.length > 0 ? memos.map((m) => (
            <div
              key={m.type}
              className={`rounded-[12px] border px-4 py-3 ${TYPE_STYLES[m.type] ?? TYPE_STYLES.note}`}
            >
              <p className="text-[9px] font-bold tracking-[1.4px] uppercase mb-1.5 opacity-80">{m.type}</p>
              <p className="text-[12px] text-[#cbc3b3] leading-relaxed">
                {m.content ?? <span className="text-[#5a5650] italic">未入力</span>}
              </p>
            </div>
          )) : null}

          {/* Placeholder input */}
          <div className="rounded-[12px] border border-dashed border-[#ffffff0f] px-4 py-3 flex items-center gap-2">
            <span className="text-[12px] text-[#5a5650] italic">メモを追加...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
