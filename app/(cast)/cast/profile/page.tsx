import { redirect } from 'next/navigation';
import {
  ShieldCheck,
  CalendarRange,
  Eye,
  Trophy,
  Pencil,
  ImageIcon,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { getCurrentCast, castLogout, getMyCastPosts } from '@/lib/actions/cast-auth';
import { getCastPVStats } from '@/lib/actions/posts-analytics';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
  CastMobileHeaderBell,
} from '@/components/features/cast/CastMobileShell';
import Image from 'next/image';

type CastPrivateInfo = {
  real_name?: string | null;
};

function normalizePrivateInfo(raw: CastPrivateInfo | CastPrivateInfo[] | null | undefined) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw;
}

function resolveBaseDate(raw: string | null | undefined) {
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTenure(baseDateRaw: string | null | undefined) {
  const baseDate = resolveBaseDate(baseDateRaw);
  if (!baseDate) return '-';
  const now = new Date();
  const diffInDays = Math.max(0, Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)));
  if (diffInDays < 30) return `${diffInDays}日`;
  const months = Math.floor(diffInDays / 30);
  if (months < 12) return `${months}ヶ月`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths === 0 ? `${years}年` : `${years}年${remainingMonths}ヶ月`;
}

function formatJoinedDate(baseDateRaw: string | null | undefined) {
  const baseDate = resolveBaseDate(baseDateRaw);
  if (!baseDate) return '-';
  return `${baseDate.getFullYear()}/${String(baseDate.getMonth() + 1).padStart(2, '0')}/${String(baseDate.getDate()).padStart(2, '0')}`;
}

