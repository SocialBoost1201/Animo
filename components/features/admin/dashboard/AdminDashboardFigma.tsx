'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Briefcase,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MessageSquarePlus,
  Plus,
  Search,
  StickyNote,
  Trophy,
  UserPlus,
  Users,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

import type {
  DashboardCastRanking,
  DashboardCastShift,
  DashboardKPIData,
  DashboardReservation,
  DashboardShiftCoverageData,
  DashboardTodayOpsData,
} from '@/lib/actions/dashboard';

type AdminDashboardFigmaProps = {
  dateLabel: string;
  kpis: DashboardKPIData;
  todayOps: DashboardTodayOpsData;
  castShifts: DashboardCastShift[];
  castRanking: DashboardCastRanking[];
  reservations: DashboardReservation[];
  shiftCoverage: DashboardShiftCoverageData;
};

const PAGE_WIDTH = 1440;
const PAGE_HEIGHT = 2151;
const SIDEBAR_WIDTH = 217;
const MAIN_WIDTH = 877;
const RIGHT_WIDTH = 263;
const MAIN_GAP = 44;
const CONTENT_WIDTH = MAIN_WIDTH + RIGHT_WIDTH + MAIN_GAP;

const shellStyle = {
  borderRadius: '18px',
  border: '1px solid #8A8478',
  background: '#000000',
};

function fillToCount<T>(items: T[], count: number): Array<T | null> {
  return [
    ...items.slice(0, count),
    ...Array.from({ length: Math.max(0, count - items.length) }, () => null),
  ];
}

function formatHour(time?: string) {
  if (!time) return '—';
  return time === 'Last' ? 'LAST' : time;
}

function getKpiCards(kpis: DashboardKPIData) {
  return [
    {
      label: '本日の出勤人数',
      value: kpis.todayShiftCount,
      sub: `確定 ${kpis.confirmedCount}名 / 未確定 ${kpis.unconfirmedCount}名`,
      badge: null as null | { label: string; kind: 'success' | 'warning' },
      icon: Users,
      iconTint: '#DFBD69',
    },
    {
      label: '来店予定件数',
      value: kpis.reservationCount,
      sub: `予定人数 ${kpis.totalGuests}名`,
      badge:
        kpis.reservationCount > kpis.yesterdayReservationCount
          ? { label: `昨日比 +${kpis.reservationCount - kpis.yesterdayReservationCount}`, kind: 'success' }
          : null,
      icon: Calendar,
      iconTint: '#DFBD69',
    },
    {
      label: '予定来店人数',
      value: kpis.totalGuests,
      sub:
        kpis.reservationCount > 0
          ? `平均 ${(kpis.totalGuests / kpis.reservationCount).toFixed(1)}名 / 組`
          : '平均 0.0名 / 組',
      badge: null,
      icon: Users,
      iconTint: '#DFBD69',
    },
    {
      label: 'シフト未提出',
      value: kpis.shiftMissingCount,
      sub: '今週の催促対象',
      badge: kpis.shiftMissingCount > 0 ? { label: '要催促', kind: 'warning' } : null,
      icon: AlertTriangle,
      iconTint: '#C8884D',
    },
    {
      label: '体入・応募',
      value: kpis.trialCount,
      sub: `返信待ち ${kpis.unreadApplications}件`,
      badge: kpis.unreadApplications > 0 ? { label: `新着 +${kpis.unreadApplications}`, kind: 'success' } : null,
      icon: UserPlus,
      iconTint: '#DFBD69',
    },
    {
      label: '営業警戒アラート',
      value: kpis.alertCount,
      sub: '要対応',
      badge: kpis.alertCount > 0 ? { label: '要確認', kind: 'warning' } : null,
      icon: Bell,
      iconTint: '#C8884D',
    },
  ];
}

function getAlertRows(kpis: DashboardKPIData) {
  return [
    {
      title: 'シフト未提出',
      description: `${kpis.shiftMissingCount}名が今週未提出`,
      color: '#D4785A',
      border: 'rgba(200, 100, 60, 0.15)',
      background: 'rgba(200, 100, 60, 0.08)',
      show: kpis.shiftMissingCount > 0,
    },
    {
      title: '来店予定未確定',
      description: `${kpis.unconfirmedCount}件の確認が必要`,
      color: '#C8884D',
      border: 'rgba(200, 130, 50, 0.12)',
      background: 'rgba(200, 130, 50, 0.08)',
      show: true,
    },
    {
      title: '人員不足リスク',
      description: `${shiftRiskText(kpis)}`,
      color: '#D4785A',
      border: 'rgba(200, 100, 60, 0.15)',
      background: 'rgba(200, 100, 60, 0.08)',
      show: true,
    },
    {
      title: '未返信案件',
      description: `応募返信待ち ${kpis.unreadApplications}件`,
      color: '#C8884D',
      border: 'rgba(200, 130, 50, 0.12)',
      background: 'rgba(200, 130, 50, 0.08)',
      show: true,
    },
    {
      title: 'ブログ未更新',
      description: '3名が1週間以上未更新',
      color: '#8A8478',
      border: 'rgba(138, 132, 120, 0.10)',
      background: 'rgba(138, 132, 120, 0.06)',
      show: true,
    },
  ].filter((row) => row.show);
}

function shiftRiskText(kpis: DashboardKPIData) {
  return kpis.shiftMissingCount > 0 ? '金・土の充足率が低い' : '今週の充足率は安定';
}

