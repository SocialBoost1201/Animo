import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '横浜キャバクラガイド・関内との違い｜CLUB Animo',
  description: '横浜駅周辺と関内・馬車道エリアのキャバクラの違いを解説。ビジネス街で上質な夜遊びを楽しむためのガイド。落ち着いた高級店「CLUB Animo」の魅力をご紹介します。',
  alternates: {
    canonical: '/area/yokohama-cabaret-guide',
  },
};

const YOKOHAMA_CABARET_DIFF = [
  { label: '客層の違い', value: '横浜駅周辺のキャバクラは学生や若いビジネスマンが多く、活気がありアットホームな雰囲気が特徴です。一方、関内エリアは上場企業の役員や士業など、落ち着いた客層が主流です。' },
  { label: '料金とコストパフォーマンス', value: '横浜駅周辺はカジュアルな価格帯が多いですが、高級店になると新宿や六本木並みの価格になることも。関内エリアは全体的に価格に対して接客や内装のレベルが高く、コストパフォーマンスに優れています。' },
  { label: 'お店の雰囲気', value: '関内・馬車道のキャバクラは、洗練された「大人の社交場」としての格式を重んじる店舗が多く、落ち着いてグラスを傾けたい方に最適です。' }
];

export default function YokohamaCabaretGuidePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '横浜キャバクラガイド', item: 'https://club-animo.jp/area/yokohama-cabaret-guide' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="Yokohama Cabaret Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              横浜・関内キャバクラガイド
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="横浜駅と関内エリアの違い"
              description="横浜エリアにおけるキャバクラの二大拠点、横浜駅周辺と関内エリア。それぞれの特徴と違いをまとめました。"
              type="list"
              items={YOKOHAMA_CABARET_DIFF}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              横浜でワンランク上の夜遊びをお求めの方は、<br />
              関内・馬車道エリアのCLUB Animoへお越しください。
            </p>
            <Link 
              href="/gallery" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              店内ギャラリーを見る
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
