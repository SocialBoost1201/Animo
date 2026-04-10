import { NextResponse } from 'next/server';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_GROUP_ID = process.env.LINE_GROUP_ID;

// ─── LINE Push Message 送信ユーティリティ ───────────────────────────────────
export async function sendLineMessage(to: string, message: string) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn('[LINE] LINE_CHANNEL_ACCESS_TOKEN が未設定です。送信をスキップします。');
    return { ok: false };
  }

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
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

  if (!res.ok) {
    const body = await res.text();
    console.error('[LINE] Push API エラー:', res.status, body);
  }
  return { ok: res.ok };
}

// グループ ID が設定されている場合にグループへ送信する短縮関数
export async function sendLineGroupMessage(message: string) {
  if (!LINE_GROUP_ID) {
    console.warn('[LINE] LINE_GROUP_ID が未設定です。送信をスキップします。');
    return { ok: false };
  }
  return sendLineMessage(LINE_GROUP_ID, message);
}

// ─── 管理画面「LINE テスト送信」用エンドポイント ─────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get('message') ?? 'テスト送信: Club Animo 通知システム';

  const result = await sendLineGroupMessage(message);
  return NextResponse.json({ ...result, groupId: LINE_GROUP_ID ?? '未設定' });
}
