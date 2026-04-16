import { getAdminHeroMedia, deleteHeroMedia } from '@/lib/actions/inquiries'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ヒーロー管理 | Animo Admin',
}

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
      {/* ── Page Header ── */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-[18px] font-bold text-[#f4f1ea] tracking-tight">ヒーロー管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-wide">トップページのヒーローセクションでローテーション再生される動画/画像の管理</p>
        </div>
        <Link 
          href="/admin/hero/new" 
          className="bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold px-6 py-2.5 rounded-[12px] text-[12px] font-bold tracking-[2px] flex items-center gap-2.5 transition-all shadow-xl shadow-gold/5 uppercase"
        >
          <Plus size={14} strokeWidth={2.5} />
          新規追加
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="bg-black/94 border border-white/10 shadow-2xl rounded-[18px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/3 border-b border-white/10">
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">メディア</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">種類</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">タイトル</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">ステータス</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {mediaList?.map((media) => (
              <tr key={media.id} className="hover:bg-white/1 transition-colors group">
                <td className="px-8 py-6">
                  <div className="w-28 h-18 rounded-[12px] overflow-hidden bg-black/40 border border-white/10 shrink-0 shadow-2xl transition-all group-hover:scale-[1.05] group-hover:border-gold/30 relative">
                    <img src={media.poster_url || media.url} alt={media.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[12px]" />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[2px] border uppercase ${
                    media.type === 'video' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {media.type === 'video' ? '動画' : '画像'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[14px] font-bold text-[#f4f1ea] tracking-tight line-clamp-1">{media.title}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border transition-colors uppercase ${
                    media.is_active 
                      ? 'bg-green-500/10 text-green-400/90 border-green-500/20' 
                      : 'bg-white/5 text-[#5a5650] border-white/10'
                  }`}>
                    {media.is_active && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                    {media.is_active ? '配信中' : '停止中'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={media.id} />
                      <button 
                        type="submit"
                        className="p-2.5 text-[#5a5650] hover:text-red-500 transition-all rounded-xl hover:bg-red-500/10 hover:scale-110 active:scale-95"
                        title="削除"
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
                <td colSpan={5} className="px-8 py-20 text-center space-y-3">
                  <div className="text-[#3a3630] font-black text-2xl opacity-10 uppercase tracking-[10px]">データなし</div>
                  <p className="text-[#8a8478] text-sm italic font-medium">ヒーローメディアが見つかりません</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
