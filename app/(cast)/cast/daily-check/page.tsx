import { redirect } from 'next/navigation'
import { getCurrentCast } from '@/lib/actions/cast-auth'
import { getCastTodayCheckin, getCastTodayReservations } from '@/lib/actions/today'
import { PageHeader, PageShell } from '@/components/ui/app-shell'
import { CastDailyCheckForm } from '@/components/features/today/CastDailyCheckForm'
import { getJstDateString } from '@/lib/date-utils'

export const dynamic = 'force-dynamic'

export default async function CastDailyCheckPage() {
  const cast = await getCurrentCast()
  if (!cast) redirect('/cast/login')

  const [existingCheckin, existingReservations] = await Promise.all([
    getCastTodayCheckin(),
    getCastTodayReservations(),
  ])

  const today = getJstDateString()

  return (
    <PageShell width="narrow" className="space-y-6 px-5 py-8">
      <PageHeader
        eyebrow="Daily Check"
        title="本日の出勤確認・来店確認"
        description={`本日の入力（${today.replace(/-/g, '/')}）をこのページで完結できます。`}
      />

      <CastDailyCheckForm
        existingCheckin={existingCheckin}
        existingReservations={existingReservations}
      />
    </PageShell>
  )
}

