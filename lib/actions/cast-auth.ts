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
  const stageName = (formData.get('stageName') as string)?.trim();

  if (!email || !password || !stageName) {
    return { success: false, error: 'すべての項目を入力してください。' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'パスワードが一致しません。' };
  }
  if (password.length < 8) {
    return { success: false, error: 'パスワードは8文字以上にしてください。' };
  }

  const supabase = await createClient();

  // 源氏名と一致するキャストを事前に確認
  const { data: existingCast } = await supabase
    .from('casts')
    .select('id, stage_name, auth_user_id')
    .eq('stage_name', stageName)
    .maybeSingle();

  if (!existingCast) {
    return {
      success: false,
      error: `「${stageName}」に一致するキャスト情報が見つかりませんでした。源氏名をご確認いただくか、管理者にお問い合わせください。`,
    };
  }

  if (existingCast.auth_user_id) {
    return {
      success: false,
      error: 'このキャスト名はすでに登録済みです。ご不明な場合は管理者にお問い合わせください。',
    };
  }

  // Supabase Auth に登録
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    // user_roles に cast ロールを追加
    await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role: 'cast',
    });

    // casts テーブルの auth_user_id を自動紐付け
    await supabase
      .from('casts')
      .update({ auth_user_id: data.user.id })
      .eq('id', existingCast.id);
  }

  return {
    success: true,
    message: `「${stageName}」として登録しました。確認メールをご確認の上、ログインしてください。`,
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
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://club-animo.com'}/cast/login`,
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
