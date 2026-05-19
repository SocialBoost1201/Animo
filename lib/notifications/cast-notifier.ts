import 'server-only';

// LINE公式アカウント廃止につき、通知関数はすべてno-op。
// Web Push実装時にここを置き換える。

export async function notifyCastProfileImageApproved(_opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {}

export async function notifyCastProfileImageRejected(_opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {}

export async function notifyCastProfileTextApproved(_opts: {
  castName: string;
  lineUserId: string | null;
  fields: { hobby: boolean; quizTags: boolean; comment: boolean };
}): Promise<void> {}

export async function notifyCastProfileTextRejected(_opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {}

export async function notifyCastShiftApproved(_opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {}

export async function notifyCastShiftRejected(_opts: {
  castName: string;
  lineUserId: string | null;
  weekMonday: string;
}): Promise<void> {}

export async function notifyCastCheckinRejected(_opts: {
  castName: string;
  lineUserId: string | null;
  checkinDate: string;
}): Promise<void> {}

export async function notifyCastPostPublished(_opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {}

export async function notifyCastPostUnpublished(_opts: {
  castName: string;
  lineUserId: string | null;
}): Promise<void> {}
