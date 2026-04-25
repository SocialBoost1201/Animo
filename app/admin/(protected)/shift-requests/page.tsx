import React from 'react';
import { getShiftSubmissions, getAllCastShiftStatuses } from '@/lib/actions/admin-shifts';
import { getTargetWeekMonday } from '@/lib/shift-utils';
import { getAdminShiftChangeRequests } from '@/lib/actions/admin-change-requests';
import { ShiftRequestList } from '@/components/features/admin/ShiftRequestList';
import { UnsubmittedCastsList } from '@/components/features/admin/UnsubmittedCastsList';
import { ShiftChangeRequestList } from '@/components/features/admin/ShiftChangeRequestList';
import { HelpRequestList } from '@/components/features/admin/HelpRequestList';
import { getShiftRequests, getShiftRequestResponses, type ShiftRequest, type ShiftRequestResponse } from '@/lib/actions/admin-shift-requests';
import Link from 'next/link';

export default async function ShiftRequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; tab?: string };
}) {
  const status = searchParams.status || 'pending';
  const tab    = searchParams.tab    || 'new';

  const { data: submissions }    = await getShiftSubmissions(status);
  const { data: changeRequests } = await getAdminShiftChangeRequests(status);

  const now = new Date();
  const nextMondayDate = getTargetWeekMonday(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  const nextMondayStr  = new Date(nextMondayDate.getTime() - nextMondayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const { data: castStatuses } = await getAllCastShiftStatuses(nextMondayStr);

  let helpRequests: ShiftRequest[]           = [];
  let helpResponses: ShiftRequestResponse[]  = []
  if (tab === 'help') {
    helpRequests  = await getShiftRequests();
    helpResponses = await getShiftRequestResponses(status === 'all' ? undefined : status);
  }

  // ── Main tab config ────────────────────────────────────────────
  const mainTabs = [
    {
      id: 'new',
      label: '新規提出',
      activeGradient: 'linear-gradient(91deg, hsla(38,68%,31%,1) 0%, hsla(39,63%,61%,1) 45%, hsla(39,69%,31%,1) 100%)',
    },
    {
      id: 'change',
      label: '変更申請',
      hasBadge: changeRequests?.some((r) => r.status === 'pending'),
      activeGradient: 'linear-gradient(92deg, hsla(234,89%,35%,1) 0%, hsla(234,77%,39%,0.57) 25%, hsla(234,72%,20%,1) 55%, hsla(234,69%,36%,0.9) 80%, hsla(234,89%,14%,1) 100%)',
    },
    {
      id: 'help',
      label: '店舗からの募集',
      activeGradient: 'linear-gradient(92deg, hsla(276,55%,31%,1) 0%, hsla(276,62%,38%,1) 22%, hsla(276,61%,27%,1) 45%, hsla(276,65%,44%,1) 78%, hsla(276,62%,19%,1) 100%)',
    },
  ];

  // ── Sub-status config ──────────────────────────────────────────
  const subStatuses = [
    {
      label: '未承認',
      sub: 'PENDING',
      value: 'pending',
      activeGradient: 'linear-gradient(90deg, hsla(20,73%,32%,1) 0%, hsla(20,81%,48%,1) 25%, hsla(20,76%,32%,1) 55%, hsla(20,71%,49%,1) 78%, hsla(20,79%,32%,1) 100%)',
    },
    {
      label: '承認済',
      sub: 'APPROVED',
      value: 'approved',
      activeGradient: 'linear-gradient(92deg, hsla(118,62%,34%,1) 0%, hsla(119,60%,32%,1) 25%, hsla(121,48%,27%,1) 52%, hsla(126,66%,35%,1) 78%, hsla(127,62%,29%,1) 100%)',
    },
    {
      label: 'すべて',
      sub: 'ALL',
      value: 'all',
      activeGradient: 'linear-gradient(91deg, hsla(0,0%,21%,1) 0%, hsla(0,0%,34%,1) 25%, hsla(0,1%,38%,1) 50%, hsla(0,0%,25%,1) 75%, hsla(0,0%,21%,1) 100%)',
    },
  ];

  return (
    <div
      className="min-h-screen -m-6 md:-m-10 lg:-m-14 p-5 md:p-8 lg:p-12 font-inter"
      style={{ background: 'linear-gradient(180deg, #242424 0%, #171717 100%)' }}
    >
      <div className="space-y-4 max-w-[1920px] mx-auto">

        {/* ── Page Header: light card / black title ── */}
        <div
          className="rounded-[20px] px-6 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
          style={{ background: 'linear-gradient(160deg, #f5f3ef 0%, #e8e5df 100%)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8c78] mb-1.5">
            Shift Control
          </p>
          <h1
            className="font-bold leading-none tracking-[-0.02em] text-[#111]"
            style={{ fontSize: 'clamp(36px, 5vw, 52px)' }}
          >
            出勤調整・承認
          </h1>
          <p className="mt-2.5 text-[12px] text-[#6b6460] leading-relaxed">
            週次提出・変更申請・店舗募集の承認状況を確認し、既存の承認フローへ接続します。
          </p>
        </div>

        {/* ── Main Category Tabs ── */}
        <div
          className="rounded-[20px] bg-black"
          style={{ border: '1.5px solid hsla(35,68%,75%,1)', padding: '11px 14px' }}
        >
          <div className="grid grid-cols-3 gap-[14px]">
            {mainTabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/admin/shift-requests?tab=${t.id}&status=${status}`}
                  className="flex items-center justify-center gap-1.5 rounded-[20px] font-medium text-center transition-all duration-200 active:scale-[0.97]"
                  style={{
                    height: '70px',
                    fontSize: 'clamp(10px, 2.6vw, 17px)',
                    fontWeight: isActive ? 500 : 400,
                    background: isActive ? t.activeGradient : 'transparent',
                    border: isActive
                      ? '1.5px solid hsla(35,68%,75%,0.6)'
                      : '1.5px solid hsla(0,0%,100%,0.06)',
                    color: isActive ? '#fff' : 'hsla(0,0%,100%,0.3)',
                  }}
                >
                  <span className="truncate px-1">{t.label}</span>
                  {t.hasBadge && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: 'hsla(35,68%,75%,1)',
                        boxShadow: '0 0 6px hsla(35,68%,75%,0.7)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Sub-Status Tabs ── */}
        <div
          className="rounded-[20px] bg-black"
          style={{ border: '1.5px solid hsla(35,68%,75%,1)', padding: '11px 14px' }}
        >
          <div className="grid grid-cols-3 gap-[16px]">
            {subStatuses.map((opt) => {
              const isActive = status === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={`/admin/shift-requests?tab=${tab}&status=${opt.value}`}
                  className="flex flex-col items-center justify-center rounded-[20px] transition-all duration-200 active:scale-[0.97]"
                  style={{
                    height: '70px',
                    background: isActive ? opt.activeGradient : 'transparent',
                    border: isActive
                      ? '1.5px solid hsla(35,68%,75%,0.5)'
                      : '1.5px solid hsla(0,0%,100%,0.06)',
                    color: '#fff',
                  }}
                >
                  <span style={{ fontSize: 'clamp(10px, 2.6vw, 17px)', fontWeight: isActive ? 600 : 400, opacity: isActive ? 1 : 0.3 }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: 'clamp(8px, 1.8vw, 11px)', opacity: isActive ? 0.8 : 0.2, letterSpacing: '0.1em' }}>
                    {opt.sub}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="flex flex-col xl:flex-row gap-5 items-start">
          {/* Left: List */}
          <div className="flex-1 w-full min-w-0">
            {tab === 'new' ? (
              <ShiftRequestList initialSubmissions={submissions || []} currentStatus={status} />
            ) : tab === 'change' ? (
              <div className="space-y-4">
                <ShiftChangeRequestList requests={changeRequests || []} />
              </div>
            ) : (
              <div className="space-y-4">
                <HelpRequestList requests={helpRequests} responses={helpResponses} currentStatus={status} />
              </div>
            )}
          </div>

          {/* Right: Unsubmitted */}
          <div className="w-full xl:w-[300px] shrink-0">
            <div className="sticky top-[80px]">
              <UnsubmittedCastsList statuses={castStatuses || []} targetWeekMonday={nextMondayStr} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
