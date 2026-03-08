import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Users, Calendar, MessageSquare, Briefcase, TrendingUp, ArrowRight, Plus,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [
    { count: castsCount },
    { count: unreadContacts },
    { count: unreadApps },
    { count: totalContacts },
    { count: totalApps },
    { data: todayShifts },
    { data: recentContacts },
  ] = await Promise.all([
    supabase.from('casts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('recruit_applications').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('recruit_applications').select('*', { count: 'exact', head: true }),
    supabase
      .from('cast_schedules')
      .select('*, casts(stage_name, slug)')
      .eq('work_date', today),
    supabase
      .from('contacts')
      .select('id, name, type, created_at, is_read')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const kpis = [
    {
      label: '在籍キャスト',
      value: castsCount ?? 0,
      unit: '名',
      icon: Users,
      href: '/admin/casts',
      color: 'from-slate-800 to-slate-700',
    },
    {
      label: '未読の問い合わせ',
      value: unreadContacts ?? 0,
      unit: '件',
      icon: MessageSquare,
      href: '/admin/customers',
      color: unreadContacts ? 'from-amber-700 to-amber-600' : 'from-slate-800 to-slate-700',
      highlight: !!unreadContacts,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">{today} のサマリー</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/casts/new"
            className="flex items-center gap-2 text-xs bg-[#171717] text-white px-4 py-2.5 hover:bg-gold transition-colors"
          >
            <Plus size={14} /> キャスト追加
          </Link>
          <Link
            href="/admin/shifts"
            className="flex items-center gap-2 text-xs border border-gray-200 text-gray-600 px-4 py-2.5 hover:border-gray-400 transition-colors"
          >
            <Calendar size={14} /> シフト登録
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* 累計サマリー */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-gray-400" />
            <p className="text-xs tracking-widest text-gray-400 uppercase">累計お問い合わせ</p>
          </div>
          <p className="text-2xl font-serif text-[#171717]">{totalContacts ?? 0}<span className="text-sm text-gray-400 ml-1">件</span></p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={14} className="text-gray-400" />
            <p className="text-xs tracking-widest text-gray-400 uppercase">累計求人応募</p>
          </div>
          <p className="text-2xl font-serif text-[#171717]">{totalApps ?? 0}<span className="text-sm text-gray-400 ml-1">件</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新問い合わせ */}
        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-widest text-[#171717] uppercase">最新の問い合わせ</h3>
            <Link href="/admin/customers" className="text-xs text-gold hover:underline">全て表示 →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts && recentContacts.length > 0 ? (
              recentContacts.map((c: any) => (
                <div key={c.id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {!c.is_read && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                    <p className={`text-sm truncate ${c.is_read ? 'text-gray-400' : 'font-bold text-[#171717]'}`}>
                      {c.name} 様
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      c.type === 'reserve' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>{c.type}</span>
                    <span className="text-[10px] text-gray-400">
                      {c.created_at.slice(5, 10).replace('-', '/')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-400">まだ問い合わせがありません</div>
            )}
          </div>
        </div>

        {/* 本日の出勤 */}
        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-widest text-[#171717] uppercase">本日の出勤 ({today})</h3>
            <Link href="/admin/shifts" className="text-xs text-gold hover:underline">シフト管理 →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayShifts && todayShifts.length > 0 ? (
              todayShifts.map((shift: any) => (
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
      </div>
    </div>
  );
}
