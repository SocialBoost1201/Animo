'use client';

import React from 'react';
import Link from 'next/link';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

interface CastCardProps {
  id: string;
  slug: string;
  name: string;
  age?: number;
  imageUrl?: string;
  isToday?: boolean;
  tags?: string[];
  schedule?: string;
}

export const CastCard: React.FC<CastCardProps> = ({
  slug,
  name,
  imageUrl,
  isToday = false,
  tags = [],
  schedule,
}) => {
  return (
    <Link href={`/cast/${slug}`} className="group block relative h-full">
      <div className="flex flex-col h-full bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <PlaceholderImage 
            src={imageUrl} 
            alt={name} 
            ratio="4:5" 
            placeholderText={name}
            className="group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {isToday && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-gold text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                本日出勤
              </span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="p-4 flex flex-col flex-grow relative z-10 bg-white">
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="font-serif text-xl text-[#171717]">{name}</h3>
            {schedule && (
              <span className="text-xs text-gray-500 font-sans">{schedule}</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    </Link>
  );
};
