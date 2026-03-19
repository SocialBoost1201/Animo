import { CastForm } from '@/components/features/admin/CastForm'
import { CastImageManager } from '@/components/features/admin/CastImageManager'
import { getCastById } from '@/lib/actions/casts'

export default async function EditCastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cast = await getCastById(id)

  const images = (cast?.cast_images ?? []).map((img: {
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }) => ({
    id: img.id,
    image_url: img.image_url,
    is_primary: img.is_primary ?? false,
    sort_order: img.sort_order ?? 0,
  }))

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">キャスト編集</h1>
        <p className="text-sm text-gray-400 mt-1">{cast?.stage_name} さんの情報を編集します</p>
      </div>

      {/* 画像管理セクション */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6 space-y-3">
        <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-gold inline-block" />
          プロフィール画像
        </h2>
        <CastImageManager castId={id} images={images} />
      </div>

      {/* プロフィール編集フォーム */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6 space-y-3">
        <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-gold inline-block" />
          プロフィール情報
        </h2>
        <CastForm initialData={cast} />
      </div>
    </div>
  )
}
