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
  
  // 共通データ取得
  const castsData = await getCasts(q);
  const staffsData = await getStaffs(true); // 全スタッフ（非在籍含む）取得

  // キャスト表示用の処理
  const targetMonth = month || new Date().toISOString().substring(0, 7);
  const dateObj = new Date(targetMonth + '-01T00:00:00');
  const dFormat = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月`;
  
  const prevMonthDate = new Date(dateObj);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const nextMonthDate = new Date(dateObj);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const prevMonthStr = prevMonthDate.toISOString().substring(0, 7);
  const nextMonthStr = nextMonthDate.toISOString().substring(0, 7);

  const mappedCasts = (castsData || []).map(cast => {
    const mScore = cast.cast_scores?.find((s: any) => s.target_month === targetMonth);
    return {
      id: cast.id,
      stage_name: cast.stage_name,
      name: cast.name,
      image_url: cast.cast_images?.find((img: { is_primary: boolean, image_url: string }) => img.is_primary)?.image_url || null,
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

  const tabClass = (active: boolean) => 
    `flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
      active 
        ? 'border-[#171717] text-[#171717] bg-gray-50' 
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">人材管理</h1>
          <p className="text-sm text-gray-500 mt-2">キャストとスタッフの登録・編集・管理</p>
        </div>
        
        {tab === 'casts' && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Link href={`/admin/human-resources?tab=casts&month=${prevMonthStr}${q ? `&q=${q}` : ''}`} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <ChevronLeft size={16} />
              </Link>
              <span className="text-sm font-bold min-w-[80px] text-center text-[#171717]">{dFormat}</span>
              <Link href={`/admin/human-resources?tab=casts&month=${nextMonthStr}${q ? `&q=${q}` : ''}`} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex-1 md:w-64 min-w-[200px]">
              <SearchBar placeholder="源氏名・名前で検索..." />
            </div>
            <Link
              href="/admin/human-resources/new"
              className="bg-[#171717] hover:bg-gold text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              キャスト登録
            </Link>
          </div>
        )}
      </div>

      {/* タブメニュー */}
      <div className="flex border-b border-gray-200">
        <Link href="/admin/human-resources?tab=casts" className={tabClass(tab === 'casts')}>
          <Users size={18} />
          キャスト
          <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 rounded-full">{mappedCasts.length}</span>
        </Link>
        <Link href="/admin/human-resources?tab=staffs" className={tabClass(tab === 'staffs')}>
          <UserCheck size={18} />
          スタッフ
          <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 rounded-full">{staffsData.length}</span>
        </Link>
      </div>

      {/* コンテンツ表示 */}
      {tab === 'casts' ? (
        <DraggableCastList initialCasts={mappedCasts} />
      ) : (
        <StaffList initialStaffs={staffsData} />
      )}
    </div>
  );
}
