import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
    <div className="bg-white border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-widest text-[#171717] uppercase">本日の出勤 ({date})</h3>
        <Link href="/admin/shifts" className="text-xs text-gold hover:underline">シフト管理 →</Link>
      </div>
      <div className="divide-y divide-gray-50">
        {todayShifts && todayShifts.length > 0 ? (
          todayShifts.map((shift: ShiftWithCast) => (
            <div key={shift.id} className="px-6 py-3 flex items-center justify-between">
              <span className="font-bold text-sm text-[#171717]">{shift.casts?.stage_name ?? '—'}</span>
              <span className="text-xs text-gray-500 font-mono">
                {shift.start_time?.slice(0, 5)} — {shift.end_time?.slice(0, 5) ?? 'LAST'}
              </span>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            本日の出勤登録はありません
            <Link href="/admin/shifts" className="block mt-2 text-gold text-xs hover:underline">登録する →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
