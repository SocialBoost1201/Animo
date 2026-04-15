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
      tag: 'VIP',
      tagBg: 'bg-[#dfbd691a]',
      tagText: 'text-[#dfbd69]',
      cardBorder: 'border-[#dfbd6926]',
      content: ops.vipMemo,
    } : null,
    ops.eventMemo ? {
      tag: 'EVENT',
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
    <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] overflow-hidden border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] font-inter h-full">
      {/* Header row (Matching TodayPanelSubsection:99) */}
      <div className="flex items-center justify-between px-6 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
             <div className="w-[15px] h-3.5 bg-[#dfbd69] [mask-image:url(/icon-calendar.svg)] [mask-repeat:no-repeat] [mask-size:100%]" />
             {/* Fallback to Lucide if mask fails */}
             <Plus size={14} className="text-[#dfbd69]" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">本日の営業状況</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">今夜のオペレーション概要</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-[9.5px] py-1 bg-[#50a0641a] rounded-[20px] border-[0.56px] border-[#50a06426]">
          <div className="w-[5px] h-[5px] rounded-full bg-[#72b894]" />
          <span className="text-[10px] font-semibold text-[#72b894] tracking-[0.12px]">営業準備中</span>
        </div>
      </div>

      {/* Body: two columns (Matching TodayPanelSubsection:131) */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-[#ffffff0f]">
        {/* Left: OVERVIEW */}
        <div className="flex-1 p-5.5 flex flex-col min-w-0">
          <p className="text-[9px] font-bold tracking-[1.25px] text-[#5a5650] uppercase mb-3 px-1">OVERVIEW</p>
          <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
            {overviewRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-[9px] px-1 border-b-[0.56px] border-[#ffffff0a] last:border-0"
              >
                <span className="text-[12px] text-[#8a8478] font-normal leading-none">{row.label}</span>
                <span className={`text-[12px] tracking-tight leading-none ${row.bold ? 'font-semibold text-[#cbc3b3]' : 'font-medium text-[#cbc3b3]'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: MANAGEMENT MEMO */}
        <div className="flex-1 p-5.5 flex flex-col min-w-0 bg-[#ffffff02]">
          <p className="text-[9px] font-bold tracking-[1.25px] text-[#5a5650] uppercase mb-3 px-1">MANAGEMENT MEMO</p>
          <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1">
            {memos.length === 0 ? (
              <div className="h-24 flex flex-col items-center justify-center gap-2 border-[0.56px] border-dashed border-[#ffffff0f] rounded-xl">
                 <Plus size={14} className="text-[#5a5650]" />
                 <p className="text-[10px] text-[#5a5650]">メモなし</p>
              </div>
            ) : (
              memos.map((memo, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-[5px] bg-[#1c1d22] rounded-[11px] border-[0.56px] border-solid ${memo.cardBorder} p-[13.6px] pt-[10.6px] shadow-sm`}
                >
                  <div className={`self-start px-[5px] py-[1.7px] rounded-[3px] ${memo.tagBg}`}>
                    <span className={`text-[9px] font-bold tracking-[0.89px] leading-[14.4px] ${memo.tagText}`}>{memo.tag}</span>
                  </div>
                  <p className="text-[11px] text-[#c7c0b2] leading-[1.6] tracking-[0.06px]">{memo.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
