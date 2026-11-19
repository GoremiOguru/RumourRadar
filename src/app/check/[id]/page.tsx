import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerificationFromDB } from '@/lib/supabase';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EvidenceCard } from '@/components/EvidenceCard';
import { PipelineInspector } from '@/components/PipelineInspector';
import { Header } from '@/components/Header';
import {
  ShieldCheck,
  Quote,
  Clock,
  ExternalLink,
  ArrowLeft,
  Share2,
  AlertCircle
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getVerificationFromDB(id);

  if (!result) {
    return {
      title: 'Claim Not Found • Truetalk',
      description: 'The requested rumor verification result could not be found.'
    };
  }

  const claim = result.extractedClaim.normalizedClaim;
  const verdict = result.verdict;

  return {
    title: `${verdict}: "${claim.slice(0, 60)}..." • Truetalk`,
    description: `Official Fact-Check: ${result.shortExplanation}`,
    openGraph: {
      title: `Truetalk Verdict: ${verdict}`,
      description: `Claim: "${claim}" — ${result.shortExplanation}`,
      type: 'article',
      siteName: 'Truetalk Nigeria'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Truetalk: ${verdict}`,
      description: `Claim: "${claim}" — ${result.shortExplanation}`
    }
  };
}

export default async function CheckPage({ params }: Props) {
  const { id } = await params;
  const result = await getVerificationFromDB(id);

  if (!result) {
    return (
      <div className="min-h-screen bg-white text-[#0C2340] flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0C2340] font-display">Verification Record Not Found</h1>
          <p className="text-[#64748B] text-sm max-w-md mx-auto">
            This verification link may have expired or was run in a local session that has refreshed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#005A9C] hover:bg-[#00477E] text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Verify a New Rumor with Truetalk</span>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0C2340] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation & Share Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#005A9C] hover:text-[#00477E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Truetalk</span>
          </Link>

          <span className="text-xs font-mono text-[#64748B]">
            ID: {result.id}
          </span>
        </div>

        {/* Main Verdict Card */}
        <div className="rounded-3xl border border-[#D5E7FA] bg-white p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5E7FA]">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#64748B]">
                Official Sovereign Provenance Record
              </span>
              <div>
                <VerdictBadge verdict={result.verdict} size="lg" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#005A9C] bg-[#EAF3FC] px-3 py-1 rounded-full border border-[#D5E7FA]">
                Permanent Sovereign Record
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#EAF3FC]/60 border border-[#D5E7FA] text-xs text-[#0C2340] space-y-1">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span className="font-bold text-[#005A9C]">Checked Claim:</span>
                  <span className="font-mono text-[11px]">{result.extractedClaim.location || 'Nigeria'}</span>
                </div>
                <p className="font-bold text-sm text-[#0C2340]">
                  &ldquo;{result.extractedClaim.normalizedClaim}&rdquo;
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C2340] flex items-center space-x-1.5 font-display">
                  <ShieldCheck className="w-4 h-4 text-[#005A9C]" />
                  <span>Evidence-Based Explanation</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D5E7FA]">
                  {result.shortExplanation}
                </p>
              </div>

              {result.pidginExplanation && (
                <div className="space-y-1 p-3.5 rounded-2xl bg-[#EAF3FC]/50 border border-[#D5E7FA] text-xs">
                  <strong className="text-[#005A9C] font-bold">Naija Pidgin 🇳🇬:</strong>
                  <p className="text-[#334155] italic">{result.pidginExplanation}</p>
                </div>
              )}

              {result.keyQuote && (
                <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  <Quote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-800">Primary Source Evidence:</strong>
                    <p className="italic text-emerald-900">{result.keyQuote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ConfidenceMeter
                confidence={result.confidence}
                score={result.confidenceScore}
              />

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D5E7FA] text-xs space-y-2 text-[#64748B]">
                <div className="flex items-center justify-between">
                  <span>Verified At:</span>
                  <span className="font-mono text-[#0C2340] font-bold">{result.verifiedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target Entity:</span>
                  <span className="font-bold text-[#0C2340]">{result.extractedClaim.entity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="capitalize font-medium text-[#0C2340]">{result.extractedClaim.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {result.factCheckFound && result.factCheckDetails && (
            <div className="p-4 rounded-2xl bg-[#EAF3FC] border border-[#D5E7FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-[#005A9C] font-bold">
                  <span>Published Fact-Check Found</span>
                  <span className="bg-[#005A9C]/10 text-[#005A9C] px-2 py-0.5 rounded-full text-[10px] font-mono">
                    Google Fact Check Tools API
                  </span>
                </div>
                <p className="text-[#0C2340]">
                  <strong>{result.factCheckDetails.publisher}</strong>: <span className="text-[#334155] font-semibold">&ldquo;{result.factCheckDetails.rating}&rdquo;</span>
                </p>
              </div>
              {result.factCheckDetails.reviewUrl && (
                <a
                  href={result.factCheckDetails.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#005A9C] text-white hover:bg-[#00477E] transition-colors shrink-0 font-bold"
                >
                  <span>Read Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Ranked Authoritative Evidence */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#0C2340] font-display">
            Ranked Authoritative Evidence ({result.evidence.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.evidence.map((item, idx) => (
              <EvidenceCard key={item.id} evidence={item} rank={idx + 1} />
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#D5E7FA] bg-white py-6 text-center text-xs text-[#64748B]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Truetalk Nigeria • Engineered by Team GODEC</span>
          <Link href="/" className="text-[#005A9C] font-bold hover:underline">
            Launch Verification Engine
          </Link>
        </div>
      </footer>
    </div>
  );
}
