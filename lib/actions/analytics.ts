'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { createHash } from 'crypto'

/**
 * ページビューを記録する
 */
export async function logPageView(path: string, referrer: string | null) {
  const supabase = await createClient()
  const headerList = await headers()
  
  const userAgent = headerList.get('user-agent') || 'unknown'
  const ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1'
  
  // IPとUAから匿名ハッシュを作成（個人の特定はせず、重複判定のみに使用）
  const viewerHash = createHash('sha256')
    .update(`${ip}-${userAgent}`)
    .digest('hex')

  const { data, error } = await supabase.rpc('log_site_access', {
    p_path: path,
    p_referrer: referrer || null,
    p_user_agent: userAgent,
    p_viewer_hash: viewerHash
  })

  if (error) {
    console.error('Failed to log page view:', error)
    return { success: false }
  }

  return { success: true, logged: data }
}

/**
 * ダッシュボード用の解析サマリーを取得する
 */
export async function getAnalyticsSummary() {
  const supabase = await createClient()
  
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()

  // 1. 本日のPV
  const { count: todayPv } = await supabase
    .from('site_analytics')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart)

  // 2. 昨日のPV
  const { count: yesterdayPv } = await supabase
    .from('site_analytics')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', yesterdayStart)
    .lt('created_at', todayStart)

  // 3. アクティブユーザー（直近5分間にアクセスがあったユニークな viewer_hash 数）
  const { data: activeUsersData } = await supabase
    .from('site_analytics')
    .select('viewer_hash')
    .gte('created_at', fiveMinsAgo)
  
  const activeUsers = new Set(activeUsersData?.map(d => d.viewer_hash)).size

  return {
    todayPv: todayPv || 0,
    yesterdayPv: yesterdayPv || 0,
    activeUsers: activeUsers || 0,
  }
}
