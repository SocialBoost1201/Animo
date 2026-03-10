import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { render } from '@react-email/components';
import { BirthdayEmail } from '@/emails/BirthdayEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'animo@club-animo.com';

// ============================================================
// GET /api/automation/birthday
// Vercel Cron Jobs で毎日 09:00 JST に実行
// ============================================================
export async function GET() {
  try {
    const supabase = await createClient();

    // 今月が誕生月のお客様（メール許諾済み）を取得
    const currentMonth = new Date().getMonth() + 1;
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

    let sentCount = 0;
    for (const c of birthdayCustomers) {
      if (!c.email) continue;
      const html = await render(BirthdayEmail({ customerName: c.name }));
      const { error } = await resend.emails.send({
        from: `CLUB Animo <${FROM_EMAIL}>`,
        to: [c.email],
        subject: `【CLUB Animo】${c.name} 様へ、誕生日月のご案内`,
        html,
      });
      if (!error) sentCount++;
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
