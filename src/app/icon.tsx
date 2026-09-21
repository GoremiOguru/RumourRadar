import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#022c22',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#34d399',
          borderRadius: '8px',
          border: '1.5px solid #10b981',
          fontWeight: 900,
        }}
      >
        📡
      </div>
    ),
    {
      ...size,
    }
  );
}
