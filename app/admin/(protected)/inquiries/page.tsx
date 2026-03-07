import { getInquiries, markAsRead } from '@/lib/actions/inquiries'
import { Mail, Briefcase, Calendar } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { ReplyForm } from '@/components/features/admin/ReplyForm'

export default async function InquiriesPage() {
  const { contacts, applications } = await getInquiries()

  async function handleMarkAsRead(data: FormData) {
    'use server'
    const id = data.get('id') as string
    const table = data.get('table') as 'contacts' | 'recruit_applications'
    await markAsRead(table, id)
    revalidatePath('/admin/inquiries')
  }

  const InboxItem = ({ item, isApp }: { item: any, isApp: boolean }) => {
    const isUnread = !item.is_read;
    const dateStr = item.created_at.slice(0, 16).replace('T', ' ');
    // 返信先メール：contacts では contact_method、応募では email
    const toEmail = isApp ? (item.email || '') : (item.contact_method || '');

    return (
      <div className={`p-6 border-b border-gray-100 transition-colors ${isUnread ? 'bg-white' : 'bg-gray-50/50'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {isUnread && <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]"></span>}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              isApp 
                ? (item.type === 'cast' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700')
                : (item.type === 'reserve' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700')
            }`}>
              {isApp ? <Briefcase size={12} /> : (item.type === 'reserve' ? <Calendar size={12} /> : <Mail size={12} />)}
              {item.type}
            </span>
            <h3 className={`text-base tracking-widest ${isUnread ? 'font-bold text-[#171717]' : 'text-gray-600'}`}>
              {item.name} 様からの{isApp ? '応募' : (item.type === 'reserve' ? 'ご予約' : 'お問い合わせ')}
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-sans tracking-wide">{dateStr}</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-sm p-4 text-sm text-[#171717] font-sans leading-relaxed mb-4">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
            {item.phone && <div><span className="text-gray-400 text-xs tracking-widest uppercase">Phone: </span>{item.phone}</div>}
            {item.contact_method && <div><span className="text-gray-400 text-xs tracking-widest uppercase">Email: </span>{item.contact_method}</div>}
            {item.email && <div><span className="text-gray-400 text-xs tracking-widest uppercase">Email: </span>{item.email}</div>}
            {item.line_id && <div><span className="text-gray-400 text-xs tracking-widest uppercase">LINE: </span>{item.line_id}</div>}
            {item.age && <div><span className="text-gray-400 text-xs tracking-widest uppercase">Age: </span>{item.age}歳</div>}
            {(item.date || item.time) && <div><span className="text-gray-400 text-xs tracking-widest uppercase">Reserve: </span>{item.date} {item.time}</div>}
            {item.people && <div><span className="text-gray-400 text-xs tracking-widest uppercase">People: </span>{item.people}名</div>}
            {item.experience && <div className="col-span-2"><span className="text-gray-400 text-xs tracking-widest uppercase">Exp: </span>{item.experience}</div>}
          </div>
          <div className="pt-3 border-t border-gray-100">
            <span className="block text-gray-400 text-xs tracking-widest uppercase mb-1">Message / Note: </span>
            <p className="whitespace-pre-wrap">{item.message || '(メッセージなし)'}</p>
          </div>
        </div>

        {/* 既読ボタン（未読の場合のみ） */}
        {isUnread && !item.replied_at && (
          <div className="flex justify-end mb-2">
            <form action={handleMarkAsRead}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="table" value={isApp ? 'recruit_applications' : 'contacts'} />
              <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 tracking-widest uppercase transition-colors px-4 py-2 border border-gray-200 rounded-sm hover:bg-gray-50">
                既読にする
              </button>
            </form>
          </div>
        )}

        {/* 返信フォーム */}
        <ReplyForm
          id={item.id}
          table={isApp ? 'recruit_applications' : 'contacts'}
          customerName={item.name || 'お客様'}
          toEmail={toEmail}
          repliedAt={item.replied_at}
          replyText={item.reply_text}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Inbox & Applications</h1>
        <p className="text-sm text-gray-500 mt-2">サイト経由の予約・問い合わせ、および求人応募の一覧</p>
      </div>

      <div className="space-y-8">
        {/* Applications Section */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase mb-4 border-b border-gray-200 pb-2">
            Recruit Applications ({applications?.filter(a => !a.is_read).length || 0} Unread)
          </h2>
          <div className="bg-white border text-[#171717] border-gray-100 shadow-sm rounded-sm overflow-hidden">
            {applications && applications.length > 0 ? (
              applications.map(app => <InboxItem key={app.id} item={app} isApp={true} />)
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">応募はまだありません。</div>
            )}
          </div>
        </section>

        {/* Contacts Section */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase mb-4 border-b border-gray-200 pb-2">
            Contacts & Reserves ({contacts?.filter(c => !c.is_read).length || 0} Unread)
          </h2>
          <div className="bg-white border text-[#171717] border-gray-100 shadow-sm rounded-sm overflow-hidden">
            {contacts && contacts.length > 0 ? (
              contacts.map(contact => <InboxItem key={contact.id} item={contact} isApp={false} />)
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">問い合わせ・予約はまだありません。</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
