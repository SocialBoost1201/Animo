'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const GallerySection = dynamic(
  () => import('./GallerySection').then((mod) => mod.GallerySection),
  { ssr: false, loading: () => (
    <div className="h-96 w-full animate-pulse bg-gray-900/50 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 font-serif text-sm luxury-tracking">Loading Gallery...</p>
    </div>
  )}
);

export function DynamicGallerySection() {
  return <GallerySection />;
}
