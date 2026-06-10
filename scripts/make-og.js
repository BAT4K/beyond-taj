const fs = require('fs');

const svgContent = fs.readFileSync('app/icon.svg', 'utf8');

// Extract the <g>...</g> part
const gContentMatch = svgContent.match(/<g[^>]*>([\s\S]*?)<\/g>/);
const gContent = gContentMatch ? gContentMatch[0] : '';

const tsxContent = `
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Beyond Taj';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        <svg viewBox="1 40 1184 1184" width="250" height="250">
          ${gContent}
        </svg>
        <div
          style={{
            marginTop: 40,
            fontSize: 80,
            color: '#eec155',
            letterSpacing: '0.05em',
            fontWeight: 'normal',
          }}
        >
          Beyond Taj
        </div>
      </div>
    ),
    { ...size }
  );
}
`;

fs.writeFileSync('app/opengraph-image.tsx', tsxContent);
console.log('Successfully created app/opengraph-image.tsx');
