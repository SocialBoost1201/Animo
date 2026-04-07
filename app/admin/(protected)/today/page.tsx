import { getTodayDashboard } from '@/lib/actions/today'
import { getCasts } from '@/lib/actions/casts'
import { getDashboardKPIs, getDashboardTodayOps } from '@/lib/actions/dashboard'
import { TodayDesktopView } from '@/components/features/admin/today/TodayDesktopView'
import { getJstDateLabel, getJstDateString } from '@/lib/date-utils'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const today     = getJstDateString()
  const dateLabel = getJstDateLabel()

  const [data, castsRaw, kpi, ops] = await Promise.all([
    getTodayDashboard(today),
    getCasts(),
    getDashboardKPIs(),
    getDashboardTodayOps(),
  ])

  const casts = (castsRaw || []).map(c => ({ id: c.id, stage_name: c.stage_name ?? c.name ?? '' }))

  return (
    <TodayDesktopView
      data={data}
      casts={casts}
      kpi={kpi}
      ops={ops}
      dateLabel={dateLabel}
    />
  )
}
