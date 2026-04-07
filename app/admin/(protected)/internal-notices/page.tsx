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
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">通知</h1>
          <p className="text-[11px] text-[#8a8478]">キャスト向けお知らせ・既読状況の管理</p>
        </div>
        <Link
          href="/admin/internal-notices/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] whitespace-nowrap"
          style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
        >
          <Plus size={13} strokeWidth={3} />
          新規作成
        </Link>
      </div>

      {/* ── Notice List ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        {notices.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-[#1c1d22] rounded-full flex items-center justify-center">
              <Bell size={20} className="text-[#5a5650]" />
            </div>
            <p className="text-[13px] font-medium text-[#8a8478]">お知らせがありません</p>
            <p className="text-[11px] text-[#5a5650]">キャストへの連絡事項を作成して配信しましょう。</p>
          </div>
        ) : (
          <div className="divide-y divide-[#ffffff08]">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-5 flex flex-col md:flex-row gap-5 hover:bg-[#ffffff03] transition-colors"
              >
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    {notice.importance === 'high' ? (
                      <span className="inline-flex items-center gap-1 bg-[#d4785a14] text-[#d4785a] border border-[#d4785a20] px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">
                        <AlertCircle size={10} /> 重要
                      </span>
                    ) : (
                      <span className="bg-[#ffffff08] text-[#5a5650] px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">
                        通常
                      </span>
                    )}
                    <span className="text-[10px] text-[#5a5650] flex items-center gap-1">
                      <Clock size={10} />
                      {format(new Date(notice.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </span>
                  </div>

                  <h3 className="text-[14px] font-semibold text-[#f4f1ea] mb-1.5 truncate">{notice.title}</h3>
                  <p className="text-[12px] text-[#8a8478] line-clamp-2 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 md:pl-5 md:border-l md:border-[#ffffff08]">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[9px] text-[#5a5650] font-bold mb-0.5 uppercase tracking-wider">既読率</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[20px] font-bold text-[#f4f1ea] leading-none">{notice.reads_count}</span>
                        <span className="text-[10px] text-[#5a5650]">/ {notice.total_casts}</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#dfbd6914] flex items-center justify-center">
                      <Users size={15} className="text-[#dfbd69]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <NoticeReadStatusModal notice={notice} />
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
