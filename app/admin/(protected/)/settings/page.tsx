import { getSiteSettings, updateSiteSettings } from '@/lib/actions/contents'
import { SettingsForm } from '@/components/features/admin/SettingsForm'

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-2">サイト全体に関する基本情報と振る舞いの設定</p>
        </div>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  )
}
