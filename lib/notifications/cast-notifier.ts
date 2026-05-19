import 'server-only';

import { sendPushToCastUser } from './web-push';
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

// 管理→キャスト Web Push 通知モジュール。
// 送信先は castAuthUserId（casts.auth_user_id = auth.users.id）で特定する。
// 購読なし・VAPID未設定の場合は静かにスキップする（non-critical）。

export async function notifyCastProfileImageApproved(opts: {
  castName: string;
  castAuthUserId: string | null;
}): Promise<void> {
  const msg = buildProfileImageApprovedMessage(opts.castName);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'プロフィール画像が承認されました',
    body: msg,
    url: '/cast/profile',
  });
}

export async function notifyCastProfileImageRejected(opts: {
  castName: string;
  castAuthUserId: string | null;
}): Promise<void> {
  const msg = buildProfileImageRejectedMessage(opts.castName);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'プロフィール画像申請が却下されました',
    body: msg,
    url: '/cast/profile',
  });
}

export async function notifyCastProfileTextApproved(opts: {
  castName: string;
  castAuthUserId: string | null;
  fields: { hobby: boolean; quizTags: boolean; comment: boolean };
}): Promise<void> {
  const msg = buildProfileTextApprovedMessage(opts.castName, opts.fields);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'プロフィールが更新されました',
    body: msg,
    url: '/cast/profile',
  });
}

export async function notifyCastProfileTextRejected(opts: {
  castName: string;
  castAuthUserId: string | null;
}): Promise<void> {
  const msg = buildProfileTextRejectedMessage(opts.castName);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'プロフィール申請が却下されました',
    body: msg,
    url: '/cast/profile',
  });
}

export async function notifyCastShiftApproved(opts: {
  castName: string;
  castAuthUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  const msg = buildShiftApprovedMessage(opts.castName, opts.weekMonday);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'シフトが承認されました',
    body: msg,
    url: '/cast/schedule',
  });
}

export async function notifyCastShiftRejected(opts: {
  castName: string;
  castAuthUserId: string | null;
  weekMonday: string;
}): Promise<void> {
  const msg = buildShiftRejectedMessage(opts.castName, opts.weekMonday);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'シフトが却下されました',
    body: msg,
    url: '/cast/monthly-shift',
  });
}

export async function notifyCastCheckinRejected(opts: {
  castName: string;
  castAuthUserId: string | null;
  checkinDate: string;
}): Promise<void> {
  const msg = buildCheckinRejectedMessage(opts.castName, opts.checkinDate);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: '本日の確認が却下されました',
    body: msg,
    url: '/cast/today',
  });
}

export async function notifyCastPostPublished(opts: {
  castName: string;
  castAuthUserId: string | null;
}): Promise<void> {
  const msg = buildPostPublishedMessage(opts.castName);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'ブログが公開されました',
    body: msg,
    url: '/cast/posts',
  });
}

export async function notifyCastPostUnpublished(opts: {
  castName: string;
  castAuthUserId: string | null;
}): Promise<void> {
  const msg = buildPostUnpublishedMessage(opts.castName);
  await sendPushToCastUser(opts.castAuthUserId, {
    title: 'ブログが非公開になりました',
    body: msg,
    url: '/cast/posts',
  });
}
