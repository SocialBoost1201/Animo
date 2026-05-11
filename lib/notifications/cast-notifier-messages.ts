/**
 * cast-notifier の通知本文を組み立てる pure builder 群。
 * server-only に依存しないため unit test 可能。
 *
 * 文言を変えるときはここだけを編集する。
 */

export function buildProfileImageApprovedMessage(castName: string): string {
  return [
    '【プロフィール画像】',
    `${castName} さん、画像変更申請が承認されました。`,
    'プロフィールに新しい画像が反映されています。',
  ].join('\n');
}

export function buildProfileImageRejectedMessage(castName: string): string {
  return [
    '【プロフィール画像】',
    `${castName} さん、画像変更申請が却下されました。`,
    '内容を確認して再度申請してください。',
  ].join('\n');
}

export function buildProfileTextApprovedMessage(
  castName: string,
  fields: { hobby: boolean; quizTags: boolean; comment: boolean },
): string {
  const changed: string[] = [];
  if (fields.hobby) changed.push('趣味');
  if (fields.quizTags) changed.push('AI診断タグ');
  if (fields.comment) changed.push('一言コメント');

  return [
    '【プロフィール更新】',
    `${castName} さん、プロフィールの変更申請が承認されました。`,
    `更新項目: ${changed.join('・')}`,
    'プロフィールに反映されています。',
  ].join('\n');
}

export function buildProfileTextRejectedMessage(castName: string): string {
  return [
    '【プロフィール更新】',
    `${castName} さん、プロフィールの変更申請が却下されました。`,
    '内容を確認して再度申請してください。',
  ].join('\n');
}

export function buildShiftApprovedMessage(castName: string, weekMonday: string): string {
  return [
    '【シフト確定】',
    `${castName} さん、提出シフトが承認されました。`,
    `対象週: ${weekMonday} 〜`,
    'マイページで確定スケジュールを確認してください。',
  ].join('\n');
}

export function buildShiftRejectedMessage(castName: string, weekMonday: string): string {
  return [
    '【シフト要再提出】',
    `${castName} さん、提出シフトが却下されました。`,
    `対象週: ${weekMonday} 〜`,
    '内容を確認して再度提出してください。',
  ].join('\n');
}

export function buildCheckinRejectedMessage(castName: string, checkinDate: string): string {
  return [
    '【本日の確認 要再提出】',
    `${castName} さん、${checkinDate} の本日の確認が却下されました。`,
    '内容を確認して再度提出してください。',
  ].join('\n');
}

export function buildPostPublishedMessage(castName: string): string {
  return [
    '【ブログ公開】',
    `${castName} さん、投稿が公開されました。`,
    'お疲れ様です!',
  ].join('\n');
}

export function buildPostUnpublishedMessage(castName: string): string {
  return [
    '【ブログ非公開化】',
    `${castName} さん、投稿が非公開に戻されました。`,
    '内容を確認して、必要なら再度公開申請してください。',
  ].join('\n');
}
