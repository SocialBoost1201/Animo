import { notFound } from 'next/navigation'
import { getStaffById } from '@/lib/actions/staffs'
import { StaffEditForm } from '@/components/features/admin/staffs/StaffEditForm'

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const staff = await getStaffById(id)
  if (!staff) notFound()

  return <StaffEditForm staff={staff} />
}
