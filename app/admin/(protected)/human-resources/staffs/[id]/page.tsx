import type { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { StaffEditForm } from '@/components/features/admin/staffs/StaffEditForm';
import { getStaffById } from '@/lib/actions/staffs';

export const dynamic = 'force-dynamic';

type EditStaffPageProps = {
  params: Promise<{ id: string }>
};

export default async function EditStaffPage({ params }: EditStaffPageProps): Promise<ReactElement> {
  const { id } = await params;
  const staff = await getStaffById(id);

  if (!staff) {
    notFound();
  }

  return <StaffEditForm staff={staff} />;
}
