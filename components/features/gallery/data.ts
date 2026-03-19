export type GalleryCategory = 'interior' | 'seating' | 'champagne' | 'decor';

export interface GalleryItemData {
  id: string;
  category: GalleryCategory;
  title: string;
  src: string;
  alt: string;
  featured?: boolean;
}

export const GALLERY_DATA: GalleryItemData[] = [
  // INTERIOR
  { id: 'int-1', category: 'interior', title: 'Main Chandelier', src: '/images/chandelier.webp', alt: 'Main Chandelier', featured: true },
  { id: 'int-3', category: 'interior', title: 'Main Floor Bar Area', src: '/images/animo-main-floor-bar-area.webp', alt: 'Main Floor Bar Area' },
  { id: 'int-4', category: 'interior', title: 'Main Chandelier Interior', src: '/images/animo-main-chandelier-interior.webp', alt: 'Main Chandelier Interior' },
  { id: 'int-2', category: 'interior', title: 'Chandelier Details', src: '/images/chandelier2.webp', alt: 'Chandelier Details' },
  { id: 'dec-3', category: 'interior', title: 'Bar Counter', src: '/images/bar-counter.webp', alt: 'Bar Counter' },

  // SEATING
  { id: 'seat-1', category: 'seating', title: 'Curtain Room', src: '/images/curtain_room.webp', alt: 'Curtain Room', featured: true },
  { id: 'seat-3', category: 'seating', title: 'Sofa Seating', src: '/images/animo-main-sofa-seating.webp', alt: 'Sofa Seating' },
  { id: 'seat-4', category: 'seating', title: 'Floor Seating Area', src: '/images/animo-main-floor-seating-area.webp', alt: 'Floor Seating Area' },
  { id: 'seat-5', category: 'seating', title: 'Luxury Lounge', src: '/images/animo-luxury-lounge-seating.webp', alt: 'Luxury Lounge' },
  { id: 'seat-2', category: 'seating', title: 'Curtain Room Details', src: '/images/animo-curtain-room-seating.webp', alt: 'Curtain Room Details' },

  // CHAMPAGNE
  { id: 'champ-1', category: 'champagne', title: 'Champagne Display', src: '/images/animo-champagne-angel-display.webp', alt: 'Champagne Display', featured: true },

  // DECOR
  { id: 'dec-1', category: 'decor', title: 'Red Rose Display', src: '/images/animo-red-rose-flower-display.webp', alt: 'Red Rose Display', featured: true },
  { id: 'dec-2', category: 'decor', title: 'Stone Logo Wall', src: '/images/animo-stone-logo-wall.webp', alt: 'Stone Logo Wall' },
];

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'ALL', description: 'クラブアニモの洗練された空間体験' },
  { id: 'interior', label: 'INTERIOR', description: '店内全体の空間とシャンデリア' },
  { id: 'seating', label: 'SEATING', description: 'ソファ席、カーテンルーム、ラウンジ席' },
  { id: 'champagne', label: 'CHAMPAGNE', description: 'シャンパン、ボトル演出' },
  { id: 'decor', label: 'DECOR', description: '装花、ロゴ壁、装飾要素' },
] as const;
