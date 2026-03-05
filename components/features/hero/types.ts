export type HeroTransitionMode = 'fade' | 'slide';

export interface HeroMedia {
  id: string;
  type: 'video' | 'image';
  url: string;
  posterUrl?: string; // fallback or poster image
  title?: string;
}

export interface HeroVideoRotatorProps {
  media: HeroMedia[];
  transitionMode?: HeroTransitionMode;
  durationMs?: number;
  transitionMs?: number;
  overlayOpacity?: number;
}
