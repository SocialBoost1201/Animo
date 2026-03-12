import React from 'react';
import { HeroVideoRotator } from '@/components/features/hero/HeroVideoRotator';
import { HeroMedia } from '@/components/features/hero/types';
import { FadeIn } from '@/components/motion/FadeIn';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { Button } from '@/components/ui/Button';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { LuxuryCarousel } from '@/components/ui/LuxuryCarousel';
import { PriceSimulator } from '@/components/features/system/PriceSimulator';
import { NightStyleQuiz } from '@/components/features/system/NightStyleQuiz';
import { CastFavoriteButton } from '@/components/features/system/CastFavoriteButton';
import { GallerySection } from '@/components/features/gallery/GallerySection';
import Link from 'next/link';
import { CalendarHeart, MapPin, Train, CalendarDays, Sparkles } from 'lucide-react';
import { getPublicHeroMedia, getPublicCasts, getPublicContents } from '@/lib/actions/public/data';
import { getSiteSettings } from '@/lib/actions/contents';
import { Magnetic } from '@/components/motion/Magnetic';
import { SilverDustBackground } from '@/components/motion/SilverDustBackground';

export const dynamic = 'force-dynamic';

// HOW TO ENJOY - 静的コンテンツ
const HOW_TO_EXAMPLES = [
  {
    label: 'はじめての方',
    tag: 'Visitor · 60分 · 指名なし',
    items: [
      { name: 'セット料金', price: '¥7,000' },
      { name: 'TAX / Service (30%)', price: '¥2,100' },
    ],
    total: '¥9,000',
    note: '※ 最もシンプルなご利用例。まず雰囲気を楽しみたい方に。',
  },
  {
    label: '場内指名で楽しむ',
    tag: 'Visitor · 90分 · 場内指名',
    items: [
      { name: 'セット料金', price: '¥7,000' },
      { name: '延長 30分', price: '¥3,500' },
      { name: '場内指名', price: '¥2,500' },
      { name: 'TAX / Service (30%)', price: '¥3,900' },
    ],
    total: '¥17,000',
    note: '※ 気になるキャストをその場で指名して過ごす標準パターン。',
  },
  {
    label: 'じっくり楽しむ',
    tag: 'Visitor · 120分 · 本指名',
    items: [
      { name: 'セット料金', price: '¥7,000' },
      { name: '延長 60分', price: '¥7,000' },
      { name: '本指名', price: '¥3,000' },
      { name: 'TAX / Service (30%)', price: '¥5,100' },
    ],
    total: '¥22,000',
    note: '※ お気に入りのキャストとたっぷり過ごしたい方のスタンダード。',
  },
];

