import { getCasts } from '@/lib/actions/casts';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DraggableCastList } from '@/components/features/admin/casts/DraggableCastList';
import { SearchBar } from '@/components/features/admin/SearchBar';

// propsに searchParams を追加
export default async function CastsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const casts = await getCasts(q);

  // 必要なプロパティだけをマッピング
  const mappedCasts = (casts || []).map(cast => ({
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
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Casts Management</h1>
          <p className="text-sm text-gray-500 mt-2">在籍キャストの登録・編集・表示順の管理</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <SearchBar placeholder="源氏名・名前で検索..." />
          </div>
          <Link
            href="/admin/casts/new"
            className="bg-[#171717] hover:bg-gold text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            新規登録
          </Link>
        </div>
      </div>

      <DraggableCastList initialCasts={mappedCasts} />
    </div>
  );
}
