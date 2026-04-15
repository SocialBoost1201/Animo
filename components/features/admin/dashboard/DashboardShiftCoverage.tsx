import { getDashboardShiftCoverage } from '@/lib/actions/dashboard';
import { BarChart3 } from 'lucide-react';

export async function DashboardShiftCoverage() {
  const data = await getDashboardShiftCoverage();

  return (
    <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] overflow-hidden border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] font-inter h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
            <BarChart3 size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">シフト充足率</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">今週の曜日別充足状況</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5.5 flex flex-col min-w-0">
        {/* Weekly Chart (Matching AnalyticsSectionSubsection:710-752) */}
        <div className="relative h-[116px] mb-8 mt-1 px-2">
          <div className="flex items-end justify-between h-20 gap-[23px]">
            {data.weekly.map((day) => {
              const isLow = day.rate < 60;
              const barHeight = `${Math.max(10, day.rate)}%`;
              const barBg = isLow ? 'bg-[#c8643c1a]' : 'bg-[#dfbd691a]';
              const barBorder = isLow ? 'border-[#c8643c26]' : 'border-[#dfbd6926]';

              return (
                <div key={day.label} className="flex-1 flex flex-col h-full justify-end group">
                  <div className={`text-center mb-1 transition-opacity ${day.isToday ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className={`text-[9px] font-semibold tracking-[0.17px] ${isLow ? 'text-[#d4785a]' : 'text-[#dfbd69]'}`}>{day.rate}%</span>
                  </div>
                  <div className={`w-full relative ${barHeight} ${barBg} rounded-t-[4px] border-[0.56px] border-b-0 ${barBorder} transition-all duration-500`}>
                    {day.isToday && (
                       <div className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-[#dfbd69] rounded-t-[4px]" />
                    )}
                  </div>
                  <div className="mt-2.5 text-center">
                    <span className={`text-[9px] tracking-[0.17px] leading-none ${day.isToday ? 'font-semibold text-[#dfbd69]' : 'font-normal text-[#5a5650]'}`}>
                      {day.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Baseline */}
          <div className="absolute top-[80px] left-0 right-0 h-px bg-[#ffffff0a]" />
        </div>

        {/* Stats List (Matching AnalyticsSectionSubsection:770-808) */}
        <div className="space-y-0 flex-1">
          {/* Caution Alert (Matching AnalyticsSectionSubsection:757) */}
          {data.minRate < 60 && (
            <div className="flex items-center gap-2 px-[9px] py-2.5 bg-[#c8643c0f] rounded-[9px] border-[0.56px] border-[#c8643c1f] mb-4">
              <div className="w-1.5 h-1.5 rounded-sm bg-[#d4785a] shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-[10px] font-normal text-[#d4785a] tracking-[0.12px]">要注意（60%未満）</span>
                <span className="text-[9px] font-bold text-[#d4785a] tracking-[0.17px]">{data.minDay}曜</span>
              </div>
            </div>
          )}

          <div className="divide-y divide-[#ffffff0a] border-y border-[#ffffff0a]">
            {[
              { label: '週平均充足率', value: `${data.avgRate}%`, color: 'text-[#c7c0b2]', weight: 'font-semibold' },
              { label: '最低充足日', value: `${data.minDay}曜 ${data.minRate}%`, color: 'text-[#d4785a]', weight: 'font-semibold' },
              { label: '最高充足日', value: `${data.maxDay}曜 ${data.maxRate}%`, color: 'text-[#72b894]', weight: 'font-semibold' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between h-[42px] px-1">
                <span className="text-[10px] text-[#8a8478] tracking-[0.12px]">{stat.label}</span>
                <span className={`text-[10px] tracking-[0.12px] ${stat.weight} ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Submission Alert (Matching AnalyticsSectionSubsection:810) */}
      <div className="px-6 pb-6">
        {data.missingCount > 0 && (
          <div className="flex items-center justify-center gap-2 px-3 h-8 bg-[#fb3a3a14] rounded-[9px] border-[0.56px] border-[#fb3a3a26]">
            <p className="text-[10px] text-[#cbc3b3] tracking-[0.12px]">
              シフト未提出 <span className="font-semibold text-[#fb3a3a]">{data.missingCount}名</span> — 催促が必要
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
