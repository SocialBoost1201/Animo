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
  title: 'キャバクラ初心者ガイド｜初めての来店マナーと遊び方',
  description: '初めてキャバクラに行く方へ。入店からの流れ、料金体系、キャストとの会話のコツ、スマートな遊び方を丁寧に解説します。関内・馬車道でのナイトライフのスタートに。',
  openGraph: {
    title: 'キャバクラ初心者ガイド｜初めての来店マナーと遊び方',
    description: '初めてキャバクラに行く方へ。入店からの流れ、料金体系、キャストとの会話のコツ、スマートな遊び方。',
  
    images: ['/api/og?title=%E3%82%AD%E3%83%A3%E3%83%90%E3%82%AF%E3%83%A9%E5%88%9D%E5%BF%83%E8%80%85%E3%82%AC%E3%82%A4%E3%83%89%EF%BD%9C%E5%88%9D%E3%82%81%E3%81%A6%E3%81%AE%E6%9D%A5%E5%BA%97%E3%83%9E%E3%83%8A%E3%83%BC%E3%81%A8%E9%81%8A%E3%81%B3%E6%96%B9&category=Blog'],}
};

const BEGINNER_QA = [
  { question: '一人で行っても大丈夫ですか？', answer: 'はい、もちろん大丈夫です。CLUB Animoでも、お一人様で来店され、キャストとの会話をゆっくりと楽しまれるお客様が多数いらっしゃいます。' },
  { question: '予算はどのくらい用意すればいいですか？', answer: 'お店のセット料金（60分）に、キャストのドリンク代（1杯1,000円〜2,000円程度）とTAX（30%程度）が加わります。関内の高級店の場合、1時間15,000円〜20,000円程度を目安にされると安心です。' },
  { question: '服装に決まりはありますか？', answer: '明確なドレスコードはありませんが、短パンやサンダル、スウェット等のラフすぎる服装は避け、スマートカジュアル・ジャケットスタイルでご来店いただくと、よりお店の雰囲気となじみます。' }
];

export default function CabaretBeginnerPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <ArticleSchema 
        title="キャバクラ初心者ガイド｜初めての来店マナーと遊び方"
        description="初めてキャバクラに行く方へ。入店からの流れ、料金体系、キャストとの会話のコツ、スマートな遊び方を丁寧に解説します。関内・馬車道でのナイトライフのスタートに。"
        publishedAt="2024-03-01T00:00:00+09:00"
        updatedAt="2024-03-01T00:00:00+09:00"
      />
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: 'キャバクラ初心者ガイド', item: 'https://club-animo.com/blog/cabaret-beginner' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-3xl mb-6 luxury-tracking uppercase">
              <RevealText text="Cabaret Beginner's Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              キャバクラ初心者ガイド
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="初めてのキャバクラ Q&A"
              description="キャバクラデビューを考えている方の不安や疑問にお答えします。"
              type="qa"
              items={BEGINNER_QA}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              初めてのキャバクラ体験を最高の瞬間に。<br />
              明朗会計と優しいおもてなしのCLUB Animoがお待ちしております。
            </p>
            <Link 
              href="/guide" 
              className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
            >
              ご来店の流れを見る
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
