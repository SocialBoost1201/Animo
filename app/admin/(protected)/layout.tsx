import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';
import { getAdminNotificationSummary } from '@/lib/actions/admin-notifications';
import { requireAdminLogin } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdminLogin();

  if (!auth.ok) {
    if (auth.status === 401) redirect('/admin/login');
    redirect('/');
  }

  const notifications = await getAdminNotificationSummary();

  return (
    <>
      <AdminToaster />
      <AdminLayout 
          pendingPostsCount={0}
          pendingShiftsCount={0}
          pendingNotificationsCount={notifications.total}
          role={auth.role}
      >
          {children}
      </AdminLayout>
    </>
  );
}
