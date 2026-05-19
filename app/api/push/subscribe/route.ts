import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';

function initWebPush(): boolean {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
  const priv = process.env.VAPID_PRIVATE_KEY ?? '';
  if (!pub || !priv) return false;
  webpush.setVapidDetails('mailto:animo4266@gmail.com', pub, priv);
  return true;
}

export async function POST(req: Request) {
  if (!initWebPush()) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const { error } = await serviceClient
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          subscription: JSON.stringify(subscription),
          user_id: user.id,
        },
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
