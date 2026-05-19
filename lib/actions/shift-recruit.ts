'use server';

import { createClient } from '@/lib/supabase/server';

// LINE公式アカウント廃止につき通知送信は停止。Web Push実装時に復元する。
export async function sendShiftRecruitment(
  _targetDate: string,
  _message: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  return { success: true };
}
