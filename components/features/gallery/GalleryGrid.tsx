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
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 md:gap-4 w-full max-w-[1600px] mx-auto">
        {filteredItems.map((item, i) => (
            <FadeIn
              key={`${item.id}-${activeCategory}`}
              delay={Math.min(i * 0.05, 0.4)}
              className="break-inside-avoid relative w-full mb-2 md:mb-4 overflow-hidden rounded-none"
            >
              <GalleryItem
                item={item}
                index={i}
                onClick={() => setLightboxIndex(i)}
                isPriority={i === 0}
              />
            </FadeIn>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-32 text-center w-full block">
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
