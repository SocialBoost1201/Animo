import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { CastPostUploadForm } from '@/components/features/cast/CastPostUploadForm';
import {
  CastMobileBackLink,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';

export default async function CastNewPostPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  return (
    <CastMobileShell>
      <CastMobileHeader />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-6 px-4 pb-28 pt-5">
        <CastMobileBackLink href="/cast/posts" label="一覧に戻る" />
        <CastMobileSectionTitle eyebrow="NEW POST" title="新規ブログ作成" description="投稿後、スタッフが審査してから公開されます" />
        <CastPostUploadForm castId={cast.id} />
      </main>
    </CastMobileShell>
  );
}
