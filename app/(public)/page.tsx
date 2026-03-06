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
import { CalendarHeart, Phone, MapPin, Train } from 'lucide-react';
import { getPublicHeroMedia, getPublicCasts, getPublicContents } from '@/lib/actions/public/data';
import { getSiteSettings } from '@/lib/actions/contents'; // Readonly config

// サーバーコンポーネントとしてデータ取得
export default async function HomePage() {
  // 並列フェッチ
  const [
    dbHeroMedia,
    dbCasts,
    dbGallery,
    dbNews,
    settings
  ] = await Promise.all([
    getPublicHeroMedia(),
    getPublicCasts(),
    getPublicContents('gallery', 12),
    getPublicContents('news', 3),
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
                  Curtain Room: {settings.vip_availability}
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
                <a href="tel:045-263-6961">
                  <Phone className="mr-3 w-4 h-4" />
                  045-263-6961
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. NEWS Section */}
      <section className="py-24 bg-transparent px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="News" />
            </h2>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto opacity-50" />
          </FadeIn>

          <div className="space-y-0">
            {dbNews.length > 0 ? dbNews.map((news: any) => (
              <FadeIn key={news.id}>
                <Link href={`/news/${news.id}`} className="flex items-baseline gap-6 py-6 border-b border-[var(--color-gold)]/10 group hover:bg-[var(--color-gold)]/5 transition-colors px-4 -mx-4">
                  <time className="text-[11px] text-[var(--color-gold)] font-serif luxury-tracking shrink-0 tabular-nums">
                    {new Date(news.content_date || news.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </time>
                  <span className="text-sm font-serif text-foreground group-hover:text-[var(--color-gold)] transition-colors luxury-tracking line-clamp-1">
                    {news.title}
                  </span>
                </Link>
              </FadeIn>
            )) : (
              <FadeIn>
                <div className="py-6 border-b border-[var(--color-gold)]/10 px-4">
                  <div className="flex items-baseline gap-6">
                    <time className="text-[11px] text-[var(--color-gold)] font-serif luxury-tracking shrink-0">2026.01.01</time>
                    <span className="text-sm font-serif text-foreground luxury-tracking">本年もClub Animoをよろしくお願いいたします。</span>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn delay={0.3} className="mt-10 text-center">
            <Link href="/news" className="text-xs font-serif text-[var(--color-gold)] luxury-tracking uppercase hover:underline underline-offset-4">
              View All News →
            </Link>
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
                          {cast.hobby && (
                            <span className="text-[10px] text-gray-400 font-serif luxury-tracking line-clamp-1">趣味: {cast.hobby}</span>
                          )}
                          {cast.is_today && (
                            <span className="text-[10px] uppercase luxury-tracking text-[#c9a86a]">Today&apos;s Cast</span>
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

          {/* Gallery Grid (PC/Tablet: 3 cols, SP: 2 cols) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
            {Array.from({ length: Math.max(6, dbGallery.length) }).map((_, i) => {
              const staticFallbacks = [
                { id: 'fb1', title: 'Main Chandelier', description: 'ホール全体を照らす優美な大シャンデリア。\n無数のクリスタルが非日常の空間へと誘います。', image_url: '/images/chandelier.jpg' },
                { id: 'fb2', title: 'Curtain Room', description: '半個室感のあるカーテンルーム。\n深紅のカーテンに包まれた落ち着いた空間で、\n特別なひとときをお過ごしいただけます。', image_url: '/images/curtain_room.JPG' }
              ];
              
              // If DB has items, use DB items. Else, use static fallbacks.
              const item = dbGallery.length > 0 ? dbGallery[i] : staticFallbacks[i];

              if (!item) {
                // Return empty box
                return (
                  <FadeIn delay={0.1 * (i % 6)} key={`empty-${i}`}>
                    <div className="group overflow-hidden bg-white/20 backdrop-blur-sm rounded-sm border border-white/20 h-full min-h-[160px] md:min-h-[280px] flex flex-col items-center justify-center opacity-40">
                      <div className="w-8 h-8 md:w-12 md:h-12 border border-[var(--color-gold)]/20 rounded-full flex items-center justify-center mb-3">
                        <span className="text-[var(--color-gold)]/40 block w-1 h-1 bg-[var(--color-gold)]/40 rounded-full" />
                      </div>
                      <span className="text-[10px] md:text-xs font-serif text-[var(--color-gold)]/40 luxury-tracking uppercase">Coming Soon</span>
                    </div>
                  </FadeIn>
                );
              }

              return (
                <FadeIn delay={0.1 * (i % 6)} key={item.id}>
                  <div className="group overflow-hidden bg-white/40 backdrop-blur-md rounded-sm hover:shadow-aura transition-all duration-1000 border border-white/20 h-full flex flex-col">
                    <div className="overflow-hidden h-[120px] md:h-[200px] w-full relative shrink-0">
                      <PlaceholderImage 
                        src={item.image_url} 
                        ratio="16:9" 
                        alt={item.title || 'Gallery Image'} 
                        placeholderText={item.title || 'Image'} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                      />
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-1000 pointer-events-none" />
                    </div>
                    <div className="p-3 md:p-5 text-center flex-1 flex flex-col justify-center">
                      <h3 className="font-serif luxury-tracking text-sm md:text-base text-[#171717] mb-1 md:mb-2 line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-[10px] md:text-xs text-gray-500 font-serif leading-relaxed line-clamp-2 md:line-clamp-3">
                          {item.description.split('\n').map((line: string, j: number) => <React.Fragment key={j}>{line}<br/></React.Fragment>)}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          
          <FadeIn delay={0.4} className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/gallery" className="px-12">ギャラリーを見る</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 7. Access Section (トップ要約版) */}
      <section className="py-[var(--spacing-section)] bg-transparent px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Access" />
            </h2>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto opacity-50" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: Info */}
            <FadeIn>
              <dl className="space-y-8 text-sm text-gray-600 font-serif leading-[2.2] tracking-wider">
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-[var(--color-gold)] shrink-0">
                    <MapPin className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    〒231-0012<br />
                    神奈川県横浜市中区相生町３丁目５３<br />
                    グランドパークビル
                  </dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-[var(--color-gold)] shrink-0">
                    <Train className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose text-xs">
                    JR根岸線「関内駅」<strong className="text-[var(--color-gold)] font-normal">徒歩 約5分</strong><br />
                    横浜市営地下鉄「関内駅」<strong className="text-[var(--color-gold)] font-normal">徒歩 約5分</strong><br />
                    みなとみらい線「馬車道駅」<strong className="text-[var(--color-gold)] font-normal">徒歩 約5分</strong><br />
                    みなとみらい線「日本大通り駅」<strong className="text-[var(--color-gold)] font-normal">徒歩 約7分</strong>
                  </dd>
                </div>
              </dl>
              <div className="mt-8">
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link href="/access" className="px-10 luxury-tracking font-serif text-xs uppercase">詳しく見る</Link>
                </Button>
              </div>
            </FadeIn>

            {/* Right: Map */}
            <FadeIn delay={0.2}>
              <div className="overflow-hidden border border-[var(--color-gold)]/20 shadow-aura rounded-sm w-full h-[300px] md:h-[360px]">
                <iframe
                  title="Club Animo アクセスマップ"
                  src="https://maps.google.com/maps?q=%E7%A5%9E%E5%A5%88%E5%B7%9D%E7%9C%8C%E6%A8%AA%E6%B5%9C%E5%B8%82%E4%B8%AD%E5%8C%BA%E7%9B%B8%E7%94%9F%E7%94%BA3%E4%B8%81%E7%9B%AE53+%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%83%91%E3%83%BC%E3%82%AF%E3%83%93%E3%83%AB&output=embed&hl=ja"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 8. Recruit CTA */}
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
