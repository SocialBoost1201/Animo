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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Shifts Management</h1>
          <p className="text-sm text-gray-500 mt-2">出勤スケジュールの登録と管理（チェックボックス一括更新）</p>
        </div>
      </div>

      <ShiftManager 
        initialData={{ casts: data.casts, shifts: data.schedules, dates: data.dates }} 
        viewType={viewType}
      />
    </div>
  )
}
