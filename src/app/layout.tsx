import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { LanguageProvider, AppLanguage } from '@/context/LanguageContext';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#005A9C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://truetalk.ng')
  ),
  title: {
    default: 'Truetalk • National Disinformation Surveillance & Evidence Verification',
    template: '%s • Truetalk'
  },
  description: 'National Disinformation Surveillance & Evidence Verification engine for Nigeria by Team GODEC. Verifies viral WhatsApp forwards, breaking headlines, and social claims against CBN, INEC, NCDC, and certified fact-checkers.',
  applicationName: 'Truetalk',
  authors: [{ name: 'Team GODEC' }],
  creator: 'Team GODEC',
  publisher: 'Team GODEC',
  keywords: [
    'Truetalk',
    'Truetalk Nigeria',
    'Team GODEC',
    'Fact Check Nigeria',
    'Fake News Detection Nigeria',
    'WhatsApp Forward Verifier',
    'CBN Rumors',
    'OPay Shutdown Hoax',
    'Paga Financial Protection',
    'JAMB Cutoff Mark Verification',
    'NCDC Cholera Alert',
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
    title: 'Truetalk — National Disinformation Surveillance & Evidence Verification',
    description: 'Stop rumors before they spread in Nigeria. Live evidence retrieval, authority routing (CBN, INEC, NCDC), and zero-hallucination verification.',
    siteName: 'Truetalk'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truetalk — National Disinformation Surveillance & Evidence Verification',
    description: 'Verify viral WhatsApp forwards, breaking news, and social claims in Nigeria with real evidence and citations.',
    creator: '@TruetalkNG'
  },
  manifest: '/manifest.json',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  const initialLocale: AppLanguage = localeCookie === 'pcm' ? 'pcm' : 'en';

  return (
    <html lang={initialLocale} className="light">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/truetalk-logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-[#F8FAFC] text-[#0C2340] min-h-screen antialiased selection:bg-[#005A9C]/20 selection:text-[#005A9C]">
        <LanguageProvider initialLocale={initialLocale}>
          {children}
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Truetalk Nigeria",
              "alternateName": "Truetalk",
              "applicationCategory": "FactCheckingApplication",
              "operatingSystem": "All",
              "description": "National Disinformation Surveillance & Evidence Verification engine for Nigeria by Team GODEC. Verifies viral WhatsApp forwards, breaking headlines, and financial scam claims against CBN, INEC, NCDC, and certified fact-checkers.",
              "url": "https://truetalk.ng",
              "provider": {
                "@type": "Organization",
                "name": "Team GODEC",
                "url": "https://truetalk.ng"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "NGN"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
