import React from 'react';
import { getShiftSubmissions, getAllCastShiftStatuses } from '@/lib/actions/admin-shifts';
import { getTargetWeekMonday } from '@/lib/shift-utils';
import { getAdminShiftChangeRequests, hasPendingShiftChangeRequests } from '@/lib/actions/admin-change-requests';
import { ShiftRequestList } from '@/components/features/admin/ShiftRequestList';
import { UnsubmittedCastsList } from '@/components/features/admin/UnsubmittedCastsList';
import { ShiftChangeRequestList } from '@/components/features/admin/ShiftChangeRequestList';
import Link from 'next/link';

export default async function ShiftRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tab?: string }>;
}) {
  const resolved = await searchParams;
  const status = resolved.status || 'pending';
  const tab    = resolved.tab === 'change' ? 'change' : 'new';

  const { data: submissions } =
    tab === 'new' ? await getShiftSubmissions(status) : { data: [] };
  const { data: changeRequests } =
    tab === 'change' ? await getAdminShiftChangeRequests(status) : { data: [] };
  const hasPendingChangeRequests = await hasPendingShiftChangeRequests();

  const now = new Date();
  const nextMondayDate = getTargetWeekMonday(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  const nextMondayStr  = new Date(nextMondayDate.getTime() - nextMondayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const { data: castStatuses } = await getAllCastShiftStatuses(nextMondayStr);

  const mainTabs: ReadonlyArray<{ id: 'new' | 'change'; label: string; hasBadge?: boolean }> = [
    { id: 'new', label: '新規提出' },
    { id: 'change', label: '変更申請', hasBadge: hasPendingChangeRequests },
  ];

  const subStatuses = [
    { label: '未承認', value: 'pending' },
    { label: '承認済', value: 'approved' },
    { label: 'すべて', value: 'all' },
  ] as const;

  return (
    <div className="space-y-6 font-inter">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-[22px] border border-[#dfbd69]/22 bg-linear-to-br from-[#181510] via-[#131313] to-[#101010] px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">出勤調整</h1>
          <p className="text-[11px] text-[#c7c0b2]">提出シフトと変更申請の反映管理を行います。</p>
        </div>
        <Link
          href="/admin/approvals"
          className="inline-flex items-center justify-center rounded-[10px] border border-[#dfbd6928] bg-[#dfbd6914] px-3 py-2 text-[11px] font-semibold text-[#dfbd69] hover:bg-[#dfbd691f] transition-colors"
        >
          承認ハブへ
        </Link>
      </div>

      <div className="rounded-[18px] border border-[#ffffff0f] bg-[#17181c] p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {mainTabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/admin/shift-requests?tab=${t.id}&status=${status}`}
                  className={`flex items-center justify-center gap-1.5 rounded-[12px] h-[44px] text-[12px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#dfbd6918] text-[#f4f1ea] border border-[#dfbd6940]'
                      : 'bg-[#1c1d22] text-[#8a8478] border border-[#ffffff10] hover:text-[#c7c0b2]'
                  }`}
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

        <div className="grid grid-cols-3 gap-2">
          {subStatuses.map((opt) => {
              const isActive = status === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={`/admin/shift-requests?tab=${tab}&status=${opt.value}`}
                  className={`flex items-center justify-center rounded-[12px] h-[40px] text-[11px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#ffffff14] text-[#f4f1ea] border border-[#ffffff1f]'
                      : 'bg-[#121317] text-[#8a8478] border border-[#ffffff08] hover:text-[#c7c0b2]'
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 w-full min-w-0">
          {tab === 'new' ? (
            <ShiftRequestList initialSubmissions={submissions || []} currentStatus={status} />
          ) : (
            <div className="space-y-4">
              <ShiftChangeRequestList requests={changeRequests || []} />
            </div>
          )}
        </div>

        <div className="w-full xl:w-[300px] shrink-0">
          <div className="sticky top-[80px]">
            <UnsubmittedCastsList statuses={castStatuses || []} targetWeekMonday={nextMondayStr} />
          </div>
        </div>
      </div>
    </div>
  );
}
