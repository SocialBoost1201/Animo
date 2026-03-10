import { createClient } from '@/lib/supabase/server';
import { DashboardChartsClient } from './DashboardChartsClient';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

export async function DashboardCharts() {
  const supabase = await createClient();

  // 直近6ヶ月の日付範囲（例: 2025-08 〜 2026-01）
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return {
      label: format(d, 'M月'),
      start: startOfMonth(d).toISOString(),
      end: endOfMonth(d).toISOString(),
    };
  });

  // contacts (inquiries/reserves) と recruit_applications を取得
  const [
    { data: contacts },
    { data: applications }
  ] = await Promise.all([
    supabase.from('contacts').select('created_at, type').gte('created_at', months[0].start),
    supabase.from('recruit_applications').select('created_at').gte('created_at', months[0].start),
  ]);

  // 月ごとに集計
  const monthlyData = months.map(m => {
    const monthContacts = contacts?.filter(c => c.created_at >= m.start && c.created_at <= m.end) || [];
    const monthApps = applications?.filter(a => a.created_at >= m.start && a.created_at <= m.end) || [];

    return {
      month: m.label,
      inquiries: monthContacts.filter(c => c.type === 'contact').length,
      reserves: monthContacts.filter(c => c.type === 'reserve').length,
      applications: monthApps.length,
    };
  });

  return <DashboardChartsClient monthlyData={monthlyData} />;
}
