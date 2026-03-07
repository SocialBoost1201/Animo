'use client';

import React from 'react';
import { useFavoriteCasts } from '@/lib/hooks/useFavoriteCasts';
import { Heart } from 'lucide-react';

export function CastFavoriteButton({ castId, className = '' }: { castId: string; className?: string }) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavoriteCasts();

  // ハイドレーションエラー防止のため、ロード前は枠だけ表示して透明にしておく
  if (!isLoaded) {
    return <div className={`w-8 h-8 rounded-full bg-white/50 backdrop-blur opacity-0 ${className}`} />;
  }

  const isFav = isFavorite(castId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(castId);
      }}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-sm ${
        isFav 
          ? 'bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold)]/80 hover:scale-110' 
          : 'bg-white/80 text-gray-300 hover:text-[var(--color-gold)] hover:scale-110 backdrop-blur-sm'
      } ${className}`}
      aria-label={isFav ? 'お気に入りから外す' : 'お気に入りに追加する'}
    >
      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
