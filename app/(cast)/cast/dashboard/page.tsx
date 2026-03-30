import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentCast, getMyCastPosts, castLogout } from '@/lib/actions/cast-auth';
import { getMyShiftSubmission } from '@/lib/actions/cast-shifts';
import { getTargetWeekMonday } from '@/lib/shift-utils';
import { getMyConfirmedSchedules, getMyPendingChangeRequests } from '@/lib/actions/cast-change-requests';
import { getCastPVStats } from '@/lib/actions/posts-analytics';
import { getActiveShiftRequests, getMyShiftRequestResponses } from '@/lib/actions/cast-shift-requests';
import { getCastScoreAndLogs } from '@/lib/actions/scores';
import { createClient } from '@/lib/supabase/server';
import { getCastTodayCheckin, getCastTodayReservations } from '@/lib/actions/today';
import { PenLine, FileText, User, LogOut, CalendarDays, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { CastScheduleList } from '@/components/features/cast/CastScheduleList';
import { CastHelpRequestList } from '@/components/features/cast/CastHelpRequestList';
import { CastScoreWidget } from '@/components/features/cast/CastScoreWidget';
import { CastNoticeWidget } from '@/components/features/cast/CastNoticeWidget';
import { getCastNotices } from '@/lib/actions/cast-notices';
import { CheckinForm } from '@/components/features/today/CheckinForm';
import { ReservationForm } from '@/components/features/today/ReservationForm';
import { PageHeader, PageShell, SectionCard } from '@/components/ui/app-shell';

type TodayReservation = {
  id: string;
  visit_time: string;
  guest_name: string;
  reservation_type: string;
  note: string | null;
};

type RecentPost = {
  id: string;
  image_url: string | null;
  content: string | null;
  status: 'published' | 'pending' | 'draft' | string;
  created_at: string;
};

export default async function CastDashboardPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const supabase = await createClient();

  // 最新の投稿3件を取得
  const { data: recentPosts } = await supabase
    .from('cast_posts')
    .select('*')
    .eq('cast_id', cast.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // 本日の出勤
  const today = new Date().toISOString().split('T')[0];
  const { data: todayShift } = await supabase
    .from('cast_schedules')
    .select('*')
    .eq('cast_id', cast.id)
    .eq('work_date', today)
    .maybeSingle();

  // 直近の確定済みスケジュールと未承認の変更申請を取得
  const { data: schedules } = await getMyConfirmedSchedules(cast.id, 14);
  const { data: pendingRequests } = await getMyPendingChangeRequests(cast.id);

  // 次週のシフト提出状況
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const nextMondayDate = getTargetWeekMonday(oneWeekLater);
  const nextMondayStr = new Date(nextMondayDate.getTime() - nextMondayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const { data: shiftSubmission } = await getMyShiftSubmission(nextMondayStr);

  // PV統計情報
  const pvStats = await getCastPVStats(cast.id);

  // 期限判定（前週金曜の23:55）
  const deadlineDate = new Date(nextMondayDate);
  deadlineDate.setDate(deadlineDate.getDate() - 3); // 前週金曜
  deadlineDate.setHours(23, 55, 0, 0); // 23:55
  
  const now = new Date();
  const isPastDeadline = now > deadlineDate;
  // 木・金は期限間近アラート
  const isNearDeadline = !isPastDeadline && now.getDay() >= 4 && now < deadlineDate;

  // 出勤要請（ヘルプ）の取得
  const activeHelpRequests = await getActiveShiftRequests();
  const myHelpResponses = await getMyShiftRequestResponses();

  // スコアと履歴の取得
  const currentMonth = new Date().toISOString().substring(0, 7);
  const { score, logs } = await getCastScoreAndLogs(cast.id, currentMonth);

  // 全体お知らせ一覧の取得
  const notices = await getCastNotices(cast.id);

  // 本日の確認・来店予定
  const [todayCheckin, todayReservations] = await Promise.all([
    getCastTodayCheckin(),
    getCastTodayReservations(),
  ]);

  // reservationsを型に合わせて変換
  const reservationsForForm = ((todayReservations || []) as TodayReservation[]).map((r) => ({
    id: r.id,
    visit_time: r.visit_time,
    guest_name: r.guest_name,
    reservation_type: r.reservation_type,
    note: r.note,
  }));

  const menuItems = [
    { href: '/cast/shift', icon: CalendarDays, label: 'シフト提出', desc: '来週のシフトを提出', accent: true },
    { href: '/cast/post', icon: PenLine, label: '新規投稿', desc: '日記を投稿する', accent: false },
    { href: '/cast/posts', icon: FileText, label: '投稿一覧', desc: '過去の投稿を見る', accent: false },
    { href: '/cast/profile', icon: User, label: 'プロフィール', desc: '自分の情報を確認', accent: false },
  ];

  return (
    <PageShell width="narrow" className="space-y-8 px-5 py-8">
      <PageHeader
        eyebrow="Cast Dashboard"
        title={`${cast.stage_name || cast.name}さんの今日のタスク`}
        description="提出状況、本日の確認、来店予約、ブログ投稿までを迷わず進められるように整理したホーム画面です。"
        actions={
          <form action={castLogout} className="w-full md:w-auto">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-red-400 md:w-auto"
              title="ログアウト"
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </button>
          </form>
        }
      />

      {/* アクセス分析ランキング */}
      {pvStats.success && (
        <SectionCard tone="accent" className="relative overflow-hidden p-5 transition-all hover:scale-[1.01]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 text-gold mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs tracking-[0.2em] font-bold">ブログアクセス分析</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-serif font-bold tracking-wider">{pvStats.totalPV?.toLocaleString() || 0}</span>
                <span className="text-xs text-gray-300">PV</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block mb-1">店舗内ランキング</span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-serif font-bold text-gold">{pvStats.rank}</span>
                <span className="text-xs text-gray-300">位</span>
                <span className="text-xs text-gray-500 ml-1">/ {pvStats.totalCasts}人中</span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* 重要：未読お知らせウィジェット */}
      <CastNoticeWidget notices={notices} castId={cast.id} />

      {/* === 本日の確認 & 来店予定 === */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-serif">本日の入力</p>
        <CheckinForm existing={todayCheckin} />
        <ReservationForm reservations={reservationsForForm} />
      </div>

      {/* スコアウィジェット */}
      <CastScoreWidget score={score} logs={logs} targetMonth={currentMonth} />

      {/* 急募出勤リクエスト */}
      {activeHelpRequests.length > 0 && (
        <CastHelpRequestList 
          activeRequests={activeHelpRequests} 
          myResponses={myHelpResponses} 
        />
      )}

      {/* 本日の出勤 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <CalendarDays className="w-4 h-4 text-gold" />
          <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-serif">Today&apos;s Schedule</span>
        </div>
        {todayShift ? (
          <p className="text-sm text-[#171717] font-bold">
            {todayShift.start_time?.slice(0, 5)} 〜 {todayShift.end_time?.slice(0, 5)}
          </p>
        ) : (
          <p className="text-sm text-gray-400">本日の出勤予定はありません</p>
        )}
      </div>

      {/* 確定済みシフト・変更申請 */}
      <CastScheduleList 
        castId={cast.id} 
        schedules={schedules || []} 
        pendingRequests={pendingRequests || []} 
      />

      {/* 来週のシフト提出状況・アラート */}
      <Link href="/cast/shift" className="block relative overflow-hidden rounded-2xl border transition-all hover:scale-[0.98] shadow-sm">
        {shiftSubmission ? (
           shiftSubmission.status === 'approved' ? (
             <div className="bg-green-50/50 border-green-200 p-5">
               <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                 <div>
                   <p className="text-sm font-bold text-green-800">来週のシフト: 承認済み</p>
                   <p className="text-xs text-green-600 mt-1">公開シフト表に反映されています</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="bg-gray-50 border-gray-200 p-5">
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                 <div>
                   <p className="text-sm font-bold text-gray-700">来週のシフト: 承認待ち</p>
                   <p className="text-xs text-gray-500 mt-1">管理者の確認をお待ちください（再提出も可能です）</p>
                 </div>
               </div>
             </div>
           )
        ) : (
           isPastDeadline ? (
             <div className="bg-red-50 border-red-200 p-5 ring-2 ring-red-500/20">
               <div className="flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-red-700">【重要】シフト未提出（期限超過）</p>
                   <p className="text-xs text-red-600 font-bold mt-1">金曜23:55の期限を過ぎています。至急提出してください。</p>
                 </div>
               </div>
             </div>
           ) : isNearDeadline ? (
             <div className="bg-yellow-50 border-yellow-200 p-5">
               <div className="flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-yellow-800">シフト提出の期限が近づいています</p>
                   <p className="text-xs text-yellow-700 mt-1">期限は金曜日の 23:55 です。未提出の場合は罰金対象となります。</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="bg-white border-gray-100 p-5">
               <div className="flex items-center gap-3">
                 <CalendarDays className="w-5 h-5 text-gold" />
                 <div>
                   <p className="text-sm font-bold text-[#171717]">来週のシフトが未提出です</p>
                   <p className="text-xs text-gray-500 mt-1">タップしてシフトを入力してください</p>
                 </div>
               </div>
             </div>
           )
        )}
      </Link>

      {/* Menu */}
      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
              item.accent
                ? 'bg-[#171717] text-white border-transparent shadow-lg hover:bg-gold'
                : 'bg-white text-[#171717] border-gray-100 shadow-sm hover:border-gold/30'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.accent ? 'text-gold' : 'text-gold/60'}`} />
            <div>
              <div className={`text-sm font-bold tracking-widest ${item.accent ? '' : 'text-[#171717]'}`}>{item.label}</div>
              <div className={`text-xs mt-0.5 tracking-wider ${item.accent ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-serif mb-4">最近の投稿</h2>
        {recentPosts && recentPosts.length > 0 ? (
          <div className="space-y-3">
            {(recentPosts as RecentPost[]).map((post) => (
              <div key={post.id} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                  <Image src={post.image_url || '/images/placeholder.webp'} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">{post.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      post.status === 'published' ? 'bg-green-50 text-green-600' :
                      post.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {post.status === 'published' ? '公開中' : post.status === 'pending' ? '承認待ち' : '下書き'}
                    </span>
                    <span className="text-xs text-gray-300 font-mono">
                      {new Date(post.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">まだ投稿がありません</p>
        )}
      </div>
    </PageShell>
  );
}
