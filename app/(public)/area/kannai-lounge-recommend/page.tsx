import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '関内ラウンジおすすめ・人気の高級店｜CLUB Animo',
  description: '関内・馬車道エリアで人気の高級ラウンジ・優良キャバクラを探している方へおすすめ。接待や大切な会食後に利用されるワンランク上の店舗選びのポイントをご紹介。',
};

const RECOMMENDED_POINTS = [
  { label: '安心の明朗会計', value: 'セット料金にTAX・サービス料のみの完全明朗会計。初めてのお客様でも安心してボトルやシャンパンを楽しめます。' },
  { label: '充実の個室・VIPルーム', value: '接待に使いやすいカーテンルームやVIPソファ席を完備。周囲を気にせずゆったりとした時間が過ごます。' },
  { label: '質の高いキャスト', value: '落ち着いた大人の女性から、会話を楽しむ洗練された女性まで、トップクラスのキャストが揃っています。' }
];

export default function KannaiLoungeRecommendPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '関内ラウンジおすすめ', item: 'https://club-animo.jp/area/kannai-lounge-recommend' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="Kannai Lounge Recommend" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内ラウンジおすすめの理由
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="関内のラウンジ・キャバクラ選びのポイント"
              description="大切なお客様の接待や、特別な日の夜。関内で「絶対に外さない」お店を選ぶための基準です。"
              type="list"
              items={RECOMMENDED_POINTS}
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
