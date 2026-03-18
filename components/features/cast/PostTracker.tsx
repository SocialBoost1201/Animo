'use client';

import { useEffect, useRef } from 'react';

export function PostTracker({ postId }: { postId: string }) {
  const isTracked = useRef(false);

  useEffect(() => {
    // StrictModeでの2回発火防止
    if (isTracked.current) return;
    isTracked.current = true;

    // 非同期でPVトラッキングAPIを叩く
    fetch('/api/track-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    }).catch((err) => {
      console.error('Failed to track post view:', err);
    });
  }, [postId]);

  return null; // UIを一切持たない非表示コンポーネント
}
