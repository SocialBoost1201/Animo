import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getMyConfirmedSchedules } from '@/lib/actions/cast-change-requests';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';

export default async function CastMonthlyShiftPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const { data: schedules } = await getMyConfirmedSchedules(cast.id, 7);
  const rows = (schedules ?? []).slice(0, 7);
  const workedCount = rows.filter((row) => row.status === 'confirmed').length;
  const todayRow = rows[0];

  return (
    <CastMobileShell>
      <CastMobileHeader />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-28 pt-6">
        <CastMobileBackLink href="/cast/dashboard" label="ダッシュボードへ戻る" />
        <div>
          <h1 className="text-[20px] font-bold leading-[30px] text-[#f7f4ed]">スケジュール</h1>
          <p className="mt-1 text-[13px] leading-[19.5px] text-[#6b7280]">今週の確定シフト</p>
        </div>

        <div className="flex items-center gap-4 rounded-[16px] border border-[rgba(201,167,106,0.25)] bg-[rgba(201,167,106,0.15)] px-5 py-4">
          <Clock3 className="h-6 w-6 text-[#c9a76a]" />
          <div>
            <div className="text-[12px] leading-[18px] text-[#6b7280]">本日の出勤時間</div>
            <div className="text-[18px] font-bold leading-[26px] text-[#c9a76a]">
              {todayRow?.status === 'confirmed' ? `${todayRow.start_time?.slice(0, 5)}〜${todayRow.end_time?.slice(0, 5)}` : 'OFF'}
            </div>
          </div>
        </div>

        <CastMobileCard className="overflow-hidden rounded-[16px]">
          {rows.map((row, index) => {
            const date = new Date(row.work_date);
            const badgeClass =
              row.status === 'confirmed'
                ? 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]'
                : row.status === 'pending'
                  ? 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]'
                  : 'bg-[rgba(255,255,255,0.04)] text-[#6b7280]';
            const badgeLabel = index === 0 ? '今日' : row.status === 'confirmed' ? '確定' : row.status === 'pending' ? '未提出' : 'OFF';
            const timeLabel = row.status === 'confirmed' ? `${row.start_time?.slice(0, 5)}-${row.end_time?.slice(0, 5)}` : row.status === 'pending' ? '未提出' : 'OFF';

            return (
              <div
                key={row.id}
                className={`flex items-center gap-4 px-4 py-4 ${index !== rows.length - 1 ? 'border-b border-white/8' : ''} ${index === 0 ? 'bg-[rgba(201,167,106,0.15)]' : ''}`}
              >
                <div className="w-[58px]">
                  <div className="text-[11px] font-bold text-[#f7f4ed]">{date.getMonth() + 1}/{date.getDate()}</div>
                  <div className="mt-1 text-[9px] text-[#6b7280]">{date.toLocaleDateString('ja-JP', { weekday: 'long' })}</div>
                </div>
                <div className="flex-1 text-[14px] font-medium text-[#f7f4ed]">{timeLabel}</div>
                <span className={`rounded-full px-3 py-2 text-[11px] font-bold ${badgeClass}`}>{badgeLabel}</span>
              </div>
            );
          })}
        </CastMobileCard>

        <div className="flex items-center justify-between rounded-[14px] border border-white/8 bg-[#181d27] px-5 py-4">
          <div className="text-[13px] text-[#a9afbc]">今週の出勤日数</div>
          <div className="text-[16px] font-bold text-[#f7f4ed]">
            {workedCount}
            <span className="ml-1 text-[13px] text-[#6b7280]">日</span>
          </div>
        </div>

        <Link
          href="/cast/shift"
          className="flex h-[46px] items-center justify-center rounded-[14px] border border-[rgba(201,167,106,0.25)] bg-[rgba(201,167,106,0.15)] text-[15px] font-bold text-[#c9a76a]"
        >
          来週のシフトを提出する →
        </Link>
      </main>
    </CastMobileShell>
  );
}
