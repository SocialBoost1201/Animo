import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { getPublicContents } from '@/lib/actions/public/data';
import { ArrowRight, Calendar } from 'lucide-react';

export default async function EventsPage() {
  const eventItems = await getPublicContents('event');

  return (
    <div className="bg-[var(--color-gray-light)] min-h-screen pt-24 pb-[var(--spacing-section)] px-6">
      <div className="container mx-auto max-w-4xl">
        <FadeIn className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#171717] uppercase mb-4">
            Events
          </h1>
          <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-6" />
          <p className="text-sm text-gray-500 font-sans tracking-wide">
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
                  <div className="flex flex-col md:flex-row bg-white hover:bg-gray-50 p-6 md:p-8 rounded-sm shadow-sm transition-colors border border-gray-100">
                    <div className="shrink-0 mb-4 md:mb-0 md:mr-8 text-sm font-sans tracking-widest text-[#171717] w-48 flex items-center">
                      <Calendar size={16} className="mr-2 text-[var(--color-gold)]" />
                      {eventDateStr ? `${eventDateStr} 開催` : '開催日未定'}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#171717] mb-3 group-hover:text-[var(--color-gold)] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm tracking-wide leading-loose text-gray-600 line-clamp-2 font-sans">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="shrink-0 flex items-center mt-4 md:mt-0 text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity md:-translate-x-4 group-hover:translate-x-0 duration-300">
                       <ArrowRight size={20} />
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
