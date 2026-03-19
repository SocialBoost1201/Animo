'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  TodayDashboardData,
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
import { getCasts } from '@/lib/actions/casts'
import { Copy, Plus, Trash2, Users, Truck, Star, ChevronRight, AlertTriangle, Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Cast = { id: string; stage_name?: string }

type Props = {
  data: TodayDashboardData
  casts: Cast[]
}

// 時間グルーピングヘルパー
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

export function TodayDashboard({ data, casts }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDispatchForm, setShowDispatchForm] = useState(false)
  const [showTrialForm, setShowTrialForm] = useState(false)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)

  const grouped = groupByTime(data.shifts, data.dispatches, data.absentCastIds)
  const absentNames = [...data.shifts.filter(s => data.absentCastIds.includes(s.cast_id)).map(s => s.stage_name),
    ...data.shiftChanges.filter(c => !c.new_time).map(c => c.stage_name)]

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors'

  // LINE共有
  const handleCopy = async () => {
    const text = await generateLineText(data)
    await navigator.clipboard.writeText(text)
    toast.success('コピーしました ✓')
  }

  const handleAction = (action: () => Promise<{ error?: string } | { success: boolean }>) => {
    startTransition(async () => {
      const result = await action()
      if ('error' in result && result.error) toast.error(result.error)
      else router.refresh()
    })
  }

  const SectionHeader = ({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-gold">{icon}</div>
      <span className="text-xs font-bold tracking-widest uppercase text-gray-600">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-xs bg-gold/10 text-gold font-bold px-2 py-0.5 rounded-full">{count}名</span>
      )}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* LINE共有ボタン */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#06C755] hover:bg-[#06C755]/90 text-white font-bold rounded-xl transition-all text-sm tracking-widest shadow-md"
      >
        <Copy size={16} />
        本日の営業状況をコピー
      </button>

      {/* 出勤キャスト */}
      {grouped.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <SectionHeader icon={<Users size={16} />} label="出勤キャスト" count={data.shifts.filter(s => !data.absentCastIds.includes(s.cast_id)).length + data.dispatches.length} />
          <div className="space-y-3">
            {grouped.map(([time, group]) => (
              <div key={time} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#171717]">{time}〜</span>
                  <span className="text-xs text-gray-400">{group.casts.length + group.dispatches.length}名</span>
                </div>
                <div className="px-4 py-2 space-y-1">
                  {group.casts.map(name => (
                    <div key={name} className="text-sm text-[#171717] py-1 border-b border-gray-50 last:border-0">{name}</div>
                  ))}
                  {group.dispatches.map(name => (
                    <div key={name} className="text-sm py-1 border-b border-gray-50 last:border-0 flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">派遣</span>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 派遣追加 */}
          {!showDispatchForm ? (
            <button onClick={() => setShowDispatchForm(true)} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
              <Plus size={14} /> 派遣を追加
            </button>
          ) : (
            <form action={async (fd) => { fd.set('dispatch_date', data.date); await addDispatch(fd); setShowDispatchForm(false); router.refresh() }} className="mt-3 space-y-2 p-3 bg-blue-50 rounded-lg">
              <input name="name" type="text" placeholder="派遣キャスト名" required className={inputClass} />
              <input name="start_time" type="time" required className={inputClass} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg">追加</button>
                <button type="button" onClick={() => setShowDispatchForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
              </div>
            </form>
          )}

          {/* 派遣削除 */}
          {data.dispatches.length > 0 && (
            <div className="mt-2 space-y-1">
              {data.dispatches.map(d => (
                <div key={d.id} className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>{d.name}（{d.start_time.substring(0, 5)}〜）</span>
                  <button onClick={() => handleAction(() => deleteDispatch(d.id))}><Trash2 size={12} className="hover:text-red-400" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 体入 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <SectionHeader icon={<Star size={16} />} label="体入" />
        {data.trials.length > 0 ? (
          <div className="space-y-2 mb-3">
            {data.trials.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">体入</span>
                  <span className="text-sm">{t.name}（{t.start_time.substring(0, 5)}〜）</span>
                </div>
                <button onClick={() => handleAction(() => deleteTrial(t.id))}><Trash2 size={12} className="text-gray-300 hover:text-red-400" /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">本日の体入はありません</p>}

        {!showTrialForm ? (
          <button onClick={() => setShowTrialForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
            <Plus size={14} /> 体入を追加
          </button>
        ) : (
          <form action={async (fd) => { fd.set('trial_date', data.date); await addTrial(fd); setShowTrialForm(false); router.refresh() }} className="space-y-2 p-3 bg-purple-50 rounded-lg">
            <input name="name" type="text" placeholder="体入キャスト名" required className={inputClass} />
            <input name="start_time" type="time" required className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg">追加</button>
              <button type="button" onClick={() => setShowTrialForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
          </form>
        )}
      </div>

      {/* スタッフ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <SectionHeader icon={<ChevronRight size={16} />} label="スタッフ出勤" />
        {data.staffAttendances.length > 0 ? (
          <div className="space-y-2 mb-3">
            {data.staffAttendances.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">{s.display_name}（{s.start_time.substring(0, 5)}〜）</span>
                <button onClick={() => handleAction(() => deleteStaffAttendance(s.id))}><Trash2 size={12} className="text-gray-300 hover:text-red-400" /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">スタッフ未登録</p>}

        {!showStaffForm ? (
          <button onClick={() => setShowStaffForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors py-2 border border-dashed border-gray-200 rounded-lg">
            <Plus size={14} /> スタッフを追加
          </button>
        ) : (
          <form action={async (fd) => { fd.set('staff_date', data.date); await addStaffAttendance(fd); setShowStaffForm(false); router.refresh() }} className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <input name="display_name" type="text" placeholder="スタッフ名（例: なべちゃん）" required className={inputClass} />
            <input name="start_time" type="time" required className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-[#171717] text-white text-xs rounded-lg">追加</button>
              <button type="button" onClick={() => setShowStaffForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
          </form>
        )}
      </div>

      {/* 当日変更 */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
        <SectionHeader icon={<Clock size={16} />} label="当日変更" />
        {data.shiftChanges.filter(c => c.new_time).length > 0 ? (
          <div className="space-y-2 mb-3">
            {data.shiftChanges.filter(c => c.new_time).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-orange-50">
                <div className="text-sm">
                  <span className="font-bold text-orange-600">{c.stage_name}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {c.original_time?.substring(0, 5)} → {c.new_time?.substring(0, 5)}
                    {c.note && `（${c.note}）`}
                  </span>
                </div>
                <button onClick={() => handleAction(() => deleteShiftChange(c.id))}><Trash2 size={12} className="text-gray-300 hover:text-red-400" /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-gray-300 mb-3">当日変更なし</p>}

        {!showChangeForm ? (
          <button onClick={() => setShowChangeForm(true)} className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors py-2 border border-dashed border-orange-100 rounded-lg">
            <Plus size={14} /> 変更を追加
          </button>
        ) : (
          <form action={async (fd) => { fd.set('change_date', data.date); await addShiftChange(fd); setShowChangeForm(false); router.refresh() }} className="space-y-2 p-3 bg-orange-50 rounded-lg">
            <select name="cast_id" required className={inputClass}>
              <option value="">キャストを選択</option>
              {casts.map(c => <option key={c.id} value={c.id}>{c.stage_name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">変更前</label>
                <input name="original_time" type="time" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">変更後</label>
                <input name="new_time" type="time" className={inputClass} />
              </div>
            </div>
            <input name="note" type="text" placeholder="メモ（同伴ありなど）" className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-orange-500 text-white text-xs rounded-lg">追加</button>
              <button type="button" onClick={() => setShowChangeForm(false)} className="px-4 py-2 text-xs text-gray-500 rounded-lg border">戻る</button>
            </div>
          </form>
        )}
      </div>

      {/* 当日欠勤 */}
      {absentNames.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <SectionHeader icon={<AlertTriangle size={16} />} label="当日欠勤" />
          <div className="space-y-1">
            {[...new Set(absentNames)].map(name => (
              <div key={name} className="text-sm font-bold text-red-600 py-1">{name}</div>
            ))}
          </div>
        </div>
      )}

      {/* 来店予定 */}
      {data.reservations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <SectionHeader icon={<Calendar size={16} />} label="来店予定" count={data.reservations.length} />
          <div className="space-y-2">
            {data.reservations.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm font-bold text-gold w-12 shrink-0">{r.visit_time.substring(0, 5)}</span>
                <span className="text-sm font-bold">{r.stage_name}</span>
                <span className="text-sm text-gray-600">{r.guest_name}様</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-auto shrink-0 ${r.reservation_type === 'douhan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                  {r.reservation_type === 'douhan' ? '同伴' : '来店予定'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 未確認キャスト */}
      {data.unconfirmedCasts.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <SectionHeader icon={<AlertTriangle size={16} />} label="未確認キャスト" count={data.unconfirmedCasts.length} />
          <div className="space-y-1">
            {data.unconfirmedCasts.map(c => (
              <div key={c.cast_id} className="text-sm font-bold text-red-600 py-1">{c.stage_name}</div>
            ))}
          </div>
          <p className="text-[10px] text-red-400 mt-2">本日の確認フォームを未送信のキャストです</p>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-[#171717] text-white text-xs px-4 py-2 rounded-full">処理中...</div>
      )}
    </div>
  )
}
