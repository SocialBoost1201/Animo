import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, Briefcase, Calendar, ArrowRight } from 'lucide-react';

export async function DashboardKPIs() {
  const supabase = await createClient();
  // eslint-disable-next-line react-hooks/purity
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [
    { count: castsCount },
    { count: unreadApps },
    { data: todayShifts },
  ] = await Promise.all([
    supabase.from('casts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('recruit_applications').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('cast_schedules').select('id').eq('work_date', today),
  ]);

  const kpis = [
    {
      label: '在籍キャスト',
      value: castsCount ?? 0,
      unit: '名',
      icon: Users,
      href: '/admin/human-resources',
      color: 'from-slate-800 to-slate-700',
    },

    {
      label: '未読の求人応募',
      value: unreadApps ?? 0,
      unit: '件',
      icon: Briefcase,
      href: '/admin/applications',
      color: unreadApps ? 'from-amber-700 to-amber-600' : 'from-slate-800 to-slate-700',
      highlight: !!unreadApps,
    },
    {
      label: '今日の出勤予定',
      value: todayShifts?.length ?? 0,
      unit: '名',
      icon: Calendar,
      href: '/admin/shifts',
      color: 'from-slate-800 to-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Link
            key={kpi.label}
            href={kpi.href}
            className={`relative bg-linear-to-br ${kpi.color} text-white p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden group`}
          >
            {kpi.highlight && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
            <Icon size={20} className="text-white/40 mb-4" />
            <p className="text-3xl font-serif font-bold">
              {kpi.value}
              <span className="text-sm font-sans font-normal text-white/60 ml-1">{kpi.unit}</span>
            </p>
            <p className="text-xs text-white/60 tracking-widest mt-1">{kpi.label}</p>
            <ArrowRight
              size={14}
              className="absolute bottom-4 right-4 text-white/20 group-hover:text-white/60 transition-colors"
            />
          </Link>
        );
      })}
    </div>
  );
}
