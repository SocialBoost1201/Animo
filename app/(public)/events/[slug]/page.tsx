import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Event Detail | Club Animo`,
    description: `Club Animoのイベント詳細ページです。`,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      {/* Hero / Cover */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center">
        <PlaceholderImage 
          ratio="16:9" 
          alt="Event Hero" 
          placeholderText="Event Poster" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </section>

      <section className="container mx-auto px-6 -mt-20 relative z-10 max-w-4xl">
        <FadeIn className="bg-white p-8 md:p-12 shadow-md border border-gray-100 rounded-sm">
          <div className="mb-6">
             <Link href="/events" className="text-sm tracking-widest text-gray-400 hover:text-[var(--color-gold)] transition-colors uppercase">
              ← Back to Events
            </Link>
          </div>
          
          <div className="mb-8 border-b border-gray-100 pb-8">
            <span className="text-[var(--color-gold)] font-bold tracking-widest text-sm mb-3 block">
              2023.12.24 - 12.25
            </span>
            <h1 className="text-[#171717] font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              イベントタイトルがここに入力されます
            </h1>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none font-sans text-gray-700 leading-loose">
            <p>
              イベントの詳細な説明文がここに入ります。管理画面（CMS）から登録した内容が反映されます。<br />
              当日は限定ボトルの割引や特別なノベルティなどをご用意しております。
            </p>
            <PlaceholderImage ratio="3:2" alt="Event preview" placeholderText="Event Detail" className="my-8 rounded-sm mx-auto max-w-2xl" />
            <p>
              皆様のご来店をキャスト・スタッフ一同、心よりお待ち申し上げております。
            </p>
          </div>
          
        </FadeIn>
        
        <div className="mt-12 text-center">
            <Link href="/events" className="inline-block border border-[#171717] text-[#171717] px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#171717] hover:text-white transition-colors rounded-sm">
              イベント一覧へ戻る
            </Link>
        </div>
      </section>
    </div>
  );
}
