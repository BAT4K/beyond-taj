import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Beyond Taj';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const playfairData = await fetch(
    new URL('../public/fonts/PlayfairDisplay-Regular.woff', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0806',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <div
          style={{
            marginTop: 40,
            fontSize: 80,
            color: '#ffffff',
            letterSpacing: '0.05em',
            fontWeight: 'normal',
            fontFamily: '"Playfair Display"',
          }}
        >
          Beyond Taj
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairData,
          style: 'normal',
        },
      ],
    }
  );
}
