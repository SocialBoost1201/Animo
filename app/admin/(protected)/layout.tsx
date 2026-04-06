import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';

import { createClient } from '@/lib/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 並列実行でフェッチ時間を短縮
  const [userProfile, userRole, pendingPosts, pendingShifts] = await Promise.all([
    user ? supabase.from('profiles').select('role').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from('cast_posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('shift_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const role = userProfile.data?.role || userRole.data?.role || 'staff';

  const pendingPostsCount = pendingPosts.count || 0;
  const pendingShiftsCount = pendingShifts.count || 0;

  return (
    <>
      <AdminToaster />
      <AdminLayout 
          pendingPostsCount={pendingPostsCount || 0} 
          pendingShiftsCount={pendingShiftsCount || 0}
          role={role}
      >
          {children}
      </AdminLayout>
    </>
  );
}
