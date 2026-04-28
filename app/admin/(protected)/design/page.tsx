import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  ImageIcon,
  Grid3X3,
  Palette,
  ChevronRight,
  Layers,
  Sparkles,
  LayoutTemplate,
  Plus,
  Eye,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DesignPage() {
  const supabase = await createClient()

  const [heroResult, galleryResult] = await Promise.all([
    supabase.from('contents').select('id, is_published', { count: 'exact' }).eq('type', 'hero'),
    supabase.from('contents').select('id, is_published', { count: 'exact' }).eq('type', 'gallery'),
  ])

  const heroItems    = heroResult.data ?? []
  const galleryItems = galleryResult.data ?? []
  const heroCount    = heroItems.length
  const galleryCount = galleryItems.length
  const heroPublished    = heroItems.filter((h) => h.is_published).length
  const galleryPublished = galleryItems.filter((g) => g.is_published).length

  const sections = [
    {
      href:       '/admin/hero',
      icon:       ImageIcon,
      addHref:    '/admin/hero/new',
      title:      'ヒーロー管理',
      sub:        'トップページのヒーロービジュアルと表示テキストを管理します',
      iconBg:     'bg-[#dfbd6914]',
      iconColor:  'text-[#dfbd69]',
      count:      heroCount,
      published:  heroPublished,
      countLabel: 'スライド',
    },
    {
      href:       '/admin/gallery',
      icon:       Grid3X3,
      addHref:    '/admin/gallery/new',
      title:      'ギャラリー管理',
      sub:        'サイトのギャラリーセクションに表示する画像を管理します',
      iconBg:     'bg-[#6ab0d414]',
      iconColor:  'text-[#6ab0d4]',
      count:      galleryCount,
      published:  galleryPublished,
      countLabel: '画像',
    },
    {
      href:       '/admin/settings',
      icon:       Palette,
      addHref:    null,
      title:      '設定',
      sub:        '店舗名・基本情報・SNS・カラー・LINE通知などを管理します',
      iconBg:     'bg-[#a882d814]',
      iconColor:  'text-[#a882d8]',
      count:      null,
      published:  null,
      countLabel: null,
    },
  ]

  return (
    <div className="space-y-5 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold tracking-[-0.31px] text-[#f4f1ea]">デザイン管理</h1>
        <p className="text-[11px] text-[#8a8478]">サイトの視覚的要素・コンテンツ・基本設定をまとめて管理します</p>
      </div>

      {/* ── Section Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div
            key={s.href}
            className="group bg-[#17181c] rounded-[20px] border border-[#ffffff0f] p-6 flex flex-col gap-5
                       hover:border-[#ffffff18] hover:bg-[#1c1d22] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-[44px] w-[44px] items-center justify-center rounded-[12px] ${s.iconBg}`}>
                <s.icon size={20} className={s.iconColor} strokeWidth={1.8} />
              </div>
              {s.count !== null && (
                <div className="text-right">
                  <p className="text-[22px] font-bold leading-none text-[#f4f1ea]">{s.count}</p>
                  <p className="text-[10px] text-[#5a5650] mt-0.5">{s.countLabel}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#f4f1ea] mb-1">{s.title}</p>
              <p className="text-[11px] text-[#8a8478] leading-relaxed">{s.sub}</p>
            </div>

            {/* Published bar */}
            {s.count !== null && s.count > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#5a5650]">公開中</span>
                  <span className="text-[#72b894] font-bold">{s.published}/{s.count}</span>
                </div>
                <div className="h-[3px] w-full rounded-full bg-[#ffffff08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#72b894]"
                    style={{ width: `${Math.round(((s.published ?? 0) / (s.count || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-auto pt-1 border-t border-[#ffffff06]">
              <Link
                href={s.href}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#ffffff0f]
                           px-3 py-2 text-[11px] font-medium text-[#c7c0b2] transition-colors hover:border-[#ffffff18] hover:text-[#f4f1ea]"
              >
                <Eye size={12} />
                管理する
              </Link>
              {s.addHref && (
                <Link
                  href={s.addHref}
                  className="flex items-center justify-center h-[34px] w-[34px] rounded-[10px] shrink-0 transition-colors"
                  style={{ background: 'linear-gradient(90deg,rgba(223,189,105,0.15),rgba(146,111,52,0.15))', border: '1px solid rgba(223,189,105,0.2)' }}
                  title="新規追加"
                >
                  <Plus size={13} className="text-[#dfbd69]" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Design System Info ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Animation & UX */}
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-5 flex items-start gap-4">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#dfbd6914] shrink-0 mt-0.5">
            <Sparkles size={16} className="text-[#dfbd69]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#c7c0b2] mb-1.5">アニメーション・演出</p>
            <p className="text-[11px] text-[#8a8478] leading-relaxed mb-3">
              ヒーロースライドのトランジション、ムード設定（今夜の演出）、VIP対応フラグなどの動的設定は「設定」ページから変更できます。
            </p>
            <Link
              href="/admin/animation-preview"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#dfbd69] hover:underline"
            >
              アニメーションプレビュー
              <ChevronRight size={11} />
            </Link>
          </div>
        </div>

        {/* Layout System */}
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-5 flex items-start gap-4">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#6ab0d414] shrink-0 mt-0.5">
            <LayoutTemplate size={16} className="text-[#6ab0d4]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#c7c0b2] mb-1.5">レイアウトシステム</p>
            <p className="text-[11px] text-[#8a8478] leading-relaxed">
              ヒーロー・ギャラリーは画像とテキストの追加・並び替え・削除に対応。
              各セクションの表示/非表示は公開ステータスで制御されます。
            </p>
          </div>
        </div>
      </div>

      {/* ── Design System Note ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-5 flex items-start gap-3">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#dfbd6914] shrink-0 mt-0.5">
          <Layers size={14} className="text-[#dfbd69]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[#c7c0b2] mb-1">デザインシステムについて</p>
          <p className="text-[11px] text-[#8a8478] leading-relaxed">
            本サイトは Tailwind CSS v4 + Framer Motion v12 + GSAP3 + Three.js で構築されています。
            カラー・テキスト・アニメーション設定は設定ページから変更、
            ビジュアル素材はヒーロー管理・ギャラリー管理から編集できます。
          </p>
        </div>
      </div>

    </div>
  )
}
