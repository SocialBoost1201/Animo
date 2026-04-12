'use server';

import { normalizeRealNameForIdentityMatch } from '@/lib/validators/cast-profile';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const PRODUCTION_AUTH_BASE_URL = 'https://club-animo.jp';

function resolveAuthBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      const isLocal =
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname.endsWith('.local');

      if (isLocal) continue;
      return url.origin;
    } catch {
      // ignore invalid env value and continue to next candidate
    }
  }

  return PRODUCTION_AUTH_BASE_URL;
}

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
  const lastName = (formData.get('lastName') as string)?.trim();
  const firstName = (formData.get('firstName') as string)?.trim();
  const stageName = (formData.get('stageName') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const legacyRealName = (formData.get('realName') as string)?.trim();
  const dateOfBirth = (formData.get('dateOfBirth') as string)?.trim();
  const realName = legacyRealName || `${lastName ?? ''}${firstName ?? ''}`.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.replace(/\D/g, '');
  const normalizedStageName = stageName?.replace(/\s+/g, '').toLowerCase();

  if (!normalizedEmail || !password || !confirmPassword || !realName || !phone) {
    return { success: false, error: 'すべての項目を入力してください。' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'パスワードが一致しません。' };
  }
  if (password.length < 8) {
    return { success: false, error: 'パスワードは8文字以上にしてください。' };
  }

  const supabase = await createClient();
  const serviceRoleClient = createServiceClient();
  const authBaseUrl = resolveAuthBaseUrl();
  const normalizedRealName = normalizeRealNameForIdentityMatch(realName);

  try {
    // Figma準拠の登録画面入力でキャスト本人を特定する。
    const { data: privateInfoCandidates, error: privateInfoError } = await serviceRoleClient
      .from('cast_private_info')
      .select('cast_id, real_name, date_of_birth, phone, email, casts!inner(id, stage_name, auth_user_id)')
      .limit(500);

    if (privateInfoError) {
      return {
        success: false,
        error: '本人確認情報の照合に失敗しました。時間をおいて再度お試しください。',
        code: 'MATCH_LOOKUP_FAILED',
      };
    }

    const matchedCandidates = (privateInfoCandidates ?? []).filter((candidate) => {
      const candidatePhone = (candidate.phone ?? '').replace(/\D/g, '');
      const candidateEmail = (candidate.email ?? '').trim().toLowerCase();
      const candidateStageName = (((candidate.casts as unknown as { stage_name?: string } | null)?.stage_name) ?? '')
        .replace(/\s+/g, '')
        .toLowerCase();

      const isSameRealName =
        normalizeRealNameForIdentityMatch(candidate.real_name ?? '') === normalizedRealName;
      const isSamePhone = Boolean(normalizedPhone) && candidatePhone === normalizedPhone;
      const isSameEmail = candidateEmail ? candidateEmail === normalizedEmail : true;
      const isSameStageName = normalizedStageName ? candidateStageName === normalizedStageName : true;
      const isSameBirthDate = dateOfBirth ? candidate.date_of_birth === dateOfBirth : true;

      return isSameRealName && isSamePhone && isSameEmail && isSameStageName && isSameBirthDate;
    });

    if (matchedCandidates.length > 1) {
      return {
        success: false,
        error: '同一の本人確認情報に一致するキャストが複数見つかりました。担当者にお問い合わせください。',
        code: 'MULTIPLE_MATCHES',
      };
    }

    const privateInfo = matchedCandidates[0];

    if (!privateInfo) {
      return {
        success: false,
        error: '入力された情報に一致するキャスト情報が見つかりませんでした。正しく入力されているか、または担当者にお問い合わせください。',
        code: 'NO_MATCH',
      };
    }

    const castRecord = privateInfo.casts as unknown as {
      id: string;
      stage_name: string;
      auth_user_id: string | null;
    };

    if (castRecord.auth_user_id) {
      return {
        success: false,
        error: 'このキャストのアカウントはすでに登録済みです。担当者にお問い合わせください。',
        code: 'ALREADY_REGISTERED',
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${authBaseUrl}/cast/verify-email`,
      },
    });

    let authUser = data.user;
    let usedAuthFallback = false;

    if (error) {
      const normalizedErrorMessage = error.message.toLowerCase();
      const shouldBypassEmailDelivery =
        normalizedErrorMessage.includes('email rate limit exceeded') ||
        normalizedErrorMessage.includes('error sending confirmation email');

      if (shouldBypassEmailDelivery) {
        usedAuthFallback = true;

        const { data: fallbackData, error: fallbackError } =
          await serviceRoleClient.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
          });

        if (fallbackError) {
          const fallbackMessage = fallbackError.message.toLowerCase();
          const duplicateUserError =
            fallbackMessage.includes('already been registered') ||
            fallbackMessage.includes('already registered') ||
            fallbackMessage.includes('already exists');

          if (!duplicateUserError) {
            return {
              success: false,
              error: `アカウント作成に失敗しました: ${fallbackError.message}`,
              code: 'AUTH_SIGNUP_FAILED',
            };
          }

          const { data: usersData, error: usersError } = await serviceRoleClient.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
          });

          if (usersError) {
            return {
              success: false,
              error: `アカウント作成に失敗しました: ${usersError.message}`,
              code: 'AUTH_SIGNUP_FAILED',
            };
          }

          const existingUser = usersData.users.find((user) => user.email?.toLowerCase() === normalizedEmail);

          if (!existingUser) {
            return {
              success: false,
              error: `アカウント作成に失敗しました: ${fallbackError.message}`,
              code: 'AUTH_SIGNUP_FAILED',
            };
          }

          const { data: updatedUserData, error: updateUserError } =
            await serviceRoleClient.auth.admin.updateUserById(existingUser.id, {
              password,
              email_confirm: true,
            });

          if (updateUserError) {
            return {
              success: false,
              error: `アカウント作成に失敗しました: ${updateUserError.message}`,
              code: 'AUTH_SIGNUP_FAILED',
            };
          }

          authUser = updatedUserData.user;
        } else {
          authUser = fallbackData.user;
        }
      } else {
        return {
          success: false,
          error: `アカウント作成に失敗しました: ${error.message}`,
          code: 'AUTH_SIGNUP_FAILED',
        };
      }
    }

    if (!authUser) {
      return {
        success: false,
        error: 'アカウント作成の応答が不正でした。時間をおいて再度お試しください。',
        code: 'AUTH_USER_MISSING',
      };
    }

    const { error: roleError } = await serviceRoleClient.from('user_roles').insert({
      user_id: authUser.id,
      role: 'cast',
    });

    if (roleError && roleError.code !== '23505') {
      return {
        success: false,
        error: 'アカウント作成後の権限付与に失敗しました。担当者にお問い合わせください。',
        code: 'ROLE_INSERT_FAILED',
      };
    }

    const { error: castUpdateError } = await serviceRoleClient
      .from('casts')
      .update({ auth_user_id: authUser.id })
      .eq('id', castRecord.id)
      .is('auth_user_id', null);

    if (castUpdateError) {
      return {
        success: false,
        error: 'アカウント作成後のキャスト紐付けに失敗しました。担当者にお問い合わせください。',
        code: 'CAST_LINK_FAILED',
      };
    }

    revalidatePath('/cast/register');

    return {
      success: true,
      message: usedAuthFallback
        ? 'アカウントを登録しました。確認メール送信に失敗したため、このままログインできます。'
        : 'アカウントを登録しました。確認メールをご確認の上、認証後にログインしてください。',
      code: 'SUCCESS',
    };
  } catch {
    return {
      success: false,
      error: '想定外のエラーが発生しました。時間をおいて再度お試しください。',
      code: 'UNEXPECTED',
    };
  }
}


/**
 * パスワード再設定メール送信
 */
export async function castForgotPassword(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const resetRedirectUrl = `${PRODUCTION_AUTH_BASE_URL}/cast/reset-password`;

  if (!email) {
    return { success: false, error: 'メールアドレスを入力してください。' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetRedirectUrl,
  });

  if (error) {
    const normalizedErrorMessage = error.message.toLowerCase();

    if (normalizedErrorMessage.includes('redirect url') && normalizedErrorMessage.includes('not allowed')) {
      return {
        success: false,
        error: '再設定リンクURLが許可されていません。認証設定（URL Configuration）をご確認ください。',
      };
    }

    if (
      normalizedErrorMessage.includes('error sending recovery email') ||
      normalizedErrorMessage.includes('failed to send message') ||
      normalizedErrorMessage.includes('smtp')
    ) {
      return {
        success: false,
        error:
          '再設定メールの送信に失敗しました。SMTP設定（Sender / Host / Port / Username / Password）をご確認ください。',
      };
    }

    if (normalizedErrorMessage.includes('rate limit')) {
      return {
        success: false,
        error: '短時間での送信回数が上限に達しました。しばらく待ってから再度お試しください。',
      };
    }

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
