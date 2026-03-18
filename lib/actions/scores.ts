'use server';

import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

type ActionType = 'shift_submitted_on_time' | 'blog_posted' | 'blog_pv_milestone' | 'help_shift_accepted' | 'other';

/**
 * キャストにスコア（ポイント）を付与または減算し、ログを残す
 */
export async function addCastScore(
  castId: string,
  pointsDelta: number,
  actionType: ActionType,
  description: string,
  targetMonth?: string
) {
  const supabase = await createClient();
  const month = targetMonth || format(new Date(), 'yyyy-MM');

  try {
    // 1. まず現在のスコアを取得
    const { data: currentScore, error: fetchError } = await supabase
      .from('cast_scores')
      .select('total_score')
      .eq('cast_id', castId)
      .eq('target_month', month)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching cast score:', fetchError);
      return { success: false, error: fetchError.message };
    }

    let newTotal = pointsDelta;
    if (currentScore) {
      newTotal = currentScore.total_score + pointsDelta;
    }
    
    // スコアがマイナスにならないようにする（運用によるが、ここでは0を下限とする）
    if (newTotal < 0) newTotal = 0;

    // レベル計算ロジック（例：50ポイントごとに1レベル上がる）
    const newLevel = Math.floor(newTotal / 50) + 1;

    // 2. cast_scores を UPSERT する
    const { error: upsertError } = await supabase
      .from('cast_scores')
      .upsert({
        cast_id: castId,
        target_month: month,
        total_score: newTotal,
        current_level: newLevel,
      }, { onConflict: 'cast_id, target_month' });

    if (upsertError) {
      console.error('Error upserting cast score:', upsertError);
      return { success: false, error: upsertError.message };
    }

    // 3. ログを残す
    const { error: logError } = await supabase
      .from('cast_score_logs')
      .insert([{
        cast_id: castId,
        target_month: month,
        action_type: actionType,
        points_delta: pointsDelta,
        description: description
      }]);

    if (logError) {
      console.error('Error inserting score log:', logError);
      return { success: false, error: logError.message };
    }

    return { success: true, newTotal, newLevel };
  } catch (error: any) {
    console.error('Failed to add cast score:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 特定のキャストの現在のスコアと直近の獲得履歴を取得する
 */
export async function getCastScoreAndLogs(castId: string, targetMonth?: string, limit: number = 5) {
  const supabase = await createClient();
  const month = targetMonth || format(new Date(), 'yyyy-MM');

  // スコア取得
  const { data: scoreData, error: scoreError } = await supabase
    .from('cast_scores')
    .select('*')
    .eq('cast_id', castId)
    .eq('target_month', month)
    .maybeSingle();

  if (scoreError) {
    console.error('Error fetching score:', scoreError);
  }

  // 履歴取得
  const { data: logsData, error: logsError } = await supabase
    .from('cast_score_logs')
    .select('*')
    .eq('cast_id', castId)
    .eq('target_month', month)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (logsError) {
    console.error('Error fetching score logs:', logsError);
  }

  return {
    score: scoreData || { total_score: 0, current_level: 1 },
    logs: logsData || []
  };
}
