'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeroMedia, HeroTransitionMode } from './types';

interface HeroMediaLayerProps {
  media: HeroMedia[];
  activeIndex: number;
  transitionMode: HeroTransitionMode;
  transitionMs: number;
  isReducedMotion: boolean;
}

// ─────────────────────────────────────────────────────────────
// ロジック:
//   - 全動画を <video> として常時マウント（プリバッファ用）
//   - バックグラウンドの動画は pause + currentTime=0 でスタンバイ
//   - アクティブになった瞬間だけ currentTime=0 → play()
//   - opacity は CSS transition でクロスフェード（Framer Motion 不使用）
//     → JS フレームに依存しないためガタつきが出ない
// ─────────────────────────────────────────────────────────────
export const HeroMediaLayer: React.FC<HeroMediaLayerProps> = ({
  media,
  activeIndex,
  transitionMs,
  isReducedMotion,
}) => {
  if (media.length === 0) {
    return <div className="absolute inset-0 bg-gray-900" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {media.map((item, index) => (
        <VideoSlot
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          transitionMs={isReducedMotion ? 0 : transitionMs}
        />
      ))}
    </div>
  );
};

// ─── 個別スロット ───────────────────────────────────────────

interface VideoSlotProps {
  item: HeroMedia;
  isActive: boolean;
  transitionMs: number;
}

const VideoSlot: React.FC<VideoSlotProps> = ({ item, isActive, transitionMs }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false); // opacity 制御

  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type === 'image') return;

    if (isActive) {
      // ① 先頭にシーク
      video.currentTime = 0;
      // ② 少し待ってからフェードイン（シーク完了を待つ）
      const seekDelay = setTimeout(() => {
        video.play().catch(() => {});
        setVisible(true);
      }, 50);
      return () => clearTimeout(seekDelay);
    } else {
      // ③ フェードアウト開始
      setVisible(false);
      // ④ トランジション完了後に停止してリセット
      const stopDelay = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, transitionMs + 100);
      return () => clearTimeout(stopDelay);
    }
  }, [isActive, transitionMs, item.type]);

  // 初回マウント時: アクティブなら即再生
  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type === 'image') return;
    if (isActive) {
      video.play().catch(() => {});
      setVisible(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (item.type === 'image') {
    return (
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity"
        style={{
          backgroundImage: `url(${item.posterUrl || item.url})`,
          opacity: isActive ? 1 : 0,
          transitionDuration: `${transitionMs}ms`,
          transitionTimingFunction: 'ease-in-out',
          zIndex: isActive ? 10 : 1,
          willChange: 'opacity',
        }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 transition-opacity"
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${transitionMs}ms`,
        transitionTimingFunction: 'ease-in-out',
        zIndex: isActive ? 10 : 1,
        willChange: 'opacity',
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={item.url}
        poster={item.posterUrl}
        loop
        muted
        playsInline
        preload="auto"
        style={{ transform: 'translateZ(0)' }}
      />
    </div>
  );
};
