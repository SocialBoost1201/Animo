import webpush from 'web-push';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:animo4266@gmaill.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key);
}

// POST body: { title: string, body: string, url?: string }
export async function POST(req: Request) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const { title, body, url } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (error) {
      console.error('Fetch subscriptions error:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url ?? 'https://club-animo.com',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
    });

    const results = await Promise.allSettled(
      (subscriptions ?? []).map((row: { subscription: string }) => {
        const sub = JSON.parse(row.subscription);
        return webpush.sendNotification(sub, payload);
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ success: true, sent, failed });
  } catch (err) {
    console.error('Send push error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
