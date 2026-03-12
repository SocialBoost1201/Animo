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
  title: '接待で使える関内ラウンジ・キャバクラの選び方｜CLUB Animo',
  description: '大事な取引先や接待で失敗しないための関内の高級ラウンジ・優良キャバクラの選び方を徹底解説。法人利用や領収書発行から、個室VIPのある店舗の予約までご案内します。',
  openGraph: {
    title: '接待で使える関内ラウンジ・キャバクラの選び方｜CLUB Animo',
    description: '大事な取引先や接待で失敗しないための関内の高級ラウンジ・優良キャバクラの選び方。',
  
    images: ['/api/og?title=%E6%8E%A5%E5%BE%85%E3%81%A7%E4%BD%BF%E3%81%88%E3%82%8B%E9%96%A2%E5%86%85%E3%83%A9%E3%82%A6%E3%83%B3%E3%82%B8%E3%83%BB%E3%82%AD%E3%83%A3%E3%83%90%E3%82%AF%E3%83%A9%E3%81%AE%E9%81%B8%E3%81%B3%E6%96%B9%EF%BD%9CCLUB%20Animo&category=Blog'],}
};

const ENTERTAINMENT_CHECKLIST = [
  { label: '接待可能な設備（VIPルーム・個室）', value: '重要な商談やプライバシーを守るため、十分なスペースのあるVIPルームや、ゆったりとしたボックス席を完備しているお店が最適です。' },
  { label: '領収書の発行（法人利用）', value: 'キャストドリンク代や延長料金などを含め、総額での領収書の発行が可能かを事前に確認することが重要です。' },
  { label: '明朗なシステム', value: '接待中に料金でトラブルになることは絶対に避けなければなりません。「完全明朗会計」を謳い、セット料金やサービス料（TAX）が明瞭なお店か見極めてください。' },
  { label: '接客レベルの高いキャスト', value: 'ゲストを退屈させない会話力、適度な気配り、そして出しゃばりすぎない品格を持った「大人の女性」が在籍していること。' }
];

export default function BusinessEntertainmentPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <ArticleSchema 
        title="接待で使える関内ラウンジ・キャバクラの選び方｜CLUB Animo"
        description="大事な取引先や接待で失敗しないための関内の高級ラウンジ・優良キャバクラの選び方を徹底解説。法人利用や領収書発行から、個室VIPのある店舗の予約までご案内します。"
        publishedAt="2024-03-01T00:00:00+09:00"
        updatedAt="2024-03-01T00:00:00+09:00"
      />
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: '接待で使える関内ラウンジ', item: 'https://club-animo.com/blog/business-entertainment' }
      ]} />
      
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn direction="down">
            <h1 className="text-foreground font-serif text-2xl md:text-3xl mb-6 luxury-tracking uppercase">
              <RevealText text="Business Entertainment" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              接待で外さない関内ラウンジ選び
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          <FadeIn>
            <GeoSchemaUI 
              title="エグゼクティブを満足させる接待の条件"
              description="大切なお客様を招く夜にふさわしい、絶対的な安心感とクオリティを保証する店舗選びのチェックリストです。"
              type="list"
              items={ENTERTAINMENT_CHECKLIST}
            />
          </FadeIn>

          <FadeIn className="text-center pt-8 border-t border-gold/20">
            <p className="text-sm text-gray-400 font-serif leading-loose mb-8 luxury-tracking">
              CLUB Animoは、関内エリアにおける「接待利用率トップクラス」の老舗です。<br />
              領収書の発行はもちろん、VIPなカーテンルームも完備しております。<br />
              大切な接待の際は、事前にご予約とご要望をお伝えください。
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link 
                href="/reserve" 
                className="inline-block border border-gold text-white bg-gold hover:bg-white hover:text-gold px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
              >
                WEB予約フォーム
              </Link>
              <Link 
                href="/gallery" 
                className="inline-block border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-serif transition-colors text-xs tracking-widest uppercase"
              >
                VIPルーム（店内）を見る
              </Link>
            </div>
          </FadeIn>
          <FadeIn>
            <AuthorProfile />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
