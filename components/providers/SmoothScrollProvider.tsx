'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'
import { GSAPScrollIntegration } from '@/components/providers/GSAPScrollIntegration'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.05,        // スクロールの滑らかさ
        duration: 1.5,     // 仮想スクロールの持続時間
        smoothWheel: true, // マウスホイールのスムース化
        syncTouch: false,  // タッチスクロール時はネイティブ動作を優先
      }}
    >
      <GSAPScrollIntegration />
      {children}
    </ReactLenis>
  )
}

