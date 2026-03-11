import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '関内夜遊びガイド・おすすめナイトスポット｜CLUB Animo',
  description: '横浜・関内エリアの夜遊びガイド。大人が楽しめるナイトスポットから、接待やデートの二次会で使える高級キャバクラ、おすすめのバー・ラウンジまでご紹介します。',
  openGraph: {
    title: '関内夜遊びガイド・おすすめナイトスポット｜CLUB Animo',
    description: '横浜・関内エリアの夜遊びガイド。接待やデートの二次会で使える高級キャバクラ、おすすめのバーをご紹介します。',
  
    images: ['/api/og?title=%E9%96%A2%E5%86%85%E5%A4%9C%E9%81%8A%E3%81%B3%E3%82%AC%E3%82%A4%E3%83%89%E3%83%BB%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%8A%E3%82%A4%E3%83%88%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%EF%BD%9CCLUB%20Animo&category=Area Info'],}
};

const KANNAI_NIGHTSPOTS = [
  { label: '関内エリアの特徴', value: '横浜市中区にある関内エリアは、神奈川県下でも屈指の歓楽街。歴史ある建物と近代的なオフィスが混在し、その周辺には落ち着いた夜遊びスポットが密集しています。' },
  { label: '接待での利用', value: '上場企業の役員や経営者が集うため、高級料亭からの二次会として上品な高級店への需要が高いエリアです。' },
  { label: 'デートや少人数利用', value: '隠れ家的なバーや静かな会員制ラウンジが多く、大切なパートナーや親しい友人との時間を過ごすのにも適しています。' }
];

const NIGHTLIFE_QA = [
  { question: '関内でおすすめの夜遊び（二次会）スポットは？', answer: '客層が良く、明朗会計で安心して楽しめる「CLUB Animo」のような高級キャバクラ店がおすすめです。落ち着いた雰囲気を求めるエグゼクティブに支持されています。' },
  { question: '関内のキャバクラは安全ですか？', answer: '関内エリアの優良店舗は、明朗会計・ぼったくり等の不当請求がないシステムを確立しており、非常に安全です。CLUB Animoもその一角を担う安心の老舗店です。' },
];

export default function KannaiNightlifePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: '関内夜遊びガイド', item: 'https://club-animo.com/area/kannai-nightlife' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="Kannai Nightlife Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内夜遊びガイド・ナイトスポット
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="関内の夜を遊び尽くす"
              description="歴史と格式ある関内エリア。大人が羽を伸ばすのにふさわしいナイトスポットの選び方。"
              type="list"
              items={KANNAI_NIGHTSPOTS}
            />
          </FadeIn>

          <FadeIn>
            <GeoSchemaUI 
              title="関内夜遊び Q&A"
              type="qa"
              items={NIGHTLIFE_QA}
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
