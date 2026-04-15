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
  const [mounted] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // アクティブな動画の再生制御
  useEffect(() => {
    if (!mounted || media.length === 0 || isReducedMotion || isMobile) return;

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
  }, [activeIndex, isMobile, media, isReducedMotion, transitionMs, mounted]);

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
      {/* 
        1. LCP Core Image: 
        この要素はサーバー/クライアントで不変。
        activeIndex が 0 の間（初期状態）はこれが最前面に見えるように z-index を調整。
      */}
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

      {/* 
        2. Rotator Layer:
        ハイドレーション後にデスクトップかつ非 Reduced Motion の場合のみ描画、
        または常に描画して opacity で制御。
        ここではハイドレーション後にアクティブにする。
      */}
      {mounted && !isMobile && !isReducedMotion && media.slice(0, 3).map((item, i) => {
        // index 0 は LCP Core Image で既に出ているので、動画でない場合は飛ばしても良いが、
        // トランジションをスムーズにするために動画の場合はここで管理する。
        if (i === 0 && item.type !== 'video') return null;

        const isActive = i === activeIndex;

        // トランジションのスタイリング（基本はFade）
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
                preload={i === 0 ? "auto" : "none"}
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
