import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SplitDay = {
  day: number;
  label: string;
  isWeekend: boolean;
};

export type TemplateCastShift = {
  name: string;
  shifts: Record<string, string>; // day string → '出勤' | '休み' | ''
};

export type TemplateShiftData = {
  year: number;
  month: number;
  casts: TemplateCastShift[];
};

// ─── Utility ─────────────────────────────────────────────────────────────────

/**
 * 指定した年・月・開始日〜終了日の範囲で、日付と曜日の情報を生成する
 * ※ クライアントコンポーネントからも import 可能（'use server' 非依存）
 */
export function generateDaysForSplit(
  year: number,
  month: number,
  start: number,
  end: number,
): SplitDay[] {
  const lastDay = new Date(year, month, 0).getDate();
  const actualEnd = Math.min(end, lastDay);

  if (start > actualEnd) return [];

  return Array.from({ length: actualEnd - start + 1 }, (_, i) => {
    const day = start + i;
    const date = new Date(year, month - 1, day);
    const weekday = format(date, 'E', { locale: ja }); // 例: "月"
    return {
      day,
      label: `${day}（${weekday}）`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });
}
