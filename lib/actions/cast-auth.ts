'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * キャストログイン
 */
export async function castLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'メールアドレスとパスワードを入力してください。' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: 'ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。' };
  }

  redirect('/cast/dashboard');
}

/**
 * キャスト新規登録
 */
export async function castRegister(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const realName = (formData.get('realName') as string)?.trim();
  const dateOfBirth = formData.get('dateOfBirth') as string;

  if (!email || !password || !realName || !dateOfBirth) {
    return { success: false, error: 'すべての項目を入力してください。' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'パスワードが一致しません。' };
  }
  if (password.length < 8) {
    return { success: false, error: 'パスワードは8文字以上にしてください。' };
  }

  const supabase = await createClient();

  // 本名 + 生年月日の完全一致でキャストを特定
  const { data: privateInfo } = await supabase
    .from('cast_private_info')
    .select('cast_id, casts!inner(id, stage_name, auth_user_id)')
    .eq('real_name', realName)
    .eq('date_of_birth', dateOfBirth)
    .maybeSingle();

  if (!privateInfo) {
    return {
      success: false,
      error: '入力された本名・生年月日に一致するキャスト情報が見つかりませんでした。正しく入力されているか、または担当者にお問い合わせください。',
    };
  }

  // TypeScriptの型安全のためにキャスト
  const castRecord = privateInfo.casts as unknown as { id: string; stage_name: string; auth_user_id: string | null };

  if (castRecord.auth_user_id) {
    return {
      success: false,
      error: 'このキャストのアカウントはすでに登録済みです。担当者にお問い合わせください。',
    };
  }

  // Supabase Auth にアカウント登録
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animo-lake.vercel.app';
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/cast/reset-password`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    // RLSをバイパスするため、ここからサービスロールを使用（サインアップ直後はまだログイン状態ではないため）
    const { createServiceClient } = await import('@/lib/supabase/service');
    const serviceRoleClient = createServiceClient();

    // user_roles に cast ロールを追加
    await serviceRoleClient.from('user_roles').insert({
      user_id: data.user.id,
      role: 'cast',
    });

    // casts テーブルの auth_user_id を自動紐付け
    await serviceRoleClient
      .from('casts')
      .update({ auth_user_id: data.user.id })
      .eq('id', castRecord.id);
  }

  return {
    success: true,
    message: `アカウントを登録しました。確認メールをご確認の上、ログインしてください。`,
  };
}


/**
 * パスワード再設定メール送信
 */
export async function castForgotPassword(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'メールアドレスを入力してください。' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://animo-lake.vercel.app'}/cast/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: 'パスワード再設定のメールを送信しました。' };
}

/**
 * キャストログアウト
 */
export async function castLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/cast/login');
}

/**
 * 現在ログイン中のキャスト情報を取得
 */
export async function getCurrentCast() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // auth_user_id でキャスト情報を取得
  const { data: cast } = await supabase
    .from('casts')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return cast;
}

/**
 * キャスト本人の投稿一覧取得（全ステータス）
 */
export async function getMyCastPosts(castId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cast_posts')
    .select('*')
    .eq('cast_id', castId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
