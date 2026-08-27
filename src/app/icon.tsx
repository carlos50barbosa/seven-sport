import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon: o "7" da Seven em dourado sobre o verde da marca. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A2E16',
          color: '#C9A24A',
          fontSize: 44,
          fontWeight: 800,
          borderBottom: '6px solid #1B8F3A',
        }}
      >
        7
      </div>
    ),
    size,
  );
}
