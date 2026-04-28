import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { StatusSelect } from '@/components/features/admin/StatusSelect';
import { SearchBar } from '@/components/features/admin/SearchBar';
import { Phone, Mail, Smartphone, Briefcase, Filter, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  new:       { label: '新着',   cls: 'bg-[#6ab0d414] text-[#6ab0d4] border border-[#6ab0d420]' },
  reviewing: { label: '選考中', cls: 'bg-[#dfbd6914] text-[#dfbd69] border border-[#dfbd6920]' },
  hired:     { label: '採用',   cls: 'bg-[#72b89414] text-[#72b894] border border-[#72b89420]' },
  rejected:  { label: '見送り', cls: 'bg-[#ffffff08] text-[#5a5650] border border-[#ffffff0f]' },
};

const TYPE_MAP: Record<string, { label: string; cls: string }> = {
  cast:  { label: 'Cast 応募',  cls: 'bg-[#a882d814] text-[#a882d8]' },
  staff: { label: 'Staff 応募', cls: 'bg-[#6ab0d414] text-[#6ab0d4]' },
  escort: { label: 'エスコート', cls: 'bg-[#c4a35e14] text-[#c4a35e]' },
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter = 'all', q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('recruit_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'cast')   query = query.eq('type', 'cast');
  else if (filter === 'staff')  query = query.in('type', ['staff', 'escort']);
  else if (filter === 'unread') query = query.eq('is_read', false);

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,line_id.ilike.%${q}%`);
  }

  const { data: apps } = await query;

  async function handleMarkAsRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await markAsRead('recruit_applications', id);
    revalidatePath('/admin/applications');
    revalidatePath('/admin/dashboard');
  }

  const tabs = [
    { key: 'all',    label: '全て' },
    { key: 'cast',   label: 'Cast' },
    { key: 'staff',  label: 'Staff' },
    { key: 'unread', label: '未読のみ' },
  ];

  const unreadCount = apps?.filter((a) => !a.is_read).length ?? 0;

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">求人応募</h1>
          <p className="text-[11px] text-[#8a8478]">
            {apps?.length ?? 0}件のデータ
            {unreadCount > 0 && (
              <span className="ml-2 text-[#dfbd69] font-semibold">（未読 {unreadCount}件）</span>
            )}
          </p>
        </div>
        <div className="w-full xl:w-56">
          <SearchBar placeholder="名前・連絡先で検索..." />
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1 border-b border-[#ffffff08] overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = filter === tab.key || (tab.key === 'all' && filter === 'all');
          return (
            <a
              key={tab.key}
              href={`/admin/applications${tab.key !== 'all' ? `?filter=${tab.key}` : ''}`}
              className={`shrink-0 px-4 py-2.5 text-[12px] font-medium transition-colors relative ${
                isActive ? 'text-[#f4f1ea]' : 'text-[#5a5650] hover:text-[#8a8478]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
              )}
            </a>
          );
        })}
      </div>

      {/* ── Application List ── */}
      <div className="space-y-3">
        {apps && apps.length > 0 ? (
          apps.map((app: {
            id: string; is_read: boolean; created_at: string; type: string;
            status?: string; name?: string; age?: number | string; phone?: string;
            email?: string; line_id?: string; experience?: string; schedule?: string;
            message?: string; replied_at?: string; reply_text?: string;
          }) => {
            const isUnread = !app.is_read;
            const dateStr  = app.created_at.slice(0, 10);
            const typeConf = TYPE_MAP[app.type] ?? { label: app.type, cls: 'bg-[#ffffff08] text-[#8a8478]' };
            const status   = app.status ?? 'new';
            const badge    = STATUS_BADGE[status] ?? STATUS_BADGE.new;

            return (
              <div
                key={app.id}
                className={`bg-[#17181c] rounded-[18px] border overflow-hidden ${
                  isUnread ? 'border-[#dfbd6930]' : 'border-[#ffffff0f]'
                }`}
              >
                {/* Card Header */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#dfbd69] shrink-0" />}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeConf.cls}`}>
                        {typeConf.label}
                      </span>
                      <span className={`text-[13px] font-semibold ${isUnread ? 'text-[#f4f1ea]' : 'text-[#8a8478]'}`}>
                        {app.name}（{app.age ?? '?'}歳）
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5a5650] shrink-0">{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <StatusSelect id={app.id} currentStatus={status} />
                    {isUnread && (
                      <form action={handleMarkAsRead}>
                        <input type="hidden" name="id" value={app.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 text-[11px] text-[#5a5650] hover:text-[#72b894] transition-colors py-1 px-2.5 rounded-[8px] border border-[#ffffff0f] hover:border-[#72b89430]"
                        >
                          <CheckCircle size={12} />
                          既読にする
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 pb-4 border-t border-[#ffffff08]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 py-3 text-[12px]">
                    {app.phone && (
                      <a href={`tel:${app.phone}`} className="flex items-center gap-2 text-[#8a8478] hover:text-[#c7c0b2] transition-colors">
                        <Phone size={12} className="text-[#5a5650] shrink-0" />{app.phone}
                      </a>
                    )}
                    {app.email && (
                      <a href={`mailto:${app.email}`} className="flex items-center gap-2 text-[#8a8478] hover:text-[#c7c0b2] transition-colors">
                        <Mail size={12} className="text-[#5a5650] shrink-0" /><span className="truncate">{app.email}</span>
                      </a>
                    )}
                    {app.line_id && (
                      <div className="flex items-center gap-2 text-[#8a8478]">
                        <Smartphone size={12} className="text-[#5a5650] shrink-0" />LINE: {app.line_id}
                      </div>
                    )}
                    {app.experience && (
                      <div className="flex items-center gap-2 text-[#8a8478] sm:col-span-2">
                        <Briefcase size={12} className="text-[#5a5650] shrink-0" />経験：{app.experience}
                      </div>
                    )}
                    {app.schedule && (
                      <div className="text-[#8a8478] sm:col-span-2 text-[11px] py-1.5 px-3 bg-[#1c1d22] rounded-[8px] border border-[#ffffff08]">
                        希望スケジュール：{app.schedule}
                      </div>
                    )}
                  </div>

                  {app.message && (
                    <p className="text-[12px] text-[#8a8478] bg-[#1c1d22] p-3.5 leading-relaxed whitespace-pre-wrap rounded-[10px] border border-[#ffffff08]">
                      {app.message}
                    </p>
                  )}

                  <div className="mt-3">
                    <ReplyForm
                      id={app.id}
                      table="recruit_applications"
                      customerName={app.name || '応募者'}
                      toEmail={app.email || ''}
                      repliedAt={app.replied_at}
                      replyText={app.reply_text}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] py-16 text-center">
            <Filter size={22} className="mx-auto mb-3 text-[#5a5650]" />
            <p className="text-[12px] text-[#5a5650] italic">
              {filter === 'unread' ? '未読の求人応募はありません' : 'まだ求人応募がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
