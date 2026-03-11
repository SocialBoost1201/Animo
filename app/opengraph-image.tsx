import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CLUB Animo | 関内・馬車道の高級キャバクラ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(196,160,90,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(196,160,90,0.10) 0%, transparent 60%)',
          gap: '24px',
        }}
      >
        {/* Gold divider top */}
        <div style={{ width: '60px', height: '1px', backgroundColor: '#C4A05A', opacity: 0.7 }} />

        {/* Logo / Club name */}
        <div
          style={{
            fontFamily: 'serif',
            fontSize: '72px',
            fontWeight: '300',
            color: '#C4A05A',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            display: 'flex',
          }}
        >
          CLUB ANIMO
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '18px',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          関内・馬車道の高級キャバクラ
        </div>

        {/* Gold divider bottom */}
        <div style={{ width: '60px', height: '1px', backgroundColor: '#C4A05A', opacity: 0.7 }} />
      </div>
    ),
    { ...size }
  );
}
