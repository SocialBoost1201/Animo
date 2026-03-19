'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { StaffSlave } from './staffs'
import { getAnalyticsSummary } from './analytics'

// 曜日の日本語変換
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export type TodayShiftCast = {
  cast_id: string
  stage_name: string
  start_time: string
}

export type TodayDispatch = {
  id: string
  name: string
  start_time: string
}

export type TodayTrial = {
  id: string
  name: string
  start_time: string
}

export type TodayReservation = {
  id: string
  cast_id: string
  stage_name: string
  visit_time: string
  guest_name: string
  reservation_type: 'douhan' | 'reservation'
  note?: string
}

export type TodayCheckin = {
  id: string
  cast_id: string
  stage_name: string
  has_change: boolean
  change_note?: string
  is_absent: boolean
  memo?: string
}

export type TodayShiftChange = {
  id: string
  cast_id: string
  stage_name: string
  original_time?: string
  new_time?: string
  note?: string
}

export type StaffAttendance = {
  id: string
  display_name: string
  start_time: string
}

export type AnalyticsSummary = {
  todayPv: number
  yesterdayPv: number
  activeUsers: number
}

export type TodayDashboardData = {
  date: string
  shifts: TodayShiftCast[]
  dispatches: TodayDispatch[]
  trials: TodayTrial[]
  reservations: TodayReservation[]
  checkins: TodayCheckin[]
  shiftChanges: TodayShiftChange[]
  staffAttendances: StaffAttendance[]
  absentCastIds: string[]
  unconfirmedCasts: { cast_id: string; stage_name: string }[]
  allStaffs: StaffSlave[]
  mailSentCastIds: string[]  // 当日に確認メールを送信済みのキャストID一覧
  analytics: AnalyticsSummary
}

// ==========================================
// 本日の全データ取得
// ==========================================
export async function getTodayDashboard(dateStr?: string): Promise<TodayDashboardData> {
  const supabase = await createClient()
  const today = dateStr || new Date().toISOString().split('T')[0]

  // 本日の承認済みシフトを取得
  const { data: shiftsRaw } = await supabase
    .from('shift_submissions')
    .select('cast_id, shifts_data, casts(stage_name)')
    .eq('status', 'approved')

  // shifts_dataのJSONから本日の出勤を抽出
  const todayShifts: TodayShiftCast[] = []
  if (shiftsRaw) {
    for (const row of shiftsRaw) {
      const data = row.shifts_data as Record<string, { type: string; start: string; end: string }>
      if (data[today] && data[today].type === 'work') {
        const cast = row.casts as unknown as { stage_name: string } | null
        todayShifts.push({
          cast_id: row.cast_id,
          stage_name: cast?.stage_name || '不明',
          start_time: data[today].start || '20:00',
        })
      }
    }
  }
  todayShifts.sort((a, b) => a.start_time.localeCompare(b.start_time))

  // 派遣
  const { data: dispatches } = await supabase
    .from('daily_dispatches')
    .select('id, name, start_time')
    .eq('dispatch_date', today)
    .order('start_time')

  // 体入
  const { data: trials } = await supabase
    .from('daily_trials')
    .select('id, name, start_time')
    .eq('trial_date', today)
    .order('start_time')

  // 来店予定
  const { data: reservationsRaw } = await supabase
    .from('daily_reservations')
    .select('id, cast_id, visit_time, guest_name, reservation_type, note, casts(stage_name)')
    .eq('reservation_date', today)
    .order('visit_time')

  const reservations: TodayReservation[] = (reservationsRaw || []).map(r => {
    const cast = r.casts as unknown as { stage_name: string } | null
    return {
      id: r.id,
      cast_id: r.cast_id,
      stage_name: cast?.stage_name || '不明',
      visit_time: r.visit_time,
      guest_name: r.guest_name,
      reservation_type: r.reservation_type,
      note: r.note,
    }
  })

  // 当日確認チェックイン
  const { data: checkinsRaw } = await supabase
    .from('daily_checkins')
    .select('id, cast_id, has_change, change_note, is_absent, memo, casts(stage_name)')
    .eq('checkin_date', today)

  const checkins: TodayCheckin[] = (checkinsRaw || []).map(c => {
    const cast = c.casts as unknown as { stage_name: string } | null
    return {
      id: c.id,
      cast_id: c.cast_id,
      stage_name: cast?.stage_name || '不明',
      has_change: c.has_change,
      change_note: c.change_note,
      is_absent: c.is_absent,
      memo: c.memo,
    }
  })

  // 当日変更
  const { data: changesRaw } = await supabase
    .from('shift_changes')
    .select('id, cast_id, original_time, new_time, note, casts(stage_name)')
    .eq('change_date', today)

  const shiftChanges: TodayShiftChange[] = (changesRaw || []).map(c => {
    const cast = c.casts as unknown as { stage_name: string } | null
    return {
      id: c.id,
      cast_id: c.cast_id,
      stage_name: cast?.stage_name || '不明',
      original_time: c.original_time,
      new_time: c.new_time,
      note: c.note,
    }
  })

  // スタッフ出勤
  const { data: staffAttendances } = await supabase
    .from('daily_staff_attendances')
    .select('id, display_name, start_time, staff_id')
    .eq('staff_date', today)
    .order('start_time')

  // 全スタッフ（マスタ）
  const { data: allStaffs } = await supabase
    .from('staffs')
    .select('*')
    .eq('is_active', true)
    .order('display_name')

  // 欠勤キャストID一覧
  const absentCastIds = checkins.filter(c => c.is_absent).map(c => c.cast_id)

  // 未確認キャスト（本日シフトがあるがcheckinを未提出）
  const checkedCastIds = new Set(checkins.map(c => c.cast_id))
  const unconfirmedCasts = todayShifts
    .filter(s => !checkedCastIds.has(s.cast_id))
    .map(s => ({ cast_id: s.cast_id, stage_name: s.stage_name }))

  // 当日の確認メール送信済みキャストID
  const { data: mailLogsRaw } = await supabase
    .from('checkin_mail_logs')
    .select('cast_id, sent_at')
    .eq('sent_date', today)
    .eq('status', 'sent')

  const mailSentCastIds = (mailLogsRaw || []).map(l => l.cast_id)

  return {
    date: today,
    shifts: todayShifts,
    dispatches: dispatches || [],
    trials: trials || [],
    reservations,
    checkins,
    shiftChanges,
    staffAttendances: staffAttendances || [],
    absentCastIds,
    unconfirmedCasts,
    allStaffs: allStaffs || [],
    mailSentCastIds,
    analytics: await getAnalyticsSummary(),
  }
}

