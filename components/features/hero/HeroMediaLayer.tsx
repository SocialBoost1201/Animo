'use client';

import React, { useEffect, useRef } from 'react';
import { HeroMedia, HeroTransitionMode } from './types';
import { motion } from 'framer-motion';

interface HeroMediaLayerProps {
  media: HeroMedia[];
  activeIndex: number;
  transitionMode: HeroTransitionMode;
  transitionMs: number;
  isReducedMotion: boolean;
}

export const HeroMediaLayer: React.FC<HeroMediaLayerProps> = ({
  media,
  activeIndex,
  transitionMode,
  transitionMs,
  isReducedMotion,
}) => {
  if (isReducedMotion || media.length === 0) {
    const backupMedia = media[0];
    if (!backupMedia) {
      return (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <span className="text-gray-600 text-xs">Media Not Set</span>
        </div>
      );
    }
    return (
      <div className="absolute inset-0">
        <MediaItem item={backupMedia} isActive={true} transitionMs={0} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {media.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
            }}
            transition={{
              duration: transitionMs / 1000,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              // GPU合成レイヤーに昇格させ、reflow を防ぐ
              willChange: 'opacity',
              zIndex: isActive ? 10 : 1,
              pointerEvents: 'none',
            }}
          >
            <MediaItem item={item} isActive={isActive} transitionMs={transitionMs} />
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── 個別メディアアイテム ─────────────────────────────────────

const MediaItem = ({
  item,
  isActive,
  transitionMs,
}: {
  item: HeroMedia;
  isActive: boolean;
  transitionMs: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // アクティブになったタイミングのみ play を試みる
  const didPlayRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // すでに再生中なら何もしない
      if (!video.paused) return;
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay policy に引っかかった場合は無視
      });
      didPlayRef.current = true;
    } else {
      // フェードアウト後にpauseしてCPUを解放
      const timer = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }, transitionMs + 200);
      return () => clearTimeout(timer);
    }
  }, [isActive, transitionMs]);

  if (item.type === 'image') {
    return (
      <div
        className="w-full h-full bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${item.posterUrl || item.url})` }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"   // ← object-contain を廃止し object-cover に統一
      src={item.url}
      poster={item.posterUrl}
      loop
      muted
      playsInline
      // アクティブな動画のみ preload=auto、非アクティブは metadata のみ
      preload={isActive ? 'auto' : 'metadata'}
      // GPU合成レイヤーに昇格させカクつきを抑制
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      onError={() => {
        // エラー時はポスター画像にフォールバック（stateなし＝再render不要）
        if (videoRef.current && item.posterUrl) {
          videoRef.current.style.display = 'none';
        }
      }}
    />
  );
};
