'use server';

import { createClient } from '@/lib/supabase/server';

// キャスト用のPV情報・ランキング取得アクション
export async function getCastPVStats(castId: string) {
  const supabase = await createClient();

  try {
    // 1. そのキャストの全投稿の合計PVを取得
    const { data: myPosts, error: myError } = await supabase
      .from('cast_posts')
      .select('view_count')
      .eq('cast_id', castId);

    if (myError) throw myError;

    const totalPV = myPosts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    // 2. 所属している店舗内の全キャストのPVを集計して順位を算出
    // （※シンプルに全キャストの投稿データを引いて合算＆ソート）
    // 大規模になればRPCや専用Viewを作る方が良いが、まずは運用可能な形で実装
    const { data: allPosts, error: allError } = await supabase
      .from('cast_posts')
      .select('cast_id, view_count, casts(id, stage_name)');

    if (allError) throw allError;

    const castPVSumMap: Record<string, number> = {};
    allPosts?.forEach((post) => {
      const cid = post.cast_id;
      if (!castPVSumMap[cid]) castPVSumMap[cid] = 0;
      castPVSumMap[cid] += (post.view_count || 0);
    });

    // PVの多い順に配列化して順位を特定
    const sortedCasts = Object.entries(castPVSumMap).sort((a, b) => b[1] - a[1]);
    const myRankIndex = sortedCasts.findIndex(([id]) => id === castId);
    
    // まだ投稿がない等の場合は順位外として扱う
    const rank = myRankIndex !== -1 ? myRankIndex + 1 : sortedCasts.length + 1;

    return { success: true, totalPV, rank, totalCasts: sortedCasts.length };
  } catch (error: any) {
    console.error('Failed to get cast PV stats:', error);
    return { success: false, error: error.message };
  }
}

// 管理者用の投稿ランキング取得アクション
export async function getAdminPostRankings(limitCount: number = 20) {
  const supabase = await createClient();

  try {
    const { data: rankedPosts, error } = await supabase
      .from('cast_posts')
      .select('id, cast_id, content, image_url, view_count, created_at, casts(id, stage_name, image_url)')
      .order('view_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    return { success: true, data: rankedPosts };
  } catch (error: any) {
    console.error('Failed to get admin post rankings:', error);
    return { success: false, error: error.message };
  }
}
