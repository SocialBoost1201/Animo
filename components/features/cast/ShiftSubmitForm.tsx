'use client';

import React, { useState, useEffect } from 'react';
import { getTargetWeekMonday } from '@/lib/shift-utils';
import { getMyShiftSubmission, submitMyShift, WeeklyShiftSubmission, ShiftType } from '@/lib/actions/cast-shifts';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader, PageShell, SectionCard } from '@/components/ui/app-shell';

function getInitialTargetMonday() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMondayDate = getTargetWeekMonday(nextWeek);
  return new Date(nextMondayDate.getTime() - nextMondayDate.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}

export default function ShiftSubmitPage({ castId }: { castId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetMonday, setTargetMonday] = useState<string>(getInitialTargetMonday);
  const [shifts, setShifts] = useState<WeeklyShiftSubmission>({});

  // 1週間分の日付リストを生成
  const generateWeekDays = (mondayStr: string) => {
    const monday = new Date(mondayStr);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    return days;
  };

  useEffect(() => {
    const loadShifts = async () => {
      setIsLoading(true);
      const days = generateWeekDays(targetMonday);
      const initialShifts: WeeklyShiftSubmission = {};
      
      // デフォルト値のセット（休み）
      days.forEach(d => {
        const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
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

  const changeWeek = (direction: 'prev' | 'next') => {
    if (!targetMonday) return;
    const current = new Date(targetMonday);
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    setTargetMonday(current.toISOString().split('T')[0]);
  };

  const handleTypeChange = (dateStr: string, type: ShiftType) => {
      setShifts(prev => ({
          ...prev,
          [dateStr]: { ...prev[dateStr], type }
      }));
  };

  const handleTimeChange = (dateStr: string, field: 'start' | 'end', value: string) => {
      setShifts(prev => ({
          ...prev,
          [dateStr]: { ...prev[dateStr], [field]: value }
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

  const days = targetMonday ? generateWeekDays(targetMonday) : [];
  const weekDayStrs = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <PageShell width="narrow" className="space-y-6 px-5 py-8">
      <PageHeader
        eyebrow="Shift Schedule"
        title="来週のシフトを提出"
        description="出勤日だけを選んで、時間を入力してください。提出後も管理者承認前なら再提出できます。"
        actions={
          <Link
            href="/cast/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-[#171717]"
          >
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードへ戻る
          </Link>
        }
      />

      <SectionCard tone="subtle" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => changeWeek('prev')} className="p-1.5 hover:bg-gold/10 rounded disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 text-[#171717]" />
            </button>
            <p className="text-xs text-[#171717] font-bold text-center">
                対象週: {targetMonday.replace(/-/g, '/')} 〜 
            </p>
            <button onClick={() => changeWeek('next')} className="p-1.5 hover:bg-gold/10 rounded disabled:opacity-50">
              <ChevronRight className="w-4 h-4 text-[#171717]" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center leading-relaxed mt-2">
              出勤する日の時間を選択してください。<br/>
              ※開始・終了時間は後から変更可能です
          </p>
      </SectionCard>

      {isLoading ? (
          <div className="flex justify-center items-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
      ) : (
      <div className="space-y-3">
          {days.map((d, i) => {
              const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              const shift = shifts[dateStr] || { type: 'off', start: '21:00', end: 'LAST' };
              const isWork = shift.type === 'work';

              return (
                  <div key={dateStr} className={`p-4 rounded-xl border transition-colors ${
                      isWork ? 'bg-white border-gold/40 shadow-xs' : 'bg-gray-50/50 border-gray-100'
                  }`}>
                      <div className="flex items-center justify-between mb-3">
                          <div className="font-serif font-bold text-sm text-[#171717]">
                              {d.getMonth() + 1}/{d.getDate()} <span className="text-xs text-gray-400 ml-1">({weekDayStrs[i]})</span>
                          </div>
                          <div className="flex bg-gray-100 rounded-lg p-1">
                              <button 
                                onClick={() => handleTypeChange(dateStr, 'off')}
                                className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all ${
                                    !isWork ? 'bg-white text-gray-500 shadow-xs' : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                  休み
                              </button>
                              <button 
                                onClick={() => handleTypeChange(dateStr, 'work')}
                                className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all ${
                                    isWork ? 'bg-[#171717] text-gold shadow-xs' : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                  出勤
                              </button>
                          </div>
                      </div>

                      {/* 時間選択（出勤時のみ表示） */}
                      {isWork && (
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex-1">
                                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 ml-1">START</label>
                                  <select 
                                      value={shift.start}
                                      onChange={(e) => handleTimeChange(dateStr, 'start', e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#171717] rounded-lg p-2.5 focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold"
                                  >
                                      {['19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','00:00','01:00'].map(t => (
                                          <option key={`start-${t}`} value={t}>{t}</option>
                                      ))}
                                  </select>
                              </div>
                              <span className="text-gray-300 font-bold mt-5">〜</span>
                              <div className="flex-1">
                                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 ml-1">END</label>
                                  <select 
                                      value={shift.end}
                                      onChange={(e) => handleTimeChange(dateStr, 'end', e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#171717] rounded-lg p-2.5 focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold"
                                  >
                                      {['LAST','00:00','00:30','01:00','01:30','02:00'].map(t => (
                                          <option key={`end-${t}`} value={t}>{t}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>
                      )}
                  </div>
              );
          })}
      </div>
      )}

      <div className="pt-4 sticky bottom-6 z-10">
          <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#171717] hover:bg-gold text-white font-bold tracking-[0.2em] uppercase py-5 rounded-2xl shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
              {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                  <>
                      提出する
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
          </button>
      </div>
    </PageShell>
  );
}