// ==========================================
// LINE共有テキスト生成
// ==========================================
export async function generateLineText(data: TodayDashboardData): Promise<string> {
  const d = new Date(data.date)
  const weekday = WEEKDAYS[d.getDay()]
  const dateLabel = `${d.getMonth() + 1}月${d.getDate()}日（${weekday}）`

  const lines: string[] = []
  lines.push('本日の営業状況')
  lines.push(dateLabel)

  // 出勤キャスト（時間ごとグループ、欠勤除外）
  const activeCasts = data.shifts.filter(s => !data.absentCastIds.includes(s.cast_id))
  if (activeCasts.length > 0 || data.dispatches.length > 0) {
    const groups: Record<string, string[]> = {}
    for (const cast of activeCasts) {
      const time = cast.start_time.substring(0, 5)
      if (!groups[time]) groups[time] = []
      groups[time].push(cast.stage_name)
    }
    // 派遣を同じ時間グループに追加
    for (const d of data.dispatches) {
      const time = d.start_time.substring(0, 5)
      if (!groups[time]) groups[time] = []
      groups[time].push(`${d.name}（派遣）`)
    }
    
    lines.push('')
    lines.push('出勤キャスト')
    for (const time of Object.keys(groups).sort()) {
      lines.push(`${time}〜`)
      for (const name of groups[time]) {
        lines.push(name)
      }
    }
  }

  // 体入
  if (data.trials.length > 0) {
    lines.push('')
    lines.push('体入')
    for (const t of data.trials) {
      lines.push(`${t.name}（${t.start_time.substring(0, 5)}〜）`)
    }
  }

  // スタッフ
  if (data.staffAttendances.length > 0) {
    lines.push('')
    lines.push('スタッフ')
    for (const s of data.staffAttendances) {
      lines.push(`${s.display_name}（${s.start_time.substring(0, 5)}〜）`)
    }
  }

  // 当日変更
  const changes = data.shiftChanges.filter(c => c.new_time !== null)
  if (changes.length > 0) {
    lines.push('')
    lines.push('当日変更')
    for (const c of changes) {
      const from = c.original_time ? c.original_time.substring(0, 5) : '?'
      const to = c.new_time ? c.new_time.substring(0, 5) : '?'
      const noteStr = c.note ? `（${c.note}）` : ''
      lines.push(`${c.stage_name}（${from} → ${to}）${noteStr}`)
    }
  }

  // 当日欠勤
  const absentNames = data.shifts
    .filter(s => data.absentCastIds.includes(s.cast_id))
    .map(s => s.stage_name)
  const changeAbsents = data.shiftChanges
    .filter(c => !c.new_time)
    .map(c => c.stage_name)
  const absentAll = [...new Set([...absentNames, ...changeAbsents])]
  if (absentAll.length > 0) {
    lines.push('')
    lines.push('当日欠勤')
    for (const name of absentAll) {
      lines.push(name)
    }
  }

  // 来店予定
  if (data.reservations.length > 0) {
    lines.push('')
    lines.push('来店予定')
    for (const r of data.reservations) {
      const typeLabel = r.reservation_type === 'douhan' ? '同伴' : '来店予定'
      lines.push(`${r.visit_time.substring(0, 5)}　${r.stage_name}　${r.guest_name}様　${typeLabel}`)
    }
  }

  // 未確認キャスト
  if (data.unconfirmedCasts.length > 0) {
    lines.push('')
    lines.push('未確認キャスト')
    for (const c of data.unconfirmedCasts) {
      lines.push(c.stage_name)
    }
  }

  return lines.join('\n')
}

