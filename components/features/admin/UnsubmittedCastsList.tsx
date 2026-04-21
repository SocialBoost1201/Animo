'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { D } from '@/lib/design/attendance-approval';

type CastStatus = {
  cast: { id: string; stage_name: string; auth_user_id: string | null };
  hasAuthIndex: boolean;
  status: string;
};

export function UnsubmittedCastsList({
  statuses,
  targetWeekMonday,
}: {
  statuses: CastStatus[];
  targetWeekMonday: string;
}) {
  const unsubmitted = statuses.filter(
    (s) => s.status === 'unsubmitted' || s.status === 'rejected'
  );
  const total = statuses.length;

  // Build week range string
  const start = new Date(targetWeekMonday);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
      d.getDate()
    ).padStart(2, '0')}`;
  const weekRange = `${fmt(start)}-${fmt(end)}`;

  return (
    <div
      className="overflow-hidden font-inter"
      style={{
        borderRadius: D.radius.panel,
        border: `1.5px solid ${D.border.lightGold}`,
        background: '#000',
        minWidth: '320px',
      }}
    >
      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-5">
        {/* Title row */}
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle
            size={20}
            style={{ color: D.border.lightGold, flexShrink: 0 }}
          />
          <span
            className="text-white"
            style={{
              fontFamily: D.font.mincho,
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            未提出キャスト一覧
          </span>
        </div>

        {/* Week info */}
        <div
          className="mb-1"
          style={{
            fontFamily: D.font.mincho,
            fontSize: '16px',
            color: '#fff',
          }}
        >
          対象週:{' '}
          <span style={{ color: D.border.lightGold }}>{weekRange}</span>
        </div>

        {/* Auto reminder note */}
        <div
          style={{
            fontFamily: D.font.mincho,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7,
          }}
        >
          毎週
          <span style={{ color: '#4ade80', fontWeight: 700 }}>木</span>・
          <span style={{ color: D.border.lightGold, fontWeight: 700 }}>金</span>
          曜日に自動で督促メールが送信されます
        </div>

        {/* Summary badge */}
        <div className="mt-6 flex justify-center">
          <div
            className="inline-flex flex-col items-center justify-center text-white font-bold text-center"
            style={{
              background: D.gradients.summaryRed,
              borderRadius: D.radius.summaryBadge,
              border: `1.5px solid ${D.border.lightGold}`,
              minWidth: '160px',
              padding: '18px 28px',
              lineHeight: 1.35,
              fontFamily: D.font.sans,
            }}
          >
            <span style={{ fontSize: '22px' }}>未提出 {unsubmitted.length} 名</span>
            <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.75 }}>
              全 {total} 名
            </span>
          </div>
        </div>
      </div>

      {/* ── Cast list ── */}
      <div style={{ borderTop: `1px solid ${D.border.gold}` }}>
        {unsubmitted.length === 0 ? (
          <div className="p-10 text-center text-white/40 text-sm">
            全員提出済みです
          </div>
        ) : (
          unsubmitted.map((s) => (
            <div
              key={s.cast.id}
              className="flex items-center justify-between px-6"
              style={{
                height: '48px',
                borderTop: `1px solid ${D.border.gold}`,
              }}
            >
              {/* Cast name */}
              <span
                className="text-white truncate"
                style={{
                  fontFamily: D.font.mincho,
                  fontSize: '20px',
                  fontWeight: 400,
                }}
              >
                {s.cast.stage_name}
              </span>

              {/* NO ACCOUNT chip */}
              {!s.hasAuthIndex && (
                <span
                  className="shrink-0 inline-flex items-center justify-center text-white text-[14px] font-medium tracking-wider"
                  style={{
                    background: 'linear-gradient(180deg, #1e1e1e 0%, #111 100%)',
                    borderRadius: D.radius.pill,
                    border: `1px solid ${D.border.lightGold}`,
                    padding: '7px 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  NO ACCOUNT
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
