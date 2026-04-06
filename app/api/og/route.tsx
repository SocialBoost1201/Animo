import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// NOTE: You can also use a custom font by fetching it.
// e.g:
// const fontData = fetch(new URL('../../../assets/fonts/NotoSerifJP-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 50)
      : 'CLUB Animo | 高級キャバクラ・ラウンジ';
    const category = searchParams.get('category') || 'Official Website';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at center, #1a1500 0%, #0a0a0a 100%)',
            fontFamily: 'serif',
            color: '#fff',
            padding: '40px 80px',
            textAlign: 'center',
          }}
        >
          {/* Logo / Brand Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                color: '#d4af37', // Gold color
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              Club Animo
            </div>
          </div>

          {/* Category / Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#d4af37',
              letterSpacing: '0.1em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            {category}
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.4,
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          
          {/* Bottom decorative line */}
          <div
            style={{
              display: 'flex',
              marginTop: '50px',
              width: '120px',
              height: '2px',
              backgroundColor: '#d4af37',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        /* fonts: [
          {
            name: 'NotoSerif',
            data: await fontData,
            style: 'normal',
          },
        ], */
      }
    );
  } catch (error: unknown) {
    console.log('Failed to generate OG image', error);
    return new Response(`Failed to generate OG image`, {
      status: 500,
    });
  }
}
