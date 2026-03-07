import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { getPublicCasts } from '@/lib/actions/public/data';

export const dynamic = 'force-dynamic';

// サーバーコンポーネントとしてキャスト一覧を取得
export default async function CastPage() {
  const casts = await getPublicCasts();

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto relative z-10">
        <FadeIn className="text-center mb-24">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Cast
          </h1>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-[var(--color-gold)] font-serif luxury-tracking uppercase">
            個性豊かな上質空間を彩るキャストたち。<br />
            （本日の出勤キャストを優先して表示しています）
          </p>
        </FadeIn>

        {/* キャストグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {casts.map((cast, index) => (
            <FadeIn key={cast.id} delay={index * 0.05} className="group relative">
              <Link href={`/cast/${cast.id}`} className="block">

                <div className="overflow-hidden bg-white shadow-luxury hover:shadow-luxury-hover transition-all duration-1000 group-hover:-translate-y-1">
                  <div className="relative">
                    <PlaceholderImage 
                      src={cast.image_url}
                      alt={cast.stage_name} 
                      ratio="4:5" 
                      placeholderText={cast.stage_name}
                      className="group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                  </div>
                  <div className="p-6 md:p-8 text-center bg-white relative z-10 border-t border-gray-50">
                    <h3 className="font-serif luxury-tracking text-lg md:text-xl text-[#171717]">{cast.stage_name}</h3>
                    <div className="flex justify-center items-center mt-3 gap-2 text-[10px] text-gray-400 font-serif luxury-tracking">
                      {cast.age && <span>{cast.age}歳</span>}
                    </div>
                    {cast.hobby && (
                      <p className="text-[10px] text-gray-400 mt-2 font-serif luxury-tracking line-clamp-1">
                        趣味: {cast.hobby}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
          
          {casts.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              キャスト情報がまだ登録されていません。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
