'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('recruit_applications')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/applications');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
