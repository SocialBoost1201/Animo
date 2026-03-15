'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

    // 投稿成功後、管理者にメール通知（非同期・失敗しても投稿は通す）
    try {
      await sendCastPostNotification(castId, content);
    } catch (mailErr) {
      console.warn('Mail notification failed (non-critical):', mailErr);
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

/**
 * キャスト投稿時の管理者メール通知（non-critical）
 */
async function sendCastPostNotification(castId: string, content: string) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminEmail = process.env.ADMIN_EMAIL || 'animo4266@gmail.com';
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://club-animo.com'}/admin/posts`;

  await resend.emails.send({
    from: 'Animo Notification <onboarding@resend.dev>',
    to: adminEmail,
    subject: '【承認待ち】キャストから新規投稿があります',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee;">
        <h2 style="color: #B39257; font-size: 16px; border-bottom: 1px solid #B39257; padding-bottom: 8px;">
          キャスト日記 - 新規投稿（承認待ち）
        </h2>
        <p style="font-size: 14px; color: #555; margin: 16px 0;">
          キャストから新しい投稿が届いています。<br>
          管理画面で内容を確認し、公開承認を行ってください。
        </p>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="font-size: 13px; color: #333; margin: 0;">${content.substring(0, 200)}${content.length > 200 ? '...' : ''}</p>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${adminUrl}" style="background-color: #171717; color: #fff; padding: 12px 28px; text-decoration: none; font-size: 13px; display: inline-block;">
            管理画面で確認・承認する
          </a>
        </div>
      </div>
    `,
  });
}
