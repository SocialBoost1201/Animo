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
