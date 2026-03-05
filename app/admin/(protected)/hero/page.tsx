import { getAdminHeroMedia, deleteHeroMedia } from '@/lib/actions/inquiries'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function HeroMediaPage() {
  const mediaList = await getAdminHeroMedia()

  async function handleDelete(data: FormData) {
    'use server'
    const id = data.get('id') as string
    await deleteHeroMedia(id)
    revalidatePath('/admin/hero')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Hero Media</h1>
          <p className="text-sm text-gray-500 mt-2">トップページのヒーローセクションでローテーション再生される動画/画像の管理</p>
        </div>
        <Link 
          href="/admin/hero/new" 
          className="bg-[#171717] hover:bg-[var(--color-gold)] text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          新規追加
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold">Media</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mediaList?.map((media) => (
              <tr key={media.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-32 h-18 rounded-sm overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img src={media.poster_url || media.url} alt={media.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    media.type === 'video' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {media.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-[#171717] line-clamp-1">{media.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    media.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {media.is_active ? '配信中' : '停止中'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={media.id} />
                      <button 
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                        onClick={(e) => {
                          if (!confirm(`削除してもよろしいですか？`)) e.preventDefault()
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {(!mediaList || mediaList.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  ヒーローメディアが登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
