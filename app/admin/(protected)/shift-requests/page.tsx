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
    { id: 'new',    label: '新規提出' },
    { id: 'change', label: '変更申請', hasBadge: changeRequests?.some((r) => r.status === 'pending') },
    { id: 'help',   label: '店舗からの募集' },
  ];

  const subStatuses = [
    { label: '未承認', value: 'pending' },
    { label: '承認済', value: 'approved' },
    { label: 'すべて', value: 'all' },
  ];

  return (
    <div className="space-y-[14px] font-inter">
      <div className="flex flex-col gap-0.5 h-[49px] justify-center">
        <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">出勤調整</h1>
        <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">シフト提出・変更申請・当日調整の管理</p>
      </div>

      {/* ── Main Tabs ── */}
      <div className="inline-flex items-center gap-1 bg-[#1c1d22] border border-[#ffffff0f] p-1 rounded-[12px]">
        {mainTabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/shift-requests?tab=${t.id}&status=${status}`}
            className={`flex items-center gap-2 px-5 py-2 text-[12px] font-semibold rounded-[9px] transition-all whitespace-nowrap ${
              tab === t.id
                ? 'text-[#0b0b0d] shadow-md'
                : 'text-[#8a8478] hover:text-[#c7c0b2]'
            }`}
            style={tab === t.id ? { background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' } : {}}
          >
            {t.label}
            {t.hasBadge && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4785a]" />
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_265px] gap-[14px] items-start">
        {/* Left: List */}
        <div className="flex-1 w-full min-w-0">
          {tab === 'new' ? (
            <ShiftRequestList initialSubmissions={submissions || []} currentStatus={status} />
          ) : tab === 'change' ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 bg-[#1c1d22] border border-[#ffffff0f] p-1 rounded-[10px]">
                {subStatuses.map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/admin/shift-requests?tab=change&status=${opt.value}`}
                    className={`px-4 py-1.5 text-[11px] font-semibold rounded-[8px] transition-all ${
                      status === opt.value
                        ? 'bg-[#ffffff12] text-[#f4f1ea]'
                        : 'text-[#5a5650] hover:text-[#8a8478]'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
              <ShiftChangeRequestList requests={changeRequests || []} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 bg-[#1c1d22] border border-[#ffffff0f] p-1 rounded-[10px]">
                {subStatuses.map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/admin/shift-requests?tab=help&status=${opt.value}`}
                    className={`px-4 py-1.5 text-[11px] font-semibold rounded-[8px] transition-all ${
                      status === opt.value
                        ? 'bg-[#ffffff12] text-[#f4f1ea]'
                        : 'text-[#5a5650] hover:text-[#8a8478]'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
              <HelpRequestList requests={helpRequests} responses={helpResponses} currentStatus={status} />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[14px] xl:sticky xl:top-6">
          <UnsubmittedCastsList statuses={castStatuses || []} targetWeekMonday={nextMondayStr} />
        </div>
      </div>
    </div>
  );
}
