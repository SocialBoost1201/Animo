'use server';

import { cookies } from 'next/headers';
import {
  CAST_REAUTH_COOKIE_NAME,
  CAST_REAUTH_WINDOW_DAYS,
  CAST_REAUTH_WINDOW_MS,
} from '@/lib/cast-auth-utils';
import {
  normalizeJapanesePhone,
  formatJapaneseMobilePhone,
  isValidJapaneseMobilePhone,
  toE164JapanesePhone,
} from '@/lib/utils/phone';
import { normalizeRealNameForIdentityMatch } from '@/lib/validators/cast-profile';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function findCastIdentityByPhone(serviceRoleClient: ReturnType<typeof createServiceClient>, normalizedPhone: string) {
  // DBには数字のみ形式・ハイフン付き形式・E.164形式が混在している可能性があるため全形式で検索
  const formattedPhone = formatJapaneseMobilePhone(normalizedPhone);
  const e164Phone = `+81${normalizedPhone.slice(1)}`;  // +817012343590
  const e164NoPlus = `81${normalizedPhone.slice(1)}`;  // 817012343590
  const phonesToSearch = Array.from(new Set([normalizedPhone, formattedPhone, e164Phone, e164NoPlus]));

  const { data, error } = await serviceRoleClient
    .from('cast_private_info')
    .select('cast_id, real_name, date_of_birth, phone, email, line_id, casts!inner(id, stage_name, name_kana, auth_user_id, last_sms_verified_at)')
    .in('phone', phonesToSearch)
    .limit(5);

  return {
    data: (data ?? []) as CastIdentityCandidate[],
    error,
  };
}

type CastIdentityCandidate = {
  cast_id: string;
  real_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  email?: string | null;
  line_id?: string | null;
  casts: {
    id: string;
    stage_name: string | null;
    name_kana: string | null;
    auth_user_id: string | null;
    last_sms_verified_at: string | null;
  } | {
    id: string;
    stage_name: string | null;
    name_kana: string | null;
    auth_user_id: string | null;
    last_sms_verified_at: string | null;
  }[] | null;
};

function getCastRecord(candidate: CastIdentityCandidate) {
  const raw = Array.isArray(candidate.casts) ? candidate.casts[0] : candidate.casts;
  return raw
    ? {
        id: raw.id,
        stage_name: raw.stage_name ?? '',
        name_kana: raw.name_kana ?? '',
        auth_user_id: raw.auth_user_id,
        last_sms_verified_at: raw.last_sms_verified_at,
      }
    : null;
}

async function setCastReauthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(CAST_REAUTH_COOKIE_NAME, String(Date.now() + CAST_REAUTH_WINDOW_MS), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(CAST_REAUTH_WINDOW_MS / 1000),
  });
}

async function clearCastReauthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CAST_REAUTH_COOKIE_NAME);
}



/**
 * キャストログイン用 SMS 送信
 */
