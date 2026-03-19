'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { logPageView } from '@/lib/actions/analytics'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // パスが変わるたびにログを送信
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const referrer = document.referrer
    
    // 非同期で記録（ユーザーの操作を妨げない）
    logPageView(url, referrer).catch(err => {
      console.warn('Analytics tracking failed:', err)
    })
  }, [pathname, searchParams])

  return null // 何も表示しない
}
