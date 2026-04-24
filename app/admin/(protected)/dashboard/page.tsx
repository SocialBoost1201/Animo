import { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, Bell, Plus } from 'lucide-react';
import { DashboardSearchBar } from '@/components/features/admin/dashboard/DashboardSearchBar';

import { DashboardKPIs }          from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardTodayOps }       from '@/components/features/admin/dashboard/DashboardTodayOps';
import { DashboardTodayShifts }    from '@/components/features/admin/dashboard/DashboardTodayShifts';
import { DashboardCastRanking }    from '@/components/features/admin/dashboard/DashboardCastRanking';
import { DashboardAlertCard }      from '@/components/features/admin/dashboard/DashboardAlertCard';
import { DashboardReservations }   from '@/components/features/admin/dashboard/DashboardReservations';
import { DashboardMemoCard }       from '@/components/features/admin/dashboard/DashboardMemoCard';
import { getJstDateLabel } from '@/lib/date-utils';
import { getAdminNotificationSummary } from '@/lib/actions/admin-notifications';

function Skeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[18px] bg-[#1c1d22] ${className}`} />;
}

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();
  const notifications = await getAdminNotificationSummary();

  return (
    <div className="space-y-4 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-3 border-b border-[#ffffff08] mb-1">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[18px] font-bold text-[#f4f1ea] tracking-tight">本日の営業概要</h1>
          <p className="text-[12px] text-[#8a8478] tracking-[0.1px] opacity-70">今日の営業判断に必要な情報を網羅的に確認できます</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#ffffff0a] rounded-[10px] border border-[#ffffff0f]">
            <Calendar size={14} className="text-[#dfbd69]" />
            <span className="text-[11px] font-bold text-[#c7c0b2] tracking-[3px] uppercase">{dateLabel}</span>
          </div>

          <div className="hidden sm:block">
            <DashboardSearchBar />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/internal-notices"
              className="p-2.5 bg-[#ffffff0a] rounded-[10px] border border-[#ffffff0f] hover:bg-[#ffffff15] hover:border-[#dfbd6930] transition-all relative group"
              title="通知一覧"
            >
              <Bell size={16} className="text-[#c7c0b2] group-hover:text-[#dfbd69] transition-colors" />
              {notifications.total > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dfbd69] px-0.5 text-[9px] font-bold leading-none text-[#0b0b0d] shadow-[0_0_8px_rgba(223,189,105,0.6)] border border-black">
                  {notifications.total > 99 ? '99+' : notifications.total}
                </span>
              )}
            </Link>

            <Link
              href="/admin/today"
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[12px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-gold/15"
              style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
            >
              <Plus size={16} strokeWidth={3} />
              来店予定を追加
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <Suspense fallback={<Skeleton className="h-[110px]" />}>
        <DashboardKPIs />
      </Suspense>

      {/* ── 本日の営業状況（全幅）── */}
      <Suspense fallback={<Skeleton className="h-72" />}>
        <DashboardTodayOps />
      </Suspense>

      {/* ── 本日の出勤キャスト（全幅）── */}
      <Suspense fallback={<Skeleton className="h-80" />}>
        <DashboardTodayShifts />
      </Suspense>

      {/* ── キャスト行動成績評価 ＋ 重要アラート ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr] gap-4">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardCastRanking />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardAlertCard />
        </Suspense>
      </div>

      {/* ── 来店予定一覧 ＋ 営業メモ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr] gap-4">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardReservations />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardMemoCard />
        </Suspense>
      </div>
    </div>
  );
}
