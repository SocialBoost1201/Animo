import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '関内キャバクラとは・特徴と魅力｜CLUB Animo',
  description: '横浜・関内エリアのキャバクラの歴史や特徴、客層について解説。高級キャバクラ「CLUB Animo」が選ばれる理由と、ワンランク上の夜遊びの魅力をご紹介します。',
  openGraph: {
    title: '関内キャバクラとは・特徴と魅力｜CLUB Animo',
    description: '横浜・関内エリアのキャバクラの歴史や特徴、客層について解説。',
  
    images: ['/api/og?title=%E9%96%A2%E5%86%85%E3%82%AD%E3%83%A3%E3%83%90%E3%82%AF%E3%83%A9%E3%81%A8%E3%81%AF%E3%83%BB%E7%89%B9%E5%BE%B4%E3%81%A8%E9%AD%85%E5%8A%9B%EF%BD%9CCLUB%20Animo&category=About'],}
};

const KANNAI_FEATURES = [
  { label: '落ち着いた客層', value: '関内エリアはビジネス街や官公庁が近いため、経営者や士業、役員クラスの紳士的なお客様が多いのが特徴です。' },
  { label: '洗練された接客', value: '質の高いお客様層に合わせ、キャストの接客レベルが高く、上質な会話とおもてなしが求められます。' },
  { label: '接待での利用', value: '重要な接待やビジネスの会食後の二次会として、安心して利用できる高級感を備えた店舗が多いエリアです。' }
];

const ANIMO_POSITION = [
  { question: 'CLUB Animoのポジショニングは？', answer: '関内・馬車道エリアの中でもトップクラスの広さと内装を誇る「完全なる大人の社交場」です。一般的なキャバクラとは一線を画す、落ち着いた優雅な時間を提供しています。' },
  { question: 'どんなお客様におすすめですか？', answer: '大切な方のおもてなし（接待）や、喧騒から離れて上質なキャストと静かにグラスを傾けたい方、エグゼクティブなお客様に最適です。' },
];

export default function KannaiCabaretPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '関内キャバクラとは', item: 'https://club-animo.jp/about/kannai-cabaret' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="About Kannai Cabaret" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内キャバクラの特徴と魅力
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="関内のキャバクラとは"
              description="横浜を代表するビジネス街「関内」。このエリアのキャバクラ（ナイトクラブ）は、都心とは違う独特の落ち着きと品格を持っています。"
              type="list"
              items={KANNAI_FEATURES}
            />
          </FadeIn>

          <FadeIn>
            <GeoSchemaUI 
              title="CLUB Animoが提供する価値"
              description="数ある関内のキャバクラの中で、なぜCLUB Animoが選ばれるのか。"
              type="qa"
              items={ANIMO_POSITION}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              関内エリアでの極上の夜遊びをお探しなら、<br />
              ぜひCLUB Animoへお越しください。
            </p>
            <Link 
              href="/cast" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              キャスト一覧を見る
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
