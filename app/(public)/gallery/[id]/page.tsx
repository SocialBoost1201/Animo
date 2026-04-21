import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPublicContents } from '@/lib/actions/public/data';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const allItems = await getPublicContents('gallery');
  const item = allItems.find((galleryItem: { id: string; title?: string; description?: string }) => galleryItem.id === params.id);

  return {
    title: item?.title ? `${item.title}｜ギャラリー` : 'ギャラリー',
    description: item?.description || 'CLUB Animo のギャラリー詳細ページです。',
    alternates: {
      canonical: `/gallery/${params.id}`,
    },
    openGraph: {
      url: `https://club-animo.jp/gallery/${params.id}`,
    },
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const allItems = await getPublicContents('gallery');
  const item = allItems.find((g: { id: string; image_url: string; title?: string; description?: string }) => g.id === params.id);

  if (!item) {
    notFound();
  }

  // 前後ナビゲーション
  const currentIndex = allItems.findIndex((g: { id: string }) => g.id === params.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#111] text-white pt-24 pb-32">
      {/* 閉じるボタン */}
      <div className="container mx-auto px-6 mb-8">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-serif luxury-tracking text-gray-400 hover:text-gold transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Gallery へ戻る
        </Link>
      </div>

      {/* メイン画像 */}
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <div className="overflow-hidden border border-white/10 mb-8">
            <PlaceholderImage
              src={item.image_url}
              ratio="4:3"
              alt={item.title || 'Gallery Image'}
              placeholderText={item.title || 'Gallery'}
              className="w-full"
            />
          </div>

          <div className="text-center mb-16">
            <h1 className="font-serif luxury-tracking-super text-2xl md:text-3xl text-white mb-4">
              <GsapRevealTitle text={item.title || 'Gallery'} />
            </h1>
            {item.description && (
              <p className="text-gray-400 font-serif luxury-tracking text-sm leading-[2.5] max-w-xl mx-auto">
                {item.description.split('\n').map((line: string, i: number) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            )}
          </div>
        </FadeIn>

        {/* 前後ナビ */}
        <div className="flex justify-between items-center border-t border-white/10 pt-8">
          {prevItem ? (
            <Link
              href={`/gallery/${prevItem.id}`}
              className="flex items-center gap-3 text-xs font-serif luxury-tracking text-gray-400 hover:text-gold transition-colors uppercase group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {prevItem.title || 'Prev'}
            </Link>
          ) : <span />}
          {nextItem ? (
            <Link
              href={`/gallery/${nextItem.id}`}
              className="flex items-center gap-3 text-xs font-serif luxury-tracking text-gray-400 hover:text-gold transition-colors uppercase group"
            >
              {nextItem.title || 'Next'}
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <span />}
        </div>

        {/* ギャラリー一覧に戻る */}
        <div className="mt-16 text-center">
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black">
            <Link href="/gallery" className="px-12 font-serif luxury-tracking text-xs uppercase">
              ギャラリー一覧へ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
