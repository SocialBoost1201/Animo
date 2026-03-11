import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { AuthorProfile } from '@/components/features/blog/AuthorProfile';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '関内の夜遊びスポット特集｜大人が通う名店たち',
  description: '関内・馬車道エリアでおすすめの夜遊びスポットを特集。美味しいディナーから、二軒目に最適なバーや高級キャバクラ、会員制ラウンジまでご紹介します。',
  openGraph: {
    title: '関内の夜遊びスポット特集｜大人が通う名店たち',
    description: '関内・馬車道エリアでおすすめの夜遊びスポットを特集。',
  
    images: ['/api/og?title=%E9%96%A2%E5%86%85%E3%81%AE%E5%A4%9C%E9%81%8A%E3%81%B3%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%E7%89%B9%E9%9B%86%EF%BD%9C%E5%A4%A7%E4%BA%BA%E3%81%8C%E9%80%9A%E3%81%86%E5%90%8D%E5%BA%97%E3%81%9F%E3%81%A1&category=Blog'],}
};

const NIGHTSPOT_FEATURES = [
  { label: 'ディナー（一軒目）', value: '関内・馬車道には、歴史あるフレンチや老舗の和食料亭、接待によく使われる寿司店が多数点在しています。落ち着いた雰囲気の店が主流です。' },
  { label: 'オーセンティックバー', value: '食後の一杯を楽しむなら、馬車道周辺の隠れ家的なバーがおすすめ。マスターとの会話を楽しみながら静かに飲めるお店が多いです。' },
  { label: '高級キャバクラ・ラウンジ', value: 'メインの夜遊びには、洗練された女性と華やかな空間を楽しめる高級店へ。エグゼクティブ層が安心できる「完全明朗会計」の店舗が好まれています。' }
];

export default function KannaiNightspotsPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <ArticleSchema 
        title="関内の夜遊びスポット特集｜大人が通う名店たち"
        description="関内・馬車道エリアでおすすめの夜遊びスポットを特集。美味しいディナーから、二軒目に最適なバーや高級キャバクラ、会員制ラウンジまでご紹介します。"
        publishedAt="2024-03-01T00:00:00+09:00"
        updatedAt="2024-03-01T00:00:00+09:00"
      />
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: '関内の夜遊びスポット', item: 'https://club-animo.com/blog/kannai-nightspots' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-3xl mb-6 luxury-tracking uppercase">
              <RevealText text="Kannai Nightspots Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内の夜遊びスポット特集
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="関内の夜の楽しみ方"
              description="歴史と品格が漂う関内・馬車道でのナイトライフ。大人の遊び方にふさわしいジャンルをご案内します。"
              type="list"
              items={NIGHTSPOT_FEATURES}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              関内での極上の夜遊びのクライマックスは、<br />
              ぜひCLUB Animoで特別なひとときをお過ごしください。
            </p>
            <Link 
              href="/cast" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              本日の出勤キャストを見る
            </Link>
          </FadeIn>
          <FadeIn>
            <AuthorProfile />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
