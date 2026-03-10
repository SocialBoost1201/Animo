import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Img, Row, Column
} from '@react-email/components';

type ThankYouEmailProps = {
  customerName: string;
  reserveDate?: string;
  reserveTime?: string;
};

export function ThankYouEmail({ customerName, reserveDate, reserveTime }: ThankYouEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: '"YuMincho", "游明朝", "Noto Serif JP", Georgia, serif' }}>
        <Container style={{ maxWidth: '540px', margin: '40px auto', backgroundColor: '#0d0d0d', padding: '0' }}>
          {/* ヘッダーライン */}
          <div style={{ height: '2px', background: 'linear-gradient(to right, #9d8332, #d4af5c, #9d8332)' }} />

          {/* Logo / Title */}
          <Section style={{ padding: '40px 48px 24px', textAlign: 'center' }}>
            <Heading style={{ color: '#d4af5c', fontSize: '22px', fontWeight: 400, letterSpacing: '0.3em', margin: 0 }}>
              CLUB Animo
            </Heading>
            <Text style={{ color: '#666', fontSize: '11px', letterSpacing: '0.2em', marginTop: '6px' }}>
              YOKOHAMA / KANNAI
            </Text>
          </Section>

          <Hr style={{ borderColor: '#1a1a1a', margin: '0 48px' }} />

          {/* Main Message */}
          <Section style={{ padding: '40px 48px' }}>
            <Text style={{ color: '#cccccc', fontSize: '15px', lineHeight: '2', marginBottom: '24px' }}>
              {customerName} 様
            </Text>
            <Text style={{ color: '#cccccc', fontSize: '14px', lineHeight: '2.2' }}>
              この度はご来店、誠にありがとうございました。
              {reserveDate && (
                <><br />{reserveDate}{reserveTime ? ` ${reserveTime}` : ''}のご来店を、スタッフ一同心より楽しみにしております。</>
              )}
            </Text>
            <Text style={{ color: '#888', fontSize: '13px', lineHeight: '2' }}>
              またのご来店を、心よりお待ちしております。<br />
              次回ご来店の際には、スタッフへお気軽にお声がけください。
            </Text>
          </Section>

          <Hr style={{ borderColor: '#1a1a1a', margin: '0 48px' }} />

          {/* CTA */}
          <Section style={{ padding: '32px 48px', textAlign: 'center' }}>
            <Button
              href="https://club-animo.com/reserve"
              style={{ backgroundColor: '#d4af5c', color: '#000000', padding: '14px 36px', fontSize: '12px', letterSpacing: '0.15em', borderRadius: '2px', textDecoration: 'none', fontWeight: 700 }}
            >
              次回のご予約はこちら
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '24px 48px 40px', textAlign: 'center' }}>
            <Text style={{ color: '#444', fontSize: '11px', lineHeight: '1.8' }}>
              CLUB Animo<br />
              神奈川県横浜市中区花咲町<br />
              TEL: 0800-888-8788<br />
              営業時間: 20:00 – 翌04:00
            </Text>
          </Section>

          <div style={{ height: '2px', background: 'linear-gradient(to right, #9d8332, #d4af5c, #9d8332)' }} />
        </Container>
      </Body>
    </Html>
  );
}
