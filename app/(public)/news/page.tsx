import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { StaggerList } from '@/components/motion/StaggerList';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export const metadata = {
  title: 'News | Club Animo',
  description: 'Club Animoからの最新のお知らせやご案内を掲載しています。',
};

const NEWS_DATA = [
  { id: '1', title: '【重要】年末年始の営業について', date: '2023.12.15', category: 'Information' },
  { id: '2', title: '新人キャスト「Nanami」が入店しました', date: '2023.12.01', category: 'Cast' },
  { id: '3', title: 'システム料金改定のお知らせ', date: '2023.11.20', category: 'Information' },
  { id: '4', title: 'グランドオープン1周年のお知らせ', date: '2023.10.01', category: 'Information' },
  { id: '5', title: '秋の特別ワインフェア開催中', date: '2023.09.15', category: 'Event' },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="News" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              お知らせ
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <StaggerList className="flex flex-col gap-4">
            {NEWS_DATA.map((news) => (
              <Link 
                key={news.id} 
                href={`/news/${news.id}`}
                className="group block bg-white p-6 md:p-8 border border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-gray-500 font-sans tracking-wider text-sm">{news.date}</span>
                    <span className="text-[10px] uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded-sm">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-[#171717] font-serif md:text-lg group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 leading-relaxed">
                    {news.title}
                  </h3>
                </div>
              </Link>
            ))}
          </StaggerList>

          <FadeIn delay={0.4} className="mt-12 flex justify-center">
             <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-[#171717] hover:border-[#171717] transition-colors rounded-sm" disabled>
                  &lt;
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-[#171717] bg-[#171717] text-white transition-colors rounded-sm">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:text-[#171717] hover:border-[#171717] transition-colors rounded-sm">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-[#171717] hover:border-[#171717] transition-colors rounded-sm">
                  &gt;
                </button>
             </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
