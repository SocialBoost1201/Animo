import { NextResponse } from 'next/server';
import * as crypto from 'crypto';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
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

// ─── Webhook 署名検証 ────────────────────────────────────────────────────────
function verifySignature(body: string, signature: string): boolean {
  if (!LINE_CHANNEL_SECRET) return true; // SECRET 未設定時は検証スキップ（開発用）
  const hash = crypto
    .createHmac('SHA256', LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// ─── Webhook 受信 (LINE → サーバー) ─────────────────────────────────────────
// グループに Bot を招待してメッセージを送ると、
// Vercel Functions ログに groupId が出力されます。
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-line-signature') ?? '';

    // 署名検証
    if (!verifySignature(rawBody, signature)) {
      console.error('[LINE] 署名検証失敗');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const events = body.events ?? [];

    for (const event of events) {
      const source = event.source ?? {};

      // ── グループ ID / ルーム ID をログ出力（LINE_GROUP_ID 取得用） ──
      if (source.groupId) {
        console.log('[LINE] ✅ groupId:', source.groupId);
      }
      if (source.roomId) {
        console.log('[LINE] ✅ roomId:', source.roomId);
      }
      if (source.userId) {
        console.log('[LINE] userId:', source.userId, '| type:', source.type);
      }

      // イベント種別をログ出力
      console.log('[LINE] event.type:', event.type, '| source.type:', source.type);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[LINE] Webhook 処理エラー:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── 管理画面「LINE テスト送信」用エンドポイント ─────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get('message') ?? 'テスト送信: Club Animo 通知システム';

  const result = await sendLineGroupMessage(message);
  return NextResponse.json({ ...result, groupId: LINE_GROUP_ID ?? '未設定' });
}
