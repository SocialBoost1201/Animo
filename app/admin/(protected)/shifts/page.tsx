import { getWeeklySchedules, getMonthlySchedules } from '@/lib/actions/schedules'
import { ShiftManager } from '@/components/features/admin/ShiftManager'

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams: { date?: string; view?: string }
}) {
  const targetDate = searchParams.date ? new Date(searchParams.date) : new Date()
  const viewType = searchParams.view === 'month' ? 'month' : 'week'
  const data = viewType === 'month' 
    ? await getMonthlySchedules(targetDate)
    : await getWeeklySchedules(targetDate)

  return (
    <div className="space-y-[14px] font-inter">
      <div className="flex flex-col gap-0.5 h-[49px] justify-center">
        <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">シフト管理</h1>
        <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">出勤スケジュールの登録と管理（一括更新・保存）</p>
      </div>

      <ShiftManager 
        initialData={{ casts: data.casts, shifts: data.schedules, dates: data.dates }} 
        viewType={viewType}
      />
    </div>
  )
}
