import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { EmptyState, SectionCard, SectionHeader, StatusBadge } from '@/components/ui/app-shell';
import { Button } from '@/components/ui/Button';

type ShiftWithCast = {
  id: string;
  start_time: string | null;
  end_time: string | null;
  casts: {
    stage_name: string;
    slug: string | null;
  } | null;
};

export async function DashboardTodayShifts({ date }: { date: string }) {
  const supabase = await createClient();

  const { data: todayShifts } = await supabase
    .from('cast_schedules')
    .select('*, casts(stage_name, slug)')
    .eq('work_date', date);

  return (
    <SectionCard className="space-y-5">
      <SectionHeader
        eyebrow="Today"
        title={`本日の出勤予定 (${date})`}
        description="営業開始前に、誰が何時から出勤するかを一覧で確認できます。"
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/shifts">シフト管理</Link>
          </Button>
        }
      />
      <div className="divide-y divide-gray-100 overflow-hidden rounded-[20px] border border-black/5 bg-[#fcfcfb]">
        {todayShifts && todayShifts.length > 0 ? (
          todayShifts.map((shift: ShiftWithCast) => (
            <div key={shift.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="space-y-1">
                <p className="font-semibold tracking-[-0.02em] text-[#171717]">
                  {shift.casts?.stage_name ?? '—'}
                </p>
                <StatusBadge tone="accent">出勤予定</StatusBadge>
              </div>
              <span className="text-sm font-medium text-gray-500 font-mono">
                {shift.start_time?.slice(0, 5)} — {shift.end_time?.slice(0, 5) ?? 'LAST'}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4">
            <EmptyState
              title="本日の出勤登録はありません"
              description="まだスケジュールが承認・登録されていません。シフト管理から登録を進めてください。"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/shifts">登録する</Link>
                </Button>
              }
            />
          </div>
        )}
      </div>
    </SectionCard>
  );
}
