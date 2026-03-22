import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GeoSchemaUI } from '@/components/seo/GeoSchemaUI';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '関内キャバクラ徹底比較・CLUB Animoの強み｜関内キャバクラ',
  description: '横浜・関内エリアのキャバクラ選びに迷っている方へ。関内のキャバクラ相場、接客レベル、雰囲気の違いを徹底比較。落ち着いた高級店「CLUB Animo」の強みを解説します。',
  openGraph: {
    title: '関内キャバクラ徹底比較・CLUB Animoの強み｜関内キャバクラ',
    description: '関内エリアのキャバクラ相場、接客レベル、雰囲気の違いを徹底比較。',
  
    images: ['/api/og?title=%E9%96%A2%E5%86%85%E3%82%AD%E3%83%A3%E3%83%90%E3%82%AF%E3%83%A9%E5%BE%B9%E5%BA%95%E6%AF%94%E8%BC%83%E3%83%BBCLUB%20Animo%E3%81%AE%E5%BC%B7%E3%81%BF%EF%BD%9C%E9%96%A2%E5%86%85%E3%82%AD%E3%83%A3%E3%83%90%E3%82%AF%E3%83%A9&category=Area Info'],}
};

const KANNAI_COMPARE_TABLE = [
  { label: '関内 大衆キャバクラ', value: 'セット ¥4,000〜 / 20代前半のキャスト多め。賑やかな雰囲気。' },
  { label: '関内 高級キャバクラ（平均）', value: 'セット ¥8,000〜 / 落ち着いたサービス、接待利用が多い。' },
  { label: 'CLUB Animo（当店舗）', value: 'セット ¥7,000（Member ¥6,000） / 関内最高峰のキャストと広々とした高級感あふれる内装。圧倒的コストパフォーマンス。' },
];

export default function KannaiComparePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: '関内キャバクラ比較', item: 'https://club-animo.jp/area/kannai-compare' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-4xl mb-6 luxury-tracking uppercase">
              <RevealText text="Cabaret Comparison" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              関内キャバクラ比較
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="関内のキャバクラ業態比較"
              description="関内エリアには様々なコンセプトのキャバクラが混在しています。目的別にお店を選ぶ参考にしてください。"
              type="table"
              items={KANNAI_COMPARE_TABLE}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              「価格以上の高級感と安心の明朗会計」をお約束します。<br />
              関内でのキャバクラ選びに迷ったら、CLUB Animoをご指名ください。
            </p>
            <Link 
              href="/system" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              料金システムを見る
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
