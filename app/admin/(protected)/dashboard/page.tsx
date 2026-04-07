import { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, Bell, Plus } from 'lucide-react';

import { DashboardKPIs }          from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardTodayOps }       from '@/components/features/admin/dashboard/DashboardTodayOps';
import { DashboardTodayShifts }    from '@/components/features/admin/dashboard/DashboardTodayShifts';
import { DashboardCastRanking }    from '@/components/features/admin/dashboard/DashboardCastRanking';
import { DashboardAlertCard }      from '@/components/features/admin/dashboard/DashboardAlertCard';
import { DashboardReservations }   from '@/components/features/admin/dashboard/DashboardReservations';
import { DashboardMemoCard }       from '@/components/features/admin/dashboard/DashboardMemoCard';
import { getJstDateLabel } from '@/lib/date-utils';

function Skeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[18px] bg-[#1c1d22] ${className}`} />;
}

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">本日の営業状況</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">今日の営業判断に必要な情報を確認できます</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-[#ffffff0f]">
            <Calendar size={13} className="text-[#8a8478]" />
            <span className="text-[11px] font-medium text-[#c7c0b2] tracking-[3.06px] uppercase">{dateLabel}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-[#ffffff0f] w-48 transition-all focus-within:w-64 focus-within:border-[#dfbd6940]">
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="5" cy="5" r="4" stroke="#c7c0b2" strokeOpacity="0.5" strokeWidth="1.2" />
              <path d="M8 9l2 2" stroke="#c7c0b2" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="検索..."
              className="bg-transparent border-none outline-none text-[12px] text-[#c7c0b2] placeholder-[#c7c0b280] w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 bg-[#ffffff0a] rounded-[9px] border-[0.56px] border-[#ffffff0f] hover:bg-[#ffffff15] transition-colors relative">
              <Bell size={14} className="text-[#c7c0b2]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
            </button>

            <Link
              href="/admin/today"
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
            >
              <Plus size={14} strokeWidth={3} />
              来店予定を追加
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <Suspense fallback={<Skeleton className="h-[150px]" />}>
        <DashboardKPIs />
      </Suspense>

      {/* ── 本日の営業状況（全幅）── */}
      <Suspense fallback={<Skeleton className="h-72" />}>
        <DashboardTodayOps />
      </Suspense>

      {/* ── 本日の出勤キャスト（全幅）── */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <DashboardTodayShifts />
      </Suspense>

      {/* ── キャスト行動成績評価 ＋ 重要アラート ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardCastRanking />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardAlertCard />
        </Suspense>
      </div>

      {/* ── 来店予定一覧 ＋ 営業メモ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
        <Suspense fallback={<Skeleton className="h-56" />}>
          <DashboardReservations />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-56" />}>
          <DashboardMemoCard />
        </Suspense>
      </div>
    </div>
  );
}
