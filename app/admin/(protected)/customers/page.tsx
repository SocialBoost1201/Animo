import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, User, Phone, Mail, Star, TrendingUp, Plus, Pencil } from 'lucide-react';
import { DeleteCustomerButton } from '@/components/features/admin/customers/DeleteCustomerButton';

export const dynamic = 'force-dynamic';

const RANK_CONFIG: Record<string, { label: string; cls: string }> = {
  vip:     { label: '重要顧客', cls: 'bg-[#dfbd6914] text-[#dfbd69] border border-[#dfbd6920]' },
  regular: { label: '常連', cls: 'bg-[#72b89414] text-[#72b894] border border-[#72b89420]' },
  normal:  { label: '一般', cls: 'bg-[#1a1c22] text-[#e2ddd4] border border-[#dfbd69]/14' },
};

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('total_visits', { ascending: false })
    .limit(100);

  const total    = customers?.length ?? 0;
  const vipCount = customers?.filter((c) => c.rank === 'vip').length ?? 0;

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-[22px] border border-[#dfbd69]/22 bg-linear-to-br from-[#181510] via-[#131313] to-[#101010] px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">顧客データ</h1>
          <p className="text-[11px] text-[#c7c0b2]">登録顧客の管理と来店履歴の確認</p>
        </div>

        {/* 新規登録ボタン */}
        <Link
          href="/admin/customers/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#dfbd6920]"
          style={{ background: 'linear-gradient(90deg,rgba(223,189,105,1) 0%,rgba(146,111,52,1) 100%)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          顧客を新規登録
        </Link>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: '登録顧客数', value: total,    unit: '名', icon: User,       bg: 'bg-[#dfbd691a]', color: 'text-[#dfbd69]' },
          { label: '重要顧客', value: vipCount, unit: '名', icon: Star,        bg: 'bg-[#72b89414]', color: 'text-[#72b894]' },
          { label: '来店上位',  value: customers?.[0]?.total_visits ?? 0, unit: '回', icon: TrendingUp, bg: 'bg-[#6ab0d414]', color: 'text-[#6ab0d4]' },
        ].map((k) => (
          <div key={k.label} className="bg-[#17181c] rounded-[18px] border border-[#dfbd69]/18 px-5 py-4 flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            <div className={`w-[38px] h-[38px] flex items-center justify-center rounded-[10px] ${k.bg} shrink-0`}>
              <k.icon size={17} className={k.color} />
            </div>
            <div>
              <p className="text-[10px] text-[#a89d8a] uppercase tracking-wider mb-0.5">{k.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#f4f1ea] leading-none">{k.value}</span>
                <span className="text-[11px] text-[#c7c0b2]">{k.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Customer Table ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#dfbd69]/18 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3 px-5 h-[56px] border-b border-[#dfbd69]/12">
          <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px]">
            <BookOpen size={13} className="text-[#dfbd69]" />
          </div>
          <p className="text-[12px] font-semibold text-[#f4f1ea]">顧客一覧</p>
          <span className="ml-auto text-[10px] text-[#a89d8a]">{total}件</span>
        </div>

        {total === 0 ? (
          <div className="py-16 text-center">
            <User size={24} className="mx-auto mb-3 text-[#a89d8a]" />
            <p className="text-[12px] text-[#c7c0b2] italic mb-4">顧客データがありません</p>
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#dfbd69] hover:underline"
            >
              <Plus size={13} />
              最初の顧客を登録する
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c1d22] border-b border-[#dfbd69]/12">
                  {['顧客名', '連絡先', 'ランク', '来店回数', '備考', '操作'].map((h, i) => (
                    <th key={i} className="px-5 py-3">
                      <span className="text-[9px] font-bold tracking-[0.8px] text-[#a89d8a] uppercase">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfbd69]/10">
                {customers?.map((c) => {
                  const rank = RANK_CONFIG[c.rank] ?? RANK_CONFIG.normal;
                  return (
                    <tr key={c.id} className="hover:bg-[#181818] transition-colors group">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="text-[12px] font-semibold text-[#f4f1ea] hover:text-[#dfbd69] transition-colors"
                        >
                          {c.name || '–'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-[11px] text-[#c7c0b2] hover:text-[#f4f1ea]">
                              <Phone size={10} className="shrink-0" />{c.phone}
                            </a>
                          )}
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-[11px] text-[#c7c0b2] hover:text-[#f4f1ea]">
                              <Mail size={10} className="shrink-0" />
                              <span className="truncate max-w-[160px]">{c.email}</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rank.cls}`}>
                          {rank.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-bold text-[#f4f1ea]">{c.total_visits ?? 0}</span>
                        <span className="text-[10px] text-[#a89d8a] ml-1">回</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] text-[#c7c0b2] line-clamp-1">{c.note || '–'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="p-1.5 rounded-md text-[#c7c0b2] hover:text-[#dfbd69] hover:bg-[#dfbd691a] transition-colors"
                            title="編集"
                          >
                            <Pencil size={13} />
                          </Link>
                          <DeleteCustomerButton customerId={c.id} customerName={c.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
