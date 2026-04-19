'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Calendar, Plus, AlertTriangle, StickyNote,
  Users, Clock, Copy, CheckCheck, Trash2,
} from 'lucide-react'
import {
  type TodayDashboardData,
  addDispatch, deleteDispatch,
  addTrial, deleteTrial,
  addShiftChange, deleteShiftChange,
  addStaffAttendance, deleteStaffAttendance,
  approveCheckin,
  rejectCheckin,
  approveReservation,
  rejectReservation,
  generateLineText,
} from '@/lib/actions/today'
import { type DashboardKPIData } from '@/lib/actions/dashboard'
import { type DashboardTodayOpsData } from '@/lib/actions/dashboard'

type Cast = { id: string; stage_name: string }

type Props = {
  data: TodayDashboardData
  casts: Cast[]
  kpi: DashboardKPIData
  ops: DashboardTodayOpsData
  dateLabel: string
}

type ActionResult<T = void> =
  | { success: true; data?: T; id?: string }
  | { success?: false; error: string }

type Tab = 'all' | 'cast' | 'visit' | 'staff' | 'unconfirmed'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',         label: '全体' },
  { id: 'cast',        label: 'キャスト' },
  { id: 'visit',       label: '来店' },
  { id: 'staff',       label: 'スタッフ' },
  { id: 'unconfirmed', label: '要確認' },
]

// ── Inline input style ──────────────────────────────────────────────────────
const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-[12px] text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-gold/40 transition-all outline-none'

function createTempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sortByStartTime<T extends { start_time: string }>(items: T[]) {
  return [...items].sort((a, b) => a.start_time.localeCompare(b.start_time))
}

function sortReservationsByVisitTime<T extends { visit_time: string }>(items: T[]) {
  return [...items].sort((a, b) => a.visit_time.localeCompare(b.visit_time))
}

// ── Tiny Badge ──────────────────────────────────────────────────────────────
function Badge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'red' | 'blue' | 'green' | 'orange' | 'purple' }) {
  const palette: Record<string, string> = {
    gold:   'bg-gold/10 text-gold border border-gold/20',
    red:    'bg-red-500/10 text-red-400 border border-red-500/20',
    blue:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    green:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  }
  return (
    <span className={`text-[9px] font-bold tracking-[0.05em] px-2 py-0.5 rounded-sm ${palette[color]}`}>
      {children}
    </span>
  )
}

