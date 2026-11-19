'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HowToUseButton } from '@/components/HowToUseButton';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EvidenceCard } from '@/components/EvidenceCard';
import { PipelineInspector } from '@/components/PipelineInspector';
import { WhyTruetalkModal } from '@/components/WhyTruetalkModal';
import { WhatsAppShareCard } from '@/components/WhatsAppShareCard';
import { PagaSubscriptionModal } from '@/components/PagaSubscriptionModal';
import { BrandShieldDashboard } from '@/components/BrandShieldDashboard';
import { PidginVoicePlayer } from '@/components/PidginVoicePlayer';
import { NigeriaHeatmap } from '@/components/NigeriaHeatmap';
import { AboutSection } from '@/components/AboutSection';
import { PagaPaymentCard } from '@/components/PagaPaymentCard';
import { HeroDecorativeBackground } from '@/components/HeroDecorativeBackground';
import { SectionHelpModal } from '@/components/SectionHelpModal';
import { VerificationResult } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Send,
  ShieldCheck,
  Upload,
  Mic,
  X,
  Flame,
  ArrowRight,
  RefreshCw,
  Languages,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

type MainTab = 'verify' | 'brand_shield' | 'about' | 'heatmap';

export default function Home() {
  const { t, locale, isPidgin } = useLanguage();
  const [activeTab, setActiveTab] = useState<MainTab>('verify');

  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTranslatingResult, setIsTranslatingResult] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isRingFlashing, setIsRingFlashing] = useState(false);
  const [activeVerificationStage, setActiveVerificationStage] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);

  // Cycling overlay prompt state
  const [promptIndex, setPromptIndex] = useState(0);
  const [isTextExiting, setIsTextExiting] = useState(false);
  const [promptRenderKey, setPromptRenderKey] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Modals
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isPagaModalOpen, setIsPagaModalOpen] = useState(false);
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [brandShieldTarget, setBrandShieldTarget] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const verificationStages = useMemo(() => [
    isPidgin ? 'We dey bring out di main claim' : 'Extracting & normalizing claim',
    isPidgin ? 'We dey cross-check official government records' : 'Querying official Nigerian gazettes',
    isPidgin ? 'We dey search certified fact-check registries' : 'Searching verified fact-check registries',
    isPidgin ? 'We dey run Paga financial fraud check' : 'Executing Paga financial fraud check',
    isPidgin ? 'We dey assemble real grounded truth' : 'Synthesizing grounded verdict'
  ], [isPidgin]);

  const cyclingPrompts = useMemo(() => [
    t('engine.placeholder1'),
    t('engine.placeholder2'),
    t('engine.placeholder3'),
    t('engine.placeholder4')
  ], [t]);

  // Restart cycling placeholder when language changes
  useEffect(() => {
    setPromptIndex(0);
    setIsTextExiting(false);
    setPromptRenderKey((k) => k + 1);
  }, [locale]);

  // Cycling overlay prompts animation (crossfades with word-by-word reveal)
  useEffect(() => {
    if (isInputFocused || query.length > 0) return;

    const interval = setInterval(() => {
      setIsTextExiting(true);
      setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % cyclingPrompts.length);
        setPromptRenderKey((k) => k + 1);
        setIsTextExiting(false);
      }, 240);
    }, 3800);

    return () => clearInterval(interval);
  }, [isInputFocused, query, cyclingPrompts.length]);

  // Sync Truetalk Plus state from localStorage
  useEffect(() => {
    const checkPlus = () => {
      if (typeof window !== 'undefined') {
        const active = localStorage.getItem('truetalk_plus_active') === 'true' ||
                       localStorage.getItem('truetalk_pro_active') === 'true';
        setIsPlusActive(active);
      }
    };
    checkPlus();
    window.addEventListener('truetalk_plus_updated', checkPlus);
    window.addEventListener('truetalk_pro_updated', checkPlus);
    window.addEventListener('storage', checkPlus);
    return () => {
      window.removeEventListener('truetalk_plus_updated', checkPlus);
      window.removeEventListener('truetalk_pro_updated', checkPlus);
      window.removeEventListener('storage', checkPlus);
    };
  }, []);

  // Verification stage ticker
  useEffect(() => {
    if (!loading) return;
    const intervalId = window.setInterval(() => {
      setActiveVerificationStage((stage) => (stage + 1) % verificationStages.length);
    }, 700);
    return () => window.clearInterval(intervalId);
  }, [loading, verificationStages.length]);

  const handleVerify = async (textToVerify?: string, forcedLocale?: 'en' | 'pcm') => {
    const claimText = typeof textToVerify === 'string' ? textToVerify : query;
    if (!claimText.trim() && !selectedImage) {
      setError(t('errors.emptyInput'));
      return;
    }

    // Trigger plane fly micro-interaction sequence
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 650);

    setLoading(true);
    setError(null);
    setShowAllSources(false);
    setShowPipeline(false);

    const activeReqLocale = forcedLocale || locale;

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: claimText.trim(),
          imageBase64: selectedImage || undefined,
          mimeType: selectedImage ? 'image/jpeg' : undefined,
          locale: activeReqLocale
        })
      });

      if (!res.ok) {
        throw new Error(`Verification service returned status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || t('errors.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateResult = async () => {
    if (!result) return;
    setIsTranslatingResult(true);
    const targetLocale = locale;
    await handleVerify(result.query || result.extractedClaim.normalizedClaim, targetLocale);
    setIsTranslatingResult(false);
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, JPEG).');
      return;
    }
    setError(null);
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.onerror = () => setError('Could not load image. Please try another file.');
    reader.readAsDataURL(file);
  };

  const handleSpeechInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t('engine.micUnsupported'));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isPidgin ? 'en-NG' : 'en-NG';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setQuery(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition notice:', err);
      setIsListening(false);
    }
  };

  const handleApplyPreset = (presetPrompt: string) => {
    setQuery(presetPrompt);
    setSelectedImage(null);
    setImageFileName(null);
    setIsRingFlashing(true);
    setTimeout(() => setIsRingFlashing(false), 450);
    handleVerify(presetPrompt);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedImage(null);
    setImageFileName(null);
    setResult(null);
    setError(null);
    setShowAllSources(false);
    setShowPipeline(false);
    setIsTextExiting(false);
    setPromptRenderKey((k) => k + 1);
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const claim = result.extractedClaim.normalizedClaim;
    const verdictText = result.verdict === 'CONTRADICTED' ? (isPidgin ? 'E NO BE TRUE' : 'FALSE / DEBUNKED')
      : result.verdict === 'SUPPORTED' ? (isPidgin ? 'CONFIRM TRUE' : 'VERIFIED TRUE')
      : result.verdict === 'MISLEADING' ? (isPidgin ? 'E DEY MISLEAD' : 'MISLEADING')
      : (isPidgin ? 'UNVERIFIED RUMOUR' : 'UNVERIFIED');
    const fact = isPidgin && result.pidginExplanation ? result.pidginExplanation : result.shortExplanation;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://truetalk.ng';
    const link = `${origin}/check/${result.id}`;

    const text = `🚨 *TRUETALK FACT-CHECK*\n\n📌 *Claim:* "${claim}"\n⚖️ *Verdict:* ${verdictText} (${result.confidenceScore}% Confidence)\n\n📝 *The Fact:* ${fact}\n\n🔍 *Verified Source:* ${result.evidence[0]?.sourceName || 'Official Regulatory Gazette'}\n🌐 *Audit link:* ${link}`;

    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const viralChips = useMemo(() => [
    { id: 'p1', prompt: t('chips.chip1') },
    { id: 'p2', prompt: t('chips.chip2') },
    { id: 'p3', prompt: t('chips.chip3') },
    { id: 'p4', prompt: t('chips.chip4') }
  ], [t]);

  return (
    <div
      className={`bg-[#dcebf6] text-[#0b2540] flex flex-col font-sans relative ${
        !result && activeTab === 'verify'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-[100dvh] overflow-x-hidden'
      }`}
    >
      {/* 1. Navigation Header (Top Bar: #005b9c) */}
      <Header
        onOpenWhyModal={() => setIsWhyModalOpen(true)}
        onOpenPagaModal={() => setIsPagaModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Page Wrapper */}
      <main
        className={`flex-1 w-full flex flex-col relative z-10 ${
          !result && activeTab === 'verify'
            ? 'overflow-hidden pb-16 sm:pb-6'
            : 'pb-20 sm:pb-12'
        }`}
      >
        {/* Dynamic Tab Body */}
        {activeTab === 'brand_shield' ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
            <BrandShieldDashboard
              appLanguage={locale}
              initialBrand={brandShieldTarget}
              onOpenSubscriptionModal={() => setIsPagaModalOpen(true)}
              onVerifyClaim={(claim) => {
                setActiveTab('verify');
                setQuery(claim);
                handleVerify(claim);
              }}
            />
            {/* Floating Navigation Pill */}
            <div className="pt-4 flex justify-center">
              <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            </div>
          </div>
        ) : activeTab === 'about' ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
            <AboutSection
              appLanguage={locale}
              onSelectTab={(tab) => {
                if (tab === 'heatmap') {
                  setActiveTab('heatmap');
                } else if (tab === 'brand_shield') {
                  setActiveTab('brand_shield');
                } else {
                  setActiveTab('verify');
                }
              }}
              onOpenPagaModal={() => setIsPagaModalOpen(true)}
            />
            {/* Floating Navigation Pill */}
            <div className="pt-4 flex justify-center">
              <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            </div>
          </div>
        ) : activeTab === 'heatmap' ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('verify')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/70 text-[#005b9c] text-xs font-semibold hover:bg-white transition-colors shadow-2xs cursor-pointer"
              >
                ← {isPidgin ? 'Back to Claim Verification' : 'Back to Claim Verification'}
              </button>
            </div>
            <div className="rounded-[28px] bg-white/70 backdrop-blur-md border border-white/80 p-4 sm:p-7 shadow-sm">
              <NigeriaHeatmap
                onSelectClaim={(claim) => {
                  setActiveTab('verify');
                  setQuery(claim);
                  handleVerify(claim);
                }}
              />
            </div>
            {/* Floating Navigation Pill */}
            <div className="pt-4 flex justify-center">
              <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            </div>
          </div>
        ) : (
          /* Main Landing Page (Hero + Claim Verification Engine + Decorative Background) */
          <div
            className={`relative w-full flex-1 flex flex-col justify-center px-4 sm:px-6 ${
              !result ? 'overflow-hidden py-1 sm:py-4 my-auto' : 'py-4 sm:py-8'
            }`}
          >
            {/* Background Graphics */}
            <HeroDecorativeBackground />

            {/* Centered Column: Hero + Verification Engine + Chips */}
            <div
              className={`relative z-10 max-w-4xl w-full mx-auto flex flex-col justify-center ${
                !result ? 'space-y-3.5 sm:space-y-6 my-auto' : 'space-y-6'
              }`}
            >
              {/* Hero Headline & Subtext (Crossfades smoothly with 250ms fade + 6px rise) */}
              <div className="text-center space-y-1.5 sm:space-y-2.5">
                {/* Main Headline with Blue Draw-In Underline dynamically tracking highlight word */}
                {(() => {
                  const titleStr = t('hero.title');
                  const parts = titleStr.split('{spread}');
                  const highlightWord = t('hero.highlightWord');
                  return (
                    <h1
                      key={locale}
                      className="lang-fade-in text-[clamp(24px,5.8vw,52px)] font-bold text-[#0b2540] tracking-tight leading-[1.14] max-w-3xl mx-auto select-none"
                    >
                      {parts[0]}
                      <span className="relative inline-block text-[#005b9c]">
                        {highlightWord}
                        <svg
                          className="absolute -bottom-1 left-0 w-full h-2.5 text-[#005b9c] overflow-visible"
                          viewBox="0 0 120 12"
                          fill="none"
                        >
                          <path
                            d="M2 9C30 3 85 2 118 8"
                            stroke="currentColor"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            className="animate-draw-line"
                          />
                        </svg>
                      </span>
                      {parts[1] || ''}
                    </h1>
                  );
                })()}

                {/* Supporting Subtext */}
                <p
                  key={`sub-${locale}`}
                  className="lang-fade-in text-[clamp(12px,3.1vw,16px)] text-[#4a6076] max-w-2xl mx-auto leading-relaxed font-normal"
                >
                  {t('hero.subtitle')}
                </p>
              </div>

              {/* Claim Verification Engine Section */}
              <div className="w-full space-y-3 sm:space-y-3.5">
                {/* Header Title directly above input */}
                <div className="flex items-center justify-between gap-2 px-1 mb-2 sm:mb-2.5">
                  <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-lg font-semibold tracking-tight text-[#0b2540]">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#005b9c] shrink-0" />
                    <span key={`engine-title-${locale}`} className="lang-fade-in">{t('engine.title')}</span>
                  </div>

                  {/* How to Use? Button with Rolling Letters Micro-interaction */}
                  <HowToUseButton
                    onClick={() => setIsHowToUseOpen(true)}
                    isInputTyping={query.length > 0}
                    label={t('engine.howToUseBtn')}
                  />
                </div>

                {/* Large Rounded Input Container with word-by-word reveal overlay */}
                <div
                  className={`relative bg-white border border-[#005b9c]/20 focus-within:border-[#005b9c] focus-within:ring-4 focus-within:ring-[#005b9c]/15 rounded-[18px] sm:rounded-[20px] shadow-sm hover:shadow-md focus-within:-translate-y-0.5 transition-all duration-200 p-2.5 sm:p-4 min-h-[62px] sm:min-h-[74px] flex flex-col justify-center ${
                    isRingFlashing ? 'ring-flash-active' : ''
                  }`}
                >
                {/* Image Attachment Preview Tag if Selected */}
                {selectedImage && (
                  <div className="mb-2.5 flex items-center justify-between p-2 rounded-xl bg-[#e6f1f8] border border-[#d5e7fa] text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#d5e7fa] shrink-0">
                        <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-[#0b2540] truncate">{imageFileName || 'Attached Screenshot'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImageFileName(null);
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={t('engine.clearBtn')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 relative">
                  {/* Smooth Word-by-Word Cycling Example Prompts Overlay */}
                  {!query && (
                    <div
                      className="absolute inset-y-0 left-2 sm:left-3 right-32 sm:right-36 flex items-center pointer-events-none select-none overflow-hidden"
                      aria-hidden="true"
                    >
                      <div
                        key={promptRenderKey}
                        className={`w-full text-xs sm:text-sm text-[#4a6076] font-normal truncate ${
                          isTextExiting ? 'input-text-exit' : ''
                        }`}
                      >
                        {/* Word-by-word reveal on desktop / tablet */}
                        <span className="hidden sm:inline">
                          {(cyclingPrompts[promptIndex] || '').split(' ').map((word, wIdx) => (
                            <span
                              key={wIdx}
                              className="input-text-word"
                              style={{ '--word-idx': wIdx } as React.CSSProperties}
                            >
                              {word}&nbsp;
                            </span>
                          ))}
                        </span>
                        {/* Short responsive text on mobile screens */}
                        <span className="sm:hidden input-text-word" style={{ '--word-idx': 0 } as React.CSSProperties}>
                          {t('engine.placeholderMobile')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Native Input */}
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        e.preventDefault();
                        handleVerify();
                      }
                    }}
                    aria-label={t('engine.inputAria')}
                    placeholder=""
                    className="w-full px-2 sm:px-3 py-1.5 text-base sm:text-sm text-[#0b2540] bg-transparent focus:outline-none font-normal relative z-10"
                  />

                  {/* Attachment & Voice Actions */}
                  <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 relative z-20">
                    {/* Clear Button */}
                    {(query.trim().length > 0 || selectedImage || result !== null) && (
                      <button
                        onClick={handleClear}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title={t('engine.clearBtn')}
                        aria-label={t('engine.clearBtn')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Screenshot Upload Icon */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center text-[#4a6076] hover:text-[#005b9c] hover:bg-[#e6f1f8] transition-colors cursor-pointer"
                      title={selectedImage ? t('engine.uploadReplace') : t('engine.uploadBtn')}
                      aria-label={t('engine.uploadBtn')}
                    >
                      <Upload className="w-[18px] h-[18px] stroke-[1.75]" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />

                    {/* Speech Input Icon */}
                    <button
                      onClick={handleSpeechInput}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
                        isListening
                          ? 'text-rose-600 bg-rose-50 animate-pulse'
                          : 'text-[#4a6076] hover:text-[#005b9c] hover:bg-[#e6f1f8]'
                      }`}
                      title={isListening ? t('engine.micListening') : t('engine.micBtn')}
                      aria-label={t('engine.micBtn')}
                    >
                      <Mic className="w-[18px] h-[18px] stroke-[1.75]" />
                    </button>

                    {/* Submit Button */}
                    <button
                      onClick={() => handleVerify()}
                      disabled={loading || (!query.trim() && !selectedImage)}
                      className={`send-btn-container w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] sm:rounded-[16px] bg-[#005b9c] hover:bg-[#00477e] text-white grid place-items-center transition-colors shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:pointer-events-none shrink-0 ml-1 overflow-hidden cursor-pointer ${
                        isFlying ? 'is-submitting' : ''
                      } ${loading ? 'is-loading' : ''}`}
                      title={loading ? t('engine.sendBtnLoading') : t('engine.sendBtn')}
                      aria-label={t('engine.sendBtn')}
                    >
                      <Send className="send-plane-icon text-white stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 animate-in fade-in">
                  ⚠️ {error}
                </div>
              )}

              {/* Verification Loading Stages Banner */}
              {loading && (
                <div className="p-4 rounded-2xl bg-[#e6f1f8] border border-[#d5e7fa] text-center space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-center space-x-2 text-[#005b9c] text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#005b9c] animate-ping" />
                    <span>{t('results.loadingDesc')}</span>
                  </div>
                  <p className="text-xs font-mono font-medium text-[#0b2540]">
                    {verificationStages[activeVerificationStage]}
                  </p>
                </div>
              )}

              {/* Viral Claims Chips Section */}
              <div className="pt-2 sm:pt-2.5 space-y-2 sm:space-y-2.5">
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#4a6076] px-1">
                  <span className="font-medium truncate pr-2">{t('chips.title')}</span>
                  <button
                    onClick={() => setActiveTab('heatmap')}
                    className="text-[#005b9c] font-semibold hover:underline flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <span>{t('chips.viewMapLink')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Soft Filled Chips */}
                <div
                  className="flex items-center gap-2 overflow-x-auto pt-1.5 pb-2 -mt-1.5 -mb-2 pr-8 pl-1 scrollbar-none snap-x"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 8px, black calc(100% - 24px), transparent)'
                  }}
                >
                  {viralChips.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p.prompt)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] bg-[#005b9c]/[0.08] hover:bg-[#005b9c]/[0.14] text-[#005b9c] text-xs sm:text-[13px] font-medium whitespace-nowrap transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-xs active:translate-y-0 shrink-0 snap-start cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#005b9c] shrink-0" />
                      <span>{p.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Bottom Navigation Pill (Desktop flow, fixed on mobile) */}
            <div className="pt-2 sm:pt-4 flex justify-center">
              <BottomNav
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
              />
            </div>

              {/* Verification Result Section */}
              {result && (
                <div ref={resultRef} className="pt-4 sm:pt-6 space-y-4 animate-result-enter">
                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#D5E7FA] shadow-md space-y-4 sm:space-y-5">
                    {/* Result Header: Verdict & Confidence */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#D5E7FA]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#4a6076]">
                            {t('results.officialVerdict')}
                          </span>

                          {/* Quick translate result toggle */}
                          <button
                            onClick={handleTranslateResult}
                            disabled={isTranslatingResult}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#005b9c] hover:underline cursor-pointer"
                          >
                            <Languages className="w-3 h-3" />
                            <span>
                              {isTranslatingResult 
                                ? t('results.translating') 
                                : t('results.translateResult', { lang: isPidgin ? 'English' : 'Naija Pidgin' })
                              }
                            </span>
                          </button>

                          {/* 1-Tap Quick WhatsApp Share */}
                          <button
                            onClick={handleShareWhatsApp}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                            title="Share to WhatsApp"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>{isPidgin ? 'Share for WhatsApp' : 'Share on WhatsApp'}</span>
                          </button>
                        </div>
                        <div>
                          <VerdictBadge verdict={result.verdict} size="lg" isPidgin={isPidgin} />
                        </div>
                      </div>

                      <div className="sm:max-w-xs w-full flex items-center justify-between sm:justify-end gap-3">
                        <div className="flex-1 sm:max-w-[200px]">
                          <ConfidenceMeter confidence={result.confidence} score={result.confidenceScore} />
                        </div>
                        <button
                          onClick={handleClear}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                          title={isPidgin ? 'Clear result and question' : 'Clear result and question'}
                          aria-label="Clear result and question"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Unified Essential Findings Card */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#e6f1f8]/60 border border-[#D5E7FA] space-y-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#005b9c] uppercase tracking-wider">
                          {t('results.checkedClaim')}
                        </span>
                        <p className="text-sm sm:text-base font-bold text-[#0b2540] leading-snug mt-0.5">
                          &ldquo;{result.extractedClaim.normalizedClaim}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D5E7FA]/80">
                        <span className="text-[10px] font-mono font-bold text-[#005b9c] uppercase tracking-wider">
                          {isPidgin ? 'Di Verified Truth:' : 'The Verified Fact:'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#0b2540] font-medium leading-relaxed mt-0.5">
                          {isPidgin && result.pidginExplanation 
                            ? result.pidginExplanation 
                            : result.shortExplanation
                          }
                        </p>
                      </div>
                    </div>

                    {/* Pidgin / English Audio Player */}
                    {(result.pidginExplanation || result.multilingualExplanations) && (
                      <PidginVoicePlayer
                        pidginText={result.pidginExplanation || result.shortExplanation}
                        englishText={result.shortExplanation}
                        multilingual={result.multilingualExplanations}
                        claimEntity={result.extractedClaim.entity}
                        verdict={result.verdict}
                        selectedLang={isPidgin ? 'pcm' : 'en'}
                      />
                    )}

                    {/* Primary Evidence Sources — Results End Here */}
                    {result.evidence && result.evidence.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <h4 className="text-xs font-semibold text-[#0b2540] uppercase tracking-wide">
                            {t('results.sourcesHeading')} ({result.evidence.length})
                          </h4>
                          {result.evidence.length > 1 && (
                            <button
                              onClick={() => setShowAllSources(!showAllSources)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#005b9c] hover:underline cursor-pointer"
                            >
                              <span>{showAllSources ? 'See less' : 'See more'}</span>
                              {showAllSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        {/* Evidence Cards */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {(showAllSources ? result.evidence : result.evidence.slice(0, 1)).map((item, idx) => (
                            <EvidenceCard key={item.id || idx} evidence={item} rank={idx + 1} />
                          ))}
                        </div>

                        {/* Centered See more / See less button */}
                        {result.evidence.length > 1 && (
                          <div className="flex justify-center pt-1">
                            <button
                              onClick={() => setShowAllSources(!showAllSources)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#e6f1f8] hover:bg-[#d5e7fa] text-[#005b9c] text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>
                                {showAllSources 
                                  ? (isPidgin ? 'See less' : 'See less') 
                                  : (isPidgin ? `See more (${result.evidence.length - 1} more sources)` : `See more (${result.evidence.length - 1} more sources)`)
                                }
                              </span>
                              {showAllSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Optional: Pipeline Transparency Inspector (Does NOT show by default; only shows if user clicks See more) */}
                    <div className="pt-2 border-t border-[#D5E7FA]/60">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] text-[#4a6076] font-medium">
                          {isPidgin ? 'Pipeline transparency details' : 'Pipeline transparency inspector'}
                        </span>
                        <button
                          onClick={() => setShowPipeline(!showPipeline)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#005b9c] hover:underline cursor-pointer"
                        >
                          <span>{showPipeline ? 'See less' : 'See more'}</span>
                          {showPipeline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                      {showPipeline && (
                        <div className="pt-2.5 animate-in fade-in">
                          <PipelineInspector result={result} />
                        </div>
                      )}
                    </div>

                    {/* Paga Financial Fraud Card */}
                    {result.paymentVerification && (
                      <div className="pt-2 border-t border-[#D5E7FA]">
                        <PagaPaymentCard payment={result.paymentVerification} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <WhyTruetalkModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />

      <SectionHelpModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
        section="verify"
        appLanguage={locale}
      />

      <PagaSubscriptionModal
        isOpen={isPagaModalOpen}
        onClose={() => setIsPagaModalOpen(false)}
        onLaunchBrandShield={(org) => {
          setBrandShieldTarget(org);
          setActiveTab('brand_shield');
          setIsPagaModalOpen(false);
        }}
      />
    </div>
  );
}
