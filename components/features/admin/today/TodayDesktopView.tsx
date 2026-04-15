'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  'w-full bg-[#0e0e10] border border-[#ffffff14] rounded-[8px] px-3 py-2 text-[12px] text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-[#dfbd6940] transition-colors'

// ── Tiny Badge ──────────────────────────────────────────────────────────────
function Badge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'red' | 'blue' | 'green' | 'orange' | 'purple' }) {
  const palette: Record<string, string> = {
    gold:   'bg-[#dfbd6914] text-[#dfbd69]',
    red:    'bg-[#d4785a14] text-[#d4785a]',
    blue:   'bg-[#6ab0d414] text-[#6ab0d4]',
    green:  'bg-[#72b89414] text-[#72b894]',
    orange: 'bg-[#c8884d14] text-[#c8884d]',
    purple: 'bg-[#a882d814] text-[#a882d8]',
  }
  return (
    <span className={`text-[9px] font-bold tracking-[0.8px] px-2 py-0.5 rounded-full ${palette[color]}`}>
      {children}
    </span>
  )
}

// ── Section row ─────────────────────────────────────────────────────────────
function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center h-[36px] gap-3 px-3 hover:bg-[#ffffff04] rounded-[6px] transition-colors ${className}`}>
      {children}
    </div>
  )
}

