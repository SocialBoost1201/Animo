import { StickyNote } from 'lucide-react';
import { DashboardEmptyState } from './DashboardEmptyState';

export async function DashboardMemoCard() {
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
          <DashboardEmptyState className="min-h-40 h-full" />
        </div>
      </div>
    </div>
  );
}
