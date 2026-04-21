import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { CastManualPage } from '@/components/features/cast/ManualPage';
import {
  CastMobileBackLink,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';

export default async function ManualPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  return (
    <CastMobileShell>
      <CastMobileHeader leftSlot={<CastMobileBackLink href="/cast/profile" label="プロフィールへ戻る" />} />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-[24px] px-4 pb-28 pt-6">
        <CastMobileSectionTitle
          eyebrow="Guide"
          title="操作マニュアル"
          description="キャスト専用のシステム利用ガイドです。"
        />
        
        {/* マニュアルコンポーネント */}
        <section>
          <CastManualPage />
        </section>

      </main>
    </CastMobileShell>
  );
}
