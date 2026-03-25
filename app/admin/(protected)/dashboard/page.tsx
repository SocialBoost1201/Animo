import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Calendar } from 'lucide-react';

import { DashboardKPIs } from '@/components/features/admin/dashboard/DashboardKPIs';
import { DashboardTotals } from '@/components/features/admin/dashboard/DashboardTotals';
import { DashboardCharts } from '@/components/features/admin/dashboard/DashboardCharts';
import { DashboardTodayShifts } from '@/components/features/admin/dashboard/DashboardTodayShifts';
import { PageHeader, PageShell } from '@/components/ui/app-shell';
import { Button } from '@/components/ui/Button';

function DashboardSkeleton({ className = 'h-32' }: { className?: string }) {
  return <div className={`w-full animate-pulse rounded-[24px] bg-gray-100 ${className}`} />;
}

export default async function DashboardPage() {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 9);
  const today = currentDate.toISOString().split('T')[0];

  return (
    <PageShell width="wide" className="space-y-6">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="営業全体をひと目で把握できる管理ダッシュボード"
        description={`${today} のサマリーです。数値確認、出勤状況、承認や登録への導線をここから迷わず進められる構成に整えます。`}
        actions={
          <>
            <Button asChild className="w-full md:w-auto">
              <Link href="/admin/human-resources/new">
                <Plus size={14} /> キャスト追加
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/admin/shifts">
                <Calendar size={14} /> シフト登録
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <Suspense fallback={<DashboardSkeleton className="h-32" />}>
        <DashboardKPIs />
      </Suspense>

      {/* 累計サマリー */}
      <Suspense fallback={<DashboardSkeleton className="h-28" />}>
        <DashboardTotals />
      </Suspense>

      {/* 月次推移グラフ */}
      <Suspense fallback={<DashboardSkeleton className="h-72" />}>
        <DashboardCharts />
      </Suspense>

      <div className="grid grid-cols-1 gap-6">
        {/* 本日の出勤 */}
        <Suspense fallback={<DashboardSkeleton className="h-64" />}>
          <DashboardTodayShifts date={today} />
        </Suspense>
      </div>
    </PageShell>
  );
}
