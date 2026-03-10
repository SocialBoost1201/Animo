import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SystemPriceGrid } from '@/components/features/system/SystemPriceGrid';

export const metadata: Metadata = {
  title: 'キャバクラ料金ガイド・相場｜関内キャバクラ CLUB Animo',
  description: '関内のキャバクラ「CLUB Animo」の料金ガイド。関内・馬車道エリアのキャバクラ料金相場との比較や、明朗会計のシステムについて分かりやすく解説します。',
};

const PRICE_FAQS = [
  { question: '関内のキャバクラの料金相場は？', answer: '関内エリアの高級店の相場は、1セット（60分）¥8,000〜¥12,000程度です。CLUB Animoでは、質の高いサービスを提供しながらも、Member ¥6,000 / Visitor ¥7,000と通いやすい料金設定を実現しています。' },
  { question: 'CLUB Animoの料金システムは？', answer: 'CLUB Animoは「完全明朗会計」です。セット料金に加え、指名料・延長料・キャストドリンク代などが加算され、最後にTAX・サービス料（30%）がかかります。事前のご説明がない不明瞭な請求は一切ございません。' },
];

const KANNAI_MARKET_COMPARE = [
  { label: '関内相場（高級店）', value: '1セット ¥8,000〜¥12,000' },
  { label: 'CLUB Animo（Visitor）', value: '1セット ¥7,000' },
  { label: 'CLUB Animo（Member）', value: '1セット ¥6,000' },
];

export default function PriceGuidePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: 'SYSTEM', item: 'https://club-animo.com/system' },
        { name: '料金ガイド', item: 'https://club-animo.com/guide/price' }
      ]} />
      <FAQSchema faqs={PRICE_FAQS} />

      {/* Header */}
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="Price Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内キャバクラ 料金ガイド
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <p className="text-sm md:text-base leading-[2.5] text-gray-400 font-serif luxury-tracking">
              「初めて行くキャバクラで料金が不安…」<br />
              そんなお客様にも安心してお楽しみいただけるよう、<br />
              関内エリアの相場比較と、CLUB Animoの明朗な料金システムをご案内します。
            </p>
          </FadeIn>

          <GeoSchemaUI 
            title="関内キャバクラの料金相場"
            description="関内・馬車道エリアの平均的な相場とCLUB Animoの料金の比較です。"
            type="table"
            items={KANNAI_MARKET_COMPARE}
            className="mb-16"
          />

          <GeoSchemaUI 
            title="よくある料金の疑問"
            type="qa"
            items={PRICE_FAQS}
            className="mb-16"
          />
        </div>
      </section>

      {/* System Price Grid */}
      <section className="py-8 px-6">
        <FadeIn className="container mx-auto">
          <h2 className="text-2xl font-serif text-center mb-10 text-foreground luxury-tracking uppercase">System Details</h2>
          <SystemPriceGrid />
        </FadeIn>
      </section>
    </div>
  );
}
