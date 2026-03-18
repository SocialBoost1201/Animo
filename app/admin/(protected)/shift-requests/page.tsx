import React from 'react';
import { getShiftSubmissions, getAllCastShiftStatuses } from '@/lib/actions/admin-shifts';
import { getTargetWeekMonday } from '@/lib/shift-utils';
import { getAdminShiftChangeRequests } from '@/lib/actions/admin-change-requests';
import { ShiftRequestList } from '@/components/features/admin/ShiftRequestList';
import { UnsubmittedCastsList } from '@/components/features/admin/UnsubmittedCastsList';
import { ShiftChangeRequestList } from '@/components/features/admin/ShiftChangeRequestList';
import { HelpRequestList } from '@/components/features/admin/HelpRequestList';
import { getShiftRequests, getShiftRequestResponses } from '@/lib/actions/admin-shift-requests';
import Link from 'next/link';

export default async function ShiftRequestsPage({
  searchParams,
}: {
  searchParams: { status?: string, tab?: string };
}) {
  const status = searchParams.status || 'pending';
  const tab = searchParams.tab || 'new';

  const { data: submissions } = await getShiftSubmissions(status);
  const { data: changeRequests } = await getAdminShiftChangeRequests(status);

  // 来週の月曜日を設定し、全キャストの提出状況を取得
  const nextMondayDate = getTargetWeekMonday(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const nextMondayStr = new Date(nextMondayDate.getTime() - nextMondayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const { data: castStatuses } = await getAllCastShiftStatuses(nextMondayStr);

  // ヘルプ募集関連のデータ取得
  let helpRequests: any[] = [];
  let helpResponses: any[] = [];
  if (tab === 'help') {
    helpRequests = await getShiftRequests();
    helpResponses = await getShiftRequestResponses(status === 'all' ? undefined : status);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">シフト承認</h1>
          <p className="text-sm text-gray-500 mt-2">
            キャストから提出されたシフトの確認と承認を行います。
          </p>
        </div>
      </div>

      <div className="flex bg-white/50 border border-gray-100 p-1.5 rounded-xl w-fit">
        <Link 
          href={`/admin/shift-requests?tab=new&status=${status}`}
          className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
            tab === 'new' ? 'bg-[#171717] text-white shadow-md' : 'text-gray-500 hover:text-[#171717] hover:bg-white'
          }`}
        >
          新規提出 (1週間分)
        </Link>
        <Link 
          href={`/admin/shift-requests?tab=change&status=${status}`}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
            tab === 'change' ? 'bg-[#171717] text-white shadow-md' : 'text-gray-500 hover:text-[#171717] hover:bg-white'
          }`}
        >
          変更申請 (日次)
          {/* 未処理の変更申請がある場合にバッジを表示 */}
          {changeRequests && changeRequests.some(r => r.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </Link>
        <Link 
          href={`/admin/shift-requests?tab=help&status=${status}`}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
            tab === 'help' ? 'bg-[#171717] text-white shadow-md' : 'text-gray-500 hover:text-[#171717] hover:bg-white'
          }`}
        >
          店舗からの募集
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* 左側: リスト */}
        <div className="flex-1 w-full min-w-0">
          {tab === 'new' ? (
            <ShiftRequestList initialSubmissions={submissions || []} currentStatus={status} />
          ) : tab === 'change' ? (
            <div className="space-y-6">
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {[
                  { label: '未承認 (Pending)', value: 'pending' },
                  { label: '承認済 (Approved)', value: 'approved' },
                  { label: 'すべて (All)', value: 'all' },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/admin/shift-requests?tab=change&status=${opt.value}`}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                      status === opt.value
                        ? 'bg-white text-[#171717] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
              <ShiftChangeRequestList requests={changeRequests || []} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {[
                  { label: '未承認 (Pending)', value: 'pending' },
                  { label: '承認済 (Approved)', value: 'approved' },
                  { label: 'すべて (All)', value: 'all' },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/admin/shift-requests?tab=help&status=${opt.value}`}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                      status === opt.value
                        ? 'bg-white text-[#171717] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
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

        {/* 右側: 未提出キャスト一覧・リマインド */}
        <div className="w-full xl:w-[320px] shrink-0">
          <div className="sticky top-[80px]">
            <UnsubmittedCastsList statuses={castStatuses || []} targetWeekMonday={nextMondayStr} />
          </div>
        </div>
      </div>
    </div>
  );
}
