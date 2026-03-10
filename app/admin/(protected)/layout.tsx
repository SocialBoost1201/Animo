import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';
import { getUnreadCounts } from '@/lib/actions/inquiries';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const unreadCount = await getUnreadCounts();
  return (
    <>
      <AdminToaster />
      <AdminLayout unreadCount={unreadCount}>{children}</AdminLayout>
    </>
  );
}