// ==========================================
// 書き込み系アクション
// ==========================================

export async function addDispatch(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('daily_dispatches').insert({
    dispatch_date: formData.get('dispatch_date') as string,
    name: formData.get('name') as string,
    start_time: formData.get('start_time') as string,
    note: (formData.get('note') as string) || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/today')
  return { success: true }
}

export async function deleteDispatch(id: string) {
  const supabase = await createClient()
  await supabase.from('daily_dispatches').delete().eq('id', id)
  revalidatePath('/admin/today')
  return { success: true }
}

export async function addTrial(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('daily_trials').insert({
    trial_date: formData.get('trial_date') as string,
    name: formData.get('name') as string,
    start_time: formData.get('start_time') as string,
    note: (formData.get('note') as string) || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/today')
  return { success: true }
}

export async function deleteTrial(id: string) {
  const supabase = await createClient()
  await supabase.from('daily_trials').delete().eq('id', id)
  revalidatePath('/admin/today')
  return { success: true }
}

export async function addShiftChange(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('shift_changes').insert({
    cast_id: formData.get('cast_id') as string,
    change_date: formData.get('change_date') as string,
    original_time: (formData.get('original_time') as string) || null,
    new_time: (formData.get('new_time') as string) || null,
    note: (formData.get('note') as string) || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/today')
  return { success: true }
}

export async function deleteShiftChange(id: string) {
  const supabase = await createClient()
  await supabase.from('shift_changes').delete().eq('id', id)
  revalidatePath('/admin/today')
  return { success: true }
}

export async function addStaffAttendance(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('daily_staff_attendances').insert({
    staff_date: formData.get('staff_date') as string,
    display_name: formData.get('display_name') as string,
    start_time: formData.get('start_time') as string,
    staff_id: (formData.get('staff_id') as string) || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/today')
  return { success: true }
}

export async function deleteStaffAttendance(id: string) {
  const supabase = await createClient()
  await supabase.from('daily_staff_attendances').delete().eq('id', id)
  revalidatePath('/admin/today')
  return { success: true }
}

// ==========================================
// キャスト側: 当日確認フォーム
// ==========================================
export async function submitCheckin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未認証です' }

  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!cast) return { error: 'キャスト情報が見つかりません' }

  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase.from('daily_checkins').upsert({
    cast_id: cast.id,
    checkin_date: today,
    has_change: formData.get('has_change') === 'true',
    change_note: (formData.get('change_note') as string) || null,
    is_absent: formData.get('is_absent') === 'true',
    memo: (formData.get('memo') as string) || null,
    submitted_at: new Date().toISOString(),
  }, { onConflict: 'cast_id,checkin_date' })

  if (error) return { error: error.message }
  revalidatePath('/cast/dashboard')
  return { success: true }
}

// ==========================================
// キャスト側: 来店予定
// ==========================================
export async function addReservation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未認証です' }

  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!cast) return { error: 'キャスト情報が見つかりません' }

  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase.from('daily_reservations').insert({
    cast_id: cast.id,
    reservation_date: today,
    visit_time: formData.get('visit_time') as string,
    guest_name: formData.get('guest_name') as string,
    reservation_type: formData.get('reservation_type') as string,
    note: (formData.get('note') as string) || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/cast/dashboard')
  return { success: true }
}

export async function deleteReservation(id: string) {
  const supabase = await createClient()
  await supabase.from('daily_reservations').delete().eq('id', id)
  revalidatePath('/cast/dashboard')
  return { success: true }
}

export async function getCastTodayReservations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!cast) return []

  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_reservations')
    .select('*')
    .eq('cast_id', cast.id)
    .eq('reservation_date', today)
    .order('visit_time')

  return data || []
}

export async function getCastTodayCheckin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!cast) return null

  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('cast_id', cast.id)
    .eq('checkin_date', today)
    .maybeSingle()

  return data
}
