import { NextResponse } from 'next/server';
import * as crypto from 'crypto';

function verifyLineSignature(rawBody: Buffer, signature: string, channelSecret: string) {
  if (!signature) return false;
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(rawBody)
    .digest('base64');

  // timingSafeEqual requires buffers with the same length
  const a = Buffer.from(hash);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret) {
    console.error('[LINE] LINE_CHANNEL_SECRET が未設定です。');
    return NextResponse.json({ error: 'LINE_CHANNEL_SECRET is not set' }, { status: 500 });
  }

  try {
    const rawBodyBuffer = Buffer.from(await req.arrayBuffer());
    const signature = req.headers.get('x-line-signature') ?? '';

    if (!verifyLineSignature(rawBodyBuffer, signature, channelSecret)) {
      console.error('[LINE] 署名検証失敗');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBodyBuffer.toString('utf-8'));
    const events = body?.events ?? [];

    console.log('[LINE] webhook received:', {
      destination: body?.destination,
      eventsCount: Array.isArray(events) ? events.length : 0,
    });

    for (const event of events) {
      console.log('[LINE] event:', {
        type: event?.type,
        mode: event?.mode,
        timestamp: event?.timestamp,
        source: event?.source,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[LINE] Webhook 処理エラー:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
