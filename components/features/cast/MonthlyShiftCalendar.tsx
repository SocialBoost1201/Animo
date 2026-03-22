'use client';

import { useState, useTransition } from 'react';
import { Save, Eraser, CalendarDays, Loader2, Check } from 'lucide-react';
import { ShiftStatus, MonthlyShiftDetail, saveMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ペイントツールの種類
type PaintTool = 
  | { type: 'available', startTime: string, isDouhan: false }
  | { type: 'available', startTime: null, isDouhan: true }
  | { type: 'unavailable', startTime: null, isDouhan: false }
  | { type: 'maybe', startTime: null, isDouhan: false }
  | { type: 'erase', startTime: null, isDouhan: false };

export function MonthlyShiftCalendar({ 
  year, 
  month, 
  castId,
  initialShifts 
}: { 
  year: number, 
  month: number, 
  castId: string,
  initialShifts: Record<string, MonthlyShiftDetail> 
}) {
  const router = useRouter();
  const [shifts, setShifts] = useState<Record<string, MonthlyShiftDetail>>(initialShifts);
  const [isPending, startTransition] = useTransition();

  // デフォルトのペイントツール（21:00から出勤）
  const [activeTool, setActiveTool] = useState<PaintTool>({ type: 'available', startTime: '21:00', isDouhan: false });

  // 曜日計算
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0: 日, 1: 月...
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ペイント実行
  const handleDayClick = (dateStr: string) => {
    setShifts(prev => {
      const next = { ...prev };
      
      if (activeTool.type === 'erase') {
        const { [dateStr]: _, ...rest } = next;
        return rest; // 未選択状態（キーごと削除してnull扱いにする設計に合わせる）
      }
      
      next[dateStr] = {
        status: activeTool.type as ShiftStatus,
        startTime: activeTool.startTime,
        isDouhan: activeTool.isDouhan
      };
      
      return next;
    });
  };

  // 保存処理
  const handleSave = () => {
    // 未設定の日は null として登録するため、1〜月末までの全ての日付を網羅する
    const payload: Record<string, MonthlyShiftDetail> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (shifts[dateStr]) {
        payload[dateStr] = shifts[dateStr];
      } else {
        payload[dateStr] = { status: null };
      }
    }

    startTransition(async () => {
      const result = await saveMonthlyShifts(castId, payload);
      if (result.success) {
        toast.success(`${month}月のシフトを提出しました！`);
        router.refresh();
      } else {
        toast.error(result.error || '保存に失敗しました');
      }
    });
  };

  // 描画用のヘルパー
  const getCellDisplay = (detail?: MonthlyShiftDetail) => {
    if (!detail || !detail.status) return null;
    if (detail.status === 'unavailable') return <span className="text-red-500 font-bold text-xl">×</span>;
    if (detail.status === 'maybe') return <span className="text-yellow-500 font-bold text-xl">△</span>;
    if (detail.status === 'available') {
      if (detail.isDouhan) return <span className="text-pink-500 font-bold text-xs tracking-widest">同伴</span>;
      if (detail.startTime) return <span className="text-blue-600 font-bold text-xs tracking-tight">{detail.startTime}</span>;
      return <span className="text-blue-500 font-bold text-xl">○</span>;
    }
    return null;
  };

  const getCellBgClass = (detail?: MonthlyShiftDetail) => {
    if (!detail || !detail.status) return 'bg-white border-gray-100';
    if (detail.status === 'unavailable') return 'bg-red-50 border-red-200';
    if (detail.status === 'maybe') return 'bg-yellow-50 border-yellow-200';
    if (detail.status === 'available' && detail.isDouhan) return 'bg-pink-50 border-pink-200';
    if (detail.status === 'available') return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-100';
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* ペイントツール選択（スマホでは画面下部に固定、PCでは上部） */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 sm:static z-20">
          <h3 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-gold rounded-full inline-block"></span>
            1. 予定を選んでカレンダーをタップ
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {[
              { label: '21:00', tool: { type: 'available', startTime: '21:00', isDouhan: false }, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '21:30', tool: { type: 'available', startTime: '21:30', isDouhan: false }, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '22:00', tool: { type: 'available', startTime: '22:00', isDouhan: false }, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '22:30', tool: { type: 'available', startTime: '22:30', isDouhan: false }, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '23:00', tool: { type: 'available', startTime: '23:00', isDouhan: false }, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '同伴',  tool: { type: 'available', startTime: null, isDouhan: true }, color: 'text-pink-600 bg-pink-50 border-pink-200' },
              { label: '△',     tool: { type: 'maybe', startTime: null, isDouhan: false }, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
              { label: '×',     tool: { type: 'unavailable', startTime: null, isDouhan: false }, color: 'text-red-600 bg-red-50 border-red-200' },
              { label: <Eraser size={14} />, tool: { type: 'erase', startTime: null, isDouhan: false }, color: 'text-gray-500 bg-gray-100 border-gray-300' },
            ].map((cfg, i) => {
              const isActive = 
                activeTool.type === cfg.tool.type && 
                activeTool.startTime === cfg.tool.startTime && 
                activeTool.isDouhan === cfg.tool.isDouhan;
                
              return (
                <button
                  key={i}
                  onClick={() => setActiveTool(cfg.tool as PaintTool)}
                  className={`px-3 py-2 rounded-lg font-bold text-sm transition-all border ${
                    isActive ? `ring-2 ring-offset-1 ring-[#171717] ${cfg.color}` : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    {cfg.label}
                    {isActive && <Check size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* カレンダー本体 */}
        <div className="p-4 sm:p-6">
          <h3 className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-1.5 uppercase tracking-widest pb-2 border-b border-gray-100">
            <span className="w-1.5 h-1.5 bg-gold rounded-full inline-block"></span>
            2. カレンダーを塗りつぶす
          </h3>
          
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {['日', '月', '火', '水', '木', '金', '土'].map(d => (
              <div key={d} className={`text-center text-xs sm:text-xs font-bold py-2 ${d === '日' ? 'text-red-500' : d === '土' ? 'text-blue-500' : 'text-gray-400'}`}>
                {d}
              </div>
            ))}
            
            {/* カレンダーの空白オフセット */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="bg-transparent aspect-4/5 sm:aspect-square"></div>
            ))}
            
            {/* 日付セル */}
            {days.map(day => {
              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const detail = shifts[dateStr];
              const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6;

              return (
                <button
                  key={day}
                  onPointerDown={() => handleDayClick(dateStr)} // クリック＆ドラッグ対応などを見据えてPointerDownが反応良い
                  className={`relative aspect-4/5 sm:aspect-square sm:h-20 border rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer select-none active:scale-95 transition-all
                  ${getCellBgClass(detail)}`}
                >
                  <span className={`absolute top-1 left-2 text-xs font-bold ${isWeekend ? 'text-gray-500' : 'text-gray-400'}`}>{day}</span>
                  <div className="mt-2 flex items-center justify-center h-8">
                    {getCellDisplay(detail)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="flex justify-center sm:justify-end sticky bottom-4 z-30 px-4 sm:px-0">
        <button 
          onClick={handleSave} 
          disabled={isPending}
          className="w-full sm:w-auto bg-[#171717] hover:bg-gold text-white px-8 py-3.5 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(0,0,0,0.15)] active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isPending ? '保存しています...' : 'シフトを提出する'}
        </button>
      </div>

    </div>
  );
}
