import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase/service';
import { sendLineMessage } from '@/lib/line';

function normalizeChannelSecret(secret: string) {
  const trimmed = secret.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function verifyLineSignature(rawBody: Buffer, signature: string, channelSecret: string) {
  const sig = signature.trim();
  if (!sig) return false;
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(rawBody)
    .digest('base64');
  const a = Buffer.from(hash, 'base64');
  const b = Buffer.from(sig, 'base64');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ── 電話番号正規化（数字のみ） ───────────────────────────────────────────────
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// ── LINE User ID 連携処理 ────────────────────────────────────────────────────
async function linkLineUserId(lineUserId: string, phoneInput: string): Promise<string> {
  const supabase = createServiceClient();
  const normalizedInput = normalizePhone(phoneInput);

  if (!normalizedInput || normalizedInput.length < 10) {
    return '電話番号の形式が正しくありません。\n例: 09012345678 または 090-1234-5678';
  }

  // cast_private_info.phone と照合
  const { data: candidates, error } = await supabase
    .from('cast_private_info')
    .select('cast_id, phone, line_user_id, casts!inner(stage_name, auth_user_id)')
    .limit(500);

  if (error) {
    console.error('[LINE Webhook] cast_private_info 取得エラー:', error);
    return 'システムエラーが発生しました。担当者にお問い合わせください。';
  }

  const matched = (candidates ?? []).find((c) => {
    const candidatePhone = normalizePhone(c.phone ?? '');
    return candidatePhone === normalizedInput;
  });

  if (!matched) {
    return '入力された電話番号に一致するキャスト情報が見つかりませんでした。\n登録済みの携帯番号を入力してください。';
  }

  const cast = matched.casts as unknown as { stage_name: string; auth_user_id: string | null };

  if (!cast.auth_user_id) {
    return `${cast.stage_name} さんのアカウントがまだ作成されていません。\nアカウント登録を完了してから再度お試しください。`;
  }

  // すでに同じ line_user_id が登録済みの場合はスキップ
  if (matched.line_user_id === lineUserId) {
    return `${cast.stage_name} さん、すでに連携済みです！\nAnimo の通知を受け取る準備ができています ✅`;
  }

  // line_user_id を保存
  const { error: updateError } = await supabase
    .from('cast_private_info')
    .update({ line_user_id: lineUserId })
    .eq('cast_id', matched.cast_id);

  if (updateError) {
    console.error('[LINE Webhook] line_user_id 保存エラー:', updateError);
    return 'アカウント連携に失敗しました。担当者にお問い合わせください。';
  }

  console.log(`[LINE Webhook] 連携完了: cast_id=${matched.cast_id}, lineUserId=${lineUserId}`);
  return `${cast.stage_name} さん、LINE 連携が完了しました！🎉\nAnimo からの通知をこのアカウントで受け取ることができます。`;
}

// ── Webhook POST ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const channelSecretRaw = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecretRaw) {
    console.error('[LINE] LINE_CHANNEL_SECRET が未設定です。');
    return NextResponse.json({ error: 'LINE_CHANNEL_SECRET is not set' }, { status: 500 });
  }

  const channelSecret = normalizeChannelSecret(channelSecretRaw);

  try {
    const rawBodyBuffer = Buffer.from(await req.arrayBuffer());
    const signature = req.headers.get('x-line-signature') ?? '';

    if (!verifyLineSignature(rawBodyBuffer, signature, channelSecret)) {
      console.error('[LINE] 署名検証失敗');
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBodyBuffer.toString('utf-8'));
    const events = body?.events ?? [];

    for (const event of events) {
      const lineUserId: string = event?.source?.userId;
      if (!lineUserId) continue;

      // ── follow イベント: Bot 友達追加時 ──────────────────────────────────
      if (event.type === 'follow') {
        await sendLineMessage(
          lineUserId,
          '【Club Animo】\nAnimo Bot を友達追加ありがとうございます！🎉\n\nLINE 連携を完了するには、登録済みの携帯番号を送ってください。\n例: 09012345678'
        );
        continue;
      }

      // ── message イベント: テキストメッセージ受信 ─────────────────────────
      if (event.type === 'message' && event.message?.type === 'text') {
        const text: string = (event.message.text ?? '').trim();

        // 電話番号らしきテキストが来たら連携処理
        const looksLikePhone = /^[\d\-\(\)\s]{10,15}$/.test(text);
        if (looksLikePhone) {
          const replyMessage = await linkLineUserId(lineUserId, text);
          await sendLineMessage(lineUserId, replyMessage);
        }
        // それ以外のメッセージは無視（グループ内でのノイズ対策）
        continue;
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[LINE] Webhook 処理エラー:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
