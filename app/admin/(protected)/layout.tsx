import type { Metadata } from 'next';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';
import { requireAdminLogin } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdminLogin();

  if (!auth.ok) {
    if (auth.status === 401) redirect('/admin/login');
    redirect('/');
  }

  return (
    <>
      <AdminToaster />
      <AdminLayout 
          pendingPostsCount={0}
          pendingShiftsCount={0}
          role={auth.role}
      >
          {children}
      </AdminLayout>
    </>
  );
}
