import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { getPublicContents } from '@/lib/actions/public/data';
import { ArrowRight, Calendar } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/events',
  },
};

export default async function EventsPage() {
  const eventItems = await getPublicContents('event');

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto max-w-4xl relative z-10">
        <FadeIn className="text-center mb-24">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Events
          </h1>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-gold font-serif luxury-tracking uppercase">
            店舗イベント情報
          </p>
        </FadeIn>

        <div className="space-y-6">
          {eventItems.map((item, index) => {
            const eventDateStr = item.content_date 
              ? new Date(item.content_date).toISOString().split('T')[0].replace(/-/g, '/') 
              : '';
            
            return (
              <FadeIn key={item.id} delay={index * 0.05} className="group cursor-pointer">
                {/* IDベースの詳細ページを開く */}
                <Link href={`/events/${item.id}`} className="block">
                  <div className="flex flex-col md:flex-row bg-white hover:bg-gray-50/30 p-8 md:p-12 shadow-luxury transition-all duration-700 border border-gold/20 hover:-translate-y-1">
                    <div className="shrink-0 mb-6 md:mb-0 md:mr-12 text-xs font-serif luxury-tracking text-[#171717] w-48 flex items-center md:pt-1">
                      <Calendar size={14} className="mr-3 text-gold opacity-70" />
                      {eventDateStr ? `${eventDateStr} 開催` : '開催日未定'}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-serif luxury-tracking text-[#171717] mb-4 group-hover:text-gold transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs font-serif luxury-tracking leading-[2.5] text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="shrink-0 flex items-center mt-6 md:mt-0 text-gold opacity-0 group-hover:opacity-100 transition-all md:-translate-x-4 group-hover:translate-x-0 duration-700">
                       <ArrowRight size={20} className="font-light" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}

           {eventItems.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              現在予定されているイベントはありません。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
