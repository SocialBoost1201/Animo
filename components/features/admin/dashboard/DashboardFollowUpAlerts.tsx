import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PhoneCall, Clock, Crown, AlertCircle } from 'lucide-react';

const RANK_LABEL: Record<string, { label: string; color: string }> = {
  normal:  { label: 'Normal',  color: 'bg-gray-100 text-gray-600' },
  bronze:  { label: 'Bronze',  color: 'bg-amber-100 text-amber-700' },
  silver:  { label: 'Silver',  color: 'bg-slate-100 text-slate-600' },
  gold:    { label: 'Gold',    color: 'bg-yellow-100 text-yellow-700' },
  vip:     { label: 'VIP',     color: 'bg-purple-100 text-purple-700' },
  black:   { label: 'Black',   color: 'bg-gray-900 text-white' },
};

export async function DashboardFollowUpAlerts() {
  const supabase = await createClient();

  // 最終来店日から60日以上経過 or 一度も来店記録がない VIP/Gold 以上の顧客
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: atRiskCustomers } = await supabase
    .from('customers')
    .select('id, name, phone, rank, total_visits, last_visit_date, notes')
    .in('rank', ['gold', 'vip', 'bronze', 'silver'])
    .or(`last_visit_date.lte.${sixtyDaysAgo},last_visit_date.is.null`)
    .order('rank', { ascending: false })
    .limit(5);

  if (!atRiskCustomers || atRiskCustomers.length === 0) {
    return null; // フォローアップが必要な顧客がいない場合は非表示
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
        <AlertCircle size={16} className="text-amber-500" />
        <h2 className="text-sm font-bold tracking-widest text-[#171717]">フォローアップアラート</h2>
        <span className="ml-auto text-[10px] text-gray-400 font-mono">最終来店60日超のVIP/Gold顧客</span>
      </div>
      <div className="divide-y divide-gray-50">
        {atRiskCustomers.map((c) => {
          const rank = RANK_LABEL[c.rank] ?? RANK_LABEL.normal;
          const daysSince = c.last_visit_date
            ? Math.floor((Date.now() - new Date(c.last_visit_date).getTime()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div key={c.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Crown size={14} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-[#171717] truncate">{c.name} 様</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rank.color}`}>{rank.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {daysSince !== null ? (
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Clock size={11} /> {daysSince}日未来店
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> 来店記録なし
                    </span>
                  )}
                  <span>来店{c.total_visits ?? 0}回</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-sm font-bold transition-colors"
                  >
                    <PhoneCall size={12} /> 発信
                  </a>
                )}
                <Link
                  href={`/admin/customers/${c.id}`}
                  className="text-xs text-gray-400 hover:text-gold px-2 py-1.5 transition-colors font-bold"
                >
                  詳細
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
