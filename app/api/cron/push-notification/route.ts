import webpush from 'web-push'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? ''

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:animo4266@gmaill.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )
}

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createSupabaseClient(url, key)
}

/**
 * CRON_SECRET 認証で Web Push を全購読者に送信するエンドポイント。
 * n8n や Vercel Cron から呼び出される。
 *
 * POST body: { title: string, body: string, url?: string }
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(req: Request): Promise<NextResponse> {
  // ── 認証 ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── VAPID 設定確認 ────────────────────────────────────────────────────────
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { error: 'VAPID keys not configured' },
      { status: 500 }
    )
  }

  // ── リクエストボディ ────────────────────────────────────────────────────
  let title: string
  let body: string
  let url: string | undefined

  try {
    const parsed = await req.json()
    title = parsed.title
    body = parsed.body
    url = parsed.url
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!title || !body) {
    return NextResponse.json(
      { error: 'title and body are required' },
      { status: 400 }
    )
  }

  // ── 購読者一覧取得 ────────────────────────────────────────────────────────
  const supabase = getServiceRoleClient()
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('subscription')

  if (error) {
    console.error('[WebPush] fetch subscriptions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ success: true, sent: 0, failed: 0, skipped: true })
  }

  // ── ペイロード組み立て ─────────────────────────────────────────────────
  const payload = JSON.stringify({
    title,
    body,
    url: url ?? 'https://club-animo.jp',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
  })

  // ── 全購読者へ送信 ────────────────────────────────────────────────────────
  const results = await Promise.allSettled(
    subscriptions.map((row: { subscription: string }) => {
      const sub = JSON.parse(row.subscription)
      return webpush.sendNotification(sub, payload)
    })
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  // 期限切れ等の 410 Gone 購読を削除
  const expiredEndpoints: string[] = results
    .map((r, i) => {
      if (
        r.status === 'rejected' &&
        (r as PromiseRejectedResult).reason?.statusCode === 410
      ) {
        try {
          return JSON.parse(subscriptions[i].subscription).endpoint as string
        } catch {
          return null
        }
      }
      return null
    })
    .filter(Boolean) as string[]

  if (expiredEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', expiredEndpoints)
  }

  console.log(`[WebPush] sent=${sent} failed=${failed} expired_removed=${expiredEndpoints.length}`)

  return NextResponse.json({ success: true, sent, failed })
}
