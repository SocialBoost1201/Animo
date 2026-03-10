'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroMediaLayer } from './HeroMediaLayer';
import { HeroVideoRotatorProps } from './types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
    const timer = setTimeout(() => setIsReducedMotion(mediaQuery.matches), 0);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (media.length <= 1 || isReducedMotion) return;
    const currentDurationMs = media[activeIndex]?.durationMs || durationMs;
    const interval = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, currentDurationMs);
    return () => clearTimeout(interval);
  }, [media, activeIndex, durationMs, isReducedMotion]);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || isReducedMotion) return;

    const tl = gsap.timeline();
    const texts = containerRef.current.querySelectorAll('.hero-text');
    const ctaEl = containerRef.current.querySelector('.hero-cta');
    const indicator = containerRef.current.querySelector('.hero-indicator');
    const line = containerRef.current.querySelector('.hero-line');

    // 初期化
    gsap.set(texts, { opacity: 0, y: 30 });
    if (ctaEl) gsap.set(ctaEl, { opacity: 0, y: 20 });
    gsap.set(indicator, { opacity: 0 });

    // アニメーションシーケンス
    tl.to(texts[0], { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.8')
      .to(texts[1], { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8');
    
    if (ctaEl) {
      tl.to(ctaEl, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.8');
    }

    tl.to(indicator, { opacity: 1, duration: 1.0 }, '-=0.5');

    // スクロールインジケーターのループアニメーション
    if (line) {
      gsap.to(line, {
        height: '48px',
        opacity: 0,
        y: 48,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
      });
    }

    // スクロール時のパララックス効果
    gsap.to(containerRef.current.querySelector('.hero-content'), {
      yPercent: 30,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

  }, { scope: containerRef, dependencies: [isReducedMotion] });

  return (
    <div ref={containerRef} className="relative h-screen min-h-[500px] w-full overflow-hidden bg-black flex items-center justify-center">
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
      <div className="hero-content relative z-20 flex flex-col items-center justify-center h-full text-center px-4 w-full">
        <h1 className="hero-text text-white font-serif luxury-tracking-super text-4xl md:text-5xl lg:text-6xl font-normal mb-6">
          CLUB Animo
        </h1>
        <p className="hero-text text-white/80 font-serif luxury-tracking text-sm md:text-base max-w-lg leading-[2.5] mb-10">
          煌びやかなシャンデリアの下で<br />
          特別な時間を
        </p>

        {/* CTA slot (propsから受け取る) */}
        {cta && (
          <div className="hero-cta">
            {cta}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="hero-indicator absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-white/50 text-[9px] uppercase luxury-tracking mb-3 font-serif tracking-widest">Scroll</span>
        <div className="w-px h-0 bg-linear-to-b from-white to-transparent hero-line" />
      </div>
    </div>
  );
};
