'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'animo_favorite_casts';

export function useFavoriteCasts() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 初回マウント時に LocalStorage から読み込み
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse favorite casts from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (castId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(castId);
      const newFavs = isFav ? prev.filter((id) => id !== castId) : [...prev, castId];
      
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
      } catch (e) {
        console.warn('Failed to save string to localStorage', e);
      }
      return newFavs;
    });
  };

  const isFavorite = (castId: string) => favorites.includes(castId);

  return { favorites, isFavorite, toggleFavorite, isLoaded };
}
