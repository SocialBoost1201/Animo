import { GALLERY_DATA } from '@/components/features/gallery/data'
import { PauseCircle, ImageIcon, Layers, Lock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ギャラリー管理 | Animo Admin',
}

export default async function GalleryPage() {
  const contents = GALLERY_DATA

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-[18px] font-bold text-[#f4f1ea] tracking-tight">ギャラリー管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-wide">公開サイトのギャラリーセクションに表示されている画像一覧</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-bold tracking-[2px] text-gold uppercase shadow-lg shadow-gold/5">
          <PauseCircle size={12} />
          静的データ運用中
        </div>
      </div>

      {/* ── Alert ── */}
      <div className="bg-amber-400/5 border border-amber-400/10 rounded-[18px] p-6 flex items-start gap-4">
        <div className="w-[36px] h-[36px] flex items-center justify-center bg-amber-400/10 rounded-[10px] shrink-0 mt-0.5 shadow-inner">
          <Lock size={15} className="text-amber-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-amber-200 mb-1.5 uppercase tracking-wider">閲覧専用モード</p>
          <p className="text-[11px] text-[#8a8478] leading-relaxed">
            現在ギャラリーは表示速度最適化のため、静的データ（GALLERY_DATA）で固定運用されています。<br />
            ここでのリスト表示は現在の公開内容の確認用であり、追加・編集・削除は制限されています。
          </p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-black/94 border border-white/10 shadow-2xl rounded-[18px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/3 border-b border-white/10">
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">プレビュー</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">キャプション / ID</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">カテゴリ</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">ステータス</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {contents?.map((content) => (
              <tr key={content.id} className="hover:bg-white/1 transition-colors group">
                <td className="px-8 py-6">
                  <div className="w-24 h-16 rounded-[12px] overflow-hidden bg-black/40 border border-white/10 shrink-0 shadow-2xl transition-all group-hover:scale-[1.05] group-hover:border-gold/30 relative">
                    <img src={content.src} alt={content.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[12px]" />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[14px] font-bold text-[#f4f1ea] tracking-tight">{content.title}</p>
                  <p className="text-[10px] text-[#5a5650] mt-1 font-mono tracking-tighter uppercase">{content.id}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[2px] bg-white/5 border border-white/10 text-[#8a8478] uppercase">
                    {{
                      interior: '内装',
                      seating: '座席',
                      champagne: 'シャンパン',
                      decor: '装飾'
                    }[content.category] || content.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-green-500/10 text-green-400/90 border border-green-500/20 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    公開中
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/5 bg-white/2 text-[#5a5650] text-[9px] font-bold tracking-widest uppercase">
                    <Lock size={10} />
                    編集不可
                  </div>
                </td>
              </tr>
            ))}
            
            {(!contents || contents.length === 0) && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center space-y-3">
                  <div className="text-[#3a3630] font-black text-2xl opacity-10 uppercase tracking-[10px]">データなし</div>
                  <p className="text-[#8a8478] text-sm italic font-medium">ギャラリー画像が見つかりません</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
