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
          <LineNotificationManager initialNotifications={lineNotifications} linkedCasts={linkedCasts} />
        </section>
      </div>
    </div>
  )
}
