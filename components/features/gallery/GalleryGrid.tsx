'use client';

import React, { useState, useMemo } from 'react';
import { GalleryItemData, GalleryCategory } from './data';
import { GalleryItem } from './GalleryItem';
import { Lightbox } from './Lightbox';
import { FadeIn } from '@/components/motion/FadeIn';

interface GalleryGridProps {
  items: GalleryItemData[];
  activeCategory: GalleryCategory | 'all';
}

export function GalleryGrid({ items, activeCategory }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // カテゴリ絞り込み
  const filteredItems = useMemo(() => {
    return activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4 w-full max-w-[1600px] mx-auto auto-rows-[160px] sm:auto-rows-[220px] lg:auto-rows-[300px] grid-flow-row-dense">
        {filteredItems.map((item, i) => {
          let spanClass = 'col-span-1 lg:col-span-1 row-span-1 lg:row-span-1';

          // 1番最初の画像は特大 (2x2)
          if (i === 0) {
            spanClass = 'col-span-2 lg:col-span-2 row-span-2 lg:row-span-2';
          } 
          // featuredフラグがある場合は横長 (2x1)
          else if (item.featured) {
            spanClass = 'col-span-2 lg:col-span-2 row-span-1 lg:row-span-1';
          } 
          // それ以外で4の倍数の時は縦長 (1x2) にしてリズムを作る
          else if (i % 4 === 0) {
            spanClass = 'col-span-1 lg:col-span-1 row-span-1 lg:row-span-2';
          }

          return (
            <FadeIn
              key={`${item.id}-${activeCategory}`}
              delay={Math.min(i * 0.05, 0.4)}
              className={`${spanClass} h-full overflow-hidden`}
            >
              <GalleryItem
                item={item}
                index={i}
                onClick={() => setLightboxIndex(i)}
                isPriority={i === 0}
              />
            </FadeIn>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-2 lg:col-span-4 py-32 text-center">
            <p className="text-gray-400 font-serif luxury-tracking text-sm">
              Coming Soon
            </p>
          </div>
        )}
      </div>

      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
