'use client';

import { Phone, Mail, Smartphone, Calendar, Users, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { LinkCustomerButton } from '@/components/features/admin/LinkCustomerButton';
import Link from 'next/link';
import { useState } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(hasUnread); // 未読時は最初から開く

  return (
    <div className={`bg-black/95 border transition-all rounded-sm ${hasUnread ? 'border-amber-900/50 ring-1 ring-amber-900/30' : 'border-white/10 shadow-lg'}`}>
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {hasUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />}
          <div>
            <h3 className={`text-lg font-serif ${hasUnread ? 'text-[#f4f1ea] font-bold' : 'text-[#cbc3b3]'}`}>
              {primaryName} 様
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#8a8478] font-sans">
              {phone && <span className="flex items-center gap-1"><Phone size={12} /> {phone}</span>}
              {email && <span className="flex items-center gap-1"><Mail size={12} /> {email}</span>}
              {lineId && <span className="flex items-center gap-1"><Smartphone size={12} /> {lineId}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-xs text-[#5a5650] font-bold uppercase tracking-widest mb-0.5">予約</p>
            <p className="font-serif text-[#f4f1ea]">{reserveCount} <span className="text-xs text-[#5a5650] font-sans">回</span></p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#5a5650] font-bold uppercase tracking-widest mb-0.5">問合せ</p>
            <p className="font-serif text-[#f4f1ea]">{contactCount} <span className="text-xs text-[#5a5650] font-sans">回</span></p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[#5a5650] font-bold uppercase tracking-widest mb-0.5">最終コンタクト</p>
            <p className="text-[#8a8478] text-xs">{lastContact}</p>
          </div>
          <div className="pl-4 border-l border-white/10 hidden sm:block">
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
      <div className="sm:hidden px-6 pb-4 flex justify-end border-t border-white/5 pt-3">
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

      {/* Accordion Toggle Bar */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 border-t border-white/5 bg-white/5 text-xs font-bold tracking-widest text-[#5a5650] hover:text-[#f4f1ea] hover:bg-white/10 transition-colors"
      >
        {isExpanded ? (
          <><ChevronUp size={14} /> 履歴を閉じる</>
        ) : (
          <><ChevronDown size={14} /> 対応履歴 ({contacts.length}件) を表示</>
        )}
      </button>

      {/* 履歴リスト (History Details) - アコーディオン展開 */}
      {isExpanded && (
        <div className="border-t border-white/5 bg-black/40 p-4 sm:p-6 space-y-6">
          <p className="text-xs font-bold tracking-widest text-[#5a5650] uppercase">対応履歴</p>
          <div className="space-y-4">
            {contacts.map((contact: ContactData) => (
              <div key={contact.id} className="bg-black/95 border border-white/10 p-4 rounded-sm shadow-xs">
                {/* Card Header for each history item */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {!contact.is_read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      contact.type === 'reserve'
                        ? 'bg-purple-900/30 text-purple-300'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      {contact.type === 'reserve' ? '予約' : '問い合わせ'}
                    </span>
                    <span className="text-xs sm:text-xs text-[#5a5650] font-mono">
                      {contact.created_at.slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                  {!contact.is_read && (
                    <form action={handleMarkAsRead}>
                      <input type="hidden" name="id" value={contact.id} />
                      <button type="submit" className="flex items-center gap-1 text-xs sm:text-xs text-[#5a5650] hover:text-green-500 transition-colors">
                        <CheckCircle size={14} /> 既読
                      </button>
                    </form>
                  )}
                </div>

                {/* History Content */}
                {contact.type === 'reserve' ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-2 bg-purple-900/20 px-2.5 py-1.5 rounded-sm">
                         <Calendar className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                         <span className="font-serif text-[#f4f1ea] text-sm sm:text-base">{contact.date ?? '未定'} {contact.time?.slice(0, 5) ?? ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#cbc3b3]">
                         <span>人数: {contact.people ?? '-'}名</span>
                      </div>
                      {contact.cast_name && (
                        <div className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                          <Users size={12} className="text-purple-400" /> 指名: {contact.cast_name}
                        </div>
                      )}
                    </div>
                    {contact.message && (
                      <p className="text-[13px] sm:text-sm text-[#cbc3b3] bg-white/5 p-3 rounded-sm leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contact.message && (
                      <p className="text-[13px] sm:text-sm text-[#cbc3b3] leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Reply Component */}
                <div className="mt-4 pt-4 border-t border-white/5">
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
      )}
    </div>
  );
}
