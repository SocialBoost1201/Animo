import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft, CalendarDays } from 'lucide-react';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getMySchedulesForWeek, getMyPastSchedules } from '@/lib/actions/cast-change-requests';
import { getTargetWeekMonday, formatDate } from '@/lib/shift-utils';
import { getJstDateString } from '@/lib/date-utils';
import {
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';
import { WeekScheduleClient } from '@/components/features/cast/WeekScheduleClient';

/** YYYY-MM-DD の月曜から N週前の月曜文字列を生成（ローカル日付安全） */
function nWeeksAgoMonday(thisMonday: Date, n: number): string {
  const d = new Date(thisMonday);
  d.setDate(thisMonday.getDate() - n * 7);
  return formatDate(d);
}

/** 週ラベル (例: 4/14(月) 〜 4/20(日)) */
function weekLabel(mondayStr: string): string {
  const monday = new Date(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)}(月) 〜 ${fmt(sunday)}(日)`;
}

export default async function CastSchedulePage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  // JST安全: UTCサーバーでも正しいJST日付起点で週月曜を算出
  const jstTodayStr = getJstDateString();
  const [jy, jm, jd] = jstTodayStr.split('-').map(Number);
  const jstToday = new Date(jy, jm - 1, jd); // ローカルmidnight（タイムゾーンオフセットなし）
  const thisWeekMondayDate = getTargetWeekMonday(jstToday);
  const thisWeekMondayStr = formatDate(thisWeekMondayDate);

  // 4週前の月曜
  const fourWeeksAgo = new Date(thisWeekMondayDate);
  fourWeeksAgo.setDate(thisWeekMondayDate.getDate() - 28);
  const fourWeeksAgoStr = formatDate(fourWeeksAgo);

  // 今週前日（過去シフトの上限）
  const prevDay = new Date(thisWeekMondayDate);
  prevDay.setDate(thisWeekMondayDate.getDate() - 1);
  const prevDayStr = formatDate(prevDay);

  const today = formatDate(new Date());

  // 各週の月曜を生成（今週 + 過去4週）
  const weekMondays = [
    thisWeekMondayStr,
    nWeeksAgoMonday(thisWeekMondayDate, 1),
    nWeeksAgoMonday(thisWeekMondayDate, 2),
    nWeeksAgoMonday(thisWeekMondayDate, 3),
    nWeeksAgoMonday(thisWeekMondayDate, 4),
  ];

  // 並列でスケジュール取得
  const [thisWeekResult, pastResult] = await Promise.all([
    getMySchedulesForWeek(cast.id, thisWeekMondayStr),
    getMyPastSchedules(cast.id, fourWeeksAgoStr, prevDayStr),
  ]);

  // 過去スケジュールをwork_dateでマップ
  const pastMap = new Map((pastResult.data ?? []).map((s) => [s.work_date, s]));

  // 各週のデータをまとめる
  const weeks = weekMondays.map((mondayStr, i) => {
    if (i === 0) {
      // 今週
      return {
        mondayStr,
        label: weekLabel(mondayStr),
        isCurrentWeek: true,
        schedules: thisWeekResult.data ?? [],
      };
    }
    // 過去週: mondayStr〜mondayStr+6 のレコードをフィルタ（ローカル日付安全）
    const [my, mm, md] = mondayStr.split('-').map(Number);
    const monday = new Date(my, mm - 1, md);
    const weekSchedules = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + d);
      const dateKey = formatDate(day);
      const s = pastMap.get(dateKey);
      if (s) weekSchedules.push(s);
    }
    return {
      mondayStr,
      label: weekLabel(mondayStr),
      isCurrentWeek: false,
      schedules: weekSchedules,
    };
  });

  return (
    <CastMobileShell>
      <CastMobileHeader
        leftSlot={
          <Link
            href="/cast/dashboard"
            className="flex items-center gap-1 text-[#8f96a3] hover:text-[#f7f4ed] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs">ダッシュボード</span>
          </Link>
        }
      />

      <main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-[422px] flex-col gap-4 px-4 pb-28 pt-5">
        {/* ページタイトル */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#c9a76a]" />
          <h1 className="text-lg font-bold text-[#f7f4ed]">スケジュール</h1>
          <span className="ml-auto text-[10px] text-[#6b7280]">直近5週</span>
        </div>

        {/* クライアントコンポーネント（週選択 + 詳細表示） */}
        <WeekScheduleClient weeks={weeks} today={today} />
      </main>
    </CastMobileShell>
  );
}