export async function castSendLoginOtp(formData: FormData) {
  const phone = String(formData.get('phone') ?? '');
  const normalizedPhone = normalizeJapanesePhone(phone);

  if (!isValidJapaneseMobilePhone(normalizedPhone)) {
    return { success: false, error: '携帯番号は09012345678のように11桁で入力してください。' };
  }

  const authPhone = toE164JapanesePhone(normalizedPhone);

  const serviceRoleClient = createServiceClient();
  const { data: candidates, error: lookupError } = await findCastIdentityByPhone(serviceRoleClient, normalizedPhone);

  if (lookupError) {
    return { success: false, error: '本人確認情報の照合に失敗しました。時間をおいて再度お試しください。' };
  }

  const [candidate] = candidates;
  const castRecord = candidate ? getCastRecord(candidate) : null;

  if (!candidate || !castRecord) {
    return {
      success: false,
      error: 'この電話番号は事前登録されていません。店舗スタッフに確認してください。',
    };
  }

  if (candidates.length > 1) {
    return {
      success: false,
      error: '同一電話番号に複数のキャスト情報が見つかりました。担当者にお問い合わせください。',
    };
  }

  if (!castRecord.auth_user_id) {
    return {
      success: false,
      code: 'NEEDS_REGISTER' as const,
      error: 'この電話番号はまだ登録が完了していません。新規登録を行ってください。',
      redirectTo: '/cast/register' as const,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && user.id === castRecord.auth_user_id) {
    const cookieStore = await cookies();
    const reauthCookie = cookieStore.get(CAST_REAUTH_COOKIE_NAME)?.value;
    const isValidCookie = reauthCookie && parseInt(reauthCookie, 10) > Date.now();

    const lastVerifiedRaw = castRecord.last_sms_verified_at;
    const daysSince = lastVerifiedRaw
      ? (Date.now() - new Date(lastVerifiedRaw).getTime()) / 86_400_000
      : Infinity;

    const hasCompletedSmsVerification = Boolean(lastVerifiedRaw);
    const isValidSession =
      Boolean(castRecord.auth_user_id) &&
      hasCompletedSmsVerification &&
      Boolean(isValidCookie) &&
      daysSince < CAST_REAUTH_WINDOW_DAYS;

    if (isValidSession) {
      return {
        success: true,
        message: '既存のセッションでログインしました。',
        normalizedPhone,
        skippedSms: true,
      };
    }
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: authPhone,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { success: false, error: 'SMS送信に失敗しました。電話番号を確認してください。' };
  }

  return {
    success: true,
    message: 'SMS認証コードを送信しました。',
    normalizedPhone,
  };
}

/**
 * キャストログイン用 SMS 検証
 */
export async function castVerifyLoginOtp(formData: FormData) {
  const phone = String(formData.get('phone') ?? '');
  const otp = String(formData.get('otp') ?? '').trim();
  const normalizedPhone = normalizeJapanesePhone(phone);

  if (!isValidJapaneseMobilePhone(normalizedPhone)) {
    return { success: false, error: '携帯番号は09012345678のように11桁で入力してください。' };
  }

  const authPhone = toE164JapanesePhone(normalizedPhone);

  if (!/^\d{6}$/.test(otp)) {
    return { success: false, error: '認証コードは6桁で入力してください。' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone: authPhone,
    token: otp,
    type: 'sms',
  });

  if (error) {
    return { success: false, error: '認証コードが正しくないか、有効期限が切れています。' };
  }

  const authUserId = data.user?.id;
  const now = new Date().toISOString();

  if (!authUserId) {
    return { success: false, error: 'ログイン情報の取得に失敗しました。再度お試しください。' };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { last_sms_verified_at: now },
  });

  if (metadataError) {
    return { success: false, error: '認証状態の更新に失敗しました。再度お試しください。' };
  }

  const serviceRoleClient = createServiceClient();
  const { data: candidates, error: lookupError } = await findCastIdentityByPhone(
    serviceRoleClient,
    normalizedPhone
  );

  if (lookupError) {
    return { success: false, error: 'キャスト情報の同期に失敗しました。時間をおいて再度お試しください。' };
  }

  const [candidate] = candidates;
  const castRecord = candidate ? getCastRecord(candidate) : null;

  if (!candidate || !castRecord) {
    return { success: false, error: 'キャスト情報との紐付けに失敗しました。担当者にお問い合わせください。' };
  }

  if (candidates.length > 1) {
    return {
      success: false,
      error: '同一電話番号に複数のキャスト情報が見つかりました。担当者にお問い合わせください。',
    };
  }

  if (castRecord.auth_user_id && castRecord.auth_user_id !== authUserId) {
    return {
      success: false,
      error: 'キャスト情報の紐付け状態が不正です。担当者にお問い合わせください。',
    };
  }

  const { error: castUpdateError } = await serviceRoleClient
    .from('casts')
    .update({
      auth_user_id: authUserId,
      last_sms_verified_at: now,
      last_login_at: now,
    })
    .eq('id', castRecord.id);

  if (castUpdateError) {
    return { success: false, error: 'キャスト情報の更新に失敗しました。時間をおいて再度お試しください。' };
  }

  const { data: existingRoles, error: roleLookupError } = await serviceRoleClient
    .from('user_roles')
    .select('user_id')
    .eq('user_id', authUserId)
    .limit(1);

  if (roleLookupError) {
    console.error('[castVerifyLoginOtp] user role lookup error', {
      authUserId,
      message: roleLookupError.message,
      details: roleLookupError.details,
      hint: roleLookupError.hint,
      code: roleLookupError.code,
    });
    return { success: false, error: '権限設定の更新に失敗しました。担当者にお問い合わせください。' };
  }

  const roleWrite = existingRoles && existingRoles.length > 0
    ? await serviceRoleClient.from('user_roles').update({ role: 'cast' }).eq('user_id', authUserId)
    : await serviceRoleClient.from('user_roles').insert({ user_id: authUserId, role: 'cast' });

  if (roleWrite.error) {
    console.error('[castVerifyLoginOtp] user role write error', {
      authUserId,
      message: roleWrite.error.message,
      details: roleWrite.error.details,
      hint: roleWrite.error.hint,
      code: roleWrite.error.code,
    });
    return { success: false, error: '権限設定の更新に失敗しました。担当者にお問い合わせください。' };
  }

  await setCastReauthCookie();
  redirect('/cast/dashboard');
}

/**
 * キャスト新規登録
 */
