import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { getStaffs } from '@/lib/actions/staffs';
import { ExcelExportButton } from '@/components/features/admin/monthly-shifts/ExcelExportButton';
import { MonthlyShiftMatrix } from '@/components/features/admin/MonthlyShiftMatrix';
import { ChevronLeft, ChevronRight, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function AdminMonthlyShiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; tab?: string }>;
}) {
  const resolvedParams = await searchParams;

  const now = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year) : now.getFullYear();
  let defaultMonth = now.getMonth() + 1;
  if (defaultMonth > 12) { defaultMonth -= 12; }
  const month = resolvedParams.month ? parseInt(resolvedParams.month) : defaultMonth;
  const activeTab = resolvedParams.tab === 'staff' ? 'staff' : 'cast';

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear  = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [castsData, staffs] = await Promise.all([
    getAdminMonthlyShifts(year, month),
    getStaffs(),
  ]);

  const tabBase = `?year=${year}&month=${month}`;

  return (
    <div className="space-y-6 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">シフト管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">
            {activeTab === 'cast'
              ? '日付をクリックして出勤募集をLINEグループに送信できます'
              : 'アクティブスタッフの役職・連絡先一覧'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 月ナビ（キャストタブのみ有効） */}
          {activeTab === 'cast' && (
            <div className="flex items-center gap-1 bg-[#1c1d22] rounded-[10px] border border-[#ffffff0f] px-1 py-1">
              <Link
                href={`/admin/monthly-shifts?year=${prevYear}&month=${prevMonth}&tab=cast`}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
              >
                <ChevronLeft size={13} />
                <span className="hidden sm:inline font-medium">先月</span>
              </Link>
              <div className="px-3 text-[12px] font-semibold text-[#c7c0b2] min-w-[80px] text-center">
                {year}年{month}月
              </div>
              <Link
                href={`/admin/monthly-shifts?year=${nextYear}&month=${nextMonth}&tab=cast`}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
              >
                <span className="hidden sm:inline font-medium">翌月</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          )}

          {/* Excel出力（キャストタブのみ） */}
          {activeTab === 'cast' && <ExcelExportButton year={year} month={month} />}
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex items-center gap-1 bg-[#1c1d22] rounded-[10px] border border-[#ffffff0f] p-1 w-fit">
        <Link
          href={`/admin/monthly-shifts${tabBase}&tab=cast`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
            activeTab === 'cast'
              ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-sm'
              : 'text-[#5a5650] hover:text-[#c7c0b2] hover:bg-[#ffffff08]'
          }`}
        >
          <Calendar size={13} />
          キャスト
          <span className={`text-[10px] font-bold ml-0.5 ${activeTab === 'cast' ? 'text-[#0b0b0d]/60' : 'text-[#3a3830]'}`}>
            {castsData.length}
          </span>
        </Link>
        <Link
          href={`/admin/monthly-shifts${tabBase}&tab=staff`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
            activeTab === 'staff'
              ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-sm'
              : 'text-[#5a5650] hover:text-[#c7c0b2] hover:bg-[#ffffff08]'
          }`}
        >
          <Users size={13} />
          スタッフ
          <span className={`text-[10px] font-bold ml-0.5 ${activeTab === 'staff' ? 'text-[#0b0b0d]/60' : 'text-[#3a3830]'}`}>
            {staffs.length}
          </span>
        </Link>
      </div>

      {/* ── キャストタブ ── */}
      {activeTab === 'cast' && (
        <MonthlyShiftMatrix year={year} month={month} castsData={castsData} days={days} />
      )}

      {/* ── スタッフタブ ── */}
      {activeTab === 'staff' && (
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
          {staffs.length === 0 ? (
            <div className="py-14 text-center">
              <Users size={24} className="mx-auto mb-3 text-[#5a5650]" />
              <p className="text-[12px] text-[#5a5650] italic">アクティブなスタッフがいません</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1c1d22] border-b border-[#ffffff08]">
                  <th className="px-5 py-3 text-left">
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">名前</span>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">表示名</span>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">役職</span>
                  </th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">連絡先</span>
                  </th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell">
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">LINE ID</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffffff06]">
                {staffs.map((staff) => (
                  <tr key={staff.id} className="hover:bg-[#ffffff04] transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-[13px] font-semibold text-[#c7c0b2]">{staff.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] text-[#8a8478]">{staff.display_name || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      {staff.role ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#dfbd6914] text-[#dfbd69] border border-[#dfbd6930]">
                          {staff.role}
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#3a3830]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-[12px] text-[#8a8478] font-mono">{staff.mobile_phone || '—'}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-[12px] text-[#8a8478]">{staff.line_id || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
