import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '馬車道ラウンジの特徴とキャバクラとの違い｜CLUB Animo',
  description: '横浜・馬車道エリアの会員制ラウンジや高級クラブの特徴を解説。キャバクラとのシステムの違いや、ゆったりとした時間が流れる馬車道の大人の夜遊びをご案内します。',
  alternates: {
    canonical: '/about/bashamichi-lounge',
  },
};

const BASHAMICHI_FEATURES = [
  { label: '歴史的な街並み', value: '馬車道は、開港期の西洋文化が色濃く残るレトロで落ち着いた街並みが特徴。夜も静かで上品な雰囲気が漂います。' },
  { label: '会員制ラウンジの多さ', value: '看板を出さない隠れ家的な会員制ラウンジや、落ち着いたクラブが多く、一見客よりも常連客が主流のエリアです。' },
  { label: '接待や会食後に最適', value: '周辺には高級料亭やフレンチ、鮨の名店が点在しており、会食後の二軒目として利用されることが多いのが馬車道のラウンジです。' }
];

const CABARET_DIFFERENCE = [
  { question: 'キャバクラとラウンジの違いは？', answer: 'キャバクラは時間制（セット料金）で明朗に計算され、指名制度が明確な反面、少し賑やかな傾向があります。ラウンジは時間制限制がない店も多く、ゆったりとくつろげる反面、料金システムが複雑な場合があります。' },
  { question: 'CLUB Animoはどちらですか？', answer: 'CLUB Animoは「キャバクラの明朗会計」と「高級ラウンジの落ち着いた雰囲気」を融合させた店舗です。馬車道から関内へ流れるお客様に、最高級の安らぎを提供しています。' },
];

export default function BashamichiLoungePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '馬車道ラウンジとは', item: 'https://club-animo.jp/about/bashamichi-lounge' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="About Bashamichi Lounge" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              馬車道ラウンジの特徴
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="馬車道の夜遊びの特徴"
              description="関内駅とみなとみらいエリアの間に位置する「馬車道」。このエリアの夜の特徴をご紹介します。"
              type="list"
              items={BASHAMICHI_FEATURES}
            />
          </FadeIn>

          <FadeIn>
            <GeoSchemaUI 
              title="キャバクラとラウンジの違い"
              type="qa"
              items={CABARET_DIFFERENCE}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              馬車道エリアでの優雅な時間をお過ごしになった後は、<br />
              ぜひCLUB Animoへお立ち寄りください。
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
