'use client'

import { useOptimistic, useTransition } from 'react'
import { updateDailyCastAttendance } from '@/lib/actions/today'
import type { DashboardCastShift, ManualAttendanceStatus } from '@/lib/actions/dashboard'

// ──────────────────────────────────────────────────────
// Status badge config — includes manual override states
// ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: {
    label: '確定',
    bg: 'bg-[#50a06414]',
    border: 'border-[#50a0642e]',
    textColor: 'text-[#72b894]',
    dot: 'bg-[#72b894]',
  },
  working: {
    label: '出勤',
    bg: 'bg-[#50a06414]',
    border: 'border-[#50a0642e]',
    textColor: 'text-[#72b894]',
    dot: 'bg-[#72b894]',
  },
  late: {
    label: '予定遅刻',
    bg: 'bg-[#c8823214]',
    border: 'border-[#c882322e]',
    textColor: 'text-[#c8884d]',
    dot: 'bg-[#c8884d]',
  },
  trial: {
    label: '体験入店',
    bg: 'bg-[#dfbd6914]',
    border: 'border-[#dfbd692e]',
    textColor: 'text-[#dfbd69]',
    dot: 'bg-[#dfbd69]',
  },
  absent: {
    label: '欠勤',
    bg: 'bg-[#e05c5c14]',
    border: 'border-[#e05c5c2e]',
    textColor: 'text-[#e08080]',
    dot: 'bg-[#e08080]',
  },
  pending: {
    label: '確認待ち',
    bg: 'bg-[#8a847814]',
    border: 'border-[#8a84782e]',
    textColor: 'text-[#8a8478]',
    dot: 'bg-[#8a8478]',
  },
} as const

const SOURCE_LABEL: Record<string, string> = {
  manual: '手動変更',
  checkin: '今日の回答',
  shift: 'シフト申請',
  none: '',
}

// ──────────────────────────────────────────────────────
// Row component
// ──────────────────────────────────────────────────────
export function DashboardTodayShiftsRow({ cast }: { cast: DashboardCastShift }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticManual, setOptimisticManual] = useOptimistic<ManualAttendanceStatus>(
    cast.manualStatus
  )

  const isTrial = cast.castId.startsWith('trial-')

  function handleOverride(status: ManualAttendanceStatus): void {
    if (isTrial) return
    setOptimisticManual(status)
    startTransition(async () => {
      await updateDailyCastAttendance({ castId: cast.castId, status })
    })
  }

  const cfg = STATUS_CONFIG[cast.status] ?? STATUS_CONFIG.pending
  const sourceLabel = SOURCE_LABEL[cast.finalStatusSource] ?? ''

  return (
    <div
      className={`flex items-center min-h-[60px] hover:bg-white/2 transition-colors px-6 ${isPending ? 'opacity-70' : ''}`}
    >
      {/* Cast name */}
      <div className="w-[240px] flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#1c1d22] border border-[#ffffff0a] flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xl">
          {cast.avatarUrl ? (
            <img
              src={cast.avatarUrl}
              alt={cast.castName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-[11px] font-bold text-[#5a5650]">{cast.initial}</span>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
        </div>
        <span className="text-[14px] font-bold text-[#f4f1ea] tracking-tight">{cast.castName}</span>
      </div>

      {/* Shift time */}
      <div className="w-section px-6 shrink-0">
        <div className="inline-flex items-center gap-2 text-[14px] font-bold text-gold font-sans bg-gold/5 px-3 py-1.5 rounded-[6px] border border-gold/10">
          <span>{cast.startTime}</span>
          <span className="text-[#5a5650] font-normal opacity-50">—</span>
          <span className="text-[#8a8478] font-medium">{cast.endTime || '—'}</span>
        </div>
      </div>

      {/* Attendance status + manual override controls */}
      <div className="w-[220px] shrink-0 flex flex-col gap-2 py-2">
        {/* Status badge + source */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 ${cfg.bg} rounded-full border ${cfg.border} shadow-sm`}
          >
            <div className={`w-[5px] h-[5px] rounded-full ${cfg.dot}`} />
            <span className={`font-sans text-[10px] font-bold tracking-[0.1px] leading-[14px] ${cfg.textColor}`}>
              {cfg.label}
            </span>
          </div>
          {sourceLabel && (
            <span className="text-[9px] text-[#5a5650] tracking-wide font-medium">{sourceLabel}</span>
          )}
        </div>

        {/* Override buttons — hidden for trial entries */}
        {!isTrial && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleOverride('working')}
              disabled={isPending}
              aria-pressed={optimisticManual === 'working'}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-[5px] border transition-all min-h-[28px] min-w-[44px] ${
                optimisticManual === 'working'
                  ? 'bg-[#72b89420] border-[#72b89450] text-[#72b894]'
                  : 'bg-white/3 border-white/8 text-[#5a5650] hover:text-[#72b894] hover:border-[#72b89430] hover:bg-[#72b89410]'
              } disabled:cursor-not-allowed`}
            >
              出勤
            </button>
            <button
              type="button"
              onClick={() => handleOverride('absent')}
              disabled={isPending}
              aria-pressed={optimisticManual === 'absent'}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-[5px] border transition-all min-h-[28px] min-w-[44px] ${
                optimisticManual === 'absent'
                  ? 'bg-[#e0808020] border-[#e0808050] text-[#e08080]'
                  : 'bg-white/3 border-white/8 text-[#5a5650] hover:text-[#e08080] hover:border-[#e0808030] hover:bg-[#e0808010]'
              } disabled:cursor-not-allowed`}
            >
              欠勤
            </button>
            <button
              type="button"
              onClick={() => handleOverride('undecided')}
              disabled={isPending}
              aria-pressed={optimisticManual === 'undecided'}
              title="手動変更をリセット"
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-[5px] border transition-all min-h-[28px] min-w-[28px] ${
                optimisticManual === 'undecided'
                  ? 'bg-white/5 border-white/15 text-[#8a8478]'
                  : 'bg-white/2 border-white/5 text-[#3a3830] hover:text-[#8a8478] hover:border-white/15'
              } disabled:cursor-not-allowed`}
            >
              —
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex-1 px-4 flex flex-wrap gap-2 items-center">
        {cast.tags.length > 0 ? (
          cast.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-white/3 border border-white/5 rounded-[6px] font-sans text-[10px] font-semibold text-[#8a8478] tracking-[0.117px] leading-[14px] hover:text-[#dfbd69] transition-colors"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-[#5a5650] tracking-widest opacity-40">—</span>
        )}
      </div>
    </div>
  )
}
