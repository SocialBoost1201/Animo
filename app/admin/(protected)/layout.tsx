import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';

import { createClient } from '@/lib/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 並列実行でフェッチ時間を短縮
  const [userProfile, userRole] = await Promise.all([
    user ? supabase.from('profiles').select('role').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const role = userProfile.data?.role || userRole.data?.role || 'staff';

  return (
    <>
      <AdminToaster />
      <AdminLayout 
          pendingPostsCount={0}
          pendingShiftsCount={0}
          role={role}
      >
          {children}
      </AdminLayout>
    </>
  );
}
