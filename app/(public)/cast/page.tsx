import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { StaggerList } from '@/components/motion/StaggerList';
import { CastCard } from '@/components/features/cast/CastCard';

export const metadata = {
  title: 'Cast | Club Animo',
  description: 'Club Animoに在籍する極上のキャスト一覧。本日出勤のキャスト情報やプロフィールをご覧いただけます。',
};

// Dummy Data
const CASTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `cast-${i}`,
  slug: `nanami-${i}`,
  name: `Nanami ${i + 1}`,
  isToday: i % 3 === 0,
  tags: ['清楚', 'お酒好き', '癒し系'],
  schedule: '20:00 - L',
}));

export default function CastListPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      {/* Header Section */}
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Cast" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              キャスト一覧
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter Section (Mock UI) */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <FadeIn delay={0.2} className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-6 py-2 bg-[#171717] text-white text-xs font-bold tracking-widest uppercase rounded-sm cursor-default">
              ALL
            </button>
            <button className="px-6 py-2 bg-white text-[#171717] border border-gray-200 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-[#171717] transition-colors">
              TODAY
            </button>
            <button className="px-6 py-2 bg-white text-[#171717] border border-gray-200 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-[#171717] transition-colors">
              NEW
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-6">
        <div className="container mx-auto">
          <StaggerList 
            className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8"
            staggerDelay={0.05}
          >
            {CASTS.map((cast) => (
              <CastCard 
                key={cast.id}
                id={cast.id}
                slug={cast.slug}
                name={cast.name}
                isToday={cast.isToday}
                tags={cast.tags}
                schedule={cast.schedule}
              />
            ))}
          </StaggerList>
        </div>
      </section>
    </div>
  );
}
