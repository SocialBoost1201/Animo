'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ShiftStatus = 'available' | 'unavailable' | 'maybe' | null;

export type MonthlyShiftDetail = {
  status: ShiftStatus;
  startTime?: string | null;
  isDouhan?: boolean;
};

type CastShiftRow = {
  cast_id: string;
  work_date: string;
  status: ShiftStatus;
  start_time: string | null;
  is_douhan: boolean | null;
};

type CastRow = {
  id: string;
  stage_name: string;
};

type MonthlyShiftUpsertRow = {
  cast_id: string;
  work_date: string;
  status: Exclude<ShiftStatus, null>;
  start_time: string | null;
  is_douhan: boolean;
};

/**
 * 年月を指定して、特定キャストのシフトレコードを取得する（フロントエンド描画用）
 */
export async function getCastMonthlyShifts(castId: string, year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data: shifts, error } = await supabase
    .from('cast_shifts')
    .select('work_date, status, start_time, is_douhan')
    .eq('cast_id', castId)
    .gte('work_date', startDate)
    .lte('work_date', endDate);

  if (error) {
    console.error('Error fetching monthly shifts:', error);
    return {};
  }

  const shiftMap: Record<string, MonthlyShiftDetail> = {};
  shifts?.forEach(s => {
    shiftMap[s.work_date] = {
      status: s.status as ShiftStatus,
      startTime: s.start_time ? s.start_time.substring(0, 5) : null,
      isDouhan: !!s.is_douhan,
    };
  });

  return shiftMap;
}

/**
 * キャストが自身の月間シフトを一括保存する
 */
export async function saveMonthlyShifts(castId: string, shiftsData: Record<string, MonthlyShiftDetail>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const upsertData: MonthlyShiftUpsertRow[] = [];
  const deleteDates: string[] = [];

  for (const [dateStr, detail] of Object.entries(shiftsData)) {
    if (detail.status === null) {
      deleteDates.push(dateStr);
    } else {
      upsertData.push({
        cast_id: castId,
        work_date: dateStr,
        status: detail.status,
        start_time: detail.startTime || null,
        is_douhan: detail.isDouhan || false,
      });
    }
  }

  try {
    if (deleteDates.length > 0) {
      const { error: deleteErr } = await supabase
        .from('cast_shifts')
        .delete()
        .eq('cast_id', castId)
        .in('work_date', deleteDates);
      
      if (deleteErr) throw deleteErr;
    }

    if (upsertData.length > 0) {
      const { error: upsertErr } = await supabase
        .from('cast_shifts')
        .upsert(upsertData, {
          onConflict: 'cast_id, work_date',
          ignoreDuplicates: false
        });

      if (upsertErr) throw upsertErr;
    }

    revalidatePath('/cast/monthly-shift');
    revalidatePath('/admin/monthly-shifts');
    return { success: true };
    
  } catch (error: unknown) {
    console.error('Error saving monthly shifts:', error);
    const message = error instanceof Error ? error.message : 'シフト保存に失敗しました。';
    return { success: false, error: message };
  }
}

/**
 * 管理者用：対象月の全キャストのシフト一覧を整形して取得する
 */
export async function getAdminMonthlyShifts(year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: casts, error: castsErr } = await supabase
    .from('casts')
    .select('id, stage_name')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (castsErr) {
    console.error('Error fetching casts:', castsErr);
    return [];
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data: shifts, error: shiftsErr } = await supabase
    .from('cast_shifts')
    .select('cast_id, work_date, status, start_time, is_douhan')
    .gte('work_date', startDate)
    .lte('work_date', endDate);

  if (shiftsErr) {
    console.error('Error fetching admin monthly shifts:', shiftsErr);
    return [];
  }

  return (casts satisfies CastRow[]).map((cast) => {
    const castShifts = (shifts satisfies CastShiftRow[] | null)?.filter((shift) => shift.cast_id === cast.id) || [];
    const shiftMap: Record<number, MonthlyShiftDetail> = {};
    
    castShifts.forEach((shift) => {
      const day = new Date(shift.work_date).getDate();
      shiftMap[day] = {
        status: shift.status,
        startTime: shift.start_time ? shift.start_time.substring(0, 5) : null,
        isDouhan: !!shift.is_douhan,
      };
    });

    return {
      castId: cast.id,
      stageName: cast.stage_name,
      shifts: shiftMap
    };
  });
}
