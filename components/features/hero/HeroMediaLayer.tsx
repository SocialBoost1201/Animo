'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  isReducedMotion
}) => {
  // reduced motion の場合は 最初のメディアだけ描画してアニメーションさせない
  if (isReducedMotion || media.length === 0) {
    const backupMedia = media[0];
    if (!backupMedia) {
      return (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Media Not Set</span>
        </div>
      );
    }
    return (
      <div className="absolute inset-0">
        <MediaItem item={backupMedia} isActive={true} transitionMs={0} />
      </div>
    );
  }

  const variants = {
    fade: {
      opacity: 1
    },
    slide: {
      opacity: 1,
      x: '0%'
    }
  };

  const hiddenVariants = {
    fade: {
      opacity: 0
    },
    slide: {
      opacity: 0,
      x: '3%' // or -3% depending on direction, simplified here
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {media.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={isActive ? variants[transitionMode] : hiddenVariants[transitionMode]}
            transition={{ duration: transitionMs / 1000, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
            style={{ 
              zIndex: isActive ? 10 : 1,
              pointerEvents: isActive ? 'auto' : 'none' 
            }}
          >
            <MediaItem item={item} isActive={isActive} transitionMs={transitionMs} />
          </motion.div>
        );
      })}
    </div>
  );
};

const MediaItem = ({ item, isActive, transitionMs }: { item: HeroMedia, isActive: boolean, transitionMs: number }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isActive && videoRef.current) {
      // フェードアウトが完了した頃に動画を一時停止し、リソースを節約する
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, transitionMs + 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, transitionMs]);

  if (item.type === 'image' || hasError) {
    return (
      <div 
        className="w-full h-full bg-center md:bg-cover bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${item.posterUrl || item.url})` }}
      />
    );
  }

  // ビデオの場合
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain md:object-cover"
      src={item.url}
      poster={item.posterUrl}
      loop
      muted
      playsInline
      onError={() => setHasError(true)}
      preload="auto"
    />
  );
};
