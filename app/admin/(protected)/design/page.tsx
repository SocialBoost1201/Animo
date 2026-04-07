import Link from 'next/link'
import { ImageIcon, Grid3X3, Palette, ChevronRight, Layers } from 'lucide-react'

export default function DesignPage() {
  const sections = [
    {
      href:     '/admin/hero',
      icon:     ImageIcon,
      title:    'ヒーロー管理',
      sub:      'トップページのヒーロービジュアルと表示テキストを管理します',
      badge:    null,
      iconBg:   'bg-[#dfbd691a]',
      iconColor:'text-[#dfbd69]',
    },
    {
      href:     '/admin/gallery',
      icon:     Grid3X3,
      title:    'ギャラリー管理',
      sub:      'サイトのギャラリーセクションに表示する画像を管理します',
      badge:    null,
      iconBg:   'bg-[#6ab0d414]',
      iconColor:'text-[#6ab0d4]',
    },
    {
      href:     '/admin/settings',
      icon:     Palette,
      title:    'サイト設定',
      sub:      '店舗名・基本情報・SNSリンク・カラー設定など基本設定を管理します',
      badge:    null,
      iconBg:   'bg-[#a882d814]',
      iconColor:'text-[#a882d8]',
    },
  ]

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">デザイン管理</h1>
        <p className="text-[11px] text-[#8a8478]">サイトの視覚的な要素とコンテンツを管理します</p>
      </div>

      {/* ── Section Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-6 flex flex-col gap-4 hover:border-[#ffffff18] hover:bg-[#1c1d22] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`w-[44px] h-[44px] flex items-center justify-center rounded-[12px] ${s.iconBg}`}>
                <s.icon size={20} className={s.iconColor} strokeWidth={1.8} />
              </div>
              <ChevronRight size={16} className="text-[#5a5650] group-hover:text-[#8a8478] transition-colors mt-1" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#f4f1ea] mb-1">{s.title}</p>
              <p className="text-[11px] text-[#8a8478] leading-relaxed">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Info ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-5 flex items-start gap-3">
        <div className="w-[30px] h-[30px] flex items-center justify-center bg-[#dfbd691a] rounded-[8px] shrink-0 mt-0.5">
          <Layers size={14} className="text-[#dfbd69]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[#c7c0b2] mb-1">デザインシステムについて</p>
          <p className="text-[11px] text-[#8a8478] leading-relaxed">
            ヒーロー・ギャラリーは画像とテキストの追加・並び替え・削除に対応しています。
            カラーや基本情報などの詳細設定はサイト設定ページから変更できます。
          </p>
        </div>
      </div>
    </div>
  )
}