// ── Add form wrapper ─────────────────────────────────────────────────────────
function AddFormWrapper({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-[10px] bg-[#0e0e10] border border-[#ffffff0a] p-3 space-y-2">
      {children}
      <button
        type="button"
        onClick={onClose}
        className="text-[11px] text-[#5a5650] hover:text-[#8a8478] transition-colors"
      >
        キャンセル
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function TodayDesktopView({ data, casts, kpi, ops, dateLabel }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab]   = useState<Tab>('all')
  const [copied, setCopied]         = useState(false)
  const [lineText, setLineText]     = useState('')

  // ── Forms visibility ────────────────────────────────────────────────────
  const [showDispatch, setShowDispatch] = useState(false)
  const [showTrial,    setShowTrial]    = useState(false)
  const [showChange,   setShowChange]   = useState(false)
  const [showStaff,    setShowStaff]    = useState(false)

  // ── Derived data ─────────────────────────────────────────────────────────
  const activeCasts    = data.shifts.filter(s => !data.absentCastIds.includes(s.cast_id))
  const confirmedCount = activeCasts.length + data.dispatches.length
  const douhanCount    = data.reservations.filter(r => r.reservation_type === 'douhan').length
  const absentNames    = [
    ...data.shifts.filter(s => data.absentCastIds.includes(s.cast_id)).map(s => s.stage_name),
    ...data.shiftChanges.filter(c => !c.new_time).map(c => c.stage_name),
  ]

  const alerts: { label: string; detail: string; level: 'danger' | 'warn' }[] = []
  if (kpi.shiftMissingCount > 0)
    alerts.push({ label: 'シフト未提出', detail: `${kpi.shiftMissingCount}名が今週未提出`, level: 'warn' })
  if (kpi.unconfirmedCount > 0)
    alerts.push({ label: '来店予定未確定', detail: `${kpi.unconfirmedCount}名が確認待ち`, level: 'danger' })
  const pendingApprovalCount = data.pendingCheckins.length + data.pendingReservations.length
  if (pendingApprovalCount > 0)
    alerts.push({ label: '承認待ち', detail: `${pendingApprovalCount}件の当日提出が承認待ち`, level: 'warn' })
  if (kpi.unreadApplications > 0)
    alerts.push({ label: '未返信案件', detail: `応募返信待ち ${kpi.unreadApplications}件`, level: 'warn' })

  // ── LINE text generation ─────────────────────────────────────────────────
  const refreshLineText = useCallback(() => {
    generateLineText(data).then(setLineText)
  }, [data])

  useEffect(() => { refreshLineText() }, [refreshLineText])

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!lineText) return
    await navigator.clipboard.writeText(lineText)
    setCopied(true)
    toast.success('コピーしました')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAction = (action: () => Promise<{ error?: string } | { success: boolean }>) => {
    startTransition(async () => {
      const result = await action()
      if ('error' in result && result.error) toast.error(result.error)
      else router.refresh()
    })
  }

  // ── KPI cards ─────────────────────────────────────────────────────────────
  const kpiCards = [
    { label: '確定出勤',   value: confirmedCount,               unit: '名' },
    { label: '未確認',     value: data.unconfirmedCasts.length, unit: '名' },
    { label: '来店予定',   value: data.reservations.length,     unit: '件' },
    { label: '同伴',       value: douhanCount,                  unit: '件' },
    { label: '体入',       value: data.trials.length,           unit: '名' },
  ]

  // ── Tab content ───────────────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':    return <AllTab data={data} activeCasts={activeCasts} absentNames={absentNames} />
      case 'cast':   return <CastTab data={data} activeCasts={activeCasts} absentNames={absentNames} handleAction={handleAction} casts={casts} showDispatch={showDispatch} setShowDispatch={setShowDispatch} showTrial={showTrial} setShowTrial={setShowTrial} showChange={showChange} setShowChange={setShowChange} />
      case 'visit':  return <VisitTab data={data} />
      case 'staff':  return <StaffTab data={data} handleAction={handleAction} showStaff={showStaff} setShowStaff={setShowStaff} />
      case 'unconfirmed': return <UnconfirmedTab data={data} handleAction={handleAction} />
    }
  }

  return (
    <div className="space-y-5 font-inter">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">本日の営業状況</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">当日オペレーション・シフト・来店予定を一元管理</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ffffff0a] rounded-[10px] border-[1.5px] border-[#927624]">
            <Calendar size={13} className="text-[#8a8478]" />
            <span className="text-[11px] font-medium text-[#c7c0b2] tracking-[3.06px] uppercase">{dateLabel}</span>
          </div>

          <button
            onClick={() => setActiveTab('visit')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
          >
            <Plus size={14} strokeWidth={3} />
            来店予定を確認
          </button>
        </div>
      </div>

      {/* ── KPI Bar ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[14px] border-[1.5px] border-[#927624] px-5 py-4"
          >
            <p className="text-[10px] font-medium text-[#5a5650] tracking-[0.6px] uppercase mb-1.5">{card.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-[#f4f1ea] leading-none">{card.value}</span>
              <span className="text-[11px] text-[#8a8478]">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

        {/* ── Left: Ops Table ─────────────────────────────────────────── */}
        <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] overflow-hidden min-h-[480px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-[#ffffff08]">
            {TABS.map((tab) => {
              const count = tab.id === 'unconfirmed' ? data.unconfirmedCasts.length : undefined
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 text-[12px] font-medium rounded-t-[8px] transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#f4f1ea] bg-[#ffffff08]'
                      : 'text-[#5a5650] hover:text-[#8a8478]'
                  }`}
                >
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#d4785a] text-[9px] font-bold text-white">
                      {count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Body */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {renderTabContent()}
          </div>
        </div>

        {/* ── Right: Alerts + Memo ────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Alerts */}
          <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 h-[56px] border-b border-[#ffffff08]">
              <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#d4785a1a] rounded-[6px]">
                <AlertTriangle size={14} className="text-[#d4785a]" strokeWidth={2.5} />
              </div>
              <p className="text-[12px] font-semibold text-[#f4f1ea]">優先アラート</p>
            </div>
            <div className="p-3 space-y-2">
              {alerts.length === 0 ? (
                <p className="text-[11px] text-[#5a5650] italic text-center py-4">アラートなし</p>
              ) : alerts.map((a) => (
                <div
                  key={a.label}
                  className={`rounded-[10px] border p-3 ${
                    a.level === 'danger'
                      ? 'border-[#d4785a30] bg-[#d4785a0a]'
                      : 'border-[#c8884d30] bg-[#c8884d0a]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${a.level === 'danger' ? 'bg-[#d4785a]' : 'bg-[#c8884d]'}`} />
                    <p className={`text-[11px] font-bold ${a.level === 'danger' ? 'text-[#d4785a]' : 'text-[#c8884d]'}`}>{a.label}</p>
                  </div>
                  <p className="text-[10px] text-[#8a8478] pl-[13px]">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] overflow-hidden flex-1">
            <div className="flex items-center gap-2.5 px-5 h-[56px] border-b border-[#ffffff08]">
              <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#dfbd691a] rounded-[6px]">
                <StickyNote size={14} className="text-[#dfbd69]" strokeWidth={2.5} />
              </div>
              <p className="text-[12px] font-semibold text-[#f4f1ea]">営業メモ</p>
            </div>
            <div className="p-3 space-y-2">
              {([
                { type: 'VIP',   content: ops.vipMemo,    color: 'text-[#dfbd69] border-[#dfbd6930] bg-[#dfbd6908]' },
                { type: 'EVENT', content: ops.eventMemo,  color: 'text-[#72b894] border-[#72b89430] bg-[#72b89408]' },
                { type: 'STAFF', content: ops.urgentMemo, color: 'text-[#c8884d] border-[#c8884d30] bg-[#c8884d08]' },
              ] as const).map((m) => (
                <div key={m.type} className={`rounded-[10px] border px-3 py-2.5 ${m.color}`}>
                  <p className={`text-[8px] font-bold tracking-[1.4px] uppercase mb-1 opacity-80 ${m.color.split(' ')[0]}`}>{m.type}</p>
                  <p className="text-[11px] text-[#cbc3b3] leading-relaxed">
                    {m.content ?? <span className="text-[#5a5650] italic">未入力</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LINE Share ───────────────────────────────────────────────────── */}
      <div className="flex flex-col bg-[rgba(0,0,0,0.80)] rounded-[18px] border border-[#dfbd6930] overflow-hidden">
        <div className="flex items-center justify-between px-5 h-[56px] border-b border-[#ffffff08]">
          <div className="flex items-center gap-2.5">
            <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#dfbd691a] rounded-[6px]">
              <Copy size={14} className="text-[#dfbd69]" strokeWidth={2.5} />
            </div>
            <p className="text-[12px] font-semibold text-[#f4f1ea]">LINE 共有テキスト</p>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] text-[11px] font-semibold transition-all ${
              copied
                ? 'bg-[#72b89420] text-[#72b894] border border-[#72b89440]'
                : 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d]'
            }`}
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? 'コピー済み' : 'コピー'}
          </button>
        </div>
        <div className="p-4">
          <pre className="text-[11px] text-[#8a8478] leading-relaxed whitespace-pre-wrap font-inter min-h-[80px]">
            {lineText || '生成中...'}
          </pre>
        </div>
      </div>

      {/* Pending indicator */}
      {isPending && (
        <div className="fixed bottom-5 right-5 bg-[rgba(0,0,0,0.80)] border border-[#ffffff0f] text-[#c7c0b2] text-[11px] px-4 py-2 rounded-full shadow-lg">
          処理中...
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
    <div className="space-y-4">
      {/* Cast groups */}
      {sortedGroups.length > 0 && (
        <div>
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">出勤キャスト</p>
          {sortedGroups.map(([time, group]) => (
            <div key={time} className="mb-3">
              <div className="flex items-center gap-2 px-3 mb-1">
                <Clock size={10} className="text-[#dfbd69]" />
                <span className="text-[10px] font-bold text-[#dfbd69]">{time}〜</span>
                <span className="text-[9px] text-[#5a5650]">{group.casts.length + group.dispatches.length}名</span>
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
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">体入</p>
          {data.trials.map(t => (
            <Row key={t.id}>
              <Badge color="purple">体入</Badge>
              <span className="text-[12px] text-[#cbc3b3]">{t.name}</span>
              <span className="text-[10px] text-[#5a5650] ml-auto">{t.start_time.substring(0, 5)}〜</span>
            </Row>
          ))}
        </div>
      )}

      {/* Staff */}
      {data.staffAttendances.length > 0 && (
        <div>
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">スタッフ</p>
          {data.staffAttendances.map(s => (
            <Row key={s.id}>
              <Users size={11} className="text-[#5a5650]" />
              <span className="text-[12px] text-[#cbc3b3]">{s.display_name}</span>
              <span className="text-[10px] text-[#5a5650] ml-auto">{s.start_time.substring(0, 5)}〜</span>
            </Row>
          ))}
        </div>
      )}

      {/* Changes */}
      {data.shiftChanges.filter(c => c.new_time).length > 0 && (
        <div>
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">当日変更</p>
          {data.shiftChanges.filter(c => c.new_time).map(c => (
            <Row key={c.id}>
              <Badge color="orange">変更</Badge>
              <span className="text-[12px] text-[#cbc3b3]">{c.stage_name}</span>
              <span className="text-[10px] text-[#5a5650] ml-auto">
                {c.original_time?.substring(0, 5)} → {c.new_time?.substring(0, 5)}
              </span>
            </Row>
          ))}
        </div>
      )}

      {/* Absent */}
      {absentNames.length > 0 && (
        <div>
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">当日欠勤</p>
          {[...new Set(absentNames)].map(name => (
            <Row key={name}>
              <Badge color="red">欠勤</Badge>
              <span className="text-[12px] text-[#d4785a]">{name}</span>
            </Row>
          ))}
        </div>
      )}

      {sortedGroups.length === 0 && data.trials.length === 0 && (
        <p className="text-[12px] text-[#5a5650] italic text-center py-8">本日の登録データがありません</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: キャスト
// ─────────────────────────────────────────────────────────────────────────────
function CastTab({
  data, activeCasts, absentNames, handleAction, casts,
  showDispatch, setShowDispatch, showTrial, setShowTrial, showChange, setShowChange,
}: {
  data: TodayDashboardData
  activeCasts: TodayDashboardData['shifts']
  absentNames: string[]
  handleAction: (fn: () => Promise<{ error?: string } | { success: boolean }>) => void
  casts: Cast[]
  showDispatch: boolean
  setShowDispatch: (v: boolean) => void
  showTrial: boolean
  setShowTrial: (v: boolean) => void
  showChange: boolean
  setShowChange: (v: boolean) => void
}) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      {/* Active casts */}
      <div>
        <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3 flex items-center justify-between">
          <span>確定出勤 ({activeCasts.length + data.dispatches.length}名)</span>
          <button
            onClick={() => setShowDispatch(!showDispatch)}
            className="flex items-center gap-1 text-[#dfbd69] hover:opacity-80 transition-opacity"
          >
            <Plus size={10} />
            <span>派遣追加</span>
          </button>
        </p>
        {activeCasts.map(s => (
          <Row key={s.cast_id}>
            <span className="text-[12px] text-[#cbc3b3]">{s.stage_name}</span>
            <span className="text-[10px] text-[#5a5650] ml-auto">{s.start_time.substring(0, 5)}〜</span>
          </Row>
        ))}
        {data.dispatches.map(d => (
          <Row key={d.id}>
            <Badge color="blue">派遣</Badge>
            <span className="text-[12px] text-[#cbc3b3]">{d.name}</span>
            <span className="text-[10px] text-[#5a5650] ml-auto">{d.start_time.substring(0, 5)}〜</span>
            <button
              onClick={() => handleAction(() => deleteDispatch(d.id))}
              className="ml-1 text-[#5a5650] hover:text-[#d4785a] transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </Row>
        ))}
        {showDispatch && (
          <AddFormWrapper onClose={() => setShowDispatch(false)}>
            <form
              action={async (fd) => {
                fd.set('dispatch_date', data.date)
                await addDispatch(fd)
                setShowDispatch(false)
                router.refresh()
              }}
              className="space-y-2"
            >
              <input name="name" type="text" placeholder="派遣キャスト名" required className={inputCls} />
              <input name="start_time" type="time" required className={inputCls} />
              <button type="submit" className="w-full py-1.5 bg-[#dfbd69] text-[#0b0b0d] text-[11px] font-bold rounded-[6px]">追加</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Trials */}
      <div>
        <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3 flex items-center justify-between">
          <span>体入 ({data.trials.length}名)</span>
          <button
            onClick={() => setShowTrial(!showTrial)}
            className="flex items-center gap-1 text-[#dfbd69] hover:opacity-80 transition-opacity"
          >
            <Plus size={10} />
            <span>追加</span>
          </button>
        </p>
        {data.trials.length === 0 && !showTrial && (
          <p className="text-[11px] text-[#5a5650] italic px-3 py-2">本日の体入はありません</p>
        )}
        {data.trials.map(t => (
          <Row key={t.id}>
            <Badge color="purple">体入</Badge>
            <span className="text-[12px] text-[#cbc3b3]">{t.name}</span>
            <span className="text-[10px] text-[#5a5650] ml-auto">{t.start_time.substring(0, 5)}〜</span>
            <button
              onClick={() => handleAction(() => deleteTrial(t.id))}
              className="ml-1 text-[#5a5650] hover:text-[#d4785a] transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </Row>
        ))}
        {showTrial && (
          <AddFormWrapper onClose={() => setShowTrial(false)}>
            <form
              action={async (fd) => {
                fd.set('trial_date', data.date)
                await addTrial(fd)
                setShowTrial(false)
                router.refresh()
              }}
              className="space-y-2"
            >
              <input name="name" type="text" placeholder="体入キャスト名" required className={inputCls} />
              <input name="start_time" type="time" required className={inputCls} />
              <button type="submit" className="w-full py-1.5 bg-[#dfbd69] text-[#0b0b0d] text-[11px] font-bold rounded-[6px]">追加</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Changes */}
      <div>
        <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3 flex items-center justify-between">
          <span>当日変更</span>
          <button
            onClick={() => setShowChange(!showChange)}
            className="flex items-center gap-1 text-[#dfbd69] hover:opacity-80 transition-opacity"
          >
            <Plus size={10} />
            <span>追加</span>
          </button>
        </p>
        {data.shiftChanges.filter(c => c.new_time).length === 0 && !showChange && (
          <p className="text-[11px] text-[#5a5650] italic px-3 py-2">当日変更なし</p>
        )}
        {data.shiftChanges.filter(c => c.new_time).map(c => (
          <Row key={c.id}>
            <Badge color="orange">変更</Badge>
            <span className="text-[12px] text-[#cbc3b3]">{c.stage_name}</span>
            <span className="text-[10px] text-[#5a5650] ml-auto">
              {c.original_time?.substring(0, 5)} → {c.new_time?.substring(0, 5)}
            </span>
            <button
              onClick={() => handleAction(() => deleteShiftChange(c.id))}
              className="ml-1 text-[#5a5650] hover:text-[#d4785a] transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </Row>
        ))}
        {showChange && (
          <AddFormWrapper onClose={() => setShowChange(false)}>
            <form
              action={async (fd) => {
                fd.set('change_date', data.date)
                await addShiftChange(fd)
                setShowChange(false)
                router.refresh()
              }}
              className="space-y-2"
            >
              <select name="cast_id" required className={inputCls}>
                <option value="">キャストを選択</option>
                {casts.map(c => <option key={c.id} value={c.id}>{c.stage_name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input name="original_time" type="time" placeholder="変更前" className={inputCls} />
                <input name="new_time"      type="time" placeholder="変更後" className={inputCls} />
              </div>
              <input name="note" type="text" placeholder="メモ（同伴ありなど）" className={inputCls} />
              <button type="submit" className="w-full py-1.5 bg-[#dfbd69] text-[#0b0b0d] text-[11px] font-bold rounded-[6px]">追加</button>
            </form>
          </AddFormWrapper>
        )}
      </div>

      {/* Absent */}
      {absentNames.length > 0 && (
        <div>
          <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase mb-2 px-3">当日欠勤</p>
          {[...new Set(absentNames)].map(name => (
            <Row key={name}>
              <Badge color="red">欠勤</Badge>
              <span className="text-[12px] text-[#d4785a]">{name}</span>
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
        <p className="text-[12px] text-[#5a5650] italic text-center py-8">本日の来店予定はありません</p>
      ) : (
        <>
          {/* Table header */}
          <div className="flex items-center h-[30px] px-3 mb-1 border-b border-[#ffffff08]">
            <span className="text-[9px] font-bold tracking-[0.7px] text-[#5a5650] uppercase w-14">時間</span>
            <span className="text-[9px] font-bold tracking-[0.7px] text-[#5a5650] uppercase w-24">キャスト</span>
            <span className="text-[9px] font-bold tracking-[0.7px] text-[#5a5650] uppercase flex-1">お客様</span>
            <span className="text-[9px] font-bold tracking-[0.7px] text-[#5a5650] uppercase w-16 text-right">種別</span>
          </div>
          {data.reservations.map(r => (
            <div key={r.id} className="flex items-center h-[36px] px-3 hover:bg-[#ffffff04] rounded-[6px] transition-colors">
              <span className="text-[12px] font-bold text-[#dfbd69] w-14 shrink-0">
                {r.visit_time.substring(0, 5)}
              </span>
              <span className="text-[12px] text-[#cbc3b3] w-24 truncate shrink-0">{r.stage_name}</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[12px] text-[#8a8478] truncate">{r.guest_name}様</span>
                {r.guest_count && (
                  <span className="text-[10px] text-[#5a5650] shrink-0">{r.guest_count}名</span>
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
  data, handleAction, showStaff, setShowStaff,
}: {
  data: TodayDashboardData
  handleAction: (fn: () => Promise<{ error?: string } | { success: boolean }>) => void
  showStaff: boolean
  setShowStaff: (v: boolean) => void
}) {
  const router = useRouter()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-3 mb-3">
        <p className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">
          スタッフ出勤 ({data.staffAttendances.length}名)
        </p>
        <button
          onClick={() => setShowStaff(!showStaff)}
          className="flex items-center gap-1 text-[10px] text-[#dfbd69] hover:opacity-80 transition-opacity"
        >
          <Plus size={10} />
          追加
        </button>
      </div>

      {data.staffAttendances.length === 0 && !showStaff && (
        <p className="text-[11px] text-[#5a5650] italic text-center py-8">スタッフ登録なし</p>
      )}

      {data.staffAttendances.map(s => (
        <Row key={s.id}>
          <Users size={11} className="text-[#5a5650]" />
          <span className="text-[12px] text-[#cbc3b3]">{s.display_name}</span>
          <span className="text-[10px] text-[#5a5650] ml-auto">{s.start_time.substring(0, 5)}〜</span>
          <button
            onClick={() => handleAction(() => deleteStaffAttendance(s.id))}
            className="ml-1 text-[#5a5650] hover:text-[#d4785a] transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </Row>
      ))}

      {showStaff && (
        <AddFormWrapper onClose={() => setShowStaff(false)}>
          <form
            action={async (fd) => {
              const sid = fd.get('staff_id') as string
              const s = data.allStaffs.find(x => x.id === sid)
              if (s) fd.set('display_name', s.display_name)
              fd.set('staff_date', data.date)
              await addStaffAttendance(fd)
              setShowStaff(false)
              router.refresh()
            }}
            className="space-y-2"
          >
            <select name="staff_id" required className={inputCls}>
              <option value="">スタッフを選択</option>
              {data.allStaffs.map(s => (
                <option key={s.id} value={s.id}>{s.display_name} ({s.role || '役割なし'})</option>
              ))}
            </select>
            <input name="start_time" type="time" required className={inputCls} />
            <input type="hidden" name="display_name" value="" />
            <button type="submit" className="w-full py-1.5 bg-[#dfbd69] text-[#0b0b0d] text-[11px] font-bold rounded-[6px]">追加</button>
            {data.allStaffs.length === 0 && (
              <p className="text-[10px] text-[#d4785a]">※人材管理からスタッフを登録してください</p>
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
}: {
  data: TodayDashboardData
  handleAction: (fn: () => Promise<{ error?: string } | { success: boolean }>) => void
}) {
  return (
    <div className="space-y-2">
      {data.pendingCheckins.length > 0 && (
        <div className="space-y-2 pb-3">
          <p className="text-[10px] text-[#dfbd69] px-3 pb-1">本日の確認 承認待ち</p>
          {data.pendingCheckins.map(checkin => (
            <div key={checkin.id} className="rounded-[8px] border border-[#dfbd6926] bg-[#dfbd6908] px-3 py-2.5">
              <div className="flex items-start gap-2">
                <Badge color="orange">承認待ち</Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#f4f1ea]">{checkin.stage_name}</p>
                  <p className="mt-1 text-[11px] text-[#cbc3b3]">
                    欠勤: {checkin.is_absent ? 'あり' : 'なし'} / 出勤変更: {checkin.has_change ? 'あり' : 'なし'}
                  </p>
                  {checkin.change_note ? (
                    <p className="mt-1 text-[10px] text-[#8a8478]">変更内容: {checkin.change_note}</p>
                  ) : null}
                  {checkin.memo ? (
                    <p className="mt-1 text-[10px] text-[#8a8478]">メモ: {checkin.memo}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAction(() => approveCheckin(checkin.id))}
                  className="rounded-[6px] bg-[#72b894] px-3 py-1.5 text-[10px] font-bold text-[#0b0b0d]"
                >
                  承認
                </button>
                <button
                  onClick={() => handleAction(() => rejectCheckin(checkin.id))}
                  className="rounded-[6px] border border-[#d4785a40] px-3 py-1.5 text-[10px] font-bold text-[#d4785a]"
                >
                  差し戻し
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.pendingReservations.length > 0 && (
        <div className="space-y-2 pb-3">
          <p className="text-[10px] text-[#dfbd69] px-3 pb-1">来店予定 承認待ち</p>
          {data.pendingReservations.map(reservation => (
            <div key={reservation.id} className="rounded-[8px] border border-[#6ab0d426] bg-[#6ab0d408] px-3 py-2.5">
              <div className="flex items-start gap-2">
                <Badge color="blue">{reservation.reservation_type === 'douhan' ? '同伴' : '来店'}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#f4f1ea]">
                    {reservation.visit_time.substring(0, 5)} / {reservation.stage_name}
                  </p>
                  <p className="mt-1 text-[11px] text-[#cbc3b3]">
                    {reservation.guest_name}様
                    {reservation.guest_count ? ` / ${reservation.guest_count}名` : ''}
                  </p>
                  {reservation.note ? (
                    <p className="mt-1 text-[10px] text-[#8a8478]">メモ: {reservation.note}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAction(() => approveReservation(reservation.id))}
                  className="rounded-[6px] bg-[#72b894] px-3 py-1.5 text-[10px] font-bold text-[#0b0b0d]"
                >
                  承認
                </button>
                <button
                  onClick={() => handleAction(() => rejectReservation(reservation.id))}
                  className="rounded-[6px] border border-[#d4785a40] px-3 py-1.5 text-[10px] font-bold text-[#d4785a]"
                >
                  差し戻し
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.unconfirmedCasts.length === 0 && data.pendingCheckins.length === 0 && data.pendingReservations.length === 0 ? (
        <p className="text-[12px] text-[#72b894] italic text-center py-8">未確認キャストなし ✓</p>
      ) : (
        <>
          {data.unconfirmedCasts.length > 0 ? (
            <>
              <p className="text-[10px] text-[#d4785a] px-3 pb-2">本日の確認フォームを未送信のキャストです</p>
              {data.unconfirmedCasts.map(c => {
                const mailSent = data.mailSentCastIds?.includes(c.cast_id)
                return (
                  <Row key={c.cast_id}>
                    <AlertTriangle size={11} className="text-[#d4785a]" />
                    <span className="text-[12px] font-medium text-[#d4785a]">{c.stage_name}</span>
                    <span className="ml-auto">
                      {mailSent
                        ? <Badge color="blue">📧 メール済み</Badge>
                        : <Badge color="red">未連絡</Badge>
                      }
                    </span>
                  </Row>
                )
              })}
            </>
          ) : null}
        </>
      )}
    </div>
  )
}
