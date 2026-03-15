'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
// Node.js 標準の crypto.randomUUID() を使用（uuid パッケージ不要）

/**
 * キャスト日記を投稿するアクション
 * 画像(file)とコメント(content)、キャストID(castId)を受け取る
 */
export async function createCastPost(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Auth確認
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const file = formData.get('image') as File | null;
    const content = formData.get('content') as string;
    const castId = formData.get('castId') as string;

    if (!file || !content || !castId) {
      return { success: false, error: '必要なデータが不足しています。' };
    }

    // Storageへのアップロード
    const fileExt = file.name.split('.').pop() || 'webp';
    const fileName = `${castId}/${crypto.randomUUID()}.${fileExt}`;
    
    // ArrayBuffer化
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cast-posts')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { success: false, error: '画像のアップロードに失敗しました。' };
    }

    // Storageから公開URL取得
    const { data: { publicUrl } } = supabase.storage
      .from('cast-posts')
      .getPublicUrl(uploadData.path);

    // データベース (cast_posts) へ保存
    // 初期ステータスは 'pending'
    const { error: dbError } = await supabase
      .from('cast_posts')
      .insert({
        cast_id: castId,
        content: content,
        image_url: publicUrl,
        status: 'pending'
      });

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      return { success: false, error: '投稿データの保存に失敗しました。' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to create cast post:', err);
    return { success: false, error: 'システムエラーが発生しました。' };
  }
}

/**
 * 投稿ステータス（公開・非公開など）を一括変更するアクション
 */
export async function updateCastPostStatus(postId: string, status: 'draft' | 'pending' | 'published') {
  try {
    const supabase = await createClient();
    
    // Role check: (Supabase RLSで担保しているが、エッジアクション側でも念の為)
    
    const { error } = await supabase
      .from('cast_posts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', postId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 投稿を削除する
 */
export async function deleteCastPost(postId: string, imagePath?: string) {
  try {
    const supabase = await createClient();
    
    // DB削除
    const { error } = await supabase
      .from('cast_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      return { success: false, error: error.message };
    }
    
    // Storageから画像削除 (publicUrlからパスを部分一致などで抜き出して削除するのが望ましいが、今回は必要なら実装)

    revalidatePath('/admin/posts');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * クライアント（トップページやキャスト詳細）向け：公開済み投稿を取得
 */
export async function getPublishedPosts(limit: number = 10, castId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('cast_posts')
      .select('*, casts(name, slug, stage_name, image_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (castId) {
      query = query.eq('cast_id', castId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}
