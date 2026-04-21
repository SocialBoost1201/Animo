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

function Skeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[18px] bg-[#1c1d22] ${className}`} />;
}

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();

  return (
    <div className="space-y-10 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 py-4 border-b border-[#ffffff08] mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#f4f1ea] tracking-tight">本日の営業概要</h1>
          <p className="text-[13px] text-[#8a8478] tracking-[0.1px] opacity-70">今日の営業判断に必要な情報を網羅的に確認できます</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#ffffff0a] rounded-[12px] border border-[#ffffff0f] shadow-lg">
            <Calendar size={15} className="text-[#dfbd69]" />
            <span className="text-[12px] font-bold text-[#c7c0b2] tracking-[4px] uppercase">{dateLabel}</span>
          </div>

          <div className="hidden sm:block">
            <DashboardSearchBar />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/internal-notices"
              className="p-3 bg-[#ffffff0a] rounded-[12px] border border-[#ffffff0f] hover:bg-[#ffffff15] hover:border-[#dfbd6930] transition-all relative group"
              title="通知一覧"
            >
              <Bell size={18} className="text-[#c7c0b2] group-hover:text-[#dfbd69] transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#dfbd69] shadow-[0_0_10px_rgba(223,189,105,0.8)] border border-black" />
            </Link>

            <Link
              href="/admin/today"
              className="flex items-center gap-2.5 px-6 py-3 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-gold/20"
              style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
            >
              <Plus size={18} strokeWidth={3} />
              来店予定を追加
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <Suspense fallback={<Skeleton className="h-[180px]" />}>
        <DashboardKPIs />
      </Suspense>

      {/* ── 本日の営業状況（全幅）── */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <DashboardTodayOps />
      </Suspense>

      {/* ── 本日の出勤キャスト（全幅）── */}
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <DashboardTodayShifts />
      </Suspense>

      {/* ── キャスト行動成績評価 ＋ 重要アラート ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr] gap-8">
        <Suspense fallback={<Skeleton className="h-80" />}>
          <DashboardCastRanking />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-80" />}>
          <DashboardAlertCard />
        </Suspense>
      </div>

      {/* ── 来店予定一覧 ＋ 営業メモ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr] gap-8">
        <Suspense fallback={<Skeleton className="h-80" />}>
          <DashboardReservations />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-80" />}>
          <DashboardMemoCard />
        </Suspense>
      </div>
    </div>
  );
}
