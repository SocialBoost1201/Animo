import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { getPublicCasts } from '@/lib/actions/public/data';

// サーバーコンポーネントとしてキャスト一覧を取得
export default async function CastPage() {
  const casts = await getPublicCasts();

  return (
    <div className="bg-[var(--color-background)] min-h-screen pt-24 pb-[var(--spacing-section)] px-6">
      <div className="container mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#171717] uppercase mb-4">
            Cast
          </h1>
          <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-6" />
          <p className="text-sm text-gray-500 font-sans tracking-wide">
            個性豊かな上質空間を彩るキャストたち。<br />
            （本日の出勤キャストを優先して表示しています）
          </p>
        </FadeIn>

        {/* キャストグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {casts.map((cast, index) => (
            <FadeIn key={cast.id} delay={index * 0.05} className="group relative">
              <Link href={`/cast/${cast.slug}`} className="block">
                <div className="overflow-hidden bg-white shadow-sm group-hover:shadow-xl transition-all duration-500 rounded-sm">
                  <div className="relative">
                    <PlaceholderImage 
                      src={cast.image_url}
                      alt={cast.name} 
                      ratio="4:5" 
                      placeholderText={cast.name}
                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {cast.is_today && (
                      <div className="absolute top-3 left-3 bg-white/95 text-[10px] font-bold text-[var(--color-gold)] px-2.5 py-1 tracking-widest uppercase rounded-sm border border-[var(--color-gold)]/30 backdrop-blur-sm">
                        本日出勤
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 text-center bg-white relative z-10">
                    <h3 className="font-serif text-lg md:text-xl text-[#171717]">{cast.name}</h3>
                    <div className="flex justify-center items-center mt-2 gap-2 text-xs text-gray-400 font-sans tracking-wide">
                      {cast.age && <span>{cast.age}歳</span>}
                      {(cast.age && cast.height) && <span>/</span>}
                      {cast.height && <span>{cast.height}cm</span>}
                    </div>
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
