import { redirect } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getCastNotices, markAllCastNoticesAsRead } from '@/lib/actions/cast-notices';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';

export default async function CastNoticesPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const notices = await getCastNotices(cast.id);

  async function markAllAsReadAction() {
    'use server';

    await markAllCastNoticesAsRead(cast.id);
  }

  return (
    <CastMobileShell showBottomNav={false}>
      <CastMobileHeader leftSlot={<CastMobileBackLink href="/cast/dashboard" label="ダッシュボードへ戻る" />} />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-10 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold leading-[30px] text-[#f7f4ed]">お知らせ</h1>
            <p className="mt-1 text-[13px] leading-[19.5px] text-[#c9a76a]">未読 {notices.filter((notice) => !notice.is_read).length}件</p>
          </div>
          <form action={markAllAsReadAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/8 bg-[#181d27] px-3 py-[9px] text-[12px] font-medium leading-[18px] text-[#a9afbc]"
            >
              <CheckCheck className="h-[13px] w-[13px]" />
              すべて既読
            </button>
          </form>
        </div>

        <CastMobileCard className="overflow-hidden rounded-[16px]">
          {notices.map((notice) => (
            <div key={notice.id} className="border-b border-white/8 bg-[rgba(201,167,106,0.03)] px-4 py-4 last:border-b-0">
              <div className="flex items-start gap-3">
                {!notice.is_read ? <span className="mt-[4px] h-1.5 w-1.5 rounded-full bg-[#c9a76a]" /> : <span className="mt-[4px] h-1.5 w-1.5 rounded-full bg-transparent" />}
                <div className={`mt-[-2px] flex h-9 w-9 items-center justify-center rounded-[10px] ${notice.importance === 'high' ? 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]' : 'bg-[rgba(201,167,106,0.15)] text-[#c9a76a]'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] font-bold leading-[19.6px] ${notice.importance === 'high' ? 'text-[#e6a23c]' : 'text-[#f7f4ed]'}`}>{notice.title}</p>
                  <p className="mt-1 text-[12px] leading-[18px] text-[#6b7280]">{notice.importance === 'high' ? '残り4日' : notice.content || '店舗からのお知らせ'}</p>
                  <p className="mt-1 text-[11px] leading-[16.5px] text-[#6b7280]">{new Date(notice.created_at).toLocaleString('ja-JP')}</p>
                </div>
              </div>
            </div>
          ))}
        </CastMobileCard>
      </main>
    </CastMobileShell>
  );
}
