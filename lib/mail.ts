import { Resend } from 'resend';

const adminEmail = process.env.ADMIN_EMAIL || 'animo4266@gmaill.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendAdminNotification(payload: {
  type: 'reserve' | 'contact' | 'cast' | 'staff';
  data: Record<string, unknown>;
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
    const { error } = await getResend().emails.send({
      from: 'Animo Notification <onboarding@resend.dev>',
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

// ユーザー（問い合わせ者）への返信メール
export async function sendUserReply({
  to,
  customerName,
  replyText,
}: {
  to: string;
  customerName: string;
  replyText: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Reply email skipped.');
    return { success: false, error: 'RESEND_API_KEY is not set' };
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 30px;">
        <p style="font-size: 22px; font-weight: bold; letter-spacing: 0.2em; color: #171717;">CLUB Animo</p>
        <div style="width: 40px; height: 1px; background: #B39257; margin: 10px auto;"></div>
      </div>
      
      <p style="font-size: 14px; color: #444; margin-bottom: 10px;">${customerName} 様</p>
      <p style="font-size: 14px; color: #444; margin-bottom: 20px;">
        この度はお問い合わせいただきありがとうございます。<br />
        以下の通りご返信申し上げます。
      </p>

      <div style="background: #f9f9f9; border-left: 3px solid #B39257; padding: 20px; margin: 20px 0; white-space: pre-wrap; font-size: 14px; color: #333; line-height: 1.8;">
${replyText}
      </div>

      <p style="font-size: 13px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        ご不明な点がございましたら、お電話またはこのメールへの返信にてお気軽にお問い合わせください。<br />
        今後ともどうぞよろしくお願いいたします。
      </p>

      <div style="margin-top: 20px; font-size: 12px; color: #aaa; text-align: center;">
        <p style="letter-spacing: 0.15em;">CLUB Animo</p>
        <p>〒231-0023 神奈川県横浜市中区山下町</p>
      </div>
    </div>
  `;

  try {
    const { error } = await getResend().emails.send({
      from: 'Club Animo <onboarding@resend.dev>',
      to: to,
      subject: `Club Animo よりご返信 — ${customerName} 様`,
      html: html,
    });

    if (error) {
      console.error('Reply email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Failed to send reply email:', error);
    return { success: false, error: error.message };
  }
}

// ── D-1: お客様へのフォーム送信後自動確認メール ──────────────────────────────
export async function sendGuestConfirmation(payload: {
  type: 'reserve' | 'contact';
  email: string;
  name: string;
  date?: string;
  time?: string;
  people?: number | null;
  castName?: string;
  message?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Guest confirmation email skipped.');
    return;
  }

  const { type, email, name, date, time, people, castName, message } = payload;

  const isReserve = type === 'reserve';
  const subject = isReserve
    ? `【予約受付完了】CLUB Animo — ${name} 様`
    : `【お問い合わせ受付完了】CLUB Animo — ${name} 様`;

  const headerTitle = isReserve
    ? '予約リクエストを受け付けました'
    : 'お問い合わせを受け付けました';

  const bodyText = isReserve
    ? `${name} 様よりのご予約リクエストを受け付けました。<br />内容を確認の上、担当スタッフより確定のご連絡を差し上げます。<br />当日のご予約やお急ぎの場合は、お電話でのご連絡をお勧めいたします。`
    : `${name} 様よりのお問い合わせを受け付けました。<br />数日以内に担当スタッフよりご連絡いたします。<br />お急ぎの場合はお電話にてお問い合わせください。`;

  const detailRows = [
    isReserve && date ? `<tr><th style="text-align:left;padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;white-space:nowrap;">来店希望日</th><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;">${date}${time ? ` ${time.slice(0, 5)}` : ''}</td></tr>` : '',
    isReserve && people ? `<tr><th style="text-align:left;padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;white-space:nowrap;">人数</th><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;">${people}名</td></tr>` : '',
    isReserve && castName ? `<tr><th style="text-align:left;padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;white-space:nowrap;">指名キャスト</th><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;">${castName}</td></tr>` : '',
    message ? `<tr><th style="text-align:left;padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;white-space:nowrap;">メッセージ</th><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;white-space:pre-wrap;">${message}</td></tr>` : '',
  ].filter(Boolean).join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e8e8e8;">
      <div style="background: #0a0a0a; padding: 36px 40px; text-align: center;">
        <p style="font-size: 20px; letter-spacing: 0.3em; color: #C4A05A; margin: 0; font-weight: 300;">CLUB ANIMO</p>
        <div style="width: 40px; height: 1px; background: #C4A05A; opacity: 0.5; margin: 12px auto;"></div>
        <p style="font-size: 12px; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); margin: 0; text-transform: uppercase;">Kannai — Yokohama</p>
      </div>
      <div style="padding: 40px;">
        <h2 style="font-size: 18px; color: #171717; font-weight: bold; margin: 0 0 20px;">${headerTitle}</h2>
        <p style="font-size: 14px; color: #555; line-height: 2; margin-bottom: 28px;">${bodyText}</p>
        ${detailRows ? `<table style="width:100%;border-collapse:collapse;margin-bottom:28px;">${detailRows}</table>` : ''}
        <div style="background:#f9f7f2;border-left:3px solid #C4A05A;padding:16px 20px;font-size:13px;color:#888;line-height:1.8;">
          このメールは自動送信です。このメールアドレスへの返信は受け付けておりません。<br />
          お問い合わせはお電話（<a href="tel:0800-888-8788" style="color:#C4A05A;">0800-888-8788</a>）または公式サイトのフォームよりお願いいたします。
        </div>
      </div>
      <div style="background:#fafafa;border-top:1px solid #eee;padding:20px 40px;font-size:12px;color:#aaa;text-align:center;line-height:1.8;">
        <p style="margin:0;">CLUB Animo — 〒231-0023 神奈川県横浜市中区山下町</p>
        <p style="margin:4px 0 0;"><a href="https://club-animo.com" style="color:#C4A05A;text-decoration:none;">club-animo.com</a></p>
      </div>
    </div>
  `;

  try {
    const { error } = await getResend().emails.send({
      from: 'CLUB Animo <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Guest confirmation email error:', error);
    }
  } catch (err) {
    console.error('Failed to send guest confirmation email:', err);
  }
}
