import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bell, PenLine, ChevronRight, ClipboardCheck, FileText, CalendarDays, MessageCircle } from 'lucide-react';
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
import { CastWeeklyScheduleCard } from '@/components/features/cast/dashboard/CastWeeklyScheduleCard';
import { getJstDateString } from '@/lib/date-utils';

const OFFICIAL_LINE_URL = 'https://line.me/R/ti/p/@794qphxb';

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
      .select('start_time, end_time')
      .eq('cast_id', cast.id)
      .eq('work_date', today)
      .maybeSingle(),
    supabase
      .from('cast_posts')
      .select('content, created_at')
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
  const hasBlogPost = Boolean(
    recentPosts?.[0]?.created_at &&
    getJstDateString(new Date(recentPosts[0].created_at)) === today
  );
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
  const workCount = scheduleStatusMap.size;
  const offCount = 7 - workCount;

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
      <CastMobileHeader rightSlot={<CastMobileHeaderBell hasUnread={unreadNotices.length > 0} />} />

      <main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-[422px] flex-col gap-4 px-4 pb-28 pt-5">
        <section className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">
            <span>{new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}</span>
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

        {/* ── Tier 1: 本日の確認 ────────────────────────────────────── */}
        <Link href="/cast/today">
          <CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.25)]">
            {/* HEADER + BODY */}
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
            {/* FOOTER — solid gold */}
            <div className="flex items-center justify-center gap-2 bg-[#c9a76a] px-6 py-4 text-[15px] font-bold text-[#0b0d12]">
              本日の確認をする
              <ChevronRight className="h-4 w-4" />
            </div>
          </CastMobileCard>
        </Link>

        {/* ── Tier 1: 翌週シフト提出 ───────────────────────────────── */}
        <Link href="/cast/shift">
          <CastMobileCard className="overflow-hidden border-t-2 border-t-[rgba(201,167,106,0.25)]">
            {/* HEADER + BODY */}
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Weekly Shift</div>
                    <div className="text-[17px] font-bold text-[#f7f4ed]">翌週シフト提出</div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${weeklyShiftStatusMeta.badgeClass}`}>
                  {weeklyShiftStatusMeta.badge}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
              <p className="text-[13px] leading-[1.7] text-[#a9afbc]">
                {weeklyShiftStatusMeta.description}
              </p>
            </div>
            {/* FOOTER — full-bleed outlined */}
            <div className="flex items-center justify-center gap-2 border-t border-[rgba(201,167,106,0.25)] py-3.5 text-[14px] font-bold text-[#c9a76a]">
              シフトを提出する
              <ChevronRight className="h-4 w-4" />
            </div>
          </CastMobileCard>
        </Link>

        {/* ── Tier 2: 今日のブログ ─────────────────────────────────── */}
        <Link href="/cast/posts">
          <CastMobileCard className="p-5">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                  <PenLine className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Daily Blog</div>
                  <div className="text-[15px] font-semibold text-[#f7f4ed]">今日のブログ</div>
                </div>
              </div>
              <span className="rounded-full bg-[rgba(230,162,60,0.12)] px-2.5 py-1 text-[11px] font-bold text-[#e6a23c]">
                {hasBlogPost ? '投稿済' : '未投稿'}
              </span>
            </div>
            {/* BODY */}
            <div className="mt-4 space-y-2">
              <p className="text-[13px] text-[#8f96a3]">
                {hasBlogPost ? '本日の投稿があります。内容確認や追加投稿ができます。' : '本日のブログはまだ投稿されていません'}
              </p>
              <p className="text-xs text-[#6b7280]">
                前回: {recentPosts?.[0]?.content ? `${recentPosts[0].content.slice(0, 18)}...` : '未投稿'}
              </p>
            </div>
            {/* FOOTER — ghost button */}
            <div className="mt-5 rounded-xl border border-white/12 bg-transparent px-4 py-2.5 text-center text-[13px] text-[#8f96a3]">
              ブログを書く
            </div>
          </CastMobileCard>
        </Link>

        {/* ── 公式LINE連携（Tier外・既存カード） ──────────────────── */}
        <CastMobileCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(201,167,106,0.15)] text-[#c9a76a]">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Official LINE</div>
                <div className="text-[15px] font-semibold text-[#f7f4ed]">公式LINEを連携する</div>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${lineStatusClass}`}>
              {lineStatusLabel}
            </span>
          </div>
          <p className="mt-4 text-[13px] text-[#8f96a3]">
            シフト提出リマインドや本日の確認など、個別通知を受け取るために公式LINEの友だち追加が必要です。
          </p>
          <Link
            href={OFFICIAL_LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-xl border border-white/12 bg-transparent px-4 py-2.5 text-center text-[13px] text-[#8f96a3]"
          >
            公式LINEを追加する
          </Link>
          <p className="mt-2 text-[11px] text-[#6b7280]">
            友だち追加後、登録済みの携帯番号を公式LINEに送信してください。
          </p>
        </CastMobileCard>

        {/* ── Tier 2: 今週のスケジュール ──────────────────────────── */}
        <CastWeeklyScheduleCard
          summaryDates={summaryDates}
          scheduleStatusMap={scheduleStatusMap}
          today={today}
          todayShift={todayShift}
          workCount={workCount}
          offCount={offCount}
        />

        {/* ── Tier 3: お知らせ（カードシェルなし・フラット） ───────── */}
        <div className="overflow-hidden rounded-[20px] bg-[#0d1018]">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="text-[12px] font-semibold text-[#6b7280]">お知らせ</div>
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
                    <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg ${tone.iconWrap}`}>
                      <Bell className="h-3 w-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] leading-5 text-[#8f96a3]">{notice.title}</p>
                      <p className="mt-1 text-[11px] text-[#6b7280]">
                        {formatDistanceToNowStrict(new Date(notice.created_at), { addSuffix: true, locale: ja })}
                      </p>
                    </div>
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#c9a76a]" />
                  </Link>
                );
              })
            ) : (
              <p className="px-5 py-3 text-[12px] text-[#6b7280]">新しいお知らせはありません。</p>
            )}
          </div>
        </div>

        <div className="hidden">
          <FileText />
        </div>
      </main>
    </CastMobileShell>
  );
}
