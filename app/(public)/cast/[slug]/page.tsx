import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { CalendarHeart } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // TODO: Fetch from Supabase
  const castName = slug.split('-')[0].charAt(0).toUpperCase() + slug.split('-')[0].slice(1);
  return {
    title: `${castName} | Cast | Club Animo`,
    description: `${castName}のプロフィール・出勤情報。Club Animo関内。`,
  };
}

export default async function CastDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params to resolve Next.js 15+ promise behavior
  const { slug } = await params;

  // Mock checking if the cast exists
  if (!slug) {
    notFound();
  }

  // Dummy Data
  const cast = {
    name: slug.split('-')[0].charAt(0).toUpperCase() + slug.split('-')[0].slice(1),
    age: 22,
    height: 162,
    hobby: 'カフェ巡り、映画鑑賞、ワイン',
    comment: '一緒に楽しい時間を過ごしましょう！お酒が大好きなので、たくさん乾杯できたら嬉しいです。',
    tags: ['清楚', 'お酒好き', '癒し系', 'ノリが良い'],
    imageUrl: null, // intentionally null to show placeholder
    isToday: true,
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen pb-32">
      {/* Breadcrumb equivalent */}
      <div className="container mx-auto px-6 py-6">
        <Link href="/cast" className="text-sm tracking-widest text-gray-500 hover:text-[var(--color-gold)] transition-colors uppercase">
          ← Back to Cast
        </Link>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Image Side */}
          <FadeIn direction="right" className="relative w-full sticky top-32">
            <div className="rounded-sm overflow-hidden shadow-lg border border-gray-100 p-2 bg-white">
              <div className="relative overflow-hidden rounded-sm">
                <PlaceholderImage 
                  src={cast.imageUrl} 
                  alt={cast.name} 
                  ratio="4:5" 
                  placeholderText={`${cast.name}'s Photo`}
                  className="w-full h-auto"
                  priority
                />
                {cast.isToday && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-[var(--color-gold)] text-white text-xs uppercase font-bold tracking-wider px-4 py-2 rounded-sm shadow-md flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      本日出勤
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Info Side */}
          <div className="py-4 md:py-12 flex flex-col h-full">
            <FadeIn direction="left" delay={0.2}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#171717] mb-2">
                <RevealText text={cast.name} />
              </h1>
              
              <div className="flex flex-wrap gap-2 mt-6 mb-10">
                {cast.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs tracking-wider text-[#171717] border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Profile Table */}
              <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-sm shadow-sm mb-10">
                <h3 className="font-serif text-[var(--color-gold)] text-xl tracking-widest uppercase mb-6 border-b border-gray-100 pb-4">
                  Profile
                </h3>
                <dl className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-4 items-center py-2 border-b border-gray-50">
                    <dt className="text-gray-500 text-sm tracking-widest uppercase">Age</dt>
                    <dd className="col-span-2 md:col-span-3 text-[#171717]">{cast.age}</dd>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 items-center py-2 border-b border-gray-50">
                    <dt className="text-gray-500 text-sm tracking-widest uppercase">Height</dt>
                    <dd className="col-span-2 md:col-span-3 text-[#171717]">{cast.height} cm</dd>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 items-start py-2 border-b border-gray-50">
                    <dt className="text-gray-500 text-sm tracking-widest uppercase pt-1">Hobby</dt>
                    <dd className="col-span-2 md:col-span-3 text-[#171717] leading-relaxed">{cast.hobby}</dd>
                  </div>
                </dl>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-gray-500 text-xs tracking-widest uppercase mb-4">Message</h4>
                  <p className="text-[#171717] leading-loose text-sm md:text-base font-sans">
                    {cast.comment}
                  </p>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="mb-12">
                <h3 className="font-serif text-[var(--color-gold)] text-xl tracking-widest uppercase mb-6 flex items-center gap-3">
                  Schedule
                  {cast.isToday && (
                    <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 font-sans rounded-sm tracking-normal">本日出勤予定があります</span>
                  )}
                </h3>
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const isWorkingRow = i % 2 === 0;
                    return (
                      <div key={day} className={`p-2 md:p-3 rounded-sm border ${isWorkingRow ? 'border-[var(--color-gold)]/30 bg-orange-50/30' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">{day}</div>
                        <div className={`text-xs md:text-sm font-bold ${isWorkingRow ? 'text-[var(--color-gold)]' : 'text-gray-400'}`}>
                          {isWorkingRow ? '20:00' : '休み'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Reserve CTA (Sticky bottom in mobile handled by layout) */}
              <div className="hidden md:block">
                <Button asChild size="lg" className="w-full text-lg tracking-widest">
                  <Link href={`/reserve?cast=${slug}`}>
                    <CalendarHeart className="w-5 h-5 mr-2" />
                    指名して予約する
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
