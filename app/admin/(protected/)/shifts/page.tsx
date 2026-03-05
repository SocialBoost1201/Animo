import { getWeeklyShifts } from '@/lib/actions/shifts'
import { ShiftManager } from '@/components/features/admin/ShiftManager'

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const targetDate = searchParams.date ? new Date(searchParams.date) : new Date()
  const weeklyData = await getWeeklyShifts(targetDate)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Shifts Management</h1>
          <p className="text-sm text-gray-500 mt-2">1週間の出勤スケジュールの登録と管理（チェックボックス一括更新）</p>
        </div>
      </div>

      <ShiftManager initialData={weeklyData} />
    </div>
  )
}
