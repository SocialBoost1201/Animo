import { getDashboardCastShifts } from '@/lib/actions/dashboard'
import Link from 'next/link'
import { DashboardEmptyState } from './DashboardEmptyState'
import { DashboardTodayShiftsRow } from './DashboardTodayShiftsRow'
import { ChevronRight, Users } from 'lucide-react'

export async function DashboardTodayShifts() {
  const casts = await getDashboardCastShifts()

  const workingCount = casts.filter(
    (c) => c.status === 'working' || c.status === 'confirmed'
  ).length
  const absentCount = casts.filter((c) => c.status === 'absent').length
  const lateCount = casts.filter((c) => c.status === 'late').length
  const trialCount = casts.filter((c) => c.status === 'trial').length

  const summaryParts: string[] = [`出勤 ${workingCount}名`]
  if (absentCount > 0) summaryParts.push(`欠勤 ${absentCount}名`)
  if (lateCount > 0) summaryParts.push(`遅刻 ${lateCount}名`)
  if (trialCount > 0) summaryParts.push(`体験 ${trialCount}名`)

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#ffffff0f] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
              <Users size={15} className="text-[#dfbd69]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-bold text-[#f4f1ea] tracking-[-0.08px] leading-tight">
                本日の出勤キャスト
              </p>
              <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">
                {summaryParts.join(' / ')}
              </p>
            </div>
          </div>
          <Link
            href="/admin/today"
            className="flex items-center gap-2 px-5 h-[40px] rounded-[10px] bg-white/4 border border-gold/40 text-[12px] font-bold text-[#dfbd69] hover:bg-[#dfbd6910] transition-all"
          >
            <span>詳細を表示</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Table */}
        {casts.length === 0 ? (
          <div className="flex-1 p-5">
            <DashboardEmptyState className="min-h-[200px] h-full" />
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <div className="min-w-[960px]">
              {/* Table Header Row */}
              <div className="flex items-center h-[42px] border-t border-b border-[#ffffff0a] px-6 bg-white/1">
                <div className="w-[240px] text-[9px] font-bold tracking-[1px] text-[#5a5650] uppercase">
                  CAST NAME
                </div>
                <div className="w-section text-[9px] font-bold tracking-[1px] text-[#5a5650] uppercase px-6">
                  SHIFT TIME
                </div>
                <div className="w-[220px] text-[9px] font-bold tracking-[1px] text-[#5a5650] uppercase">
                  ATTENDANCE
                </div>
                <div className="flex-1 text-[9px] font-bold tracking-[1px] text-[#5a5650] uppercase px-4">
                  MEMO / TAGS
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#ffffff0a]">
                {casts.map((cast) => (
                  <DashboardTodayShiftsRow key={cast.castId} cast={cast} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
