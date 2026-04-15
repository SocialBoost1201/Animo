import { getDashboardKPIs } from '@/lib/actions/dashboard';
import Link from 'next/link';
import { Users, Calendar, AlertTriangle, UserPlus, TrendingUp, ClipboardList } from 'lucide-react';

export async function DashboardKPIs() {
  const kpi = await getDashboardKPIs();

  const cards = [
    {
      id: 1,
      label: '本日の出勤人数',
      value: kpi.todayShiftCount,
      unit: '名',
      sub: `確定 ${kpi.confirmedCount}名 / 未確定 ${kpi.unconfirmedCount}名`,
      icon: Users,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/today',
      badge: null as null | { label: string; bg: string; textColor: string },
      topBar: true,
      alert: kpi.unconfirmedCount > 0,
      width: 'xl:col-span-1',
    },
    {
      id: 2,
      label: '来店予定件数',
      value: kpi.reservationCount,
      unit: '件',
      sub: `予定人数 ${kpi.totalGuests}名`,
      icon: Calendar,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/today',
      badge:
        kpi.reservationCount > kpi.yesterdayReservationCount
          ? { label: `昨日比 +${kpi.reservationCount - kpi.yesterdayReservationCount}`, bg: 'bg-[#50a0641a]', textColor: 'text-[#72b894]' }
          : kpi.reservationCount < kpi.yesterdayReservationCount
          ? { label: `昨日比 -${kpi.yesterdayReservationCount - kpi.reservationCount}`, bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
          : null,
      topBar: false,
      alert: false,
      width: 'xl:col-span-1',
    },
    {
      id: 3,
      label: '予定来店人数',
      value: kpi.totalGuests,
      unit: '名',
      sub: kpi.reservationCount > 0 ? `平均 ${(kpi.totalGuests / kpi.reservationCount).toFixed(1)}名 / 組` : '予約なし',
      icon: TrendingUp,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/today',
      badge: null,
      topBar: false,
      alert: false,
      width: 'xl:col-span-1',
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
      href: '/admin/shift-requests',
      badge: kpi.shiftMissingCount > 0
        ? { label: '要催促', bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
        : null,
      topBar: false,
      alert: false,
      width: 'xl:col-span-1',
    },
    {
      id: 5,
      label: '体入・応募',
      value: kpi.trialCount,
      unit: '件',
      sub: `返信待ち ${kpi.unreadApplications}件`,
      icon: UserPlus,
      iconBg: 'bg-[#dfbd691a]',
      iconColor: 'text-[#dfbd69]',
      href: '/admin/applications',
      badge: kpi.unreadApplications > 0
        ? { label: `新着 +${kpi.unreadApplications}`, bg: 'bg-[#50a0641a]', textColor: 'text-[#72b894]' }
        : null,
      topBar: false,
      alert: false,
      width: 'xl:col-span-1',
    },
    {
      id: 6,
      label: '営業警戒アラート',
      value: kpi.alertCount,
      unit: '件',
      sub: '要対応',
      icon: AlertTriangle,
      iconBg: kpi.alertCount > 0 ? 'bg-[#c882321f]' : 'bg-[#dfbd691a]',
      iconColor: kpi.alertCount > 0 ? 'text-[#c8884d]' : 'text-[#dfbd69]',
      href: '/admin/today',
      badge: kpi.alertCount > 0
        ? { label: '要確認', bg: 'bg-[#c8643c1a]', textColor: 'text-[#d4785a]' }
        : null,
      topBar: false,
      alert: false,
      width: 'xl:col-span-1',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[13.8px] font-inter">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className={`group relative flex flex-col bg-[rgba(0,0,0,0.94)] rounded-[18px] overflow-hidden border-[1.5px] border-[#927624] hover:border-[#dfbd6940] transition-all duration-300 shadow-[4px_4px_10px_0_#A68A32] hover:shadow-[4px_4px_16px_0_#A68A32] h-[150px] min-w-0 ${card.width}`}
          >
            {/* Design Token: Top Highlight Bar (New Design: Card 1 has linear gold bar) */}
            {card.topBar && (
              <div className="mx-[18.6px] h-[1.5px] rounded-b-btn bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0" />
            )}

            <div className="p-[20.6px] flex flex-col flex-1 min-w-0">
              {/* Header: Label + Icon */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] text-[#8a8478] tracking-[0.06px] font-medium truncate pr-1">
                  {card.label}
                </span>
                <div className={`w-[26px] h-[26px] flex items-center justify-center rounded-[7px] shrink-0 transition-colors ${card.iconBg}`}>
                  <Icon size={13} className={card.iconColor} strokeWidth={2.5} />
                </div>
              </div>

              {/* Body: Value */}
              <div className="flex items-baseline gap-1 mb-2">
                <p className="text-[30px] font-bold text-[#f4f1ea] leading-none tracking-[-0.2px] group-hover:text-white transition-colors">
                  {card.value}
                </p>
                {/* unit is hidden in mockup value area, but we can keep it subtle or remove to match mockup 100% */}
              </div>

              {/* Footer: Subtitle / Status */}
              <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[1.4] line-clamp-1 mb-2 font-normal" title={card.sub}>
                {card.sub}
              </p>

              {/* Badge: Conditional */}
              <div className="h-4 flex items-center">
                {card.badge && (
                  <div className={`inline-flex items-center px-[7px] py-[2px] rounded-full ${card.badge.bg}`}>
                    <span className={`text-[10px] font-semibold tracking-[0.12px] whitespace-nowrap leading-none ${card.badge.textColor}`}>
                      {card.badge.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Critical Alert Bar (Design Token) */}
            {card.alert && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#fb3a3a] shadow-[0_-2px_10px_rgba(251,58,58,0.4)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
