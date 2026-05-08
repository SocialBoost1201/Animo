'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * キャスト本人が趣味・AI診断タグ・一言コメントの変更を申請する
 */
export async function requestProfileTextChange(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません。再度ログインしてください。' };

  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (castError || !cast) return { error: 'キャスト情報が見つかりません。' };

  const hobby   = (formData.get('hobby')   as string | null)?.trim() || null;
  const comment = (formData.get('comment') as string | null)?.trim() || null;
  const quiz_tags = (formData.getAll('quiz_tags') as string[]).filter(Boolean);

  if (!hobby && !comment && quiz_tags.length === 0) {
    return { error: '変更内容を1つ以上入力してください。' };
  }

  const { error: insertError } = await supabase
    .from('cast_profile_text_requests')
    .insert({
      cast_id:   cast.id,
      hobby:     hobby,
      comment:   comment,
      quiz_tags: quiz_tags.length > 0 ? quiz_tags : null,
      status:    'pending',
    });

  if (insertError) {
    console.error('[requestProfileTextChange]', insertError);
    return { error: '申請の送信に失敗しました。時間をおいて再試行してください。' };
  }

  revalidatePath('/cast/profile/edit');
  return { success: true };
}
