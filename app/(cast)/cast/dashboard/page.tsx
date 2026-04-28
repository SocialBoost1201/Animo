import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, Bell, PenLine, ChevronRight, ClipboardCheck, FileText, MessageCircle } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getMyShiftSubmission } from '@/lib/actions/cast-shifts';
import { getTargetWeekMonday, formatDate } from '@/lib/shift-utils';
import { getMySchedulesForWeek } from '@/lib/actions/cast-change-requests';
import { getCastTodayCheckin, getCastTodayReservations } from '@/lib/actions/today';
import { getCastNotices } from '@/lib/actions/cast-notices';
import { createClient } from '@/lib/supabase/server';
import {
  CastMobileCard,
  CastMobileHeader,
  CastMobileHeaderBell,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';
import { getJstDateString } from '@/lib/date-utils';

function getWeeklySummaryLabel(value: 'work' | 'off') {
  if (value === 'work') return { text: '○', color: 'text-[#3b82f6]' };
  return { text: '×', color: 'text-[#ef4444]' };
}

function getNoticeTone(importance: 'high' | 'normal') {
  return importance === 'high'
    ? {
        iconWrap: 'bg-[rgba(230,162,60,0.09)] text-[#e6a23c]',
        title: 'text-[#f7f4ed]',
      }
    : {
        iconWrap: 'bg-[rgba(201,167,106,0.09)] text-[#c9a76a]',
        title: 'text-[#a9afbc]',
      };
}

function getTodayStatusMeta(
  checkinStatus: 'pending' | 'approved' | 'rejected' | null
) {
  switch (checkinStatus) {
    case 'approved':
      return {
        badge: '承認済み',
        badgeClass: 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]',
        description: '承認済みです。変更があれば店長へ連絡してください。',
      };
    case 'pending':
      return {
        badge: '承認待ち',
        badgeClass: 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]',
        description: '送信済みです。店長承認までお待ちください。',
      };
    case 'rejected':
      return {
        badge: '差戻し',
        badgeClass: 'bg-[rgba(224,106,106,0.12)] text-[#e06a6a]',
        description: '差し戻しされています。内容を確認して再送信してください。',
      };
    default:
      return {
        badge: '未送信',
        badgeClass: 'bg-[rgba(255,255,255,0.08)] text-[#a9afbc]',
        description: '本日の確認と来店予定を18:30までに送信してください。',
      };
  }
}

function getWeeklyShiftStatusMeta(
  submissionStatus: 'pending' | 'approved' | 'rejected' | null
) {
  switch (submissionStatus) {
    case 'approved':
      return {
        badge: '承認済み',
        badgeClass: 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]',
        description: '翌週シフトは承認済みです。変更があれば変更申請へ進んでください。',
      };
    case 'pending':
      return {
        badge: '承認待ち',
        badgeClass: 'bg-[rgba(230,162,60,0.12)] text-[#e6a23c]',
        description: '提出済みです。店長承認までお待ちください。',
      };
    case 'rejected':
      return {
        badge: '差戻し',
        badgeClass: 'bg-[rgba(224,106,106,0.12)] text-[#e06a6a]',
        description: '差し戻しされています。内容を見直して再提出してください。',
      };
    default:
      return {
        badge: '未提出',
        badgeClass: 'bg-[rgba(255,255,255,0.08)] text-[#a9afbc]',
        description: '土曜23:55までに翌週シフトを提出してください。',
      };
  }
}

