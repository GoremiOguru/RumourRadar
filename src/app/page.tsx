'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EvidenceCard } from '@/components/EvidenceCard';
import { PipelineInspector } from '@/components/PipelineInspector';
import { WhyRumorRadarModal } from '@/components/WhyRumorRadarModal';
import { DEMO_PRESETS } from '@/lib/constants';
import { VerificationResult } from '@/types';
import {
  Search,
  Sparkles,
  RefreshCw,
  Share2,
  Check,
  Languages,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Quote,
  Clock,
  Zap,
  Layers,
  Brain,
  Database,
  Calculator,
  AlertTriangle,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usePidgin, setUsePidgin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  const handleVerify = async (textToVerify?: string) => {
    const text = textToVerify || query;
    if (!text || text.trim().length === 0) return;

    setLoading(true);
    setError(null);
    if (textToVerify) setQuery(textToVerify);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) {
        throw new Error('Failed to complete verification pipeline');
      }

      const data: VerificationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while verifying the claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setQuery(presetPrompt);
    handleVerify(presetPrompt);
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const shareText = `🔍 *RUMOR RADAR VERIFICATION*\n\n📌 *Claim:* "${result.extractedClaim.normalizedClaim}"\n\n⚖️ *Verdict:* ${result.verdict}\n🎯 *Confidence:* ${result.confidence} (${result.confidenceScore}%)\n\n📝 *Summary:* ${result.shortExplanation}\n\n🔗 Verified at: ${result.verifiedAt}\nPowered by Rumor Radar AI (NACOS Hackathon)`;
    
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header onOpenWhyModal={() => setIsWhyModalOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Evidence-First AI Fact-Checking Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Stop Rumors Before They Spread in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Nigeria</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Paste any viral WhatsApp message, Twitter headline, or breaking forward. Rumor Radar checks verified registries, searches official Nigerian authorities, and returns an evidence-grounded verdict in seconds.
          </p>
        </div>

        {/* Why Not ChatGPT Banner */}
        <div 
          onClick={() => setIsWhyModalOpen(true)}
          className="group cursor-pointer rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                  Rumor Radar isn't just "ask an LLM"
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Zero Hallucination
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evidence-grounded verifier • Nigeria-First Authority Router • 5-factor scoring formula • Built-in humility (&lt;60% rule)
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWhyModalOpen(true);
            }}
            className="self-end sm:self-center flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shrink-0"
          >
            <span>Compare Architecture</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Input Form & Demo Pills */}
        <div className="space-y-4">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-2 sm:p-3 shadow-2xl backdrop-blur-xl focus-within:border-emerald-500/50 transition-all">
            <textarea
              id="rumor-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste a viral WhatsApp forward, Twitter headline, or news link here (e.g., 'OPay is shutting down operations in Nigeria next month...')"
              className="w-full h-28 sm:h-32 bg-transparent resize-none p-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 px-2">
              <span className="text-xs text-slate-400 font-mono">
                {query.length} characters
              </span>

              <div className="flex items-center space-x-2">
                {query && (
                  <button
                    onClick={() => { setQuery(''); setResult(null); }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  id="check-rumor-btn"
                  onClick={() => handleVerify()}
                  disabled={loading || !query.trim()}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Scanning Evidence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Check This Claim</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo Pills */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Quick Test Cases:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.prompt)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800/90 hover:border-emerald-500/40 text-xs text-slate-300 transition-all flex items-center space-x-1.5 group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{preset.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.2 bg-slate-950 rounded">
                    {preset.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-300 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6 text-center animate-pulse">
            <div className="flex justify-center">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Search className="w-8 h-8 animate-bounce text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-200">Executing Evidence Pipeline</h3>
              <p className="text-xs text-slate-400">
                Querying Google Fact Check Tools API • Routing to official Nigerian regulators • Ranking authoritative evidence...
              </p>
            </div>
          </div>
        )}

        {/* Verification Result Showcase */}
        {result && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Verdict Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Header with Badges & Share */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Official Verdict
                  </span>
                  <div>
                    <VerdictBadge verdict={result.verdict} size="lg" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  {/* Pidgin Toggle */}
                  <button
                    onClick={() => setUsePidgin(!usePidgin)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      usePidgin
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{usePidgin ? 'Switch to English' : 'Naija Pidgin 🇳🇬'}</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all"
                    title="Copy WhatsApp formatted summary"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Share WhatsApp'}</span>
                  </button>

                  {/* Permalink button */}
                  <a
                    href={`/check/${result.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 transition-all"
                    title="Open shareable permanent link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Permalink</span>
                  </a>
                </div>
              </div>

              {/* Grid: Explanation + Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {/* Normalized Claim Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-300">Checked Claim:</span>
                      <span className="font-mono text-[11px]">{result.extractedClaim.location}</span>
                    </div>
                    <p className="font-medium text-slate-200 italic">
                      "{result.extractedClaim.normalizedClaim}"
                    </p>
                  </div>

                  {/* Plain English or Pidgin Explanation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{usePidgin ? 'Why e be so (Pidgin Summary)' : 'Evidence-Based Explanation'}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                      {usePidgin && result.pidginExplanation ? result.pidginExplanation : result.shortExplanation}
                    </p>
                  </div>

                  {/* Key Quote Callout (if available) */}
                  {result.keyQuote && (
                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-200">
                      <Quote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="font-semibold text-emerald-300">Primary Source Evidence:</strong>
                        <p className="italic text-emerald-100/90">{result.keyQuote}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confidence & Timing Column */}
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

              {/* Fact Check Tools Banner (if matched) */}
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
                      <strong>{result.factCheckDetails.publisher}</strong> reviewed this: <span className="text-slate-200 font-medium">"{result.factCheckDetails.rating}"</span>
                    </p>
                  </div>
                  {result.factCheckDetails.reviewUrl && (
                    <a
                      href={result.factCheckDetails.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:text-white transition-colors shrink-0"
                    >
                      <span>Read Full Fact-Check</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Evidence Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Ranked Authoritative Evidence ({result.evidence.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ranked by Authority (30%), Relevance (25%), Recency (20%), Corroboration (15%), Context (10%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.evidence.map((item, idx) => (
                  <EvidenceCard key={item.id} evidence={item} rank={idx + 1} />
                ))}
              </div>
            </div>

            {/* Pipeline Transparency Inspector */}
            <PipelineInspector result={result} />
          </div>
        )}

        {/* 6 Architectural Pillars Feature Cards */}
        {!result && !loading && (
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-200">The 6 Pillars of Rumor Radar</h3>
                <p className="text-xs text-slate-400">How our pipeline ensures factual accuracy and zero hallucination</p>
              </div>
              <button
                onClick={() => setIsWhyModalOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                View Full Comparison &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Evidence-Grounded</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Forbidden from using training memory. Synthesizes answers exclusively over live verified sources retrieved for that claim.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Nigeria-First Router</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Targeted routing to CBN, INEC, NCDC, JAMB, and WAEC databases prevents social media noise from skewing verdicts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                  <Calculator className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Deterministic Scoring</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Formula: <span className="text-slate-300 font-mono">0.30×Auth + 0.25×Rel + 0.20×Rec + 0.15×Corr + 0.10×Ctx</span> before verifier step.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Fixed Verdict Schema</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict schema: Supported, Contradicted, Misleading, or Unverified with 2–4 verified source citations & timestamps.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Built-in Humility</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If confidence falls below 60%, it deliberately yields <span className="text-slate-300 font-semibold">Unverified</span> instead of hallucinating.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-slate-200">Production Hardened</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast cache layer, multi-search provider fallback chains, and adversarial defense against Nigerian satire & jailbreaks.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Why Rumor Radar Modal */}
      <WhyRumorRadarModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rumor Radar • NACOS National Hackathon (AI Track)</span>
          <span className="text-slate-600">Built with Next.js, Google Fact Check Tools API & Evidence AI</span>
        </div>
      </footer>
    </div>
  );
}

