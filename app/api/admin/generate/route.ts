import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // 1. セキュリティチェック（Adminのみ実行可能にする）
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Adminユーザーのセッションがない場合は401 (もしテスト環境などでAPIキーがフロントで漏れるのを防ぐ)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, type } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 環境変数に設定されたAPIキーに基づいてフォールバック（Gemini優先、なければOpenAI）
    let model;
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY) {
      // @ai-sdk/google はデフォルトで GOOGLE_GENERATIVE_AI_API_KEY を見に行く
      model = google('models/gemini-1.5-pro-latest');
    } else if (process.env.OPENAI_API_KEY) {
      model = openai('gpt-4o');
    } else {
      return NextResponse.json({ error: 'No AI API Key configured on server' }, { status: 500 });
    }

    // 役割と出力トーンの設定
    let systemMessage = 'あなたは高級キャバクラ・ラウンジの熟練WEB担当者およびコピーライターです。入力された情報をもとに魅力的な紹介文を作成してください。';
    
    if (type === 'cast') {
      systemMessage = `あなたは高級キャバクラ・ラウンジの熟練WEB担当コピーライターです。
お客様を惹きつける魅力的なキャスト紹介文を200文字〜300文字程度で作成してください。
・過度な絵文字は控え、上品で洗練されたトーンにすること
・入力されたキャストの「趣味」「性格」「特徴」などのキーワードを自然に繋ぎ合わせること
・嘘や誇張表現は避け、事実に基づいた魅力を引き出すこと
・マークダウンなどは使用せず、プレーンテキストで改行を含めて出力すること`;
    } else if (type === 'news') {
      systemMessage = `あなたは高級キャバクラ・ラウンジの熟練WEB担当コピーライターです。
入力されたイベント内容やニュースの箇条書き・概要をもとに、来店を促す魅力的な告知文を300文字〜500文字程度で作成してください。
・上品で洗練されたトーンを保つこと
・HTMLタグやマークダウン（**太字** など）は使用せず、プレーンテキストで出力すること
・来店意欲を高めるような結びの言葉を入れること`;
    }

    const { text } = await generateText({
      model,
      system: systemMessage,
      prompt: `以下の情報をもとに文章を作成してください：\n\n${prompt}`,
    });

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('AI Generation Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
