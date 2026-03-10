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
  title: '関内キャバクラの選び方｜失敗しない優良店の見極めポイント',
  description: '初めて関内でキャバクラに行く方から、接待で絶対に外せない方まで。優良店とそうでない店舗を見極めるポイント（明朗会計、接客レベル、客層）を詳しく解説します。',
};

const CHOOSE_POINTS = [
  { label: '料金システムが事前に明示されているか', value: '入店前にセット料金やTAX（サービス料）のパーセンテージが明確に提示されているお店は安心です。不明瞭な店舗は避けるのが無難です。' },
  { label: '客層の良さ', value: 'ビジネス街の関内では、落ち着いた紳士的なお客様が多い店舗を選ぶと、店内も静かで優雅な時間を過ごすことができます。' },
  { label: '外装・内装の清潔感と高級感', value: '店構えや内装にこだわっている店舗は、キャストの教育やサービス全体にも力を入れている傾向があります。' }
];

export default function HowToChoosePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <ArticleSchema 
        title="関内キャバクラの選び方｜失敗しない優良店の見極めポイント"
        description="初めて関内でキャバクラに行く方から、接待で絶対に外せない方まで。優良店とそうでない店舗を見極めるポイント（明朗会計、接客レベル、客層）を詳しく解説します。"
        publishedAt="2024-03-01T00:00:00+09:00"
        updatedAt="2024-03-01T00:00:00+09:00"
      />
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: '関内キャバクラの選び方', item: 'https://club-animo.com/blog/how-to-choose-cabaret' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="How to Choose a Cabaret" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              失敗しない関内キャバクラの選び方
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="優良店を見極める3つのポイント"
              description="関内エリアでキャバクラ選びに失敗しないためのチェックポイントをまとめました。"
              type="list"
              items={CHOOSE_POINTS}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              CLUB Animoは、完全明朗会計と上質なサービスをお約束します。
            </p>
            <Link 
              href="/system" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              料金システムを確認する
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
