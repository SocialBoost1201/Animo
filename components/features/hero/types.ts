export type HeroTransitionMode = 'ripple' | 'fade' | 'slide' | 'zoom' | 'burn';

export interface HeroMedia {
  id: string;
  type: 'video' | 'image';
  url: string;
  posterUrl?: string; // fallback or poster image
  title?: string;
  durationMs?: number; // ←追加：このメディア固有の表示時間
}

export interface HeroVideoRotatorProps {
  media: HeroMedia[];
  transitionMode?: HeroTransitionMode;
  durationMs?: number;
  transitionMs?: number;
  overlayOpacity?: number;
  mobileFallbackSrc?: string;
  mobileFallbackAlt?: string;
}
