import React from 'react';
import { HeroVideoRotator } from '@/components/features/hero/HeroVideoRotator';
import { HeroMedia } from '@/components/features/hero/types';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { CalendarHeart, Phone } from 'lucide-react';

export default function HomePage() {
  // 管理画面から取得する想定のダミーデータ
  const heroMediaData: HeroMedia[] = [
    {
      id: '1',
      type: 'image', // 実際はvideoにするがダミーとしてimageを指定する
      url: '/images/hero-chandelier.jpg',
      posterUrl: '/images/hero-chandelier.jpg' // videoのフォールバック用ポスター
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1572116469629-078bc1b849e4?q=80&w=1920&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1572116469629-078bc1b849e4?q=80&w=1920&auto=format&fit=crop'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop'
    }
  ];

  return (
    <>
      {/* 1. Hero Section (Video Rotator) */}
      <HeroVideoRotator 
        media={heroMediaData} 
        transitionMode="fade"
        durationMs={3000}
      />

      {/* 2. Concept Section */}
      <section className="py-[var(--spacing-section)] bg-[var(--color-background)] px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-[var(--color-gold)] font-serif text-3xl md:text-4xl mb-8 tracking-widest uppercase">
              <RevealText text="Concept" />
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-12" />
            
            <p className="text-lg md:text-xl leading-loose font-serif mb-8 text-[var(--color-foreground)]">
              関内の大人の社交場
            </p>
            <p className="text-sm md:text-base leading-loose text-gray-600 font-sans max-w-2xl mx-auto">
              明るく洗練された店内には、象徴的な大シャンデリアが輝きます。
              日常の喧騒を離れ、上質な空間で極上のキャストとともに、
              心ゆくまで寛ぎのひとときをお楽しみください。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3. Quick Action CTA (CV強化) */}
      <section className="py-12 bg-[#171717] text-white">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <h3 className="font-serif tracking-widest text-xl text-[var(--color-gold)]">
              Reservation & Inquiry
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold tracking-widest">
                <Link href="/reserve">
                  <CalendarHeart className="mr-2 w-5 h-5" />
                  WEB予約
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#171717] font-bold tracking-widest">
                <a href="tel:045-xxxx-xxxx">
                  <Phone className="mr-2 w-5 h-5" />
                  045-XXXX-XXXX
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Today's Cast Preview */}
      <section className="py-[var(--spacing-section)] bg-[var(--color-gray-light)] px-6 overflow-hidden">
        <div className="container mx-auto">
          <FadeIn className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-[#171717] uppercase mb-2">
                Today&apos;s Cast
              </h2>
              <p className="text-sm tracking-widest text-gray-500 uppercase">本日の出勤</p>
            </div>
            <Link href="/shift" className="hidden md:inline-flex items-center text-[var(--color-gold)] text-sm font-bold tracking-widest hover:underline underline-offset-4">
              View All
            </Link>
          </FadeIn>

          {/* 横スクロールリスト (Mobile) / グリッド (Desktop) */}
          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-5 gap-6 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[70vw] sm:min-w-[40vw] md:min-w-0 snap-center group select-none">
                <Link href={`/cast/sample-${i}`} className="block relative">
                  <div className="overflow-hidden rounded-sm bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <PlaceholderImage 
                      alt={`Cast ${i}`} 
                      ratio="4:5" 
                      placeholderText={`Cast ${i}`}
                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="p-4 bg-white relative z-10">
                      <h3 className="font-serif text-lg text-[#171717]">Nanami</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">20:00 - L</span>
                        <span className="text-[10px] text-[var(--color-gold)] border border-[var(--color-gold)] px-2 py-0.5 rounded-sm">本日出勤</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/shift">全て見る</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Gallery Preview */}
      <section className="py-[var(--spacing-section)] bg-white px-6">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-[#171717] uppercase mb-4">
              Gallery
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FadeIn delay={0.1} className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden bg-gray-100">
              <PlaceholderImage ratio="4:5" alt="Chandelier" placeholderText="Main Chandelier" className="h-[400px] lg:h-full group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif tracking-widest border border-white px-6 py-2">View Gallery</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="relative group overflow-hidden bg-gray-100 h-[250px] lg:h-auto">
              <PlaceholderImage ratio="16:9" alt="VIP Room" placeholderText="VIP Room" className="h-full group-hover:scale-105 transition-transform duration-700" />
            </FadeIn>
            <FadeIn delay={0.3} className="relative group overflow-hidden bg-gray-100 h-[250px] lg:h-auto">
              <PlaceholderImage ratio="16:9" alt="Bar Counter" placeholderText="Bar Counter" className="h-full group-hover:scale-105 transition-transform duration-700" />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4} className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/gallery" className="px-12">ギャラリーを見る</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 6. Recruit CTA */}
      <section className="py-24 bg-[#111] px-6 text-center relative overflow-hidden">
        {/* Background dark placeholder/image */}
        <div className="absolute inset-0 opacity-20">
          <PlaceholderImage ratio="16:9" alt="Recruit Background" placeholderText="Recruit BG" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-[var(--color-gold)] font-serif text-3xl md:text-4xl mb-6 tracking-widest uppercase">
              Recruit
            </h2>
            <p className="text-gray-300 font-sans text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              当店では、一緒に最高の空間を創り上げるキャスト・スタッフを募集しています。
              未経験からでも安心して働ける環境を整えています。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold tracking-widest">
                <Link href="/recruit/cast">キャスト求人を見る</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black font-bold tracking-widest">
                <Link href="/recruit/staff">店舗スタッフ求人を見る</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
