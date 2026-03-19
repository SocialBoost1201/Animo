import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Calendar } from 'lucide-react';

import { DashboardKPIs } from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardTotals } from '@/components/features/admin/dashboard/DashboardTotals';
import { DashboardCharts } from '@/components/features/admin/dashboard/DashboardCharts';
import { DashboardTodayShifts } from '@/components/features/admin/dashboard/DashboardTodayShifts';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
  const supabase = await createClient();

  const Skeleton = ({ className = 'h-32' }: { className?: string }) => (
    <div className={`w-full bg-gray-100 animate-pulse rounded-sm ${className}`} />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">{today} のサマリー</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link
            href="/admin/human-resources/new"
            className="flex-1 md:flex-none justify-center flex items-center gap-2 text-xs bg-[#171717] text-white px-4 py-3 md:py-2.5 hover:bg-gold transition-colors rounded-sm"
          >
            <Plus size={14} /> キャスト追加
          </Link>
          <Link
            href="/admin/shifts"
            className="flex-1 md:flex-none justify-center flex items-center gap-2 text-xs border border-gray-200 text-gray-600 px-4 py-3 md:py-2.5 hover:border-gray-400 transition-colors rounded-sm"
          >
            <Calendar size={14} /> シフト登録
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <DashboardKPIs />
      </Suspense>

      {/* 累計サマリー */}
      <Suspense fallback={<Skeleton className="h-28" />}>
        <DashboardTotals />
      </Suspense>

      {/* 月次推移グラフ */}
      <Suspense fallback={<Skeleton className="h-72" />}>
        <DashboardCharts />
      </Suspense>

      <div className="grid grid-cols-1 gap-6">
        {/* 本日の出勤 */}
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DashboardTodayShifts date={today} />
        </Suspense>
      </div>
    </div>
  );
}
