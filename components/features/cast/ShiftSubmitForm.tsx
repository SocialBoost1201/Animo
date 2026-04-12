'use client';

import React, { useState, useEffect } from 'react';
import { getTargetWeekMonday, formatDate, getWeekDates } from '@/lib/shift-utils';
import { getMyShiftSubmission, submitMyShift, WeeklyShiftSubmission, ShiftType } from '@/lib/actions/cast-shifts';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  CastMobileBackLink,
  CastMobileHeader,
  CastMobileShell,
} from '@/components/features/cast/CastMobileShell';

function getInitialTargetMonday() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMondayDate = getTargetWeekMonday(nextWeek);
  return formatDate(nextMondayDate);
}

export default function ShiftSubmitPage({ castId }: { castId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetMonday] = useState<string>(getInitialTargetMonday);
  const [shifts, setShifts] = useState<WeeklyShiftSubmission>({});

  useEffect(() => {
    const loadShifts = async () => {
      setIsLoading(true);
      const days = getWeekDates(targetMonday);
      const initialShifts: WeeklyShiftSubmission = {};
      
      // デフォルト値のセット（休み）
      days.forEach(d => {
        const dateStr = formatDate(d);
        initialShifts[dateStr] = { type: 'off', start: '21:00', end: 'LAST' };
      });

      // 既存の提出データを取得
      const res = await getMyShiftSubmission(targetMonday);
      if (res.data) {
        const submitted = res.data.shifts_data as WeeklyShiftSubmission;
        // マージ
        Object.keys(initialShifts).forEach(dateStr => {
           if (submitted[dateStr]) {
               initialShifts[dateStr] = {
                   ...initialShifts[dateStr],
                   ...submitted[dateStr]
               };
           }
        });
        toast.info(res.data.status === 'approved' ? '承認済みのシフトです' : '提出済みのシフト内容です');
      }

      setShifts(initialShifts);
      setIsLoading(false);
    };

    loadShifts();
  }, [targetMonday]);

  const handleTypeChange = (dateStr: string, type: ShiftType) => {
      setShifts(prev => ({
          ...prev,
          [dateStr]: { ...prev[dateStr], type }
      }));
  };

  const handleSubmit = async () => {
      if (!castId) return;
      setIsSubmitting(true);
      const res = await submitMyShift(castId, targetMonday, shifts);
      if (res.success) {
          toast.success('シフトを提出しました');
          router.push('/cast/dashboard');
          router.refresh();
      } else {
          toast.error(res.error || 'シフトの提出に失敗しました');
      }
      setIsSubmitting(false);
  };

  if (isLoading && !targetMonday) {
      return (
          <div className="flex justify-center items-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
      );
  }

  const days = targetMonday ? getWeekDates(targetMonday) : [];
  const weekDayStrs = ['月', '火', '水', '木', '金', '土', '日']; // 月曜始まり
  const workCount = days.filter((d) => {
    const shift = shifts[formatDate(d)];
    return shift?.type === 'work';
  }).length;
  const daysToShow = days.slice(0, 6);

  return (
    <CastMobileShell>
      <CastMobileHeader />
      <main className="mx-auto flex w-full max-w-[422px] flex-col gap-5 px-4 pb-28 pt-6">
      <CastMobileBackLink href="/cast/dashboard" label="ダッシュボードへ戻る" />
      <div>
        <div className="text-[10px] uppercase tracking-[1px] text-[#6b7280]">WEEKLY SHIFT</div>
        <h1 className="mt-1 text-[22px] font-bold leading-[33px] text-[#f7f4ed]">翌週シフト提出</h1>
      </div>

      <div className="flex items-center gap-3 rounded-[14px] border border-[rgba(230,162,60,0.25)] bg-[rgba(230,162,60,0.12)] px-4 py-4">
        <AlertTriangle className="h-[18px] w-[18px] text-[#e6a23c]" />
        <div>
          <div className="text-[13px] font-bold leading-[19.5px] text-[#e6a23c]">締切: 土曜 23:55<span className="ml-1 text-[11px] font-normal text-[#a9afbc]">残り4日</span></div>
          <div className="text-[12px] leading-[18px] text-[#a9afbc]">対象: {targetMonday.replace(/-/g, '/')} 〜 {days.length > 0 ? formatDate(days[5]).replace(/-/g, '/') : ''} ／ 営業時間 21:00〜26:00</div>
        </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
      ) : (
      <div className="space-y-3">
          {daysToShow.map((d, i) => {
              const dateStr = formatDate(d);
              const shift = shifts[dateStr] || { type: 'off', start: '21:00', end: 'LAST' };
              const isWork = shift.type === 'work';

              return (
                  <div key={dateStr} className="rounded-[16px] border border-white/8 bg-[#131720] px-4 py-[14px]">
                      <div className="flex items-center gap-3">
                        <div className="w-[44px] text-center">
                          <div className={`text-[11px] font-bold leading-[16.5px] ${i === 5 ? 'text-[#7bb8f5]' : 'text-[#a9afbc]'}`}>{weekDayStrs[i]}</div>
                          <div className="text-[18px] font-bold leading-[19.8px] text-[#f7f4ed]">{d.getDate()}</div>
                          <div className="text-[9px] leading-[13.5px] text-[#6b7280]">{d.getMonth() + 1}月</div>
                        </div>
                        <div className="h-9 w-px bg-white/8" />
                        <div className="flex flex-1 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTypeChange(dateStr, 'work')}
                            className={`h-[37px] flex-1 rounded-[10px] text-[13px] leading-[19.5px] ${isWork ? 'bg-[rgba(255,255,255,0.08)] text-[#a9afbc]' : 'bg-[rgba(255,255,255,0.04)] text-[#a9afbc]'}`}
                          >
                            出勤
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTypeChange(dateStr, 'off')}
                            className={`h-[37px] flex-1 rounded-[10px] text-[13px] leading-[19.5px] ${!isWork ? 'bg-[rgba(255,255,255,0.08)] text-[#6b7280]' : 'bg-[rgba(255,255,255,0.04)] text-[#6b7280]'}`}
                          >
                            休み
                          </button>
                        </div>
                        <span className="h-[6px] w-[6px] rounded-full bg-[rgba(255,255,255,0.15)]" />
                      </div>
                  </div>
              );
          })}
      </div>
      )}

      <div className="rounded-[14px] border border-white/8 bg-[#181d27] px-4 py-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#a9afbc]">入力済み: <strong className="text-[#f7f4ed]">{workCount} / 6日</strong></span>
          <span className="font-bold text-[#e6a23c]">出勤 {workCount}日 (4日以上必要)</span>
        </div>
        <div className="mt-3 h-[3px] rounded-full bg-[rgba(255,255,255,0.06)]">
          <div className="h-[3px] rounded-full bg-[#c9a76a]" style={{ width: `${Math.min((workCount / 4) * 100, 100)}%` }} />
        </div>
      </div>

      <div className="pt-1">
          <button 
              onClick={handleSubmit}
              disabled={isSubmitting || workCount < 4}
              className="flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[rgba(255,255,255,0.05)] text-[15px] font-bold text-[#6b7280] transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
              {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                  'シフトを提出する'
              )}
          </button>
          <p className="mt-3 text-center text-[12px] text-[#6b7280]">出勤日を 4 日以上選択してください</p>
      </div>
      </main>
    </CastMobileShell>
  );
}
