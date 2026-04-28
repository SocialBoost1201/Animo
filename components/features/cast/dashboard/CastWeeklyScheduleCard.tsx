import type { JSX } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { CastMobileCard } from '@/components/features/cast/CastMobileShell';
import { formatDate } from '@/lib/shift-utils';

type CastWeeklyScheduleCardProps = {
  summaryDates: Date[];
  scheduleStatusMap: Set<string>;
  today: string;
  todayShift: { start_time: string | null; end_time: string | null } | null;
  workCount: number;
  offCount: number;
};

function getWeeklySummaryLabel(value: 'work' | 'off'): { text: string; color: string } {
  if (value === 'work') return { text: '○', color: 'text-[#3b82f6]' };
  return { text: '×', color: 'text-[#ef4444]' };
}

export function CastWeeklyScheduleCard({
  summaryDates,
  scheduleStatusMap,
  today,
  todayShift,
  workCount,
  offCount,
}: CastWeeklyScheduleCardProps): JSX.Element {
  const todayShiftLabel = todayShift
    ? `本日 ${todayShift.start_time?.slice(0, 5) ?? '未定'}–${todayShift.end_time?.slice(0, 5) ?? '未定'}`
    : '本日 OFF';

  return (
    <Link href="/cast/schedule" aria-label="今週のスケジュール詳細を見る">
      <CastMobileCard>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#c9a76a]" />
            <span className="text-[15px] font-semibold text-[#f7f4ed]">今週のスケジュール</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[rgba(59,130,246,0.12)] px-2 py-0.5 text-[10px] text-[#3b82f6]">
              {workCount}出
            </span>
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-[#6b7280]">
              {offCount}休
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-3">
          {summaryDates.map((date) => {
            const dateKey = formatDate(date);
            const isToday = dateKey === today;
            const indicator = getWeeklySummaryLabel(
              scheduleStatusMap.has(dateKey) ? 'work' : 'off'
            );
            return (
              <div
                key={dateKey}
                className={`rounded-[10px] border px-1 py-2 text-center ${
                  isToday
                    ? 'border-[rgba(201,167,106,0.4)] bg-[rgba(201,167,106,0.08)]'
                    : 'border-transparent'
                }`}
              >
                <div className={`text-[10px] ${isToday ? 'text-[#c9a76a]' : 'text-[#6b7280]'}`}>
                  {date.toLocaleDateString('ja-JP', { weekday: 'short' }).replace('曜', '')}
                </div>
                <div className={`mt-2 text-base font-bold leading-none ${indicator.color}`}>
                  {indicator.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-white/6 px-4 py-3">
          <span className="text-[13px] font-semibold text-[#f7f4ed]">{todayShiftLabel}</span>
          <span className="flex items-center gap-0.5 text-[12px] text-[#8f96a3]">
            詳細
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </CastMobileCard>
    </Link>
  );
}
