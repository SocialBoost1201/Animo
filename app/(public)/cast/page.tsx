import { FadeIn } from '@/components/motion/FadeIn';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { CastFavoriteButton } from '@/components/features/system/CastFavoriteButton';
import Link from 'next/link';
import { getPublicCasts } from '@/lib/actions/public/data';
import { Sparkles } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '在籍キャスト一覧｜関内キャバクラ CLUB Animo',
  description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」の在籍キャスト一覧。極上の時間をお届けするこだわりのキャストたちをご確認ください。',
  alternates: {
    canonical: '/cast',
  },
  openGraph: {
    url: 'https://club-animo.jp/cast',
  },
};

// サーバーコンポーネントとしてキャスト一覧を取得
export default async function CastPage({
  searchParams,
}: {
  searchParams: Promise<{ purpose?: string; atmosphere?: string }>;
}) {
  const casts = await getPublicCasts().catch(() => []);
  const resolvedSearchParams = await searchParams;
  const purpose = resolvedSearchParams?.purpose;
  const atmosphere = resolvedSearchParams?.atmosphere;
  const hasDiagnostic = !!(purpose && atmosphere);

  // ─── quiz_tags マッチングスコア計算 ─────────────────────────
  // 目的タグ=2点 / 雰囲気タグ=2点 / 本日出勤=1点ボーナス
  const matchScore = (cast: (typeof casts)[number]) => {
    if (!hasDiagnostic) return cast.is_today ? 1 : 0;
    const tags = cast.quiz_tags ?? [];
    let score = 0;
    if (purpose && tags.includes(`purpose_${purpose}`)) score += 2;
    if (atmosphere && tags.includes(`atm_${atmosphere}`)) score += 2;
    if (cast.is_today) score += 1;
    return score;
  };

  const sortedCasts = [...casts].sort((a, b) => matchScore(b) - matchScore(a));

  // マッチスコアが1以上 = おすすめキャスト
  const isRecommended = (cast: (typeof casts)[number]) =>
    hasDiagnostic && matchScore(cast) >= 2;

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: 'CAST', item: 'https://club-animo.jp/cast' }
      ]} />
      <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Cast
          </h1>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-gold font-serif luxury-tracking uppercase">
            個性豊かな上質空間を彩るキャストたち。<br />
            （本日の出勤キャストを優先して表示しています）
          </p>
        </FadeIn>

        {hasDiagnostic && (
          <FadeIn delay={0.2} className="mb-16">
            <div className="max-w-3xl mx-auto bg-gold/5 border border-gold/20 p-8 text-center shadow-sm">
              <div className="inline-block p-3 bg-white rounded-full mb-4 shadow-[0_0_15px_rgba(180,150,90,0.15)]">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-lg md:text-xl font-serif text-[#171717] mb-3 luxury-tracking">
                Night Style 診断結果
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-serif leading-relaxed mb-6">
                お客様の目的に合わせた、おすすめのキャストをピックアップいたしました。<br />
                特別なひとときを、彼女たちとともにお過ごしください。
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-xs uppercase tracking-widest px-3 py-1 bg-white border border-gold text-gold">
                  {purpose === 'business' ? '接待・おもてなし' : purpose === 'party' ? 'ワイワイ盛り上がる' : 'ゆっくり飲みたい'}
                </span>
                <span className="text-xs uppercase tracking-widest px-3 py-1 bg-white border border-gold text-gold">
                  {atmosphere === 'calm' ? '清楚・落ち着き' : atmosphere === 'cheerful' ? '明るい・ノリが良い' : '聞き上手・癒やし'}
                </span>
              </div>
            </div>
          </FadeIn>
        )}

        {/* キャストグリッド */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {sortedCasts.map((cast, index) => {
            const displayName = cast.display_name || cast.stage_name || cast.name || 'CAST';
            const displayKana = cast.name_kana
              ? cast.name_kana
                  .replace(/[ぁ-ん]/g, (c: string) => String.fromCharCode(c.charCodeAt(0) + 0x60))
                  .toUpperCase()
              : displayName.toUpperCase();

            return (
              <FadeIn key={cast.id} delay={index * 0.04} className="group relative">
                <Link href={`/cast/${cast.slug || cast.id}`} className="block h-full">

                  <div className="overflow-hidden bg-white hover:shadow-luxury transition-all duration-700 h-full flex flex-col">
                    <div className="relative">
                      <PlaceholderImage 
                        src={cast.image_url}
                        alt={displayName}
                        ratio="3:4" 
                        placeholderText={displayName}
                        className="group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      {/* お気に入りボタン */}
                      <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-20">
                        <CastFavoriteButton castId={cast.id} />
                      </div>
                      {/* 本日出勤バッジ */}
                      {cast.is_today && !isRecommended(cast) && (
                        <div className="absolute top-0 left-0 right-0 bg-[#171717]/85 text-white text-xs font-sans tracking-widest px-2 py-1 text-center uppercase">
                          本日出勤
                        </div>
                      )}
                      {isRecommended(cast) && (
                        <div className="absolute top-0 left-0 right-0 bg-gold/90 text-white text-xs font-sans tracking-widest px-2 py-1 text-center uppercase">
                          おすすめ
                        </div>
                      )}
                    </div>
                    {/* テキスト部分 */}
                    <div className="px-2 pt-2 pb-2.5 md:px-3 md:pt-2.5 md:pb-3 bg-white text-center flex-1">
                      {/* 英語整形名 */}
                      <p className="text-xs md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase leading-none mb-0.5">
                        {displayKana}
                      </p>
                      {/* 源氏名 */}
                      <h3 className="font-serif text-xs md:text-sm lg:text-base text-[#171717] leading-snug">
                        {displayName}
                      </h3>
                      {/* 年齢・身長 */}
                      <div className="flex justify-center items-center mt-1 gap-1 text-xs md:text-xs text-gray-400">
                        {cast.age && <span>{cast.age}歳</span>}
                        {cast.age && cast.height && <span className="text-gray-200">•</span>}
                        {cast.height && <span>T{cast.height}</span>}
                      </div>
                      {/* 日記UPバッジ */}
                      {cast.has_recent_post && (
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-[#171717] text-white text-xs font-bold tracking-widest px-2 py-0.5">
                          <span>📓</span>
                          <span>日記UP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
          
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
