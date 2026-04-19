'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/shift-utils';

type Schedule = {
  id: string;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
};

type WeekData = {
  mondayStr: string;
  label: string;
  isCurrentWeek: boolean;
  schedules: Schedule[];
};

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

function buildWeekDates(mondayStr: string): Date[] {
  const monday = new Date(mondayStr);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function weekLabel(mondayStr: string): string {
  const monday = new Date(mondayStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)}(月) 〜 ${fmt(sunday)}(日)`;
}

function WorkBadge({ schedule }: { schedule: Schedule | null }) {
  if (!schedule) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="text-base font-bold text-[#ef4444]">×</span>
        <span className="text-xs text-[#6b7280]">休み</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-base font-bold text-[#3b82f6]">○</span>
      <span className="text-xs text-[#8f96a3]">
        {schedule.start_time?.slice(0, 5) ?? '?'}〜{schedule.end_time?.slice(0, 5) ?? 'LAST'}
      </span>
    </span>
  );
}

export function WeekScheduleClient({ weeks, today }: { weeks: WeekData[]; today: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedWeek = weeks[selectedIndex];

  // 外クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const weekDates = buildWeekDates(selectedWeek.mondayStr);
  const scheduleMap = new Map(selectedWeek.schedules.map((s) => [s.work_date, s]));
  const workCount = selectedWeek.schedules.length;
  const offCount = 7 - workCount;

  return (
    <div className="space-y-4">
      {/* ─── 週選択ボタン（4レイヤープレミアムスキン） ─── */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="btn-week-selector w-full"
          aria-expanded={isOpen}
        >
          <div className="btn-week-selector__surface flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {selectedWeek.isCurrentWeek && (
                <span className="rounded-full bg-[rgba(201,167,106,0.2)] px-2 py-0.5 text-[10px] font-bold text-[#c9a76a]">
                  今週
                </span>
              )}
              <span className="text-sm font-bold text-[#f7f4ed]">{selectedWeek.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-[#3b82f6]">○{workCount}</span>
                <span className="text-[#6b7280]">/</span>
                <span className="font-bold text-[#ef4444]">×{offCount}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[#8f96a3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </button>

        {/* ドロップダウンリスト */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[16px] border border-white/10 bg-[#131720] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)]">
            {weeks.map((week, i) => (
              <button
                key={week.mondayStr}
                onClick={() => { setSelectedIndex(i); setIsOpen(false); }}
                className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors ${
                  i === selectedIndex
                    ? 'bg-[rgba(201,167,106,0.1)] text-[#c9a76a]'
                    : 'text-[#a9afbc] hover:bg-white/5'
                } ${i > 0 ? 'border-t border-white/5' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {week.isCurrentWeek && (
                    <span className="rounded-full bg-[rgba(201,167,106,0.15)] px-1.5 py-0.5 text-[9px] font-bold text-[#c9a76a]">
                      今週
                    </span>
                  )}
                  <span className="text-xs font-bold">{week.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-[#3b82f6]">○{week.schedules.length}</span>
                  <span className="text-[#6b7280]">/</span>
                  <span className="font-bold text-[#ef4444]">×{7 - week.schedules.length}</span>
                  {i === selectedIndex && <ChevronRight className="ml-1 h-3 w-3 text-[#c9a76a]" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── 選択週のシフト詳細 ─── */}
      <div className="overflow-hidden rounded-[20px] border border-white/8 bg-[#131720]">
        {/* 週ヘッダー */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">
              {selectedWeek.isCurrentWeek ? 'This Week' : 'Past Week'}
            </div>
            <div className="text-sm font-bold text-[#f7f4ed]">
              {selectedWeek.isCurrentWeek ? '今週のシフト' : '過去のシフト'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#6b7280]">{selectedWeek.label}</div>
            <div className="mt-0.5 flex items-center justify-end gap-2 text-[11px]">
              <span className="font-bold text-[#3b82f6]">出勤 {workCount}日</span>
              <span className="text-[#6b7280]">/</span>
              <span className="font-bold text-[#ef4444]">休み {offCount}日</span>
            </div>
          </div>
        </div>

        {/* 7日分リスト */}
        <div className="divide-y divide-white/5">
          {weekDates.map((date, i) => {
            const dateKey = formatDate(date);
            const schedule = scheduleMap.get(dateKey) ?? null;
            const isToday = dateKey === today;
            const dayLabel = DAY_LABELS[i];
            const isSat = i === 5;
            const isSun = i === 6;

            return (
              <div
                key={dateKey}
                className={`flex items-center justify-between px-5 py-3 ${
                  isToday ? 'bg-[rgba(201,167,106,0.06)]' : ''
                }`}
              >
                {/* 日付 */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 flex-col items-center justify-center rounded-lg border text-center ${
                      isToday
                        ? 'border-[rgba(201,167,106,0.5)] bg-[rgba(201,167,106,0.12)]'
                        : 'border-white/8 bg-white/3'
                    }`}
                  >
                    <span className={`text-[9px] font-bold ${
                      isToday ? 'text-[#c9a76a]' : isSat ? 'text-[#60a5fa]' : isSun ? 'text-[#f87171]' : 'text-[#6b7280]'
                    }`}>
                      {dayLabel}
                    </span>
                    <span className={`text-xs font-bold ${isToday ? 'text-[#c9a76a]' : 'text-[#f7f4ed]'}`}>
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                  </div>
                  {isToday && (
                    <span className="rounded-full bg-[rgba(201,167,106,0.15)] px-2 py-0.5 text-[10px] font-bold text-[#c9a76a]">
                      本日
                    </span>
                  )}
                </div>

                {/* ステータス */}
                <WorkBadge schedule={schedule} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
