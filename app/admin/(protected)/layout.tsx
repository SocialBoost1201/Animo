import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AdminToaster } from '@/components/features/admin/AdminToaster';

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
      .maybeSingle();

    if (profile?.role) {
      role = profile.role;
    } else {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userRole?.role) {
        role = userRole.role;
      }
    }
  }


  // 承認待ちのキャスト投稿件数を取得
  const { count: pendingPostsCount } = await supabase
    .from('cast_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  // 承認待ちのキャストシフト提出件数を取得
  const { count: pendingShiftsCount } = await supabase
    .from('shift_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

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
