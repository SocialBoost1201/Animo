'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AlertTriangle, XCircle, WifiOff, CalendarCheck, type LucideProps } from 'lucide-react';

type Availability = 'available' | 'limited' | 'full' | 'closed' | 'open';

const CONFIG: Record<Availability, {
  show: boolean;
  message: string;
  subMessage: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: React.ComponentType<LucideProps>;
  pulse: boolean;
}> = {
  available: {
    show: false, // 余裕ありの場合はバナー非表示（通常状態）
    message: '本日、ご予約可能です',
    subMessage: '今すぐお席を確保ください',
    bgClass: 'bg-emerald-950/90',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-700/40',
    icon: CalendarCheck,
    pulse: false,
  },
  open: {
    show: false,
    message: '本日、ご予約可能です',
    subMessage: '今すぐお席を確保ください',
    bgClass: 'bg-emerald-950/90',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-700/40',
    icon: CalendarCheck,
    pulse: false,
  },
  limited: {
    show: true,
    message: '本日の空席が残りわずかです',
    subMessage: 'ご予約はお急ぎください。席が埋まり次第、受付終了となります。',
    bgClass: 'bg-amber-950/95',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-600/40',
    icon: AlertTriangle,
    pulse: true,
  },
  full: {
    show: true,
    message: '本日は満席となりました',
    subMessage: 'キャンセル待ちのお問い合わせはお電話にて承ります。',
    bgClass: 'bg-red-950/95',
    textClass: 'text-red-300',
    borderClass: 'border-red-700/40',
    icon: XCircle,
    pulse: false,
  },
  closed: {
    show: true,
    message: '本日は休業日となっております',
    subMessage: '次回のご来店を心よりお待ちしております。',
    bgClass: 'bg-gray-900/95',
    textClass: 'text-gray-400',
    borderClass: 'border-gray-700/40',
    icon: WifiOff,
    pulse: false,
  },
};

export function AvailabilityBanner({ initialAvailability }: { initialAvailability: Availability }) {
  const [availability, setAvailability] = useState<Availability>(initialAvailability);
  const [isVisible, setIsVisible] = useState(false);
  const [prevAvailability, setPrevAvailability] = useState<Availability>(initialAvailability);
  const supabase = createClient();
  // prevAvailability is kept for potential future use
  void prevAvailability;

  useEffect(() => {
    const channel = supabase
      .channel('realtime:site_settings:availability')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_settings', filter: 'id=eq.1' },
        (payload) => {
          const newAvailability = payload.new.availability as Availability;
          if (newAvailability !== availability) {
            setAvailability(newAvailability);
            setIsVisible(true); // 変更があった場合は強制表示（フラッシュ）
            setTimeout(() => setIsVisible(false), 6000);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, availability]);

  // 初期表示も含めて config に従って制御
  useEffect(() => {
    const config = CONFIG[availability];
    if (config.show) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [availability]);

  const config = CONFIG[availability];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[calc(100%-2rem)] 
        ${config.bgClass} ${config.borderClass} border backdrop-blur-md
        rounded-sm shadow-2xl px-4 py-3 
        animate-in slide-in-from-bottom-2 fade-in duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${config.pulse ? 'animate-pulse' : ''}`}>
          <Icon size={16} className={config.textClass} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${config.textClass}`}>{config.message}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{config.subMessage}</p>
        </div>
        {availability === 'limited' && (
          <Link
            href="/reserve"
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-sm transition-colors whitespace-nowrap"
          >
            今すぐ予約
          </Link>
        )}
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none ml-1"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}
