import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';
import { getUnreadCounts } from '@/lib/actions/inquiries';

import { createClient } from '@/lib/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'staff';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) role = profile.role;
  }

  const unreadCount = await getUnreadCounts();
  return (
    <>
      <AdminToaster />
      <AdminLayout unreadCount={unreadCount} role={role}>{children}</AdminLayout>
    </>
  );
}
