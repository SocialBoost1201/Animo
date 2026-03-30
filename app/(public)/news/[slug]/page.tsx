import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getNewsDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .eq('type', 'news')
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = await getNewsDetail(params.slug);

  if (!news) {
    return {
      title: 'お知らせ',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${news.title}｜お知らせ`,
    description: news.description || 'CLUB Animoのお知らせページです。',
    alternates: {
      canonical: `/news/${news.id}`,
    },
    openGraph: {
      url: `https://club-animo.jp/news/${news.id}`,
      title: news.title,
      description: news.description || 'CLUB Animoのお知らせページです。',
      type: 'article',
    },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsDetail(params.slug);

  if (!news) {
    notFound();
  }

  const dateStr = new Date(news.created_at).toISOString().split('T')[0].replace(/-/g, '.');

  return (
    <div className="bg-background min-h-screen pt-24 pb-[var(--spacing-section)] px-6 text-[#171717]">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/news" className="inline-flex items-center text-sm font-sans tracking-widest text-gray-400 hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" /> NEWS INDEX
          </Link>
        </div>

        <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
          <div className="mb-8 pb-8 border-b border-gray-100 text-center">
            <span className="block text-sm font-sans tracking-widest text-gray-400 mb-4">{dateStr}</span>
            <h1 className="text-2xl md:text-3xl font-serif leading-relaxed text-[#171717]">{news.title}</h1>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-loose prose-a:text-gold text-gray-600 font-sans whitespace-pre-wrap">
            {news.description || '詳細な内容はありません。'}
          </div>

          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="px-12">
              <Link href="/news">一覧に戻る</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
