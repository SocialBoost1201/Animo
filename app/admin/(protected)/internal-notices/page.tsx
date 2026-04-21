import { getAdminNotices } from '@/lib/actions/internal-notices';
import { getAdminNotificationSummary } from '@/lib/actions/admin-notifications';
import Link from 'next/link';
import { Plus, Bell, Users, Clock, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { NoticeDeleteButton } from '@/components/features/admin/notices/NoticeDeleteButton';
import { NoticeReadStatusModal } from '@/components/features/admin/notices/NoticeReadStatusModal';

export default async function InternalNoticesPage() {
  const [notices, notifications] = await Promise.all([
    getAdminNotices(),
    getAdminNotificationSummary(),
  ]);

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">通知</h1>
          <p className="text-[11px] text-[#8a8478]">管理側の確認事項と、キャスト向けお知らせを確認できます</p>
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

      {/* ── Admin Notifications ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-[#f4f1ea]">管理側の確認が必要な通知</h2>
            <p className="mt-1 text-[11px] text-[#8a8478]">
              キャストからの提出・変更・承認待ちをまとめて表示します。
            </p>
          </div>
          {notifications.total > 0 && (
            <span className="rounded-full bg-[#dfbd6914] px-3 py-1 text-[11px] font-bold text-[#dfbd69] border border-[#dfbd6920]">
              未対応 {notifications.total}件
            </span>
          )}
        </div>

        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
          {notifications.total === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#1c1d22] rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} className="text-[#72b894]" />
              </div>
              <p className="text-[13px] font-medium text-[#c7c0b2]">管理側の未対応通知はありません</p>
              <p className="text-[11px] text-[#5a5650]">キャストから提出や変更申請があると、ここに表示されます。</p>
            </div>
          ) : (
            <div className="divide-y divide-[#ffffff08]">
              {notifications.items.filter((item) => item.count > 0).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-4 p-5 transition-colors hover:bg-[#ffffff03]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dfbd6914] text-[#dfbd69]">
                    <Bell size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#f4f1ea]">{item.label}</p>
                    <p className="mt-1 text-[11px] text-[#8a8478]">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#dfbd69] px-2.5 py-1 text-[11px] font-bold text-[#0b0b0d]">
                      {item.count}件
                    </span>
                    <ChevronRight size={16} className="text-[#5a5650]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Sent Notices ── */}
      <section className="space-y-3">
        <div>
          <h2 className="text-[14px] font-semibold text-[#f4f1ea]">送信済みのお知らせ</h2>
          <p className="mt-1 text-[11px] text-[#8a8478]">管理側からキャスト全員へ配信したお知らせと既読状況です。</p>
        </div>

      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        {notices.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-[#1c1d22] rounded-full flex items-center justify-center">
              <Bell size={20} className="text-[#5a5650]" />
            </div>
            <p className="text-[13px] font-medium text-[#8a8478]">お知らせがありません</p>
            <p className="text-[11px] text-[#5a5650]">キャスト全員へ配信したお知らせはここに表示されます。</p>
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
      </section>
    </div>
  );
}