function getSalesMemoRows(todayOps: DashboardTodayOpsData) {
  return [
    {
      tag: 'VIP',
      tagColor: '#DFBD69',
      tagBg: 'rgba(223, 189, 105, 0.10)',
      text: todayOps.vipMemo ?? '田中様グループ 22:00来店。',
    },
    {
      tag: 'EVENT',
      tagColor: '#5A5650',
      tagBg: 'rgba(255, 255, 255, 0.04)',
      text: todayOps.eventMemo ?? '深夜チャージ 24:00〜。要確認。',
    },
    {
      tag: 'STAFF',
      tagColor: '#5A5650',
      tagBg: 'rgba(255, 255, 255, 0.04)',
      text: todayOps.urgentMemo ?? '伊藤れいな 遅刻あり。担当調整が必要。',
    },
  ];
}

function StatusPill({
  label,
  kind,
}: {
  label: string;
  kind: 'confirmed' | 'warning' | 'pending' | 'success';
}) {
  const palette = {
    confirmed: {
      color: '#72B894',
      bg: 'rgba(80, 160, 100, 0.10)',
      border: 'rgba(80, 160, 100, 0.18)',
    },
    success: {
      color: '#72B894',
      bg: 'rgba(80, 160, 100, 0.10)',
      border: 'rgba(80, 160, 100, 0.18)',
    },
    warning: {
      color: '#C8884D',
      bg: 'rgba(200, 130, 50, 0.10)',
      border: 'rgba(200, 130, 50, 0.18)',
    },
    pending: {
      color: '#8A8478',
      bg: 'rgba(138, 132, 120, 0.08)',
      border: 'rgba(138, 132, 120, 0.15)',
    },
  }[kind];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '75.998px',
        height: '19.097px',
        padding: '0 12px',
        borderRadius: '20px',
        background: palette.bg,
        border: `0.556px solid ${palette.border}`,
      }}
    >
      <span
        style={{
          color: palette.color,
          fontFamily: 'Inter, "Noto Sans JP", sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          lineHeight: '15px',
          letterSpacing: '0.117px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function HeaderStrip({ dateLabel }: { dateLabel: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('tab', 'casts');
    if (query.trim()) params.set('q', query.trim());
    router.push(`/admin/human-resources?${params.toString()}`);
  };

  return (
    <div
      style={{
        width: `${CONTENT_WIDTH}px`,
        height: '88px',
        background: '#121316',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '707px', height: '49px', marginLeft: '6px', display: 'flex', alignItems: 'center' }}>
          <div>
            <h1
              style={{
                margin: 0,
                color: '#9B783B',
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: '24.8px',
                letterSpacing: '1.69px',
              }}
            >
              DASHBOARD
            </h1>
            <p
              style={{
                margin: '7px 0 0',
                color: '#BC9D60',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '16.5px',
                letterSpacing: '0.064px',
              }}
            >
              本日の営業状況・要対応・主要指標をひと目で確認できます
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '23px' }}>
          <div
            style={{
              width: '204px',
              height: '37px',
              borderRadius: '10px',
              border: '1px solid #8A8478',
              background:
                'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '2px 2px 10px 0 rgba(151, 115, 27, 0.7)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '20px',
              gap: '8px',
            }}
          >
            <Calendar size={14} color="#C7C0B2" />
            <span
              style={{
                color: '#C7C0B2',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16.5px',
                letterSpacing: '3.06px',
              }}
            >
              {dateLabel.toUpperCase()}
            </span>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            style={{
              width: '208px',
              height: '37px',
              borderRadius: '10px',
              border: '1px solid #8A8478',
              background:
                'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '2px 2px 10px 0 rgba(151, 115, 27, 0.7)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '18.552px',
              gap: '5.708px',
            }}
          >
            <Search size={11} color="rgba(199,192,178,0.5)" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="ダッシュボード検索"
              placeholder="検索..."
              style={{
                width: '147.188px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: 0,
                color: '#C7C0B2',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16.8px',
                letterSpacing: '0px',
              }}
            />
          </form>

          <button
            type="button"
            onClick={() => router.refresh()}
            aria-label="ダッシュボードを更新"
            style={{
              width: '32px',
              height: '37px',
              borderRadius: '9px',
              border: '1px solid #8A8478',
              background:
                'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '2px 2px 10px 0 rgba(151, 115, 27, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={12} color="#C7C0B2" />
          </button>

          <Link
            href="/admin/internal-notices"
            aria-label="通知一覧を開く"
            style={{
              width: '32px',
              height: '37px',
              borderRadius: '9px',
              border: '1px solid #8A8478',
              background:
                'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '2px 2px 10px 0 rgba(151, 115, 27, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            <Bell size={13} color="#C7C0B2" />
            <span
              style={{
                position: 'absolute',
                top: '6.553px',
                right: '6.557px',
                width: '5.998px',
                height: '5.998px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #DFBD69 0%, #926F34 100%)',
              }}
            />
          </Link>

          <Link
            href="/admin/today"
            style={{
              width: '132px',
              height: '37px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #DFBD69 0%, #926F34 100%)',
              boxShadow: '2px 2px 10px 0 rgba(151, 115, 27, 0.7)',
              display: 'inline-flex',
              padding: '9.108px 13.038px 10.892px 20px',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              gap: '2.965px',
              color: '#0B0B0D',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: '"Noto Serif", "Noto Sans JP", serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16.8px',
              }}
            >
              来店予定を追加
            </span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiRow({ kpis }: { kpis: DashboardKPIData }) {
  const cards = getKpiCards(kpis);

  return (
    <div style={{ width: `${CONTENT_WIDTH}px`, display: 'flex', justifyContent: 'space-between' }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            style={{
              width: '180px',
              height: '151px',
              borderRadius: '18px',
              border: '1px solid #8A8478',
              background: 'rgba(0, 0, 0, 0.80)',
              boxShadow: '1px 1px 6px 1px rgba(182, 125, 18, 0.81)',
              padding: '20px 21px 0',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span
                style={{
                  color: '#8A8478',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  lineHeight: '15.4px',
                  letterSpacing: '0.064px',
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgba(200, 130, 50, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={13} color={card.iconTint} />
              </div>
            </div>
            <div
              style={{
                marginTop: '12px',
                color: '#F4F1EA',
                fontFamily: 'Inter, sans-serif',
                fontSize: '30px',
                fontWeight: 700,
                lineHeight: '30px',
                letterSpacing: '-0.205px',
                textAlign: 'center',
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                marginTop: '13px',
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '15.4px',
                letterSpacing: '0.064px',
                textAlign: 'center',
              }}
            >
              {card.sub}
            </div>
            {card.badge && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: '14px',
                  padding: '1.996px 6.996px',
                  borderRadius: '20px',
                  background:
                    card.badge.kind === 'success' ? 'rgba(80, 160, 100, 0.10)' : 'rgba(200, 100, 60, 0.10)',
                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                }}
              >
                <span
                  style={{
                    color: card.badge.kind === 'success' ? '#72B894' : '#D4785A',
                    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                    fontSize: '10px',
                    fontWeight: 600,
                    lineHeight: '12px',
                    letterSpacing: '0.117px',
                  }}
                >
                  {card.badge.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TodayPanel({ todayOps }: { todayOps: DashboardTodayOpsData }) {
  const rows = [
    ['営業日', todayOps.dateLabel],
    ['営業時間', `${todayOps.startTime} — ${todayOps.endTime}`],
    ['想定出勤数', `${todayOps.plannedCastCount}名`],
    ['確定出勤数', `${todayOps.confirmedCastCount}名`],
    ['予約件数', `${todayOps.reservationCount}件`],
    ['予定来店人数', `${todayOps.totalGuests}名`],
    ['体入人数', `${todayOps.trialCount}名（本日初回）`],
  ];

  const memos = [
    {
      tag: 'VIP',
      tagColor: '#DFBD69',
      tagBackground: 'rgba(223, 189, 105, 0.10)',
      background: 'rgba(41, 42, 47, 0.93)',
      border: 'rgba(223, 189, 105, 0.15)',
      text: todayOps.vipMemo ?? '田中様グループ（5名）22:00予定。テーブル4確保。専属対応：橋本あい',
    },
    {
      tag: 'EVENT',
      tagColor: '#8A8478',
      tagBackground: 'rgba(255, 255, 255, 0.04)',
      background: '#1C1D22',
      border: 'rgba(255, 255, 255, 0.06)',
      text: todayOps.eventMemo ?? '本日深夜24:00よりチャージイベント開始。全キャスト周知済み。',
    },
    {
      tag: '要対応',
      tagColor: '#C8884D',
      tagBackground: 'rgba(200, 130, 50, 0.10)',
      background: '#1C1D22',
      border: 'rgba(200, 130, 50, 0.15)',
      text: todayOps.urgentMemo ?? '伊藤れいな 21:00遅刻連絡。入り時間の調整が必要。',
    },
  ];

  return (
    <div
      style={{
        width: `${MAIN_WIDTH}px`,
        height: '366px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 1px #916908',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '75.849px',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '21.997px',
          paddingRight: '41.903px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div
            style={{
              width: '33px',
              height: '33px',
              borderRadius: '7px',
              background: 'rgba(223, 189, 105, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ClipboardList size={15} color="#DFBD69" />
          </div>
          <div>
            <div
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: '16.9px',
                letterSpacing: '-0.076px',
              }}
            >
              本日の営業状況
            </div>
            <div
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '14.3px',
                letterSpacing: '0.064px',
              }}
            >
              今夜のオペレーション概要
            </div>
          </div>
        </div>
        <div
          style={{
            width: '79.097px',
            height: '19.097px',
            borderRadius: '20px',
            background: 'rgba(80, 160, 100, 0.10)',
            border: '0.556px solid rgba(80, 160, 100, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#72B894' }} />
          <span
            style={{
              color: '#72B894',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '10px',
              fontWeight: 600,
              lineHeight: '12px',
              letterSpacing: '0.117px',
            }}
          >
            営業準備中
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '436px 438px', height: '290.151px', background: '#000000' }}>
        <div style={{ padding: '9px 14px 11px 22px' }}>
          <div
            style={{
              color: '#5A5650',
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              lineHeight: '13.5px',
              letterSpacing: '1.247px',
              marginBottom: '9px',
            }}
          >
            OVERVIEW
          </div>
          {rows.map(([label, value], index) => (
            <div
              key={label}
              style={{
                height: index === 2 || index === 5 ? '36px' : '35px',
                borderBottom: '0.556px solid #8A8478',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: '#8A8478',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '16.8px',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: label === '確定出勤数' ? '#CBC3B3' : '#CBC3B3',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '12px',
                  fontWeight: label === '確定出勤数' ? 600 : 500,
                  lineHeight: '16.8px',
                  textAlign: 'right',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '9px 23px 15px' }}>
          <div
            style={{
              color: '#5A5650',
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              lineHeight: '13.5px',
              letterSpacing: '1.247px',
              marginBottom: '12px',
            }}
          >
            MANAGEMENT MEMO
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '29px' }}>
            {memos.map((memo) => (
              <div
                key={memo.tag}
                style={{
                  width: '388px',
                  minHeight: memo.tag === 'VIP' ? '61px' : '60px',
                  borderRadius: '11px',
                  background: memo.background,
                  border: `0.556px solid ${memo.border}`,
                  padding: '10.556px 11.451px 13.55px 13.6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '5px',
                }}
              >
                <div
                  style={{
                    borderRadius: '3px',
                    background: memo.tagBackground,
                    padding: '1px 6px',
                  }}
                >
                  <span
                    style={{
                      color: memo.tagColor,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      fontWeight: 700,
                      lineHeight: '14.4px',
                      letterSpacing: '0.887px',
                    }}
                  >
                    {memo.tag}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: '#C7C0B2',
                    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '17.6px',
                    letterSpacing: '0.064px',
                  }}
                >
                  {memo.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard() {
  const actions = [
    { label: '来店予定を登録', href: '/admin/today', primary: true, icon: Plus },
    { label: '本日の出勤確認', href: '/admin/today', icon: Users },
    { label: '求人応募を確認', href: '/admin/applications', icon: Briefcase },
    { label: 'キャストを追加', href: '/admin/human-resources', icon: UserPlus },
    { label: 'お知らせを投稿', href: '/admin/internal-notices', icon: MessageSquarePlus },
  ];

  return (
    <div
      style={{
        width: `${RIGHT_WIDTH}px`,
        height: '361px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 0 rgba(190, 142, 23, 0.99)',
        display: 'inline-flex',
        padding: '16px 0 22.007px 19px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '13.993px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6.996px' }}>
        <Plus size={12} color="#8A8478" />
        <span
          style={{
            color: '#8A8478',
            fontFamily: 'Inter, "Noto Sans JP", sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            lineHeight: '14px',
            letterSpacing: '1.117px',
          }}
        >
          クイックアクション
        </span>
      </div>

      <div
        style={{
          height: '295px',
          padding: '12.007px 11.993px 0 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '25px',
          alignSelf: 'stretch',
        }}
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              style={{
                width: '234px',
                height: action.primary ? '33px' : action.label === '求人応募を確認' || action.label === 'お知らせを投稿' ? '34px' : '35px',
                borderRadius: '11px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: action.primary ? '11.996px' : '12.552px',
                paddingRight: '22.653px',
                background: action.primary
                  ? 'linear-gradient(90deg, #DFBD69 0%, #926F34 100%)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: action.primary ? 'none' : '0.556px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Icon size={12} color={action.primary ? '#0B0B0D' : '#8A8478'} />
              <span
                style={{
                  marginLeft: '9.99px',
                  color: action.primary ? '#0B0B0D' : '#C7C0B2',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '11px',
                  fontWeight: action.primary ? 600 : 400,
                  lineHeight: '15.4px',
                  letterSpacing: '0.064px',
                }}
              >
                {action.label}
              </span>
              <ChevronRight size={10} color={action.primary ? '#0B0B0D' : '#8A8478'} style={{ marginLeft: 'auto' }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CastListPanel({ castShifts }: { castShifts: DashboardCastShift[] }) {
  const confirmed = castShifts.filter((cast) => cast.status === 'confirmed').length;
  const pending = castShifts.filter((cast) => cast.status === 'pending').length;
  const trial = castShifts.filter((cast) => cast.status === 'trial').length;

  const normalizedRows = fillToCount(castShifts, 10);

  return (
    <div
      style={{
        width: `${MAIN_WIDTH}px`,
        height: '570px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 1px rgba(190, 150, 31, 0.79)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '58px',
          padding: '14.497px 0 14.918px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '0.556px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '23.993px',
              height: '23.993px',
              borderRadius: '7px',
              background: 'rgba(223, 189, 105, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={12} color="#DFBD69" />
          </div>
          <div>
            <div
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '15.6px',
              }}
            >
              本日の出勤キャスト
            </div>
            <div
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                lineHeight: '13px',
                letterSpacing: '0.117px',
              }}
            >
              確定 {confirmed}名 / 未確定 {pending}名 / 体験 {trial}名
            </div>
          </div>
        </div>
        <Link
          href="/admin/today"
          style={{
            marginRight: '18px',
            width: '109px',
            height: '31px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '0.556px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: '#8A8478',
            fontFamily: 'Inter, "Noto Sans JP", sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            lineHeight: '15.4px',
          }}
        >
          全員を確認
          <ChevronRight size={10} />
        </Link>
      </div>

      <div style={{ paddingTop: '13px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 188px 151px 222px',
            padding: '0 22px 10px',
            color: '#5A5650',
            fontFamily: 'Inter, "Noto Sans JP", sans-serif',
            fontSize: '9px',
            fontWeight: 700,
            lineHeight: '12.6px',
            letterSpacing: '0.707px',
          }}
        >
          <span>キャスト名</span>
          <span>出勤時間</span>
          <span>ステータス</span>
          <span>タグ</span>
        </div>

        {normalizedRows.map((cast, index) => {
          if (!cast) {
            return (
              <div
                key={`cast-placeholder-${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '280px 188px 151px 222px',
                  padding: '10px 22px 10.002px',
                  alignItems: 'center',
                  borderBottom: '0.556px solid #8A8478',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#141517',
                    }}
                  />
                  <span style={placeholderCellStyle}>—</span>
                </div>
                <span style={placeholderCellStyle}>—</span>
                <span style={placeholderCellStyle}>—</span>
                <span style={placeholderCellStyle}>—</span>
              </div>
            );
          }

          const statusKind =
            cast.status === 'confirmed'
              ? 'confirmed'
              : cast.status === 'pending'
              ? 'pending'
              : cast.status === 'trial'
              ? 'warning'
              : 'warning';
          const statusLabel =
            cast.status === 'confirmed'
              ? '確定'
              : cast.status === 'pending'
              ? '確認待ち'
              : cast.status === 'trial'
              ? '体験'
              : '遅刻予定';

          return (
            <div
              key={`${cast.castId}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '280px 188px 151px 222px',
                padding: '10px 22px 10.002px',
                alignItems: 'center',
                borderBottom: '0.556px solid #8A8478',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: index === 4 ? '#D0A84F' : '#23262F',
                    color: index === 4 ? '#0B0B0D' : '#8A8478',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {cast.initial}
                </div>
                <span
                  style={{
                    color: '#F4F1EA',
                    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '16.8px',
                  }}
                >
                  {cast.castName}
                </span>
              </div>

              <div
                style={{
                  color: '#8A8478',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '16.8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: '#5A5650' }}>◷</span>
                {formatHour(cast.startTime)}〜
              </div>

              <StatusPill label={statusLabel} kind={statusKind} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                {cast.tags.length === 0 ? (
                  <span
                    style={{
                      color: '#5A5650',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 400,
                      lineHeight: '16.5px',
                    }}
                  >
                    —
                  </span>
                ) : (
                  cast.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        borderRadius: '6px',
                        padding: '0 10px',
                        height: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          tag === 'ブログ更新済'
                            ? 'rgba(28, 63, 99, 0.55)'
                            : tag === '出勤安定'
                            ? 'rgba(80, 160, 100, 0.10)'
                            : tag === '初回体入'
                            ? 'rgba(223, 189, 105, 0.10)'
                            : 'rgba(200, 130, 50, 0.10)',
                        color:
                          tag === 'ブログ更新済'
                            ? '#86B3E3'
                            : tag === '出勤安定'
                            ? '#72B894'
                            : tag === '初回体入'
                            ? '#DFBD69'
                            : '#C8884D',
                        fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                        fontSize: '10px',
                        fontWeight: 500,
                        lineHeight: '14px',
                        letterSpacing: '0.117px',
                      }}
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShiftCoveragePanel({ shiftCoverage }: { shiftCoverage: DashboardShiftCoverageData }) {
  const barMaxHeight = 84;

  return (
    <div
      style={{
        width: `${RIGHT_WIDTH}px`,
        height: '570px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 0 rgba(190, 142, 23, 0.99)',
      }}
    >
      <div style={{ padding: '14.497px 0 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '23.993px',
              height: '23.993px',
              borderRadius: '7px',
              background: 'rgba(223, 189, 105, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayoutDashboard size={12} color="#DFBD69" />
          </div>
          <div>
            <div
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '15.6px',
              }}
            >
              シフト充足率
            </div>
            <div
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                lineHeight: '13px',
                letterSpacing: '0.117px',
              }}
            >
              今週の曜日別充足状況
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 15px 0', height: '438px' }}>
        <div style={{ height: '132px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '98px' }}>
            {shiftCoverage.weekly.map((day) => {
              const isDanger = day.rate <= 55;
              const isHighlight = day.label === '金' || day.label === '日' || day.label === '火' || day.label === '木';
              return (
                <div key={day.date} style={{ width: '29.557px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span
                    style={{
                      marginBottom: '6px',
                      color: isDanger ? '#D4785A' : isHighlight ? '#DFBD69' : '#C8A84D',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      fontWeight: 600,
                      lineHeight: '10.8px',
                      letterSpacing: '0.167px',
                    }}
                  >
                    {day.rate}
                  </span>
                  <div
                    style={{
                      width: '26px',
                      height: `${Math.max(20, (day.rate / 100) * barMaxHeight)}px`,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      borderBottomLeftRadius: '2px',
                      borderBottomRightRadius: '2px',
                      background: isDanger
                        ? 'rgba(200, 100, 60, 0.65)'
                        : isHighlight
                        ? 'rgba(223, 189, 105, 0.32)'
                        : 'rgba(200, 160, 60, 0.55)',
                      border:
                        day.label === '金' ? '0.556px solid rgba(223, 189, 105, 0.4)' : '0.556px solid rgba(0, 0, 0, 0)',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 2px' }}>
            {shiftCoverage.weekly.map((day) => (
              <span
                key={day.label}
                style={{
                  width: '26px',
                  textAlign: 'center',
                  color: day.label === '金' ? '#DFBD69' : '#8A8478',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '9px',
                  fontWeight: day.label === '金' ? 600 : 400,
                  lineHeight: '13.5px',
                  letterSpacing: '0.167px',
                }}
              >
                {day.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '27px', width: '226px', height: '30px', borderRadius: '9px', background: 'rgba(200, 100, 60, 0.06)', border: '0.556px solid rgba(200, 100, 60, 0.12)', display: 'flex', alignItems: 'center', padding: '0 9px' }}>
          <div style={{ width: '5.998px', height: '5.998px', borderRadius: '2px', background: '#D4785A', marginRight: '7px' }} />
          <span
            style={{
              color: '#D4785A',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              lineHeight: '14px',
              letterSpacing: '0.117px',
            }}
          >
            要注意（60%未満）
          </span>
          <span
            style={{
              marginLeft: 'auto',
              color: '#D4785A',
              background: 'rgba(200, 100, 60, 0.10)',
              borderRadius: '4px',
              padding: '1px 8px',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              lineHeight: '12.6px',
              letterSpacing: '0.167px',
            }}
          >
            {shiftCoverage.minDay}・土
          </span>
        </div>

        <div style={{ marginTop: '28px' }}>
          {[
            ['週平均充足率', `${shiftCoverage.avgRate}%`, '#C7C0B2'],
            ['最低充足日', `${shiftCoverage.minDay}曜 ${shiftCoverage.minRate}%`, '#D4785A'],
            ['最高充足日', `${shiftCoverage.maxDay}曜 ${shiftCoverage.maxRate}%`, '#72B894'],
          ].map(([label, value, color], index) => (
            <div
              key={label}
              style={{
                height: index === 2 ? '38.556px' : '37px',
                borderBottom: index === 2 ? 'none' : '0.556px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: '#8A8478',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '10px',
                  fontWeight: 400,
                  lineHeight: '14px',
                  letterSpacing: '0.117px',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color,
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  lineHeight: '14px',
                  letterSpacing: '0.117px',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '32px',
            width: '228px',
            height: '32px',
            borderRadius: '9px',
            background: '#A84A4A',
            border: '0.556px solid rgba(255, 37, 37, 0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10.556px',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              lineHeight: '15px',
              letterSpacing: '0.117px',
            }}
          >
            シフト未提出{' '}
            <span style={{ color: '#CEA759', fontWeight: 600 }}>{shiftCoverage.missingCount}名</span>
            {' '}— 今週中に催促が必要
          </span>
        </div>
      </div>
    </div>
  );
}

function CastPerformancePanel({ ranking }: { ranking: DashboardCastRanking[] }) {
  const rows = fillToCount(ranking, 10);

  return (
    <div
      style={{
        width: `${MAIN_WIDTH}px`,
        minHeight: '520px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 0 rgba(182, 140, 38, 0.99)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '58px',
          padding: '14.497px 0 14.918px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '0.556px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '23.993px',
              height: '23.993px',
              borderRadius: '7px',
              background: 'rgba(223, 189, 105, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trophy size={12} color="#DFBD69" />
          </div>
          <div>
            <div
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '15.6px',
              }}
            >
              キャスト行動成績評価
            </div>
            <div
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                lineHeight: '13px',
                letterSpacing: '0.117px',
              }}
            >
              ブログ投稿数・出勤日数・場内指名本数を管理参考用に可視化
            </div>
          </div>
        </div>
        <div
          style={{
            marginRight: '18px',
            height: '21.094px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: '0.556px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          <span
            style={{
              color: '#5A5650',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '10px',
              fontWeight: 500,
              lineHeight: '14px',
              letterSpacing: '0.117px',
            }}
          >
            今月集計
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 22px 18px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '356px 180px 85px 85px 85px',
            rowGap: '28px',
            columnGap: '14px',
          }}
        >
          <span style={tableHeaderCellStyle}>キャスト</span>
          <span style={tableHeaderCellStyle}>スコア</span>
          <span style={tableHeaderCellStyle}>BLG</span>
          <span style={tableHeaderCellStyle}>出勤</span>
          <span style={tableHeaderCellStyle}>指名</span>

          {rows.map((row, index) => {
            if (!row) {
              return (
                <div
                  key={`ranking-placeholder-${index}`}
                  style={{
                    display: 'contents',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '28px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#141517',
                        display: 'inline-block',
                      }}
                    />
                    <span style={placeholderCellStyle}>—</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '28px' }}>
                    <div style={{ width: '94px', height: '3px', background: '#141517', borderRadius: '999px' }} />
                    <span style={placeholderMetricCellStyle}>—</span>
                  </div>
                  <span style={placeholderMetricCellStyle}>—</span>
                  <span style={placeholderMetricCellStyle}>—</span>
                  <span style={placeholderMetricCellStyle}>—</span>
                </div>
              );
            }

            return (
              <div
                key={`ranking-${row.castId}-${index}`}
                style={{
                  display: 'contents',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '28px',
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: index < 3 ? 'rgba(223, 189, 105, 0.10)' : 'rgba(255,255,255,0.04)',
                      color: index < 3 ? '#DFBD69' : '#8A8478',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {row.rank}
                  </span>
                  <span
                    style={{
                      color: '#F4F1EA',
                      fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: '16.8px',
                    }}
                  >
                    {row.castName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '28px' }}>
                  <div style={{ width: '94px', height: '3px', background: '#1C1D22', borderRadius: '999px' }}>
                    <div
                      style={{
                        width: `${Math.min(94, row.score)}px`,
                        height: '3px',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, #DFBD69 0%, #926F34 100%)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      color: '#5A5650',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      lineHeight: '14px',
                    }}
                  >
                    {row.score}
                  </span>
                </div>
                <span style={metricCellStyle}>{row.blogCount}</span>
                <span style={metricCellStyle}>{row.shiftDays}</span>
                <span style={metricCellStyle}>{row.nominations}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const tableHeaderCellStyle = {
  color: '#5A5650',
  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
  fontSize: '9px',
  fontWeight: 700,
  lineHeight: '12.6px',
  letterSpacing: '0.707px',
} as const;

const metricCellStyle = {
  color: '#C7C0B2',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '14px',
} as const;

const placeholderCellStyle = {
  color: '#5A5650',
  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
  fontSize: '11px',
  fontWeight: 400,
  lineHeight: '16.5px',
  letterSpacing: '0.064px',
} as const;

const placeholderMetricCellStyle = {
  color: '#5A5650',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: 400,
  lineHeight: '14px',
} as const;

function ImportantAlertsCard({ kpis }: { kpis: DashboardKPIData }) {
  const alerts = getAlertRows(kpis);

  return (
    <div
      style={{
        width: `${RIGHT_WIDTH}px`,
        height: '497px',
        ...shellStyle,
        boxShadow: '2px 2px 20px 1px rgba(154, 127, 18, 0.92)',
        display: 'inline-flex',
        padding: '18.55px 0 193px 17px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10.457px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={12} color="#8A8478" />
        <span
          style={{
            color: '#8A8478',
            fontFamily: 'Inter, "Noto Sans JP", sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            lineHeight: '14px',
            letterSpacing: '1.117px',
          }}
        >
          重要アラート
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', paddingTop: '1px' }}>
        {alerts.map((alert) => (
          <div
            key={alert.title}
            style={{
              width: '237px',
              minHeight: alert.title === 'ブログ未更新' ? '47px' : '48px',
              borderRadius: '11px',
              background: alert.background,
              border: `0.556px solid ${alert.border}`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '11.554px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '21.997px',
                height: '21.997px',
                borderRadius: '6px',
                background: alert.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={11} color={alert.color} />
            </div>
            <div style={{ marginLeft: '8.992px' }}>
              <div
                style={{
                  color: alert.color,
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  lineHeight: '14.3px',
                  letterSpacing: '0.064px',
                }}
              >
                {alert.title}
              </div>
              <div
                style={{
                  color: '#8A8478',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '10px',
                  fontWeight: 400,
                  lineHeight: '13px',
                  letterSpacing: '0.117px',
                }}
              >
                {alert.description}
              </div>
            </div>
            <span
              style={{
                position: 'absolute',
                right: '18px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: alert.color,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationPanel({ reservations }: { reservations: DashboardReservation[] }) {
  const confirmed = reservations.filter((reservation) => reservation.status === 'confirmed').length;
  const warning = reservations.filter((reservation) => reservation.status === 'unconfirmed').length;
  const rows = fillToCount(reservations, 7);

  return (
    <div
      style={{
        width: `${MAIN_WIDTH}px`,
        height: '383px',
        ...shellStyle,
        boxShadow: '2px 2px 10px 1px rgba(182, 140, 38, 0.99)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '61.701px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15.9px 21px 0 23px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '26px',
              height: '29px',
              borderRadius: '7px',
              background: 'rgba(223, 189, 105, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={13} color="#DFBD69" />
          </div>
          <div>
            <div
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: '16.9px',
                letterSpacing: '-0.076px',
              }}
            >
              来店予定一覧
            </div>
            <div
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '14.3px',
                letterSpacing: '0.064px',
              }}
            >
              確認済 {confirmed}件 / 要確認 {warning}件
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '20px' }}>
          <div style={{ borderRadius: '8px', background: 'rgba(80, 160, 100, 0.08)', padding: '7px 12px' }}>
            <span
              style={{
                color: '#72B894',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: '15px',
                letterSpacing: '0.117px',
              }}
            >
              確認済 {confirmed}
            </span>
          </div>
          <div style={{ borderRadius: '8px', background: 'rgba(200, 130, 50, 0.08)', padding: '7px 12px' }}>
            <span
              style={{
                color: '#C8884D',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: '15px',
                letterSpacing: '0.117px',
              }}
            >
              要確認 {warning}
            </span>
          </div>
          <Link
            href="/admin/today"
            style={{
              width: '58px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '0.556px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              textDecoration: 'none',
              color: '#8A8478',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '15.4px',
            }}
          >
            追加
            <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #8A8478', borderBottom: '1px solid #8A8478', height: '40px', display: 'grid', gridTemplateColumns: '95px 1fr 80px 210px 120px 150px', alignItems: 'center', padding: '0 24px' }}>
        {['来店時刻', 'お客様名', '人数', '担当キャスト', '確認状態', '備考'].map((label) => (
          <span key={label} style={tableHeaderCellStyle}>
            {label}
          </span>
        ))}
      </div>

      {rows.map((row, index) => {
        if (!row) {
          return (
            <div
              key={`reservation-placeholder-${index}`}
              style={{
                height: '40px',
                display: 'grid',
                gridTemplateColumns: '95px 1fr 80px 210px 120px 150px',
                alignItems: 'center',
                padding: '0 24px',
                borderBottom: index === rows.length - 1 ? 'none' : '1px solid #8A8478',
              }}
            >
              <span style={placeholderCellStyle}>—</span>
              <span style={placeholderCellStyle}>—</span>
              <span style={placeholderCellStyle}>—</span>
              <span style={placeholderCellStyle}>—</span>
              <span style={placeholderCellStyle}>—</span>
              <span style={placeholderCellStyle}>—</span>
            </div>
          );
        }

        const kind = row.status === 'confirmed' ? 'confirmed' : row.status === 'unconfirmed' ? 'warning' : 'pending';
        const label = row.status === 'confirmed' ? '確認済' : row.status === 'unconfirmed' ? '未確定' : '保留';
        return (
          <div
            key={`${row.id}-${index}`}
            style={{
              height: index === rows.length - 1 ? '40px' : '40px',
              display: 'grid',
              gridTemplateColumns: '95px 1fr 80px 210px 120px 150px',
              alignItems: 'center',
              padding: '0 24px',
              borderBottom: '1px solid #8A8478',
            }}
          >
            <span
              style={{
                color: '#C7C0B2',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16.8px',
              }}
            >
              {row.visitTime}
            </span>
            <span
              style={{
                color: '#F4F1EA',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '16.8px',
              }}
            >
              {row.guestName} 様
            </span>
            <span
              style={{
                color: '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '15.4px',
              }}
            >
              {row.guestCount}名
            </span>
            <span
              style={{
                color: row.castName === '—' ? '#5A5650' : '#C7C0B2',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '15.4px',
              }}
            >
              {row.castName}
            </span>
            <StatusPill label={label} kind={kind} />
            <span
              style={{
                color: row.note?.includes('VIP') ? '#DFBD69' : '#8A8478',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                lineHeight: '14px',
                letterSpacing: '0.117px',
              }}
            >
              {row.note ?? '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SalesMemoCard({ todayOps }: { todayOps: DashboardTodayOpsData }) {
  const rows = getSalesMemoRows(todayOps);

  return (
    <div
      style={{
        width: `${RIGHT_WIDTH}px`,
        height: '382px',
        ...shellStyle,
        boxShadow: '2px 2px 20px 0 rgba(185, 135, 12, 0.99)',
      }}
    >
      <div style={{ padding: '18px 25px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StickyNote size={12} color="#8A8478" />
          <span
            style={{
              color: '#8A8478',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: '14px',
              letterSpacing: '1.117px',
            }}
          >
            営業メモ
          </span>
        </div>

        <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {rows.map((row) => (
            <div
              key={row.tag}
              style={{
                width: '239px',
                minHeight: row.tag === 'VIP' ? '52px' : row.tag === 'EVENT' ? '50px' : '51px',
                borderRadius: '10px',
                border: '0.556px solid rgba(223, 189, 105, 0.15)',
                background: '#1C1D22',
                padding: '9.549px 7.165px 11.554px',
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '3.993px',
              }}
            >
              <div
                style={{
                  borderRadius: '3px',
                  background: row.tagBg,
                  padding: '1px 6px',
                }}
              >
                <span
                  style={{
                    color: row.tagColor,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '8px',
                    fontWeight: 700,
                    lineHeight: '12.8px',
                    letterSpacing: '1.006px',
                  }}
                >
                  {row.tag}
                </span>
              </div>
              <span
                style={{
                  color: '#C7C0B2',
                  fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                  fontSize: '11px',
                  fontWeight: 400,
                  lineHeight: '16.5px',
                  letterSpacing: '0.064px',
                }}
              >
                {row.text}
              </span>
            </div>
          ))}

          <div
            style={{
              width: '239px',
              height: '52px',
              borderRadius: '10px',
              border: '0.556px solid rgba(223, 189, 105, 0.15)',
              background: '#1C1D22',
              padding: '16px 12px',
              color: 'rgba(199, 192, 178, 0.50)',
              fontFamily: 'Inter, "Noto Sans JP", sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: '16.5px',
              letterSpacing: '0.064px',
            }}
          >
            メモを追加...
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardFigma({
  dateLabel,
  kpis,
  todayOps,
  castShifts,
  castRanking,
  reservations,
  shiftCoverage,
}: AdminDashboardFigmaProps) {
  return (
    <div
      style={{
        minHeight: `${PAGE_HEIGHT}px`,
        width: `${PAGE_WIDTH - SIDEBAR_WIDTH}px`,
        paddingTop: '0px',
        paddingLeft: '20px',
        paddingRight: '19px',
        paddingBottom: '24px',
        background: '#121111',
      }}
    >
      <div style={{ width: `${CONTENT_WIDTH}px` }}>
        <HeaderStrip dateLabel={dateLabel} />

        <div style={{ height: '31px' }} />

        <KpiRow kpis={kpis} />

        <div style={{ height: '19px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: `${MAIN_WIDTH}px ${RIGHT_WIDTH}px`, columnGap: `${MAIN_GAP}px`, alignItems: 'start' }}>
          <TodayPanel todayOps={todayOps} />
          <QuickActionCard />
        </div>

        <div style={{ height: '19px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: `${MAIN_WIDTH}px ${RIGHT_WIDTH}px`, columnGap: `${MAIN_GAP}px`, alignItems: 'start' }}>
          <CastListPanel castShifts={castShifts} />
          <ShiftCoveragePanel shiftCoverage={shiftCoverage} />
        </div>

        <div style={{ height: '19px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: `${MAIN_WIDTH}px ${RIGHT_WIDTH}px`, columnGap: `${MAIN_GAP}px`, alignItems: 'start' }}>
          <CastPerformancePanel ranking={castRanking} />
          <ImportantAlertsCard kpis={kpis} />
        </div>

        <div style={{ height: '24px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: `${MAIN_WIDTH}px ${RIGHT_WIDTH}px`, columnGap: `${MAIN_GAP}px`, alignItems: 'start' }}>
          <ReservationPanel reservations={reservations} />
          <SalesMemoCard todayOps={todayOps} />
        </div>
      </div>
    </div>
  );
}
