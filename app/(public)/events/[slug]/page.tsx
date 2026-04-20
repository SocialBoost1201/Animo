import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getEventDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contents')
    .select('id, title, description, content_date, created_at')
    .eq('id', id)
    .eq('type', 'event')
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEventDetail(params.slug);

  if (!event) {
    return {
      title: 'イベント',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${event.title}｜イベント`,
    description: event.description || 'CLUB Animoのイベント情報ページです。',
    alternates: {
      canonical: `/events/${event.id}`,
    },
    openGraph: {
      url: `https://club-animo.jp/events/${event.id}`,
      title: event.title,
      description: event.description || 'CLUB Animoのイベント情報ページです。',
      type: 'article',
    },
  };
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventDetail(params.slug);

  if (!event) {
    notFound();
  }

  const eventDateStr = event.content_date 
    ? new Date(event.content_date).toISOString().split('T')[0].replace(/-/g, '/') 
    : '';

  return (
    <div className="bg-background min-h-screen pt-24 pb-[var(--spacing-section)] px-6 text-[#171717]">
      <div className="container mx-auto max-w-3xl">
         <div className="mb-8">
          <Link href="/events" className="inline-flex items-center text-sm font-sans tracking-widest text-gray-400 hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" /> EVENT INDEX
          </Link>
        </div>

        <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
          <div className="mb-8 pb-8 border-b border-gray-100 text-center">
             {eventDateStr && (
              <span className="inline-flex items-center justify-center text-sm font-sans tracking-widest text-[#171717] mb-4 bg-gray-50 px-4 py-1.5 rounded-sm">
                <Calendar size={14} className="mr-2 text-gold" />
                {eventDateStr} 開催
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-serif leading-relaxed text-[#171717]">{event.title}</h1>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-loose prose-a:text-gold text-gray-600 font-sans whitespace-pre-wrap">
            {event.description || '詳細な内容はありません。'}
          </div>

          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="px-12">
              <Link href="/events">一覧に戻る</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
