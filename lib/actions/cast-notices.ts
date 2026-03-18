'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ----------------------------------------------------------------------
// キャスト向けアクション
// ----------------------------------------------------------------------

export type CastNotice = {
  id: string;
  title: string;
  content: string;
  importance: 'high' | 'normal';
  created_at: string;
  is_read: boolean;
};

/**
 * キャスト自身が見られるお知らせ一覧（既読ステータス付き）を取得する
 */
export async function getCastNotices(castId: string): Promise<CastNotice[]> {
  const supabase = await createClient();

  // 1. 全てのお知らせを取得
  const { data: notices, error: noticeErr } = await supabase
    .from('internal_notices')
    .select('*')
    .order('created_at', { ascending: false });

  if (noticeErr) {
    console.error('Error fetching notices for cast:', noticeErr);
    return [];
  }

  // 2. このキャストが既読にしたお知らせID一覧を取得
  const { data: reads, error: readsErr } = await supabase
    .from('notice_reads')
    .select('notice_id')
    .eq('cast_id', castId);

  if (readsErr) {
    console.error('Error fetching reads for cast:', readsErr);
    return [];
  }

  const readNoticeIds = new Set(reads?.map(r => r.notice_id) || []);

  // 3. 結合して返す
  return (notices || []).map(notice => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    importance: notice.importance as 'high' | 'normal',
    created_at: notice.created_at,
    is_read: readNoticeIds.has(notice.id),
  }));
}

/**
 * 指定したお知らせを「既読」にする
 */
export async function markNoticeAsRead(castId: string, noticeId: string) {
  const supabase = await createClient();

  // upsertで既読テーブルに登録（すでにあれば何もしない）
  const { error } = await supabase
    .from('notice_reads')
    .upsert(
      { notice_id: noticeId, cast_id: castId },
      { onConflict: 'notice_id,cast_id', ignoreDuplicates: true }
    );

  if (error) {
    console.error('Error marking notice as read:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/cast/dashboard');
  revalidatePath('/cast/notices');
  revalidatePath('/admin/internal-notices');
  return { success: true };
}
