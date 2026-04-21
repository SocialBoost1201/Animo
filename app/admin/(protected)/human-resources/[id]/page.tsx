import { CastForm } from '@/components/features/admin/CastForm'
import { CastImageManager } from '@/components/features/admin/CastImageManager'
import { getCastById } from '@/lib/actions/casts'
import { getCastAccountSnapshot } from './account-status'

function formatDateTime(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function EditCastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cast = await getCastById(id)
  const privateInfo = Array.isArray(cast?.cast_private_info)
    ? cast.cast_private_info[0]
    : cast?.cast_private_info
  const accountSnapshot = await getCastAccountSnapshot({
    authUserId: cast?.auth_user_id ?? null,
    privatePhone: privateInfo?.phone ?? null,
  })

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

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-widest text-[#171717] uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-gold inline-block" />
          アカウント情報
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">状態</span>
          <span
            className={[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wide',
              accountSnapshot.status === 'needs_review'
                ? 'bg-amber-100 text-amber-800'
                : accountSnapshot.status === 'unregistered'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-emerald-100 text-emerald-800',
            ].join(' ')}
          >
            {accountSnapshot.statusLabel}
          </span>
        </div>

        <p className="text-sm text-gray-600">{accountSnapshot.statusMessage}</p>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="text-gray-500">SMSログイン電話番号</dt>
            <dd className="text-[#171717] break-all">{accountSnapshot.phone ?? privateInfo?.phone ?? '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-gray-500">登録日時</dt>
            <dd className="text-[#171717]">{formatDateTime(accountSnapshot.registeredAt)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-gray-500">最終ログイン日時</dt>
            <dd className="text-[#171717]">{formatDateTime(accountSnapshot.lastLoginAt)}</dd>
          </div>
          <div className="space-y-1 md:col-span-2">
            <dt className="text-gray-500">Auth User ID</dt>
            <dd className="text-[#171717] font-mono text-xs break-all">{accountSnapshot.authUserId ?? '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-gray-500">LINE ID</dt>
            <dd className="text-[#171717] break-all">{privateInfo?.line_id ?? '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-gray-500">LINE連携状態</dt>
            <dd className="text-[#171717]">{privateInfo?.line_user_id ? '連携済み' : '未連携'}</dd>
          </div>
        </dl>

        {accountSnapshot.authUserId && (
          <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 leading-relaxed space-y-1">
            <p>このキャストにはアカウントが紐づいています</p>
            <p>本人確認情報が一致しない場合、再登録はできません</p>
            <p>必要に応じて紐づき状況を確認してください</p>
          </div>
        )}
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
