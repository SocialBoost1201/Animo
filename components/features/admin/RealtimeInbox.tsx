'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, Calendar, Users, CheckCircle, Bell } from 'lucide-react';

type Contact = {
  id: string;
  is_read: boolean;
  created_at: string;
  type: string;
  name: string;
  contact_method?: string;
  date?: string;
  time?: string;
  people?: number;
  message?: string;
  replied_at?: string;
  reply_text?: string;
};

export function RealtimeInbox({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('contacts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contacts' },
        (payload) => {
          const newContact = payload.new as Contact;
          setContacts((prev) => [newContact, ...prev]);
          toast.success(`📩 新着メッセージ: ${newContact.name} 様`, {
            description: newContact.type === 'reserve' ? '予約リクエスト' : 'お問い合わせ',
            duration: 6000,
            action: {
              label: '確認する',
              onClick: () => {
                document.getElementById(`contact-${newContact.id}`)?.scrollIntoView({ behavior: 'smooth' });
              },
            },
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'contacts' },
        (payload) => {
          const updated = payload.new as Contact;
          setContacts((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', id);
    if (!error) {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, is_read: true } : c)));
      toast.success('既読にしました');
    }
  }, []);

  const unread = contacts.filter((c) => !c.is_read);

  return (
    <div className="space-y-4">
      {/* Live Status */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`} />
        <span className="text-xs text-[#5a5650]">
          {isLive ? 'リアルタイム受信中' : '接続中...'}
        </span>
        {unread.length > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-500">
            <Bell size={12} />
            未読 {unread.length}件
          </span>
        )}
      </div>

      {/* Contact List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="bg-black/95 border border-white/5 p-12 text-center text-sm text-[#5a5650]">
            問い合わせ・予約はまだありません
          </div>
        ) : (
          contacts.map((c) => {
            const isUnread = !c.is_read;
            const dateStr = c.created_at.slice(0, 16).replace('T', ' ');
            return (
              <div
                id={`contact-${c.id}`}
                key={c.id}
                className={`bg-black/94 border transition-all duration-500 rounded-[18px] font-sans ${
                  isUnread ? 'border-amber-900/50 ring-1 ring-amber-900/30 shadow-[0_8px_16px_-4px_rgba(251,191,36,0.1)]' : 'border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      c.type === 'reserve'
                        ? 'bg-purple-900/30 text-purple-300'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      {c.type === 'reserve' ? '予約' : 'お問い合わせ'}
                    </span>
                    <h3 className={`text-base ${isUnread ? 'font-bold text-[#f4f1ea]' : 'text-[#8a8478]'}`}>
                      {c.name} 様
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#5a5650]">{dateStr}</span>
                    {isUnread && (
                      <button
                        onClick={() => markAsRead(c.id)}
                        className="flex items-center gap-1 text-xs text-[#5a5650] hover:text-green-500 transition-colors"
                      >
                        <CheckCircle size={14} /> 既読
                      </button>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-4 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2 py-3 text-sm">
                    {c.contact_method && (
                      <div className="flex items-center gap-2 text-[#cbc3b3]">
                        <Mail size={13} className="text-[#5a5650]" />
                        {c.contact_method}
                      </div>
                    )}
                    {c.date && (
                      <div className="flex items-center gap-2 text-[#cbc3b3]">
                        <Calendar size={13} className="text-[#5a5650]" />
                        {c.date} {c.time?.slice(0, 5)}
                      </div>
                    )}
                    {c.people && (
                      <div className="flex items-center gap-2 text-[#cbc3b3]">
                        <Users size={13} className="text-[#5a5650]" />
                        {c.people}名
                      </div>
                    )}
                  </div>
                  {c.message && (
                    <p className="text-sm text-[#cbc3b3] bg-white/5 p-3 leading-relaxed whitespace-pre-wrap rounded-sm">
                      {c.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
