'use server';

import { createClient } from '@/lib/supabase/server';

export type AdminNotificationItem = {
  id: string;
  label: string;
  count: number;
  href: string;
  description: string;
};

export type AdminNotificationSummary = {
  total: number;
  items: AdminNotificationItem[];
};

export async function getAdminNotificationSummary(): Promise<AdminNotificationSummary> {
  const supabase = await createClient();

  const [
    pendingPosts,
    pendingShiftSubmissions,
    pendingShiftChanges,
    unreadApplications,
  ] = await Promise.all([
    supabase.from('cast_posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('shift_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('shift_change_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('recruit_applications').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  const items: AdminNotificationItem[] = [
    {
      id: 'shift-submissions',
      label: 'シフト提出の承認待ち',
      count: pendingShiftSubmissions.count || 0,
      href: '/admin/shift-requests?tab=new&status=pending',
      description: 'キャストから提出されたシフトがあります。',
    },
    {
      id: 'shift-changes',
      label: 'シフト変更申請',
      count: pendingShiftChanges.count || 0,
      href: '/admin/shift-requests?tab=change&status=pending',
      description: 'キャストからシフト変更の申請があります。',
    },
    {
      id: 'cast-posts',
      label: 'キャスト投稿の承認待ち',
      count: pendingPosts.count || 0,
      href: '/admin/posts?status=pending',
      description: '公開前に確認が必要な投稿があります。',
    },
    {
      id: 'applications',
      label: '求人応募の未読',
      count: unreadApplications.count || 0,
      href: '/admin/applications?filter=unread',
      description: 'まだ確認していない求人応募があります。',
    },
  ];

  return {
    total: items.reduce((sum, item) => sum + item.count, 0),
    items,
  };
}
