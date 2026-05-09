'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  notifyCastProfileImageApproved,
  notifyCastProfileImageRejected,
} from '@/lib/notifications/cast-notifier';

export type ProfileImageRequest = {
  id: string;
  cast_id: string;
  image_url: string;
  created_at: string;
  casts: { stage_name: string | null } | null;
};

export async function getPendingProfileImageRequests(): Promise<{
  data: ProfileImageRequest[];
  error: string | null;
}> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('cast_profile_image_requests')
    .select('id, cast_id, image_url, created_at, casts(stage_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as unknown as ProfileImageRequest[], error: null };
}

export async function approveProfileImageRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const supabase = createServiceClient();

  const { data: request, error: fetchError } = await supabase
    .from('cast_profile_image_requests')
    .select('cast_id, image_url, casts(stage_name)')
    .eq('id', id)
    .single();

  if (fetchError || !request) {
    return { success: false, error: fetchError?.message ?? 'Request not found' };
  }

  const { error: updateCastError } = await supabase
    .from('casts')
    .update({ image_url: request.image_url })
    .eq('id', request.cast_id);

  if (updateCastError) {
    return { success: false, error: updateCastError.message };
  }

  const { error: updateRequestError } = await supabase
    .from('cast_profile_image_requests')
    .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (updateRequestError) {
    return { success: false, error: updateRequestError.message };
  }

  // キャスト個人へのLINE通知（fire-and-forget — 承認速度に影響しない）
  const castId = request.cast_id;
  const reqCasts = request.casts as { stage_name: string | null } | { stage_name: string | null }[] | null;
  const castName = Array.isArray(reqCasts) ? (reqCasts[0]?.stage_name ?? '') : (reqCasts?.stage_name ?? '');

  void (async () => {
    try {
      const { data: privateInfo } = await supabase
        .from('cast_private_info')
        .select('line_user_id')
        .eq('cast_id', castId)
        .single();
      await notifyCastProfileImageApproved({
        castName,
        lineUserId: privateInfo?.line_user_id ?? null,
      });
    } catch (e) {
      console.warn('[approveProfileImageRequest] LINE通知失敗:', e);
    }
  })();

  revalidatePath('/admin/approvals');
  return { success: true };
}

export async function rejectProfileImageRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const supabase = createServiceClient();

  const { data: request, error: fetchError } = await supabase
    .from('cast_profile_image_requests')
    .select('cast_id, casts(stage_name)')
    .eq('id', id)
    .single();

  if (fetchError || !request) {
    return { success: false, error: fetchError?.message ?? 'Request not found' };
  }

  const { error } = await supabase
    .from('cast_profile_image_requests')
    .update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  // キャスト個人へのLINE通知（fire-and-forget — 承認速度に影響しない）
  const castId = request.cast_id;
  const reqCasts = request.casts as { stage_name: string | null } | { stage_name: string | null }[] | null;
  const castName = Array.isArray(reqCasts) ? (reqCasts[0]?.stage_name ?? '') : (reqCasts?.stage_name ?? '');

  void (async () => {
    try {
      const { data: privateInfo } = await supabase
        .from('cast_private_info')
        .select('line_user_id')
        .eq('cast_id', castId)
        .single();
      await notifyCastProfileImageRejected({
        castName,
        lineUserId: privateInfo?.line_user_id ?? null,
      });
    } catch (e) {
      console.warn('[rejectProfileImageRequest] LINE通知失敗:', e);
    }
  })();

  revalidatePath('/admin/approvals');
  return { success: true };
}
