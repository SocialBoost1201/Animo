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
  if (media.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <span className="text-gray-600 text-xs">Media Not Set</span>
      </div>
    );
  }

  // reducedMotion: 最初の1枚だけ表示
  if (isReducedMotion) {
    return (
      <div className="absolute inset-0">
        <MediaItem item={media[0]} autoPlay={false} />
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
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{
              duration: isActive
                ? transitionMs / 1000       // フェードイン速度
                : (transitionMs * 1.5) / 1000, // フェードアウトは少し遅め
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
            style={{
              willChange: 'opacity',
              zIndex: isActive ? 10 : 1,
            }}
          >
            <MediaItem item={item} autoPlay={true} />
          </motion.div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MediaItem
// 動画は常時再生させたまま opacity のみで切り替える
// pause()/currentTime リセットは行わない → 切り替え時の黒画面を防ぐ
// ─────────────────────────────────────────────────────────────
const MediaItem = ({
  item,
  autoPlay,
}: {
  item: HeroMedia;
  autoPlay: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // マウント時に一度だけ再生を試みる
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;
    video.play().catch(() => {
      // Autoplay policy に引っかかった場合はブラウザの自動判定に任せる
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      className="w-full h-full object-cover"
      src={item.url}
      poster={item.posterUrl}
      autoPlay={autoPlay}
      loop
      muted
      playsInline
      preload="auto"
      // GPU合成レイヤーに昇格 → メインスレッドのペイント処理を排除
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    />
  );
};
