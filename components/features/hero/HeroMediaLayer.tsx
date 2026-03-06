'use client';

import React, { useEffect, useState } from 'react';
import { HeroMedia, HeroTransitionMode } from './types';
import { motion, AnimatePresence } from 'framer-motion';

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
        <MediaItem item={backupMedia} isActive={true} />
      </div>
    );
  }

  const activeItem = media[activeIndex];

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, x: '3%' },
      animate: { opacity: 1, x: '0%' },
      exit: { opacity: 0, x: '-3%' }
    }
  };

  const selectedVariant = variants[transitionMode];

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeItem.id}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariant}
          transition={{ duration: transitionMs / 1000, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <MediaItem item={activeItem} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* 2本目以降の遅延プリロード用 (DOMツリーには入れるが非表示にする。videoのpreload="auto"を活かすため) */}
      <div className="hidden">
        {media.map((item, index) => {
          if (index === activeIndex) return null;
          return <MediaItem key={`preload-${item.id}`} item={item} isActive={false} />;
        })}
      </div>
    </div>
  );
};

const MediaItem = ({ item, isActive }: { item: HeroMedia, isActive: boolean }) => {
  const [hasError, setHasError] = useState(false);

  if (item.type === 'image' || hasError) {
    return (
      <div 
        className="w-full h-full bg-cover bg-center md:bg-cover bg-contain bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${item.posterUrl || item.url})` }}
      />
    );
  }

  // ビデオの場合
  return (
    <video
      className="w-full h-full object-contain md:object-cover transition-all duration-1000"
      src={item.url}
      poster={item.posterUrl}
      autoPlay={isActive}
      loop
      muted
      playsInline
      onError={() => setHasError(true)}
      // アクティブじゃない時はリソースをあらかじめ読むだけにする
      preload={isActive ? "auto" : "metadata"}
    />
  );
};
