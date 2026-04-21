import { getDashboardTodayOps } from '@/lib/actions/dashboard';
import { DashboardMemoCardClient } from './DashboardMemoCardClient';

export async function DashboardMemoCard() {
  const ops = await getDashboardTodayOps();

  return (
    <DashboardMemoCardClient
      vipMemo={ops.vipMemo}
      eventMemo={ops.eventMemo}
      urgentMemo={ops.urgentMemo}
    />
  );
}
