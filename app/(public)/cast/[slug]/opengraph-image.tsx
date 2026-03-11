import { ImageResponse } from 'next/og';
import { getPublicCastBySlug } from '@/lib/actions/public/data';

export const runtime = 'edge';
export const alt = 'Cast Profile | CLUB Animo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const cast = await getPublicCastBySlug(params.slug);

  const stageName = cast?.stage_name ?? 'CAST';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryImage = cast?.cast_images?.find((img: any) => img.is_primary) ?? cast?.cast_images?.[0];
  const imageUrl: string | undefined = primaryImage?.image_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Left: Cast photo */}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={stageName}
            style={{
              width: '480px',
              height: '630px',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        ) : (
          <div
            style={{
              width: '480px',
              height: '630px',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#C4A05A', fontSize: '64px', fontFamily: 'serif' }}>A</span>
          </div>
        )}

        {/* Overlay gradient on photo */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '480px',
            height: '630px',
            background: 'linear-gradient(to right, transparent 50%, #0a0a0a 100%)',
            display: 'flex',
          }}
        />

        {/* Right: Info panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '60px 56px',
            gap: '20px',
          }}
        >
          {/* Gold line */}
          <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A05A' }} />

          {/* Cast name */}
          <div
            style={{
              fontFamily: 'serif',
              fontSize: '60px',
              fontWeight: '300',
              color: '#ffffff',
              letterSpacing: '0.1em',
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            {stageName}
          </div>

          {/* Label */}
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: '14px',
              color: '#C4A05A',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Cast Profile
          </div>

          {/* Gold line */}
          <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A05A', opacity: 0.5 }} />

          {/* Club name footer */}
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            CLUB ANIMO — KANNAI
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
