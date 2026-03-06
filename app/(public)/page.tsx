import React from 'react';
import { HeroVideoRotator } from '@/components/features/hero/HeroVideoRotator';
import { HeroMedia } from '@/components/features/hero/types';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { Button } from '@/components/ui/Button';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { LuxuryCarousel } from '@/components/ui/LuxuryCarousel';
import Link from 'next/link';
import { CalendarHeart, Phone } from 'lucide-react';
import { getPublicHeroMedia, getPublicCasts, getPublicContents } from '@/lib/actions/public/data';
import { getSiteSettings } from '@/lib/actions/contents'; // Readonly config

// サーバーコンポーネントとしてデータ取得
export default async function HomePage() {
  // 並列フェッチ
  const [
    dbHeroMedia,
    dbCasts,
    dbGallery,
    settings
  ] = await Promise.all([
    getPublicHeroMedia(),
    getPublicCasts(),
    getPublicContents('gallery', 3), // トップ用に3件取得
    getSiteSettings().catch(() => null)
  ]);

  // DBデータからHeroMediaの型にマッピング (DBになければフォールバック)
  const heroMediaData: HeroMedia[] = dbHeroMedia.length > 0 ? dbHeroMedia.map(m => ({
    id: m.id,
    type: m.type as 'video' | 'image',
    url: m.url,
    posterUrl: m.poster_url || m.url,
    title: m.title
  })) : [
    { id: 'v1', type: 'video', url: '/videos/movie01_chandelier.mp4', posterUrl: '/videos/movie01_chandelier.mp4' },
    { id: 'v2', type: 'video', url: '/videos/movie02_shelf.mp4', posterUrl: '/videos/movie02_shelf.mp4' },
    { id: 'v3', type: 'video', url: '/videos/movie03_bar.mp4', posterUrl: '/videos/movie03_bar.mp4' },
    { id: 'v4', type: 'video', url: '/videos/movie04_shelf.mp4', posterUrl: '/videos/movie04_shelf.mp4' },
    { id: 'v5', type: 'video', url: '/videos/movie05_floor.mp4', posterUrl: '/videos/movie05_floor.mp4' },
    { id: 'v6', type: 'video', url: '/videos/movie06_flower.mp4', posterUrl: '/videos/movie06_flower.mp4' },
    { id: 'v7', type: 'video', url: '/videos/movie07_flower.mp4', posterUrl: '/videos/movie07_flower.mp4' }
  ];

  // トップ表示用: 本日出勤のキャストを優先抽出
  const todayCasts = dbCasts.filter(c => c.is_today);
  const displayCasts = todayCasts.length > 0 ? todayCasts : dbCasts.slice(0, 5); // いなければ適当に5人

  return (
    <>
      {/* 1. Hero Section (Video Rotator) */}
      <HeroVideoRotator 
        media={heroMediaData} 
        transitionMode={(settings?.hero_transition_mode || 'fade') as 'fade' | 'slide'}
        durationMs={5000}
        transitionMs={2000}
      />

      {/* 2. Concept Section */}
      <section className="py-[var(--spacing-section)] bg-transparent px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-[var(--color-gold)] font-serif text-3xl md:text-4xl mb-12 luxury-tracking-super uppercase text-center block">
              <GsapRevealTitle text="Concept" />
            </h2>
            <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-16 opacity-50" />
            
            {settings?.today_mood && (
               <p className="text-sm md:text-base text-[var(--color-gold)] font-serif mb-6 px-4 py-2 border border-[var(--color-gold)]/30 inline-block bg-[var(--color-gold)]/5">
                 {settings.today_mood}
               </p>
            )}

            <p className="text-xl md:text-2xl leading-loose font-serif mb-12 text-[#171717] luxury-tracking">
              関内の大人の社交場
            </p>
            <p className="text-sm md:text-base leading-[2.5] text-gray-500 font-serif max-w-2xl mx-auto luxury-tracking">
              明るく洗練された店内には、象徴的な大シャンデリアが輝きます。<br/>
              日常の喧騒を離れ、上質な空間で極上のキャストとともに、<br/>
              心ゆくまで寛ぎのひとときをお楽しみください。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3. Quick Action CTA (CV強化) */}
      <section className="py-20 bg-transparent border-y border-[var(--color-gold)]/20 relative overflow-hidden">
        {/* 背景のうっすらとしたアクセント */}
        <div className="absolute inset-0 bg-[var(--color-gold)]/5 mix-blend-multiply" />
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <h3 className="font-serif luxury-tracking text-xl text-[#171717] flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-[var(--color-gold)]">Reservation & Inquiry</span>
              {settings?.vip_availability && (
                <span className="text-xs font-serif luxury-tracking border border-[var(--color-gold)]/30 px-3 py-1 text-[var(--color-gold)] bg-white/80">
                  VIP: {settings.vip_availability}
                </span>
              )}
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto luxury-tracking font-medium bg-[#171717] text-white border-transparent hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)]">
                <Link href="/reserve">
                  <CalendarHeart className="mr-3 w-4 h-4" />
                  WEB予約
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto luxury-tracking font-medium border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white">
                <a href="tel:045-xxxx-xxxx">
                  <Phone className="mr-3 w-4 h-4" />
                  045-XXXX-XXXX
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Today's Cast Preview */}
      <section className="py-[var(--spacing-section)] bg-transparent px-6 overflow-hidden">
        <div className="container mx-auto">
          <FadeIn className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
                <GsapRevealTitle text="Today's Cast" />
              </h2>
              <p className="text-sm tracking-widest text-gray-500 uppercase">本日の出勤</p>
            </div>
            <Link href="/shift" className="hidden md:inline-flex items-center text-[var(--color-gold)] text-sm font-bold tracking-widest hover:underline underline-offset-4">
              View All
            </Link>
          </FadeIn>

          {/* Luxury Carousel for Casts */}
          <div className="mt-8">
            <LuxuryCarousel 
              autoplay
              options={{ loop: true, align: 'center', dragFree: true }}
              slides={displayCasts.map((cast) => (
                <div key={cast.id} className="group select-none">
                  <Link href={`/cast/${cast.slug}`} className="block relative">
                    <div className="overflow-hidden bg-white/40 backdrop-blur-md hover:shadow-aura transition-all duration-1000">
                      <PlaceholderImage 
                        src={cast.image_url}
                        alt={cast.name} 
                        ratio="4:5" 
                        placeholderText={cast.name}
                        className="group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="pt-8 pb-4 bg-transparent relative z-10 text-center">
                        <h3 className="font-serif luxury-tracking text-xl text-[#171717]">{cast.name}</h3>
                        <div className="flex flex-col justify-center items-center mt-3 gap-2">
                          <span className="text-xs text-gray-400 font-serif luxury-tracking">{cast.age ? `${cast.age}歳` : ''} {cast.height ? `/${cast.height}cm` : ''}</span>
                          {cast.is_today && (
                            <span className="text-[10px] uppercase luxury-tracking text-[#c9a86a]">Today's Cast</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            />
            {displayCasts.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                本日の出勤予定キャストはまだ公開されていません。
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/shift">全て見る</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Gallery Preview */}
      <section className="py-[var(--spacing-section)] bg-transparent px-6">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-12 text-center block">
              <GsapRevealTitle text="Gallery" />
            </h2>
            <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto opacity-50" />
          </FadeIn>

          {/* Fallback Static Gallery Grid (if DB is empty or has items, we just show statics for now as requested for these 2 specific images) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="group relative">
                <div className="overflow-hidden bg-white/40 backdrop-blur-md hover:shadow-aura transition-all duration-1000 h-[300px] w-full mb-6">
                  <PlaceholderImage 
                    src="/images/chandelier.jpg" 
                    ratio="4:3" 
                    alt="メインシャンデリア" 
                    placeholderText="Chandelier" 
                    className="w-full h-full object-cover group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-1000" />
                </div>
                <div className="text-center px-4">
                  <h3 className="font-serif luxury-tracking text-lg text-[#171717] mb-3">Main Chandelier</h3>
                  <p className="text-sm text-gray-500 font-serif leading-relaxed">
                    ホール全体を照らす優美な大シャンデリア。<br />無数のクリスタルが存在感を放ち、非日常の空間へと誘います。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="group relative">
                <div className="overflow-hidden bg-white/40 backdrop-blur-md hover:shadow-aura transition-all duration-1000 h-[300px] w-full mb-6">
                  <PlaceholderImage 
                    src="/images/curtain_room.JPG" 
                    ratio="4:3" 
                    alt="VIPルーム" 
                    placeholderText="VIP Room" 
                    className="w-full h-full object-cover group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-1000" />
                </div>
                <div className="text-center px-4">
                  <h3 className="font-serif luxury-tracking text-lg text-[#171717] mb-3">VIP Room</h3>
                  <p className="text-sm text-gray-500 font-serif leading-relaxed">
                    深紅のカーテンに包まれたプライベート空間。<br />大切なお客様との特別なひとときを、お約束いたします。
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4} className="mt-16 text-center">
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
          {/* Use DB image if available, else placeholder */}
          <PlaceholderImage src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop" ratio="16:9" alt="Recruit Background" className="w-full h-full object-cover" />
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
