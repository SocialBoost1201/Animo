'use client';

import React, { useState, useEffect } from 'react';
import { HeroMediaLayer } from './HeroMediaLayer';
import { HeroVideoRotatorProps } from './types';
import { motion } from 'framer-motion';
import { HeroMedia } from './types';

interface ExtendedHeroProps extends HeroVideoRotatorProps {
  cta?: React.ReactNode;
}

export const HeroVideoRotator: React.FC<ExtendedHeroProps> = ({
  media = [],
  transitionMode = 'fade',
  durationMs = 5000,
  transitionMs = 800,
  overlayOpacity = 0.4,
  cta,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (media.length <= 1 || isReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, durationMs);
    return () => clearInterval(interval);
  }, [media.length, durationMs, isReducedMotion]);

  return (
    <div className="relative h-screen min-h-[500px] w-full overflow-hidden bg-black flex items-center justify-center">
      {/* 1. Media Layer */}
      <HeroMediaLayer
        media={media}
        activeIndex={activeIndex}
        transitionMode={transitionMode}
        transitionMs={transitionMs}
        isReducedMotion={isReducedMotion}
      />

      {/* 2. Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-10"
        style={{ opacity: overlayOpacity }}
      />

      {/* 3. Copy & CTA */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-white font-serif luxury-tracking-super text-4xl md:text-5xl lg:text-6xl font-normal mb-6"
        >
          CLUB Animo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="text-white/80 font-serif luxury-tracking text-sm md:text-base max-w-lg leading-[2.5] mb-10"
        >
          煌びやかなシャンデリアの下で<br />
          特別な時間を
        </motion.p>

        {/* CTA slot (propsから受け取る) */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: 'easeOut' }}
          >
            {cta}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-white/50 text-[9px] uppercase luxury-tracking mb-3 font-serif">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-linear-to-b from-white to-transparent"
        />
      </motion.div>
    </div>
  );
};
