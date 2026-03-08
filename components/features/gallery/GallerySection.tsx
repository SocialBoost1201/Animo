'use client';

import React, { useState } from 'react';
import { GALLERY_DATA, GalleryCategory } from './data';
import { GalleryTabs } from './GalleryTabs';
import { GalleryGrid } from './GalleryGrid';
import { FadeIn } from '@/components/motion/FadeIn';

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');

  return (
    <div className="w-full">
      {/* 導入コピー */}
      <FadeIn delay={0.2} className="text-center mb-16 px-4">
        <p className="text-sm md:text-base text-gray-500 font-serif tracking-[0.15em] leading-[2.5] max-w-2xl mx-auto">
          Every detail in Club Animo is designed to create an elegant and memorable night.<br />
          シャンデリアの煌めきが彩る、あなただけのラグジュアリーな夜を。
        </p>
      </FadeIn>

      {/* カテゴリタブ */}
      <GalleryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* ギャラリーグリッド */}
      <GalleryGrid
        items={GALLERY_DATA}
        activeCategory={activeCategory}
      />
    </div>
  );
}
