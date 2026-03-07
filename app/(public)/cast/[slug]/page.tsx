import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, CalendarHeart } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCastDetail(slug: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('casts')
    .select(`
      *,
      shifts (
        date,
        start_time,
        end_time
      )
    `)
    .eq('slug', slug)
    .eq('status', 'public')
    .single();

  if (error || !data) return null;

  // sort future shifts
  const today = new Date().toISOString().split('T')[0];
  const upcomingShifts = data.shifts
    .filter((s: any) => s.date >= today)
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
    .slice(0, 7); // Max 7 days

  return { ...data, upcomingShifts };
}

export default async function CastDetailPage({ params }: { params: { slug: string } }) {
  const cast = await getCastDetail(params.slug);

  if (!cast) {
    notFound();
  }

  return (
    <div className="bg-[var(--color-background)] min-h-screen pt-24 pb-[var(--spacing-section)] px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Link href="/cast" className="inline-flex items-center text-sm font-sans tracking-widest text-gray-400 hover:text-[var(--color-gold)] transition-colors">
            <ArrowLeft size={16} className="mr-2" /> CAST LIST
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-12 bg-white p-6 md:p-12 shadow-sm border border-gray-100 rounded-sm">
          {/* 左側: キャスト画像 */}
          <div className="w-full md:w-5/12 shrink-0">
            <FadeIn>
              <div className="relative rounded-sm overflow-hidden bg-gray-100">
                <PlaceholderImage 
                  src={cast.image_url}
                  alt={cast.name} 
                  ratio="4:5" 
                  placeholderText={cast.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 border border-black/5 pointer-events-none" />
                
                {cast.is_today && (
                  <div className="absolute top-4 left-4 bg-white/95 text-xs font-bold text-[var(--color-gold)] px-3 py-1.5 tracking-widest uppercase rounded-sm border border-[var(--color-gold)]/30 backdrop-blur-sm">
                    本日出勤
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* 右側: キャスト情報 */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <FadeIn delay={0.1}>
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-serif text-[#171717] mb-2">{cast.name}</h1>
                <p className="text-sm font-sans tracking-widest text-[var(--color-gold)] uppercase ml-1">{cast.slug}</p>
              </div>

              {/* スペック */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 pb-10 border-b border-gray-100 font-sans text-sm">
                <div className="flex items-center">
                  <span className="w-20 text-gray-400 tracking-widest uppercase text-xs">Age</span>
                  <span className="text-[#171717] font-bold">{cast.age ? `${cast.age}歳` : '-'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-400 tracking-widest uppercase text-xs">Height</span>
                  <span className="text-[#171717] font-bold">{cast.height ? `${cast.height}cm` : '-'}</span>
                </div>
                <div className="flex items-start col-span-2">
                  <span className="w-20 text-gray-400 tracking-widest uppercase text-xs pt-0.5">Hobby</span>
                  <span className="text-[#171717] leading-relaxed">{cast.hobby || '-'}</span>
                </div>
              </div>

              {/* メッセージ */}
              {cast.comment && (
                <div className="mb-12">
                  <h3 className="text-xs font-bold tracking-widest text-[#171717] uppercase mb-4 flex items-center gap-4">
                    Message
                    <div className="h-[1px] flex-1 bg-gray-100" />
                  </h3>
                  <p className="text-gray-600 font-serif leading-loose text-sm p-6 bg-[var(--color-gray-light)] relative">
                    <span className="absolute top-4 left-4 text-4xl text-[var(--color-gold)] opacity-20 leading-none">"</span>
                    <span className="relative z-10 whitespace-pre-wrap">{cast.comment}</span>
                  </p>
                </div>
              )}

              {/* 直近のシフト */}
              <div className="mb-10">
                <h3 className="text-xs font-bold tracking-widest text-[var(--color-gold)] uppercase mb-4 flex items-center gap-4">
                  Schedule
                  <div className="h-[1px] flex-1 bg-[var(--color-gold)]/20" />
                </h3>
                {cast.upcomingShifts && cast.upcomingShifts.length > 0 ? (
                  <ul className="space-y-2">
                    {cast.upcomingShifts.map((shift: any, i: number) => {
                      // format date MM/DD
                      const dateObj = new Date(shift.date);
                      const mmdd = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
                      const days = ['日', '月', '火', '水', '木', '金', '土'];
                      const dayStr = days[dateObj.getDay()];
                      const isToday = shift.date === new Date().toISOString().split('T')[0];

                      return (
                        <li key={i} className={`flex items-center text-sm ${isToday ? 'font-bold text-[#171717] bg-gray-50 -mx-3 px-3 py-1 rounded-sm' : 'text-gray-600'}`}>
                          <span className="w-20 tracking-wider">
                            {mmdd} ({dayStr})
                          </span>
                          <span>
                            {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                          </span>
                          {isToday && <span className="ml-3 text-[10px] text-[var(--color-gold)] border border-[var(--color-gold)] px-2 py-0.5 rounded-sm">本日</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">現在公開されている出勤予定はありません。</p>
                )}
              </div>

              {/* 予約導線 (クエリパラメータでキャスト名を渡す) */}
              <div>
                <Button asChild className="w-full font-bold tracking-widest text-sm py-6">
                  <Link href={`/reserve?cast=${encodeURIComponent(cast.name)}`}>
                    <CalendarHeart className="mr-2 w-5 h-5" />
                    指名してWEB予約
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
