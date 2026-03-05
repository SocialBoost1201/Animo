'use client'

import React, { useState, useEffect } from 'react';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { getPublicCasts } from '@/lib/actions/public/data';
// client側からシフトを取得するためのAPI呼び出し
import { createBrowserClient } from '@supabase/ssr';

export function ShiftTable() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [casts, setCasts] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 今日から7日間の日付配列を生成
  const days: { label: string; dateStr: string; dateObj: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const mmdd = `${d.getMonth() + 1}/${d.getDate()}`;
    const week = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    // YYYY-MM-DD format for DB match
    const dateStr = d.toISOString().split('T')[0];
    
    days.push({
      label: i === 0 ? 'Today' : `${mmdd}(${week})`,
      dateStr,
      dateObj: d
    });
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const publicCasts = await getPublicCasts();
        setCasts(publicCasts);

        // Supabaseクライアントで直近1週間のシフトだけ取得
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const startDate = days[0].dateStr;
        const endDate = days[6].dateStr;

        const { data: shiftData } = await supabase
          .from('shifts')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (shiftData) {
          setShifts(shiftData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeDateValue = days[activeDayIndex].dateStr;
  
  // 選択中の日付に出勤があるキャストを抽出
  const activeShiftsForDay = shifts.filter(s => s.date === activeDateValue);
  const castIdsForDay = new Set(activeShiftsForDay.map(s => s.cast_id));
  
  const displayCasts = casts.filter(c => castIdsForDay.has(c.id));

  return (
    <div className="w-full">
      {/* タブナビゲーション */}
      <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
        {days.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          return (
            <button
              key={day.dateStr}
              onClick={() => setActiveDayIndex(idx)}
              className={`flex-1 min-w-[80px] py-4 text-center text-xs font-serif luxury-tracking transition-colors relative ${
                isActive ? 'text-[var(--color-gold)]' : 'text-gray-400 hover:text-[#171717]'
              }`}
            >
              {day.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-gold)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* リスト表示 */}
      <div className="p-0">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading schedule...</div>
        ) : displayCasts.length > 0 ? (
          <div className="divide-y divide-[var(--color-gold)]/10">
            {displayCasts.map((cast) => {
              const shiftInfo = activeShiftsForDay.find(s => s.cast_id === cast.id);
              return (
                <div key={cast.id} className="flex items-center p-6 bg-white hover:bg-gray-50/50 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 mr-6 bg-gray-50 border border-gray-100">
                    <PlaceholderImage 
                      src={cast.image_url}
                      alt={cast.name} 
                      ratio="square" 
                      placeholderText={cast.name[0]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif luxury-tracking text-[#171717]">{cast.name}</h3>
                    <div className="text-[10px] text-[var(--color-gold)] font-serif luxury-tracking mt-2 flex items-center gap-2">
                       {shiftInfo?.start_time?.slice(0, 5) || '20:00'} - {shiftInfo?.end_time?.slice(0, 5) || 'LAST'}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                     <a href={`/cast/${cast.slug}`} className="text-[9px] font-serif luxury-tracking text-[var(--color-gold)] border border-[var(--color-gold)] px-4 py-2 hover:bg-[#171717] hover:border-[#171717] hover:text-white transition-colors uppercase">
                       Profile
                     </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <span className="text-2xl mb-2">🥂</span>
            <p>この日の公開されている出勤予定は現在ありません。<br/>お電話にてお問い合わせください。</p>
          </div>
        )}
      </div>
    </div>
  );
}
