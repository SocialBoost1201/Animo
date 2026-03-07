import { getCasts, deleteCast } from '@/lib/actions/casts'
import Link from 'next/link'
import { Trash2, Eye, EyeOff, Edit2, Plus } from 'lucide-react'
import { DeleteCastButton } from '@/components/features/admin/DeleteCastButton'

export default async function CastsPage() {
  const casts = await getCasts()



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Casts Management</h1>
          <p className="text-sm text-gray-500 mt-2">在籍キャストの登録・編集・表示順の管理</p>
        </div>
        <Link
          href="/admin/casts/new"
          className="bg-[#171717] hover:bg-[var(--color-gold)] text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          新規登録
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold">順</th>
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">源氏名</th>
              <th className="px-6 py-4 font-bold">年齢</th>
              <th className="px-6 py-4 font-bold">在籍</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {casts?.map((cast) => (
              <tr key={cast.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-400 w-12">
                  {cast.display_order ?? 0}
                </td>
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {cast.image_url
                      ? <img src={cast.image_url} alt={cast.stage_name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">{(cast.stage_name || cast.name || '?')[0]}</div>
                    }
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-[#171717]">{cast.stage_name || cast.name}</p>
                  {cast.hobby && <p className="text-xs text-gray-400 mt-0.5">趣味: {cast.hobby}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {cast.age ? `${cast.age}歳` : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    (cast.is_active ?? cast.status === 'public')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {(cast.is_active ?? cast.status === 'public')
                      ? <><Eye size={10} /> 公開</>
                      : <><EyeOff size={10} /> 非公開</>
                    }
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/admin/casts/${cast.id}`}
                      className="p-2 text-gray-400 hover:text-[#171717] transition-colors rounded hover:bg-gray-100"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <DeleteCastButton castId={cast.id} castName={cast.stage_name || cast.name || '名前なし'} />
                  </div>
                </td>
              </tr>
            ))}

            {(!casts || casts.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  キャストが登録されていません。<br />右上の「新規登録」ボタンから追加してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
