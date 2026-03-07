import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { CastFavoriteButton } from '@/components/features/system/CastFavoriteButton';
import Link from 'next/link';
import { getPublicCasts } from '@/lib/actions/public/data';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

// サーバーコンポーネントとしてキャスト一覧を取得
export default async function CastPage({
  searchParams,
}: {
  searchParams: { purpose?: string; atmosphere?: string };
}) {
  const casts = await getPublicCasts();

  const purpose = searchParams?.purpose;
  const atmosphere = searchParams?.atmosphere;
  const hasDiagnostic = !!(purpose && atmosphere);

  // 診断に基づくソートロジック (タグの一致度でソート、実運用ではより精緻なロジックを検討)
  // 現状はダミーの関連付けによる簡易マッチング
  const sortedCasts = [...casts].sort((a, b) => {
    if (!hasDiagnostic) return 0;
    
    // ここではサンプルとして、雰囲気に合わせて少しだけ順序をいじる
    // （本来は casts.cast_tags や casts.tags に atmosphere の文字列が含まれているか見る）
    const aMatch = String(a.hobby || '').includes('酒') ? 1 : 0;
    const bMatch = String(b.hobby || '').includes('酒') ? 1 : 0;
    return bMatch - aMatch;
  });

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Cast
          </h1>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-[var(--color-gold)] font-serif luxury-tracking uppercase">
            個性豊かな上質空間を彩るキャストたち。<br />
            （本日の出勤キャストを優先して表示しています）
          </p>
        </FadeIn>

        {hasDiagnostic && (
          <FadeIn delay={0.2} className="mb-16">
            <div className="max-w-3xl mx-auto bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 p-8 text-center shadow-sm">
              <div className="inline-block p-3 bg-white rounded-full mb-4 shadow-[0_0_15px_rgba(180,150,90,0.15)]">
                <Sparkles className="w-6 h-6 text-[var(--color-gold)]" />
              </div>
              <h2 className="text-lg md:text-xl font-serif text-[#171717] mb-3 luxury-tracking">
                Night Style 診断結果
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-serif leading-relaxed mb-6">
                お客様の目的に合わせた、おすすめのキャストをピックアップいたしました。<br />
                特別なひとときを、彼女たちとともにお過ごしください。
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-white border border-[var(--color-gold)] text-[var(--color-gold)]">
                  {purpose === 'business' ? '接待・おもてなし' : purpose === 'party' ? 'ワイワイ盛り上がる' : 'ゆっくり飲みたい'}
                </span>
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-white border border-[var(--color-gold)] text-[var(--color-gold)]">
                  {atmosphere === 'calm' ? '清楚・落ち着き' : atmosphere === 'cheerful' ? '明るい・ノリが良い' : '聞き上手・癒やし'}
                </span>
              </div>
            </div>
          </FadeIn>
        )}

        {/* キャストグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {sortedCasts.map((cast, index) => (
            <FadeIn key={cast.id} delay={index * 0.05} className="group relative">
              <Link href={`/cast/${cast.slug || cast.id}`} className="block">

                <div className="overflow-hidden bg-white shadow-luxury hover:shadow-luxury-hover transition-all duration-1000 group-hover:-translate-y-1">
                  <div className="relative">
                    <PlaceholderImage 
                      src={cast.image_url}
                      alt={cast.stage_name} 
                      ratio="4:5" 
                      placeholderText={cast.stage_name}
                      className="group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div className="absolute top-3 right-3 z-20">
                      <CastFavoriteButton castId={cast.id} />
                    </div>
                    {cast.is_today && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-serif luxury-tracking text-gold px-3 py-1 uppercase border border-gold/30">
                        Today
                      </div>
                    )}
                    {hasDiagnostic && index < 3 && (
                      <div className="absolute top-3 right-3 bg-[var(--color-gold)] text-white text-[9px] font-serif luxury-tracking px-2 py-1 uppercase shadow-md">
                        Recommend
                      </div>
                    )}
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
          
          {sortedCasts.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              キャスト情報がまだ登録されていません。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
