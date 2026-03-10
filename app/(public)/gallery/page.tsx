import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { GalleryGrid } from '@/components/features/gallery/GalleryGrid';
import { GALLERY_DATA } from '@/components/features/gallery/data';

// サーバーコンポーネントとしてギャラリーデータを取得
export default async function GalleryPage() {
  const galleryItems = GALLERY_DATA;

  return (
    <div className="bg-[var(--color-gray-light)] min-h-screen pt-24 pb-[var(--spacing-section)] px-6">
      <div className="container mx-auto">
        <FadeIn className="text-center mb-16 mt-8">
          <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#171717] uppercase mb-4">
            Gallery
          </h1>
          <div className="w-12 h-[1px] bg-gold mx-auto mb-6" />
          <p className="text-sm text-gray-500 font-sans tracking-wide">
            洗練された関内の大人の社交場。<br />
            ゆったりと寛げる上質な空間をご覧ください。
          </p>
        </FadeIn>

        {/* ギャラリー一覧をグリッド表示する専用コンポーネント (画像拡大等を持たせる想定) */}
        <GalleryGrid items={galleryItems} activeCategory="all" />

      </div>
    </div>
  );
}
