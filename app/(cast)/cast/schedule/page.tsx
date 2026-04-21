import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getMyConfirmedSchedules } from '@/lib/actions/cast-change-requests';
import {
  CastMobileBackLink,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';
import { getJstDateString } from '@/lib/date-utils';

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = WEEKDAY_JA[d.getDay()];
  return `${m}/${day}（${wd}）`;
}

function isToday(dateStr: string, todayStr: string): boolean {
  return dateStr === todayStr;
}

type ScheduleRow = {
  work_date: string;
  start_time: string | null;
  end_time: string | null;
  note?: string | null;
};

export default async function CastSchedulePage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const today = getJstDateString();
  const { data: schedules } = await getMyConfirmedSchedules(cast.id, 30);

  const rows = (schedules ?? []) as ScheduleRow[];

  return (
    <CastMobileShell>
      <CastMobileHeader />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-28 pt-5">
        <CastMobileBackLink href="/cast/dashboard" label="ホームへ戻る" />
        <CastMobileSectionTitle
          eyebrow="SCHEDULE"
          title="出勤スケジュール"
          description="確定済みの出勤予定（直近30日間）"
        />

        {rows.length === 0 ? (
          <div className="rounded-[18px] border border-white/8 bg-[#131720] px-6 py-8 text-center">
            <p className="text-sm text-[#6b7280]">確定済みの出勤予定がありません</p>
          </div>
        ) : (
          <div className="rounded-[18px] border border-white/8 bg-[#131720] overflow-hidden">
            {rows.map((row, idx) => {
              const isTodayRow = isToday(row.work_date, today);
              return (
                <div
                  key={row.work_date}
                  className={[
                    'flex items-center justify-between px-5 py-4',
                    idx !== 0 ? 'border-t border-white/5' : '',
                    isTodayRow
                      ? 'bg-[rgba(201,167,106,0.08)] border-l-2 border-l-[#c9a76a] pl-[18px]'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="flex items-center gap-3">
                    {isTodayRow && (
                      <span className="shrink-0 rounded-full bg-[#c9a76a] px-2 py-0.5 text-[9px] font-bold text-[#0b0d12] tracking-widest uppercase">
                        TODAY
                      </span>
                    )}
                    <span
                      className={`text-[14px] font-bold ${
                        isTodayRow ? 'text-[#c9a76a]' : 'text-[#f7f4ed]'
                      }`}
                    >
                      {formatDate(row.work_date)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-medium text-[#a9afbc]">
                      {row.start_time?.slice(0, 5) ?? '未定'}
                      {' 〜 '}
                      {row.end_time?.slice(0, 5) ?? '未定'}
                    </span>
                    {row.note ? (
                      <p className="mt-0.5 text-[11px] text-[#6b7280]">{row.note}</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </CastMobileShell>
  );
}
