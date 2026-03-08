import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { CustomerCard } from '@/components/features/admin/CustomerCard';

export const dynamic = 'force-dynamic';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = 'all' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'reserve') query = query.eq('type', 'reserve');
  else if (filter === 'contact') query = query.eq('type', 'contact');
  else if (filter === 'unread') query = query.eq('is_read', false);

  const { data: contacts } = await query;

  // CRM: 顧客（phone または contact_method）単位でグループ化する処理
  const customersMap = new Map<string, any>();

  contacts?.forEach((c: any) => {
    // 同一人物の識別キー（電話番号、なければメールアドレス、どちらもなければ名前＋IDで仮設定）
    const key = c.phone || c.contact_method || `unknown-${c.name}-${c.id}`;

    if (!customersMap.has(key)) {
      customersMap.set(key, {
        id: key,
        primaryName: c.name,
        phone: c.phone,
        email: c.contact_method?.includes('@') ? c.contact_method : null,
        lineId: c.line_id,
        contacts: [],
        reserveCount: 0,
        contactCount: 0,
        lastContact: c.created_at.slice(0, 16).replace('T', ' '),
      });
    }

    const customer = customersMap.get(key)!;
    customer.contacts.push(c);
    
    if (c.type === 'reserve') customer.reserveCount++;
    if (c.type === 'contact') customer.contactCount++;
    
    // 名前の更新（より新しいデータがあれば上書き、今回は降順取得なので最初の1件が最新）
    if (!customer.phone && c.phone) customer.phone = c.phone;
    if (!customer.email && c.contact_method?.includes('@')) customer.email = c.contact_method;
    if (!customer.lineId && c.line_id) customer.lineId = c.line_id;
  });

  const customerList = Array.from(customersMap.values());

  async function handleMarkAsRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await markAsRead('contacts', id);
    revalidatePath('/admin/customers');
    revalidatePath('/admin/dashboard');
  }

  const tabs = [
    { key: 'all', label: '全て' },
    { key: 'reserve', label: '予約' },
    { key: 'contact', label: '問い合わせ' },
    { key: 'unread', label: '未読のみ' },
  ];

  const unreadCount = contacts?.filter((c) => !c.is_read).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">顧客リスト</h1>
          <p className="text-sm text-gray-400 mt-1">
            {contacts?.length ?? 0}件のデータ
            {unreadCount > 0 && <span className="ml-2 text-amber-600 font-bold">（未読 {unreadCount}件）</span>}
          </p>
        </div>

        {/* CSV Export */}
        <a
          href={`/api/admin/export/contacts`}
          className="flex items-center gap-2 text-xs border border-gray-200 px-4 py-2.5 text-gray-600 hover:border-gray-400 transition-colors"
        >
          CSVエクスポート
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar whitespace-nowrap -mx-6 px-6 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={`/admin/customers${tab.key !== 'all' ? `?filter=${tab.key}` : ''}`}
            className={`px-4 py-2.5 text-sm font-medium tracking-wide transition-colors ${
              filter === tab.key || (tab.key === 'all' && filter === 'all')
                ? 'border-b-2 border-gold text-[#171717] -mb-px'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Contact / CRM List */}
      <div className="space-y-4">
        {customerList.length > 0 ? (
          customerList.map((customer) => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              handleMarkAsRead={handleMarkAsRead} 
            />
          ))
        ) : (
          <div className="bg-white border border-gray-100 p-12 text-center text-gray-400 text-sm">
            {filter === 'unread' ? '未読の問い合わせはありません' : 'まだ問い合わせ・予約がありません'}
          </div>
        )}
      </div>
    </div>
  );
}
