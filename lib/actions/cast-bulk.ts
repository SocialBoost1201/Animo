'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function revalidateAll() {
  revalidatePath('/admin/casts');
  revalidatePath('/cast');
  revalidatePath('/');
}

// 複数件のステータス（is_active, status）を一括更新
export async function bulkUpdateCastsStatus(ids: string[], isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('casts')
    .update({ is_active: isActive, status: isActive ? 'public' : 'private' })
    .in('id', ids);

  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}

// 複数件のキャストを一括削除
export async function bulkDeleteCasts(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('casts')
    .delete()
    .in('id', ids);

  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}
