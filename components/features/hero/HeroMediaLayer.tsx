'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const shouldRenderDesktopVideo = useSyncExternalStore(
    (callback) => {
      const desktopQuery = window.matchMedia('(min-width: 768px)');
      const handleChange = () => callback();

      desktopQuery.addEventListener('change', handleChange);
      return () => desktopQuery.removeEventListener('change', handleChange);
    },
    () => window.matchMedia('(min-width: 768px)').matches,
    () => false
  );

  useEffect(() => {
    if (media.length === 0 || isReducedMotion || !shouldRenderDesktopVideo) return;

    media.forEach((item, i) => {
      const videoEl = videoRefs.current[i];
      if (!videoEl || item.type !== 'video') return;

      const isVisible = i === activeIndex;
      const isNext = i === (activeIndex + 1) % media.length;
      
      if ((isVisible || isNext) && !videoEl.getAttribute('src')) {
        videoEl.setAttribute('src', item.url);
        videoEl.load();
      }

      if (isVisible) {
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('[HeroVideo] Auto-play prevented or interrupted:', e);
          });
        }
      } else {
        setTimeout(() => {
          if (videoRefs.current[i]) {
             videoRefs.current[i]?.pause();
          }
        }, transitionMs);
      }
    });
  }, [activeIndex, shouldRenderDesktopVideo, media, isReducedMotion, transitionMs]);

  if (media.length === 0) {
    return <div className="absolute inset-0 bg-[#171717]" />;
  }

  // ──────────────────────────────────────
  // LCP 最適化戦略: 
  // サーバーサイドと初回クライアントサイドで「全く同じ構造」を保つ。
  // 最初のポスター画像を z-index 上位で priority 表示。
  // ──────────────────────────────────────
  
  const firstMedia = media[0];
  const firstPosterSrc = mobileFallbackSrc || (firstMedia.type === 'image' ? firstMedia.url : (firstMedia.posterUrl ?? '/images/hero-poster.webp'));
  const durationSec = `${transitionMs / 1000}s`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{ 
          zIndex: (activeIndex === 0) ? 15 : 5,
          opacity: (activeIndex === 0) ? 1 : 0 
        }}
      >
        <Image
          src={firstPosterSrc}
          alt={mobileFallbackAlt || firstMedia.title || 'Hero Background'}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {shouldRenderDesktopVideo && !isReducedMotion && media.slice(0, 3).map((item, i) => {
        if (i === 0 && item.type !== 'video') return null;

        const isActive = i === activeIndex;

        let enterStyle: React.CSSProperties = { opacity: 1 };
        let exitStyle: React.CSSProperties  = { opacity: 0 };

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
          default:
            enterStyle = { opacity: 1 };
            exitStyle  = { opacity: 0 };
            break;
        }

        const style: React.CSSProperties = {
          position: 'absolute',
          inset: 0,
          transition: `all ${durationSec} cubic-bezier(0.4, 0, 0.2, 1)`,
          zIndex: isActive ? 10 : 0,
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
                autoPlay={false}
                preload="metadata"
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={item.url}
                alt={item.title ?? 'Hero Background'}
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
