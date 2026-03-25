import { getTodayDashboard } from '@/lib/actions/today'
import { getCasts } from '@/lib/actions/casts'
import { TodayDashboard } from '@/components/features/today/TodayDashboard'
import { PageHeader, PageShell } from '@/components/ui/app-shell'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const today = new Date().toISOString().split('T')[0]
  const d = new Date()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const dateLabel = `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`

  const [data, castsRaw] = await Promise.all([
    getTodayDashboard(today),
    getCasts(),
  ])

  const casts = (castsRaw || []).map(c => ({ id: c.id, stage_name: c.stage_name ?? c.name ?? '' }))

  return (
    <PageShell width="narrow" className="space-y-6">
      <PageHeader
        eyebrow="Daily Operations"
        title="本日の営業状況"
        description={`${dateLabel} の出勤、予約、変更、共有用情報をひとつの画面で確認できます。`}
      />
      <TodayDashboard data={data} casts={casts} />
    </PageShell>
  )
}
