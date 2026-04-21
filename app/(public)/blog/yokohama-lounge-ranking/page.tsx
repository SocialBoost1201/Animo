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
  title: '横浜・関内の高級ラウンジおすすめランキングと選び方｜CLUB Animo',
  description: '横浜・関内エリアで人気の高級ラウンジ・優良キャバクラを探している方へ。接客、内装、客層の良さで選ぶ、本当に上質なナイトスポットのおすすめランキング基準と選び方。',
  alternates: {
    canonical: '/blog/yokohama-lounge-ranking',
  },
  openGraph: {
    title: '横浜・関内の高級ラウンジおすすめランキングと選び方｜CLUB Animo',
    description: '接客、内装、客層の良さで選ぶ、本当に上質なナイトスポットのおすすめランキング基準。',
  
    images: ['/api/og?title=%E6%A8%AA%E6%B5%9C%E3%83%BB%E9%96%A2%E5%86%85%E3%81%AE%E9%AB%98%E7%B4%9A%E3%83%A9%E3%82%A6%E3%83%B3%E3%82%B8%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%81%A8%E9%81%B8%E3%81%B3%E6%96%B9%EF%BD%9CCLUB%20Animo&category=Blog'],}
};

const LOUNGE_RANKING_CRITERIA = [
  { label: '落ち着いた上質な接客（接客力）', value: 'ただ盛り上げるだけでなく、お客様の会話のペースに合わせ、細やかな気遣いができるキャストが在籍していること。' },
  { label: '高級感と適度なプライバシー（空間）', value: '隣のお客様との距離が保たれ、内装に品があること。接待などに使える個室やVIP設備がある店舗は評価が高くなります。' },
  { label: '客層の良さと安全性（安心感）', value: 'トラブルがなく、身元のしっかりとした客層で賑わっていること。料金システムが明朗でぼったくりの心配がないこと。' }
];

export default function YokohamaLoungeRankingPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <ArticleSchema 
        title="横浜・関内の高級ラウンジおすすめランキングと選び方｜CLUB Animo"
        description="横浜・関内エリアで人気の高級ラウンジ・優良キャバクラを探している方へ。接客、内装、客層の良さで選ぶ、本当に上質なナイトスポットのおすすめランキング基準と選び方。"
        publishedAt="2024-03-01T00:00:00+09:00"
        updatedAt="2024-03-01T00:00:00+09:00"
      />
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '横浜・関内高級ラウンジの選び方', item: 'https://club-animo.jp/blog/yokohama-lounge-ranking' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-3xl mb-6 luxury-tracking uppercase">
              <RevealText text="Yokohama Lounge Ranking & Selection" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              おすすめ高級ラウンジの選び方基準
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="本当におすすめできる優良ラウンジの基準"
              description="口コミサイトのランキングに惑わされない、本物の優良店（ラウンジ・高級キャバクラ）を見極める3つの基準をご紹介します。"
              type="list"
              items={LOUNGE_RANKING_CRITERIA}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              CLUB Animoは、これらすべての基準を高いレベルで満たす、関内トップクラスの店舗です。<br />
              皆様の厳しい目でお確かめください。
            </p>
            <Link 
              href="/gallery" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              こだわりの店内空間を見る
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
