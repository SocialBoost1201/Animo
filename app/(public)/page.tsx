import React from 'react';
import { HeroVideoRotatorV2 } from '@/components/features/hero/HeroVideoRotatorV2';
import { HeroMedia } from '@/components/features/hero/types';
import { FadeIn } from '@/components/motion/FadeIn';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { Button } from '@/components/ui/Button';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPin, Train, Sparkles } from 'lucide-react';
import { getPublicCasts, getPublicContents } from '@/lib/actions/public/data';
import { LazyGoogleMap } from '@/components/ui/LazyGoogleMap';
import { getPublishedPosts } from '@/lib/actions/cast-posts';
import { getSiteSettings } from '@/lib/actions/contents';
import { Magnetic } from '@/components/motion/Magnetic';

// Heavy sections optimization
const PriceSimulator = nextDynamic(() => import('@/components/features/system/PriceSimulator').then(m => m.PriceSimulator));
const NightStyleQuiz = nextDynamic(() => import('@/components/features/system/NightStyleQuiz').then(m => m.NightStyleQuiz));
const CastPostSlider = nextDynamic(() => import('@/components/features/cast/CastPostSlider').then(m => m.CastPostSlider));
const DynamicGallerySection = nextDynamic(() => import('@/components/features/gallery/DynamicGallerySection').then(m => m.DynamicGallerySection));
const SilverDustBackground = nextDynamic(() => import('@/components/motion/SilverDustBackground').then(m => m.SilverDustBackground));
const CastFavoriteButton = nextDynamic(() => import('@/components/features/system/CastFavoriteButton').then(m => m.CastFavoriteButton));

