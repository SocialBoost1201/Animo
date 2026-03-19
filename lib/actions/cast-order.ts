'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateCastOrder(orders: { id: string; display_order: number }[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  // Supabaseにはupsertを使って一括更新するか、ループで更新する
  // 今回はデータ数が限られているためループで更新
  for (const { id, display_order } of orders) {
    const { error } = await supabase.from('casts').update({ display_order }).eq('id', id);
    if (error) {
       console.error(error);
       return { error: '並べ替えの保存に失敗しました' };
    }
  }

  revalidatePath('/admin/human-resources');
  revalidatePath('/cast');
  revalidatePath('/');
  return { success: true };
}
