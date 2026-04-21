import Link from 'next/link';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { getTemplateShiftData } from '@/lib/actions/template-shifts';
import { TemplateShiftEditor } from '@/components/features/admin/monthly-shifts/TemplateShiftEditor';

export const dynamic = 'force-dynamic';

export default async function TemplateShiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year  = params.year  ? parseInt(params.year)  : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  const prevMonth = month === 1  ? 12 : month - 1;
  const prevYear  = month === 1  ? year - 1 : year;
  const nextMonth = month === 12 ? 1  : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;

  const data = await getTemplateShiftData(year, month);

  return (
    <div className="space-y-6 font-inter print:space-y-0 print:m-0 print:p-0">
      {/* ── Page Header（印刷時非表示）── */}
      <div className="print:hidden flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">シフト印刷表</h1>
          <p className="text-[11px] text-[#8a8478]">
            承認済みシフトを月別に確認・印刷・Excel出力できます
          </p>
        </div>

        {/* 月ナビゲーション */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1c1d22] rounded-[10px] border border-[#ffffff0f] px-1 py-1">
            <Link
              href={`/admin/template-shifts?year=${prevYear}&month=${prevMonth}`}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
            >
              <ChevronLeft size={13} />
              <span className="hidden sm:inline font-medium">先月</span>
            </Link>
            <div className="px-3 text-[12px] font-semibold text-[#c7c0b2] min-w-[80px] text-center">
              {year}年{month}月
            </div>
            <Link
              href={`/admin/template-shifts?year=${nextYear}&month=${nextMonth}`}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[7px] hover:bg-[#ffffff08] text-[11px]"
            >
              <span className="hidden sm:inline font-medium">翌月</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── データなし ── */}
      {data.casts.length === 0 && (
        <div className="print:hidden bg-[#17181c] rounded-[18px] border border-[#ffffff0f] py-14 text-center">
          <Printer size={24} className="mx-auto mb-3 text-[#5a5650]" />
          <p className="text-[12px] text-[#5a5650] italic">
            {year}年{month}月の承認済みシフトがありません
          </p>
          <p className="text-[11px] text-[#3a3830] mt-1">
            シフト管理ページでシフトを承認してから印刷表を使用してください
          </p>
          <Link
            href="/admin/shift-requests"
            className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-bold text-[#dfbd69] hover:underline"
          >
            シフト申請管理へ →
          </Link>
        </div>
      )}

      {/* ── エディタ（DB連携済みデータを渡す）── */}
      {data.casts.length > 0 && (
        <TemplateShiftEditor initialData={data} />
      )}
    </div>
  );
}
