import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { Mail, Calendar, Users, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const supabase = await createClient();

  // 受信箱は contacts のみ（求人応募は /admin/applications へ）
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  const unread = contacts?.filter((c) => !c.is_read) ?? [];

  async function handleMarkAsRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await markAsRead('contacts', id);
    revalidatePath('/admin/inquiries');
    revalidatePath('/admin/dashboard');
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">受信箱</h1>
        <p className="text-sm text-gray-400 mt-1">
          予約・お問い合わせの受信箱。求人応募は
          <a href="/admin/applications" className="underline text-gold ml-1">求人応募管理</a>
          をご覧ください。
        </p>
      </div>

      {unread.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-center justify-between">
          <p className="text-sm text-amber-800 font-bold">未読 {unread.length}件 があります</p>
          <a href="/admin/customers?filter=unread" className="text-xs text-amber-700 underline">詳細を見る</a>
        </div>
      )}

      <div className="space-y-3">
        {contacts && contacts.length > 0 ? (
          contacts.map((c: { id: string; is_read: boolean; created_at: string; type: string; name: string; contact_method?: string; date?: string; time?: string; people?: number; message?: string; replied_at?: string; reply_text?: string; }) => {
            const isUnread = !c.is_read;
            const dateStr = c.created_at.slice(0, 16).replace('T', ' ');
            return (
              <div
                key={c.id}
                className={`bg-white border shadow-sm ${isUnread ? 'border-amber-200' : 'border-gray-100'}`}
              >
                <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.type === 'reserve' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>{c.type === 'reserve' ? '予約' : '問い合わせ'}</span>
                    <h3 className={`text-base ${isUnread ? 'font-bold text-[#171717]' : 'text-gray-500'}`}>
                      {c.name} 様
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{dateStr}</span>
                    {isUnread && (
                      <form action={handleMarkAsRead}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle size={14} /> 既読
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-3 py-3 text-sm">
                    {c.contact_method && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={13} className="text-gray-300" />
                        {c.contact_method}
                      </div>
                    )}
                    {c.date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={13} className="text-gray-300" />
                        {c.date} {c.time?.slice(0, 5)}
                      </div>
                    )}
                    {c.people && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={13} className="text-gray-300" />
                        {c.people}名
                      </div>
                    )}
                  </div>
                  {c.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 leading-relaxed whitespace-pre-wrap rounded-sm">
                      {c.message}
                    </p>
                  )}
                  <div className="mt-3">
                    <ReplyForm
                      id={c.id}
                      table="contacts"
                      customerName={c.name || 'お客様'}
                      toEmail={c.contact_method || ''}
                      repliedAt={c.replied_at}
                      replyText={c.reply_text}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-100 p-12 text-center text-sm text-gray-400">
            問い合わせ・予約はまだありません
          </div>
        )}
      </div>
    </div>
  );
}
