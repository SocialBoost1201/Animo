import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// VAPID 鍵は環境変数で管理
// 初回は `npx web-push generate-vapid-keys` で生成して .env に設定
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:animo4266@gmaill.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function POST(req: Request) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const supabase = await createClient();

    // Supabase の push_subscriptions テーブルへ保存（upsert）
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        { endpoint: subscription.endpoint, subscription: JSON.stringify(subscription) },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('Save push subscription error:', error);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
