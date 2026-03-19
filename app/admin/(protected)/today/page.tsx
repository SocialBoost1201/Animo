import { getTodayDashboard } from '@/lib/actions/today'
import { getCasts } from '@/lib/actions/casts'
import { TodayDashboard } from '@/components/features/today/TodayDashboard'

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
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-serif tracking-widest text-[#171717] font-bold">本日の営業状況</h1>
        <p className="text-sm text-gray-400 mt-1">{dateLabel}</p>
      </div>

      <TodayDashboard data={data} casts={casts} />
    </div>
  )
}
