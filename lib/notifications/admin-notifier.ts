import 'server-only'

import { sendLineNotifyGroupMessage } from '@/lib/line'

// すべて non-critical: 呼び出し元で try/catch すること
// 送信先は LINE_ADMIN_USER_ID（公式LINEアカウント）のみ。キャストグループには送信しない。

/**
 * シフト提出通知（公式LINE）
 * cast-shifts.ts の submitMyShift から呼ぶ。もともと通知なし → 追加。
 */
export async function notifyShiftSubmitted(opts: {
  castName: string
  targetWeekMonday: string
  isResubmit: boolean
}): Promise<void> {
  const resubmitLabel = opts.isResubmit ? '（再提出）' : '（新規）'
  const message = [
    '【シフト提出】',
    `${opts.castName} さん${resubmitLabel}`,
    `対象週: ${opts.targetWeekMonday} 〜`,
    '状態: 承認待ち',
  ].join('\n')

  const result = await sendLineNotifyGroupMessage(message)
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] シフト提出LINE通知失敗:', result.reason)
  }
}

/**
 * ブログ（キャスト日記）投稿通知（公式LINE）
 * cast-posts.ts の createCastPost から呼ぶ。メールは既存コードが送信済み → LINE を追加。
 */
export async function notifyBlogSubmitted(opts: {
  castName: string
  contentPreview: string
}): Promise<void> {
  const message = [
    '【ブログ投稿】',
    `${opts.castName} さんが日記を投稿しました`,
    `内容: ${opts.contentPreview.substring(0, 60)}${opts.contentPreview.length > 60 ? '…' : ''}`,
    '状態: 承認待ち',
  ].join('\n')

  const result = await sendLineNotifyGroupMessage(message)
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] ブログLINE通知失敗:', result.reason)
  }
}

/**
 * プロフィール画像変更申請通知（公式LINE）
 * cast-images.ts の requestProfileImageChange から呼ぶ。新機能 → 追加。
 */
export async function notifyProfileImageChangeRequested(opts: {
  castName: string
  castId: string
}): Promise<void> {
  const message = [
    '【プロフィール画像申請】',
    `${opts.castName} さんが画像変更を申請しました`,
    '状態: 承認待ち',
  ].join('\n')

  const result = await sendLineNotifyGroupMessage(message)
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] 画像申請LINE通知失敗:', result.reason)
  }
}

/**
 * 出勤確認提出通知（公式LINE）
 * today.ts の submitCheckin から呼ぶ。
 * ※ キャストグループへの既存通知（sendLineGroupMessage）はそのまま残す。
 *    こちらは公式LINEへの管理者向け通知。
 */
export async function notifyCheckinSubmitted(opts: {
  castName: string
  today: string
  isAbsent: boolean
  hasChange: boolean
  changeNote: string | null
  memo: string | null
}): Promise<void> {
  const lines = [
    '【出勤確認提出】',
    `${opts.castName} さん`,
    `日付: ${opts.today}`,
    `欠勤: ${opts.isAbsent ? 'あり' : 'なし'}`,
    `出勤変更: ${opts.hasChange ? 'あり' : 'なし'}`,
  ]
  if (opts.changeNote) lines.push(`変更内容: ${opts.changeNote}`)
  if (opts.memo) lines.push(`メモ: ${opts.memo}`)
  lines.push('状態: 承認待ち')

  const result = await sendLineNotifyGroupMessage(lines.join('\n'))
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] 出勤確認LINE通知失敗:', result.reason)
  }
}

/**
 * プロフィールテキスト変更申請通知（公式LINE）
 * cast-profile-requests.ts の requestProfileTextChange から呼ぶ。
 */
export async function notifyProfileTextChangeRequested(opts: {
  castName: string
  fields: { hobby: boolean; quizTags: boolean; comment: boolean }
}): Promise<void> {
  const fieldLabels = [
    opts.fields.hobby     && '趣味',
    opts.fields.quizTags  && 'AI診断タグ',
    opts.fields.comment   && '一言コメント',
  ].filter(Boolean).join('・')

  const message = [
    '【プロフィールテキスト申請】',
    `${opts.castName} さんがテキスト変更を申請しました`,
    `変更項目: ${fieldLabels}`,
    '状態: 承認待ち',
  ].join('\n')

  const result = await sendLineNotifyGroupMessage(message)
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] テキスト申請LINE通知失敗:', result.reason)
  }
}

/**
 * 来店予定提出通知（公式LINE）
 * today.ts の addReservation から呼ぶ。
 * ※ キャストグループへの既存通知（sendLineGroupMessage）はそのまま残す。
 *    こちらは公式LINEへの管理者向け通知。
 */
export async function notifyReservationSubmitted(opts: {
  castName: string
  today: string
  visitTime: string
  guestName: string
  guestCount: number | null
  reservationType: string
  note: string | null
}): Promise<void> {
  const typeLabel = opts.reservationType === 'douhan' ? '同伴' : '来店予定'
  const lines = [
    '【来店予定提出】',
    `${opts.castName} さん`,
    `日付: ${opts.today}`,
    `時間: ${opts.visitTime.substring(0, 5)}`,
    `お客様: ${opts.guestName} 様`,
    `種別: ${typeLabel}`,
  ]
  if (opts.guestCount) lines.push(`人数: ${opts.guestCount}名`)
  if (opts.note) lines.push(`メモ: ${opts.note}`)
  lines.push('状態: 承認待ち')

  const result = await sendLineNotifyGroupMessage(lines.join('\n'))
  if (!result.ok && !result.skipped) {
    console.warn('[AdminNotifier] 来店予定LINE通知失敗:', result.reason)
  }
}
