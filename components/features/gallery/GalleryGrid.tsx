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
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4 w-full max-w-[1600px] mx-auto auto-rows-[160px] sm:auto-rows-[220px] md:auto-rows-[280px] grid-flow-dense">
          {filteredItems.map((item, i) => {
            let spanClass = 'col-span-1 row-span-1';
            
            // 全て表示時のみイレギュラーなスパンを適用し、カテゴリ絞り込み時は整然と並べる
            if (activeCategory === 'all') {
              if (item.featured) {
                spanClass = 'col-span-2 row-span-2';
              } else if (i === 1 || i === 8) {
                spanClass = 'col-span-2 row-span-1';
              } else if (i === 4 || i === 11) {
                spanClass = 'col-span-1 row-span-2';
              }
            } else {
              if (item.featured) {
                spanClass = 'col-span-2 row-span-2';
              }
            }

            return (
              <FadeIn
                key={`${item.id}-${activeCategory}-${i}`}
                delay={Math.min(i * 0.05, 0.4)}
                className={`relative w-full h-full overflow-hidden ${spanClass}`}
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
        </div>
      ) : (
        <div className="py-32 text-center w-full block">
          <p className="text-gray-400 font-serif luxury-tracking text-sm">
            Coming Soon
          </p>
        </div>
      )}

      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
