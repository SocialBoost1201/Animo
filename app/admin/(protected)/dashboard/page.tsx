import { AdminDashboardFigma } from '@/components/features/admin/dashboard/AdminDashboardFigma';
import {
  getDashboardCastRanking,
  getDashboardCastShifts,
  getDashboardKPIs,
  getDashboardReservations,
  getDashboardShiftCoverage,
  getDashboardTodayOps,
} from '@/lib/actions/dashboard';
import { getJstDateLabel } from '@/lib/date-utils';

export default async function DashboardPage() {
  const dateLabel = getJstDateLabel();
  const [kpis, todayOps, castShifts, castRanking, reservations, shiftCoverage] = await Promise.all([
    getDashboardKPIs(),
    getDashboardTodayOps(),
    getDashboardCastShifts(),
    getDashboardCastRanking(),
    getDashboardReservations(),
    getDashboardShiftCoverage(),
  ]);

  return (
    <AdminDashboardFigma
      dateLabel={dateLabel}
      kpis={kpis}
      todayOps={todayOps}
      castShifts={castShifts}
      castRanking={castRanking}
      reservations={reservations}
      shiftCoverage={shiftCoverage}
    />
  );
}
