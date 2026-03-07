import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { CastFavoriteButton } from '@/components/features/system/CastFavoriteButton';
import Link from 'next/link';
import { ArrowLeft, CalendarHeart } from 'lucide-react';
import { getPublicCastBySlug } from '@/lib/actions/public/data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CastDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cast = await getPublicCastBySlug(slug);

  if (!cast) notFound();

  // 代表画像取得
  const primaryImage = cast.cast_images?.find((img: any) => img.is_primary) || cast.cast_images?.[0];
  const subImages = cast.cast_images?.filter((img: any) => !img.is_primary) || [];
  const tags = cast.cast_tag_relations?.map((r: any) => r.cast_tags).filter(Boolean) || [];

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
                  src={primaryImage?.image_url}
                  alt={cast.stage_name}
                  ratio="4:5"
                  placeholderText={cast.stage_name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4 z-20">
                  <CastFavoriteButton castId={cast.id} className="w-10 h-10 shadow-md" />
                </div>
              </div>
              {/* サブ画像 */}
              {subImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {subImages.slice(0, 3).map((img: any, i: number) => (
                    <div key={i} className="rounded-sm overflow-hidden bg-gray-100">
                      <PlaceholderImage src={img.image_url} alt={`${cast.stage_name} ${i + 2}`} ratio="square" placeholderText="" />
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>

          {/* 右側: キャスト情報 */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <FadeIn delay={0.1}>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-serif text-[#171717] mb-2">{cast.stage_name}</h1>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag: any) => (
                      <span key={tag.id} className="text-[10px] font-serif tracking-widest text-[var(--color-gold)] border border-[var(--color-gold)]/40 px-3 py-1">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* スペック */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-gray-100 text-sm">
                <div className="flex items-center">
                  <span className="w-20 text-gray-400 tracking-widest uppercase text-xs">Age</span>
                  <span className="text-[#171717] font-bold">{cast.age ? `${cast.age}歳` : '-'}</span>
                </div>
                {cast.hobby && (
                  <div className="flex items-start col-span-2">
                    <span className="w-20 text-gray-400 tracking-widest uppercase text-xs pt-0.5">Hobby</span>
                    <span className="text-[#171717] leading-relaxed">{cast.hobby}</span>
                  </div>
                )}
              </div>

              {/* メッセージ */}
              {cast.comment && (
                <div className="mb-10">
                  <h3 className="text-xs font-bold tracking-widest text-[#171717] uppercase mb-4 flex items-center gap-4">
                    Message <div className="h-[1px] flex-1 bg-gray-100" />
                  </h3>
                  <p className="text-gray-600 font-serif leading-loose text-sm p-6 bg-[var(--color-gray-light)] relative">
                    <span className="absolute top-4 left-4 text-4xl text-[var(--color-gold)] opacity-20 leading-none">&ldquo;</span>
                    <span className="relative z-10 whitespace-pre-wrap">{cast.comment}</span>
                  </p>
                </div>
              )}

              {/* 直近のスケジュール */}
              <div className="mb-10">
                <h3 className="text-xs font-bold tracking-widest text-[var(--color-gold)] uppercase mb-4 flex items-center gap-4">
                  Schedule <div className="h-[1px] flex-1 bg-[var(--color-gold)]/20" />
                </h3>
                {cast.upcomingSchedules?.length > 0 ? (
                  <ul className="space-y-2">
                    {cast.upcomingSchedules.map((schedule: any, i: number) => {
                      const dateObj = new Date(schedule.work_date + 'T00:00:00+09:00');
                      const mmdd = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
                      const days = ['日', '月', '火', '水', '木', '金', '土'];
                      const dayStr = days[dateObj.getDay()];
                      const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
                      const isToday = schedule.work_date === today;
                      const startTime = schedule.start_time?.slice(0, 5) || '21:00';
                      const endTime = schedule.end_time?.slice(0, 5) || 'LAST';

                      return (
                        <li key={i} className={`flex items-center text-sm ${isToday ? 'font-bold text-[#171717] bg-gray-50 -mx-3 px-3 py-1 rounded-sm' : 'text-gray-600'}`}>
                          <span className="w-20 tracking-wider">{mmdd} ({dayStr})</span>
                          <span>{startTime} - {endTime}</span>
                          {isToday && <span className="ml-3 text-[10px] text-[var(--color-gold)] border border-[var(--color-gold)] px-2 py-0.5 rounded-sm">本日</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">現在公開されている出勤予定はありません。</p>
                )}
              </div>

              <Button asChild className="w-full font-bold tracking-widest text-sm py-6">
                <Link href={`/reserve?cast=${encodeURIComponent(cast.stage_name)}`}>
                  <CalendarHeart className="mr-2 w-5 h-5" />
                  指名してWEB予約
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
