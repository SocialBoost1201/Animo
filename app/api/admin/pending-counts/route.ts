import { NextResponse } from 'next/server';
import { requireAdminLogin } from '@/lib/auth/admin';
import { getAdminNotificationSummary } from '@/lib/actions/admin-notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminLogin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const [pendingPosts, pendingShifts, notifications] = await Promise.all([
    auth.supabase.from('cast_posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    auth.supabase.from('shift_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    getAdminNotificationSummary(),
  ]);

  return NextResponse.json(
    {
      pendingPostsCount: pendingPosts.count || 0,
      pendingShiftsCount: pendingShifts.count || 0,
      pendingNotificationsCount: notifications.total,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
