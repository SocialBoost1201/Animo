'use client';

import React, { useState, useEffect } from 'react';
import { HeroMediaLayer } from './HeroMediaLayer';
import { HeroVideoRotatorProps } from './types';

interface ExtendedHeroProps extends HeroVideoRotatorProps {
  cta?: React.ReactNode;
}

export const HeroVideoRotator: React.FC<ExtendedHeroProps> = ({
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

  return (
    <div className="relative h-screen min-h-[500px] w-full overflow-hidden bg-black flex items-center justify-center">
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
        <h1 className="text-white font-heading-en luxury-tracking-super text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          CLUB Animo
        </h1>
        <p className="text-white/80 font-heading-jp luxury-tracking text-sm md:text-base max-w-lg leading-[2.5] mb-10">
          煌びやかなシャンデリアの下で<br />
          特別な時間を
        </p>

        {/* CTA slot (propsから受け取る) */}
        {cta && (
          <div>
            {cta}
          </div>
        )}
      </div>
    </div>
  );
};
