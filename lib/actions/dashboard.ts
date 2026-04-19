'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { getJstDateString } from '@/lib/date-utils';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

export type DashboardKPIData = {
  todayShiftCount: number;
  confirmedCount: number;
  unconfirmedCount: number;
  reservationCount: number;
  totalGuests: number;
  yesterdayReservationCount: number;
  trialCount: number;
  unreadApplications: number;
  shiftMissingCount: number;
  alertCount: number;
};

export type DashboardTodayOpsData = {
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  plannedCastCount: number;
  confirmedCastCount: number;
  reservationCount: number;
  totalGuests: number;
  trialCount: number;
  vipMemo: string | null;
  eventMemo: string | null;
  urgentMemo: string | null;
};

export type DashboardReservation = {
  id: string;
  visitTime: string;
  guestName: string;
  guestCount: number;
  castName: string;
  status: 'confirmed' | 'unconfirmed' | 'pending';
  note: string | null;
  reservationType: string;
};

export type DashboardCastShift = {
  castId: string;
  castName: string;
  initial: string;
  startTime: string;
  endTime?: string;
  status: 'confirmed' | 'late' | 'trial' | 'pending';
  tags: string[];
  avatarUrl?: string;
};

export type DashboardCastRanking = {
  rank: number;
  castId: string;
  castName: string;
  score: number;
  blogCount: number;
  shiftDays: number;
  nominations: number;
};

export type WeeklyShiftCoverage = {
  label: string; // 月, 火, ...
  date: string;
  count: number;
  rate: number;
  isToday: boolean;
};

export type DashboardShiftCoverageData = {
  weekly: WeeklyShiftCoverage[];
  minDay: string;
  maxDay: string;
  minRate: number;
  maxRate: number;
  avgRate: number;
  missingCount: number;
  activeCastCount: number;
};

