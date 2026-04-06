'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type NoticeImportance = 'high' | 'normal';

export type Notice = {
  id: string;
  title: string;
  content: string;
  importance: NoticeImportance;
  created_at: string;
  created_by: string;
};

type CastImage = {
  image_url: string | null;
  is_primary: boolean;
};

// ----------------------------------------------------------------------
// 管理者向けアクション
// ----------------------------------------------------------------------

/**
 * 全てのお知らせと、各お知らせの既読・未読カウントを取得する（管理者用）
 */
export async function getAdminNotices() {
  const supabase = await createClient();

  // 最新のお知らせ一覧を取得
  const { data: notices, error: noticeErr } = await supabase
    .from('internal_notices')
    .select('*')
    .order('created_at', { ascending: false });

  if (noticeErr) {
    console.error('Error fetching notices:', noticeErr);
    return [];
  }

  // アクティブなキャストの総数を取得
  const { count: totalCasts, error: castsErr } = await supabase
    .from('casts')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  if (castsErr) {
    console.error('Error fetching total casts:', castsErr);
  }

  // 各お知らせの既読数を取得（Group Byの代わりに別途カウントするか、全量取って集計する）
  // 件数がそこまで多くないと仮定して、各noticeごとに読んだ数を取得する簡易実装
  const noticesWithStats = await Promise.all(
    (notices || []).map(async (notice) => {
      const { count: readCount } = await supabase
        .from('notice_reads')
        .select('cast_id', { count: 'exact', head: true })
        .eq('notice_id', notice.id);

      return {
        ...notice,
        reads_count: readCount || 0,
        total_casts: totalCasts || 0,
      };
    })
  );

  return noticesWithStats;
}

/**
 * 特定のお知らせの、キャストごとの既読状況を取得する（管理者用）
 */
export async function getNoticeReadStatus(noticeId: string) {
  const supabase = await createClient();

  // アクティブキャストの一覧を取得
  const { data: casts, error: castsErr } = await supabase
    .from('casts')
    .select('id, stage_name, cast_images(image_url, is_primary)')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (castsErr) {
    console.error('Error fetching casts:', castsErr);
    return [];
  }

  // このお知らせの既読レコードを取得
  const { data: reads, error: readsErr } = await supabase
    .from('notice_reads')
    .select('cast_id, read_at')
    .eq('notice_id', noticeId);

  if (readsErr) {
    console.error('Error fetching reads:', readsErr);
    return [];
  }

  const readMap = new Map(reads?.map(r => [r.cast_id, r.read_at]));

  return casts.map(cast => {
    const imageUrl = cast.cast_images?.find((img: CastImage) => img.is_primary)?.image_url;
    return {
      cast_id: cast.id,
      stage_name: cast.stage_name,
      image_url: imageUrl,
      is_read: readMap.has(cast.id),
      read_at: readMap.get(cast.id) || null,
    };
  });
}

/**
 * お知らせを新規作成する（管理者用）
 */
export async function createNotice(formData: FormData) {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '認証されていません。' };

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const importance = (formData.get('importance') as NoticeImportance) || 'normal';

  if (!title || !content) {
    return { success: false, error: 'タイトルと本文は必須です。' };
  }

  const { error } = await supabase
    .from('internal_notices')
    .insert([{
      title,
      content,
      importance,
      created_by: user.id
    }]);

  if (error) {
    console.error('Error creating notice:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/internal-notices');
  revalidatePath('/cast/dashboard');
  revalidatePath('/cast/notices');
  return { success: true };
}

/**
 * お知らせを削除する（管理者用）
 */
export async function deleteNotice(noticeId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('internal_notices').delete().eq('id', noticeId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/internal-notices');
  revalidatePath('/cast/dashboard');
  revalidatePath('/cast/notices');
  return { success: true };
}
