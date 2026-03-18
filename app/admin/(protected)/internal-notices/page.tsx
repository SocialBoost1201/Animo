import { getAdminNotices } from '@/lib/actions/internal-notices';
import Link from 'next/link';
import { Plus, Bell, Users, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { NoticeDeleteButton } from '@/components/features/admin/notices/NoticeDeleteButton';
import { NoticeReadStatusModal } from '@/components/features/admin/notices/NoticeReadStatusModal';

export default async function InternalNoticesPage() {
  const notices = await getAdminNotices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Notices</h1>
          <p className="text-sm text-gray-500 mt-2">キャスト向けお知らせ・既読状況の管理</p>
        </div>
        <Link
          href="/admin/internal-notices/new"
          className="bg-[#171717] hover:bg-gold text-white px-5 py-2.5 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          新規作成
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        {notices.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-[#171717] font-bold">お知らせがありません</p>
            <p className="text-sm text-gray-500 mt-1">キャストへの連絡事項を作成して配信しましょう。</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <div key={notice.id} className="p-5 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-colors">
                
                {/* Header Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {notice.importance === 'high' ? (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-xs font-bold tracking-wider">
                        <AlertCircle size={12} /> 重要
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold tracking-wider">
                        通常
                      </span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium tracking-wider">
                      <Clock size={12} />
                      {format(new Date(notice.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#171717] mb-2 truncate">
                    {notice.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>

                {/* Stats & Actions Section */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 md:pl-6 md:border-l border-gray-100">
                  
                  {/* Read Status */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold mb-0.5">既読率</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-bold text-[#171717]">{notice.reads_count}</span>
                        <span className="text-xs text-gray-500 font-medium">/ {notice.total_casts}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <Users size={18} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    {/* Read Status Check Modal Button */}
                    <NoticeReadStatusModal notice={notice} />

                    {/* Default Actions */}
                    <NoticeDeleteButton noticeId={notice.id} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