export default async function CastDashboardPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const supabase = await createClient();
  const today = getJstDateString();

  // 翌週月曜（シフト提出ステータス・対象期間表示用）
  const nextWeekBaseDate = new Date();
  nextWeekBaseDate.setDate(nextWeekBaseDate.getDate() + 7);
  const nextMondayDate = getTargetWeekMonday(nextWeekBaseDate);
  const nextMondayStr = formatDate(nextMondayDate);
  const nextSundayDate = new Date(nextMondayDate);
  nextSundayDate.setDate(nextMondayDate.getDate() + 6);

  // 今週月曜（スケジュール表示用）
  const thisWeekMondayDate = getTargetWeekMonday(new Date());
  const thisWeekMondayStr = formatDate(thisWeekMondayDate);

  const [
    { data: shiftSubmission },
    { data: schedules },
    notices,
    todayCheckin,
    todayReservations,
    { data: todayShift },
    { data: recentPosts },
    { data: lineConnectionInfo, error: lineConnectionError },
  ] = await Promise.all([
    getMyShiftSubmission(nextMondayStr),
    getMySchedulesForWeek(cast.id, thisWeekMondayStr),
    getCastNotices(cast.id),
    getCastTodayCheckin(),
    getCastTodayReservations(),
    supabase
      .from('cast_schedules')
      .select('*')
      .eq('cast_id', cast.id)
      .eq('work_date', today)
      .maybeSingle(),
    supabase
      .from('cast_posts')
      .select('id, content, status, created_at')
      .eq('cast_id', cast.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('cast_private_info')
      .select('line_user_id')
      .eq('cast_id', cast.id)
      .maybeSingle(),
  ]);

  const reservationCount = todayReservations?.length ?? 0;
  const hasBlogPost = Boolean(recentPosts && recentPosts.length > 0 && recentPosts[0]?.created_at?.startsWith(today));
  const todayStatusMeta = getTodayStatusMeta(todayCheckin?.approval_status ?? null);
  const weeklyShiftStatusMeta = getWeeklyShiftStatusMeta(shiftSubmission?.status ?? null);

  const statusChips = [
    todayStatusMeta.badge !== '承認済み' ? `本日の確認 ${todayStatusMeta.badge}` : null,
    !hasBlogPost ? 'ブログ 未投稿' : null,
    weeklyShiftStatusMeta.badge !== '承認済み' ? `シフト ${weeklyShiftStatusMeta.badge}` : null,
  ].filter(Boolean) as string[];

  const unreadNotices = notices.filter((notice) => !notice.is_read).slice(0, 3);
  // 今週7日分（月〜日）
  const summaryDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(thisWeekMondayDate);
    date.setDate(thisWeekMondayDate.getDate() + index);
    return date;
  });

  // work_date -> 'work' のマップ（レコードなし = 休み）
  const scheduleStatusMap = new Map(
    (schedules ?? []).map((schedule) => [
      schedule.work_date,
      'work' as const,
    ])
  );

  const isLineConnected = Boolean(lineConnectionInfo?.line_user_id);
  const lineConnectionStatus = lineConnectionError
    ? 'unavailable'
    : isLineConnected
      ? 'connected'
      : 'not_connected';
  const lineStatusLabel = lineConnectionStatus === 'connected'
    ? '連携済み'
    : lineConnectionStatus === 'unavailable'
      ? '通知不可'
      : '未連携';
  const lineStatusClass = lineConnectionStatus === 'connected'
    ? 'bg-[rgba(51,179,107,0.12)] text-[#33b36b]'
    : lineConnectionStatus === 'unavailable'
      ? 'bg-[rgba(224,106,106,0.12)] text-[#e06a6a]'
      : 'bg-[rgba(255,255,255,0.08)] text-[#a9afbc]';

  return (
    <CastMobileShell>
      <CastMobileHeader rightSlot={<CastMobileHeaderBell />} />

      <main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-[422px] flex-col gap-4 px-4 pb-28 pt-5">
        <section className="space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">
            <span>{new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}</span>
            <Link href="/cast/notices" className="relative flex h-6 w-6 items-center justify-center rounded-full text-[#8f96a3]">
              <Bell className="h-4 w-4" />
              {unreadNotices.length > 0 ? <span className="absolute right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-[#e06a6a]" /> : null}
            </Link>
          </div>
          <div>
            <h1 className="text-[22px] leading-[1.3] text-[#f7f4ed]">
              こんばんは、<span className="font-bold">{cast.stage_name || cast.name}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statusChips.map((chip) => (
              <span key={chip} className="rounded-full bg-[rgba(230,162,60,0.12)] px-2.5 py-1 text-[11px] font-bold text-[#e6a23c]">
                {chip}
              </span>
            ))}
          </div>
        </section>

        <Link href="/cast/today">
          <CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.18)]">
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Today&apos;s Priority</div>
                    <div className="text-[17px] font-bold text-[#f7f4ed]">本日の確認</div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${todayStatusMeta.badgeClass}`}>
                  {todayStatusMeta.badge}
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] text-[#a9afbc]">
                {todayStatusMeta.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-[#a9afbc]">
                  {todayShift ? `出勤 ${todayShift.start_time?.slice(0, 5)}〜` : '出勤 未設定'}
                </span>
                <span className="rounded-full border border-[rgba(51,179,107,0.2)] bg-[rgba(51,179,107,0.12)] px-3 py-1.5 text-xs text-[#33b36b]">
                  来店予定 {reservationCount}件{reservationCount > 0 ? ` (確定${reservationCount})` : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 border-t border-[rgba(201,167,106,0.25)] bg-[#c9a76a] px-6 py-4 text-[15px] font-bold text-[#0b0d12]">
              本日の確認をする
              <ChevronRight className="h-4 w-4" />
            </div>
          </CastMobileCard>
        </Link>

        <Link href="/cast/shift">
          <CastMobileCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <CalendarDays className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Weekly Shift</div>
                  <div className="text-base font-bold text-[#f7f4ed]">翌週シフト提出</div>
                </div>
                </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${weeklyShiftStatusMeta.badgeClass}`}>
                {weeklyShiftStatusMeta.badge}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">対象期間</div>
                <div className="font-bold text-[#f7f4ed]">
                  {nextMondayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  {' 〜 '}
                  {nextSundayDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                </div>
              </div>
              <div className="border-l border-white/8 pl-4">
                <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">締切</div>
                <div className="font-bold text-[#e6a23c]">土曜 23:55</div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-[1.7] text-[#a9afbc]">
              {weeklyShiftStatusMeta.description}
            </p>
            <div className="mt-5 rounded-xl border border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)] px-4 py-3 text-center text-sm font-bold text-[#c9a76a]">
              シフトを提出する
            </div>
          </CastMobileCard>
        </Link>

        <Link href="/cast/posts">
          <CastMobileCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <PenLine className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Daily Blog</div>
                  <div className="text-base font-bold text-[#f7f4ed]">今日のブログ</div>
                </div>
              </div>
              <span className="rounded-full bg-[rgba(230,162,60,0.12)] px-2.5 py-1 text-[11px] font-bold text-[#e6a23c]">
                {hasBlogPost ? '投稿済' : '未投稿'}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-[#a9afbc]">
                {hasBlogPost ? '本日の投稿があります。内容確認や追加投稿ができます。' : '本日のブログはまだ投稿されていません'}
              </p>
              <p className="text-xs text-[#6b7280]">
                前回: {recentPosts?.[0]?.content ? `${recentPosts[0].content.slice(0, 18)}...` : '未投稿'}
              </p>
            </div>
            <div className="mt-5 rounded-xl border border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)] px-4 py-3 text-center text-sm font-bold text-[#c9a76a]">
              ブログを書く
            </div>
          </CastMobileCard>
        </Link>

        <CastMobileCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Official LINE</div>
                <div className="text-base font-bold text-[#f7f4ed]">公式LINEを連携する</div>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${lineStatusClass}`}>
              {lineStatusLabel}
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-[1.7] text-[#a9afbc]">
            シフト提出リマインドや本日の確認など、個別通知を受け取るために公式LINEの友だち追加が必要です。
          </p>
          <div className="mt-5 rounded-xl border border-[rgba(201,167,106,0.3)] bg-[rgba(201,167,106,0.15)] px-4 py-3 text-center text-sm font-bold text-[#c9a76a]">
            公式LINEを追加する
          </div>
          <p className="mt-2 text-[11px] text-[#6b7280]">
            友だち追加後、公式LINEに表示された連携コードを送信してください。
          </p>
        </CastMobileCard>

        <Link href="/cast/schedule" aria-label="今週のスケジュール詳細を見る">
          <CastMobileCard className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f7f4ed]">
                <CalendarDays className="h-4 w-4 text-[#c9a76a]" />
                今週のスケジュール
              </div>
              <div className="flex items-center gap-1 text-xs text-[#8f96a3]">
                詳細
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {summaryDates.map((date) => {
                const dateKey = formatDate(date);
                const isToday = dateKey === today;
                const indicator = getWeeklySummaryLabel(scheduleStatusMap.has(dateKey) ? 'work' : 'off');

                return (
                  <div
                    key={dateKey}
                    className={`rounded-[10px] border px-1 py-2 text-center ${
                      isToday ? 'border-[rgba(201,167,106,0.4)] bg-[rgba(201,167,106,0.08)]' : 'border-transparent'
                    }`}
                  >
                    <div className={`text-[10px] ${isToday ? 'text-[#c9a76a]' : 'text-[#6b7280]'}`}>
                      {date.toLocaleDateString('ja-JP', { weekday: 'short' }).replace('曜', '')}
                    </div>
                    <div className={`mt-2 text-base font-bold leading-none ${indicator.color}`}>{indicator.text}</div>
                  </div>
                );
              })}
            </div>
            <span className="font-bold text-[#c9a76a]">
              {todayShift ? `本日 ${todayShift.start_time?.slice(0, 5) ?? '未定'}-${todayShift.end_time?.slice(0, 5) ?? '未定'}` : '本日 OFF'}
            </span>
          </CastMobileCard>
        </Link>

        <CastMobileCard className="overflow-hidden bg-[#181d27]">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
            <div className="text-sm font-bold text-[#f7f4ed]">お知らせ</div>
            <Link href="/cast/notices" className="flex items-center gap-1 text-xs text-[#8f96a3]">
              すべて見る
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div>
            {unreadNotices.length > 0 ? (
              unreadNotices.map((notice) => {
                const tone = getNoticeTone(notice.importance);
                return (
                  <Link
                    key={notice.id}
                    href="/cast/notices"
                    className="flex items-start gap-3 border-b border-white/8 px-5 py-4 last:border-b-0"
                  >
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${tone.iconWrap}`}>
                      <Bell className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] leading-5 ${tone.title}`}>{notice.title}</p>
                      <p className="mt-1 text-[11px] text-[#6b7280]">
                        {formatDistanceToNowStrict(new Date(notice.created_at), { addSuffix: true, locale: ja })}
                      </p>
                    </div>
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#c9a76a]" />
                  </Link>
                );
              })
            ) : (
              <div className="px-5 py-6 text-sm text-[#8f96a3]">新しいお知らせはありません。</div>
            )}
          </div>
        </CastMobileCard>

        <div className="hidden">
          <FileText />
        </div>
      </main>
    </CastMobileShell>
  );
}
