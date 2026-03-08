'use client';

import React from 'react';
import { GalleryItemData } from './data';

interface GalleryItemProps {
  item: GalleryItemData;
  index: number;
  onClick: (index: number) => void;
  isPriority?: boolean;
}

export function GalleryItem({ item, index, onClick, isPriority = false }: GalleryItemProps) {
  return (
    <button
      onClick={() => onClick(index)}
      className="group relative block w-full overflow-hidden bg-[#111] cursor-pointer rounded-sm"
      aria-label={`View ${item.title}`}
    >
      {/* 画像本体：自然寸法を尊重するimgタグ */}
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        className="w-full h-auto block object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
      />

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

      {/* テキスト情報 */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end items-start opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 ease-out">
        <span className="text-[10px] text-gold/80 font-serif tracking-[0.3em] uppercase mb-2">
          {item.category}
        </span>
        <h3 className="text-white font-serif text-sm md:text-base tracking-widest text-left">
          {item.title}
        </h3>
        
        {/* ホバー時の装飾ライン */}
        <div className="w-0 h-px bg-gold/50 mt-4 group-hover:w-12 transition-all duration-700 delay-100 ease-out" />
      </div>
    </button>
  );
}
