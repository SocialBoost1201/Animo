import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Hr
} from '@react-email/components';

type BirthdayEmailProps = {
  customerName: string;
};

export function BirthdayEmail({ customerName }: BirthdayEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: '"YuMincho", "游明朝", "Noto Serif JP", Georgia, serif' }}>
        <Container style={{ maxWidth: '540px', margin: '40px auto', backgroundColor: '#0d0d0d', padding: '0' }}>
          <div style={{ height: '2px', background: 'linear-gradient(to right, #9d8332, #d4af5c, #9d8332)' }} />

          <Section style={{ padding: '48px 48px 24px', textAlign: 'center' }}>
            <Text style={{ color: '#d4af5c', fontSize: '28px', margin: '0 0 8px' }}>🎂</Text>
            <Heading style={{ color: '#d4af5c', fontSize: '20px', fontWeight: 400, letterSpacing: '0.3em', margin: 0 }}>
              Happy Birthday
            </Heading>
            <Text style={{ color: '#888', fontSize: '12px', letterSpacing: '0.15em', marginTop: '6px' }}>
              CLUB Animo よりお届けします
            </Text>
          </Section>

          <Hr style={{ borderColor: '#1a1a1a', margin: '0 48px' }} />

          <Section style={{ padding: '40px 48px' }}>
            <Text style={{ color: '#cccccc', fontSize: '15px', lineHeight: '2' }}>
              {customerName} 様
            </Text>
            <Text style={{ color: '#cccccc', fontSize: '14px', lineHeight: '2.2' }}>
              お誕生日、誠におめでとうございます。<br />
              いつも CLUB Animo をご愛顧いただき、心より感謝申し上げます。
            </Text>
            <Text style={{ color: '#888', fontSize: '13px', lineHeight: '2' }}>
              誕生日月にご来店いただいたお客様には、特別なサービスをご用意しております。<br />
              この機会にぜひ、特別なひとときをお過ごしください。
            </Text>

            {/* Birthday Benefit */}
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px', margin: '24px 0', borderRadius: '2px' }}>
              <Text style={{ color: '#d4af5c', fontSize: '12px', letterSpacing: '0.15em', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Birthday Special
              </Text>
              <Text style={{ color: '#cccccc', fontSize: '13px', lineHeight: '1.8', margin: 0 }}>
                誕生日月ご来店で「ボトル特典」または「スペシャルデザートプレート」をご用意いたします。
              </Text>
            </div>
          </Section>

          <Hr style={{ borderColor: '#1a1a1a', margin: '0 48px' }} />

          <Section style={{ padding: '32px 48px', textAlign: 'center' }}>
            <Button
              href="https://club-animo.com/reserve"
              style={{ backgroundColor: '#d4af5c', color: '#000000', padding: '14px 36px', fontSize: '12px', letterSpacing: '0.15em', borderRadius: '2px', textDecoration: 'none', fontWeight: 700 }}
            >
              バースデーご予約はこちら
            </Button>
            <Text style={{ color: '#444', fontSize: '11px', marginTop: '16px' }}>
              またはお電話にてご予約ください: 0800-888-8788
            </Text>
          </Section>

          <Section style={{ padding: '16px 48px 40px', textAlign: 'center' }}>
            <Text style={{ color: '#444', fontSize: '11px', lineHeight: '1.8' }}>
              CLUB Animo ／ 神奈川県横浜市中区花咲町<br />
              営業時間: 20:00 – 翌04:00
            </Text>
          </Section>

          <div style={{ height: '2px', background: 'linear-gradient(to right, #9d8332, #d4af5c, #9d8332)' }} />
        </Container>
      </Body>
    </Html>
  );
}
