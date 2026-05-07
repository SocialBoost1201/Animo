'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
    .select('cast_id, image_url')
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

  const { error } = await supabase
    .from('cast_profile_image_requests')
    .update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/approvals');
  return { success: true };
}
