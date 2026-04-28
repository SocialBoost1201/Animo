import { redirect } from 'next/navigation';

export default async function LegacyHumanResourcePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const suffix = slug.length > 0 ? `/${slug.join('/')}` : '';

  redirect(`/admin/human-resources${suffix}`);
}
