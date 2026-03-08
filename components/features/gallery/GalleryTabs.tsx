'use client';

import React from 'react';
import { GALLERY_CATEGORIES, GalleryCategory } from './data';
import { FadeIn } from '@/components/motion/FadeIn';

interface GalleryTabsProps {
  activeCategory: GalleryCategory | 'all';
  onSelect: (category: GalleryCategory | 'all') => void;
}

export function GalleryTabs({ activeCategory, onSelect }: GalleryTabsProps) {
  return (
    <div className="w-full flex justify-center mb-16 overflow-x-auto no-scrollbar px-4 relative z-20">
      <div className="flex items-center gap-6 md:gap-12 pb-4">
        {GALLERY_CATEGORIES.map((cat, i) => {
          const isActive = activeCategory === cat.id;

          return (
            <FadeIn key={cat.id} delay={i * 0.1} className="shrink-0 relative group">
              <button
                type="button"
                onClick={() => onSelect(cat.id as GalleryCategory | 'all')}
                className={`
                  text-xs font-serif tracking-[0.2em] transition-all duration-500 py-4 px-2 relative z-10 cursor-pointer
                  ${isActive ? 'text-gold' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {cat.label}
              </button>
              {/* 下線アニメーション（ラグジュアリーな細いライン） */}
              <div
                className={`
                  absolute -bottom-1 left-0 h-px bg-gold transition-all duration-700 ease-out
                  ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'}
                `}
              />
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
