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
  let helpResponses: ShiftRequestResponse[]  = [];
  if (tab === 'help') {
    helpRequests  = await getShiftRequests();
    helpResponses = await getShiftRequestResponses(status === 'all' ? undefined : status);
  }

  const mainTabs = [
    { id: 'new', label: '新規提出', tone: 'from-[#f3d27a] to-[#a9782d]' },
    { id: 'change', label: '変更申請', tone: 'from-[#60a5fa] to-[#1d4ed8]', hasBadge: changeRequests?.some((r) => r.status === 'pending') },
    { id: 'help', label: '店舗からの募集', tone: 'from-[#c084fc] to-[#7c3aed]' },
  ];

  const subStatuses = [
    { label: '未承認', value: 'pending', active: 'bg-orange-500/18 text-orange-300 border-orange-400/30' },
    { label: '承認済', value: 'approved', active: 'bg-green-500/18 text-green-300 border-green-400/30' },
    { label: 'すべて', value: 'all', active: 'bg-white/10 text-[#d8d2c5] border-white/15' },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="rounded-[24px] border border-[#d6b56d33] bg-[radial-gradient(circle_at_top_left,rgba(214,181,109,0.16),transparent_34%),#08090c] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d6b56d]">Shift Control</span>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[#f4f1ea]">出勤調整＆承認</h1>
          <p className="max-w-2xl text-[12px] leading-6 text-[#8a8478]">
            週次提出・変更申請・店舗募集の承認状況を確認し、既存の承認フローへ接続します。
          </p>
        </div>
      </div>

      {/* ── Main Tabs ── */}
      <div className="rounded-[24px] border border-[#d6b56d26] bg-[#0b0d12] p-3">
        <div className="grid gap-2 md:grid-cols-3">
          {mainTabs.map((t) => (
            <Link
              key={t.id}
              href={`/admin/shift-requests?tab=${t.id}&status=${status}`}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-[20px] border px-5 py-3 text-[12px] font-bold transition-all whitespace-nowrap ${
                tab === t.id
                  ? `border-transparent bg-linear-to-r ${t.tone} text-[#08090c] shadow-[0_14px_34px_rgba(0,0,0,0.32)]`
                  : 'border-white/8 bg-white/[0.03] text-[#8a8478] hover:border-[#d6b56d33] hover:text-[#f4f1ea]'
              }`}
            >
              {t.label}
              {t.hasBadge && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              )}
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {subStatuses.map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/shift-requests?tab=${tab}&status=${opt.value}`}
              className={`rounded-[20px] border px-4 py-2 text-[11px] font-bold transition-all ${
                status === opt.value
                  ? opt.active
                  : 'border-white/8 bg-black/35 text-[#5a5650] hover:text-[#a9a294]'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
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
  );
}
