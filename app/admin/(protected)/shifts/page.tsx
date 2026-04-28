import { getWeeklySchedules, getMonthlySchedules } from '@/lib/actions/schedules'
import { ShiftManager } from '@/components/features/admin/ShiftManager'
import { CalendarDays, Grid3X3, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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

  const castCount = data.casts?.length ?? 0

  return (
    <div className="space-y-5 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      rounded-[20px] border border-[#dfbd69]/22
                      bg-[linear-gradient(135deg,#181510_0%,#131313_50%,#101010_100%)]
                      px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#dfbd6914] shrink-0">
            <CalendarDays size={20} className="text-[#dfbd69]" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-[-0.31px] text-[#f4f1ea]">
              シフト管理
            </h1>
            <p className="mt-0.5 text-[11px] text-[#8a8478]">
              出勤スケジュールの登録・一括更新
              {castCount > 0 && (
                <span className="ml-2 font-medium text-[#dfbd69]">{castCount}名</span>
              )}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-[10px] border border-[#ffffff0f] bg-[#1c1d22] p-1">
          {[
            { id: 'week',  label: '週次', icon: CalendarDays },
            { id: 'month', label: '月次', icon: Grid3X3 },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = viewType === id
            return (
              <Link
                key={id}
                href={`/admin/shifts?view=${id}`}
                className={`flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#dfbd6920] text-[#dfbd69]'
                    : 'text-[#5a5650] hover:text-[#8a8478]'
                }`}
              >
                <Icon size={12} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Quick Nav ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/admin/shift-requests', label: '出勤調整・承認', sub: '未承認のシフト申請を確認', dot: true },
          { href: '/admin/monthly-shifts', label: 'シフト印刷表',  sub: '月次シフト一覧・エクスポート', dot: false },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-[14px] border border-[#ffffff0f] bg-[#17181c]
                       px-4 py-3 transition-all hover:bg-[#1c1d22] hover:border-[#dfbd69]/20"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-[#dfbd69] shrink-0" />}
                <p className="text-[12px] font-semibold text-[#c7c0b2] truncate">{item.label}</p>
              </div>
              <p className="mt-0.5 text-[10px] text-[#5a5650]">{item.sub}</p>
            </div>
            <ChevronRight size={14} className="text-[#5a5650] group-hover:text-[#dfbd69] transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* ── Shift Manager ── */}
      <ShiftManager
        initialData={{
          casts: data.casts,
          shifts: data.schedules,
          dates: data.dates,
          dailyStaffing: data.dailyStaffing,
        }}
        viewType={viewType}
      />

    </div>
  )
}
