import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getCastMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { MonthlyShiftCalendar } from '@/components/features/cast/MonthlyShiftCalendar';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CastMonthlyShiftPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const resolvedParams = await searchParams;
  const now = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year) : now.getFullYear();
  
  // デフォルトは「翌月」のシフトを提出する画面にする
  let defaultMonth = now.getMonth() + 2; 
  let defaultYear = year;
  if (defaultMonth > 12) {
    defaultMonth -= 12;
    defaultYear += 1;
  }
  
  const month = resolvedParams.month ? parseInt(resolvedParams.month) : defaultMonth;

  // DBから既存のシフトを取得
  const initialShifts = await getCastMonthlyShifts(cast.id, year, month);

  // ページ切り替え用の計算
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return (
    <div className="px-4 sm:px-5 py-8 max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="font-serif text-xl sm:text-2xl tracking-widest text-[#171717]">Monthly Shift</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase font-serif">月間シフト提出</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <Link 
          href={`/cast/monthly-shift?year=${prevYear}&month=${prevMonth}`}
          className="p-2 sm:px-4 text-gray-400 hover:text-[#171717] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          <span className="text-xs font-bold hidden sm:inline">先月</span>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-serif font-bold text-gold tracking-widest">
            {year} <span className="text-sm font-sans mx-1">年</span> {month} <span className="text-sm font-sans ml-1">月</span>
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' })}</span>
        </div>
        <Link 
          href={`/cast/monthly-shift?year=${nextYear}&month=${nextMonth}`}
          className="p-2 sm:px-4 text-gray-400 hover:text-[#171717] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
        >
          <span className="text-xs font-bold hidden sm:inline">翌月</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Calendar UI */}
      <MonthlyShiftCalendar 
        year={year} 
        month={month} 
        castId={cast.id} 
        initialShifts={initialShifts} 
      />

    </div>
  );
}
