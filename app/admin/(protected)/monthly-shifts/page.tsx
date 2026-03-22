import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { ExcelExportButton } from '@/components/features/admin/monthly-shifts/ExcelExportButton';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
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
  let defaultYear = year;
  if (defaultMonth > 12) {
    defaultMonth -= 12;
    defaultYear += 1;
  }
  const month = resolvedParams.month ? parseInt(resolvedParams.month) : defaultMonth;

  // ページ切り替え用の計算
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // データ取得
  const castsData = await getAdminMonthlyShifts(year, month);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="text-gold" />
            月間シフト一覧
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            キャストから提出された出勤予定（○×△）をマトリクスで確認できます。右上のボタンから印刷用Excelをダウンロードしてください。
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <Link 
              href={`/admin/monthly-shifts?year=${prevYear}&month=${prevMonth}`}
              className="p-1 sm:px-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded transition flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span className="text-xs font-bold hidden sm:inline">先月</span>
            </Link>
            <div className="px-4 text-sm font-bold w-24 text-center">
              {year}年{month}月
            </div>
            <Link 
              href={`/admin/monthly-shifts?year=${nextYear}&month=${nextMonth}`}
              className="p-1 sm:px-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded transition flex items-center gap-1"
            >
              <span className="text-xs font-bold hidden sm:inline">翌月</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <ExcelExportButton year={year} month={month} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 p-3 min-w-[120px] font-bold z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  キャスト名
                </th>
                {days.map(day => {
                  const dayOfWeek = new Date(year, month - 1, day).getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  return (
                    <th key={day} className={`p-2 text-center min-w-[36px] font-bold border-r border-gray-100 ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {castsData.length === 0 ? (
                <tr>
                  <td colSpan={32} className="p-8 text-center text-gray-500">
                    表示するキャストデータがありません
                  </td>
                </tr>
              ) : (
                castsData.map(cast => (
                  <tr key={cast.castId} className="hover:bg-gray-50 transition-colors">
                    <td className="sticky left-0 bg-white p-3 font-bold text-gray-800 z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {cast.stageName}
                    </td>
                    {days.map(day => {
                      const detail = cast.shifts[day];
                      let content = <span className="text-gray-200">-</span>;
                      const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6;

                      if (detail) {
                        if (detail.status === 'unavailable') content = <span className="text-red-500 font-bold">×</span>;
                        else if (detail.status === 'maybe') content = <span className="text-yellow-500 font-bold">△</span>;
                        else if (detail.status === 'available') {
                          if (detail.isDouhan) content = <span className="text-pink-500 font-bold text-xs tracking-tighter">同伴</span>;
                          else if (detail.startTime) content = <span className="text-blue-600 font-bold text-xs tracking-tighter">{detail.startTime}</span>;
                          else content = <span className="text-blue-500 font-bold">○</span>;
                        }
                      }

                      return (
                        <td key={day} className={`p-2 text-center border-r border-gray-100 ${isWeekend ? 'bg-gray-50/50' : ''}`}>
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
