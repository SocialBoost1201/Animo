import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type RecentContact = {
  id: string;
  name: string;
  type: string;
  created_at: string;
  is_read: boolean;
};

export async function DashboardRecentContacts() {
  const supabase = await createClient();

  const { data: recentContacts } = await supabase
    .from('contacts')
    .select('id, name, type, created_at, is_read')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="bg-white border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-widest text-[#171717] uppercase">最新の問い合わせ</h3>
        <Link href="/admin/customers" className="text-xs text-gold hover:underline">全て表示 →</Link>
      </div>
      <div className="divide-y divide-gray-50">
        {recentContacts && recentContacts.length > 0 ? (
          recentContacts.map((c: RecentContact) => (
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
  );
}
