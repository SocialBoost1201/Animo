import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import { StatusSelect } from '@/components/features/admin/StatusSelect';
import { SearchBar } from '@/components/features/admin/SearchBar';
import {
  Phone, Mail, Smartphone, Briefcase, Filter, CheckCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  new:       { label: '新着',   color: 'bg-blue-100 text-blue-700' },
  reviewing: { label: '選考中', color: 'bg-amber-100 text-amber-700' },
  hired:     { label: '採用',   color: 'bg-green-100 text-green-700' },
  rejected:  { label: '見送り', color: 'bg-gray-100 text-gray-500' },
};

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  cast:  { label: 'Cast 応募',  color: 'bg-pink-100 text-pink-700' },
  staff: { label: 'Staff 応募', color: 'bg-blue-100 text-blue-700' },
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

  if (filter === 'cast') query = query.eq('type', 'cast');
  else if (filter === 'staff') query = query.eq('type', 'staff');
  else if (filter === 'unread') query = query.eq('is_read', false);

  if (q) {
    // 名前・メール・電話番号・LINE IDなどでの部分一致検索
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
    { key: 'all', label: '全て' },
    { key: 'cast', label: 'Cast' },
    { key: 'staff', label: 'Staff' },
    { key: 'unread', label: '未読のみ' },
  ];

  const unreadCount = apps?.filter((a) => !a.is_read).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">求人応募管理</h1>
          <p className="text-sm text-gray-400 mt-1">
            {apps?.length ?? 0}件のデータ
            {unreadCount > 0 && (
              <span className="ml-2 text-amber-600 font-bold">（未読 {unreadCount}件）</span>
            )}
          </p>
        </div>
        <div className="w-full md:w-64">
          <SearchBar placeholder="名前・連絡先で検索..." />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={`/admin/applications${tab.key !== 'all' ? `?filter=${tab.key}` : ''}`}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors ${
              filter === tab.key || (tab.key === 'all' && filter === 'all')
                ? 'border-b-2 border-gold text-[#171717] -mb-px'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Application List */}
      <div className="space-y-3">
        {apps && apps.length > 0 ? (
          apps.map((app: { id: string; is_read: boolean; created_at: string; type: string; status?: string; name?: string; age?: number | string; phone?: string; email?: string; line_id?: string; experience?: string; schedule?: string; message?: string; replied_at?: string; reply_text?: string; }) => {
            const isUnread = !app.is_read;
            const dateStr = app.created_at.slice(0, 10);
            const typeConfig = TYPE_MAP[app.type] ?? { label: app.type, color: 'bg-gray-100 text-gray-600' };
            const status = app.status ?? 'new';
            const badge = STATUS_BADGE[status] ?? STATUS_BADGE.new;

            return (
              <div
                key={app.id}
                className={`bg-white border shadow-sm ${isUnread ? 'border-amber-200' : 'border-gray-100'}`}
              >
                {/* Card Header */}
                <div className="px-4 md:px-6 py-4">
                  {/* Row 1: 名前・タイプ・日付 */}
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <h3 className={`text-base ${isUnread ? 'font-bold text-[#171717]' : 'text-gray-500'}`}>
                        {app.name}（{app.age ?? '?'}歳）
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{dateStr}</span>
                  </div>

                  {/* Row 2: ステータス・既読ボタン */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    {/* Client Component でステータス変更 */}
                    <StatusSelect id={app.id} currentStatus={status} />
                    {isUnread && (
                      <form action={handleMarkAsRead}>
                        <input type="hidden" name="id" value={app.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors py-1.5 px-2 rounded border border-gray-200"
                        >
                          <CheckCircle size={14} />
                          既読にする
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 md:px-6 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3 text-sm">
                    {app.phone && (
                      <a
                        href={`tel:${app.phone}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone size={13} className="text-gray-300 shrink-0" />
                        {app.phone}
                      </a>
                    )}
                    {app.email && (
                      <a
                        href={`mailto:${app.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Mail size={13} className="text-gray-300 shrink-0" />
                        <span className="truncate">{app.email}</span>
                      </a>
                    )}
                    {app.line_id && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Smartphone size={13} className="text-gray-300 shrink-0" />
                        LINE: {app.line_id}
                      </div>
                    )}
                    {app.experience && (
                      <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                        <Briefcase size={13} className="text-gray-300 shrink-0" />
                        経験：{app.experience}
                      </div>
                    )}
                    {app.schedule && (
                      <div className="text-gray-500 sm:col-span-2 text-xs py-1 bg-gray-50 px-2 rounded">
                        希望スケジュール：{app.schedule}
                      </div>
                    )}
                  </div>

                  {app.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 leading-relaxed whitespace-pre-wrap rounded-sm">
                      {app.message}
                    </p>
                  )}

                  {/* Reply Form */}
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
          <div className="bg-white border border-gray-100 p-12 text-center text-gray-400 text-sm">
            <Filter size={24} className="mx-auto mb-3 text-gray-200" />
            {filter === 'unread' ? '未読の求人応募はありません' : 'まだ求人応募がありません'}
          </div>
        )}
      </div>
    </div>
  );
}
