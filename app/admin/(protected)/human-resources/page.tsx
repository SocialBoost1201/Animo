import { getCasts } from '@/lib/actions/casts';
import { getStaffs } from '@/lib/actions/staffs';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight, Users, UserCheck } from 'lucide-react';
import { DraggableCastList } from '@/components/features/admin/human-resources/DraggableCastList';
import { SearchBar } from '@/components/features/admin/SearchBar';
import { StaffList } from '@/components/features/admin/staffs/StaffList';

export const dynamic = 'force-dynamic';

export default async function HumanResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; month?: string; tab?: string }>;
}) {
  const { q, month, tab = 'casts' } = await searchParams;

  const [castsData, staffsData] = await Promise.all([
    getCasts(q),
    getStaffs(true),
  ]);

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
    <div className="space-y-10 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 py-4 border-b border-[#ffffff08] mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#f4f1ea] tracking-tight">キャスト・スタッフ管理</h1>
          <p className="text-[13px] text-[#8a8478] tracking-[0.1px] opacity-70">キャストとスタッフの登録・編集・並べ替えを一元管理できます</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {tab === 'casts' && (
            <>
              <div className="flex items-center gap-1 bg-[#1c1d22] rounded-[12px] border border-[#ffffff0f] px-1 py-1 shadow-lg">
                <Link
                  href={`/admin/human-resources?tab=casts&month=${prevMonthStr}${q ? `&q=${q}` : ''}`}
                  className="p-2 text-[#8a8478] hover:text-gold transition-colors rounded-[8px] hover:bg-[#ffffff08]"
                >
                  <ChevronLeft size={18} />
                </Link>
                <span className="text-[13px] font-bold text-[#c7c0b2] min-w-[100px] text-center tracking-wider">{dFormat}</span>
                <Link
                  href={`/admin/human-resources?tab=casts&month=${nextMonthStr}${q ? `&q=${q}` : ''}`}
                  className="p-2 text-[#8a8478] hover:text-gold transition-colors rounded-[8px] hover:bg-[#ffffff08]"
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
              <div className="w-72">
                <SearchBar placeholder="源氏名・名前で検索..." />
              </div>
              <Link
                href="/admin/human-resources/new"
                className="flex items-center gap-2.5 px-6 py-3 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-gold/20 whitespace-nowrap"
                style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
              >
                <Plus size={18} strokeWidth={3} />
                キャスト登録
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#ffffff08]">
        <Link
          href="/admin/human-resources?tab=casts"
          className={`flex items-center gap-3 px-6 py-4 text-[13px] font-bold transition-all relative ${
            tab === 'casts'
              ? 'text-[#f4f1ea] bg-[#ffffff05]'
              : 'text-[#5a5650] hover:text-[#8a8478]'
          }`}
        >
          <Users size={16} className={tab === 'casts' ? 'text-gold' : ''} />
          キャスト
          <span className={`ml-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
            tab === 'casts' ? 'bg-gold/20 text-gold' : 'bg-[#ffffff08] text-[#5a5650]'
          }`}>
            {mappedCasts.length}
          </span>
          {tab === 'casts' && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-gold shadow-[0_0_10px_rgba(223,189,105,0.4)]" />
          )}
        </Link>
        <Link
          href="/admin/human-resources?tab=staffs"
          className={`flex items-center gap-3 px-6 py-4 text-[13px] font-bold transition-all relative ${
            tab === 'staffs'
              ? 'text-[#f4f1ea] bg-[#ffffff05]'
              : 'text-[#5a5650] hover:text-[#8a8478]'
          }`}
        >
          <UserCheck size={16} className={tab === 'staffs' ? 'text-gold' : ''} />
          スタッフ
          <span className={`ml-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
            tab === 'staffs' ? 'bg-gold/20 text-gold' : 'bg-[#ffffff08] text-[#5a5650]'
          }`}>
            {staffsData.length}
          </span>
          {tab === 'staffs' && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-gold shadow-[0_0_10px_rgba(223,189,105,0.4)]" />
          )}
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="pt-2">
        {tab === 'casts' ? (
          <DraggableCastList initialCasts={mappedCasts} />
        ) : (
          <StaffList initialStaffs={staffsData} />
        )}
      </div>
    </div>
  );
}