export default async function CastProfilePage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const privateInfo = normalizePrivateInfo(
    cast.cast_private_info as CastPrivateInfo | CastPrivateInfo[] | null | undefined,
  );
  const realName = privateInfo?.real_name || '-';
  const joinedBaseDate = cast.joined_at || cast.created_at || null;

  const [pvResult, postsResult] = await Promise.all([
    getCastPVStats(cast.id as string),
    getMyCastPosts(cast.id as string),
  ]);

  const totalPV: number = pvResult.success ? (pvResult.totalPV ?? 0) : 0;
  const pvRank = pvResult.success ? pvResult.rank : '-';
  const totalCasts: number = pvResult.success ? (pvResult.totalCasts ?? 0) : 0;
  const publishedPosts = postsResult.data?.filter((p) => p.status === 'published') ?? [];
  const recentPosts = publishedPosts.slice(0, 4);
  const totalPostCount = postsResult.data?.length ?? 0;

  return (
    <CastMobileShell>
      <CastMobileHeader
        leftSlot={<CastMobileBackLink href="/cast/dashboard" label="ダッシュボード" />}
        rightSlot={<CastMobileHeaderBell />}
      />

      <main className="mx-auto w-full max-w-[422px] px-4 pt-5 pb-28 space-y-3">

        {/* ── Hero Card ── */}
        <CastMobileCard className="rounded-[20px] overflow-hidden p-0">
          {/* Gold gradient top strip */}
          <div
            className="h-[6px] w-full"
            style={{ background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)' }}
          />
          <div className="px-6 pt-5 pb-6 text-center">
            <div className="relative mx-auto mb-4 w-[80px] h-[80px]">
              <div
                className="w-full h-full rounded-full overflow-hidden border-[2px]"
                style={{ borderColor: 'rgba(201,167,106,0.5)' }}
              >
                <PlaceholderImage
                  src={cast.image_url}
                  alt={cast.stage_name || realName}
                  ratio="square"
                  placeholderText={cast.stage_name || realName}
                  className="h-full w-full object-cover"
                />
              </div>
              <Link
                href="/cast/profile/edit"
                className="absolute -bottom-1 -right-1 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[rgba(201,167,106,0.3)] bg-[#1a1c22]"
              >
                <Pencil className="h-[12px] w-[12px] text-[#c9a76a]" />
              </Link>
            </div>

            <h1 className="text-[20px] font-bold text-[#f7f4ed] leading-tight">
              {cast.stage_name || realName}
            </h1>
            <p className="mt-[2px] text-[12px] text-[#6b7280]">{realName}</p>
            <p className="mt-[2px] text-[11px] font-medium" style={{ color: '#c9a76a' }}>
              {cast.store_name || 'Club Animo'}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href="/cast/profile/edit"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[13px] font-bold"
                style={{
                  background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                  color: '#0b0b0d',
                }}
              >
                <Pencil className="h-[13px] w-[13px]" />
                プロフィール編集
              </Link>
            </div>
          </div>
        </CastMobileCard>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: CalendarRange, value: formatTenure(joinedBaseDate), label: '在籍' },
            { icon: Eye, value: totalPV > 999 ? `${(totalPV / 1000).toFixed(1)}k` : String(totalPV), label: '総PV' },
            { icon: Trophy, value: pvRank !== '-' && totalCasts > 0 ? `${String(pvRank)}位` : '-', label: 'ランク' },
            { icon: ShieldCheck, value: String(publishedPosts.length), label: '公開記事' },
          ].map((stat) => (
            <CastMobileCard key={stat.label} className="rounded-[14px] px-2 py-3 text-center">
              <stat.icon className="mx-auto h-[16px] w-[16px] text-[#c9a76a]" strokeWidth={1.8} />
              <div className="mt-[6px] text-[14px] font-bold leading-none text-[#f7f4ed]">{stat.value}</div>
              <div className="mt-[3px] text-[10px] leading-none text-[#6b7280]">{stat.label}</div>
            </CastMobileCard>
          ))}
        </div>

        {/* ── Profile Details ── */}
        <CastMobileCard className="overflow-hidden rounded-[16px] divide-y divide-white/[0.06]">
          {[
            { label: '本名', value: realName },
            { label: 'ステージ名', value: cast.stage_name || '-' },
            { label: '所属店舗', value: cast.store_name || 'Club Animo' },
            { label: '入店日', value: formatJoinedDate(joinedBaseDate) },
            { label: '総投稿数', value: `${totalPostCount}件` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-[14px]">
              <span className="text-[12px] text-[#6b7280]">{row.label}</span>
              <span className="text-[13px] font-medium text-[#f7f4ed]">{row.value}</span>
            </div>
          ))}
        </CastMobileCard>

        {/* ── Recent Posts ── */}
        {recentPosts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-[13px] w-[13px] text-[#c9a76a]" />
                <span className="text-[12px] font-semibold text-[#c7c0b2]">最近の投稿</span>
              </div>
              <Link href="/cast/posts" className="text-[11px] text-[#c9a76a] flex items-center gap-0.5">
                すべて見る
                <ChevronRight className="h-[11px] w-[11px]" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recentPosts.map((post) => (
                <CastMobileCard
                  key={post.id}
                  className="rounded-[14px] overflow-hidden p-0 aspect-[4/5] relative"
                >
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt="投稿画像"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1c1d22]">
                      <ImageIcon className="h-[20px] w-[20px] text-[#5a5650]" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2.5 py-2">
                    <div className="flex items-center gap-1 text-[10px] text-[#c7c0b2]">
                      <Eye className="h-[10px] w-[10px]" />
                      {(post.view_count ?? 0).toLocaleString()}
                    </div>
                  </div>
                </CastMobileCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Links ── */}
        <CastMobileCard className="overflow-hidden rounded-[16px] divide-y divide-white/[0.06]">
          {[
            { href: '/cast/posts', label: '自分の投稿を管理', icon: ImageIcon },
            { href: '/cast/shift', label: 'シフト申請', icon: CalendarRange },
            { href: '/cast/notices', label: 'お知らせを確認', icon: ShieldCheck },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-5 py-[14px] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-[14px] w-[14px] text-[#c9a76a]" strokeWidth={1.8} />
                <span className="text-[13px] text-[#c7c0b2]">{item.label}</span>
              </div>
              <ChevronRight className="h-[14px] w-[14px] text-[#5a5650]" />
            </Link>
          ))}
        </CastMobileCard>

        {/* ── Logout ── */}
        <form action={castLogout}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.08)] px-4 py-3 text-[13px] font-bold text-[#e06a6a] transition-colors hover:bg-[rgba(224,106,106,0.14)]"
          >
            <LogOut className="h-[14px] w-[14px]" />
            ログアウト
          </button>
        </form>

      </main>
    </CastMobileShell>
  );
}
