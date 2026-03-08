import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { markAsRead } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { ReplyForm } from '@/components/features/admin/ReplyForm';
import {
  Phone, Mail, Smartphone, Briefcase, Filter, CheckCircle,
  Star, Clock, XCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new:       { label: '新着', color: 'bg-blue-100 text-blue-700', icon: <Star size={11} /> },
  reviewing: { label: '選考中', color: 'bg-amber-100 text-amber-700', icon: <Clock size={11} /> },
  hired:     { label: '採用', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={11} /> },
  rejected:  { label: '見送り', color: 'bg-gray-100 text-gray-500', icon: <XCircle size={11} /> },
};

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  cast:  { label: 'Cast 応募', color: 'bg-pink-100 text-pink-700' },
  staff: { label: 'Staff 応募', color: 'bg-blue-100 text-blue-700' },
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = 'all' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('recruit_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'cast') query = query.eq('type', 'cast');
  else if (filter === 'staff') query = query.eq('type', 'staff');
  else if (filter === 'unread') query = query.eq('is_read', false);

  const { data: apps } = await query;

  async function handleMarkAsRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await markAsRead('recruit_applications', id);
    revalidatePath('/admin/applications');
    revalidatePath('/admin/dashboard');
  }

  async function handleStatusChange(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    const supabase2 = await createClient();
    await supabase2.from('recruit_applications').update({ status }).eq('id', id);
    revalidatePath('/admin/applications');
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
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">求人応募管理</h1>
        <p className="text-sm text-gray-400 mt-1">
          {apps?.length ?? 0}件のデータ
          {unreadCount > 0 && <span className="ml-2 text-amber-600 font-bold">（未読 {unreadCount}件）</span>}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={`/admin/applications${tab.key !== 'all' ? `?filter=${tab.key}` : ''}`}
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

      {/* Application List */}
      <div className="space-y-3">
        {apps && apps.length > 0 ? (
          apps.map((app: any) => {
            const isUnread = !app.is_read;
            const dateStr = app.created_at.slice(0, 16).replace('T', ' ');
            const typeConfig = TYPE_MAP[app.type] ?? { label: app.type, color: 'bg-gray-100 text-gray-600' };
            const status = app.status ?? 'new';
            const statusConfig = STATUS_MAP[status] ?? STATUS_MAP.new;

            return (
              <div
                key={app.id}
                className={`bg-white border shadow-sm ${isUnread ? 'border-amber-200' : 'border-gray-100'}`}
              >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                    <h3 className={`text-base ${isUnread ? 'font-bold text-[#171717]' : 'text-gray-500'}`}>
                      {app.name}（{app.age ?? '?'}歳）
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{dateStr}</span>
                    {/* ステータス変更 */}
                    <form action={handleStatusChange} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={app.id} />
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${statusConfig.color}`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                      <select
                        name="status"
                        defaultValue={status}
                        onChange={(e) => {
                          // Next.js Server Action: フォームをサブミット
                          (e.target.closest('form') as HTMLFormElement | null)?.requestSubmit();
                        }}
                        className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white focus:outline-none focus:border-gold"
                      >
                        <option value="new">新着</option>
                        <option value="reviewing">選考中</option>
                        <option value="hired">採用</option>
                        <option value="rejected">見送り</option>
                      </select>
                      <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 border border-gray-200 rounded ml-1">
                        更新
                      </button>
                    </form>
                    {isUnread && (
                      <form action={handleMarkAsRead}>
                        <input type="hidden" name="id" value={app.id} />
                        <button type="submit" className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle size={14} />
                          既読
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-3 text-sm">
                    {app.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={13} className="text-gray-300 shrink-0" />
                        {app.phone}
                      </div>
                    )}
                    {app.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={13} className="text-gray-300 shrink-0" />
                        <span className="truncate">{app.email}</span>
                      </div>
                    )}
                    {app.line_id && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Smartphone size={13} className="text-gray-300 shrink-0" />
                        LINE: {app.line_id}
                      </div>
                    )}
                    {app.experience && (
                      <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <Briefcase size={13} className="text-gray-300 shrink-0" />
                        経験：{app.experience}
                      </div>
                    )}
                    {app.schedule && (
                      <div className="text-gray-600 col-span-2 text-xs">
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
