'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EvidenceCard } from '@/components/EvidenceCard';
import { PipelineInspector } from '@/components/PipelineInspector';
import { WhyRumorRadarModal } from '@/components/WhyRumorRadarModal';
import { WhatsAppShareCard } from '@/components/WhatsAppShareCard';
import { NewsroomTipButton } from '@/components/NewsroomTipButton';
import { BmoniSubscriptionModal } from '@/components/BmoniSubscriptionModal';
import { BrandShieldDashboard } from '@/components/BrandShieldDashboard';
import { PidginVoicePlayer } from '@/components/PidginVoicePlayer';
import { NigeriaHeatmap } from '@/components/NigeriaHeatmap';
import { DeepfakeVideoScanner } from '@/components/DeepfakeVideoScanner';
import { AboutSection } from '@/components/AboutSection';
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
  Layers,
  Brain,
  Database,
  Calculator,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  X,
  Upload,
  Radio,
  Building2,
  Zap,
  MapPin,
  Video,
  Info
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'verify' | 'brand_shield' | 'heatmap' | 'deepfake' | 'about'>('verify');

  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usePidgin, setUsePidgin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isBmoniModalOpen, setIsBmoniModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const evidenceScrollRef = useRef<HTMLDivElement>(null);
  const pillarsScrollRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Navigation (Slash to focus claim search, Esc to close modals)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && activeTab === 'verify' && document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('rumor-input')?.focus();
      }
      if (e.key === 'Escape') {
        setIsWhyModalOpen(false);
        setIsBmoniModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = async (textToVerify?: string) => {
    const text = textToVerify || query;
    if ((!text || text.trim().length === 0) && !selectedImage) return;

    setLoading(true);
    setError(null);
    if (textToVerify) setQuery(textToVerify);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          imageBase64: selectedImage || undefined,
          mimeType: selectedImage ? 'image/jpeg' : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to complete verification pipeline');
      }

      const data: VerificationResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while verifying the claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setSelectedImage(null);
    setImageFileName(null);
    setQuery(presetPrompt);
    handleVerify(presetPrompt);
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const shareText = `🔍 *RUMOR RADAR VERIFICATION*\n\n📌 *Claim:* "${result.extractedClaim.normalizedClaim}"\n\n⚖️ *Verdict:* ${result.verdict}\n🎯 *Confidence:* ${result.confidence} (${result.confidenceScore}%)\n\n📝 *Summary:* ${result.shortExplanation}\n\n🔗 Verified at: ${result.verifiedAt}\nPowered by Rumour Radar AI`;
    
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="app-shell min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header 
        onOpenWhyModal={() => setIsWhyModalOpen(true)} 
        onOpenBmoniModal={() => setIsBmoniModalOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Navigation Tabs - Mobile Optimized 5-Tab Control */}
        <div className="w-full flex justify-center">
          <div className="w-full sm:w-auto grid grid-cols-5 sm:flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab('verify')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${
                activeTab === 'verify'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight font-display">
                <span className="sm:hidden">Verify</span>
                <span className="hidden sm:inline">Claim Verify</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('brand_shield')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${
                activeTab === 'brand_shield'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight font-display">
                <span className="sm:hidden">Shield</span>
                <span className="hidden sm:inline">Brand Shield</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${
                activeTab === 'heatmap'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-lg shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight font-display">
                <span className="sm:hidden">Heatmap</span>
                <span className="hidden sm:inline">Geo Heatmap</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('deepfake')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${
                activeTab === 'deepfake'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight font-display">
                <span className="sm:hidden">Deepfake</span>
                <span className="hidden sm:inline">Deepfake Video</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${
                activeTab === 'about'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight font-display">
                <span>About</span>
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'brand_shield' ? (
          <BrandShieldDashboard onOpenSubscriptionModal={() => setIsBmoniModalOpen(true)} />
        ) : activeTab === 'heatmap' ? (
          <NigeriaHeatmap onSelectClaim={(claim) => {
            setActiveTab('verify');
            setQuery(claim);
            handleVerify(claim);
          }} />
        ) : activeTab === 'deepfake' ? (
          <DeepfakeVideoScanner />
        ) : activeTab === 'about' ? (
          <AboutSection onSelectTab={(tab) => setActiveTab(tab)} />
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center space-y-3 pt-2">
              <div className="hero-reveal inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Dual-Rail AI Fact-Checking Engine • Powered by BMONI Rails</span>
              </div>

              <h1 className="hero-reveal hero-reveal-delay-1 text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
                Stop Rumors Before They{' '}
                <span className="whitespace-nowrap">
                  <span className="text-[#008751]">
                    {'Spread'.split('').map((letter, index, letters) => (
                      <span
                        key={`spread-${index}`}
                        className="hero-letter"
                        style={{ animationDelay: `${(letters.length - 1 - index) * 70}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>{' '}
                  in{' '}
                  <span className="text-[#008751]">
                    {'Nigeria'.split('').map((letter, index) => (
                      <span
                        key={`nigeria-${index}`}
                        className="hero-letter"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </span>
              </h1>

              <p className="hero-reveal hero-reveal-delay-2 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                Paste any viral WhatsApp message, Twitter headline, news link, or <strong>upload a screenshot</strong>. Rumor Radar checks verified registries, searches official Nigerian authorities, and returns an evidence-grounded verdict in seconds.
              </p>
            </div>

            {/* Why Rumor Radar Banner */}
            <div
              onClick={() => setIsWhyModalOpen(true)}
              className="glass-panel group cursor-pointer rounded-xl border-emerald-500/30 p-4 sm:p-5 hover:border-emerald-500/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                      Why Rumour Radar isn&apos;t just &quot;ask an LLM&quot;
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Zero Hallucination
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dual-rail failover (Gemini + OpenRouter) • Nigeria Authority Router • 5 verdict categories • BMONI Virtual Accounts
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
              <div className="glass-panel relative rounded-2xl p-2 sm:p-3 focus-within:border-emerald-500/50 transition-all">
                {selectedImage && (
                  <div className="mb-2 p-2 rounded-xl bg-slate-800/80 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-300 truncate max-w-xs">{imageFileName}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImageFileName(null);
                      }}
                      className="p-1 rounded-full bg-slate-700 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <textarea
                  id="rumor-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Paste a viral WhatsApp forward, Twitter headline, news link, or upload an image screenshot..."
                  className="w-full h-28 sm:h-32 bg-transparent resize-none p-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 px-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedImage ? 'Replace Screenshot' : 'Upload Screenshot / Memo'}</span>
                    </button>

                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {query.length} {query.length === 1 ? 'char' : 'chars'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {(query || selectedImage) && (
                      <button
                        onClick={() => {
                          setQuery('');
                          setSelectedImage(null);
                          setImageFileName(null);
                          setResult(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      id="check-rumor-btn"
                      onClick={() => handleVerify()}
                      disabled={loading || (!query.trim() && !selectedImage)}
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

              {/* Quick Demo Pills - Horizontal Track */}
              {!result && !loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-slate-300 font-display">
                      Try a real circulating claim
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">← Swipe presets →</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                    {DEMO_PRESETS.map((preset) => {
                      const isEmerald = preset.badgeColor === 'emerald';
                      const isRose = preset.badgeColor === 'rose';
                      const isAmber = preset.badgeColor === 'amber';
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset.prompt)}
                          className="px-3.5 py-2 rounded-xl border border-slate-800/90 bg-slate-900/70 hover:bg-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 transition-all flex items-center space-x-2 group shrink-0 whitespace-nowrap active:scale-95 shadow-sm"
                        >
                          <span className="font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">
                            {preset.title}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isEmerald ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                            isRose ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                            isAmber ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {preset.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
              <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Search className="w-8 h-8 animate-bounce text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-3 max-w-lg mx-auto text-left">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-200">Executing Dual-Rail Verification Pipeline</h3>
                    <p className="text-xs text-slate-400">
                      Routing to official Nigerian regulators • Google Fact Check database • Synthesizing authoritative evidence...
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {['Extracting claim', 'Checking Nigerian sources', 'Ranking evidence'].map((stage, index) => (
                      <div
                        key={stage}
                        className="glass-panel-subtle rounded-lg p-3 text-center text-xs text-slate-300"
                        style={{ animationDelay: `${index * 140}ms` }}
                      >
                        <span className="mb-2 mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 font-mono">
                          {index + 1}
                        </span>
                        {stage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Verification Result Showcase */}
            {result && !loading && (
              <div
                key={result.extractedClaim.normalizedClaim}
                className="space-y-6 animate-result-enter"
              >
                {/* Main Verdict Card */}
                <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-6">
                  {/* Header with Badges & Share */}
                  <div className="flex flex-col gap-3 pb-4 border-b border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                        Official Verdict
                      </span>
                      <div>
                        <VerdictBadge verdict={result.verdict} size="lg" />
                      </div>
                    </div>

                    <div className="flex max-w-full shrink-0 items-center gap-2 overflow-x-auto pb-1 sm:translate-y-2">
                      {/* Newsroom Tipping Button */}
                      <NewsroomTipButton 
                        sourceName={result.evidence[0]?.sourceName} 
                        domain={result.evidence[0]?.domain} 
                      />

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
                        <span className="hidden sm:inline">{usePidgin ? 'Switch to English' : 'Naija Pidgin 🇳🇬'}</span>
                      </button>

                      {/* Share button */}
                      <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all"
                        title="Copy WhatsApp formatted summary"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share WhatsApp'}</span>
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
                        <span className="hidden sm:inline">Permalink</span>
                      </a>
                    </div>
                  </div>

                  {/* Grid: Explanation + Confidence */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                    <div className="md:col-span-2 space-y-4">
                      {/* Normalized Claim Box */}
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="font-semibold text-slate-300">Checked Claim:</span>
                          <span className="font-mono text-[11px]">{result.extractedClaim.location}</span>
                        </div>
                        <p className="font-medium text-slate-200 italic">
                          &quot;{result.extractedClaim.normalizedClaim}&quot;
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

                      {/* Nigerian Audio Voice Player */}
                      <PidginVoicePlayer 
                        pidginText={result.pidginExplanation || result.shortExplanation}
                        englishText={result.shortExplanation}
                        claimEntity={result.extractedClaim.entity}
                        verdict={result.verdict}
                      />

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
                          <strong>{result.factCheckDetails.publisher}</strong> reviewed this: <span className="text-slate-200 font-medium">&quot;{result.factCheckDetails.rating}&quot;</span>
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

                  {/* WhatsApp Status Export Card */}
                  <WhatsAppShareCard result={result} />
                </div>

                {/* Horizontal Ranked Authoritative Evidence Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                        <span>Ranked Authoritative Evidence ({result.evidence.length})</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Horizontal Audit Rail
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Ranked by Authority (30%), Relevance (25%), Recency (20%), Corroboration (15%), Context (10%)
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => evidenceScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                        title="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => evidenceScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                        title="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div 
                    ref={evidenceScrollRef}
                    className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700"
                  >
                    {result.evidence.map((item, idx) => (
                      <div
                        key={item.id}
                        className="min-w-[280px] sm:min-w-[340px] max-w-[380px] shrink-0 snap-start animate-result-enter flex flex-col"
                        style={{ animationDelay: `${idx * 80}ms` }}
                      >
                        <EvidenceCard evidence={item} rank={idx + 1} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Transparency Inspector */}
                <PipelineInspector result={result} />
              </div>
            )}

            {/* 6 Architectural Pillars Feature Cards - Horizontal Track */}
            {!result && !loading && (
              <div className="space-y-4 pt-4 border-t border-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-200 flex items-center gap-2">
                      <span>The 6 Pillars of Rumour Radar</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Zero-Hallucination Architecture
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">How our pipeline ensures factual accuracy and zero hallucination</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => pillarsScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => pillarsScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsWhyModalOpen(true)}
                      className="hidden sm:inline-flex text-xs text-emerald-400 hover:text-emerald-300 font-semibold ml-2"
                    >
                      View Comparison &rarr;
                    </button>
                  </div>
                </div>

                <div 
                  ref={pillarsScrollRef}
                  className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700"
                >
                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold mb-2">
                        <Brain className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Evidence-Grounded</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Forbidden from using training memory. Synthesizes answers exclusively over live verified sources retrieved for that claim.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold mb-2">
                        <Database className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Nigeria-First Router</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Targeted routing to CBN, INEC, NCDC, JAMB, and WAEC databases prevents social media noise from skewing verdicts.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold mb-2">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Deterministic Scoring</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Formula: <span className="text-slate-300 font-mono">0.30×Auth + 0.25×Rel + 0.20×Rec + 0.15×Corr + 0.10×Ctx</span>.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold mb-2">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Fixed Verdict Schema</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Strict schema: Supported, Contradicted, Misleading, Satire, or Unverified with verified source citations & timestamps.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold mb-2">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Built-in Humility</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        If confidence falls below 60%, it deliberately yields <span className="text-slate-300 font-semibold">Unverified</span> instead of hallucinating.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[270px] sm:min-w-[310px] max-w-[350px] shrink-0 snap-start p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold mb-2">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-200">Production Hardened</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Fast cache layer, multi-search provider fallback chains, and adversarial defense against Nigerian satire & jailbreaks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Why Not ChatGPT / Why Rumor Radar Modal */}
      <WhyRumorRadarModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />

      {/* BMONI Subscription Modal */}
      <BmoniSubscriptionModal
        isOpen={isBmoniModalOpen}
        onClose={() => setIsBmoniModalOpen(false)}
      />
    </div>
  );
}
