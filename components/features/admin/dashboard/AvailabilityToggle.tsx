'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: '余裕あり', color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle },
  { value: 'limited',   label: '残りわずか', color: 'bg-amber-500',   textColor: 'text-amber-700',   bg: 'bg-amber-50',   icon: AlertTriangle },
  { value: 'full',      label: '満席',       color: 'bg-red-500',     textColor: 'text-red-700',     bg: 'bg-red-50',     icon: XCircle },
  { value: 'closed',   label: '本日休業',   color: 'bg-gray-500',    textColor: 'text-gray-700',    bg: 'bg-gray-100',   icon: WifiOff },
] as const;

type Availability = typeof AVAILABILITY_OPTIONS[number]['value'];

export function AvailabilityToggle({ initialValue }: { initialValue: Availability }) {
  const [current, setCurrent] = useState<Availability>(initialValue);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const currentOption = AVAILABILITY_OPTIONS.find(o => o.value === current) ?? AVAILABILITY_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  async function handleChange(value: Availability) {
    startTransition(async () => {
      const { error } = await supabase
        .from('site_settings')
        .update({ availability: value, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (error) {
        toast.error('更新に失敗しました');
        return;
      }

      setCurrent(value);
      toast.success(`空席状況を「${AVAILABILITY_OPTIONS.find(o => o.value === value)?.label}」に更新しました`);
    });
  }

  return (
    <div className={`border rounded-sm p-4 ${currentOption.bg} border-current/20`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wifi size={16} className={currentOption.textColor} />
          <span className="text-xs font-bold tracking-widest uppercase text-gray-600">空席状況（リアルタイム）</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${currentOption.textColor} ${currentOption.bg} border border-current/20`}>
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <CurrentIcon size={12} />}
          {currentOption.label}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {AVAILABILITY_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = current === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              disabled={isPending || isActive}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-bold transition-all
                ${isActive
                  ? `${opt.bg} ${opt.textColor} ring-2 ring-current/30 shadow-sm`
                  : 'bg-white/70 text-gray-500 hover:bg-white hover:text-gray-700 border border-gray-200'
                }
                disabled:cursor-default`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.color}`} />
              {opt.label}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mt-2 text-right">
        ※ 変更は来店中のお客様の画面にリアルタイムで反映されます
      </p>
    </div>
  );
}
