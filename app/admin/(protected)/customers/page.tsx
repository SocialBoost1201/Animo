import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { Phone, Mail, Smartphone, Calendar, Users, Filter, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  reserve: { label: '予約', color: 'bg-purple-100 text-purple-700' },
  contact: { label: '問い合わせ', color: 'bg-gray-100 text-gray-700' },
};

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
      <div className="flex gap-1 border-b border-gray-200">
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

      {/* Contact List */}
      <div className="space-y-3">
        {contacts && contacts.length > 0 ? (
          contacts.map((contact: any) => {
            const isUnread = !contact.is_read;
            const dateStr = contact.created_at.slice(0, 16).replace('T', ' ');
            const typeConfig = TYPE_MAP[contact.type] ?? { label: contact.type, color: 'bg-gray-100 text-gray-600' };

            return (
              <div
                key={contact.id}
                className={`bg-white border shadow-sm transition-all ${
                  isUnread ? 'border-amber-200' : 'border-gray-100'
                }`}
              >
                {/* Card Header */}
                <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                    <h3 className={`text-base ${isUnread ? 'font-bold text-[#171717]' : 'text-gray-500'}`}>
                      {contact.name} 様
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{dateStr}</span>
                    {isUnread && (
                      <form action={handleMarkAsRead}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <CheckCircle size={14} />
                          既読
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 text-sm">
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={13} className="text-gray-300 shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.contact_method && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={13} className="text-gray-300 shrink-0" />
                        <span className="truncate">{contact.contact_method}</span>
                      </div>
                    )}
                    {contact.line_id && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Smartphone size={13} className="text-gray-300 shrink-0" />
                        <span>LINE: {contact.line_id}</span>
                      </div>
                    )}
                    {contact.date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={13} className="text-gray-300 shrink-0" />
                        <span>{contact.date} {contact.time?.slice(0, 5)}</span>
                      </div>
                    )}
                    {contact.people && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={13} className="text-gray-300 shrink-0" />
                        <span>{contact.people}名</span>
                      </div>
                    )}
                    {contact.cast_name && (
                      <div className="col-span-2 text-gray-500 text-xs">
                        指名: {contact.cast_name}
                      </div>
                    )}
                  </div>

                  {contact.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  )}

                  {/* Reply Form */}
                  <div className="mt-3">
                    <ReplyForm
                      id={contact.id}
                      table="contacts"
                      customerName={contact.name || 'お客様'}
                      toEmail={contact.contact_method || ''}
                      repliedAt={contact.replied_at}
                      replyText={contact.reply_text}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-100 p-12 text-center text-gray-400 text-sm">
            <Filter size={24} className="mx-auto mb-3 text-gray-200" />
            {filter === 'unread' ? '未読の問い合わせはありません' : 'まだ問い合わせ・予約がありません'}
          </div>
        )}
      </div>
    </div>
  );
}
