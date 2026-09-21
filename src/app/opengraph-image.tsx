import { ImageResponse } from 'next/og';

export const alt = 'Rumor Radar — Nigeria-First Evidence AI Fact-Checker';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #064e3b 50%, #020617 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          border: '12px solid #064e3b',
          padding: '40px',
        }}
      >
        {/* Subtle glow background */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(0,0,0,0) 70%)',
            top: '150px',
          }}
        />

        {/* Top Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 24px',
            borderRadius: '9999px',
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#34d399',
          }}
        >
          <span>🇳🇬</span>
          <span>EVIDENCE-FIRST DISINFORMATION RADAR</span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <span>RUMOR </span>
          <span style={{ color: '#34d399', marginLeft: '16px' }}>RADAR</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            maxWidth: '900px',
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Zero Hallucination • Nigeria-First Authority Router • Live Evidence Verifier
        </div>

        {/* Footer Pill Stats */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1.5px solid #1e293b',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '18px',
              color: '#cbd5e1',
              fontWeight: 600,
            }}
          >
            🏛️ CBN • INEC • NCDC • JAMB
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1.5px solid #1e293b',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '18px',
              color: '#cbd5e1',
              fontWeight: 600,
            }}
          >
            ⚖️ Strict Citation Provenance
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1.5px solid #1e293b',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '18px',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            🇳🇬 Naija Pidgin Support
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
