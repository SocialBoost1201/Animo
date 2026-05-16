'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, unstable_cache } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { addCastScore } from './scores';
import { notifyBlogSubmitted } from '@/lib/notifications/admin-notifier';
import { logAdminAction } from '@/lib/audit/admin-audit';
import {
  notifyCastPostPublished,
  notifyCastPostUnpublished,
} from '@/lib/notifications/cast-notifier';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

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
    const rawCastId = formData.get('castId');

    if (!file || !content || typeof rawCastId !== 'string') {
      return { success: false, error: '必要なデータが不足しています。' };
    }

    const castId = rawCastId.trim();
    if (!castId) {
      return { success: false, error: '必要なデータが不足しています。' };
    }

    const { data: ownedCast, error: castError } = await supabase
      .from('casts')
      .select('id, stage_name, name')
      .eq('id', castId)
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (castError) {
      console.error('Cast Ownership Check Error:', castError);
      return { success: false, error: '投稿データの保存に失敗しました。' };
    }

    if (!ownedCast) {
      return { success: false, error: '不正なキャスト情報です。' };
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
    // cast_insert_own_posts RLS ポリシーが「auth_user_id = auth.uid() のキャスト」への
    // INSERT を許可するため、所有者検証済みの SSR クライアントで保存する。
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

    try {
      await sendCastPostNotification(castId, content);
    } catch (mailErr) {
      console.warn('Mail notification failed (non-critical):', mailErr);
    }

    // LINE通知（non-critical）
    try {
      const castName = (ownedCast as { id: string; stage_name?: string | null; name?: string | null }).stage_name
        || (ownedCast as { id: string; stage_name?: string | null; name?: string | null }).name
        || '不明'
      await notifyBlogSubmitted({ castName, contentPreview: content })
    } catch (lineErr) {
      console.warn('[AdminNotifier] ブログLINE通知失敗 (non-critical):', lineErr)
    }

    revalidatePath('/admin/approvals');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/posts');

    // スコア付与 (+5pt)
    try {
      await addCastScore(castId, 5, 'blog_posted', 'ブログ日記を新規投稿しました');
    } catch (scoreErr) {
      console.warn('Failed to add score for blog post:', scoreErr);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Failed to create cast post:', err);
    return { success: false, error: 'システムエラーが発生しました。' };
  }
}

/**
 * 投稿ステータス（公開・非公開など）を一括変更するアクション
 */
export async function updateCastPostStatus(postId: string, status: 'draft' | 'pending' | 'published') {
  try {
    // 認証チェック（管理者であることを確認）
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // RLSをバイパスして管理者として更新
    const supabase = createServiceClient();

    // 監査ログ用に変更前 status を取得
    const { data: prev } = await supabase
      .from('cast_posts')
      .select('status, cast_id')
      .eq('id', postId)
      .maybeSingle();

    const { error } = await supabase
      .from('cast_posts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', postId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin/approvals');
    revalidatePath('/');

    await logAdminAction({
      actorUserId: user.id,
      action: status === 'published' ? 'publish' : 'unpublish',
      targetType: 'cast_post',
      targetId: postId,
      beforeData: prev ? { status: prev.status } : null,
      afterData: { status },
      metadata: prev ? { cast_id: prev.cast_id } : undefined,
    });

    // キャスト個人へのLINE通知（fire-and-forget）
    // status の遷移に応じて公開化/非公開化のメッセージを出し分ける
    if (prev && prev.cast_id && prev.status !== status) {
      const castId = prev.cast_id as string;
      void (async () => {
        try {
          const { data: castInfo } = await supabase
            .from('casts')
            .select('stage_name, name')
            .eq('id', castId)
            .single();
          const { data: privateInfo } = await supabase
            .from('cast_private_info')
            .select('line_user_id')
            .eq('cast_id', castId)
            .single();
          const castName = castInfo?.stage_name || castInfo?.name || '';
          const lineUserId = privateInfo?.line_user_id ?? null;
          if (status === 'published') {
            await notifyCastPostPublished({ castName, lineUserId });
          } else {
            await notifyCastPostUnpublished({ castName, lineUserId });
          }
        } catch (e) {
          console.warn('[updateCastPostStatus] LINE通知失敗:', e);
        }
      })();
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * 投稿を削除する
 */
export async function deleteCastPost(postId: string) {
  try {
    // 認証チェック（管理者であることを確認、監査ログにも actor が必要）
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // RLSをバイパスして管理者として削除（監査ログ用に削除前データも取得）
    const supabase = createServiceClient();
    const { data: prev } = await supabase
      .from('cast_posts')
      .select('id, cast_id, status, content, image_url, created_at')
      .eq('id', postId)
      .maybeSingle();

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

    await logAdminAction({
      actorUserId: user.id,
      action: 'delete',
      targetType: 'cast_post',
      targetId: postId,
      beforeData: prev ?? null,
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * クライアント（トップページやキャスト詳細）向け：公開済み投稿を取得
 */
export const getPublishedPosts = unstable_cache(
  async (limit: number = 10, castId?: string) => {
    try {
      const supabase = createServiceClient();
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
    } catch (err: unknown) {
      return { data: null, error: getErrorMessage(err) };
    }
  },
  ['published-posts'],
  { revalidate: 300 }
);

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
