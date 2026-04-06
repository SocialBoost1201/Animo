import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  src?: string | null;
  alt: string;
  placeholderText?: string;
  ratio?: '16:9' | '4:5' | '3:2' | '4:3' | '3:4' | 'square';
  className?: string;
  priority?: boolean;
}

export function PlaceholderImage({
  src,
  alt,
  placeholderText = 'Image Placeholder',
  ratio = '4:5',
  className,
  priority = false,
}: PlaceholderImageProps) {
  // Define aspect ratio classes
  const ratioClasses = {
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    '4:5': 'aspect-[4/5]',
    '3:4': 'aspect-[3/4]',
    '4:3': 'aspect-[4/3]',
    'square': 'aspect-square',
  };

  const fallbackImages: Record<string, string> = {
    '4:5': '/images/placeholders/cast.png',
    '3:4': '/images/placeholders/cast.png',
    '3:2': '/images/placeholders/gallery.png',
    '16:9': '/images/placeholders/event.png',
    'square': '/images/placeholders/cast.png',
    '4:3': '/images/placeholders/gallery.png',
  };

  const finalSrc = src && src.trim() !== '' ? src : fallbackImages[ratio];

  // ratio に応じた適切な sizes を設定（一律固定からコンテキスト別に最適化）
  const sizesMap: Record<string, string> = {
    '4:5': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
    '3:4': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
    '3:2': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    '4:3': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    '16:9': '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw',
    'square': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
  };
  const resolvedSizes = sizesMap[ratio] ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--color-gray-light)] flex flex-col items-center justify-center text-center',
        ratioClasses[ratio],
        className
      )}
    >
      {finalSrc ? (
        <Image
          src={finalSrc}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={resolvedSizes}
        />
      ) : (
        <div className="flex flex-col items-center justify-center opacity-50">
          <svg
            className="w-12 h-12 mb-3 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm tracking-widest text-[#171717] font-medium uppercase font-sans">
            {placeholderText}
          </span>
          <span className="text-xs text-[#171717]/60 mt-1 uppercase" >
            {ratio} Ratio
          </span>
        </div>
      )}
    </div>
  );
}
