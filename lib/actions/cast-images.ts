'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadCastImages(castId: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const files = formData.getAll('images') as File[];

  if (!files.length) return { error: 'ファイルが選択されていません' };

  const errors: string[] = [];

  // 現在の最大sort_orderを取得
  const { data: existing } = await supabase
    .from('cast_images')
    .select('sort_order')
    .eq('cast_id', castId)
    .order('sort_order', { ascending: false })
    .limit(1);
  let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  // is_primary の既存画像があるか確認
  const { data: primaryCheck } = await supabase
    .from('cast_images')
    .select('id')
    .eq('cast_id', castId)
    .eq('is_primary', true)
    .limit(1);
  const hasPrimary = (primaryCheck?.length ?? 0) > 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.size) continue;
    const ext = file.name.split('.').pop();
    const fileName = `${castId}-${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(`casts/${fileName}`, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      errors.push(file.name);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`casts/${fileName}`);

    await supabase.from('cast_images').insert({
      cast_id: castId,
      image_url: publicUrl,
      image_type: 'profile',
      is_primary: !hasPrimary && i === 0, // 既存プライマリがなければ最初の画像をプライマリに
      sort_order: nextOrder++,
    });
  }

  revalidatePath(`/admin/human-resources/${castId}`);
  revalidatePath('/admin/human-resources');
  revalidatePath('/cast');

  if (errors.length > 0) {
    return { error: `${errors.join(', ')} のアップロードに失敗しました` };
  }
  return { success: true };
}

export async function deleteCastImage(imageId: string, castId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('cast_images').delete().eq('id', imageId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/human-resources/${castId}`);
  revalidatePath('/cast');
  return { success: true };
}

export async function setPrimaryImage(imageId: string, castId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  // 全を非プライマリに
  await supabase.from('cast_images').update({ is_primary: false }).eq('cast_id', castId);
  // 選択画像をプライマリに
  const { error } = await supabase.from('cast_images').update({ is_primary: true }).eq('id', imageId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/human-resources/${castId}`);
  revalidatePath('/cast');
  return { success: true };
}
