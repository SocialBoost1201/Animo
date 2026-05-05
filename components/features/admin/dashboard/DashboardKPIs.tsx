import { getDashboardKPIs } from '@/lib/actions/dashboard';
import Link from 'next/link';
import { Users, Calendar, AlertTriangle, UserPlus, TrendingUp, ClipboardList } from 'lucide-react';

export async function DashboardKPIs() {
  const kpi = await getDashboardKPIs();
  const isWaitingForOperations = !kpi.hasOperationalRecords;

  const cards = [
    {
      id: 1,
      label: '出勤人数',
      value: kpi.todayShiftCount,
      unit: '名',
      sub: `確定 ${kpi.confirmedCount} / 未確定 ${kpi.unconfirmedCount}`,
      icon: Users,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/approvals?view=checkins',
      badge: null as null | { label: string; bg: string; textColor: string },
      topBar: true,
      alert: !isWaitingForOperations && kpi.unconfirmedCount > 0,
    },
    {
      id: 2,
      label: '来店予定',
      value: kpi.reservationCount,
      unit: '件',
      sub: `予定人数 ${kpi.totalGuests}名`,
      icon: Calendar,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/approvals?view=reservations',
      badge:
        !isWaitingForOperations && kpi.reservationCount > kpi.yesterdayReservationCount
          ? { label: `+${kpi.reservationCount - kpi.yesterdayReservationCount}`, bg: 'bg-[#50a0641a]', textColor: 'text-[#72b894]' }
          : !isWaitingForOperations && kpi.reservationCount < kpi.yesterdayReservationCount
            ? { label: `-${kpi.yesterdayReservationCount - kpi.reservationCount}`, bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
            : null,
      topBar: false,
      alert: false,
    },
    {
      id: 3,
      label: '来店人数',
      value: kpi.totalGuests,
      unit: '名',
      sub: kpi.reservationCount > 0 ? `平均 ${(kpi.totalGuests / kpi.reservationCount).toFixed(1)} / 組` : '—',
      icon: TrendingUp,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/approvals?view=reservations',
      badge: null,
      topBar: false,
      alert: false,
    },
    {
      id: 4,
      label: 'シフト未提出',
      value: kpi.shiftMissingCount,
      unit: '名',
      sub: '今週の催促対象',
      icon: ClipboardList,
      iconBg: kpi.shiftMissingCount > 0 ? 'bg-[#c882321f]' : 'bg-[#dfbd691a]',
      iconColor: kpi.shiftMissingCount > 0 ? 'text-[#c8884d]' : 'text-[#dfbd69]',
      href: '/admin/approvals?view=shifts',
      badge: kpi.shiftMissingCount > 0
        ? { label: '要催促', bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
        : null,
      topBar: false,
      alert: false,
    },
    {
      id: 5,
      label: '体入・応募',
      value: kpi.trialCount,
      unit: '件',
      sub: `本日体入+未読応募の合算 · 返信待ち ${kpi.unreadApplications}件`,
      icon: UserPlus,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/approvals?view=posts',
      badge: kpi.unreadApplications > 0
        ? { label: `+${kpi.unreadApplications}`, bg: 'bg-[#50a0641a]', textColor: 'text-[#72b894]' }
        : null,
      topBar: false,
      alert: false,
    },
    {
      id: 6,
      label: '警戒アラート',
      value: kpi.alertCount,
      unit: '件',
      sub: '要対応',
      icon: AlertTriangle,
      iconBg: kpi.alertCount > 0 ? 'bg-[#c882321f]' : 'bg-[#dfbd691a]',
      iconColor: kpi.alertCount > 0 ? 'text-[#c8884d]' : 'text-[#dfbd69]',
      href: '/admin/approvals?view=alerts',
      badge: kpi.alertCount > 0
        ? { label: '要確認', bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
        : null,
      topBar: false,
      alert: false,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 font-sans sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className="group relative flex min-h-28 min-w-0 flex-col rounded-[18px] card-premium-skin card-premium-skin--compact kpi-card-mobile md:min-h-[110px] xl:min-h-[120px]"
          >
            <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
              {/* Top Highlight Bar */}
              {card.topBar && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0 z-10" />
              )}

              <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center p-4 text-center">
                {/* Icon (top-right) */}
                <div className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-[5px] ${card.iconBg}`}>
                  <Icon size={12} className={card.iconColor} strokeWidth={2.5} />
                </div>

                {/* Label */}
                <span className="mb-1.5 pr-6 text-[12px] font-medium leading-snug tracking-[0.06px] text-[#8a8478] md:mb-2 md:pr-5 md:text-[11px]">
                  {card.label}
                </span>

                {/* Value */}
                <p className="mb-1 text-[28px] font-bold leading-none tracking-[-0.2px] md:mb-1.5 md:text-[30px]"
                  style={{ background: 'linear-gradient(90deg, #D1B25E 0%, #8F7130 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {isWaitingForOperations ? (
                    <span className="block text-[15px] leading-tight tracking-[0.02em]">運用開始待ち</span>
                  ) : (
                    card.value
                  )}
                </p>

                {/* Subtitle */}
                <p className="line-clamp-2 min-h-[2.4em] text-[12px] font-normal leading-tight tracking-[0.06px] text-[#8a8478] md:line-clamp-1 md:min-h-0 md:text-[11px]" title={card.sub}>
                  {isWaitingForOperations ? '—' : card.sub}
                </p>

                {/* Badge */}
                {card.badge && (
                  <div className={`inline-flex items-center px-[6px] py-px rounded-full mt-1 ${card.badge.bg}`}>
                    <span className={`text-[10px] font-bold tracking-[0.12px] whitespace-nowrap leading-none ${card.badge.textColor}`}>
                      {card.badge.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Critical Alert Bar */}
              {card.alert && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fb3a3a] shadow-[0_-1px_6px_rgba(251,58,58,0.3)]" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
