'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { getPublicCasts } from '@/lib/actions/public/data';
import { createBrowserClient } from '@supabase/ssr';
import { CalendarHeart, ChevronDown, ChevronUp } from 'lucide-react';

// ── 料金計算ロジック（PriceSimulatorと同一） ──────────────────
const SET_FEE = { member: 6000, visitor: 7000 };
const EXTENSION_FEE = 3500;
const NOM_FEE = { none: 0, inside: 2500, main: 3000 };
const TAX_RATE = 1.3;

function calcPrice(
  type: 'member' | 'visitor',
  duration: number,
  nomination: 'none' | 'inside' | 'main'
) {
  const base = SET_FEE[type];
  const ext = duration > 60 ? ((duration - 60) / 30) * EXTENSION_FEE : 0;
  const nom = NOM_FEE[nomination];
  const total = Math.round((base + ext + nom) * TAX_RATE);
  return Math.round(total / 1000) * 1000;
}

// ── インライン料金シミュレーター ──────────────────────────────
function MiniSimulator({ castName }: { castName: string }) {
  const [type, setType] = useState<'member' | 'visitor'>('visitor');
  const [duration, setDuration] = useState(60);
  const [nom, setNom] = useState<'none' | 'inside' | 'main'>('none');

  const price = calcPrice(type, duration, nom);

  const ToggleGroup = ({
    options,
    value,
    onChange,
  }: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: any) => void;
  }) => (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-[10px] font-serif luxury-tracking border transition-all ${
            value === o.value
              ? 'bg-[#171717] text-white border-[#171717]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[var(--color-gold)]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-4 p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 space-y-4">
      <p className="text-[10px] text-[var(--color-gold)] font-serif luxury-tracking uppercase tracking-widest">
        {castName} と過ごす場合の料金目安
      </p>

      <div className="space-y-3">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">来店タイプ</p>
          <ToggleGroup
            options={[
              { label: 'Visitor', value: 'visitor' },
              { label: 'Member', value: 'member' },
            ]}
            value={type}
            onChange={setType}
          />
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">滞在時間</p>
          <ToggleGroup
            options={[
              { label: '60分', value: '60' },
              { label: '90分', value: '90' },
              { label: '120分', value: '120' },
              { label: '150分', value: '150' },
            ]}
            value={String(duration)}
            onChange={(v: string) => setDuration(parseInt(v))}
          />
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">指名</p>
          <ToggleGroup
            options={[
              { label: 'なし', value: 'none' },
              { label: '場内 +¥2,500', value: 'inside' },
              { label: '本指名 +¥3,000', value: 'main' },
            ]}
            value={nom}
            onChange={setNom}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-gold)]/20">
        <div>
          <p className="text-[9px] text-gray-400 font-serif">料金目安（TAX込）</p>
          <p className="text-2xl font-serif text-[#171717]">
            ¥{price.toLocaleString()}
            <span className="text-[10px] text-gray-400 ml-1">前後</span>
          </p>
        </div>
        <Link
          href={`/reserve?cast=${encodeURIComponent(castName)}`}
          className="text-[9px] font-serif luxury-tracking bg-[var(--color-gold)] text-white px-4 py-2.5 hover:bg-[#171717] transition-colors uppercase"
        >
          予約する
        </Link>
      </div>
    </div>
  );
}

