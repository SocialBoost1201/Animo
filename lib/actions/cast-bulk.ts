'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { revalidatePath } from 'next/cache';

const ALLOWED_ADMIN_ROLES = new Set(['owner', 'manager', 'admin']);

async function getAppRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.role) {
    return profile.role;
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  return userRole?.role ?? null;
}

function revalidateAll() {
  revalidatePath('/admin/human-resources');
  revalidatePath('/cast');
  revalidatePath('/');
}

// 複数件のステータス（is_active, status）を一括更新
export async function bulkUpdateCastsStatus(ids: string[], isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const role = await getAppRole(supabase, user.id);
  if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
    return { error: 'Forbidden' };
  }

  const { error } = await supabase
    .from('casts')
    .update({ is_active: isActive, status: isActive ? 'public' : 'private' })
    .in('id', ids);

  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}

/**
 * 複数件のキャストを一括削除する。
 * 削除前に以下を連動処理する:
 *   A. 各 cast に紐づく auth.users アカウントを ban（ログイン不可）にする
 *   B. cast_images の画像ファイルを Supabase Storage から物理削除する
 */
export async function bulkDeleteCasts(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const role = await getAppRole(supabase, user.id);
  if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
    return { error: 'Forbidden' };
  }

  // ── B. Storage 画像を一括取得して削除 ────────────────────────
  const { data: castImages } = await supabase
    .from('cast_images')
    .select('image_url')
    .in('cast_id', ids);

  if (castImages && castImages.length > 0) {
    const storagePaths = castImages
      .map((img) => {
        const match = img.image_url.match(/\/storage\/v1\/object\/public\/images\/(.+)$/)
        return match ? match[1] : null
      })
      .filter((p): p is string => p !== null);

    if (storagePaths.length > 0) {
      const { error: storageError } = await serviceClient.storage
        .from('images')
        .remove(storagePaths);
      if (storageError) {
        console.error('[bulkDeleteCasts] Storage削除エラー:', storageError.message);
      }
    }
  }

  // ── A. 各キャストの auth.users を一括 ban ────────────────────
  const { data: linkedProfiles } = await serviceClient
    .from('profiles')
    .select('id')
    .in('cast_id', ids);

  if (linkedProfiles && linkedProfiles.length > 0) {
    await Promise.all(
      linkedProfiles.map(async (profile) => {
        const { error: banError } = await serviceClient.auth.admin.updateUserById(
          profile.id,
          { ban_duration: '876000h' }
        );
        if (banError) {
          console.error('[bulkDeleteCasts] auth.users ban エラー:', profile.id, banError.message);
        }
      })
    );
  }

  // ── casts を削除（CASCADE で関連テーブルも自動削除）──────────
  const { error } = await supabase
    .from('casts')
    .delete()
    .in('id', ids);

  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}
