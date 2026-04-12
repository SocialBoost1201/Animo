'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuxuryCarousel } from '@/components/ui/LuxuryCarousel';
import type { CastPostWithAuthor } from '@/lib/types/cast-ui';

export const CastPostSlider = ({ posts }: { posts: CastPostWithAuthor[] }) => {
  if (!posts || posts.length === 0) return null;

  const slides = posts.map((post) => {
    // 日付フォーマット
    const d = new Date(post.created_at);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

    return (
      <div key={post.id} className="group select-none relative block overflow-hidden rounded-2xl bg-[#171717] transition-all hover:-translate-y-1 hover:shadow-aura aspect-4/5">
        <Link href={`/cast/${post.casts?.slug}/posts/${post.id}`} className="block w-full h-full relative">
          <Image 
            src={post.image_url} 
            alt="Cast post" 
            fill 
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-80"
          />
          {/* オーバーレイグラデーション */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2 w-full">
              <span className="bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-sm shrink-0">
                {dateStr}
              </span>
              <span className="text-white text-xs font-serif font-bold truncate tracking-widest flex-1">
                {post.casts?.stage_name || post.casts?.name}
              </span>
            </div>
            <p className="text-white/80 text-xs line-clamp-2 leading-relaxed font-serif wrap-break-word">
              {post.content}
            </p>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div className="w-full">
      <LuxuryCarousel 
        slides={slides} 
        options={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps'
        }}
      />
    </div>
  );
};
