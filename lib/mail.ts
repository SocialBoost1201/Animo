import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'animo4266@gmaill.com';

export async function sendAdminNotification(payload: {
  type: 'reserve' | 'contact' | 'cast' | 'staff';
  data: any;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email notification skipped.');
    return;
  }

  const { type, data } = payload;
  
  let subject = '';
  let title = '';
  
  switch (type) {
    case 'reserve':
      subject = `【新着】来店予約リクエスト: ${data.name}様`;
      title = '新着：来店予約リクエスト';
      break;
    case 'contact':
      subject = `【新着】お問い合わせ: ${data.name}様`;
      title = '新着：お問い合わせ';
      break;
    case 'cast':
      subject = `【新着】キャスト応募: ${data.name}様`;
      title = '新着：キャスト応募';
      break;
    case 'staff':
      subject = `【新着】スタッフ応募: ${data.name}様`;
      title = '新着：スタッフ応募';
      break;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #B39257; font-size: 18px; border-bottom: 2px solid #B39257; padding-bottom: 10px;">${title}</h2>
      <p style="font-size: 14px; color: #666;">公式サイトより新しい申し込みがありました。管理画面で詳細を確認してください。</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        ${Object.entries(data).map(([key, value]) => `
          <tr>
            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; color: #888; text-transform: uppercase;">${key}</th>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${value || '-'}</td>
          </tr>
        `).join('')}
      </table>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/inquiries" 
           style="background-color: #1A1A1A; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 14px; display: inline-block;">
           管理画面で確認する
        </a>
      </div>
    </div>
  `;

  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Animo Notification <onboarding@resend.dev>', // 実際の運用にはドメイン認証が必要
      to: adminEmail,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Email send error:', error);
    }
  } catch (err) {
    console.error('Failed to send notification email:', err);
  }
}
