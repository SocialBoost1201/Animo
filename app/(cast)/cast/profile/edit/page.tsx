import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';
import { ProfileImageChangeForm } from '@/components/features/cast/ProfileImageChangeForm';

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
          description="プロフィール情報の変更はスタッフ対応です。プロフィール画像は下のフォームから申請できます。"
        />

        {/* ── プロフィール情報 ── */}
        <CastMobileCard className="space-y-4 px-5 py-5">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">現在の表示名</div>
            <div className="mt-2 text-base font-bold text-[#f7f4ed]">{cast.stage_name || cast.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">表示名・ステージ名の変更</div>
            <p className="mt-2 text-sm leading-6 text-[#a9afbc]">
              変更希望がある場合は、店舗スタッフへお伝えください。対応後にこの画面へ反映されます。
            </p>
          </div>
        </CastMobileCard>

        {/* ── プロフィール画像変更申請 ── */}
        <CastMobileCard className="space-y-4 px-5 py-5">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">プロフィール画像の変更申請</div>
            <p className="mt-2 text-sm leading-6 text-[#a9afbc]">
              新しい画像をアップロードして申請してください。店長が確認・承認後に反映されます。
            </p>
          </div>
          <ProfileImageChangeForm />
        </CastMobileCard>
      </main>
    </CastMobileShell>
  );
}
