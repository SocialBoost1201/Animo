import 'server-only';

import { sendLineMessage } from '@/lib/line';

// キャスト個人への通知専用モジュール。
// グループ（LINE_GROUP_ID / LINE_NOTIFY_GROUP_ID）には絶対に送信しない。
// line_user_id が null の場合は静かにスキップする。

async function sendToCast(lineUserId: string | null, message: string): Promise<void> {
  if (!lineUserId) return;
  const result = await sendLineMessage(lineUserId, message);
  if (!result.ok && !result.skipped) {
    console.warn('[CastNotifier] 個別LINE通知失敗:', result.reason);
  }
}

/**
 * プロフィール画像変更申請 → 承認通知
 */
export async function notifyCastProfileImageApproved(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  const message = [
    '【プロフィール画像】',
    `${opts.castName} さん、画像変更申請が承認されました。`,
    'プロフィールに新しい画像が反映されています。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * プロフィール画像変更申請 → 却下通知
 */
export async function notifyCastProfileImageRejected(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  const message = [
    '【プロフィール画像】',
    `${opts.castName} さん、画像変更申請が却下されました。`,
    '内容を確認して再度申請してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * プロフィールテキスト変更申請 → 承認通知
 */
export async function notifyCastProfileTextApproved(opts: {
  castName: string;
  lineUserId: string | null;
  fields: { hobby: boolean; quizTags: boolean; comment: boolean };
}): Promise<void> {
  const changed: string[] = [];
  if (opts.fields.hobby) changed.push('趣味');
  if (opts.fields.quizTags) changed.push('AI診断タグ');
  if (opts.fields.comment) changed.push('一言コメント');

  const message = [
    '【プロフィール更新】',
    `${opts.castName} さん、プロフィールの変更申請が承認されました。`,
    `更新項目: ${changed.join('・')}`,
    'プロフィールに反映されています。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * プロフィールテキスト変更申請 → 却下通知
 */
export async function notifyCastProfileTextRejected(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  const message = [
    '【プロフィール更新】',
    `${opts.castName} さん、プロフィールの変更申請が却下されました。`,
    '内容を確認して再度申請してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * シフト提出 → 承認通知
 */
export async function notifyCastShiftApproved(opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  const message = [
    '【シフト確定】',
    `${opts.castName} さん、提出シフトが承認されました。`,
    `対象週: ${opts.weekMonday} 〜`,
    'マイページで確定スケジュールを確認してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * シフト提出 → 却下通知
 */
export async function notifyCastShiftRejected(opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  const message = [
    '【シフト要再提出】',
    `${opts.castName} さん、提出シフトが却下されました。`,
    `対象週: ${opts.weekMonday} 〜`,
    '内容を確認して再度提出してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * 本日の確認 → 却下通知（承認は静かなので通知なし）
 */
export async function notifyCastCheckinRejected(opts: {
  castName: string;
  lineUserId: string | null;
  checkinDate: string;
}): Promise<void> {
  const message = [
    '【本日の確認 要再提出】',
    `${opts.castName} さん、${opts.checkinDate} の本日の確認が却下されました。`,
    '内容を確認して再度提出してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * 投稿 → 公開通知（admin が published に切替）
 */
export async function notifyCastPostPublished(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  const message = [
    '【ブログ公開】',
    `${opts.castName} さん、投稿が公開されました。`,
    'お疲れ様です！',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}

/**
 * 投稿 → 非公開化通知（admin が draft/pending に戻した）
 */
export async function notifyCastPostUnpublished(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  const message = [
    '【ブログ非公開化】',
    `${opts.castName} さん、投稿が非公開に戻されました。`,
    '内容を確認して、必要なら再度公開申請してください。',
  ].join('\n');
  await sendToCast(opts.lineUserId, message);
}
