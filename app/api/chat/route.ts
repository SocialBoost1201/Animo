import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // RAG: Supabase からコンテキスト情報を取得
    const supabase = await createClient();

    // 本日のシフト（出勤キャスト）を取得
    const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: shifts } = await supabase
      .from('cast_schedules')
      .select('casts(name, stage_name, hobby)')
      .eq('work_date', today)
      .limit(10);

    // 空席状況を取得
    const { data: settings } = await supabase
      .from('site_settings')
      .select('availability, today_mood')
      .eq('id', 1)
      .single();

    const availabilityLabel: Record<string, string> = {
      available: '余裕あり',
      limited: '残りわずか',
      full: '満席',
      closed: '本日休業',
      open: '余裕あり',
    };

    const castNames = shifts
      ?.map((s: any) => (s.casts as any)?.stage_name || (s.casts as any)?.name)
      .filter(Boolean)
      .join('、') ?? '（シフト情報を確認中）';

    const systemPrompt = `あなたは「Animo コンシェルジュ」です。高級キャバクラ・ラウンジ「CLUB Animo」（横浜・関内）の公式AIアシスタントとして、お客様のご質問に上品かつ丁寧にお答えします。

## 本日の情報（リアルタイム）
- 空席状況: ${availabilityLabel[settings?.availability ?? 'available']}
- 今日の一言: ${settings?.today_mood ?? '本日もご来店をお待ちしております'}
- 本日の出勤キャスト: ${castNames ? castNames : '本日のキャスト情報は準備中です'}

## 店舗情報
- 店名: CLUB Animo
- 場所: 神奈川県横浜市中区花咲町（関内・馬車道エリア）
- 電話: 0800-888-8788
- 営業時間: 20:00〜翌04:00（年中無休）
- システム料金: 1時間あたり各種コースあり（詳細はホームページの料金ページをご確認ください）
- 予約ページ: /reserve
- キャスト一覧: /cast

## 回答ルール
1. 常に上品で丁寧なトーンを保つこと（「〜でございます」「〜いただけます」等）
2. 分からない情報は「詳しくはお電話（0800-888-8788）にてお問い合わせください」と誘導
3. 「予約したい」「席を取りたい」という意向が見えたら /reserve への誘導を必ず行う
4. 長々と説明せず、端的に答えること
5. 絵文字は使わず、格調高いトーンを維持すること`;

    let model;
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      model = google('models/gemini-1.5-pro-latest');
    } else {
      model = openai('gpt-4o');
    }

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
