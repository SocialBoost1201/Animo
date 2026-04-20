import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PenLine } from 'lucide-react';
import { getCurrentCast, getMyCastPosts } from '@/lib/actions/cast-auth';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';

function getStatusLabel(status: string) {
  if (status === 'published') return '公開中';
  if (status === 'pending') return '審査中';
  return '下書き';
}

function getStatusClass(status: string) {
  if (status === 'published') return 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]';
  if (status === 'pending') return 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]';
  return 'bg-white/8 text-[#8f96a3]';
}

export default async function CastPostsPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const { data: posts } = await getMyCastPosts(cast.id);

  return (
    <CastMobileShell>
      <CastMobileHeader leftSlot={<CastMobileBackLink href="/cast/dashboard" label="ダッシュボードへ戻る" />} />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-6 px-4 pb-28 pt-6">
        <div>
          <div className="text-[10px] uppercase tracking-[1px] text-[#6b7280]">DAILY BLOG</div>
          <h1 className="mt-1 text-[22px] font-bold leading-[33px] text-[#f7f4ed]">ブログ</h1>
        </div>

        <Link href="/cast/post">
          <CastMobileCard className="overflow-hidden rounded-[18px] border-t-[1.8px] border-t-[rgba(201,167,106,0.2)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <PenLine className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-bold leading-[22.5px] text-[#f7f4ed]">今日のブログを書く</div>
                  <div className="mt-1 text-[12px] leading-[18px] text-[#6b7280]">まだ本日の投稿がありません</div>
                </div>
              </div>
              <span className="text-[#8f96a3]">›</span>
            </div>
          </CastMobileCard>
        </Link>

        <section className="space-y-3">
          <div className="text-[10px] uppercase tracking-[1px] text-[#6b7280]">過去の投稿</div>
          {posts && posts.length > 0 ? (
            <CastMobileCard className="overflow-hidden rounded-[18px]">
              {posts.map((post, index) => (
                <Link key={post.id} href="/cast/post" className={`flex items-center gap-3 px-4 py-[14px] ${index !== posts.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#181d27] text-[#c9a76a]">
                    <PenLine className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium leading-[21px] text-[#f7f4ed]">{(post.content || '本文なし').split('\n')[0]}</p>
                    <p className="mt-[2px] text-[11px] leading-[16.5px] text-[#6b7280]">
                      {new Date(post.created_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }).replace('/', '/')}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClass(post.status)}`}>
                    {getStatusLabel(post.status)}
                  </span>
                </Link>
              ))}
            </CastMobileCard>
          ) : (
            <CastMobileCard className="px-5 py-10 text-center">
              <div className="text-sm text-[#8f96a3]">まだブログがありません</div>
            </CastMobileCard>
          )}
        </section>
      </main>
    </CastMobileShell>
  );
}
