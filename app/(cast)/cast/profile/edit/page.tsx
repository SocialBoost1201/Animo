import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';

export default async function CastProfileEditPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  return (
    <CastMobileShell>
      <CastMobileHeader leftSlot={<CastMobileBackLink href="/cast/profile" label="プロフィールに戻る" />} />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-28 pt-5">
        <CastMobileSectionTitle
          eyebrow="Profile Edit"
          title="プロフィール編集"
          description="プロフィール編集は現在スタッフ対応です。変更したい内容を確認してください。"
        />

        <CastMobileCard className="space-y-4 px-5 py-5">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">現在の表示名</div>
            <div className="mt-2 text-base font-bold text-[#f7f4ed]">{cast.stage_name || cast.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">案内</div>
            <p className="mt-2 text-sm leading-6 text-[#a9afbc]">
              変更希望がある場合は、店舗スタッフへお伝えください。対応後にこの画面へ反映されます。
            </p>
          </div>
        </CastMobileCard>
      </main>
    </CastMobileShell>
  );
}
