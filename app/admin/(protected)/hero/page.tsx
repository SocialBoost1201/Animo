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
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[18px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">ヒーロー管理</h1>
          <p className="text-[11px] text-[#8a8478] mt-1">トップページのヒーローセクションでローテーション再生される動画/画像の管理</p>
        </div>
        <Link 
          href="/admin/hero/new" 
          className="bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold px-6 py-2.5 rounded-[10px] text-[12px] font-bold tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-gold/5"
        >
          <Plus size={14} />
          新規追加
        </Link>
      </div>

      <div className="bg-[#17181c] border border-white/5 shadow-2xl rounded-[18px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/2 border-b border-white/5 text-[9px] font-bold tracking-[1.8px] text-[#8a8478] uppercase">
              <th className="px-6 py-4 font-bold">MEDIA / メディア</th>
              <th className="px-6 py-4 font-bold">TYPE / 種類</th>
              <th className="px-6 py-4 font-bold">TITLE / タイトル</th>
              <th className="px-6 py-4 font-bold">STATUS / 状態</th>
              <th className="px-6 py-4 font-bold text-right font-sans">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {mediaList?.map((media) => (
              <tr key={media.id} className="hover:bg-white/1 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-32 h-18 rounded-[10px] overflow-hidden bg-white/2 border border-white/5 shrink-0 shadow-lg transition-transform group-hover:scale-[1.03]">
                    <img src={media.poster_url || media.url} alt={media.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    media.type === 'video' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {media.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-semibold text-[#f4f1ea] line-clamp-1">{media.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    media.is_active 
                      ? 'bg-green-400/10 text-green-400 border-green-400/20' 
                      : 'bg-white/5 text-[#5a5650] border-white/10'
                  }`}>
                    {media.is_active && <span className="w-1 h-1 rounded-full bg-green-400 shadow-sm shadow-green-400" />}
                    {media.is_active ? '配信中' : '停止中'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={media.id} />
                      <button 
                        type="submit"
                        className="p-2 text-[#5a5650] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
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
