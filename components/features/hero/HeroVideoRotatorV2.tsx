'use client';

/**
 * HeroVideoRotatorV2
 * -------------------------------------------------
 * テスト用コンポーネント。オープニングアニメーションを追加。
 * 本番移行が承認されたら HeroVideoRotator を置き換える。
 *
 * アニメーションシーケンス:
 *  ① clip-hero-anim  … 中央点 → 全画面展開 (1.25s)
 *  ② 背景動画スタート (0.25s〜)
 *  ③ CLUB Animo       フェードイン (delay 1.5s)
 *  ④ 煌びやかな〜      フェードイン (delay 1.9s)
 *  ⑤ 特別な時間を      フェードイン (delay 2.2s)
 *  ⑥ CTA              フェードイン (delay 2.5s)
 *
 * CSS: @keyframes は app/globals.css に定義
 * -------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { HeroMediaLayer } from './HeroMediaLayer';
import { HeroVideoRotatorProps } from './types';

interface ExtendedHeroProps extends HeroVideoRotatorProps {
  cta?: React.ReactNode;
}

export const HeroVideoRotatorV2: React.FC<ExtendedHeroProps> = ({
  media = [],
  transitionMode = 'fade',
  durationMs = 5000,
  transitionMs = 800,
  overlayOpacity = 0.4,
  mobileFallbackSrc,
  mobileFallbackAlt,
  cta,
}) => {
  const displayMedia = media.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setTimeout(() => setIsReducedMotion(mediaQuery.matches), 0);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (displayMedia.length <= 1 || isReducedMotion) return;
    const currentDurationMs = displayMedia[activeIndex]?.durationMs || durationMs;
    const interval = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % displayMedia.length);
    }, currentDurationMs);
    return () => clearTimeout(interval);
  }, [displayMedia, activeIndex, durationMs, isReducedMotion]);

  // ──────────────────────────────────────
  // アニメーション スタイル定義
  // ──────────────────────────────────────
  const wrapperStyle: React.CSSProperties = isReducedMotion
    ? {}
    : {
        animation: 'clip-hero-anim 1.25s cubic-bezier(0.29, 0.8, 0.8, 0.98) both',
        willChange: 'clip-path',
      };

  const makeTextStyle = (delayS: number): React.CSSProperties =>
    isReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 0,
          animation: `hero-fade-in-up 0.75s ${delayS}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
          willChange: 'opacity, transform',
        };

  return (
    <div
      className="relative h-screen min-h-[500px] w-full overflow-hidden bg-black flex items-center justify-center"
      style={wrapperStyle}
    >
      {/* 1. Media Layer */}
      <HeroMediaLayer
        media={displayMedia}
        activeIndex={activeIndex}
        transitionMode={transitionMode}
        transitionMs={transitionMs}
        isReducedMotion={isReducedMotion}
        mobileFallbackSrc={mobileFallbackSrc}
        mobileFallbackAlt={mobileFallbackAlt}
      />

      {/* 2. Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-10"
        style={{ opacity: overlayOpacity }}
      />

      {/* 3. Copy & CTA */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 w-full">
        {/* ③ CLUB Animo */}
        <h1
          className="text-white font-serif luxury-tracking-super text-4xl md:text-5xl lg:text-6xl font-normal mb-6"
          style={makeTextStyle(1.5)}
        >
          CLUB Animo
        </h1>

        {/* ④⑤ サブコピー（行ごとに分割してアニメーション） */}
        <div className="text-white/80 font-serif luxury-tracking text-sm md:text-base max-w-lg leading-[2.5] mb-10">
          <p style={makeTextStyle(1.9)}>煌びやかなシャンデリアの下で</p>
          <p style={makeTextStyle(2.2)}>特別な時間を</p>
        </div>

        {/* ⑥ CTA slot */}
        {cta && (
          <div style={makeTextStyle(2.5)}>
            {cta}
          </div>
        )}
      </div>
    </div>
  );
};
