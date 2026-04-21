import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { requireAdminLogin } from '@/lib/auth/admin';

export async function POST() {
  try {
    const auth = await requireAdminLogin();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const supabase = auth.supabase;

    // 過去3ヶ月の問い合わせ・予約データを集計
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data: contacts } = await supabase
      .from('contacts')
      .select('created_at, type')
      .gte('created_at', threeMonthsAgo)
      .order('created_at', { ascending: true });

    // 曜日別集計
    const weekdayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const monthlyCounts: Record<string, number> = {};

    contacts?.forEach((c) => {
      const date = new Date(c.created_at);
      weekdayCounts[date.getDay()] = (weekdayCounts[date.getDay()] || 0) + 1;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    const weekdays = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
    const weekdaySummary = weekdays.map((d, i) => `${d}: ${weekdayCounts[i]}件`).join('、');
    const monthlySummary = Object.entries(monthlyCounts)
      .map(([m, c]) => `${m}: ${c}件`).join('、');

    const prompt = `CLUB Animo（横浜・関内の高級キャバクラ）の過去3ヶ月のお問い合わせ・予約データです。

【曜日別累計】
${weekdaySummary}

【月別推移】
${monthlySummary}

このデータをもとに以下の3点を、店長が実際に意思決定に使える形式で出力してください：

1. summary: 1〜2文の現状サマリー（例：「金曜・土曜の需要が特に高く〜」）
2. peakDays: 来週7日間（月〜日）の各曜日ごとの予測（"多い" "普通" "少ない" の3段階で、曜日名と予測ラベルのみ）
3. recommendations: 具体的な推奨アクション3点（シフト調整・販促提案など）

JSON形式で出力：
{
  "summary": "...",
  "peakDays": [{"day": "月", "forecast": "普通"}, ...],
  "recommendations": ["...", "...", "..."]
}`;

    let model;
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      model = google('models/gemini-1.5-pro-latest');
    } else {
      model = openai('gpt-4o');
    }

    const { text } = await generateText({ model, prompt });

    // JSON 抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to extract JSON from AI response');
    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
