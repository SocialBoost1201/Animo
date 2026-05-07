const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_GROUP_ID = process.env.LINE_GROUP_ID;
// 「通知用グループ」のグループID。キャストグループ（LINE_GROUP_ID）とは別。
const LINE_NOTIFY_GROUP_ID = process.env.LINE_NOTIFY_GROUP_ID;

type LineSendResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  status?: number;
};

export async function sendLineMessage(to: string, message: string): Promise<LineSendResult> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn('[LINE] LINE_CHANNEL_ACCESS_TOKEN が未設定です。送信をスキップします。');
    return { ok: false, skipped: true, reason: 'missing_channel_access_token' };
  }

  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: 'text', text: message }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('[LINE] Push API エラー:', response.status, body);
    return { ok: false, status: response.status, reason: body };
  }

  return { ok: response.ok, status: response.status };
}

export async function sendLineGroupMessage(message: string): Promise<LineSendResult> {
  if (!LINE_GROUP_ID) {
    console.warn('[LINE] LINE_GROUP_ID が未設定です。送信をスキップします。');
    return { ok: false, skipped: true, reason: 'missing_group_id' };
  }

  return sendLineMessage(LINE_GROUP_ID, message);
}

/**
 * 「通知用グループ」（管理者 + 公式LINE）への通知。
 * キャストグループ（LINE_GROUP_ID）とは完全に別の送信先。
 * .env.local に LINE_NOTIFY_GROUP_ID を設定すること。
 */
export async function sendLineNotifyGroupMessage(message: string): Promise<LineSendResult> {
  if (!LINE_NOTIFY_GROUP_ID) {
    console.warn('[LINE] LINE_NOTIFY_GROUP_ID が未設定です。送信をスキップします。');
    return { ok: false, skipped: true, reason: 'missing_notify_group_id' };
  }

  return sendLineMessage(LINE_NOTIFY_GROUP_ID, message);
}
