import { Phone, Mail, Smartphone, Calendar, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { LinkCustomerButton } from '@/components/features/admin/LinkCustomerButton';
import Link from 'next/link';

type ContactData = { id: string; name: string; phone?: string; contact_method?: string; line_id?: string; created_at: string; type: string; is_read: boolean; message?: string; date?: string; time?: string; people?: number; replied_at?: string; reply_text?: string; cast_name?: string };
type CustomerData = { id: string; customerId?: string | null; primaryName: string; phone?: string | null; email?: string | null; lineId?: string | null; contacts: ContactData[]; reserveCount: number; contactCount: number; lastContact: string };

export function CustomerCard({ 
  customer, 
  handleMarkAsRead 
}: { 
  customer: CustomerData, 
  handleMarkAsRead: (formData: FormData) => void 
}) {
  const { id, customerId, primaryName, phone, email, lineId, contacts, reserveCount, contactCount, lastContact } = customer;
  const hasUnread = contacts.some((c: ContactData) => !c.is_read);

  return (
    <div className={`bg-white border shadow-sm transition-all ${hasUnread ? 'border-amber-200' : 'border-gray-100'}`}>
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {hasUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />}
          <div>
            <h3 className={`text-lg font-serif ${hasUnread ? 'text-[#171717] font-bold' : 'text-gray-700'}`}>
              {primaryName} 様
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-sans">
              {phone && <span className="flex items-center gap-1"><Phone size={12} /> {phone}</span>}
              {email && <span className="flex items-center gap-1"><Mail size={12} /> {email}</span>}
              {lineId && <span className="flex items-center gap-1"><Smartphone size={12} /> {lineId}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">予約</p>
            <p className="font-serif text-[#171717]">{reserveCount} <span className="text-xs text-gray-400 font-sans">回</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">問合せ</p>
            <p className="font-serif text-[#171717]">{contactCount} <span className="text-xs text-gray-400 font-sans">回</span></p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">最終コンタクト</p>
            <p className="text-gray-600 text-xs">{lastContact}</p>
          </div>
          <div className="pl-4 border-l border-gray-100 hidden sm:block">
            {customerId ? (
              <Link 
                href={`/admin/customers/${customerId}`} 
                className="flex items-center gap-1 text-xs font-bold text-gold hover:text-yellow-600 transition-colors"
              >
                詳細を表示 <ArrowRight size={14} />
              </Link>
            ) : (
              <LinkCustomerButton 
                contactGroupId={id} 
                name={primaryName} 
                phone={phone || null} 
                email={email || null} 
                lineId={lineId || null} 
              />
            )}
          </div>
        </div>
      </div>

      {/* モバイル用のCRM連携ボタン行（sm以下） */}
      <div className="sm:hidden px-6 pb-4 flex justify-end border-t border-gray-50 pt-3">
        {customerId ? (
          <Link 
            href={`/admin/customers/${customerId}`} 
            className="flex items-center gap-1 text-xs font-bold text-gold hover:text-yellow-600 transition-colors"
          >
            顧客詳細を表示 <ArrowRight size={14} />
          </Link>
        ) : (
          <LinkCustomerButton 
            contactGroupId={id} 
            name={primaryName} 
            phone={phone || null} 
            email={email || null} 
            lineId={lineId || null} 
          />
        )}
      </div>

      {/* 履歴リスト (History Details) - 常に表示または詳細コンポーネントで展開 */}
      <div className="border-t border-gray-50 bg-gray-50/50 p-6 space-y-6">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">対応履歴</p>
        <div className="space-y-4">
          {contacts.map((contact: ContactData) => (
            <div key={contact.id} className="bg-white border border-gray-100 p-4 rounded-sm shadow-xs">
              {/* Card Header for each history item */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  {!contact.is_read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    contact.type === 'reserve' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {contact.type === 'reserve' ? '予約' : '問い合わせ'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{contact.created_at.slice(0, 16).replace('T', ' ')}</span>
                </div>
                {!contact.is_read && (
                  <form action={handleMarkAsRead}>
                    <input type="hidden" name="id" value={contact.id} />
                    <button type="submit" className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors">
                      <CheckCircle size={14} /> 既読
                    </button>
                  </form>
                )}
              </div>

              {/* History Content */}
              {contact.type === 'reserve' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Calendar className="text-purple-400 w-5 h-5 shrink-0" />
                       <span className="font-serif text-[#171717]">{contact.date ?? '未定'} {contact.time?.slice(0, 5) ?? ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm">人数: {contact.people ?? '-'}名</span>
                    </div>
                    {contact.cast_name && (
                      <div className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                        <Users size={12} className="text-purple-500" /> 指名: {contact.cast_name}
                      </div>
                    )}
                  </div>
                  {contact.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {contact.message && (
                    <p className="text-sm text-[#171717] leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  )}
                </div>
              )}

              {/* Reply Component */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <ReplyForm
                  id={contact.id}
                  table="contacts"
                  customerName={primaryName}
                  toEmail={email || ''}
                  repliedAt={contact.replied_at}
                  replyText={contact.reply_text}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
