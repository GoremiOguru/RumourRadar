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
      title: 'Claim Not Found • Rumor Radar',
      description: 'The requested rumor verification result could not be found.'
    };
  }

  const claim = result.extractedClaim.normalizedClaim;
  const verdict = result.verdict;

  return {
    title: `${verdict}: "${claim.slice(0, 60)}..." • Rumor Radar`,
    description: `Official Fact-Check: ${result.shortExplanation}`,
    openGraph: {
      title: `Rumor Radar Verdict: ${verdict}`,
      description: `Claim: "${claim}" — ${result.shortExplanation}`,
      type: 'article',
      siteName: 'Rumor Radar AI'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Rumor Radar: ${verdict}`,
      description: `Claim: "${claim}" — ${result.shortExplanation}`
    }
  };
}

export default async function CheckPage({ params }: Props) {
  const { id } = await params;
  const result = await getVerificationFromDB(id);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Verification Record Not Found</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            This verification link may have expired or was run in a local session that has refreshed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Verify a New Rumor</span>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation & Share Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Radar</span>
          </Link>

          <span className="text-xs font-mono text-slate-500">
            ID: {result.id}
          </span>
        </div>

        {/* Main Verdict Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Official Provenance Record
              </span>
              <div>
                <VerdictBadge verdict={result.verdict} size="lg" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Permanent Link Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-300">Checked Claim:</span>
                  <span className="font-mono text-[11px]">{result.extractedClaim.location || 'Nigeria'}</span>
                </div>
                <p className="font-medium text-slate-200 italic">
                  "{result.extractedClaim.normalizedClaim}"
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Evidence-Based Explanation</span>
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                  {result.shortExplanation}
                </p>
              </div>

              {result.pidginExplanation && (
                <div className="space-y-1 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
                  <strong className="text-emerald-300 font-semibold">Naija Pidgin 🇳🇬:</strong>
                  <p className="text-slate-300 italic">{result.pidginExplanation}</p>
                </div>
              )}

              {result.keyQuote && (
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-200">
                  <Quote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-emerald-300">Primary Source Evidence:</strong>
                    <p className="italic text-emerald-100/90">{result.keyQuote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ConfidenceMeter
                confidence={result.confidence}
                score={result.confidenceScore}
              />

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2 text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Verified At:</span>
                  <span className="font-mono text-slate-300 font-semibold">{result.verifiedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target Entity:</span>
                  <span className="font-semibold text-slate-300">{result.extractedClaim.entity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="capitalize text-slate-300">{result.extractedClaim.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {result.factCheckFound && result.factCheckDetails && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-300 font-bold">
                  <span>Published Fact-Check Found</span>
                  <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    Google Fact Check Tools API
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong>{result.factCheckDetails.publisher}</strong>: <span className="text-slate-200 font-medium">"{result.factCheckDetails.rating}"</span>
                </p>
              </div>
              {result.factCheckDetails.reviewUrl && (
                <a
                  href={result.factCheckDetails.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:text-white transition-colors shrink-0"
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
          <h3 className="text-base font-bold text-slate-100">
            Ranked Authoritative Evidence ({result.evidence.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.evidence.map((item, idx) => (
              <EvidenceCard key={item.id} evidence={item} rank={idx + 1} />
            ))}
          </div>
        </div>

        {/* Pipeline Transparency Inspector */}
        <PipelineInspector result={result} />
      </main>

      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rumor Radar • NACOS National Hackathon</span>
          <Link href="/" className="text-emerald-400 hover:underline">
            Launch Radar Scanner
          </Link>
        </div>
      </footer>
    </div>
  );
}
