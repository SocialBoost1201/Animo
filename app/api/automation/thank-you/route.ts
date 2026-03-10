import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { render } from '@react-email/components';
import { BirthdayEmail } from '@/emails/BirthdayEmail';
import { ThankYouEmail } from '@/emails/ThankYouEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'animo@club-animo.com';

// ============================================================
// POST /api/automation/thank-you
// Webhook 等からの呼び出し用（予約完了後トリガー）
// ============================================================
export async function POST(req: Request) {
  const { customerName, email, reserveDate, reserveTime } = await req.json();

  if (!email || !customerName) {
    return NextResponse.json({ error: 'email and customerName are required' }, { status: 400 });
  }

  const html = await render(ThankYouEmail({ customerName, reserveDate, reserveTime }));

  const { error } = await resend.emails.send({
    from: `CLUB Animo <${FROM_EMAIL}>`,
    to: [email],
    subject: `【CLUB Animo】ご予約いただきありがとうございます`,
    html,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
