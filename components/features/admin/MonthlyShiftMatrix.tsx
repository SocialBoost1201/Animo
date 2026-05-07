'use client';

import React, { useState } from 'react';
import { ShiftRecruitModal } from './ShiftRecruitModal';
import type { MonthlyShiftDetail } from '@/lib/actions/monthly-shifts';

type CastRow = {
  castId: string;
  stageName: string;
  shifts: Record<number, MonthlyShiftDetail>;
};

type Props = {
  year: number;
  month: number;
  castsData: CastRow[];
  days: number[];
};

export function MonthlyShiftMatrix({ year, month, castsData, days }: Props) {
  const [recruitDate, setRecruitDate] = useState<string | null>(null);

  const handleDayClick = (day: number) => {
    const d = new Date(year, month - 1, day);
    const dateStr = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    setRecruitDate(dateStr);
  };

  return (
    <>
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
                      onClick={() => handleDayClick(day)}
                      className={`px-2 py-3 text-center min-w-[34px] border-r border-[#ffffff06] cursor-pointer hover:bg-[#dfbd6914] transition-colors select-none ${
                        dow === 0 ? 'text-[#d4785a]' : dow === 6 ? 'text-[#6ab0d4]' : 'text-[#5a5650]'
                      }`}
                      title={`${month}/${day} 出勤募集`}
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

      {recruitDate && (
        <ShiftRecruitModal
          targetDate={recruitDate}
          onClose={() => setRecruitDate(null)}
        />
      )}
    </>
  );
}
