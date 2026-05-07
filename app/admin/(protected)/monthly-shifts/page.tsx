import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { ExcelExportButton } from '@/components/features/admin/monthly-shifts/ExcelExportButton';
import { MonthlyShiftMatrix } from '@/components/features/admin/MonthlyShiftMatrix';
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
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px]">日付をクリックして出勤募集をLINEグループに送信できます</p>
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
      <MonthlyShiftMatrix year={year} month={month} castsData={castsData} days={days} />
    </div>
  );
}
