import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `News Detail | Club Animo`,
    description: `Club Animoのお知らせ詳細ページです。`,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <div className="mb-4">
             <Link href="/news" className="text-sm tracking-widest text-gray-500 hover:text-[var(--color-gold)] transition-colors uppercase">
              ← Back to News
            </Link>
          </div>
          <FadeIn direction="down">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-500 font-sans tracking-wider text-sm">2023.12.01</span>
              <span className="text-[10px] uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded-sm">
                Information
              </span>
            </div>
            <h1 className="text-[#171717] font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              ニュース・お知らせタイトルがここに入ります（ダミー）
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn delay={0.2} className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
            <div className="prose prose-sm md:prose-base max-w-none font-sans text-gray-700 leading-loose">
              <p>
                平素は格別のお引き立てを賜り、厚く御礼申し上げます。<br />
                Club Animoより、お客様へ大切なお知らせがございます。
              </p>
              <PlaceholderImage ratio="16:9" alt="News placeholder" placeholderText="Article Image" className="my-8 rounded-sm" />
              <p>
                ここにニュースの本文が入ります。CMSが導入された後、管理画面から入力されたリッチテキスト（HTML等）が展開される予定です。
                現状はダミーコンテンツとして表示しております。
              </p>
            </div>
          </FadeIn>
          
          <div className="mt-12 text-center">
             <Link href="/news" className="inline-block border border-[#171717] text-[#171717] px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#171717] hover:text-white transition-colors rounded-sm">
               お知らせ一覧へ戻る
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
