import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export type SplitDay = {
  day: number;
  label: string;
  isWeekend: boolean;
};

export type TemplateCastShift = {
  name: string;
  shifts: Record<string, string>;
};

export type TemplateShiftData = {
  year: number;
  month: number;
  casts: TemplateCastShift[];
};

/**
 * 指定した年・月・開始日〜終了日の範囲で、日付と曜日の情報を生成する
 */
export function generateDaysForSplit(year: number, month: number, start: number, end: number): SplitDay[] {
  // その月の最終日を取得
  const lastDay = new Date(year, month, 0).getDate();
  const actualEnd = Math.min(end, lastDay);
  
  if (start > actualEnd) return [];

  return Array.from({ length: actualEnd - start + 1 }, (_, i) => {
    const day = start + i;
    const date = new Date(year, month - 1, day);
    const weekday = format(date, 'E', { locale: ja }); // 例: "月"
    return {
      day,
      // "1（火）" のようなフォーマット
      label: `${day}（${weekday}）`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    };
  });
}
