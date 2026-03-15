'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const CastPostFeed = ({ posts }: { posts: any[] }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-24 text-center text-gray-400 font-serif text-sm px-6">
        まだ投稿がありません。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4 md:gap-6 mt-8">
      {posts.map((post) => (
        <Link 
          href={`/cast/${post.casts?.slug}/posts/${post.id}`} 
          key={post.id}
          className="group relative block aspect-square bg-[#171717] overflow-hidden sm:rounded-2xl"
        >
          <Image 
            src={post.image_url} 
            alt="Cast timeline post" 
            fill 
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
            <div className="text-white p-4 text-center">
              <p className="text-xs font-serif line-clamp-3 mb-2 wrap-break-word">
                {post.content}
              </p>
              <div className="w-8 h-px bg-gold/50 mx-auto" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