// ── メインコンポーネント ────────────────────────────────────
export function ShiftTable() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [casts, setCasts] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSimulator, setOpenSimulator] = useState<string | null>(null);

  // 今日から7日間の日付配列
  const days: { label: string; dateStr: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const mmdd = `${d.getMonth() + 1}/${d.getDate()}`;
    const week = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    days.push({ label: i === 0 ? 'Today' : `${mmdd}(${week})`, dateStr });
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const publicCasts = await getPublicCasts();
        setCasts(publicCasts);

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: shiftData } = await supabase
          .from('shifts')
          .select('*')
          .gte('date', days[0].dateStr)
          .lte('date', days[6].dateStr);

        if (shiftData) setShifts(shiftData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeDateStr = days[activeDayIndex].dateStr;
  const activeShifts = shifts.filter((s) => s.date === activeDateStr);
  const castIdsForDay = new Set(activeShifts.map((s) => s.cast_id));
  const displayCasts = casts.filter((c) => castIdsForDay.has(c.id));

  return (
    <div className="w-full">
      {/* 日付タブ */}
      <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
        {days.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          const count = shifts.filter((s) => s.date === day.dateStr).length;
          return (
            <button
              key={day.dateStr}
              onClick={() => setActiveDayIndex(idx)}
              className={`flex-1 min-w-[80px] py-4 text-center text-xs font-serif luxury-tracking transition-colors relative ${
                isActive ? 'text-[var(--color-gold)]' : 'text-gray-400 hover:text-[#171717]'
              }`}
            >
              <span className="block">{day.label}</span>
              {count > 0 && (
                <span className="text-[9px] block mt-0.5 opacity-70">{count}名</span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-gold)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* キャストリスト */}
      <div className="p-0">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading schedule...</div>
        ) : displayCasts.length > 0 ? (
          <div className="divide-y divide-[var(--color-gold)]/10">
            {displayCasts.map((cast) => {
              const shiftInfo = activeShifts.find((s) => s.cast_id === cast.id);
              const startTime = shiftInfo?.start_time?.slice(0, 5) || '20:00';
              const endTime = shiftInfo?.end_time?.slice(0, 5) || 'LAST';
              const isSimOpen = openSimulator === cast.id;

              return (
                <div key={cast.id} className="bg-white">
                  {/* カード本体 */}
                  <div className="flex items-start gap-5 p-5 md:p-6 hover:bg-gray-50/30 transition-colors">
                    {/* 画像 */}
                    <Link href={`/cast/${cast.slug}`} className="shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden bg-gray-50 border border-gray-100">
                        <PlaceholderImage
                          src={cast.image_url}
                          alt={cast.name}
                          ratio="square"
                          placeholderText={cast.name[0]}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </Link>

                    {/* 情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/cast/${cast.slug}`}>
                            <h3 className="text-xl font-serif luxury-tracking text-[#171717] hover:text-[var(--color-gold)] transition-colors">
                              {cast.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-serif luxury-tracking">
                            {cast.age && <span>{cast.age}歳</span>}
                            {cast.age && cast.height && <span>/</span>}
                            {cast.height && <span>{cast.height}cm</span>}
                          </div>
                        </div>
                        {/* 出勤時間バッジ */}
                        <div className="shrink-0 text-right">
                          <span className="inline-block text-[10px] font-serif luxury-tracking text-[var(--color-gold)] border border-[var(--color-gold)]/40 px-3 py-1">
                            {startTime} – {endTime}
                          </span>
                        </div>
                      </div>

                      {cast.hobby && (
                        <p className="text-[11px] text-gray-400 font-serif luxury-tracking mt-2 line-clamp-1">
                          趣味: {cast.hobby}
                        </p>
                      )}

                      {/* アクションボタン */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                          href={`/cast/${cast.slug}`}
                          className="text-[9px] font-serif luxury-tracking text-[var(--color-gold)] border border-[var(--color-gold)]/60 px-4 py-2 hover:bg-[var(--color-gold)]/10 transition-colors uppercase"
                        >
                          プロフィール
                        </Link>
                        <Link
                          href={`/reserve?cast=${encodeURIComponent(cast.name)}`}
                          className="flex items-center gap-1.5 text-[9px] font-serif luxury-tracking bg-[#171717] text-white px-4 py-2 hover:bg-[var(--color-gold)] transition-colors uppercase"
                        >
                          <CalendarHeart className="w-3 h-3" />
                          今すぐ指名予約
                        </Link>
                        <button
                          onClick={() => setOpenSimulator(isSimOpen ? null : cast.id)}
                          className="flex items-center gap-1 text-[9px] font-serif luxury-tracking text-gray-400 border border-gray-200 px-4 py-2 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors uppercase"
                        >
                          料金目安
                          {isSimOpen ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 展開式シミュレーター */}
                  {isSimOpen && (
                    <div className="px-5 md:px-6 pb-5">
                      <MiniSimulator castName={cast.name} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <span className="text-2xl mb-3">🥂</span>
            <p className="text-sm font-serif luxury-tracking leading-relaxed">
              この日の公開されている出勤予定は現在ありません。
              <br />
              お電話にてお問い合わせください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
