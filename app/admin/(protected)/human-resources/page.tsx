import { getCasts } from '@/lib/actions/casts';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { DraggableCastList } from '@/components/features/admin/human-resources/DraggableCastList';
import { SearchBar } from '@/components/features/admin/SearchBar';

export const dynamic = 'force-dynamic';

export default async function HumanResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; month?: string; tab?: string }>;
}) {
  const { q, month } = await searchParams;

  const castsData = await getCasts(q);

  const targetMonth = month || new Date().toISOString().substring(0, 7);
  const dateObj = new Date(targetMonth + '-01T00:00:00');
  const dFormat = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月`;

  const prevMonthDate = new Date(dateObj);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const nextMonthDate = new Date(dateObj);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const prevMonthStr = prevMonthDate.toISOString().substring(0, 7);
  const nextMonthStr = nextMonthDate.toISOString().substring(0, 7);

  const mappedCasts = (castsData || []).map((cast) => {
    const mScore = cast.cast_scores?.find((s: { target_month: string }) => s.target_month === targetMonth) as { total_score?: number; current_level?: number } | undefined;
    return {
      id: cast.id,
      stage_name: cast.stage_name,
      name: cast.name,
      image_url: cast.cast_images?.find((img: { is_primary: boolean; image_url: string }) => img.is_primary)?.image_url || null,
      age: cast.age,
      hobby: cast.hobby,
      quiz_tags: cast.quiz_tags || [],
      is_active: cast.is_active,
      status: cast.status,
      display_order: cast.display_order ?? 0,
      score: mScore?.total_score || 0,
      level: mScore?.current_level || 1,
    };
  });

  return (
    <div className="space-y-[14px] font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 h-[49px]">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">キャスト管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">キャストの登録・編集・管理</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center h-[37px] bg-[#ffffff06] rounded-[10px] border border-[#8a8478] p-[3px]">
            <Link
              href={`/admin/human-resources?month=${prevMonthStr}${q ? `&q=${q}` : ''}`}
              className="flex items-center justify-center w-[28px] h-full text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08]"
            >
              <ChevronLeft size={12} />
            </Link>
            <span className="text-[11px] font-bold text-[#f4f1ea] min-w-[76px] text-center tracking-tight">{dFormat}</span>
            <Link
              href={`/admin/human-resources?month=${nextMonthStr}${q ? `&q=${q}` : ''}`}
              className="flex items-center justify-center w-[28px] h-full text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08]"
            >
              <ChevronRight size={12} />
            </Link>
          </div>
          <div className="w-[200px]">
            <SearchBar placeholder="名前で検索..." />
          </div>
          <Link
            href="/admin/human-resources/new"
            className="flex items-center justify-center gap-1.5 h-[37px] px-5 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
          >
            <Plus size={12} strokeWidth={3} />
            キャスト登録
          </Link>
        </div>
      </div>

      {/* ── Cast Count ── */}
      <div className="flex items-center gap-1 border-b border-[#ffffff08]">
        <div className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-[#f4f1ea] relative">
          <Users size={13} />
          キャスト
          <span className="ml-0.5 text-[9px] font-bold bg-[#ffffff08] text-[#8a8478] px-1.5 py-0.5 rounded-full">
            {mappedCasts.length}
          </span>
          <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
        </div>
      </div>

      {/* ── Content ── */}
      <DraggableCastList initialCasts={mappedCasts} />
    </div>
  );
}
