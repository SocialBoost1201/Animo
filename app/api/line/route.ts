import { NextResponse } from 'next/server';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_GROUP_ID = process.env.LINE_GROUP_ID; // 通知先グループ or ユーザー ID

// 予約・問い合わせ受信時に LINE グループへ通知するユーティリティ
// submit.ts から呼び出す、または管理画面アクションから手動呼び出し可能
export async function sendLineNotification({
  message,
}: {
  message: string;
}) {
  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_GROUP_ID) {
    console.warn('LINE env vars not set. LINE notification skipped.');
    return;
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: LINE_GROUP_ID,
        messages: [{ type: 'text', text: message }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('LINE API error:', res.status, body);
    }
  } catch (err) {
    console.error('Failed to send LINE notification:', err);
  }
}

// 管理画面の「LINE 通知テスト」ボタン用 API ルート
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }
    await sendLineNotification({ message });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('LINE route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
