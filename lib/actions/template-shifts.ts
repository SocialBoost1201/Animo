'use server';

import { createClient } from '@/lib/supabase/server';
import type { TemplateShiftData } from '@/lib/template-shift-utils';

// 型は lib/template-shift-utils から直接 import してください
// ここでは Server Action のみエクスポートします

/**
 * shift_submissions テーブルから承認済みシフトを取得し TemplateShiftData 形式に変換する
 */
export async function getTemplateShiftData(
  year: number,
  month: number,
): Promise<TemplateShiftData> {
  const supabase = await createClient();

  const monthStr = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate();

  const { data: submissionsRaw, error } = await supabase
    .from('shift_submissions')
    .select('cast_id, shifts_data, casts(stage_name)')
    .eq('status', 'approved');

  if (error) {
    console.error('getTemplateShiftData error:', error);
    return { year, month, casts: [] };
  }

  // cast_id をキーに集約（同一キャストが複数週で複数行になるため）
  const castMap = new Map<string, { name: string; shifts: Record<string, string> }>();

  for (const row of (submissionsRaw ?? [])) {
    const castId = row.cast_id;
    const castData = row.casts as unknown as { stage_name: string } | null;
    const name = castData?.stage_name ?? '不明';
    const shiftsData = row.shifts_data as Record<
      string,
      { type: string; start?: string; end?: string }
    > | null;

    if (!shiftsData) continue;

    const existing = castMap.get(castId) ?? { name, shifts: {} };
    for (let d = 1; d <= lastDay; d++) {
      const dateKey = `${year}-${monthStr}-${String(d).padStart(2, '0')}`;
      const entry = shiftsData[dateKey];
      if (entry) {
        existing.shifts[String(d)] = entry.type === 'work' ? '出勤' : '休み';
      }
    }
    castMap.set(castId, existing);
  }

  const casts = Array.from(castMap.values()).filter(
    (c) => Object.keys(c.shifts).length > 0
  );
  casts.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  return { year, month, casts };
}
