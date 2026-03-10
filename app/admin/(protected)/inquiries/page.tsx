import { createClient } from '@/lib/supabase/server';
import { RealtimeInbox } from '@/components/features/admin/RealtimeInbox';
import { ReplyForm } from '@/components/features/admin/ReplyForm';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const supabase = await createClient();

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

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

      {/* Realtime リスト（新規着信を自動反映） */}
      <RealtimeInbox initialContacts={contacts ?? []} />

      {/* 返信フォーム群は元のcontactsから描画（サーバー側で返信済みデータを持つ） */}
      {contacts && contacts.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-400 tracking-widest uppercase border-b border-gray-100 pb-2">
            返信フォーム
          </p>
          {contacts.map((c: { id: string; name?: string; contact_method?: string; replied_at?: string; reply_text?: string }) => (
            <div key={c.id} className="bg-white border border-gray-100 px-5 py-4">
              <p className="text-sm font-bold text-[#171717] mb-3">{c.name} 様 への返信</p>
              <ReplyForm
                id={c.id}
                table="contacts"
                customerName={c.name || 'お客様'}
                toEmail={c.contact_method || ''}
                repliedAt={c.replied_at}
                replyText={c.reply_text}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
