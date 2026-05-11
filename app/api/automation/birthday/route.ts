import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { render } from '@react-email/components';
import { BirthdayEmail } from '@/emails/BirthdayEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'animo@club-animo.com';

// ============================================================
// GET /api/automation/birthday
// Vercel Cron Jobs で毎日 09:00 JST に実行
//
// 重複防止:
//   customer_birthday_email_logs (customer_id, target_year_month) UNIQUE で
//   同一顧客に同月内2回以上送信されないよう DB レベルで保証する
// ============================================================
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // RLS をバイパスするために service role クライアントを使用
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 今月が誕生月のお客様（メール許諾済み）を取得
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const targetYearMonth = `${now.getFullYear()}-${String(currentMonth).padStart(2, '0')}`;

    const { data: customers } = await supabase
      .from('customers')
      .select('id, name, email, birthday')
      .eq('email_opt_in', true)
      .not('email', 'is', null)
      .not('birthday', 'is', null);

    const birthdayCustomers = customers?.filter((c) => {
      if (!c.birthday) return false;
      const birthMonth = new Date(c.birthday).getMonth() + 1;
      return birthMonth === currentMonth;
    }) ?? [];

    // 当月既に送信済みの顧客を除外
    const { data: alreadySent } = await supabase
      .from('customer_birthday_email_logs')
      .select('customer_id')
      .eq('target_year_month', targetYearMonth);
    const alreadySentIds = new Set((alreadySent ?? []).map((r) => r.customer_id as string));

    const targets = birthdayCustomers.filter((c) => !alreadySentIds.has(c.id));

    let sentCount = 0;
    const skippedCount = alreadySentIds.size;

    for (const c of targets) {
      if (!c.email) continue;
      const html = await render(BirthdayEmail({ customerName: c.name }));
      let status: 'sent' | 'failed' = 'failed';
      try {
        const { error } = await resend.emails.send({
          from: `CLUB Animo <${FROM_EMAIL}>`,
          to: [c.email],
          subject: `【CLUB Animo】${c.name} 様へ、誕生日月のご案内`,
          html,
        });
        if (!error) {
          status = 'sent';
          sentCount++;
        }
      } catch (mailErr) {
        console.error(`誕生日メール送信失敗 customer_id=${c.id}`, mailErr);
      }

      // 送信ログを upsert（UNIQUE 制約で同月二重防止）
      await supabase
        .from('customer_birthday_email_logs')
        .upsert(
          {
            customer_id: c.id,
            target_year_month: targetYearMonth,
            sent_at: new Date().toISOString(),
            email: c.email,
            status,
          },
          { onConflict: 'customer_id,target_year_month' }
        );
    }

    return NextResponse.json({
      success: true,
      targetYearMonth,
      sent: sentCount,
      skipped: skippedCount,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
