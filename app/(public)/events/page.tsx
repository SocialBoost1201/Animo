import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { StaggerList } from '@/components/motion/StaggerList';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export const metadata = {
  title: 'Events | Club Animo',
  description: 'Club Animoで開催される特別イベントやパーティー情報をご案内します。',
};

const EVENTS_DATA = [
  { id: '1', title: '【Nanami】バースデーイベント開催！', date: '2023.12.24 - 12.25', description: '当店No.1キャスト「Nanami」のバースデーイベントを2日間に渡り開催いたします。特別なドレスとシャンパンで最高の一夜を。' },
  { id: '2', title: 'Halloween Party 2023', date: '2023.10.28 - 10.31', description: '毎年恒例のハロウィンパーティー！キャスト全員が個性豊かなコスプレでお出迎えいたします。仮装してご来店のお客様には特典をご用意しております。' },
  { id: '3', title: 'Grand Open 1st Anniversary', date: '2023.10.01', description: '皆様のおかげでClub Animoは1周年を迎えます。感謝の気持ちを込めて、当日は全ボトル20%OFFの特別還元祭を実施いたします。' },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Events" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              イベント情報
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {EVENTS_DATA.map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group block bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden"
              >
                <div className="relative overflow-hidden w-full h-48 sm:h-56">
                  <PlaceholderImage 
                    ratio="16:9" 
                    alt={event.title} 
                    placeholderText={'Event Image'} 
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-0 left-0 bg-[#171717] text-white px-3 py-1.5 m-4 text-xs tracking-wider font-sans shadow-md">
                    EVENT
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <span className="text-[var(--color-gold)] font-bold tracking-widest text-xs md:text-sm mb-3">
                    {event.date}
                  </span>
                  <h3 className="text-[#171717] font-serif text-lg md:text-xl mb-4 leading-relaxed group-hover:text-[var(--color-gold)] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-loose line-clamp-3 mt-auto font-sans">
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </StaggerList>
        </div>
      </section>
    </div>
  );
}
