'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  type TodayDashboardData,
  addDispatch,
  deleteDispatch,
  addTrial,
  deleteTrial,
  addShiftChange,
  deleteShiftChange,
  addStaffAttendance,
  deleteStaffAttendance,
  generateLineText,
} from '@/lib/actions/today'
import { Copy, Plus, Trash2, Users, Star, ChevronRight, AlertTriangle, Calendar, Clock } from 'lucide-react'

type Cast = { id: string; stage_name?: string }

type Props = {
  data: TodayDashboardData
  casts: Cast[]
}

type SectionHeaderProps = {
  icon: React.ReactNode
  label: string
  count?: number
}

type ActionResult<T = void> =
  | { success: true; data?: T; id?: string }
  | { success?: false; error: string }

function createTempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sortByStartTime<T extends { start_time: string }>(items: T[]) {
  return [...items].sort((a, b) => a.start_time.localeCompare(b.start_time))
}

function groupByTime(shifts: TodayDashboardData['shifts'], dispatches: TodayDashboardData['dispatches'], absentIds: string[]) {
  const groups: Record<string, { casts: string[]; dispatches: string[] }> = {}
  for (const s of shifts) {
    if (absentIds.includes(s.cast_id)) continue
    const t = s.start_time.substring(0, 5)
    if (!groups[t]) groups[t] = { casts: [], dispatches: [] }
    groups[t].casts.push(s.stage_name)
  }
  for (const d of dispatches) {
    const t = d.start_time.substring(0, 5)
    if (!groups[t]) groups[t] = { casts: [], dispatches: [] }
    groups[t].dispatches.push(d.name)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function SectionHeader({ icon, label, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-gold">{icon}</div>
      <span className="text-xs font-bold tracking-widest uppercase text-gray-600">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-xs bg-gold/10 text-gold font-bold px-2 py-0.5 rounded-full">{count}名</span>
      )}
    </div>
  )
}

