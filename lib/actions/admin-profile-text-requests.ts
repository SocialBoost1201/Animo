'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  notifyCastProfileTextApproved,
  notifyCastProfileTextRejected,
} from '@/lib/notifications/cast-notifier';

export type ProfileTextRequest = {
  id: string;
  cast_id: string;
  hobby: string | null;
  comment: string | null;
  quiz_tags: string[] | null;
  created_at: string;
  casts: { stage_name: string | null } | null;
};

export async function getPendingProfileTextRequests(): Promise<{
  data: ProfileTextRequest[];
  error: string | null;
}> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('cast_profile_text_requests')
    .select('id, cast_id, hobby, comment, quiz_tags, created_at, casts(stage_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as unknown as ProfileTextRequest[], error: null };
}

export async function approveProfileTextRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const supabase = createServiceClient();

  const { data: req, error: fetchError } = await supabase
    .from('cast_profile_text_requests')
    .select('cast_id, hobby, comment, quiz_tags, casts(stage_name)')
    .eq('id', id)
    .single();

  if (fetchError || !req) {
    return { success: false, error: fetchError?.message ?? 'Request not found' };
  }

  // 変更があるフィールドだけ casts テーブルに反映する
  const updatePayload: Record<string, unknown> = {};
  if (req.hobby   !== null) updatePayload.hobby      = req.hobby;
  if (req.comment !== null) updatePayload.comment    = req.comment;
  if (req.quiz_tags !== null) updatePayload.quiz_tags = req.quiz_tags;

  if (Object.keys(updatePayload).length > 0) {
    const { error: updateCastError } = await supabase
      .from('casts')
      .update(updatePayload)
      .eq('id', req.cast_id);

    if (updateCastError) return { success: false, error: updateCastError.message };
  }

  const { error: updateReqError } = await supabase
    .from('cast_profile_text_requests')
    .update({
      status:      'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateReqError) return { success: false, error: updateReqError.message };

  // キャスト個人へのLINE通知（fire-and-forget — 承認速度に影響しない）
  const castFields = {
    hobby:    req.hobby !== null,
    quizTags: req.quiz_tags !== null,
    comment:  req.comment !== null,
  };
  const castId = req.cast_id;
  const reqCasts = req.casts as { stage_name: string | null } | { stage_name: string | null }[] | null;
  const castName = Array.isArray(reqCasts) ? (reqCasts[0]?.stage_name ?? '') : (reqCasts?.stage_name ?? '');

  void (async () => {
    try {
      const { data: privateInfo } = await supabase
        .from('cast_private_info')
        .select('line_user_id')
        .eq('cast_id', castId)
        .single();
      await notifyCastProfileTextApproved({
        castName,
        lineUserId: privateInfo?.line_user_id ?? null,
        fields: castFields,
      });
    } catch (e) {
      console.warn('[approveProfileTextRequest] LINE通知失敗:', e);
    }
  })();

  revalidatePath('/admin/approvals');
  return { success: true };
}

export async function rejectProfileTextRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const supabase = createServiceClient();

  const { data: req, error: fetchError } = await supabase
    .from('cast_profile_text_requests')
    .select('cast_id, casts(stage_name)')
    .eq('id', id)
    .single();

  if (fetchError || !req) {
    return { success: false, error: fetchError?.message ?? 'Request not found' };
  }

  const { error } = await supabase
    .from('cast_profile_text_requests')
    .update({
      status:      'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  // キャスト個人へのLINE通知（fire-and-forget — 承認速度に影響しない）
  const castId = req.cast_id;
  const reqCasts = req.casts as { stage_name: string | null } | { stage_name: string | null }[] | null;
  const castName = Array.isArray(reqCasts) ? (reqCasts[0]?.stage_name ?? '') : (reqCasts?.stage_name ?? '');

  void (async () => {
    try {
      const { data: privateInfo } = await supabase
        .from('cast_private_info')
        .select('line_user_id')
        .eq('cast_id', castId)
        .single();
      await notifyCastProfileTextRejected({
        castName,
        lineUserId: privateInfo?.line_user_id ?? null,
      });
    } catch (e) {
      console.warn('[rejectProfileTextRequest] LINE通知失敗:', e);
    }
  })();

  revalidatePath('/admin/approvals');
  return { success: true };
}
