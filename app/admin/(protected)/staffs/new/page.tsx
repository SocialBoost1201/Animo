import { StaffForm } from '@/components/features/admin/staffs/StaffForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'スタッフ登録 | Animo CMS',
};

export default async function NewStaffPage() {
  return <StaffForm />;
}
