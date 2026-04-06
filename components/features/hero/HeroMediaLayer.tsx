'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { HeroMedia } from './types';

interface HeroMediaLayerProps {
  media: HeroMedia[];
  activeIndex: number;
  transitionMode: string;
  transitionMs: number;
  isReducedMotion: boolean;
  mobileFallbackSrc?: string;
  mobileFallbackAlt?: string;
}

export const HeroMediaLayer: React.FC<HeroMediaLayerProps> = ({
  media,
  activeIndex,
  transitionMode,
  transitionMs,
  isReducedMotion,
  mobileFallbackSrc,
  mobileFallbackAlt,
}) => {
  const [isMobile, setIsMobile] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // アクティブな動画の再生制御
  useEffect(() => {
    if (media.length === 0 || isReducedMotion || isMobile) return;

    media.forEach((item, i) => {
      const videoEl = videoRefs.current[i];
      if (!videoEl || item.type !== 'video') return;

      const isVisible = i === activeIndex;
      const isNext = i === (activeIndex + 1) % media.length;
      
      // 遅延読み込み (Lazy Loading)
      if ((isVisible || isNext) && !videoEl.getAttribute('src')) {
        videoEl.setAttribute('src', item.url);
        videoEl.load();
      }

      if (isVisible) {
        // iOS/Safariの自動再生制限対策
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('[HeroVideo] Auto-play prevented or interrupted:', e);
          });
        }
      } else {
        // フェードアウトのトランジション中（transitionMs）は動画を止めないための遅延停止
        setTimeout(() => {
          if (videoRefs.current[i]) {
             videoRefs.current[i]?.pause();
          }
        }, transitionMs);
      }
    });
  }, [activeIndex, isMobile, media, isReducedMotion, transitionMs]);

  if (media.length === 0) {
    return <div className="absolute inset-0 bg-[#171717]" />;
  }

  if (isMobile || isReducedMotion) {
    const fallbackMedia = media[0];
    const fallbackSrc =
      mobileFallbackSrc ||
      (fallbackMedia.type === 'image'
        ? fallbackMedia.url
        : fallbackMedia.posterUrl || '/images/hero-poster.webp');

    return (
      <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
        <Image
          src={fallbackSrc}
          alt={mobileFallbackAlt || fallbackMedia.title || 'Hero Background'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  // ハイドレーション後もDOM構造は同じに保つ
  const durationSec = `${transitionMs / 1000}s`;

  // デスクトップ: 最初に表示されるポスター画像をpriority=trueで先行描画（LCP対象）
  const firstPosterSrc = media.length > 0
    ? (media[0].type === 'image' ? media[0].url : (media[0].posterUrl ?? null))
    : null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
      {/* LCP最適化: 最初に実際に見えるポスター画像をpriority描画（opacity:0では効果なし → 実表示） */}
      {firstPosterSrc && (
        <Image
          src={firstPosterSrc}
          alt={media[0].title ?? 'Hero Background'}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
          style={{ zIndex: 5 }}
        />
      )}

      {media.slice(0, 3).map((item, i) => {
        const isActive = i === activeIndex;

        // トランジションのスタイリング（基本はFade）
        let enterStyle: React.CSSProperties = { opacity: 1 };
        let exitStyle: React.CSSProperties  = { opacity: 0 };

        if (!isReducedMotion) {
          switch (transitionMode) {
            case 'slide':
              enterStyle = { transform: 'translateX(0)', opacity: 1 };
              exitStyle  = { transform: 'translateX(-5%)', opacity: 0 };
              break;
            case 'zoom':
              enterStyle = { transform: 'scale(1)', opacity: 1 };
              exitStyle  = { transform: 'scale(1.08)', opacity: 0 };
              break;
            case 'burn':
              enterStyle = { filter: 'brightness(1)', opacity: 1 };
              exitStyle  = { filter: 'brightness(3)', opacity: 0 };
              break;
            case 'ripple': // 旧エフェクトの互換性維持のため、フェードクロスに変更
            case 'fade':
            default:
              enterStyle = { opacity: 1 };
              exitStyle  = { opacity: 0 };
              break;
          }
        }

        const style: React.CSSProperties = {
          position: 'absolute',
          inset: 0,
          transition: isReducedMotion ? 'none' : `all ${durationSec} cubic-bezier(0.4, 0, 0.2, 1)`,
          zIndex: isActive ? 10 : 0, // アクティブなものを手前に
          ...(isActive ? enterStyle : exitStyle),
        };

        return (
          <div key={item.id} style={style}>
            {item.type === 'video' ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                poster={item.posterUrl}
                autoPlay={false} // useEffect側で明示的にコントロールするため初期はfalse
                preload={i === 0 ? "auto" : "none"} // 最初の動画はバッファリング開始を早める
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                // ※ ここで src={item.url} と書かないことでLazy Loadを実現
              />
            ) : (
              <Image
                src={item.url}
                alt={item.title ?? 'Hero Background'}
                fill
                priority={i === 0}
                className="object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
