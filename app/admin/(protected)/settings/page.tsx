import Link from 'next/link'
import { ImageIcon, Grid3X3, Palette, ChevronRight, type LucideIcon } from 'lucide-react'
import { getSiteSettings } from '@/lib/actions/contents'
import { getLineNotifications, getLinkedCasts } from '@/lib/actions/line-notifications'
import { SettingsForm } from '@/components/features/admin/SettingsForm'
import { LineNotificationManager } from '@/components/features/admin/LineNotificationManager'

export default async function SettingsPage() {
  const [settings, lineNotifications, linkedCasts] = await Promise.all([
    getSiteSettings(),
    getLineNotifications(),
    getLinkedCasts(),
  ])

  return (
    <div className="space-y-10 font-inter pb-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-4">
        <h1 className="text-[20px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">設定</h1>
        <p className="text-[12px] text-[#8a8478]">サイト全体に関する基本情報と動作の設定</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        {/* ── サイト設定 ── */}
        <section className="h-full">
          <div className="mb-6">
            <h2 className="text-[14px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">サイト・ビジュアル設定</h2>
            <p className="text-[11px] text-[#8a8478] mt-1">フロントエンドの雰囲気や演出を制御します</p>
          </div>
          <SettingsForm initialData={settings} />
        </section>

        {/* ── LINE 自動通知設定 ── */}
        <section className="h-full">
          <div className="mb-6">
            <h2 className="text-[14px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">LINE 自動通知設定</h2>
            <p className="text-[11px] text-[#8a8478] mt-1">LINE公式アカウントからの自動通知スケジュールを管理します</p>
          </div>
          <LineNotificationManager
            key={lineNotifications.map((n) => n.id).join(',')}
            initialNotifications={lineNotifications}
            linkedCasts={linkedCasts}
          />
        </section>
      </div>

      {/* ── デザイン管理 ── */}
      <section>
        <div className="mb-6">
          <h2 className="text-[14px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">デザイン管理</h2>
          <p className="text-[11px] text-[#8a8478] mt-1">ヒーロービジュアル・ギャラリーなどのビジュアル設定を管理します</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { href: '/admin/design',   Icon: Palette,   title: 'デザイン管理',   sub: 'デザイン設定の一覧と各管理ページへ移動します' },
            { href: '/admin/hero',     Icon: ImageIcon, title: 'ヒーロー管理',   sub: 'トップページのヒーロービジュアルと表示テキストを管理します' },
            { href: '/admin/gallery',  Icon: Grid3X3,   title: 'ギャラリー管理', sub: 'ギャラリーセクションに表示する画像を管理します' },
          ] as { href: string; Icon: LucideIcon; title: string; sub: string }[]).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-[16px] border border-[#dfbd69]/18 bg-[#17181c] px-5 py-4 transition-all hover:bg-[#1c1d22] hover:border-[#dfbd69]/30"
            >
              <div className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-[#dfbd691a] shrink-0">
                <item.Icon size={17} className="text-[#dfbd69]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#f4f1ea] leading-snug">{item.title}</p>
                <p className="text-[11px] text-[#8a8478] mt-0.5 line-clamp-2">{item.sub}</p>
              </div>
              <ChevronRight size={15} className="text-[#5a5650] group-hover:text-[#dfbd69] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
