'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItemData } from './data';

interface LightboxProps {
  items: GalleryItemData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ items, currentIndex, isOpen, onClose }: LightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[index];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md opacity-0 animate-in fade-in duration-500"
      onClick={onClose}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-110 p-2 text-white/50 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" strokeWidth={1} />
      </button>

      {/* スライドボタン */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 z-110 p-4 text-white/50 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-10 h-10" strokeWidth={1} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 z-110 p-4 text-white/50 hover:text-white transition-colors"
      >
        <ChevronRight className="w-10 h-10" strokeWidth={1} />
      </button>

      {/* メイン画像 */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 outline-none select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-6xl max-h-[80vh] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentItem.id} // 強制再レンダリングでアニメーション発火
            src={currentItem.src}
            alt={currentItem.alt}
            className="max-w-full max-h-[80vh] object-contain animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out shadow-2xl"
          />
        </div>

        {/* キャプション */}
        <div className="absolute bottom-8 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <p className="text-xs text-gold/80 font-serif uppercase tracking-[0.3em] mb-2">
            {currentItem.category}
          </p>
          <h3 className="text-white font-serif text-lg tracking-widest px-4">
            {currentItem.title}
          </h3>
          <p className="text-white/40 text-xs font-serif mt-3 tracking-widest">
            {index + 1} / {items.length}
          </p>
        </div>
      </div>
    </div>
  );
}