// ─────────────────────────────────────────────
// KPIs
// ─────────────────────────────────────────────
export async function getDashboardKPIs(): Promise<DashboardKPIData> {
  const supabase = createServiceClient();
  const today = getJstDateString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  const [
    { data: shiftsRaw },
    { data: checkinsRaw },
    { data: todayReservations },
    { data: yesterdayReservations },
    { data: trials },
    { count: unreadApps },
    { count: activeCasts },
    { count: pendingShifts },
  ] = await Promise.all([
    supabase.from('shift_submissions').select('cast_id, shifts_data').eq('status', 'approved'),
    supabase.from('daily_checkins').select('cast_id, is_absent').eq('checkin_date', today),
    supabase.from('daily_reservations').select('guest_count').eq('reservation_date', today),
    supabase.from('daily_reservations').select('id').eq('reservation_date', yesterdayStr),
    supabase.from('daily_trials').select('id').eq('trial_date', today),
    supabase.from('recruit_applications').select('id', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('casts').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('shift_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  // 本日の出勤キャスト数を抽出
  let todayShiftCount = 0;
  if (shiftsRaw) {
    for (const row of shiftsRaw) {
      const d = row.shifts_data as Record<string, { type: string }>;
      if (d[today]?.type === 'work') todayShiftCount++;
    }
  }

  // 確認済 / 未確認
  // 確認済 / 未確認 の論理的な再定義
  const checkedIds = new Set((checkinsRaw || []).map(c => c.cast_id));
  // 確定数: 本日シフトがあり、かつ出勤済み（欠勤以外）の人数
  const confirmedCount = (checkinsRaw || []).filter(c => !c.is_absent).length;
  // 未確認数: 本日シフトがある人のうち、まだチェックイン（出勤/欠勤回答）していない人数
  const unconfirmedCount = Math.max(0, todayShiftCount - checkedIds.size);

  // 予定来店人数
  const totalGuests = (todayReservations || []).reduce((s, r) => s + (r.guest_count ?? 1), 0);

  // シフト未提出（今週シフトがない活動キャスト数）

  const { data: weeklyShifts } = await supabase
    .from('shift_submissions')
    .select('cast_id')
    .eq('status', 'approved');

  const submittedCastIds = new Set((weeklyShifts || []).map(r => r.cast_id));
  const shiftMissingCount = Math.max(0, (activeCasts ?? 0) - submittedCastIds.size);

  // アラート数（未確認予約 + 遅刻 + シフト不足警告）
  const { count: unconfirmedReservations } = await supabase
    .from('daily_reservations')
    .select('id', { count: 'exact', head: true })
    .eq('reservation_date', today)
    .eq('reservation_type', 'reservation');

  const alertCount = unconfirmedCount + (unconfirmedReservations ?? 0) + (pendingShifts ?? 0 > 3 ? 1 : 0);

  return {
    todayShiftCount,
    confirmedCount,
    unconfirmedCount,
    reservationCount: (todayReservations || []).length,
    totalGuests,
    yesterdayReservationCount: (yesterdayReservations || []).length,
    trialCount: (trials || []).length + (unreadApps ?? 0),
    unreadApplications: unreadApps ?? 0,
    shiftMissingCount,
    alertCount,
  };
}

// ─────────────────────────────────────────────
// 本日の営業状況カード
// ─────────────────────────────────────────────
export async function getDashboardTodayOps(): Promise<DashboardTodayOpsData> {
  const supabase = createServiceClient();
  const today = getJstDateString();

  const d = new Date(today);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const dateLabel = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;

  const [
    { data: shiftsRaw },
    { data: reservations },
    { data: trials },
    { count: activeCasts },
    { data: noticeMemos },
  ] = await Promise.all([
    supabase.from('shift_submissions').select('cast_id, shifts_data').eq('status', 'approved'),
    supabase.from('daily_reservations').select('guest_count, reservation_type').eq('reservation_date', today),
    supabase.from('daily_trials').select('id').eq('trial_date', today),
    supabase.from('casts').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('daily_operation_memos').select('memo_type, content').eq('operation_date', today).limit(10),
  ]);

  let confirmedCastCount = 0;
  if (shiftsRaw) {
    for (const row of shiftsRaw) {
      const d = row.shifts_data as Record<string, { type: string }>;
      if (d[today]?.type === 'work') confirmedCastCount++;
    }
  }

  const totalGuests = (reservations || []).reduce((s, r) => s + (r.guest_count ?? 1), 0);

  const vipMemo = noticeMemos?.find(m => m.memo_type === 'vip')?.content ?? null;
  const eventMemo = noticeMemos?.find(m => m.memo_type === 'event')?.content ?? null;
  const urgentMemo = noticeMemos?.find(m => m.memo_type === 'urgent')?.content ?? null;

  return {
    date: today,
    dateLabel,
    startTime: '20:00',
    endTime: '25:00',
    plannedCastCount: activeCasts ?? 0,
    confirmedCastCount,
    reservationCount: (reservations || []).length,
    totalGuests,
    trialCount: (trials || []).length,
    vipMemo,
    eventMemo,
    urgentMemo,
  };
}

// ─────────────────────────────────────────────
// 来店予定一覧
// ─────────────────────────────────────────────
export async function getDashboardReservations(): Promise<DashboardReservation[]> {
  const supabase = createServiceClient();
  const today = getJstDateString();

  const { data: raw } = await supabase
    .from('daily_reservations')
    .select('id, cast_id, visit_time, guest_name, guest_count, reservation_type, note, casts(stage_name)')
    .eq('reservation_date', today)
    .order('visit_time');

  if (!raw) return [];

  return raw.map(r => {
    const cast = r.casts as unknown as { stage_name: string } | null;
    // reservation_type に応じて status を設定
    const status: DashboardReservation['status'] =
      r.reservation_type === 'douhan' ? 'confirmed' :
      r.reservation_type === 'reservation' ? 'unconfirmed' :
      'pending';

    return {
      id: r.id,
      visitTime: r.visit_time?.substring(0, 5) ?? '—',
      guestName: r.guest_name,
      guestCount: r.guest_count ?? 1,
      castName: cast?.stage_name ?? '—',
      status,
      note: r.note ?? null,
      reservationType: r.reservation_type,
    };
  });
}

// ─────────────────────────────────────────────
// 本日の出勤キャスト（Figmaデザイン版）
// ─────────────────────────────────────────────
export async function getDashboardCastShifts(): Promise<DashboardCastShift[]> {
  const supabase = createServiceClient();
  const today = getJstDateString();

  const [
    { data: shiftsRaw },
    { data: checkinsRaw },
    { data: trials },
    { data: postsRaw },
  ] = await Promise.all([
    supabase.from('shift_submissions').select('cast_id, shifts_data, casts(stage_name, profile_image_url)').eq('status', 'approved'),
    supabase.from('daily_checkins').select('cast_id, is_absent, has_change, change_note').eq('checkin_date', today),
    supabase.from('daily_trials').select('id, name, start_time').eq('trial_date', today),
    supabase
      .from('cast_posts')
      .select('cast_id, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'approved'),
  ]);

  const checkinMap = new Map((checkinsRaw || []).map(c => [c.cast_id, c]));
  const recentPostCastIds = new Set((postsRaw || []).map(p => p.cast_id));

  const results: DashboardCastShift[] = [];

  // 承認済シフトから本日出勤キャストを抽出
  if (shiftsRaw) {
    for (const row of shiftsRaw) {
      const d = row.shifts_data as Record<string, { type: string; start: string; end: string }>;
      if (d[today]?.type !== 'work') continue;

      // Supabaseの結合データからキャスト情報を取得
      const castRaw = row.casts as unknown as { stage_name: string; profile_image_url?: string } | null;
      const castName = castRaw?.stage_name ?? '不明';
      const avatarUrl = castRaw?.profile_image_url ?? undefined;
      
      const checkin = checkinMap.get(row.cast_id);
      const isAbsent = checkin?.is_absent ?? false;
      const hasChange = checkin?.has_change ?? false;

      if (isAbsent) continue;

      let status: DashboardCastShift['status'] = 'pending';
      if (checkin && !isAbsent) {
        status = hasChange ? 'late' : 'confirmed';
      }

      const tags: string[] = [];
      if (recentPostCastIds.has(row.cast_id)) tags.push('ブログ更新済');
      if (status === 'late') tags.push('確認必要');

      results.push({
        castId: row.cast_id,
        castName,
        initial: castName.charAt(0),
        startTime: d[today].start?.substring(0, 5) ?? '20:00',
        endTime: d[today].end?.substring(0, 5),
        status,
        tags,
        avatarUrl,
      });
    }
  }

  // 体験入店
  for (const trial of (trials || [])) {
    results.push({
      castId: `trial-${trial.id}`,
      castName: trial.name,
      initial: trial.name.charAt(0),
      startTime: trial.start_time?.substring(0, 5) ?? '20:00',
      status: 'trial',
      tags: ['初回体入'],
    });
  }

  results.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return results;
}

// ─────────────────────────────────────────────
// キャスト行動成績評価ランキング
// ─────────────────────────────────────────────
export async function getDashboardCastRanking(): Promise<DashboardCastRanking[]> {
  const supabase = createServiceClient();
  const today = getJstDateString();
  const targetMonth = today.substring(0, 7); // yyyy-MM

  const [
    { data: scores },
    { data: posts },
    { data: shiftsRaw },
  ] = await Promise.all([
    supabase
      .from('cast_scores')
      .select('cast_id, total_score, casts(stage_name)')
      .eq('target_month', targetMonth)
      .order('total_score', { ascending: false })
      .limit(10),
    supabase
      .from('cast_posts')
      .select('cast_id')
      .eq('status', 'approved')
      .gte('created_at', `${targetMonth}-01`)
      .lte('created_at', `${targetMonth}-31`),
    supabase.from('shift_submissions').select('cast_id, shifts_data').eq('status', 'approved'),
  ]);

  // ブログ数集計
  const blogCountMap = new Map<string, number>();
  for (const p of (posts || [])) {
    blogCountMap.set(p.cast_id, (blogCountMap.get(p.cast_id) ?? 0) + 1);
  }

  // 今月の出勤日数集計
  const shiftDaysMap = new Map<string, number>();
  const monthPrefix = targetMonth + '-';
  for (const row of (shiftsRaw || [])) {
    const d = row.shifts_data as Record<string, { type: string }>;
    const days = Object.keys(d).filter(k => k.startsWith(monthPrefix) && d[k]?.type === 'work').length;
    shiftDaysMap.set(row.cast_id, days);
  }

  return (scores || []).map((s, idx) => {
    const cast = s.casts as unknown as { stage_name: string } | null;
    return {
      rank: idx + 1,
      castId: s.cast_id,
      castName: cast?.stage_name ?? '不明',
      score: s.total_score ?? 0,
      blogCount: blogCountMap.get(s.cast_id) ?? 0,
      shiftDays: shiftDaysMap.get(s.cast_id) ?? 0,
      nominations: 0, // 指名データは別途実装
    };
  });
}

// ─────────────────────────────────────────────
// シフト充足率（今週）
// ─────────────────────────────────────────────
export async function getDashboardShiftCoverage(): Promise<DashboardShiftCoverageData> {
  const supabase = createServiceClient();
  const today = getJstDateString();
  const todayDate = new Date(today);

  const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(todayDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const [
    { data: shiftsRaw },
    { count: activeCasts },
  ] = await Promise.all([
    supabase.from('shift_submissions').select('cast_id, shifts_data').eq('status', 'approved'),
    supabase.from('casts').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  const totalCasts = activeCasts ?? 1;
  const weekDayLabels = ['月', '火', '水', '木', '金', '土', '日'];

  const weekly: WeeklyShiftCoverage[] = weekDays.map((day, idx) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    let count = 0;
    for (const row of (shiftsRaw || [])) {
      const d = row.shifts_data as Record<string, { type: string }>;
      if (d[dateStr]?.type === 'work') count++;
    }
    const rate = Math.round((count / totalCasts) * 100);
    return {
      label: weekDayLabels[idx],
      date: dateStr,
      count,
      rate,
      isToday: dateStr === today,
    };
  });

  const rates = weekly.map(w => w.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const avgRate = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
  const minDay = weekly[rates.indexOf(minRate)]?.label ?? '—';
  const maxDay = weekly[rates.indexOf(maxRate)]?.label ?? '—';

  const { count: pendingCount } = await supabase
    .from('shift_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  return {
    weekly,
    minDay,
    maxDay,
    minRate,
    maxRate,
    avgRate,
    missingCount: pendingCount ?? 0,
    activeCastCount: totalCasts,
  };
}

// ─────────────────────────────────────────────
// 日次営業メモ upsert
// ─────────────────────────────────────────────
export async function upsertDailyMemo(
  memoType: 'vip' | 'event' | 'urgent',
  content: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();
  const today = getJstDateString();

  const { error } = await supabase
    .from('daily_operation_memos')
    .upsert(
      { operation_date: today, memo_type: memoType, content: content.trim() },
      { onConflict: 'operation_date,memo_type' },
    );

  if (error) {
    console.error('upsertDailyMemo error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}