// ── Section row ─────────────────────────────────────────────────────────────
function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center h-[36px] gap-3 px-3 hover:bg-white/3 rounded-sm transition-colors ${className}`}>
      {children}
    </div>
  )
}

// ── Add form wrapper ─────────────────────────────────────────────────────────
function AddFormWrapper({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-sm bg-black/40 border border-white/10 p-4 space-y-3 backdrop-blur-sm">
      {children}
      <button
        type="button"
        onClick={onClose}
        className="text-[11px] font-bold tracking-widest text-[#5a5650] hover:text-[#f4f1ea] transition-colors uppercase"
      >
        CANCEL
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function TodayDesktopView({ data, casts, kpi, ops, dateLabel }: Props) {
  const [isPending, startTransition] = useTransition()
  const [dashboardData, setDashboardData] = useState(data)
  const [activeTab, setActiveTab]   = useState<Tab>('all')
  const [copied, setCopied]         = useState(false)
  const [lineText, setLineText]     = useState('')
  const [pendingKeys, setPendingKeys] = useState<string[]>([])

  // ── Forms visibility ────────────────────────────────────────────────────
  const [showDispatch, setShowDispatch] = useState(false)
  const [showTrial,    setShowTrial]    = useState(false)
  const [showChange,   setShowChange]   = useState(false)
  const [showStaff,    setShowStaff]    = useState(false)

  // ── Derived data ─────────────────────────────────────────────────────────
  useEffect(() => {
    setDashboardData(data)
  }, [data])

  const activeCasts    = dashboardData.shifts.filter(s => !dashboardData.absentCastIds.includes(s.cast_id))
  const confirmedCount = activeCasts.length + dashboardData.dispatches.length
  const douhanCount    = dashboardData.reservations.filter(r => r.reservation_type === 'douhan').length
  const absentNames    = [
    ...dashboardData.shifts.filter(s => dashboardData.absentCastIds.includes(s.cast_id)).map(s => s.stage_name),
    ...dashboardData.shiftChanges.filter(c => !c.new_time).map(c => c.stage_name),
  ]

  const alerts: { label: string; detail: string; level: 'danger' | 'warn' }[] = []
  if (kpi.shiftMissingCount > 0)
    alerts.push({ label: 'シフト未提出', detail: `${kpi.shiftMissingCount}名が今週未提出`, level: 'warn' })
  if (dashboardData.unconfirmedCasts.length > 0)
    alerts.push({ label: '来店予定未確定', detail: `${dashboardData.unconfirmedCasts.length}名が確認待ち`, level: 'danger' })
  const pendingApprovalCount = dashboardData.pendingCheckins.length + dashboardData.pendingReservations.length
  if (pendingApprovalCount > 0)
    alerts.push({ label: '承認待ち', detail: `${pendingApprovalCount}件の当日提出が承認待ち`, level: 'warn' })
  if (kpi.unreadApplications > 0)
    alerts.push({ label: '未返信案件', detail: `応募返信待ち ${kpi.unreadApplications}件`, level: 'warn' })

  // ── LINE text generation ─────────────────────────────────────────────────
  const refreshLineText = useCallback(() => {
    generateLineText(dashboardData).then(setLineText)
  }, [dashboardData])

  useEffect(() => { refreshLineText() }, [refreshLineText])

  const setBusy = (key: string, busy: boolean) => {
    setPendingKeys((current) =>
      busy ? (current.includes(key) ? current : [...current, key]) : current.filter((entry) => entry !== key)
    )
  }

  const isBusy = (key: string) => pendingKeys.includes(key)

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!lineText) return
    await navigator.clipboard.writeText(lineText)
    setCopied(true)
    toast.success('コピーしました')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAction = async <T,>(
    key: string,
    optimisticUpdate: () => void,
    rollback: () => void,
    action: () => Promise<ActionResult<T>>
  ) => {
    optimisticUpdate()
    setBusy(key, true)
    startTransition(async () => {
      const result = await action()
      setBusy(key, false)
      if ('error' in result && result.error) {
        rollback()
        toast.error(result.error)
      }
    })
  }

  // ── KPI cards ─────────────────────────────────────────────────────────────
  const kpiCards = [
    { label: '確定出勤',   value: confirmedCount,               unit: '名' },
    { label: '未確認',     value: dashboardData.unconfirmedCasts.length, unit: '名' },
    { label: '来店予定',   value: dashboardData.reservations.length,     unit: '件' },
    { label: '同伴',       value: douhanCount,                  unit: '件' },
    { label: '体入',       value: dashboardData.trials.length,           unit: '名' },
  ]

  // ── Tab content ───────────────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllTab data={dashboardData} activeCasts={activeCasts} absentNames={absentNames} />
      case 'cast':
        return (
          <CastTab
            data={dashboardData}
            activeCasts={activeCasts}
            absentNames={absentNames}
            handleAction={handleAction}
            isBusy={isBusy}
            setDashboardData={setDashboardData}
            casts={casts}
            showDispatch={showDispatch}
            setShowDispatch={setShowDispatch}
            showTrial={showTrial}
            setShowTrial={setShowTrial}
            showChange={showChange}
            setShowChange={setShowChange}
            setBusy={setBusy}
          />
        )
      case 'visit':
        return <VisitTab data={dashboardData} />
      case 'staff':
        return (
          <StaffTab
            data={dashboardData}
            handleAction={handleAction}
            isBusy={isBusy}
            setDashboardData={setDashboardData}
            showStaff={showStaff}
            setShowStaff={setShowStaff}
            setBusy={setBusy}
          />
        )
      case 'unconfirmed':
        return (
          <UnconfirmedTab
            data={dashboardData}
            handleAction={handleAction}
            setDashboardData={setDashboardData}
            isBusy={isBusy}
          />
        )
    }
  }

  return (
    <div className="space-y-6 font-sans">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 py-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#f4f1ea] tracking-tight font-serif uppercase">Operation Dashboard</h1>
          <p className="text-[11px] font-bold tracking-[2px] text-[#8a8478] uppercase">当日オペレーション・一元管理</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white/3 rounded-sm border border-white/10">
            <Calendar size={14} className="text-gold" />
            <span className="text-xs font-bold text-[#c7c0b2] tracking-[0.2em] uppercase">{dateLabel}</span>
          </div>

          <button
            onClick={() => setActiveTab('visit')}
            className="group relative flex items-center gap-2 px-6 py-2.5 bg-gold rounded-sm text-[11px] font-bold text-black tracking-[2px] uppercase transition-all hover:bg-[#e6c982] active:scale-[0.98]"
          >
            <Plus size={14} strokeWidth={3} />
            Check Reservations
          </button>
        </div>
      </div>

      {/* ── KPI Bar ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col bg-black/94 rounded-[18px] border border-[#ffffff10] px-6 py-5 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] backdrop-blur-md"
          >
            <p className="text-[10px] font-bold text-[#8a8478] tracking-[2px] uppercase mb-2">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#f4f1ea] leading-none tracking-tight">{card.value}</span>
              <span className="text-xs font-bold text-[#5a5650] uppercase">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* ── Left: Ops Table ─────────────────────────────────────────── */}
        <div className="flex flex-col bg-black/94 rounded-[18px] border border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] backdrop-blur-md overflow-hidden min-h-[520px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-6 pb-0 border-b border-white/5 bg-white/1">
            {TABS.map((tab) => {
              const count = tab.id === 'unconfirmed' ? dashboardData.unconfirmedCasts.length : undefined
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 text-[11px] font-bold tracking-[2px] uppercase transition-all ${
                    activeTab === tab.id
                      ? 'text-[#f4f1ea] bg-white/3'
                      : 'text-[#5a5650] hover:text-[#8a8478] hover:bg-white/1'
                  }`}
                >
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-sm bg-red-500 text-[9px] font-bold text-white shadow-lg shadow-red-500/20">
                      {count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold shadow-[0_0_10px_rgba(223,189,105,0.4)]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Body */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {renderTabContent()}
          </div>
        </div>

        {/* ── Right: Alerts + Memo ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Alerts */}
          <div className="flex flex-col bg-black/94 rounded-sm border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-3 px-6 h-[64px] border-b border-white/5 bg-white/1">
              <div className="w-[32px] h-[32px] flex items-center justify-center bg-red-500/10 rounded-sm">
                <AlertTriangle size={16} className="text-red-400" strokeWidth={2} />
              </div>
              <p className="text-[11px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">Alerts</p>
            </div>
            <div className="p-4 space-y-3">
              {alerts.length === 0 ? (
                <p className="text-[11px] text-[#5a5650] italic text-center py-6 font-sans">No alerts available</p>
              ) : alerts.map((a) => (
                <div
                  key={a.label}
                  className={`rounded-sm border p-4 transition-all duration-300 ${
                    a.level === 'danger'
                      ? 'border-red-500/20 bg-red-500/5'
                      : 'border-orange-500/20 bg-orange-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${a.level === 'danger' ? 'bg-red-500' : 'bg-orange-500'}`} />
                    <p className={`text-[11px] font-bold tracking-wide font-sans ${a.level === 'danger' ? 'text-red-400' : 'text-orange-400'}`}>{a.label}</p>
                  </div>
                  <p className="text-[10px] text-[#8a8478] leading-relaxed pl-3.5 italic font-sans">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div className="flex flex-col bg-black/94 rounded-sm border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden flex-1">
            <div className="flex items-center gap-3 px-6 h-[64px] border-b border-white/5 bg-white/1">
              <div className="w-[32px] h-[32px] flex items-center justify-center bg-gold/10 rounded-sm">
                <StickyNote size={16} className="text-gold" strokeWidth={2} />
              </div>
              <p className="text-[11px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">Operations Memo</p>
            </div>
            <div className="p-4 space-y-3">
              {([
                { type: 'VIP',   content: ops.vipMemo,    color: 'text-gold border-gold/20 bg-gold/5' },
                { type: 'EVENT', content: ops.eventMemo,  color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                { type: 'STAFF', content: ops.urgentMemo, color: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
              ] as const).map((m) => (
                <div key={m.type} className={`rounded-sm border p-4 transition-all hover:bg-white/2 ${m.color}`}>
                  <p className={`text-[9px] font-bold tracking-[2px] uppercase mb-2 opacity-80 ${m.color.split(' ')[0]}`}>{m.type}</p>
                  <div className="text-[11px] text-[#cbc3b3] leading-relaxed italic font-sans">
                    {m.content ?? <span className="opacity-40 italic">Not set</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

       {/* ── LINE Share ───────────────────────────────────────────────────── */}
      <div className="flex flex-col bg-black/94 rounded-sm border border-gold/30 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[64px] border-b border-white/5 bg-white/1">
          <div className="flex items-center gap-3">
            <div className="w-[32px] h-[32px] flex items-center justify-center bg-gold/10 rounded-sm">
              <Copy size={16} className="text-gold" strokeWidth={2} />
            </div>
            <p className="text-[11px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">LINE Distribution Text</p>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-bold tracking-[2px] transition-all uppercase shadow-lg ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-gold text-black hover:bg-[#e6c982]'
            }`}
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? 'COPIED' : 'COPY TEXT'}
          </button>
        </div>
        <div className="p-6 bg-white/1">
          <pre className="text-[12px] text-[#cbc3b3] leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-5 rounded-sm border border-white/5 scrollbar-thin">
            {lineText || 'Generating content...'}
          </pre>
        </div>
      </div>

      {/* Pending indicator */}
      {isPending && (
        <div className="fixed bottom-8 right-8 bg-black/94 border border-white/10 text-gold text-[10px] font-bold tracking-[2px] px-6 py-3 rounded-sm shadow-2xl backdrop-blur-md uppercase animate-in fade-in slide-in-from-bottom-4">
          Processing...
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: 全体
// ─────────────────────────────────────────────────────────────────────────────
function AllTab({
  data,
  activeCasts,
  absentNames,
}: {
  data: TodayDashboardData
  activeCasts: TodayDashboardData['shifts']
  absentNames: string[]
}) {
  // Group active casts by start_time
  const groups: Record<string, { casts: string[]; dispatches: string[] }> = {}
  for (const s of activeCasts) {
    const t = s.start_time.substring(0, 5)
    if (!groups[t]) groups[t] = { casts: [], dispatches: [] }
    groups[t].casts.push(s.stage_name)
  }
  for (const d of data.dispatches) {
    const t = d.start_time.substring(0, 5)
    if (!groups[t]) groups[t] = { casts: [], dispatches: [] }
    groups[t].dispatches.push(d.name)
  }
  const sortedGroups = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="space-y-6">
      {/* Cast groups */}
      {sortedGroups.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2 px-3">出勤キャスト</p>
          {sortedGroups.map(([time, group]) => (
            <div key={time} className="mb-4">
              <div className="flex items-center gap-2 px-3 mb-2">
                <Clock size={12} className="text-gold" />
                <span className="text-[11px] font-bold text-gold tracking-tight">{time}〜</span>
                <span className="text-[10px] font-bold text-[#5a5650] tracking-wide ml-1">{group.casts.length + group.dispatches.length}名</span>
              </div>
              <div className="pl-6 space-y-0.5">
                {group.casts.map(name => (
                  <Row key={name}>
                    <span className="text-[12px] text-[#cbc3b3]">{name}</span>
                  </Row>
                ))}
                {group.dispatches.map(name => (
                  <Row key={name}>
                    <Badge color="blue">派遣</Badge>
                    <span className="text-[12px] text-[#cbc3b3]">{name}</span>
                  </Row>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trials */}
      {data.trials.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2 px-3">体入</p>
          {data.trials.map(t => (
            <Row key={t.id}>
              <Badge color="purple">TRIAL</Badge>
              <span className="text-[12px] font-bold text-[#cbc3b3]">{t.name}</span>
              <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{t.start_time.substring(0, 5)}〜</span>
            </Row>
          ))}
        </div>
      )}

      {/* Staff */}
      {data.staffAttendances.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2 px-3">スタッフ</p>
          {data.staffAttendances.map(s => (
            <Row key={s.id}>
              <Users size={12} className="text-[#5a5650]" />
              <span className="text-[12px] font-bold text-[#cbc3b3]">{s.display_name}</span>
              <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{s.start_time.substring(0, 5)}〜</span>
            </Row>
          ))}
        </div>
      )}

      {/* Changes */}
      {data.shiftChanges.filter(c => c.new_time).length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2 px-3">当日変更</p>
          {data.shiftChanges.filter(c => c.new_time).map(c => (
            <Row key={c.id}>
              <Badge color="orange">CHANGE</Badge>
              <span className="text-[12px] font-bold text-[#cbc3b3]">{c.stage_name}</span>
              <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">
                {c.original_time?.substring(0, 5)} → {c.new_time?.substring(0, 5)}
              </span>
            </Row>
          ))}
        </div>
      )}

      {/* Absent */}
      {absentNames.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2 px-3">当日欠勤</p>
          {[...new Set(absentNames)].map(name => (
            <Row key={name}>
              <Badge color="red">ABSENT</Badge>
              <span className="text-[12px] font-bold text-[#d4785a]">{name}</span>
            </Row>
          ))}
        </div>
      )}

      {sortedGroups.length === 0 && data.trials.length === 0 && (
        <p className="text-[12px] text-[#5a5650] italic text-center py-12">No data recorded for today.</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: キャスト
// ─────────────────────────────────────────────────────────────────────────────
function CastTab({
  data, activeCasts, absentNames, handleAction, isBusy, setDashboardData, casts,
  showDispatch, setShowDispatch, showTrial, setShowTrial, showChange, setShowChange, setBusy,
}: {
  data: TodayDashboardData
  activeCasts: TodayDashboardData['shifts']
  absentNames: string[]
  handleAction: <T,>(key: string, optimisticUpdate: () => void, rollback: () => void, action: () => Promise<ActionResult<T>>) => void
  isBusy: (key: string) => boolean
  setDashboardData: React.Dispatch<React.SetStateAction<TodayDashboardData>>
  casts: Cast[]
  showDispatch: boolean
  setShowDispatch: (v: boolean) => void
  showTrial: boolean
  setShowTrial: (v: boolean) => void
  showChange: boolean
  setShowChange: (v: boolean) => void
  setBusy: (key: string, busy: boolean) => void
}) {
  return (
    <div className="space-y-6">
      {/* Active casts */}
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-3 px-3 flex items-center justify-between font-sans">
          <span>ACTIVE CASTS ({activeCasts.length + data.dispatches.length})</span>
          <button
            onClick={() => setShowDispatch(!showDispatch)}
            className="flex items-center gap-1.5 text-gold hover:text-[#e6c982] transition-colors"
          >
            <Plus size={12} strokeWidth={2.5} />
            <span className="text-[9px] font-bold tracking-widest uppercase">ADD DISPATCH</span>
          </button>
        </p>
        {activeCasts.map(s => (
          <Row key={s.cast_id}>
            <span className="text-[12px] font-bold text-[#cbc3b3]">{s.stage_name}</span>
            <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{s.start_time.substring(0, 5)}〜</span>
          </Row>
        ))}
        {data.dispatches.map(d => (
          <Row key={d.id}>
            <Badge color="blue">DISPATCH</Badge>
            <span className="text-[12px] font-bold text-[#cbc3b3]">{d.name}</span>
            <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{d.start_time.substring(0, 5)}〜</span>
            <button
              disabled={isBusy(`dispatch-${d.id}`)}
              onClick={() => {
                const previousDispatches = data.dispatches
                handleAction(
                  `dispatch-${d.id}`,
                  () => {
                    setDashboardData((current) => ({
                      ...current,
                      dispatches: current.dispatches.filter((entry) => entry.id !== d.id),
                    }))
                  },
                  () => {
                    setDashboardData((current) => ({ ...current, dispatches: previousDispatches }))
                  },
                  () => deleteDispatch(d.id)
                )
              }}
              className="ml-2 text-[#5a5650] hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </Row>
        ))}
        {showDispatch && (
          <AddFormWrapper onClose={() => setShowDispatch(false)}>
            <form
              action={async (fd) => {
                const tempId = createTempId()
                const tempDispatch = {
                  id: tempId,
                  name: String(fd.get('name') || '').trim(),
                  start_time: String(fd.get('start_time') || ''),
                }
                fd.set('dispatch_date', data.date)
                setShowDispatch(false)
                setDashboardData((current) => ({
                  ...current,
                  dispatches: sortByStartTime([...current.dispatches, tempDispatch]),
                }))
                setBusy('add-dispatch', true)

                void (async () => {
                  const result = await addDispatch(fd) as ActionResult<typeof tempDispatch>
                  setBusy('add-dispatch', false)

                  if ('error' in result && result.error) {
                    setDashboardData((current) => ({
                      ...current,
                      dispatches: current.dispatches.filter((entry) => entry.id !== tempId),
                    }))
                    toast.error(result.error)
                    return
                  }

                  if (result.data) {
                    setDashboardData((current) => ({
                      ...current,
                      dispatches: sortByStartTime(current.dispatches.map((entry) => (entry.id === tempId ? result.data! : entry))),
                    }))
                  }
                })()
              }}
              className="space-y-3"
            >
              <input name="name" type="text" placeholder="Cast Name" required className={inputCls} />
              <input name="start_time" type="time" required className={inputCls} />
              <button type="submit" disabled={isBusy('add-dispatch')} className="w-full py-2 bg-gold text-black text-[10px] font-bold tracking-widest rounded-sm uppercase hover:bg-[#e6c982] transition-all disabled:opacity-60">ADD DISPATCH</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Trials */}
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-3 px-3 flex items-center justify-between font-sans">
          <span>TRIALS ({data.trials.length})</span>
          <button
            onClick={() => setShowTrial(!showTrial)}
            className="flex items-center gap-1.5 text-gold hover:text-[#e6c982] transition-colors"
          >
            <Plus size={12} strokeWidth={2.5} />
            <span className="text-[9px] font-bold tracking-widest uppercase">ADD</span>
          </button>
        </p>
        {data.trials.length === 0 && !showTrial && (
          <p className="text-[11px] text-[#5a5650] italic px-3 py-2 font-sans">No trials recorded for today.</p>
        )}
        {data.trials.map(t => (
          <Row key={t.id}>
            <Badge color="purple">TRIAL</Badge>
            <span className="text-[12px] font-bold text-[#cbc3b3]">{t.name}</span>
            <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{t.start_time.substring(0, 5)}〜</span>
            <button
              disabled={isBusy(`trial-${t.id}`)}
              onClick={() => {
                const previousTrials = data.trials
                handleAction(
                  `trial-${t.id}`,
                  () => {
                    setDashboardData((current) => ({
                      ...current,
                      trials: current.trials.filter((entry) => entry.id !== t.id),
                    }))
                  },
                  () => {
                    setDashboardData((current) => ({ ...current, trials: previousTrials }))
                  },
                  () => deleteTrial(t.id)
                )
              }}
              className="ml-2 text-[#5a5650] hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </Row>
        ))}
        {showTrial && (
          <AddFormWrapper onClose={() => setShowTrial(false)}>
            <form
              action={async (fd) => {
                const tempId = createTempId()
                const tempTrial = {
                  id: tempId,
                  name: String(fd.get('name') || '').trim(),
                  start_time: String(fd.get('start_time') || ''),
                }
                fd.set('trial_date', data.date)
                setShowTrial(false)
                setDashboardData((current) => ({
                  ...current,
                  trials: sortByStartTime([...current.trials, tempTrial]),
                }))
                setBusy('add-trial', true)

                void (async () => {
                  const result = await addTrial(fd) as ActionResult<typeof tempTrial>
                  setBusy('add-trial', false)

                  if ('error' in result && result.error) {
                    setDashboardData((current) => ({
                      ...current,
                      trials: current.trials.filter((entry) => entry.id !== tempId),
                    }))
                    toast.error(result.error)
                    return
                  }

                  if (result.data) {
                    setDashboardData((current) => ({
                      ...current,
                      trials: sortByStartTime(current.trials.map((entry) => (entry.id === tempId ? result.data! : entry))),
                    }))
                  }
                })()
              }}
              className="space-y-3"
            >
              <input name="name" type="text" placeholder="Trial Cast Name" required className={inputCls} />
              <input name="start_time" type="time" required className={inputCls} />
              <button type="submit" disabled={isBusy('add-trial')} className="w-full py-2 bg-gold text-black text-[10px] font-bold tracking-widest rounded-sm uppercase hover:bg-[#e6c982] transition-all disabled:opacity-60">ADD TRIAL</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Changes */}
      <div>
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-3 px-3 flex items-center justify-between font-sans">
          <span>SHIFT CHANGES</span>
          <button
            onClick={() => setShowChange(!showChange)}
            className="flex items-center gap-1.5 text-gold hover:text-[#e6c982] transition-colors"
          >
            <Plus size={12} strokeWidth={2.5} />
            <span className="text-[9px] font-bold tracking-widest uppercase">ADD</span>
          </button>
        </p>
        {data.shiftChanges.filter(c => c.new_time).length === 0 && !showChange && (
          <p className="text-[11px] text-[#5a5650] italic px-3 py-2 font-sans">No shift changes today.</p>
        )}
        {data.shiftChanges.filter(c => c.new_time).map(c => (
          <Row key={c.id}>
            <Badge color="orange">CHANGE</Badge>
            <span className="text-[12px] font-bold text-[#cbc3b3]">{c.stage_name}</span>
            <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">
              {c.original_time?.substring(0, 5)} → {c.new_time?.substring(0, 5)}
            </span>
            <button
              disabled={isBusy(`change-${c.id}`)}
              onClick={() => {
                const previousChanges = data.shiftChanges
                handleAction(
                  `change-${c.id}`,
                  () => {
                    setDashboardData((current) => ({
                      ...current,
                      shiftChanges: current.shiftChanges.filter((entry) => entry.id !== c.id),
                    }))
                  },
                  () => {
                    setDashboardData((current) => ({ ...current, shiftChanges: previousChanges }))
                  },
                  () => deleteShiftChange(c.id)
                )
              }}
              className="ml-2 text-[#5a5650] hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </Row>
        ))}
        {showChange && (
          <AddFormWrapper onClose={() => setShowChange(false)}>
            <form
              action={async (fd) => {
                const tempId = createTempId()
                const castId = String(fd.get('cast_id') || '')
                const cast = casts.find((entry) => entry.id === castId)
                const tempChange = {
                  id: tempId,
                  cast_id: castId,
                  stage_name: cast?.stage_name || '不明',
                  original_time: (String(fd.get('original_time') || '') || null) as string | null,
                  new_time: (String(fd.get('new_time') || '') || null) as string | null,
                  note: (String(fd.get('note') || '') || null) as string | null,
                }
                fd.set('change_date', data.date)
                setShowChange(false)
                setDashboardData((current) => ({
                  ...current,
                  shiftChanges: [...current.shiftChanges, tempChange],
                }))
                setBusy('add-change', true)

                void (async () => {
                  const result = await addShiftChange(fd) as ActionResult<{
                    id: string
                    cast_id: string
                    original_time?: string | null
                    new_time?: string | null
                    note?: string | null
                  }>
                  setBusy('add-change', false)

                  if ('error' in result && result.error) {
                    setDashboardData((current) => ({
                      ...current,
                      shiftChanges: current.shiftChanges.filter((entry) => entry.id !== tempId),
                    }))
                    toast.error(result.error)
                    return
                  }

                  if (result.data) {
                    setDashboardData((current) => ({
                      ...current,
                      shiftChanges: current.shiftChanges.map((entry) =>
                        entry.id === tempId
                          ? {
                              ...entry,
                              id: result.data!.id,
                              cast_id: result.data!.cast_id,
                              original_time: result.data!.original_time ?? undefined,
                              new_time: result.data!.new_time ?? undefined,
                              note: result.data!.note ?? undefined,
                            }
                          : entry
                      ),
                    }))
                  }
                })()
              }}
              className="space-y-3"
            >
              <select name="cast_id" required className={inputCls}>
                <option value="">Select Cast</option>
                {casts.map(c => <option key={c.id} value={c.id}>{c.stage_name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input name="original_time" type="time" placeholder="From" className={inputCls} />
                <input name="new_time"      type="time" placeholder="To" className={inputCls} />
              </div>
              <input name="note" type="text" placeholder="Note (e.g. Douhan)" className={inputCls} />
              <button type="submit" disabled={isBusy('add-change')} className="w-full py-2 bg-gold text-black text-[10px] font-bold tracking-widest rounded-sm uppercase hover:bg-[#e6c982] transition-all disabled:opacity-60">ADD CHANGE</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Absent */}
      {absentNames.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-3 px-3 font-sans">ABSENT CASTS</p>
          {[...new Set(absentNames)].map(name => (
            <Row key={name}>
              <Badge color="red">ABSENT</Badge>
              <span className="text-[12px] font-bold text-red-400">{name}</span>
            </Row>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: 来店
// ─────────────────────────────────────────────────────────────────────────────
function VisitTab({ data }: { data: TodayDashboardData }) {
  return (
    <div className="space-y-1">
      {data.reservations.length === 0 ? (
        <p className="text-[11px] text-[#5a5650] italic text-center py-12 font-sans uppercase tracking-widest">No reservations found</p>
      ) : (
        <>
          {/* Table header */}
          <div className="flex items-center h-[32px] px-3 mb-1 border-b border-white/5">
            <span className="text-[9px] font-bold tracking-[2px] text-[#5a5650] uppercase w-14">Time</span>
            <span className="text-[9px] font-bold tracking-[2px] text-[#5a5650] uppercase w-24">Cast</span>
            <span className="text-[9px] font-bold tracking-[2px] text-[#5a5650] uppercase flex-1">Guest</span>
            <span className="text-[9px] font-bold tracking-[2px] text-[#5a5650] uppercase w-16 text-right">Type</span>
          </div>
          {data.reservations.map(r => (
            <div key={r.id} className="flex items-center h-[40px] px-3 hover:bg-white/3 rounded-sm transition-colors border-b border-white/2 last:border-0 group">
              <span className="text-[12px] font-bold text-gold w-14 shrink-0 transition-all group-hover:tracking-wider">
                {r.visit_time.substring(0, 5)}
              </span>
              <span className="text-[12px] font-bold text-[#f4f1ea] w-24 truncate shrink-0">{r.stage_name}</span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[12px] text-[#cbc3b3] truncate">{r.guest_name} 様</span>
                {r.guest_count && (
                  <span className="text-[10px] font-bold text-[#5a5650] shrink-0">/ {r.guest_count} 名</span>
                )}
              </div>
              <div className="w-16 text-right">
                <Badge color={r.reservation_type === 'douhan' ? 'gold' : 'blue'}>
                  {r.reservation_type === 'douhan' ? '同伴' : '来店'}
                </Badge>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: スタッフ
// ─────────────────────────────────────────────────────────────────────────────
function StaffTab({
  data, handleAction, isBusy, setDashboardData, showStaff, setShowStaff, setBusy,
}: {
  data: TodayDashboardData
  handleAction: <T,>(key: string, optimisticUpdate: () => void, rollback: () => void, action: () => Promise<ActionResult<T>>) => void
  isBusy: (key: string) => boolean
  setDashboardData: React.Dispatch<React.SetStateAction<TodayDashboardData>>
  showStaff: boolean
  setShowStaff: (v: boolean) => void
  setBusy: (key: string, busy: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-3">
        <p className="text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">
          STAFF ATTENDANCE ({data.staffAttendances.length})
        </p>
        <button
          onClick={() => setShowStaff(!showStaff)}
          className="flex items-center gap-1.5 text-gold hover:text-[#e6c982] transition-colors"
        >
          <Plus size={12} strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-widest uppercase">ADD STAFF</span>
        </button>
      </div>

      {data.staffAttendances.length === 0 && !showStaff && (
        <p className="text-[11px] text-[#5a5650] italic text-center py-12 font-sans tracking-widest uppercase">No staff recorded</p>
      )}

      <div className="space-y-0.5">
        {data.staffAttendances.map(s => (
          <Row key={s.id}>
            <Users size={12} className="text-[#5a5650]" />
            <span className="text-[12px] font-bold text-[#cbc3b3]">{s.display_name}</span>
            <span className="text-[10px] font-bold text-[#5a5650] ml-auto tracking-tight">{s.start_time.substring(0, 5)}〜</span>
            <button
              disabled={isBusy(`staff-${s.id}`)}
              onClick={() => {
                const previousAttendances = data.staffAttendances
                handleAction(
                  `staff-${s.id}`,
                  () => {
                    setDashboardData((current) => ({
                      ...current,
                      staffAttendances: current.staffAttendances.filter((entry) => entry.id !== s.id),
                    }))
                  },
                  () => {
                    setDashboardData((current) => ({ ...current, staffAttendances: previousAttendances }))
                  },
                  () => deleteStaffAttendance(s.id)
                )
              }}
              className="ml-3 text-[#5a5650] hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </Row>
        ))}
      </div>

      {showStaff && (
        <AddFormWrapper onClose={() => setShowStaff(false)}>
          <form
            action={async (fd) => {
              const tempId = createTempId()
              const sid = fd.get('staff_id') as string
              const s = data.allStaffs.find(x => x.id === sid)
              const displayName = s?.display_name ?? ''
              fd.set('display_name', displayName)
              fd.set('staff_date', data.date)
              setShowStaff(false)
              setDashboardData((current) => ({
                ...current,
                staffAttendances: sortByStartTime([
                  ...current.staffAttendances,
                  {
                    id: tempId,
                    display_name: displayName,
                    start_time: String(fd.get('start_time') || ''),
                  },
                ]),
              }))
              setBusy('add-staff', true)

              void (async () => {
                const result = await addStaffAttendance(fd) as ActionResult<{
                  id: string
                  display_name: string
                  start_time: string
                }>
                setBusy('add-staff', false)

                if ('error' in result && result.error) {
                  setDashboardData((current) => ({
                    ...current,
                    staffAttendances: current.staffAttendances.filter((entry) => entry.id !== tempId),
                  }))
                  toast.error(result.error)
                  return
                }

                if (result.data) {
                  setDashboardData((current) => ({
                    ...current,
                    staffAttendances: sortByStartTime(
                      current.staffAttendances.map((entry) => (entry.id === tempId ? result.data! : entry))
                    ),
                  }))
                }
              })()
            }}
            className="space-y-3"
          >
            <select name="staff_id" required className={inputCls}>
              <option value="">Select Staff...</option>
              {data.allStaffs.map(s => (
                <option key={s.id} value={s.id}>{s.display_name} ({s.role || 'No Role'})</option>
              ))}
            </select>
            <input name="start_time" type="time" required className={inputCls} />
            <input type="hidden" name="display_name" value="" />
            <button type="submit" disabled={isBusy('add-staff')} className="w-full py-2 bg-gold text-black text-[10px] font-bold tracking-widest rounded-sm uppercase hover:bg-[#e6c982] transition-all disabled:opacity-60">ADD STAFF</button>
            {data.allStaffs.length === 0 && (
              <p className="text-[10px] font-bold text-red-500/80 px-1">※ Please register staff in Human Resources.</p>
            )}
          </form>
        </AddFormWrapper>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: 要確認
// ─────────────────────────────────────────────────────────────────────────────
function UnconfirmedTab({
  data,
  handleAction,
  setDashboardData,
  isBusy,
}: {
  data: TodayDashboardData
  handleAction: <T,>(key: string, optimisticUpdate: () => void, rollback: () => void, action: () => Promise<ActionResult<T>>) => void
  setDashboardData: React.Dispatch<React.SetStateAction<TodayDashboardData>>
  isBusy: (key: string) => boolean
}) {
  return (
    <div className="space-y-6">
      {data.pendingCheckins.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold tracking-[2px] text-gold uppercase px-3 pb-1 border-b border-gold/10">PENDING CONFIRMATIONS</p>
          <div className="space-y-3">
            {data.pendingCheckins.map(checkin => (
              <div key={checkin.id} className="rounded-sm border border-gold/20 bg-gold/2 p-5 backdrop-blur-sm transition-all hover:bg-gold/4">
                <div className="flex items-start gap-4">
                  <Badge color="orange">PENDING</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#f4f1ea] tracking-tight">{checkin.stage_name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-[10px] text-[#8a8478]">欠勤: <span className={checkin.is_absent ? 'text-red-400 font-bold' : 'text-[#cbc3b3]'}>{checkin.is_absent ? 'YES' : 'NO'}</span></div>
                      <div className="text-[10px] text-[#8a8478]">変更: <span className={checkin.has_change ? 'text-orange-400 font-bold' : 'text-[#cbc3b3]'}>{checkin.has_change ? 'YES' : 'NO'}</span></div>
                    </div>
                    {checkin.change_note && (
                      <p className="mt-2 text-[10px] text-[#8a8478] italic bg-black/20 p-2 rounded-sm border border-white/5">Note: {checkin.change_note}</p>
                    )}
                    {checkin.memo && (
                      <p className="mt-2 text-[10px] text-[#8a8478] italic bg-black/20 p-2 rounded-sm border border-white/5">Memo: {checkin.memo}</p>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    disabled={isBusy(`approve-checkin-${checkin.id}`)}
                    onClick={() => {
                      const previousPending = data.pendingCheckins
                      const previousCheckins = data.checkins
                      const previousAbsentIds = data.absentCastIds
                      const previousUnconfirmed = data.unconfirmedCasts
                      handleAction(
                        `approve-checkin-${checkin.id}`,
                        () => {
                          setDashboardData((current) => {
                            const approvedCheckin = { ...checkin, approval_status: 'approved' as const }
                            return {
                              ...current,
                              pendingCheckins: current.pendingCheckins.filter((entry) => entry.id !== checkin.id),
                              checkins: [...current.checkins.filter((entry) => entry.id !== checkin.id), approvedCheckin],
                              absentCastIds: checkin.is_absent
                                ? [...new Set([...current.absentCastIds, checkin.cast_id])]
                                : current.absentCastIds.filter((entry) => entry !== checkin.cast_id),
                              unconfirmedCasts: current.unconfirmedCasts.filter((entry) => entry.cast_id !== checkin.cast_id),
                            }
                          })
                        },
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            pendingCheckins: previousPending,
                            checkins: previousCheckins,
                            absentCastIds: previousAbsentIds,
                            unconfirmedCasts: previousUnconfirmed,
                          }))
                        },
                        () => approveCheckin(checkin.id)
                      )
                    }}
                    className="flex-1 rounded-sm bg-emerald-600 px-4 py-2 text-[10px] font-bold text-white tracking-[2px] uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isBusy(`reject-checkin-${checkin.id}`)}
                    onClick={() => {
                      const previousPending = data.pendingCheckins
                      handleAction(
                        `reject-checkin-${checkin.id}`,
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            pendingCheckins: current.pendingCheckins.filter((entry) => entry.id !== checkin.id),
                          }))
                        },
                        () => {
                          setDashboardData((current) => ({ ...current, pendingCheckins: previousPending }))
                        },
                        () => rejectCheckin(checkin.id)
                      )
                    }}
                    className="flex-1 rounded-sm border border-red-500/30 px-4 py-2 text-[10px] font-bold text-red-400 tracking-[2px] uppercase hover:bg-red-500/10 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.pendingReservations.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold tracking-[2px] text-blue-400 uppercase px-3 pb-1 border-b border-blue-500/10">PENDING RESERVATIONS</p>
          <div className="space-y-3">
            {data.pendingReservations.map(reservation => (
              <div key={reservation.id} className="rounded-sm border border-blue-500/20 bg-blue-500/2 p-5 backdrop-blur-sm transition-all hover:bg-blue-500/4">
                <div className="flex items-start gap-4">
                  <Badge color="blue">{reservation.reservation_type === 'douhan' ? 'DOUHAN' : 'VISIT'}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#f4f1ea] tracking-tight">
                      {reservation.visit_time.substring(0, 5)} / {reservation.stage_name}
                    </p>
                    <p className="mt-2 text-[11px] font-bold text-[#cbc3b3]">
                      {reservation.guest_name} 様
                      {reservation.guest_count ? <span className="text-[#5a5650] ml-1">({reservation.guest_count} 名)</span> : ''}
                    </p>
                    {reservation.note && (
                      <p className="mt-2 text-[10px] text-[#8a8478] italic bg-black/20 p-2 rounded-sm border border-white/5">Note: {reservation.note}</p>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    disabled={isBusy(`approve-reservation-${reservation.id}`)}
                    onClick={() => {
                      const previousPending = data.pendingReservations
                      const previousReservations = data.reservations
                      handleAction(
                        `approve-reservation-${reservation.id}`,
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            pendingReservations: current.pendingReservations.filter((entry) => entry.id !== reservation.id),
                            reservations: sortReservationsByVisitTime([
                              ...current.reservations,
                              { ...reservation, approval_status: 'approved' as const },
                            ]),
                          }))
                        },
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            pendingReservations: previousPending,
                            reservations: previousReservations,
                          }))
                        },
                        () => approveReservation(reservation.id)
                      )
                    }}
                    className="flex-1 rounded-sm bg-emerald-600 px-4 py-2 text-[10px] font-bold text-white tracking-[2px] uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isBusy(`reject-reservation-${reservation.id}`)}
                    onClick={() => {
                      const previousPending = data.pendingReservations
                      handleAction(
                        `reject-reservation-${reservation.id}`,
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            pendingReservations: current.pendingReservations.filter((entry) => entry.id !== reservation.id),
                          }))
                        },
                        () => {
                          setDashboardData((current) => ({ ...current, pendingReservations: previousPending }))
                        },
                        () => rejectReservation(reservation.id)
                      )
                    }}
                    className="flex-1 rounded-sm border border-red-500/30 px-4 py-2 text-[10px] font-bold text-red-400 tracking-[2px] uppercase hover:bg-red-500/10 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.unconfirmedCasts.length === 0 && data.pendingCheckins.length === 0 && data.pendingReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCheck size={20} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-emerald-400 font-bold tracking-[3px] uppercase">All Cleared</p>
        </div>
      ) : (
        <>
          {data.unconfirmedCasts.length > 0 ? (
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-bold tracking-[2px] text-red-500/80 px-3 flex items-center gap-2 uppercase">
                <AlertTriangle size={12} />
                <span>UNSENT CONFIRMATION FORMS</span>
              </p>
              <div className="space-y-0.5">
                {data.unconfirmedCasts.map(c => {
                  const mailSent = data.mailSentCastIds?.includes(c.cast_id)
                  return (
                    <Row key={c.cast_id}>
                      <AlertTriangle size={12} className="text-red-500/60" />
                      <span className="text-[12px] font-bold text-red-400/90">{c.stage_name}</span>
                      <span className="ml-auto">
                        {mailSent
                          ? <Badge color="blue">📧 SENT</Badge>
                          : <Badge color="red">NOT CONTACTED</Badge>
                        }
                      </span>
                    </Row>
                  )
                })}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
