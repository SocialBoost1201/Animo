'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  notifyCastProfileImageApproved,
  notifyCastProfileImageRejected,
} from '@/lib/notifications/cast-notifier';
import { logAdminAction } from '@/lib/audit/admin-audit';

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
    .select('cast_id, image_url, casts(stage_name, slug)')
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

  // キャスト個人への Web Push 通知（fire-and-forget）
  const castId = request.cast_id;
  const reqCasts = request.casts as { stage_name: string | null; slug: string | null } | { stage_name: string | null; slug: string | null }[] | null;
  const castInfo = Array.isArray(reqCasts) ? reqCasts[0] : reqCasts;
  const castName = castInfo?.stage_name ?? '';
  const castSlug = castInfo?.slug ?? '';

  void (async () => {
    try {
      const { data: castRow } = await supabase
        .from('casts')
        .select('auth_user_id')
        .eq('id', castId)
        .single();
      await notifyCastProfileImageApproved({
        castName,
        castAuthUserId: castRow?.auth_user_id ?? null,
      });
    } catch (e) {
      console.warn('[approveProfileImageRequest] Push通知失敗:', e);
    }
  })();

  // 承認後の公開反映: トップ・キャスト一覧・個別ページのキャッシュを破棄
  revalidatePath('/admin/approvals');
  revalidatePath('/');
  revalidatePath('/cast');
  if (castSlug) revalidatePath(`/cast/${castSlug}`);

  await logAdminAction({
    actorUserId: user.id,
    action: 'approve',
    targetType: 'cast_profile_image_request',
    targetId: id,
    afterData: { image_url: request.image_url },
    metadata: { cast_id: castId, cast_slug: castSlug || null },
  });

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

  // キャスト個人への Web Push 通知（fire-and-forget）
  const castId = request.cast_id;
  const reqCasts = request.casts as { stage_name: string | null } | { stage_name: string | null }[] | null;
  const castName = Array.isArray(reqCasts) ? (reqCasts[0]?.stage_name ?? '') : (reqCasts?.stage_name ?? '');

  void (async () => {
    try {
      const { data: castRow } = await supabase
        .from('casts')
        .select('auth_user_id')
        .eq('id', castId)
        .single();
      await notifyCastProfileImageRejected({
        castName,
        castAuthUserId: castRow?.auth_user_id ?? null,
      });
    } catch (e) {
      console.warn('[rejectProfileImageRequest] Push通知失敗:', e);
    }
  })();

  revalidatePath('/admin/approvals');

  await logAdminAction({
    actorUserId: user.id,
    action: 'reject',
    targetType: 'cast_profile_image_request',
    targetId: id,
    metadata: { cast_id: castId },
  });

  return { success: true };
}
