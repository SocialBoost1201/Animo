import { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, Bell, Plus } from 'lucide-react';

import { DashboardKPIs }          from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardCastRanking }    from '@/components/features/admin/dashboard/DashboardCastRanking';
import { DashboardAlertCard }      from '@/components/features/admin/dashboard/DashboardAlertCard';
import { DashboardShiftCoverage }  from '@/components/features/admin/dashboard/DashboardShiftCoverage';
import { DashboardQuickActions }   from '@/components/features/admin/dashboard/DashboardQuickActions';
import { getJstDateLabel } from '@/lib/date-utils';

function Skeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[18px] bg-[#1c1d22] ${className}`} />;
}

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();

  return (
    <div className="space-y-[14px] font-inter">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between h-[49px]">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">ダッシュボード</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">KPI・アラート・主要指標の一覧</p>
        </div>

        <div className="flex items-center gap-[10px]">
          {/* Date pill */}
          <div className="flex items-center gap-2 h-[37px] px-4 bg-[#ffffff06] rounded-[10px] border border-[#8a8478]">
            <Calendar size={13} className="text-[#c7c0b2]" />
            <span className="text-[11px] font-medium text-[#c7c0b2] tracking-[3.06px]">{dateLabel}</span>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 h-[37px] px-3 bg-[#ffffff06] rounded-[10px] border border-[#8a8478] w-[208px]">
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" className="shrink-0">
              <circle cx="5" cy="5" r="4" stroke="#c7c0b2" strokeOpacity="0.5" strokeWidth="1.2" />
              <path d="M8 9l2 2" stroke="#c7c0b2" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="検索..."
              className="bg-transparent border-none outline-none text-[12px] text-[#c7c0b2] placeholder-[#c7c0b280] w-full"
            />
          </div>

          {/* Filter button */}
          <button className="h-[37px] w-[32px] flex items-center justify-center bg-[#ffffff06] rounded-[9px] border border-[#8a8478] hover:bg-[#ffffff10] transition-colors relative">
            <Bell size={13} className="text-[#c7c0b2]" />
            <span className="absolute top-[5px] right-[4px] w-[6px] h-[6px] rounded-[3px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
          </button>

          {/* CTA */}
          <Link
            href="/admin/today"
            className="flex items-center justify-center gap-1.5 h-[37px] w-[132px] rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
          >
            来店予定を追加
            <Plus size={12} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <Suspense fallback={<Skeleton className="h-[150px]" />}>
        <DashboardKPIs />
      </Suspense>

      {/* ── 2-Column Main Layout ── */}
      {/* left: main content / right: sidebar panels (fixed ~265px) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_265px] gap-[14px] items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-[14px] min-w-0">
          {/* キャスト行動成績評価 */}
          <Suspense fallback={<Skeleton className="h-[498px]" />}>
            <DashboardCastRanking />
          </Suspense>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-[14px] xl:sticky xl:top-6">
          {/* クイックアクション */}
          <DashboardQuickActions />

          {/* シフト充足率 */}
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DashboardShiftCoverage />
          </Suspense>

          {/* 重要アラート */}
          <Suspense fallback={<Skeleton className="h-[280px]" />}>
            <DashboardAlertCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
