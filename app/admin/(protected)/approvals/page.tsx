import { createClient } from '@/lib/supabase/server'
import {
  approveCheckin,
  approveReservation,
  getTodayDashboard,
  rejectCheckin,
  rejectReservation,
} from '@/lib/actions/today'
import {
  approveShiftSubmission,
  getShiftSubmissions,
  rejectShiftSubmission,
} from '@/lib/actions/admin-shifts'
import { updateCastPostStatus } from '@/lib/actions/cast-posts'
import { revalidatePath } from 'next/cache'

type CastPostPending = {
  id: string
  content: string
  created_at: string
  casts: { stage_name: string | null } | { stage_name: string | null }[] | null
}

function getCastName(casts: CastPostPending['casts']): string {
  if (Array.isArray(casts)) return casts[0]?.stage_name ?? '不明'
  return casts?.stage_name ?? '不明'
}

function formatShiftSummary(
  shiftsData: Record<string, { type: string; start?: string; end?: string }>
): string {
  const workDays = Object.entries(shiftsData)
    .filter(([, shift]) => shift.type === 'work')
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 3)
    .map(([date, shift]) => `${date} ${shift.start ?? '--:--'}-${shift.end ?? 'LAST'}`)

  if (workDays.length === 0) return '出勤シフトなし'
  return workDays.join(' / ')
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':')
  const parsedHours = Number.parseInt(hours ?? '0', 10)
  const parsedMinutes = Number.parseInt(minutes ?? '0', 10)
  return parsedHours * 60 + parsedMinutes
}

type UrgencyLevel = 'danger' | 'warning' | 'normal'
type PriorityType = 'douhan' | 'reservation' | 'normal'

function getJstDateParts(base = new Date()): { year: number; month: number; day: number; weekday: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
  const parts = formatter.formatToParts(base)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  return {
    year: Number.parseInt(map.year ?? '1970', 10),
    month: Number.parseInt(map.month ?? '01', 10),
    day: Number.parseInt(map.day ?? '01', 10),
    weekday: weekdayMap[map.weekday ?? 'Sun'] ?? 0,
  }
}

function createJstDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, 0))
}

function getToday1845Deadline(now = new Date()): Date {
  const { year, month, day } = getJstDateParts(now)
  return createJstDate(year, month, day, 18, 45)
}

function getNextSaturday2100Deadline(now = new Date()): Date {
  const { year, month, day, weekday } = getJstDateParts(now)
  let daysUntilSaturday = (6 - weekday + 7) % 7
  if (daysUntilSaturday === 0) daysUntilSaturday = 7

  const upcomingSaturdayBase = createJstDate(year, month, day, 0, 0)
  upcomingSaturdayBase.setUTCDate(upcomingSaturdayBase.getUTCDate() + daysUntilSaturday)
  return createJstDate(
    upcomingSaturdayBase.getUTCFullYear(),
    upcomingSaturdayBase.getUTCMonth() + 1,
    upcomingSaturdayBase.getUTCDate(),
    21,
    0
  )
}

function getUrgencyStatus(deadline: Date, now = new Date()): UrgencyLevel {
  if (now.getTime() > deadline.getTime()) return 'danger'
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 2 * 60 * 60 * 1000) return 'warning'
  return 'normal'
}

function getUrgencyBadgeMeta(urgency: UrgencyLevel): { label: string; className: string } | null {
  if (urgency === 'danger') {
    return {
      label: '期限超過',
      className: 'border border-red-300 bg-red-50 text-red-700',
    }
  }
  if (urgency === 'warning') {
    return {
      label: '締切間近',
      className: 'border border-amber-300 bg-amber-50 text-amber-700',
    }
  }
  return null
}

const priorityOrder: Record<PriorityType, number> = {
  douhan: 0,
  reservation: 1,
  normal: 2,
}

const urgencyOrder: Record<UrgencyLevel, number> = {
  danger: 0,
  warning: 1,
  normal: 2,
}

function sortFinal<T>(
  a: T,
  b: T,
  getUrgency: (item: T) => UrgencyLevel,
  getPriorityType: (item: T) => PriorityType,
  fallbackCompare: (left: T, right: T) => number
): number {
  const u = urgencyOrder[getUrgency(a)] - urgencyOrder[getUrgency(b)]
  if (u !== 0) return u

  const p = priorityOrder[getPriorityType(a)] - priorityOrder[getPriorityType(b)]
  if (p !== 0) return p

  return fallbackCompare(a, b) // stable維持
}

function sortByUrgencyPriorityKeepingOrder<T>(
  items: T[],
  getUrgency: (item: T) => UrgencyLevel,
  getPriorityType: (item: T) => PriorityType
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      return sortFinal(
        a,
        b,
        (entry) => getUrgency(entry.item),
        (entry) => getPriorityType(entry.item),
        (left, right) => left.index - right.index
      )
    })
    .map((entry) => entry.item)
}

