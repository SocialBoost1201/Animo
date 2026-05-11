import 'server-only';

import { sendLineMessage } from '@/lib/line';
import {
  buildProfileImageApprovedMessage,
  buildProfileImageRejectedMessage,
  buildProfileTextApprovedMessage,
  buildProfileTextRejectedMessage,
  buildShiftApprovedMessage,
  buildShiftRejectedMessage,
  buildCheckinRejectedMessage,
  buildPostPublishedMessage,
  buildPostUnpublishedMessage,
} from './cast-notifier-messages';

// キャスト個人への通知専用モジュール。
// グループ（LINE_GROUP_ID / LINE_NOTIFY_GROUP_ID）には絶対に送信しない。
// line_user_id が null の場合は静かにスキップする。
//
// 文言の組み立ては cast-notifier-messages.ts の pure builder 群に委譲し、
// 本ファイルは「LINE 個別チャットに送る」という副作用に専念する。

async function sendToCast(lineUserId: string | null, message: string): Promise<void> {
  if (!lineUserId) return;
  const result = await sendLineMessage(lineUserId, message);
  if (!result.ok && !result.skipped) {
    console.warn('[CastNotifier] 個別LINE通知失敗:', result.reason);
  }
}

export async function notifyCastProfileImageApproved(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildProfileImageApprovedMessage(opts.castName));
}

export async function notifyCastProfileImageRejected(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildProfileImageRejectedMessage(opts.castName));
}

export async function notifyCastProfileTextApproved(opts: {
  castName: string;
  lineUserId: string | null;
  fields: { hobby: boolean; quizTags: boolean; comment: boolean };
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildProfileTextApprovedMessage(opts.castName, opts.fields));
}

export async function notifyCastProfileTextRejected(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildProfileTextRejectedMessage(opts.castName));
}

export async function notifyCastShiftApproved(opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildShiftApprovedMessage(opts.castName, opts.weekMonday));
}

export async function notifyCastShiftRejected(opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildShiftRejectedMessage(opts.castName, opts.weekMonday));
}

export async function notifyCastCheckinRejected(opts: {
  castName: string;
  lineUserId: string | null;
  checkinDate: string;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildCheckinRejectedMessage(opts.castName, opts.checkinDate));
}

export async function notifyCastPostPublished(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildPostPublishedMessage(opts.castName));
}

export async function notifyCastPostUnpublished(opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {
  await sendToCast(opts.lineUserId, buildPostUnpublishedMessage(opts.castName));
}
