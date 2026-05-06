import { notFound } from 'next/navigation';
import { getStaffById } from '@/lib/actions/staffs';
import { StaffForm } from '@/components/features/admin/staffs/StaffForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'スタッフ編集 | Animo CMS',
};

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getStaffById(id);

  if (!staff) notFound();

  return <StaffForm initialData={staff} />;
}
