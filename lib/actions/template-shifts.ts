'use server';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/server';

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

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * shift_submissions テーブルから承認済みシフトを取得し TemplateShiftData 形式に変換する
 */
export async function getTemplateShiftData(
  year: number,
  month: number,
): Promise<TemplateShiftData> {
  const supabase = await createClient();

  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

  const { data: submissionsRaw, error } = await supabase
    .from('shift_submissions')
    .select('cast_id, shifts_data, casts(stage_name)')
    .eq('status', 'approved');

  if (error) {
    console.error('getTemplateShiftData error:', error);
    return { year, month, casts: [] };
  }

  // キャストごとに対象月の出勤/休みを集計
  const casts: TemplateCastShift[] = [];

  for (const row of (submissionsRaw ?? [])) {
    const castData = row.casts as unknown as { stage_name: string } | null;
    const name = castData?.stage_name ?? '不明';
    const shiftsData = row.shifts_data as Record<
      string,
      { type: string; start?: string; end?: string }
    > | null;

    if (!shiftsData) continue;

    const shifts: Record<string, string> = {};
    for (let d = 1; d <= lastDay; d++) {
      const dateKey = `${year}-${monthStr}-${String(d).padStart(2, '0')}`;
      const entry = shiftsData[dateKey];
      if (entry) {
        shifts[String(d)] = entry.type === 'work' ? '出勤' : '休み';
      }
    }

    // 1日でも記録がある場合のみ追加
    if (Object.keys(shifts).length > 0) {
      casts.push({ name, shifts });
    }
  }

  // キャスト名でソート
  casts.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  return { year, month, casts };
}
