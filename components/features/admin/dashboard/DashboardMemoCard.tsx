import { getDashboardTodayOps } from '@/lib/actions/dashboard';
import { StickyNote } from 'lucide-react';

type MemoItem = {
  type: 'VIP' | 'EVENT' | 'STAFF';
  content: string | null;
};

export async function DashboardMemoCard() {
  const ops = await getDashboardTodayOps();

  const memos: MemoItem[] = [
    { type: 'VIP', content: ops.vipMemo },
    { type: 'EVENT', content: ops.eventMemo },
    { type: 'STAFF', content: ops.urgentMemo },
  ];

  const TYPE_STYLES: Record<MemoItem['type'], string> = {
    VIP:   'text-[#dfbd69] border-[#dfbd6930] bg-[#dfbd6908]',
    EVENT: 'text-[#72b894] border-[#72b89430] bg-[#72b89408]',
    STAFF: 'text-[#c8884d] border-[#c8884d30] bg-[#c8884d08]',
  };

  return (
    <div className="flex flex-col bg-[rgba(0,0,0,0.94)] rounded-[18px] overflow-hidden border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] font-inter h-full">
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
        {memos.map((m) => (
          <div
            key={m.type}
            className={`rounded-[12px] border px-4 py-3 ${TYPE_STYLES[m.type]}`}
          >
            <p className="text-[9px] font-bold tracking-[1.4px] uppercase mb-1.5 opacity-80">{m.type}</p>
            <p className="text-[12px] text-[#cbc3b3] leading-relaxed">
              {m.content ?? <span className="text-[#5a5650] italic">未入力</span>}
            </p>
          </div>
        ))}

        {/* Placeholder input */}
        <div className="rounded-[12px] border border-dashed border-[#ffffff0f] px-4 py-3 flex items-center gap-2">
          <span className="text-[12px] text-[#5a5650] italic">メモを追加...</span>
        </div>
      </div>
    </div>
  );
}
