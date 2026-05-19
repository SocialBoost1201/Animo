import 'server-only';

import webpush from 'web-push';
import { createServiceClient } from '@/lib/supabase/service';

function initWebPush(): boolean {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
  const priv = process.env.VAPID_PRIVATE_KEY ?? '';
  if (!pub || !priv) return false;
  webpush.setVapidDetails('mailto:animo4266@gmail.com', pub, priv);
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

/**
 * 特定のキャスト（auth_user_id）が登録している全端末へ Web Push を送信する。
 * 購読なし・VAPID未設定の場合は静かにスキップする（non-critical）。
 */
export async function sendPushToCastUser(
  authUserId: string | null,
  payload: PushPayload
): Promise<void> {
  if (!authUserId) return;
  if (!initWebPush()) return;

  const supabase = createServiceClient();
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('subscription, endpoint')
    .eq('user_id', authUserId);

  if (error || !subs || subs.length === 0) return;

  const raw = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/cast/dashboard',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
  });

  const results = await Promise.allSettled(
    subs.map((row) => webpush.sendNotification(JSON.parse(row.subscription as string), raw))
  );

  // 410 Gone（購読期限切れ）を削除
  const expiredEndpoints = results
    .map((r, i) => {
      if (
        r.status === 'rejected' &&
        (r as PromiseRejectedResult).reason?.statusCode === 410
      ) {
        return subs[i].endpoint as string;
      }
      return null;
    })
    .filter(Boolean) as string[];

  if (expiredEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', expiredEndpoints);
  }
}
