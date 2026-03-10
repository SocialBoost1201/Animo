'use client';

import { useEffect } from 'react';
import { trackCastView } from '@/lib/analytics';

interface CastViewTrackerProps {
  castId: string;
  castName: string;
}

/**
 * キャスト詳細ページ閲覧時にカスタムイベントを送信するクライアントコンポーネント
 */
export function CastViewTracker({ castId, castName }: CastViewTrackerProps) {
  useEffect(() => {
    trackCastView(castName, castId);
  }, [castId, castName]);

  return null;
}
