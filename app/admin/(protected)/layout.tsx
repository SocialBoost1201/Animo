import { AdminLayout } from '@/components/layouts/AdminLayout';
import { getUnreadCounts } from '@/lib/actions/inquiries';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const unreadCount = await getUnreadCounts();
  return <AdminLayout unreadCount={unreadCount}>{children}</AdminLayout>;
}
