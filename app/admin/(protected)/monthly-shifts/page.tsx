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
    <div className="space-y-[14px] font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 h-[49px]">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">シフト管理（月間）</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">キャストから提出された月間シフトを確認・管理します</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center h-[37px] bg-[#ffffff06] rounded-[10px] border border-[#8a8478] p-[3px]">
            <Link
              href={`/admin/monthly-shifts?year=${prevYear}&month=${prevMonth}`}
              className="flex items-center justify-center w-[60px] h-full text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px] font-bold"
            >
              <ChevronLeft size={12} className="mr-1" />
              先月
            </Link>
            <div className="px-3 text-[11px] font-bold text-[#f4f1ea] min-w-[86px] text-center tracking-tight">
              {year}年{month}月
            </div>
            <Link
              href={`/admin/monthly-shifts?year=${nextYear}&month=${nextMonth}`}
              className="flex items-center justify-center w-[60px] h-full text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px] font-bold"
            >
              次月
              <ChevronRight size={12} className="ml-1" />
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
              <tr className="border-b border-[#ffffff08] bg-[#ffffff02]">
                <th className="sticky left-0 z-10 px-5 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em] w-[140px] bg-[#17181c] border-r border-[#ffffff05]">
                  キャスト
                </th>
                {days.map((day) => {
                  const dow = new Date(year, month - 1, day).getDay();
                  return (
                    <th
                      key={day}
                      className={`px-1 py-3 text-center min-w-[34px] border-l border-[#ffffff05] ${
                        dow === 0 ? 'text-[#d4785a]' : dow === 6 ? 'text-[#6ab0d4]' : 'text-[#8a8478]'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{day}</span>
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
