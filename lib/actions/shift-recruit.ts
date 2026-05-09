'use server';

import { createClient } from '@/lib/supabase/server';
import { sendLineGroupMessage } from '@/lib/line';

export async function sendShiftRecruitment(
  targetDate: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await sendLineGroupMessage(`【出勤募集】${targetDate}\n${message}`);
    return { success: true };
  } catch (err) {
    console.error('[sendShiftRecruitment] LINE送信失敗:', err);
    return { success: false, error: 'LINE送信に失敗しました' };
  }
}
