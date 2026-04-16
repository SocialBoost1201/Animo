import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getCastTodayCheckin, getCastTodayReservations, getTodaySubmissionState } from '@/lib/actions/today';
import { createClient } from '@/lib/supabase/server';
import { CheckinForm } from '@/components/features/today/CheckinForm';
import { ReservationForm } from '@/components/features/today/ReservationForm';
import {
  CastMobileBackLink,
  CastMobileCard,
  CastMobileHeader,
  CastMobileShell,
  CastMobileSectionTitle,
} from '@/components/features/cast/CastMobileShell';
import { getJstDateString } from '@/lib/date-utils';

type CastDashboardReservationRow = {
  id: string;
  visit_time: string;
  guest_name: string;
  guest_count?: number | null;
  reservation_type: 'douhan' | 'reservation';
  note?: string | null;
  approval_status?: 'pending' | 'approved' | 'rejected';
};

export default async function CastTodayPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const supabase = await createClient();
  const today = getJstDateString();

  const [{ data: todayShift }, todayCheckin, todayReservations] = await Promise.all([
    supabase.from('cast_schedules').select('*').eq('cast_id', cast.id).eq('work_date', today).maybeSingle(),
    getCastTodayCheckin(),
    getCastTodayReservations(),
  ]);

  const submissionState = await getTodaySubmissionState();

  const allReservations = (todayReservations || []) as CastDashboardReservationRow[];

  // 同伴と通常来店予定を分離
  const douhanReservationRaw = allReservations.find(r => r.reservation_type === 'douhan') ?? null;
  const normalReservations = allReservations
    .filter(r => r.reservation_type === 'reservation')
    .map(r => ({
      id: r.id,
      visit_time: r.visit_time,
      guest_name: r.guest_name,
      guest_count: r.guest_count ?? null,
      reservation_type: r.reservation_type,
      note: r.note ?? undefined,
      approval_status: r.approval_status,
    }));

  const existingDouhan = douhanReservationRaw
    ? {
        id: douhanReservationRaw.id,
        visit_time: douhanReservationRaw.visit_time,
        guest_name: douhanReservationRaw.guest_name,
        guest_count: douhanReservationRaw.guest_count ?? null,
        note: douhanReservationRaw.note ?? null,
      }
    : null;

  return (
    <CastMobileShell>
      <CastMobileHeader />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-28 pt-5">
        <CastMobileBackLink href="/cast/dashboard" label="ホームへ戻る" />
        <CastMobileSectionTitle
          eyebrow={new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}
          title="本日の確認"
          description="出勤確認・同伴情報・来店予定をまとめて送信します。"
        />

        <CastMobileCard className="px-5 py-4">
          <div className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">Today&apos;s Schedule</div>
          <div className="mt-3 text-base font-bold text-[#f7f4ed]">
            {todayShift
              ? `${todayShift.start_time?.slice(0, 5) ?? '未定'} 〜 ${todayShift.end_time?.slice(0, 5) ?? '未定'}`
              : '本日の出勤予定はありません'}
          </div>
        </CastMobileCard>

        {/* ── 01: 出勤確認（同伴フォーム内包）── */}
        <div className="[&_input]:bg-[#10141d] [&_input]:text-[#f7f4ed] [&_select]:bg-[#10141d] [&_select]:text-[#f7f4ed] [&_textarea]:bg-[#10141d] [&_textarea]:text-[#f7f4ed]">
          <CheckinForm
            existing={todayCheckin}
            existingDouhan={existingDouhan}
            isSubmissionClosed={submissionState.isClosed}
            deadlineLabel={submissionState.deadlineLabel}
          />
        </div>

        {/* ── 02: 通常来店予定（任意・複数可）── */}
        <div className="[&_input]:bg-[#10141d] [&_input]:text-[#f7f4ed] [&_select]:bg-[#10141d] [&_select]:text-[#f7f4ed] [&_textarea]:bg-[#10141d] [&_textarea]:text-[#f7f4ed]">
          <ReservationForm
            reservations={normalReservations}
            isSubmissionClosed={submissionState.isClosed}
            deadlineLabel={submissionState.deadlineLabel}
          />
        </div>
      </main>
    </CastMobileShell>
  );
}