export default async function AdminApprovalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string }>
}) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const view = resolvedSearchParams.view ?? 'all'

  const [today, shiftResult] = await Promise.all([getTodayDashboard(), getShiftSubmissions('pending')])
  const supabase = await createClient()
  const now = new Date()
  const lane1Deadline = getToday1845Deadline(now)
  const shiftDeadline = getNextSaturday2100Deadline(now)
  const lane1Urgency = getUrgencyStatus(lane1Deadline, now)
  const shiftUrgency = getUrgencyStatus(shiftDeadline, now)
  const lane1Badge = getUrgencyBadgeMeta(lane1Urgency)
  const shiftBadge = getUrgencyBadgeMeta(shiftUrgency)

  const { data: pendingPosts } = await supabase
    .from('cast_posts')
    .select('id, content, created_at, casts(stage_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const pendingShiftSubmissions = shiftResult.data ?? []
  const pendingCastPosts = (pendingPosts ?? []) as CastPostPending[]
  const pendingReservationsByCastId = new Map(
    today.pendingReservations.map((reservation) => [reservation.cast_id, reservation])
  )
  const pendingCheckinCastIds = new Set(today.pendingCheckins.map((checkin) => checkin.cast_id))

  const sortedPendingCheckins = [...today.pendingCheckins].sort((a, b) => {
    const getCheckinPriorityType = (
      reservation: (typeof today.pendingReservations)[number] | undefined
    ): PriorityType => {
      if (reservation?.reservation_type === 'douhan') return 'douhan'
      if (reservation?.reservation_type === 'reservation') return 'reservation'
      return 'normal'
    }

    return sortFinal(
      a,
      b,
      () => lane1Urgency,
      (item) => getCheckinPriorityType(pendingReservationsByCastId.get(item.cast_id)),
      (left, right) => left.stage_name.localeCompare(right.stage_name, 'ja')
    )
  })

  const sortedPendingReservations = [...today.pendingReservations].sort((a, b) => {
    const getReservationPriorityType = (reservationType: string): PriorityType => {
      if (reservationType === 'douhan') return 'douhan'
      if (reservationType === 'reservation') return 'reservation'
      return 'normal'
    }

    return sortFinal(
      a,
      b,
      () => lane1Urgency,
      (item) => getReservationPriorityType(item.reservation_type),
      (left, right) => {
        const timeDiff = toMinutes(left.visit_time) - toMinutes(right.visit_time)
        if (timeDiff !== 0) return timeDiff
        const checkinDiff =
          Number(pendingCheckinCastIds.has(right.cast_id)) - Number(pendingCheckinCastIds.has(left.cast_id))
        if (checkinDiff !== 0) return checkinDiff
        return left.stage_name.localeCompare(right.stage_name, 'ja')
      }
    )
  })

  const sortedPendingShiftSubmissions = [...pendingShiftSubmissions].sort((a, b) => {
    return sortFinal(
      a,
      b,
      () => shiftUrgency,
      () => 'normal',
      (left, right) => left.target_week_monday.localeCompare(right.target_week_monday)
    )
  })

  const sortedPendingCastPosts = [...pendingCastPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const showCheckins =
    view === 'all' ||
    view === 'checkins' ||
    (view === 'alerts' && lane1Urgency !== 'normal')
  const showReservations =
    view === 'all' ||
    view === 'reservations' ||
    (view === 'alerts' && lane1Urgency !== 'normal')
  const showShifts =
    view === 'all' ||
    view === 'shifts' ||
    (view === 'alerts' && shiftUrgency !== 'normal')
  const showPosts = view === 'all' || view === 'posts'

  const visibleCheckins = !showCheckins
    ? []
    : view === 'alerts'
      ? sortByUrgencyPriorityKeepingOrder(
          sortedPendingCheckins,
          () => lane1Urgency,
          (item) => {
            const reservation = pendingReservationsByCastId.get(item.cast_id)
            if (reservation?.reservation_type === 'douhan') return 'douhan'
            if (reservation?.reservation_type === 'reservation') return 'reservation'
            return 'normal'
          }
        )
      : sortedPendingCheckins
  const visibleReservations = !showReservations
    ? []
    : view === 'alerts'
      ? sortByUrgencyPriorityKeepingOrder(
          sortedPendingReservations,
          () => lane1Urgency,
          (item) => (item.reservation_type === 'douhan' ? 'douhan' : item.reservation_type === 'reservation' ? 'reservation' : 'normal')
        )
      : sortedPendingReservations
  const visibleShiftSubmissions = !showShifts
    ? []
    : view === 'alerts'
      ? sortByUrgencyPriorityKeepingOrder(sortedPendingShiftSubmissions, () => shiftUrgency, () => 'normal')
      : sortedPendingShiftSubmissions
  const visibleCastPosts = showPosts ? sortedPendingCastPosts : []

  const approveCheckinAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await approveCheckin(id)
      revalidatePath('/admin/approvals')
    }
  }

  const rejectCheckinAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await rejectCheckin(id)
      revalidatePath('/admin/approvals')
    }
  }

  const approveReservationAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await approveReservation(id)
      revalidatePath('/admin/approvals')
    }
  }

  const rejectReservationAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await rejectReservation(id)
      revalidatePath('/admin/approvals')
    }
  }

  const approveShiftAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await approveShiftSubmission(id)
      revalidatePath('/admin/approvals')
    }
  }

  const rejectShiftAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await rejectShiftSubmission(id)
      revalidatePath('/admin/approvals')
    }
  }

  const approvePostAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await updateCastPostStatus(id, 'published')
      revalidatePath('/admin/approvals')
    }
  }

  const rejectPostAction = async (formData: FormData) => {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string' && id) {
      await updateCastPostStatus(id, 'draft')
      revalidatePath('/admin/approvals')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">承認一覧</h1>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:h-[calc(100vh-180px)]">
        <section className="min-h-0 space-y-3 rounded border p-3 xl:overflow-y-auto">
          <h2 className="text-sm font-semibold">本日の出勤 / 来店予定</h2>

          <div className="space-y-2">
            <p className="text-xs font-medium">出勤承認待ち ({visibleCheckins.length})</p>
            {visibleCheckins.map((checkin) => (
              <article key={checkin.id} className="space-y-2 rounded border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">18:45締切</span>
                  {lane1Badge ? (
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${lane1Badge.className}`}>
                      {lane1Badge.label}
                    </span>
                  ) : null}
                </div>
                <p className="font-medium">{checkin.stage_name}</p>
                <p>欠勤: {checkin.is_absent ? 'あり' : 'なし'}</p>
                <p>変更: {checkin.has_change ? checkin.change_note || 'あり' : 'なし'}</p>
                {checkin.memo ? <p>メモ: {checkin.memo}</p> : null}
                <div className="flex gap-2">
                  <form action={approveCheckinAction}>
                    <input type="hidden" name="id" value={checkin.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs">
                      承認
                    </button>
                  </form>
                  <form action={rejectCheckinAction}>
                    <input type="hidden" name="id" value={checkin.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs">
                      却下
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">来店予定承認待ち ({visibleReservations.length})</p>
            {visibleReservations.map((reservation) => (
              <article key={reservation.id} className="space-y-2 rounded border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">18:45締切</span>
                  {lane1Badge ? (
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${lane1Badge.className}`}>
                      {lane1Badge.label}
                    </span>
                  ) : null}
                </div>
                <p className="font-medium">{reservation.stage_name}</p>
                <p>
                  {reservation.visit_time.slice(0, 5)} / {reservation.guest_name}
                </p>
                <p>種別: {reservation.reservation_type === 'douhan' ? '同伴' : '来店予定'}</p>
                {reservation.note ? <p>メモ: {reservation.note}</p> : null}
                <div className="flex gap-2">
                  <form action={approveReservationAction}>
                    <input type="hidden" name="id" value={reservation.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs">
                      承認
                    </button>
                  </form>
                  <form action={rejectReservationAction}>
                    <input type="hidden" name="id" value={reservation.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs">
                      却下
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="min-h-0 space-y-3 rounded border p-3 xl:overflow-y-auto">
          <h2 className="text-sm font-semibold">シフト承認</h2>
          <p className="text-xs">承認待ち: {visibleShiftSubmissions.length}</p>
          {visibleShiftSubmissions.map((submission) => (
            <article key={submission.id} className="space-y-2 rounded border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">土曜21:00締切</span>
                {shiftBadge ? (
                  <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${shiftBadge.className}`}>
                    {shiftBadge.label}
                  </span>
                ) : null}
              </div>
              <p className="font-medium">{submission.casts.stage_name}</p>
              <p>対象週: {submission.target_week_monday}</p>
              <p>{formatShiftSummary(submission.shifts_data)}</p>
              <div className="flex gap-2">
                <form action={approveShiftAction}>
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs">
                    承認
                  </button>
                </form>
                <form action={rejectShiftAction}>
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs">
                    却下
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>

        <section className="min-h-0 space-y-3 rounded border p-3 xl:overflow-y-auto">
          <h2 className="text-sm font-semibold">その他承認（ブログ）</h2>
          <p className="text-xs">承認待ち: {visibleCastPosts.length}</p>
          {visibleCastPosts.map((post) => (
            <article key={post.id} className="space-y-2 rounded border p-3 text-sm">
              <p className="font-medium">{getCastName(post.casts)}</p>
              <p>{post.content}</p>
              <p className="text-xs">{new Date(post.created_at).toLocaleString('ja-JP')}</p>
              <div className="flex gap-2">
                <form action={approvePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs">
                    承認
                  </button>
                </form>
                <form action={rejectPostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs">
                    却下
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
