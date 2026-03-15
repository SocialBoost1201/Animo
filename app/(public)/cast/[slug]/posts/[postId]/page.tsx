import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { FadeIn } from '@/components/motion/FadeIn';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; postId: string }> }) {
  const { slug, postId } = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from('cast_posts')
    .select('*, casts(name, stage_name)')
    .eq('id', postId)
    .single();

  if (!post) {
    return { title: 'Not Found' };
  }

  const castName = post.casts?.stage_name || post.casts?.name;
  const title = `${castName} | キャスト日記 | Club Animo 関内キャバクラ`;
  const description = post.content.substring(0, 100) + '...';

  return {
    title,
    description,
    openGraph: {
      title: `${castName}の日記 | Club Animo`,
      description,
      images: [post.image_url],
    },
  };
}

export default async function CastPostDetailPage({ params }: { params: Promise<{ slug: string; postId: string }> }) {
  const { slug, postId } = await params;
  const supabase = await createClient();

  // postIdで投稿を取得
  const { data: post, error } = await supabase
    .from('cast_posts')
    .select('*, casts(id, name, stage_name, slug, image_url)')
    .eq('id', postId)
    .single();

  if (error || !post) {
    notFound();
  }

  // もしURLのslugと実際のキャストslugが一致しなければ404
  if (post.casts.slug !== slug) {
    notFound();
  }

  const cast = post.casts;
  const dateStr = new Date(post.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // JSON-LD Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cast.stage_name}の投稿`,
    image: [post.image_url],
    datePublished: new Date(post.created_at).toISOString(),
    author: {
      '@type': 'Person',
      name: cast.stage_name || cast.name,
      url: `https://club-animo.com/cast/${cast.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'CLUB Animo (クラブ アニモ)',
      url: 'https://club-animo.com'
    },
    description: post.content,
  };

  return (
    <div className="bg-[#f9f7f4] min-h-screen pt-32 pb-section px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href={`/cast/${cast.slug}`} className="inline-flex items-center text-sm font-sans tracking-widest text-gray-500 hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" /> {cast.stage_name}のプロフィールへ戻る
          </Link>
        </div>

        <FadeIn>
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-50">
              <Link href={`/cast/${cast.slug}`} className="shrink-0 block w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                {cast.image_url ? (
                  <Image src={cast.image_url} alt={cast.stage_name} fill className="object-cover" />
                ) : (
                  <User className="absolute inset-0 m-auto text-gray-300 w-5 h-5" />
                )}
              </Link>
              <div>
                <Link href={`/cast/${cast.slug}`} className="font-serif font-bold text-[#171717] hover:underline hover:text-gold transition-colors">
                  {cast.stage_name}
                </Link>
                <div className="text-[10px] text-gray-400 font-mono">
                  {dateStr}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-4/5 bg-gray-900">
              <Image 
                src={post.image_url} 
                alt="Post image" 
                fill 
                className="object-contain"
                priority
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm md:text-base text-gray-700 leading-loose wrap-break-word whitespace-pre-wrap font-serif">
                {post.content}
              </p>
              
              {/* 自動付与タグ (SEO対策) */}
              <div className="mt-8 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                <span className="text-[10px] tracking-widest text-gold bg-gold/5 px-2 py-1">関内キャバクラ</span>
                <span className="text-[10px] tracking-widest text-gold bg-gold/5 px-2 py-1">横浜キャバクラ</span>
                <span className="text-[10px] tracking-widest text-gold bg-gold/5 px-2 py-1">Club Animo</span>
                <span className="text-[10px] tracking-widest text-[#171717] bg-gray-50 px-2 py-1">#{cast.stage_name}</span>
              </div>
            </div>
          </article>
        </FadeIn>
      </div>
    </div>
  );
}
