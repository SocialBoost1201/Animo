import { Suspense } from 'react';
import Link from 'next/link';
import {
  Calendar, Briefcase, Bell, UserPlus, AlertTriangle, ClipboardList, ChevronRight, Plus, type LucideIcon,
} from 'lucide-react';

import { DashboardKPIs }          from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardTotals }         from '@/components/features/admin/dashboard/DashboardTotals';
import { DashboardCharts }         from '@/components/features/admin/dashboard/DashboardCharts';
import { DashboardTodayOps }       from '@/components/features/admin/dashboard/DashboardTodayOps';
import { DashboardReservations }   from '@/components/features/admin/dashboard/DashboardReservations';
import { DashboardTodayShifts }    from '@/components/features/admin/dashboard/DashboardTodayShifts';
import { DashboardCastRanking }    from '@/components/features/admin/dashboard/DashboardCastRanking';
import { DashboardShiftCoverage }  from '@/components/features/admin/dashboard/DashboardShiftCoverage';
import { getDashboardKPIs }        from '@/lib/actions/dashboard';
import { getJstDateLabel } from '@/lib/date-utils';

function Skeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[18px] bg-[#1c1d22] ${className}`} />;
}

// ─── クイックアクション + 重要アラート ───
async function QuickActionsPanel() {
  const kpi = await getDashboardKPIs();

  const actions: { label: string; href: string; icon: LucideIcon; primary?: boolean }[] = [
    { label: '来店予定を登録',    href: '/admin/today',               icon: Calendar, primary: true },
    { label: '本日の出勤確認',    href: '/admin/today',               icon: ClipboardList },
    { label: '求人応募を確認',    href: '/admin/applications',        icon: Briefcase },
    { label: 'キャストを追加',    href: '/admin/human-resources/new', icon: UserPlus },
    { label: 'お知らせを投稿',    href: '/admin/internal-notices',    icon: Bell },
  ];

  const alerts: { label: string; detail: string; level: 'warn' | 'danger' }[] = [];
  if (kpi.shiftMissingCount > 0)
    alerts.push({ label: 'シフト未提出', detail: `${kpi.shiftMissingCount}名が今週未提出`, level: 'warn' });
  if (kpi.unconfirmedCount > 0)
    alerts.push({ label: '出勤未確認', detail: `${kpi.unconfirmedCount}名が確認待ち`, level: 'danger' });
  if (kpi.unreadApplications > 0)
    alerts.push({ label: '未返信案件', detail: `応募返信待ち ${kpi.unreadApplications}件`, level: 'warn' });

  return (
    <div className="space-y-3">
      {/* クイックアクション */}
      <div className="bg-[#17181c] border border-[#ffffff0f] rounded-[18px] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ffffff0f]">
          <h2 className="text-[13px] font-semibold text-[#f4f1ea]">クイックアクション</h2>
        </div>
        <div className="divide-y divide-[#ffffff0a]">
          {actions.map((a) => {
            const Icon = a.icon;
            if (a.primary) {
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-2.5 mx-5 my-4 px-4 py-3 rounded-[10px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#dfbd691a]"
                  style={{ background: 'linear-gradient(90deg, #dfbd69 0%, #926f34 100%)' }}
                >
                  <Plus size={16} strokeWidth={3} />
                  {a.label}
                </Link>
              );
            }
            return (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[#ffffff05] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center group-hover:bg-[#dfbd691a] group-hover:border-[#dfbd6930] transition-colors">
                    <Icon size={13} className="text-[#8a8478] group-hover:text-[#dfbd69]" />
                  </div>
                  <span className="text-[13px] font-medium text-[#cbc3b3] group-hover:text-white transition-colors">
                    {a.label}
                  </span>
                </div>
                <ChevronRight size={12} className="text-[#5a5650] group-hover:text-[#dfbd69] transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 重要アラート */}
      {alerts.length > 0 && (
        <div className="bg-[#17181c] border border-[#ffffff0f] rounded-[18px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#ffffff0f]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={12} className="text-[#c8884d]" />
              <h2 className="text-[13px] font-semibold text-[#f4f1ea]">重要アラート</h2>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {alerts.map((a) => (
              <div
                key={a.label}
                className="rounded-[10px] border p-3"
                style={
                  a.level === 'danger'
                    ? { borderColor: '#c8823226', backgroundColor: '#c882321a' }
                    : { borderColor: '#c8a03c26', backgroundColor: '#c8a03c1a' }
                }
              >
                <p className="text-[11px] font-bold" style={{ color: a.level === 'danger' ? '#c8884d' : '#c8a84d' }}>{a.label}</p>
                <p className="text-[11px] text-[#8a8478] mt-0.5">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header (Mockup Refined) ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">本日の営業状況</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">今日の営業判断に必要な情報を確認できます</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 日付 (Mockup Style) */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-[#ffffff0f]">
            <Calendar size={13} className="text-[#8a8478]" />
            <span className="text-[11px] font-medium text-[#c7c0b2] tracking-[3.06px] uppercase">{dateLabel}</span>
          </div>

          {/* 検索バー (Mockup Icon style) */}
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

             {/* 来店予定を追加 (Premium Gradient) */}
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

      {/* ── 中段: 本日の営業状況 ＋ クイックアクション ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-72" />}>
            <DashboardTodayOps />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <QuickActionsPanel />
          </Suspense>
        </div>
      </div>

      {/* ── 本日の出勤キャスト ── */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <DashboardTodayShifts />
      </Suspense>

      {/* ── 来店予定一覧 ── */}
      <Suspense fallback={<Skeleton className="h-56" />}>
        <DashboardReservations />
      </Suspense>

      {/* ── キャスト成績 ＋ シフト充足率 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardCastRanking />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardShiftCoverage />
        </Suspense>
      </div>

      {/* ── 既存: 月次推移グラフ ＋ 累計サマリー ── */}
      <Suspense fallback={<Skeleton className="h-72" />}>
        <DashboardCharts />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-28" />}>
        <DashboardTotals />
      </Suspense>
    </div>
  );
}
