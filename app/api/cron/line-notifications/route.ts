import { NextResponse } from 'next/server'
import { runScheduledNotifications } from '@/lib/actions/line-notifications'

/**
 * LINE 自動通知スケジューラー
 *
 * Vercel Cron: `*\/15 * * * *` (15分ごと)
 * vercel.json に追記済み
 *
 * 処理フロー:
 * 1. CRON_SECRET で認証
 * 2. 有効な通知を取得し、JST現在時刻と照合
 * 3. 発火条件を満たすものを LINE API で送信
 * 4. 送信ログを line_notification_logs に記録
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization')
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runScheduledNotifications()
    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[LINE Cron] エラー:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