export default async function HomePage() {
  const [dbHeroMedia, dbCasts, , dbNews, settings] = await Promise.all([
    getPublicHeroMedia(),
    getPublicCasts(),
    getPublicContents('gallery', 9),
    getPublicContents('news', 3),
    getSiteSettings().catch(() => null),
  ]);

  const heroMediaData: HeroMedia[] = dbHeroMedia.length > 0
    ? dbHeroMedia.map((m) => ({
        id: m.id,
        type: m.type as 'video' | 'image',
        url: m.url,
        posterUrl: m.poster_url || m.url,
        title: m.title,
      }))
    : [
        { id: 'v0', type: 'video', url: '/videos/animo-hero.mov', posterUrl: '/images/ogp.jpg', durationMs: 5000 },
        { id: 'v1', type: 'video', url: '/videos/movie08_chandelier..mov', posterUrl: '/videos/movie08_chandelier..mov' },
        { id: 'v4', type: 'video', url: '/videos/movie04_shelf.mp4', posterUrl: '/videos/movie04_shelf.mp4' },
        { id: 'v2', type: 'video', url: '/videos/movie02_shelf.mp4', posterUrl: '/videos/movie02_shelf.mp4' },
        { id: 'v3', type: 'video', url: '/videos/movie03_bar.mp4', posterUrl: '/videos/movie03_bar.mp4' },
        { id: 'v5', type: 'video', url: '/videos/movie05_floor.mp4', posterUrl: '/videos/movie05_floor.mp4' },
        { id: 'v6', type: 'video', url: '/videos/movie06_flower.mp4', posterUrl: '/videos/movie06_flower.mp4' },
        { id: 'v7', type: 'video', url: '/videos/movie07_flower.mp4', posterUrl: '/videos/movie07_flower.mp4' },
      ];

  // Today's Cast: is_todayフラグ優先。なければ最大5名表示
  const todayCasts = dbCasts.filter((c) => c.is_today);
  const displayCasts = todayCasts.length > 0 ? todayCasts : dbCasts.slice(0, 5);

  // HeroCTA
  const heroCta = (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-6 sm:px-0">
      <Magnetic strength={0.3}>
        <Link
          href="/shift"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 min-h-[44px] bg-white/10 backdrop-blur-sm border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/20 transition-all"
        >
          <CalendarDays className="w-4 h-4" />
          本日の出勤を見る
        </Link>
      </Magnetic>
      <Magnetic strength={0.3}>
        <Link
          href="/system"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 min-h-[44px] bg-gold text-white font-serif luxury-tracking text-xs uppercase hover:bg-white hover:text-[#171717] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          料金を確認する
        </Link>
      </Magnetic>
    </div>
  );

  return (
    <>
      {/* 1. Hero */}
      <HeroVideoRotator
        media={heroMediaData}
        transitionMode={(settings?.hero_transition_mode || 'ripple') as import('@/components/features/hero/types').HeroTransitionMode}
        durationMs={5000}
        transitionMs={800}
        cta={heroCta}
      />

      {/* 1.5 TODAY'S MOOD */}
      {settings?.today_mood && (
        <section className="bg-[#171717] text-white py-12 px-6 border-y border-gold/20 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="container mx-auto text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center justify-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-gold"></div>
                <span className="text-[10px] font-serif text-gold luxury-tracking uppercase tracking-widest">Today&apos;s Mood</span>
                <div className="h-[1px] w-8 bg-gold"></div>
              </div>
              <p className="text-sm md:text-base font-serif tracking-widest leading-loose text-white/90 max-w-2xl mx-auto">
                {settings.today_mood}
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* 2. TODAY'S CAST */}
      <section className="py-section bg-transparent px-6 overflow-hidden">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Today's Cast" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-4 opacity-50" />
            <p className="text-xs text-gray-400 font-serif luxury-tracking uppercase mb-6">本日の出勤</p>
            <Link href="/shift" className="inline-flex items-center text-gold text-[10px] font-bold tracking-widest hover:underline underline-offset-4 uppercase font-serif">
              View Schedule →
            </Link>
          </FadeIn>

          <LuxuryCarousel
            autoplay
            options={{ loop: true, align: 'center', dragFree: true }}
            slides={displayCasts.map((cast) => (
              <div key={cast.id} className="group select-none">
                <div className="overflow-hidden bg-white/40 backdrop-blur-md hover:shadow-aura transition-all duration-1000">
                  <Link href={`/cast/${cast.slug}`} className="block relative">
                    <PlaceholderImage
                      src={cast.image_url}
                      alt={cast.name}
                      ratio="4:5"
                      placeholderText={cast.name}
                      className="group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div className="absolute top-3 right-3 z-20">
                      <CastFavoriteButton castId={cast.id} />
                    </div>
                    {cast.is_today && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-serif luxury-tracking text-gold px-3 py-1 uppercase border border-gold/30">
                        Today
                      </div>
                    )}
                  </Link>
                  <div className="pt-6 pb-5 px-4 bg-white relative z-10 text-center">
                    <Link href={`/cast/${cast.slug}`}>
                      <h3 className="font-serif luxury-tracking text-xl text-[#171717] hover:text-gold transition-colors">
                        {cast.name}
                      </h3>
                    </Link>
                    <div className="flex flex-col justify-center items-center mt-2 gap-1.5">
                      <span className="text-xs text-gray-400 font-serif luxury-tracking">
                        {cast.age ? `${cast.age}歳` : ''}{cast.height ? ` / ${cast.height}cm` : ''}
                      </span>
                      {cast.comment && (
                        <span className="text-[10px] text-gray-400 font-serif luxury-tracking line-clamp-1 italic">
                          &ldquo;{cast.comment}&rdquo;
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <Link
                        href={`/cast/${cast.slug}`}
                        className="w-full py-2.5 border border-gray-200 text-[9px] font-serif luxury-tracking text-gray-600 uppercase hover:border-gold hover:text-gold transition-colors"
                      >
                        プロフィールを見る
                      </Link>
                      <Link
                        href={`/reserve?cast=${encodeURIComponent(cast.name)}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#171717] text-white text-[9px] font-serif luxury-tracking uppercase hover:bg-gold transition-colors"
                      >
                        <CalendarHeart className="w-3 h-3" />
                        指名して予約
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          />

          {displayCasts.length === 0 && (
            <div className="py-12 text-center text-gray-400 font-serif luxury-tracking text-sm">
              本日の出勤予定はまだ公開されていません。
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/shift">出勤スケジュールを見る</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. NEWS */}
      <section className="py-24 bg-transparent px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="News" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto opacity-50" />
          </FadeIn>

          <div className="space-y-0">
            {dbNews.length > 0 ? dbNews.map((news: { id: string; title?: string; category?: string; content_date?: string; created_at?: string }) => (
              <FadeIn key={news.id}>
                <Link
                  href={`/news/${news.id}`}
                  className="flex items-baseline gap-6 py-6 border-b border-gold/10 group hover:bg-gold/5 transition-colors px-4 -mx-4"
                >
                  <time className="text-[11px] text-gold font-serif luxury-tracking shrink-0 tabular-nums">
                    {new Date(news.content_date || news.created_at || new Date()).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </time>
                  <span className="text-sm font-serif text-foreground group-hover:text-gold transition-colors luxury-tracking line-clamp-1">
                    {news.title}
                  </span>
                </Link>
              </FadeIn>
            )) : (
              <FadeIn>
                <div className="py-6 border-b border-gold/10 px-4 flex items-baseline gap-6">
                  <time className="text-[11px] text-gold font-serif luxury-tracking shrink-0">2026.03.01</time>
                  <span className="text-sm font-serif text-foreground luxury-tracking">春の特別イベント開催予定のお知らせ</span>
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn delay={0.3} className="mt-10 text-center">
            <Link href="/news" className="text-xs font-serif text-gold luxury-tracking uppercase hover:underline underline-offset-4">
              View All News →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 4. HOW TO ENJOY ANIMO */}
      <section className="py-section bg-[#f9f7f4] px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="How to Enjoy" />
            </h2>
            <p className="text-xs text-gold font-serif luxury-tracking uppercase">Animo の楽しみ方</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_TO_EXAMPLES.map((ex, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white p-8 border border-gold/10 h-full flex flex-col">
                  <p className="text-[10px] text-gold font-serif luxury-tracking uppercase tracking-widest mb-2">
                    Pattern {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif luxury-tracking text-lg text-foreground mb-1">{ex.label}</h3>
                  <p className="text-[10px] text-gray-400 font-serif mb-6">{ex.tag}</p>

                  <div className="space-y-3 flex-1">
                    {ex.items.map((item, j) => (
                      <div key={j} className="flex justify-between text-xs font-serif text-gray-600 border-b border-gray-50 pb-2">
                        <span>{item.name}</span>
                        <span className="tabular-nums">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/20 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-serif luxury-tracking uppercase">Total</span>
                    <span className="text-2xl font-serif text-foreground">{ex.total}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-serif mt-3 leading-relaxed">{ex.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/guide" className="px-12 luxury-tracking font-serif text-xs uppercase">
                初めての方へ →
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 5. PRICE SIMULATOR */}
      <section className="py-section bg-transparent px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Price Simulator" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto opacity-50" />
            <p className="text-xs text-gray-400 font-serif luxury-tracking mt-6">
              ご利用内容に合わせた料金目安をシミュレーションできます
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <PriceSimulator />
          </FadeIn>
        </div>
      </section>

      {/* 5.5 NIGHT STYLE QUIZ */}
      <section className="py-section bg-white px-6">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Night Style" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto opacity-50" />
            <p className="text-xs text-gray-400 font-serif luxury-tracking mt-6">
              今日の気分に合わせた過ごし方をご提案します
            </p>
          </FadeIn>
          <NightStyleQuiz />
        </div>
      </section>

      {/* 6. CAST */}
      <section className="py-section bg-[#f9f7f4] px-6">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Cast" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-xs text-gold font-serif luxury-tracking uppercase">在籍キャスト</p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {dbCasts.slice(0, 10).map((cast, index) => (
              <FadeIn key={cast.id} delay={index * 0.05} className="group">
                <Link href={`/cast/${cast.slug}`} className="block">
                  <div className="overflow-hidden bg-white shadow-sm hover:shadow-luxury-hover transition-all duration-700 group-hover:-translate-y-1">
                    <div className="relative">
                      <PlaceholderImage
                        src={cast.image_url}
                        alt={cast.name}
                        ratio="4:5"
                        placeholderText={cast.name}
                        className="group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <CastFavoriteButton castId={cast.id} />
                      </div>
                      {cast.is_today && (
                        <div className="absolute top-3 left-3 bg-white text-[8px] font-serif luxury-tracking text-gold px-3 py-1 uppercase border border-gold/30">
                          Today
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center bg-white border-t border-gray-50">
                      <h3 className="font-serif luxury-tracking text-base text-foreground">{cast.name}</h3>
                      <div className="flex justify-center items-center mt-1.5 gap-2 text-[10px] text-gray-400 font-serif">
                        {cast.age && <span>{cast.age}歳</span>}
                        {cast.age && cast.height && <span>·</span>}
                        {cast.height && <span>{cast.height}cm</span>}
                      </div>
                      {cast.comment && (
                        <p className="text-[10px] text-gray-400 mt-2 font-serif luxury-tracking line-clamp-1 italic">
                          &ldquo;{cast.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {dbCasts.length === 0 && (
            <div className="py-16 text-center text-gray-400 font-serif luxury-tracking">
              キャスト情報はまだ登録されていません。
            </div>
          )}

          <FadeIn delay={0.3} className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/cast" className="px-12 luxury-tracking font-serif text-xs uppercase">
                キャスト一覧を見る →
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 7. EXPERIENTIAL GALLERY */}
      <section className="py-section bg-[#111] px-0 md:px-6 mt-12 mb-12 relative z-10">
        <SilverDustBackground particleCount={80} opacity={0.3} minSize={3.0} maxSize={7.0} className="z-[-5]" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/95 to-black -z-10 pointer-events-none" />
        <div className="container mx-auto relative z-20">
          <FadeIn className="text-center mb-10 pt-12">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-gold uppercase mb-8">
              <GsapRevealTitle text="Gallery" />
            </h2>
            <div className="w-px h-16 bg-linear-to-b from-gold to-transparent mx-auto opacity-50" />
            <p className="text-xs text-gold font-serif luxury-tracking uppercase mt-8">The Atmosphere of Club Animo</p>
          </FadeIn>

          <GallerySection />

          <FadeIn delay={0.4} className="mt-16 text-center pb-12">
            <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
              <Link href="/gallery" className="px-12">すべての写真を見る</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 8. ACCESS */}
      <section className="py-section bg-[#f9f7f4] px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Access" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto opacity-50" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <dl className="space-y-8 text-sm text-gray-600 font-serif leading-[2.2] tracking-wider">
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <MapPin className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    〒231-0012<br />
                    神奈川県横浜市中区相生町３丁目５３<br />
                    グランドパークビル2F
                  </dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <Train className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose text-xs space-y-1">
                    <p>JR根岸線「関内駅」<strong className="text-gold font-normal">徒歩 約5分</strong></p>
                    <p>横浜市営地下鉄「関内駅」<strong className="text-gold font-normal">徒歩 約5分</strong></p>
                    <p>みなとみらい線「馬車道駅」<strong className="text-gold font-normal">徒歩 約6分</strong></p>
                    <p>みなとみらい線「日本大通り駅」<strong className="text-gold font-normal">徒歩 約8分</strong></p>
                  </dd>
                </div>
              </dl>
              <div className="mt-8">
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link href="/access" className="px-10 luxury-tracking font-serif text-xs uppercase">詳しく見る</Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="overflow-hidden border border-gold/20 shadow-aura w-full h-[300px] md:h-[360px]">
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

      {/* 9. RECRUIT */}
      <section className="py-24 bg-[#111] px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <PlaceholderImage src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop" ratio="16:9" alt="Recruit Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-gold font-serif text-3xl md:text-4xl mb-6 tracking-widest uppercase">
              Recruit
            </h2>
            <p className="text-gray-300 font-sans text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              当店では、一緒に最高の空間を創り上げるキャスト・スタッフを募集しています。<br />
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
