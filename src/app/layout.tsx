import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://rumour-radar.vercel.app')
  ),
  title: {
    default: 'Rumor Radar • Nigeria-First AI Fact-Checking & Evidence Engine',
    template: '%s • Rumor Radar'
  },
  description: 'Evidence-first AI disinformation verification system designed for Nigeria. Verifies viral WhatsApp forwards, breaking headlines, and social claims against CBN, INEC, NCDC, and certified fact-checkers.',
  applicationName: 'Rumor Radar',
  authors: [{ name: 'Rumor Radar Dev Team' }],
  creator: 'Rumor Radar AI',
  publisher: 'NACOS National Hackathon',
  keywords: [
    'Rumor Radar',
    'Fact Check Nigeria',
    'Fake News Detection Nigeria',
    'WhatsApp Forward Verifier',
    'CBN Rumors',
    'OPay Shutdown Hoax',
    'JAMB Cutoff Mark Verification',
    'NCDC Cholera Alert',
    'NACOS Hackathon AI',
    'Nigerian Disinformation Engine',
    'Evidence Grounded AI'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    title: 'Rumor Radar — Nigeria-First Evidence AI Fact-Checker',
    description: 'Stop rumors before they spread in Nigeria. Live evidence retrieval, authority routing (CBN, INEC, NCDC), and zero-hallucination verification.',
    siteName: 'Rumor Radar'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rumor Radar — Nigeria-First Evidence AI Fact-Checker',
    description: 'Verify viral WhatsApp forwards, breaking news, and social claims in Nigeria with real evidence and citations.',
    creator: '@RumorRadarAI'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
