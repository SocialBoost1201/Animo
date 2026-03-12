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

  // 顧客リストとそれに紐づく連絡履歴の取得
  const { data: customersData, error } = await supabase
    .from('customers')
    .select('*, contacts(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
  }

  type ContactData = { id: string; customer_id?: string; name: string; phone?: string; contact_method?: string; line_id?: string; created_at: string; type: string; is_read: boolean; message?: string; date?: string; time?: string; people?: number; replied_at?: string; reply_text?: string; cast_name?: string };
  type CustomerData = { id: string; customerId?: string | null; primaryName: string; phone?: string | null; email?: string | null; lineId?: string | null; contacts: ContactData[]; reserveCount: number; contactCount: number; lastContact: string };
  
  type CustomerRow = {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    line_id: string | null;
    rank: string;
    total_visits: number;
    notes: string | null;
    created_at: string;
    contacts: ContactData[];
  };

  const customers = (customersData as CustomerRow[]) || [];

  let customerList = customers.map(c => {
    // 連絡履歴を降順ソート
    const sortedContacts = [...(c.contacts || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const reserveCount = sortedContacts.filter(ct => ct.type === 'reserve').length;
    const contactCount = sortedContacts.filter(ct => ct.type === 'contact').length;
    const hasUnread = sortedContacts.some(ct => !ct.is_read);
    const lastContact = sortedContacts.length > 0
      ? sortedContacts[0].created_at.slice(0, 16).replace('T', ' ')
      : c.created_at.slice(0, 16).replace('T', ' ');

    return {
      id: c.id,
      customerId: c.id,
      primaryName: c.name,
      phone: c.phone,
      email: c.email,
      lineId: c.line_id,
      contacts: sortedContacts,
      reserveCount,
      contactCount,
      lastContact,
      hasUnread
    };
  });

  // フィルタリング
  if (filter === 'reserve') {
    customerList = customerList.filter(c => c.reserveCount > 0);
  } else if (filter === 'contact') {
    customerList = customerList.filter(c => c.contactCount > 0);
  } else if (filter === 'unread') {
    customerList = customerList.filter(c => c.hasUnread);
  }

  // 最新の連絡が上のものから順に表示
  customerList.sort((a,b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime());

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

  const unreadCount = customers.reduce((acc, c) => acc + (c.contacts?.filter(ct => !ct.is_read).length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">顧客リスト</h1>
          <p className="text-sm text-gray-400 mt-1">
            {customerList.length}件のデータ
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
