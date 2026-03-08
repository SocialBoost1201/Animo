'use client'

import React, { useState } from 'react';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export function GalleryGrid({ items }: { items: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div 
            key={item.id}
            className="group relative cursor-pointer overflow-hidden bg-white shadow-luxury transition-all duration-1000 hover:-translate-y-1 hover:shadow-luxury-hover"
            onClick={() => setSelectedImage(item.image_url)}
          >
            <PlaceholderImage
              src={item.image_url}
              alt={item.title || `Gallery ${i}`}
              ratio="4:3"
              className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            />
            {/* ホバー時のオーバーレイ */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-1000 backdrop-blur-[2px]">
              <span className="text-white text-sm font-serif luxury-tracking uppercase border border-white/50 px-6 py-3 bg-transparent">
                拡大する
              </span>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            ギャラリーの画像はありません。
          </div>
        )}
      </div>

      {/* ライトボックス表示 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-pointer backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Gallery Fullscreen" 
            className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200"
          />
          <button 
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-gold w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
