import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { ExcelExportButton } from '@/components/features/admin/monthly-shifts/ExcelExportButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminMonthlyShiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const resolvedParams = await searchParams;

  const now = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year) : now.getFullYear();
  let defaultMonth = now.getMonth() + 2;
  if (defaultMonth > 12) { defaultMonth -= 12; }
  const month = resolvedParams.month ? parseInt(resolvedParams.month) : defaultMonth;

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear  = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const castsData = await getAdminMonthlyShifts(year, month);

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">シフト管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">キャストから提出された月間シフトを確認・管理します</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1c1d22] rounded-[10px] border border-[#ffffff0f] px-1 py-1">
            <Link
              href={`/admin/monthly-shifts?year=${prevYear}&month=${prevMonth}`}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
            >
              <ChevronLeft size={13} />
              <span className="hidden sm:inline font-medium">先月</span>
            </Link>
            <div className="px-3 text-[12px] font-semibold text-[#c7c0b2] min-w-[80px] text-center">
              {year}年{month}月
            </div>
            <Link
              href={`/admin/monthly-shifts?year=${nextYear}&month=${nextMonth}`}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
            >
              <span className="hidden sm:inline font-medium">翌月</span>
              <ChevronRight size={13} />
            </Link>
          </div>
          <ExcelExportButton year={year} month={month} />
        </div>
      </div>

      {/* ── Shift Matrix ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#1c1d22] border-b border-[#ffffff08]">
                <th className="sticky left-0 bg-[#1c1d22] px-4 py-3 min-w-[120px] z-10 border-r border-[#ffffff08]">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">キャスト名</span>
                </th>
                {days.map((day) => {
                  const dow = new Date(year, month - 1, day).getDay();
                  return (
                    <th
                      key={day}
                      className={`px-2 py-3 text-center min-w-[34px] border-r border-[#ffffff06] ${
                        dow === 0 ? 'text-[#d4785a]' : dow === 6 ? 'text-[#6ab0d4]' : 'text-[#5a5650]'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{day}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff06]">
              {castsData.length === 0 ? (
                <tr>
                  <td colSpan={32} className="px-4 py-12 text-center text-[12px] text-[#5a5650] italic">
                    表示するシフトデータがありません
                  </td>
                </tr>
              ) : (
                castsData.map((cast) => (
                  <tr key={cast.castId} className="hover:bg-[#ffffff04] transition-colors">
                    <td className="sticky left-0 bg-[#17181c] px-4 py-2.5 z-10 border-r border-[#ffffff08]">
                      <span className="text-[12px] font-semibold text-[#c7c0b2]">{cast.stageName}</span>
                    </td>
                    {days.map((day) => {
                      const detail = cast.shifts[day];
                      const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6;
                      let content = <span className="text-[#ffffff14]">–</span>;

                      if (detail) {
                        if (detail.status === 'unavailable')
                          content = <span className="text-[#d4785a] font-bold text-[11px]">×</span>;
                        else if (detail.status === 'maybe')
                          content = <span className="text-[#dfbd69] font-bold text-[11px]">△</span>;
                        else if (detail.status === 'available') {
                          if (detail.isDouhan)
                            content = <span className="text-[#dfbd69] font-bold text-[9px] tracking-tighter">同伴</span>;
                          else if (detail.startTime)
                            content = <span className="text-[#c7c0b2] font-medium text-[10px]">{detail.startTime}</span>;
                          else
                            content = <span className="text-[#72b894] font-bold text-[11px]">○</span>;
                        }
                      }

                      return (
                        <td
                          key={day}
                          className={`px-2 py-2.5 text-center border-r border-[#ffffff05] ${isWeekend ? 'bg-[#ffffff02]' : ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
