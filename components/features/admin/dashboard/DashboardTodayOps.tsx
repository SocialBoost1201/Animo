import { getDashboardTodayOps } from '@/lib/actions/dashboard';
import { Plus } from 'lucide-react';

export async function DashboardTodayOps() {
  const ops = await getDashboardTodayOps();

  const overviewRows = [
    { label: '営業日',      value: ops.dateLabel },
    { label: '営業時間',    value: `${ops.startTime} — ${ops.endTime}` },
    { label: '想定出勤数',  value: `${ops.plannedCastCount}名` },
    { label: '確定出勤数',  value: `${ops.confirmedCastCount}名`, bold: true },
    { label: '予約件数',    value: `${ops.reservationCount}件` },
    { label: '予定来店人数', value: `${ops.totalGuests}名` },
    { label: '体入人数',    value: `${ops.trialCount}名（本日初回）` },
  ];

  const memos = [
    ops.vipMemo ? {
      tag: '重要顧客',
      tagBg: 'bg-[#dfbd691a]',
      tagText: 'text-[#dfbd69]',
      cardBorder: 'border-[#dfbd6926]',
      content: ops.vipMemo,
    } : null,
    ops.eventMemo ? {
      tag: 'イベント',
      tagBg: 'bg-[#ffffff0a]',
      tagText: 'text-[#8a8478]',
      cardBorder: 'border-[#ffffff0f]',
      content: ops.eventMemo,
    } : null,
    ops.urgentMemo ? {
      tag: '要対応',
      tagBg: 'bg-[#c882321a]',
      tagText: 'text-[#c8884d]',
      cardBorder: 'border-[#c8823226]',
      content: ops.urgentMemo,
    } : null,
  ].filter(Boolean) as { tag: string; tagBg: string; tagText: string; cardBorder: string; content: string }[];

  return (
    <div className="flex flex-col bg-black/94 rounded-[18px] overflow-hidden border border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] font-sans h-full">
      {/* Header row */}
      <div className="flex items-center justify-between px-10 h-[88px] border-b border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-[42px] h-[42px] flex items-center justify-center bg-[#dfbd691a] rounded-[10px] shrink-0">
             <Plus size={18} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-bold text-[#f4f1ea] tracking-[-0.1px] leading-tight">本日の営業状況</p>
            <p className="text-[12px] text-[#8a8478] tracking-[0.08px] leading-tight opacity-70">今夜のオペレーション概要</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#50a0641a] rounded-full border border-[#50a06426]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#72b894] animate-pulse" />
          <span className="text-[11px] font-bold text-[#72b894] tracking-[1px] uppercase">準備完了</span>
        </div>
      </div>

      {/* Body: two columns */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-[#ffffff0f]">
        {/* Left: OVERVIEW */}
        <div className="flex-1 p-10 flex flex-col min-w-0">
          <p className="text-[10px] font-bold tracking-[2.5px] text-[#5a5650] uppercase mb-6 px-1">概要</p>
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {overviewRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 px-1 border-b border-[#ffffff0a] last:border-0"
              >
                <span className="text-[14px] text-[#8a8478] font-medium leading-none">{row.label}</span>
                <span className={`text-[15px] tracking-tight leading-none ${row.bold ? 'font-bold text-white' : 'font-semibold text-[#cbc3b3]'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: MANAGEMENT MEMO */}
        <div className="flex-1 p-10 flex flex-col min-w-0 bg-white/1">
          <p className="text-[10px] font-bold tracking-[2.5px] text-[#5a5650] uppercase mb-6 px-1">管理メモ</p>
          <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-1">
            {memos.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center gap-3 border border-dashed border-[#ffffff0f] rounded-[18px]">
                 <Plus size={18} className="text-[#5a5650] opacity-40" />
                 <p className="text-[12px] text-[#5a5650]">管理メモはありません</p>
              </div>
            ) : (
              memos.map((memo, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-3 bg-black/40 rounded-[15px] border ${memo.cardBorder} p-6 shadow-lg`}
                >
                  <div className={`self-start px-2 py-0.5 rounded-[4px] ${memo.tagBg}`}>
                    <span className={`text-[10px] font-bold tracking-[1px] leading-[1.6] ${memo.tagText}`}>{memo.tag}</span>
                  </div>
                  <p className="text-[13px] text-[#c7c0b2] leading-[1.7] tracking-[0.2px] font-medium">{memo.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
