import { NextResponse } from 'next/server';
import { requireAdminLogin } from '@/lib/auth/admin';
import { getAdminNotificationSummary } from '@/lib/actions/admin-notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminLogin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const notifications = await getAdminNotificationSummary(auth.supabase);
  const notificationCounts: Record<string, number> = Object.fromEntries(
    notifications.items.map((item) => [item.id, item.count])
  );

  return NextResponse.json(
    {
      pendingPostsCount: notificationCounts['cast-posts'] ?? 0,
      pendingShiftsCount: notificationCounts['shift-submissions'] ?? 0,
      pendingApplicationsCount: notificationCounts.applications ?? 0,
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
