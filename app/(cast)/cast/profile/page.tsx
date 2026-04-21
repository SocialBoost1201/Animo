import { redirect } from 'next/navigation';
import { ShieldCheck, CalendarRange } from 'lucide-react';
import { getCurrentCast, castLogout } from '@/lib/actions/cast-auth';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';

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

  if (diffInDays < 30) {
    return `${diffInDays}日`;
  }

  const months = Math.floor(diffInDays / 30);
  if (months < 12) {
    return `${months}か月`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years}年`;
  }

  return `${years}年${remainingMonths}か月`;
}

function formatJoinedDate(baseDateRaw: string | null | undefined) {
  const baseDate = resolveBaseDate(baseDateRaw);
  if (!baseDate) return '-';
  return baseDate.toLocaleDateString('ja-JP');
}

export default async function CastProfilePage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const privateInfo = normalizePrivateInfo(
    cast.cast_private_info as CastPrivateInfo | CastPrivateInfo[] | null | undefined,
  );
  const realName = privateInfo?.real_name || '-';
  const joinedBaseDate = cast.joined_at || cast.created_at || null;

  const metrics = [
    { icon: CalendarRange, value: formatTenure(joinedBaseDate), label: '在籍期間' },
    { icon: ShieldCheck, value: '算出中', label: '出勤率' },
  ];

  const details = [
    { label: '本名', value: realName },
    { label: 'ステージ名', value: cast.stage_name || '-' },
    { label: '所属店舗', value: cast.store_name || 'Club Animo Shinjuku' },
    { label: '入店日', value: formatJoinedDate(joinedBaseDate) },
  ];

  return (
    <CastMobileShell>
      <CastMobileHeader leftSlot={<CastMobileBackLink href="/cast/dashboard" label="ダッシュボードへ戻る" />} />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-[19px] px-4 pb-28 pt-6">

        <CastMobileCard className="rounded-[16px] px-6 py-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[1.8px] border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)]">
            <PlaceholderImage
              src={cast.image_url}
              alt={cast.stage_name || realName}
              ratio="square"
              placeholderText={cast.stage_name || realName}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-[14px] text-[22px] font-bold leading-[33px] text-[#f7f4ed]">{cast.stage_name || realName}</h1>
          <p className="mt-[2px] text-[13px] leading-[19.5px] text-[#6b7280]">{realName}</p>
          <p className="mt-[2px] text-[12px] leading-[18px] text-[#c9a76a]">{cast.store_name || 'Club Animo Shinjuku'}</p>
          <Link href="/cast/profile/edit" className="mt-[16px] inline-flex items-center gap-2 rounded-[14px] border border-[rgba(201,167,106,0.2)] bg-[rgba(201,167,106,0.15)] px-4 py-[9px] text-[13px] font-bold leading-[19.5px] text-[#c9a76a]">
            プロフィールを編集
          </Link>
        </CastMobileCard>

        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <CastMobileCard key={metric.label} className="rounded-[14px] px-3 py-4 text-center">
              <metric.icon className="mx-auto h-[18px] w-[18px] text-[#c9a76a]" strokeWidth={1.8} />
              <div className="mt-[8px] text-[16px] font-bold leading-6 text-[#f7f4ed]">{metric.value}</div>
              <div className="mt-[2px] text-[11px] leading-[16.5px] text-[#6b7280]">{metric.label}</div>
            </CastMobileCard>
          ))}
        </div>

        <CastMobileCard className="overflow-hidden rounded-[16px] divide-y divide-white/8">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-[13px] leading-[19.5px] text-[#6b7280]">{detail.label}</span>
              <span className="text-[13px] font-medium leading-[19.5px] text-[#f7f4ed]">{detail.value}</span>
            </div>
          ))}
        </CastMobileCard>

        <form action={castLogout}>
          <button
            type="submit"
            className="w-full rounded-[14px] border border-[rgba(224,106,106,0.2)] bg-[rgba(224,106,106,0.12)] px-4 py-3 text-[14px] font-bold leading-[21px] text-[#e06a6a]"
          >
            ログアウト
          </button>
        </form>
      </main>
    </CastMobileShell>
  );
}