export function TodayDashboard({ data, casts }: Props) {
  const [isPending, startTransition] = useTransition()
  const [dashboardData, setDashboardData] = useState(data)
  const [lineText, setLineText] = useState('')
  const [pendingKeys, setPendingKeys] = useState<string[]>([])
  const [showDispatchForm, setShowDispatchForm] = useState(false)
  const [showTrialForm, setShowTrialForm] = useState(false)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)

  useEffect(() => {
    setDashboardData(data)
  }, [data])

  const grouped = groupByTime(dashboardData.shifts, dashboardData.dispatches, dashboardData.absentCastIds)
  const absentNames = [
    ...dashboardData.shifts.filter((s) => dashboardData.absentCastIds.includes(s.cast_id)).map((s) => s.stage_name),
    ...dashboardData.shiftChanges.filter((c) => !c.new_time).map((c) => c.stage_name),
  ]

  const refreshLineText = useCallback(() => {
    generateLineText(dashboardData).then(setLineText)
  }, [dashboardData])

  useEffect(() => {
    refreshLineText()
  }, [refreshLineText])

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors'

  const setBusy = (key: string, busy: boolean) => {
    setPendingKeys((current) =>
      busy ? (current.includes(key) ? current : [...current, key]) : current.filter((entry) => entry !== key)
    )
  }

  const isBusy = (key: string) => pendingKeys.includes(key)

  const handleCopy = async () => {
    if (!lineText) return
    await navigator.clipboard.writeText(lineText)
    toast.success('コピーしました ✓')
  }

  const handleDelete = <T,>(
    key: string,
    removeOptimistically: () => void,
    rollback: () => void,
    action: () => Promise<ActionResult<T>>
  ) => {
    removeOptimistically()
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

  const handleAddDispatch = async (formData: FormData) => {
    const name = String(formData.get('name') || '').trim()
    const startTime = String(formData.get('start_time') || '')
    const tempId = createTempId()
    const tempDispatch = { id: tempId, name, start_time: startTime }

    formData.set('dispatch_date', dashboardData.date)
    setShowDispatchForm(false)
    setDashboardData((current) => ({
      ...current,
      dispatches: sortByStartTime([...current.dispatches, tempDispatch]),
    }))
    setBusy('add-dispatch', true)

    startTransition(async () => {
      const result = await addDispatch(formData) as ActionResult<typeof tempDispatch>
      setBusy('add-dispatch', false)

      if ('error' in result && result.error) {
        setDashboardData((current) => ({
          ...current,
          dispatches: current.dispatches.filter((dispatch) => dispatch.id !== tempId),
        }))
        toast.error(result.error)
        return
      }

      if (result.data) {
        setDashboardData((current) => ({
          ...current,
          dispatches: sortByStartTime(
            current.dispatches.map((dispatch) => (dispatch.id === tempId ? result.data! : dispatch))
          ),
        }))
      }
    })
  }

  const handleAddTrial = async (formData: FormData) => {
    const name = String(formData.get('name') || '').trim()
    const startTime = String(formData.get('start_time') || '')
    const tempId = createTempId()
    const tempTrial = { id: tempId, name, start_time: startTime }

    formData.set('trial_date', dashboardData.date)
    setShowTrialForm(false)
    setDashboardData((current) => ({
      ...current,
      trials: sortByStartTime([...current.trials, tempTrial]),
    }))
    setBusy('add-trial', true)

    startTransition(async () => {
      const result = await addTrial(formData) as ActionResult<typeof tempTrial>
      setBusy('add-trial', false)

      if ('error' in result && result.error) {
        setDashboardData((current) => ({
          ...current,
          trials: current.trials.filter((trial) => trial.id !== tempId),
        }))
        toast.error(result.error)
        return
      }

      if (result.data) {
        setDashboardData((current) => ({
          ...current,
          trials: sortByStartTime(current.trials.map((trial) => (trial.id === tempId ? result.data! : trial))),
        }))
      }
    })
  }

  const handleAddStaff = async (formData: FormData) => {
    const staffId = String(formData.get('staff_id') || '')
    const staff = dashboardData.allStaffs.find((entry) => entry.id === staffId)
    const displayName = staff?.display_name ?? ''
    const startTime = String(formData.get('start_time') || '')
    const tempId = createTempId()
    const tempAttendance = { id: tempId, display_name: displayName, start_time: startTime }

    formData.set('display_name', displayName)
    formData.set('staff_date', dashboardData.date)
    setShowStaffForm(false)
    setDashboardData((current) => ({
      ...current,
      staffAttendances: sortByStartTime([...current.staffAttendances, tempAttendance]),
    }))
    setBusy('add-staff', true)

    startTransition(async () => {
      const result = await addStaffAttendance(formData) as ActionResult<typeof tempAttendance>
      setBusy('add-staff', false)

      if ('error' in result && result.error) {
        setDashboardData((current) => ({
          ...current,
          staffAttendances: current.staffAttendances.filter((attendance) => attendance.id !== tempId),
        }))
        toast.error(result.error)
        return
      }

      if (result.data) {
        setDashboardData((current) => ({
          ...current,
          staffAttendances: sortByStartTime(
            current.staffAttendances.map((attendance) => (attendance.id === tempId ? result.data! : attendance))
          ),
        }))
      }
    })
  }

  const handleAddShiftChange = async (formData: FormData) => {
    const castId = String(formData.get('cast_id') || '')
    const cast = casts.find((entry) => entry.id === castId)
    const tempId = createTempId()
    const tempChange = {
      id: tempId,
      cast_id: castId,
      stage_name: cast?.stage_name || '不明',
      original_time: (String(formData.get('original_time') || '') || null) as string | null,
      new_time: (String(formData.get('new_time') || '') || null) as string | null,
      note: (String(formData.get('note') || '') || null) as string | null,
    }

    formData.set('change_date', dashboardData.date)
    setShowChangeForm(false)
    setDashboardData((current) => ({
      ...current,
      shiftChanges: [...current.shiftChanges, tempChange],
    }))
    setBusy('add-change', true)

    startTransition(async () => {
      const result = await addShiftChange(formData) as ActionResult<{
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
          shiftChanges: current.shiftChanges.filter((change) => change.id !== tempId),
        }))
        toast.error(result.error)
        return
      }

      if (result.data) {
        setDashboardData((current) => ({
          ...current,
          shiftChanges: current.shiftChanges.map((change) =>
            change.id === tempId
              ? {
                  ...change,
                  id: result.data!.id,
                  cast_id: result.data!.cast_id,
                  original_time: result.data!.original_time ?? undefined,
                  new_time: result.data!.new_time ?? undefined,
                  note: result.data!.note ?? undefined,
                }
              : change
          ),
        }))
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 font-bold mb-1">本日のPV</span>
          <span className="text-xl font-bold text-gold">{dashboardData.analytics.todayPv}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 font-bold mb-1">昨日のPV</span>
          <span className="text-xl font-bold text-gray-600">{dashboardData.analytics.yesterdayPv}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 font-bold mb-1">アクティブ</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xl font-bold text-[#171717]">{dashboardData.analytics.activeUsers}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#06C755] hover:bg-[#06C755]/90 text-white font-bold rounded-xl transition-all text-sm tracking-widest shadow-md"
      >
        <Copy size={16} />
        本日の営業状況をコピー
      </button>

      {grouped.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <SectionHeader icon={<Users size={16} />} label="出勤キャスト" count={dashboardData.shifts.filter((s) => !dashboardData.absentCastIds.includes(s.cast_id)).length + dashboardData.dispatches.length} />
          <div className="space-y-3">
            {grouped.map(([time, group]) => (
              <div key={time} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#171717]">{time}〜</span>
                  <span className="text-xs text-gray-400">{group.casts.length + group.dispatches.length}名</span>
                </div>
                <div className="px-4 py-2 space-y-1">
                  {group.casts.map((name) => (
                    <div key={name} className="text-sm text-[#171717] py-1 border-b border-gray-50 last:border-0">{name}</div>
                  ))}
                  {group.dispatches.map((name) => (
                    <div key={name} className="text-sm py-1 border-b border-gray-50 last:border-0 flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">派遣</span>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!showDispatchForm ? (
            <button onClick={() => setShowDispatchForm(true)} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
              <Plus size={14} /> 派遣を追加
            </button>
          ) : (
            <form action={handleAddDispatch} className="mt-3 space-y-2 p-3 bg-blue-50 rounded-lg">
              <input name="name" type="text" placeholder="派遣キャスト名" required className={inputClass} />
              <input name="start_time" type="time" required className={inputClass} />
              <div className="flex gap-2">
                <button type="submit" disabled={isBusy('add-dispatch')} className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg disabled:opacity-60">追加</button>
                <button type="button" onClick={() => setShowDispatchForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
              </div>
            </form>
          )}

          {dashboardData.dispatches.length > 0 && (
            <div className="mt-2 space-y-1">
              {dashboardData.dispatches.map((dispatch) => (
                <div key={dispatch.id} className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>{dispatch.name}（{dispatch.start_time.substring(0, 5)}〜）</span>
                  <button
                    disabled={isBusy(`dispatch-${dispatch.id}`)}
                    onClick={() => {
                      const previousDispatches = dashboardData.dispatches
                      handleDelete(
                        `dispatch-${dispatch.id}`,
                        () => {
                          setDashboardData((current) => ({
                            ...current,
                            dispatches: current.dispatches.filter((entry) => entry.id !== dispatch.id),
                          }))
                        },
                        () => {
                          setDashboardData((current) => ({ ...current, dispatches: previousDispatches }))
                        },
                        () => deleteDispatch(dispatch.id)
                      )
                    }}
                  >
                    <Trash2 size={12} className="hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <SectionHeader icon={<Star size={16} />} label="体入" />
        {dashboardData.trials.length > 0 ? (
          <div className="space-y-2 mb-3">
            {dashboardData.trials.map((trial) => (
              <div key={trial.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">体入</span>
                  <span className="text-sm">{trial.name}（{trial.start_time.substring(0, 5)}〜）</span>
                </div>
                <button
                  disabled={isBusy(`trial-${trial.id}`)}
                  onClick={() => {
                    const previousTrials = dashboardData.trials
                    handleDelete(
                      `trial-${trial.id}`,
                      () => {
                        setDashboardData((current) => ({
                          ...current,
                          trials: current.trials.filter((entry) => entry.id !== trial.id),
                        }))
                      },
                      () => {
                        setDashboardData((current) => ({ ...current, trials: previousTrials }))
                      },
                      () => deleteTrial(trial.id)
                    )
                  }}
                >
                  <Trash2 size={12} className="text-gray-300 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">本日の体入はありません</p>}

        {!showTrialForm ? (
          <button onClick={() => setShowTrialForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
            <Plus size={14} /> 体入を追加
          </button>
        ) : (
          <form action={handleAddTrial} className="space-y-2 p-3 bg-purple-50 rounded-lg">
            <input name="name" type="text" placeholder="体入キャスト名" required className={inputClass} />
            <input name="start_time" type="time" required className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" disabled={isBusy('add-trial')} className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg disabled:opacity-60">追加</button>
              <button type="button" onClick={() => setShowTrialForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <SectionHeader icon={<ChevronRight size={16} />} label="スタッフ出勤" />
        {dashboardData.staffAttendances.length > 0 ? (
          <div className="space-y-2 mb-3">
            {dashboardData.staffAttendances.map((attendance) => (
              <div key={attendance.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">{attendance.display_name}（{attendance.start_time.substring(0, 5)}〜）</span>
                <button
                  disabled={isBusy(`staff-${attendance.id}`)}
                  onClick={() => {
                    const previousAttendances = dashboardData.staffAttendances
                    handleDelete(
                      `staff-${attendance.id}`,
                      () => {
                        setDashboardData((current) => ({
                          ...current,
                          staffAttendances: current.staffAttendances.filter((entry) => entry.id !== attendance.id),
                        }))
                      },
                      () => {
                        setDashboardData((current) => ({ ...current, staffAttendances: previousAttendances }))
                      },
                      () => deleteStaffAttendance(attendance.id)
                    )
                  }}
                >
                  <Trash2 size={12} className="text-gray-300 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">スタッフ未登録</p>}

        {!showStaffForm ? (
          <button onClick={() => setShowStaffForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
            <Plus size={14} /> スタッフを追加
          </button>
        ) : (
          <form action={handleAddStaff} className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <select name="staff_id" required className={inputClass}>
              <option value="">スタッフを選択</option>
              {dashboardData.allStaffs.map((staff) => (
                <option key={staff.id} value={staff.id}>{staff.display_name} ({staff.role || '役割なし'})</option>
              ))}
            </select>
            <input name="start_time" type="time" required className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" disabled={isBusy('add-staff')} className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg disabled:opacity-60">追加</button>
              <button type="button" onClick={() => setShowStaffForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
            {dashboardData.allStaffs.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                ※人材管理からスタッフを登録してください
              </p>
            )}
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
        <SectionHeader icon={<Clock size={16} />} label="当日変更" />
        {dashboardData.shiftChanges.filter((change) => change.new_time).length > 0 ? (
          <div className="space-y-2 mb-3">
            {dashboardData.shiftChanges.filter((change) => change.new_time).map((change) => (
              <div key={change.id} className="flex items-center justify-between py-2 border-b border-orange-50">
                <div className="text-sm">
                  <span className="font-bold text-orange-600">{change.stage_name}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {change.original_time?.substring(0, 5)} → {change.new_time?.substring(0, 5)}
                    {change.note && `（${change.note}）`}
                  </span>
                </div>
                <button
                  disabled={isBusy(`change-${change.id}`)}
                  onClick={() => {
                    const previousChanges = dashboardData.shiftChanges
                    handleDelete(
                      `change-${change.id}`,
                      () => {
                        setDashboardData((current) => ({
                          ...current,
                          shiftChanges: current.shiftChanges.filter((entry) => entry.id !== change.id),
                        }))
                      },
                      () => {
                        setDashboardData((current) => ({ ...current, shiftChanges: previousChanges }))
                      },
                      () => deleteShiftChange(change.id)
                    )
                  }}
                >
                  <Trash2 size={12} className="text-gray-300 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">当日変更なし</p>}

        {!showChangeForm ? (
          <button onClick={() => setShowChangeForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors py-2 border border-dashed border-orange-100 rounded-lg">
            <Plus size={14} /> 変更を追加
          </button>
        ) : (
          <form action={handleAddShiftChange} className="space-y-2 p-3 bg-orange-50 rounded-lg">
            <select name="cast_id" required className={inputClass}>
              <option value="">キャストを選択</option>
              {casts.map((cast) => <option key={cast.id} value={cast.id}>{cast.stage_name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">変更前</label>
                <input name="original_time" type="time" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">変更後</label>
                <input name="new_time" type="time" className={inputClass} />
              </div>
            </div>
            <input name="note" type="text" placeholder="メモ（同伴ありなど）" className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" disabled={isBusy('add-change')} className="flex-1 py-2 bg-orange-500 text-white text-xs rounded-lg disabled:opacity-60">追加</button>
              <button type="button" onClick={() => setShowChangeForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
          </form>
        )}
      </div>

      {absentNames.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <SectionHeader icon={<AlertTriangle size={16} />} label="当日欠勤" />
          <div className="space-y-1">
            {[...new Set(absentNames)].map((name) => (
              <div key={name} className="text-sm font-bold text-red-600 py-1">{name}</div>
            ))}
          </div>
        </div>
      )}

      {dashboardData.reservations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <SectionHeader icon={<Calendar size={16} />} label="来店予定" count={dashboardData.reservations.length} />
          <div className="space-y-2">
            {dashboardData.reservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm font-bold text-gold w-12 shrink-0">{reservation.visit_time.substring(0, 5)}</span>
                <span className="text-sm font-bold">{reservation.stage_name}</span>
                <span className="text-sm text-gray-600">{reservation.guest_name}様</span>
                {reservation.guest_count ? (
                  <span className="text-xs text-gray-500 shrink-0">{reservation.guest_count}名</span>
                ) : null}
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-auto shrink-0 ${reservation.reservation_type === 'douhan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                  {reservation.reservation_type === 'douhan' ? '同伴' : '来店予定'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardData.unconfirmedCasts.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
          <SectionHeader icon={<AlertTriangle size={16} />} label="未確認キャスト" count={dashboardData.unconfirmedCasts.length} />
          <div className="space-y-1">
            {dashboardData.unconfirmedCasts.map((cast) => (
              <div key={cast.cast_id} className="text-sm font-bold text-amber-700 py-1">{cast.stage_name}</div>
            ))}
          </div>
          <p className="text-xs text-red-400 mt-3">本日の確認フォームを未送信のキャストです</p>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-6 right-6 rounded-full bg-[#171717] text-white text-xs font-bold px-4 py-2 shadow-lg">
          更新中...
        </div>
      )}
    </div>
  )
}