export const revalidate = 300;

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
  const [dbCasts, dbNews, settings, dbPosts] = await Promise.all([
    getPublicCasts(),
    getPublicContents('news', 3),
    getSiteSettings().catch(() => null),
    getPublishedPosts(10)
  ]);

  const recentPosts = dbPosts.data || [];

  const heroMediaData: HeroMedia[] = [
    {
      id: 'hero-kannai-street',
      type: 'video',
      url: '/videos/kannai-street_opt.mp4',
      posterUrl: '/images/animo-main-chandelier-hero-poster.webp',
      title: 'Kannai street view',
      durationMs: 5000,
    },
    {
      id: 'hero-chandelier',
      type: 'video',
      url: '/videos/movie01_chandelier.mp4',
      posterUrl: '/images/animo-main-chandelier-hero-poster.webp',
      title: 'Main chandelier interior',
      durationMs: 5000,
    },
    {
      id: 'hero-soumei',
      type: 'video',
      url: '/videos/movie09_soumei.mp4',
      posterUrl: '/images/animo-main-chandelier-hero-poster.webp',
      title: 'Lighting ambience',
      durationMs: 5000,
    },
  ];

  // Today's Cast: is_todayフラグ優先。なければ最大10名表示
  const todayCasts = dbCasts.filter((c) => c.is_today);
  const displayTodayCasts = todayCasts.length > 0 ? todayCasts.slice(0, 10) : dbCasts.slice(0, 10);
  
  // 在籍キャスト用 (最大10名表示)
  const displayAllCasts = dbCasts.slice(0, 10);

  // HeroCTA
  const heroCta = (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-6 sm:px-0">
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
      <HeroVideoRotatorV2
        media={heroMediaData}
        transitionMode={(settings?.hero_transition_mode || 'ripple') as import('@/components/features/hero/types').HeroTransitionMode}
        durationMs={5000}
        transitionMs={800}
        mobileFallbackSrc="/images/animo-main-chandelier-hero-poster.webp"
        mobileFallbackAlt="CLUB Animo main chandelier interior"
        cta={heroCta}
      />

      {/* 1.5 TODAY'S MOOD */}
      {settings?.today_mood && (
        <section className="bg-[#171717] text-white py-12 px-6 border-y border-gold/20 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/stardust.png')] opacity-10"></div>
          <div className="container mx-auto text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center justify-center space-x-3 mb-4">
                <div className="h-[1px] w-8 bg-gold"></div>
                <span className="text-xs font-serif text-gold luxury-tracking uppercase tracking-widest">Today&apos;s Mood</span>
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
      <section id="today-cast" className="py-section bg-transparent px-6 overflow-hidden">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Today's Cast" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-4 opacity-50" />
            <p className="text-xs text-gray-400 font-serif luxury-tracking uppercase mb-6">本日の出勤</p>
          </FadeIn>

          <div
            className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mx-auto"
            style={displayTodayCasts.length < 5 ? {
              gridTemplateColumns: `repeat(${Math.min(displayTodayCasts.length, 3)}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(displayTodayCasts.length, 3) * 220}px`,
            } : undefined}
          >
            {displayTodayCasts.map((cast, index) => (
              <FadeIn key={cast.id} delay={index * 0.04} className={`group ${index === 9 ? 'hidden md:block' : ''}`}>
                <div className="overflow-hidden bg-white hover:shadow-luxury transition-all duration-700 h-full flex flex-col">
                  <Link href={`/cast/${cast.slug}`} className="block relative">
                    <PlaceholderImage
                      src={cast.image_url}
                      alt={cast.name}
                      ratio="3:4"
                      placeholderText={cast.name}
                      className="group-hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-20">
                      <CastFavoriteButton castId={cast.id} />
                    </div>
                    {cast.is_today && (
                      <div className="absolute top-0 left-0 right-0 bg-[#171717]/85 text-white text-xs font-sans tracking-widest px-2 py-1 text-center uppercase">
                        本日出勤
                      </div>
                    )}
                  </Link>
                  <div className="px-2 pt-2 pb-2.5 md:px-3 md:pt-2.5 md:pb-3 bg-white text-center flex-1">
                    <Link href={`/cast/${cast.slug}`}>
                      <p className="text-xs md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase leading-none mb-0.5">
                        {cast.name_kana
                          ? cast.name_kana
                              .replace(/[ぁ-ん]/g, (c: string) => String.fromCharCode(c.charCodeAt(0) + 0x60))
                              .toUpperCase()
                          : cast.name.toUpperCase()
                        }
                      </p>
                      <h3 className="font-serif text-xs md:text-sm text-[#171717] hover:text-gold transition-colors leading-snug">
                        {cast.name}
                      </h3>
                    </Link>
                    <div className="flex justify-center items-center mt-1 gap-1 text-xs md:text-xs text-gray-400">
                      {cast.age && <span>{cast.age}歳</span>}
                      {cast.age && cast.height && <span className="text-gray-200">•</span>}
                      {cast.height && <span>{cast.height}cm</span>}
                    </div>
                    {/* 日記UPバッジ (72時間以内に投稿があれば表示) */}
                    {cast.has_recent_post && (
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-[#171717] text-white text-xs font-bold tracking-widest px-2 py-0.5">
                        <span>📓</span>
                        <span>日記UP</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {displayTodayCasts.length === 0 && (
            <div className="py-12 text-center text-gray-400 font-serif luxury-tracking text-sm">
              本日の出勤予定はまだ公開されていません。
            </div>
          )}


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
                  <time className="text-xs text-gold font-serif luxury-tracking shrink-0 tabular-nums">
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
                  <time className="text-xs text-gold font-serif luxury-tracking shrink-0">2026.03.01</time>
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
                  <p className="text-xs text-gold font-serif luxury-tracking uppercase tracking-widest mb-2">
                    Pattern {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif luxury-tracking text-lg text-foreground mb-1">{ex.label}</h3>
                  <p className="text-xs text-gray-400 font-serif mb-6">{ex.tag}</p>

                  <div className="space-y-3 flex-1">
                    {ex.items.map((item, j) => (
                      <div key={j} className="flex justify-between text-xs font-serif text-gray-600 border-b border-gray-50 pb-2">
                        <span>{item.name}</span>
                        <span className="tabular-nums">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/20 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif luxury-tracking uppercase">Total</span>
                    <span className="text-2xl font-serif text-foreground">{ex.total}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-serif mt-3 leading-relaxed">{ex.note}</p>
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

      {/* 6. CAST POSTS (キャスト日記) */}
      {recentPosts.length > 0 && (
        <section className="py-24 bg-transparent px-6 border-b border-gold/10">
          <div className="container mx-auto">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
                <GsapRevealTitle text="Timeline" />
              </h2>
              <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
              <p className="text-xs text-gray-500 font-serif luxury-tracking uppercase">キャスト日記</p>
            </FadeIn>
            
            <div className="max-w-6xl mx-auto">
              <CastPostSlider posts={recentPosts} />
            </div>
          </div>
        </section>
      )}

      {/* 7. CAST */}
      <section className="py-section bg-[#f9f7f4] px-6">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Cast" />
            </h2>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-xs text-gold font-serif luxury-tracking uppercase">在籍キャスト</p>
          </FadeIn>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
            {displayAllCasts.map((cast, index) => (
              <FadeIn key={cast.id} delay={index * 0.05} className={`group ${index === 9 ? 'hidden md:block' : ''}`}>
                <Link href={`/cast/${cast.slug}`} className="block h-full">
                  <div className="overflow-hidden bg-white shadow-sm hover:shadow-luxury-hover transition-all duration-700 group-hover:-translate-y-1 border border-gold/10 h-full flex flex-col">
                    <div className="relative">
                      <PlaceholderImage
                        src={cast.image_url}
                        alt={cast.name}
                        ratio="4:5"
                        placeholderText={cast.name}
                        className="group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                        <CastFavoriteButton castId={cast.id} />
                      </div>
                      {cast.is_today && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm text-xs md:text-xs font-serif luxury-tracking text-gold px-2 py-1 md:px-3 uppercase border border-gold/30">
                          Today
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4 text-center bg-white border-t border-gray-50 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif luxury-tracking text-sm md:text-base text-foreground group-hover:text-gold transition-colors">{cast.name}</h3>
                        <div className="flex justify-center items-center mt-1.5 gap-1 text-xs md:text-xs text-gray-400 font-serif">
                          {cast.age && <span>{cast.age}歳</span>}
                          {cast.age && cast.height && <span className="text-gray-300">|</span>}
                          {cast.height && <span>{cast.height}cm</span>}
                        </div>
                        {cast.comment && (
                          <p className="text-xs md:text-xs text-gray-400 mt-2 font-serif luxury-tracking line-clamp-1 italic">
                            &ldquo;{cast.comment}&rdquo;
                          </p>
                        )}
                      </div>
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

          <DynamicGallerySection />

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
                <LazyGoogleMap
                  title="Club Animo アクセスマップ"
                  src="https://maps.google.com/maps?q=%E7%A5%9E%E5%A5%88%E5%B7%9D%E7%9C%8C%E6%A8%AA%E6%B5%9C%E5%B8%82%E4%B8%AD%E5%8C%BA%E7%9B%B8%E7%94%9F%E7%94%BA3%E4%B8%81%E7%9B%AE53+%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%83%91%E3%83%BC%E3%82%AF%E3%83%93%E3%83%AB&output=embed&hl=ja"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 9. RECRUIT */}
      <section className="py-24 bg-[#111] px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <PlaceholderImage src="/images/cast-recruit-hero.webp" ratio="16:9" alt="Recruit Background" className="w-full h-full object-cover" />
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
