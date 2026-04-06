'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 承認待ち（または全ステータス）のシフト提出一覧を取得する
 * @param status 'pending' | 'approved' | 'rejected' | 'all'
 */
export async function getShiftSubmissions(status: string = 'pending') {
  const supabase = await createClient();

  let query = supabase
    .from('shift_submissions')
    .select(`
      *,
      casts:cast_id (
        stage_name,
        slug
      )
    `)
    .order('submitted_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  
  return { data, error: null };
}

/**
 * 提出されたシフトを承認（Approve）し、本番の cast_schedules へ反映する
 */
export async function approveShiftSubmission(submissionId: string) {
  const supabase = await createClient();

  // 1. 対象の提出データを取得
  const { data: submission, error: fetchError } = await supabase
    .from('shift_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (fetchError || !submission) {
    return { success: false, error: '提出データが見つかりません' };
  }

  // 2. JSONから出勤データを展開
  const shiftsData = submission.shifts_data as Record<string, { type: string, start?: string, end?: string }>;
  
  // 対象週の既存シフト（cast_schedules）を一度削除（上書きするため）
  const dates = Object.keys(shiftsData);
  if (dates.length > 0) {
    await supabase
      .from('cast_schedules')
      .delete()
      .eq('cast_id', submission.cast_id)
      .in('work_date', dates);
  }

  // 3. 本番テーブル（cast_schedules）へINSERT
  const insertData = [];
  for (const [dateStr, shift] of Object.entries(shiftsData)) {
    if (shift.type === 'work') {
      insertData.push({
        cast_id: submission.cast_id,
        work_date: dateStr,
        start_time: shift.start || '21:00',
        end_time: shift.end === 'LAST' ? null : (shift.end || null),
      });
    }
  }

  if (insertData.length > 0) {
    const { error: insertError } = await supabase
      .from('cast_schedules')
      .insert(insertData);
      
    if (insertError) {
      console.error('Approve Insert Error:', insertError);
      return { success: false, error: '本番シフトへの反映に失敗しました' };
    }
  }

  // 4. ステータスを 'approved' に更新
  const { error: updateError } = await supabase
    .from('shift_submissions')
    .update({ status: 'approved' })
    .eq('id', submissionId);

  if (updateError) {
    return { success: false, error: 'ステータスの更新に失敗しました' };
  }

  revalidatePath('/admin/shift-requests');
  revalidatePath('/admin/shifts');
  revalidatePath('/shift');
  revalidatePath('/');
  
  return { success: true };
}

/**
 * 提出を却下（Reject）または取消する
 */
export async function rejectShiftSubmission(submissionId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('shift_submissions')
    .update({ status: 'rejected' })
    .eq('id', submissionId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/shift-requests');
  return { success: true };
}

/**
 * 全アクティブキャストの、指定週のシフト提出ステータス一覧を取得する
 */
export async function getAllCastShiftStatuses(targetWeekMonday: string) {
  const supabase = await createClient();

  // 1. 全アクティブキャストを取得 (auth_user_idが紐付いているキャストのみ対象とするか、全員とするか)
  // 今回は全アクティブキャストを取得し、authのメールアドレスも取得する
  const { data: casts, error: castsError } = await supabase
    .from('casts')
    .select('id, stage_name, auth_user_id')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (castsError || !casts) return { data: [], error: castsError?.message || 'Failed to fetch casts' };

  // auth_user_id のリスト
  // Auth ユーザー情報を取得 (メールアドレスなど) -> サーバー側でのみ可能
  // (admin auth apiが必要だが、ここでは簡略化のため profiles や直接 email の取得を試みる)
  // Auth API は service_role_key 等が必要になるため、ここではメール送信はAPIエンドポイントまたは別の手段を取る前提とする。
  // 一旦、送信先は "キャストの初期登録メアド" とする。

  // 2. 指定週の提出状況を取得
  const { data: submissions, error: subError } = await supabase
    .from('shift_submissions')
    .select('cast_id, status, submitted_at, shifts_data')
    .eq('target_week_monday', targetWeekMonday);

  if (subError) return { data: [], error: subError.message };

  // 3. マージ
  const result = casts.map(cast => {
    const sub = submissions?.find(s => s.cast_id === cast.id);
    return {
      cast,
      hasAuthIndex: !!cast.auth_user_id, // アカウント登録済みか
      status: sub ? sub.status : 'unsubmitted', // pending, approved, rejected, unsubmitted
      submittedAt: sub ? sub.submitted_at : null,
      shiftsData: sub ? sub.shifts_data : null,
    };
  });

  return { data: result, error: null };
}

/**
 * キャスト（auth_user_idあり）に対して次回シフトの自動督促メールを送信
 * メモ: Supabase Admin API等を使用してAuthユーザーのEmailを取得しResendで送る想定
 */
export async function sendShiftRemindEmail(castId: string, _authUserId: string, stageName: string) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Resend API key missing' };
  
  const supabase = await createClient();
  // Service Role Keyがなくても、現在ログイン中の管理者は supabase.auth.admin の権限がないと他人のメアドは取れない
  const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(_authUserId);
  
  if (authError || !user?.email) {
    // 取得できない場合はログのみ
    return { success: false, error: 'User email not found or permission denied. Note: Requires service_role.' };
  }

  const email = user.email;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Animo Notification <onboarding@resend.dev>',
    to: email,
    subject: `【重要】${stageName}様 来週のシフト提出のお願い`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>シフト提出期限が近づいています</h2>
        <p>${stageName}様</p>
        <p>来週のシフト提出期限（金曜 23:55）が近づいております、または超過しています。<br>未提出の場合は罰金対象となりますので、至急以下のURLよりご提出をお願いいたします。</p>
        <div style="margin-top: 24px;">
          <a href="https://club-animo.com/cast/shift" style="background-color: #171717; color: #fff; padding: 12px 28px; text-decoration: none;">
            シフトの提出はこちら
          </a>
        </div>
      </div>
    `,
  });

  return { success: true };
}
