import { createServiceClient } from '@/lib/supabase/service'
import {
  approveCheckin,
  approveReservation,
  getTodayDashboard,
  rejectCheckin,
  rejectReservation,
} from '@/lib/actions/today'
import { updateCastPostStatus } from '@/lib/actions/cast-posts'
import { UserCheck, FileText, Clock } from 'lucide-react'

async function approveCheckinAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await approveCheckin(id)
}
async function rejectCheckinAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await rejectCheckin(id)
}
async function approveReservationAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await approveReservation(id)
}
async function rejectReservationAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await rejectReservation(id)
}
async function approvePostAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await updateCastPostStatus(id, 'published')
}
async function rejectPostAction(formData: FormData): Promise<void> {
  'use server'
  const id = formData.get('id')
  if (typeof id === 'string' && id) await updateCastPostStatus(id, 'draft')
}

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

  return fallbackCompare(a, b)
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

  const today = await getTodayDashboard()
  const supabase = createServiceClient()
  const now = new Date()
  const lane1Deadline = getToday1845Deadline(now)
  const lane1Urgency = getUrgencyStatus(lane1Deadline, now)
  const lane1Badge = getUrgencyBadgeMeta(lane1Urgency)

  const { data: pendingPosts } = await supabase
    .from('cast_posts')
    .select('id, content, created_at, casts(stage_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

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
  const visibleCastPosts = showPosts ? sortedPendingCastPosts : []

  return (
    <div className="font-sans space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ffffff08]">
        <div>
          <h1 className="text-[17px] font-bold text-[#f4f1ea] tracking-tight leading-tight">承認ハブ</h1>
          <p className="text-[12px] text-[#8a8478] mt-0.5 leading-relaxed tracking-[0.1px] opacity-70">
            出勤・来店予定・ブログの承認を一元管理
          </p>
        </div>
        {lane1Urgency !== 'normal' && (
          <span className={`rounded-[7px] px-3 py-1.5 text-[11px] font-bold border ${
            lane1Urgency === 'danger'
              ? 'bg-[#c882321a] text-[#c8884d] border-[#c8823226]'
              : 'bg-[#dfbd691a] text-[#dfbd69] border-[#dfbd6926]'
          }`}>
            {lane1Urgency === 'danger' ? '18:45 期限超過' : '締切間近'}
          </span>
        )}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:h-[calc(100vh-200px)]">

        {/* ── Column 1: 出勤 + 来店予定 ── */}
        <div className="flex flex-col card-premium-skin rounded-[18px] min-h-0">
          <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
            <div className="flex items-center justify-between px-5 h-[56px] border-b border-[#ffffff0f] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
                  <UserCheck size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-bold text-[#f4f1ea] tracking-[-0.08px] leading-tight">本日の出勤 / 来店予定</p>
                  <p className="text-[11px] text-[#8a8478] leading-tight">18:45締切</p>
                </div>
              </div>
              {(visibleCheckins.length + visibleReservations.length) > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#dfbd691a] text-[#dfbd69] text-[10px] font-bold">
                  {visibleCheckins.length + visibleReservations.length}
                </span>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-5">
              {/* Checkins */}
              {showCheckins && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold tracking-[1.4px] uppercase text-[#8a8478]">出勤承認待ち</p>
                    {visibleCheckins.length > 0 && (
                      <span className="text-[9px] bg-[#ffffff0a] text-[#8a8478] rounded px-1.5 py-0.5">{visibleCheckins.length}件</span>
                    )}
                  </div>
                  {visibleCheckins.length === 0 ? (
                    <p className="text-[12px] text-[#5a5650] py-4 text-center">承認待ちなし</p>
                  ) : visibleCheckins.map((checkin) => (
                    <article key={checkin.id} className="rounded-[12px] border border-[#ffffff0a] bg-[#ffffff04] p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-[#5a5650]" />
                          <span className="text-[10px] text-[#5a5650]">18:45締切</span>
                        </div>
                        {lane1Badge && (
                          <span className={`rounded-[5px] px-2 py-0.5 text-[9px] font-bold ${lane1Badge.className}`}>
                            {lane1Badge.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] font-bold text-[#f4f1ea] leading-tight">{checkin.stage_name}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#5a5650] w-8 shrink-0">欠勤</span>
                          <span className={`text-[11px] font-medium ${checkin.is_absent ? 'text-[#c8884d]' : 'text-[#8a8478]'}`}>
                            {checkin.is_absent ? 'あり' : 'なし'}
                          </span>
                        </div>
                        {checkin.has_change && (
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-[#5a5650] w-8 shrink-0">変更</span>
                            <span className="text-[11px] text-[#dfbd69]">{checkin.change_note || 'あり'}</span>
                          </div>
                        )}
                        {checkin.memo && (
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-[#5a5650] w-8 shrink-0">メモ</span>
                            <span className="text-[11px] text-[#8a8478]">{checkin.memo}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-0.5">
                        <form action={approveCheckinAction} className="flex-1">
                          <input type="hidden" name="id" value={checkin.id} />
                          <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 transition-opacity">承認</button>
                        </form>
                        <form action={rejectCheckinAction} className="flex-1">
                          <input type="hidden" name="id" value={checkin.id} />
                          <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] border border-[#c8823226] bg-[#c882321a] text-[#c8884d] hover:bg-[#c8823230] transition-colors">却下</button>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Reservations */}
              {showReservations && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold tracking-[1.4px] uppercase text-[#8a8478]">来店予定承認待ち</p>
                    {visibleReservations.length > 0 && (
                      <span className="text-[9px] bg-[#ffffff0a] text-[#8a8478] rounded px-1.5 py-0.5">{visibleReservations.length}件</span>
                    )}
                  </div>
                  {visibleReservations.length === 0 ? (
                    <p className="text-[12px] text-[#5a5650] py-4 text-center">承認待ちなし</p>
                  ) : visibleReservations.map((reservation) => (
                    <article key={reservation.id} className="rounded-[12px] border border-[#ffffff0a] bg-[#ffffff04] p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-[#5a5650]" />
                          <span className="text-[10px] text-[#5a5650]">18:45締切</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {reservation.reservation_type === 'douhan' && (
                            <span className="rounded-[5px] px-2 py-0.5 text-[9px] font-bold bg-[#dfbd691a] text-[#dfbd69] border border-[#dfbd6915]">同伴</span>
                          )}
                          {lane1Badge && (
                            <span className={`rounded-[5px] px-2 py-0.5 text-[9px] font-bold ${lane1Badge.className}`}>
                              {lane1Badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[14px] font-bold text-[#f4f1ea] leading-tight">{reservation.stage_name}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#5a5650] w-10 shrink-0">来店</span>
                          <span className="text-[11px] text-[#c7c0b2]">{reservation.visit_time.slice(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#5a5650] w-10 shrink-0">ゲスト</span>
                          <span className="text-[11px] text-[#c7c0b2]">{reservation.guest_name}</span>
                        </div>
                        {reservation.note && (
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-[#5a5650] w-10 shrink-0">メモ</span>
                            <span className="text-[11px] text-[#8a8478]">{reservation.note}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-0.5">
                        <form action={approveReservationAction} className="flex-1">
                          <input type="hidden" name="id" value={reservation.id} />
                          <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 transition-opacity">承認</button>
                        </form>
                        <form action={rejectReservationAction} className="flex-1">
                          <input type="hidden" name="id" value={reservation.id} />
                          <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] border border-[#c8823226] bg-[#c882321a] text-[#c8884d] hover:bg-[#c8823230] transition-colors">却下</button>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Column 2: ブログ承認 ── */}
        <div className="flex flex-col card-premium-skin rounded-[18px] min-h-0">
          <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
            <div className="flex items-center justify-between px-5 h-[56px] border-b border-[#ffffff0f] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
                  <FileText size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-bold text-[#f4f1ea] tracking-[-0.08px] leading-tight">ブログ承認</p>
                  <p className="text-[11px] text-[#8a8478] leading-tight">公開前審査</p>
                </div>
              </div>
              {visibleCastPosts.length > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#dfbd691a] text-[#dfbd69] text-[10px] font-bold">
                  {visibleCastPosts.length}
                </span>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
              {visibleCastPosts.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-[12px] text-[#5a5650]">承認待ちの投稿なし</p>
                </div>
              ) : visibleCastPosts.map((post) => (
                <article key={post.id} className="rounded-[12px] border border-[#ffffff0a] bg-[#ffffff04] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-[#f4f1ea]">{getCastName(post.casts)}</p>
                    <span className="text-[10px] text-[#5a5650] shrink-0">
                      {new Date(post.created_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8a8478] leading-relaxed line-clamp-4">{post.content}</p>
                  <div className="flex gap-2 pt-0.5">
                    <form action={approvePostAction} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] hover:opacity-90 transition-opacity">承認</button>
                    </form>
                    <form action={rejectPostAction} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="w-full h-8 text-[11px] font-bold rounded-[8px] border border-[#c8823226] bg-[#c882321a] text-[#c8884d] hover:bg-[#c8823230] transition-colors">却下</button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