export async function castRegister(formData: FormData) {
  const lastName = (formData.get('lastName') as string)?.trim();
  const firstName = (formData.get('firstName') as string)?.trim();
  const stageName = (formData.get('stageName') as string)?.trim();
  const nameKana = (formData.get('nameKana') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const legacyRealName = (formData.get('realName') as string)?.trim();
  const dateOfBirth = (formData.get('dateOfBirth') as string)?.trim();
  const lineId = (formData.get('lineId') as string)?.trim() || null;
  const realName = legacyRealName || `${lastName ?? ''}${firstName ?? ''}`.trim();
  const normalizedPhone = normalizeJapanesePhone(phone ?? '');
  const normalizedNameKana = (nameKana ?? '').normalize('NFKC').replace(/[\s\u3000]+/g, '').trim();

  if (!realName || !normalizedPhone || !normalizedNameKana) {
    return { success: false, error: 'すべての項目を入力してください。' };
  }
  if (!isValidJapaneseMobilePhone(normalizedPhone)) {
    return { success: false, error: '携帯番号は09012345678のように11桁で入力してください。' };
  }

  const authPhone = toE164JapanesePhone(normalizedPhone);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[castRegister] missing service role env', {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
    return {
      success: false,
      error: '登録設定の読み込みに失敗しました。担当者にお問い合わせください。',
      code: 'UNEXPECTED',
    };
  }

  const serviceRoleClient = createServiceClient();
  const normalizedRealName = normalizeRealNameForIdentityMatch(realName);

  try {
    const { data: privateInfoCandidates, error: privateInfoError } = await findCastIdentityByPhone(
      serviceRoleClient,
      normalizedPhone
    );

    if (privateInfoError) {
      return {
        success: false,
        error: '本人確認情報の照合に失敗しました。時間をおいて再度お試しください。',
        code: 'MATCH_LOOKUP_FAILED',
      };
    }

    const matchedCandidates = (privateInfoCandidates ?? []).filter((candidate) => {
      const candidatePhone = normalizeJapanesePhone(candidate.phone ?? '');
      const candidateNameKana = ((getCastRecord(candidate)?.name_kana) ?? '')
        .normalize('NFKC')
        .replace(/[\s\u3000]+/g, '')
        .trim();

      const isSameRealName =
        normalizeRealNameForIdentityMatch(candidate.real_name ?? '') === normalizedRealName;
      const isSamePhone = Boolean(normalizedPhone) && candidatePhone === normalizedPhone;
      const isSameNameKana = candidateNameKana === normalizedNameKana;

      return isSameRealName && isSamePhone && isSameNameKana;
    });

    if (matchedCandidates.length > 1) {
      return {
        success: false,
        error: '同一の本人確認情報に一致するキャストが複数見つかりました。担当者にお問い合わせください。',
        code: 'MULTIPLE_MATCHES',
      };
    }

    const privateInfo = matchedCandidates[0];
    const castRecord = privateInfo ? getCastRecord(privateInfo) : null;

    if (!privateInfo || !castRecord) {
      return {
        success: false,
        error: '入力された情報に一致するキャスト情報が見つかりませんでした。正しく入力されているか、または担当者にお問い合わせください。',
        code: 'NO_MATCH',
      };
    }

    if (castRecord.auth_user_id) {
      return {
        success: false,
        error: 'この電話番号は既に登録済みです。ログイン画面からSMS認証してください。',
        code: 'ALREADY_REGISTERED',
      };
    }

    const { data, error } = await serviceRoleClient.auth.admin.createUser({
      phone: authPhone,
      phone_confirm: false,
    });

    const authUser = data.user;

    if (error) {
      return {
        success: false,
        error: `アカウント作成に失敗しました: ${error.message}`,
        code: 'AUTH_SIGNUP_FAILED',
      };
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

    // LINE ID が入力された場合は cast_private_info に保存
    if (lineId) {
      await serviceRoleClient
        .from('cast_private_info')
        .update({ line_id: lineId })
        .eq('cast_id', castRecord.id);
    }

    revalidatePath('/cast/register');

    return {
      success: true,
      message: 'アカウントを登録しました。ログイン画面からSMS認証を行ってください。',
      code: 'SUCCESS',
    };
  } catch (error) {
    console.error('[castRegister] unexpected error', {
      realName,
      normalizedPhone,
      stageName,
      dateOfBirth,
      error,
    });
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
export async function castForgotPassword(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  void formData;
  return {
    success: false,
    error: 'キャストログインはSMS認証に変更されました。ログイン画面から電話番号で認証してください。',
  };
}

/**
 * キャストログアウト
 */
export async function castLogout() {
  await clearCastReauthCookie();
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
    .select('*, cast_private_info(real_name)')
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
