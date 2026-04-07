import { getSiteSettings } from '@/lib/actions/contents'
import { SettingsForm } from '@/components/features/admin/SettingsForm'

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">設定</h1>
        <p className="text-[11px] text-[#8a8478]">サイト全体に関する基本情報と動作の設定</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  )
}
