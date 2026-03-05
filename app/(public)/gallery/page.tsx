import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GalleryGrid } from '@/components/features/gallery/GalleryGrid';

export const metadata = {
  title: 'Gallery | Club Animo',
  description: 'Club Animoの店内ギャラリー。煌びやかなシャンデリアと洗練された大人の空間をご覧ください。',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header Section */}
      <section className="bg-[var(--color-gray-light)] pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[#171717] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Gallery" />
            </h1>
            <p className="text-gray-500 font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              店内ギャラリー
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <FadeIn delay={0.2} className="mb-12 text-center max-w-2xl mx-auto">
            <p className="text-sm md:text-base text-gray-600 leading-loose font-serif">
              光り輝く大型シャンデリアを中心に、明るく開放感のあるメインフロアと、
              プライベートな時間を過ごせる完全個室のVIPルームをご用意しております。
            </p>
          </FadeIn>

          <GalleryGrid />
        </div>
      </section>
    </div>
  );
}
