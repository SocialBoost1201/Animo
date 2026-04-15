import { getSiteSettings } from '@/lib/actions/contents'
import { getLineNotifications } from '@/lib/actions/line-notifications'
import { SettingsForm } from '@/components/features/admin/SettingsForm'
import { LineNotificationManager } from '@/components/features/admin/LineNotificationManager'

export default async function SettingsPage() {
  const [settings, lineNotifications] = await Promise.all([
    getSiteSettings(),
    getLineNotifications(),
  ])

  return (
    <div className="space-y-10 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">設定</h1>
        <p className="text-[11px] text-[#8a8478]">サイト全体に関する基本情報と動作の設定</p>
      </div>

      {/* ── サイト設定 ── */}
      <section>
        <SettingsForm initialData={settings} />
      </section>

      {/* ── LINE 自動通知設定 ── */}
      <section className="max-w-3xl">
        <div className="mb-5">
          <h2 className="text-[13px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">LINE 自動通知設定</h2>
          <p className="text-[11px] text-[#8a8478] mt-1">LINE公式アカウントからの自動通知スケジュールを管理します</p>
        </div>
        <LineNotificationManager initialNotifications={lineNotifications} />
      </section>
    </div>
  )
}
