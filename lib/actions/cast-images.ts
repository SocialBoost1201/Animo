'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { notifyProfileImageChangeRequested } from '@/lib/notifications/admin-notifier';

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

/**
 * キャスト本人がプロフィール画像の変更を申請する
 * 画像を Storage にアップロードし cast_profile_image_requests にレコードを作成する
 */
export async function requestProfileImageChange(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証されていません。再度ログインしてください。' }

  // キャスト情報取得
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select('id, stage_name, name')
    .eq('auth_user_id', user.id)
    .single()

  if (castError || !cast) return { error: 'キャスト情報が見つかりません。' }

  const file = formData.get('image') as File | null
  if (!file || !file.size) return { error: '画像ファイルを選択してください。' }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { error: '対応していないファイル形式です。JPEG / PNG / WebP / GIF のみ使用できます。' }
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE_BYTES) {
    return { error: 'ファイルサイズが大きすぎます。5MB 以下の画像を選択してください。' }
  }

  // Storage へアップロード（cast-profile-requests バケット or images バケット内のサブパス）
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `cast-profile-requests/${cast.id}/${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, new Uint8Array(arrayBuffer), {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('[requestProfileImageChange] アップロードエラー:', uploadError)
    return { error: '画像のアップロードに失敗しました。' }
  }

  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

  // DB に申請レコード保存
  const { error: dbError } = await supabase
    .from('cast_profile_image_requests')
    .insert({
      cast_id: cast.id,
      image_url: publicUrl,
      status: 'pending',
    })

  if (dbError) {
    console.error('[requestProfileImageChange] DB エラー:', dbError)
    return { error: '申請データの保存に失敗しました。' }
  }

  // 通知（non-critical）
  try {
    const castName = cast.stage_name || cast.name || '不明'
    await notifyProfileImageChangeRequested({ castName, castId: cast.id })
  } catch (notifyErr) {
    console.warn('[AdminNotifier] 画像申請通知失敗 (non-critical):', notifyErr)
  }

  revalidatePath('/cast/profile')
  revalidatePath('/cast/profile/edit')
  return { success: true }
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
