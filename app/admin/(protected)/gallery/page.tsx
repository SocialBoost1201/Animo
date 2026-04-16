import { GALLERY_DATA } from '@/components/features/gallery/data'
import { PauseCircle, ImageIcon, Layers } from 'lucide-react'

export default async function GalleryPage() {
  const contents = GALLERY_DATA

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[18px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">ギャラリー管理</h1>
          <p className="text-[11px] text-[#8a8478]">公開サイトのギャラリーセクションに表示されている画像一覧</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-[10px] font-bold tracking-widest text-gold uppercase shadow-sm shadow-gold/10">
          <PauseCircle size={12} />
          静的データ運用中
        </div>
      </div>

      {/* ── Alert ── */}
      <div className="bg-amber-400/5 border border-amber-400/10 rounded-[18px] p-5 flex items-start gap-4">
        <div className="w-[32px] h-[32px] flex items-center justify-center bg-amber-400/10 rounded-[10px] shrink-0 mt-0.5">
          <Layers size={15} className="text-amber-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-amber-200 mb-1">現在は閲覧専用モードです</p>
          <p className="text-[11px] text-[#8a8478] leading-relaxed">
            フロントエンドの表示負荷軽減のため、現在ギャラリーは静的ファイルデータで固定運用されています。<br />
            ここでの変更が即時反映されないため、追加・編集機能は一時的に制限されています。
          </p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#17181c] border border-white/5 shadow-2xl rounded-[18px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/2 border-b border-white/5 text-[9px] font-bold tracking-[1.8px] text-[#8a8478] uppercase">
              <th className="px-6 py-4 font-bold">IMAGE / 画像</th>
              <th className="px-6 py-4 font-bold">INFO / キャプション</th>
              <th className="px-6 py-4 font-bold">CATEGORY / カテゴリ</th>
              <th className="px-6 py-4 font-bold">STATUS / 状態</th>
              <th className="px-6 py-4 font-bold text-right">OP / 操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {contents?.map((content) => (
              <tr key={content.id} className="hover:bg-white/1 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-20 h-14 rounded-[10px] overflow-hidden bg-white/2 border border-white/5 shrink-0 shadow-lg transition-transform group-hover:scale-[1.03]">
                    <img src={content.src} alt={content.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-semibold text-[#f4f1ea]">{content.title}</p>
                  <p className="text-[10px] text-[#5a5650] mt-0.5">{content.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-white/5 border border-white/10 text-[#8a8478] uppercase">
                    {content.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-400/10 text-green-400/80 border border-green-400/20">
                    <span className="w-1 h-1 rounded-full bg-green-400 shadow-sm shadow-green-400" />
                    公開中
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-[#5a5650]">
                  <span className="text-[10px] font-bold tracking-wider">
                    限定表示中
                  </span>
                </td>
              </tr>
            ))}
            
            {(!contents || contents.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  ギャラリー画像が登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
