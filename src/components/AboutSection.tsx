'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Brain,
  Database,
  Calculator,
  Radio,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Layers,
  Volume2,
  Share2,
  Heart,
  Flame,
  Building2,
  Compass,
  FileText,
  Users,
  Award,
  Video,
  MapPin,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BmoniAppDownloadButton } from '@/components/BmoniAppDownloadButton';

interface AboutSectionProps {
  onOpenTipModal?: () => void;
  onSelectTab?: (tab: 'verify' | 'brand_shield' | 'heatmap' | 'deepfake') => void;
  onOpenBmoniModal?: () => void;
  appLanguage?: 'en' | 'pcm';
}

export function AboutSection({ onOpenTipModal, onSelectTab, onOpenBmoniModal, appLanguage = 'en' }: AboutSectionProps) {
  const isPidgin = appLanguage === 'pcm';
  const [activeTab, setActiveTab] = useState<'features' | 'bmoni' | 'market' | 'pipeline' | 'civic'>('features');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [hasPledged, setHasPledged] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const bmoniScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollBmoniCards = (direction: 'left' | 'right') => {
    if (!bmoniScrollRef.current) return;
    const container = bmoniScrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const NEW_FEATURES = [
    {
      id: 'deepfake',
      icon: <Video className="w-6 h-6 text-purple-400" />,
      badge: isPidgin ? 'Photo & Video Check' : 'Photo & Video Check',
      title: isPidgin ? 'Fake Video & AI Photo Check' : 'AI Photo & Deepfake Video Detector',
      desc: isPidgin
        ? 'Test any video, picture, or voice note to see if e be real human photo or AI deepfake.'
        : 'Upload any video, picture, or link to test if it is a real photo of humans or an AI deepfake in seconds.',
      cta: isPidgin ? 'Open Video Scanner →' : 'Open Video Scanner →',
      targetTab: 'deepfake' as const,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300'
    },
    {
      id: 'brand_shield',
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
      badge: isPidgin ? 'Company & Brand Guard' : 'Brand & Creator Guard',
      title: isPidgin ? 'Company & Brand Guard' : 'Company & Brand Guard',
      desc: isPidgin
        ? 'Track viral rumors, fake promo announcements, and false claims about your company or public figure.'
        : 'Track viral rumors, fake promotional claims, and false news targeting your business or brand in real time.',
      cta: isPidgin ? 'Open Brand Guard →' : 'Launch Brand Shield →',
      targetTab: 'brand_shield' as const,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300'
    },
    {
      id: 'heatmap',
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      badge: isPidgin ? 'All 36 States & Abuja' : 'All 36 States & Abuja',
      title: isPidgin ? 'State-by-State Rumour Map' : 'Nigeria Rumour Map',
      desc: isPidgin
        ? 'See live rumor alerts across all 36 states and Abuja for security, election, fuel, and bank news.'
        : 'See real-time rumor updates across all 36 Nigerian states and FCT Abuja for security, elections, and fuel news.',
      cta: isPidgin ? 'Open State Map →' : 'View State Map →',
      targetTab: 'heatmap' as const,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
    },
    {
      id: 'audio_engine',
      icon: <Volume2 className="w-6 h-6 text-cyan-400" />,
      badge: isPidgin ? 'Voice Audio for 5 Languages' : 'Voice Audio in 5 Languages',
      title: isPidgin ? 'Voice Notes in Pidgin, Yoruba, Hausa, Igbo' : 'Voice Notes in 5 Local Languages',
      desc: isPidgin
        ? 'Listen to fact-check reports in clear Nigerian English, Pidgin, Yorùbá, Hausa, or Igbo audio.'
        : 'Listen to fact-check summaries in clear Nigerian English, Pidgin, Yorùbá, Hausa, or Igbo voice audio.',
      cta: isPidgin ? 'Try Voice Check →' : 'Try Audio Verification →',
      targetTab: 'verify' as const,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300'
    },
    {
      id: 'dual_rail',
      icon: <Brain className="w-6 h-6 text-rose-400" />,
      badge: isPidgin ? 'Official Proof First' : 'Official Proof First',
      title: isPidgin ? 'Zero-Lie AI Engine' : 'Honest Evidence Engine',
      desc: isPidgin
        ? 'Checks official portals like CBN, INEC, NCDC, and trusted news desks so it never gives fake answers.'
        : 'Checked directly against official government sources (CBN, INEC, NCDC) and verified news desks so it never makes up facts.',
      cta: isPidgin ? 'Check Claim Now →' : 'Verify Claim Now →',
      targetTab: 'verify' as const,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-300'
    }
  ];

  const PIPELINE_STAGES = [
    {
      stage: 1,
      title: isPidgin ? '1. Read Message or Link' : '1. Read Message, Photo or Link',
      badge: isPidgin ? 'Text & Image Reader' : 'Text & Image Reader',
      desc: isPidgin
        ? 'Extracts the core claim from WhatsApp messages, tweets, headlines, or uploaded photos.'
        : 'Extracts the main claim from WhatsApp messages, tweets from X, news headlines, or uploaded screenshots.',
      icon: <Brain className="w-5 h-5 text-emerald-400" />
    },
    {
      stage: 2,
      title: isPidgin ? '2. Check Official Sources' : '2. Check Official Nigerian Sources',
      badge: isPidgin ? 'Government & News Search' : 'Official Registry Search',
      desc: isPidgin
        ? 'Searches official government bodies (CBN, INEC, NCDC, JAMB, WAEC) and verified news desks.'
        : 'Searches official Nigerian regulators (CBN, INEC, NCDC, JAMB, WAEC) and verified newsrooms.',
      icon: <Database className="w-5 h-5 text-blue-400" />
    },
    {
      stage: 3,
      title: isPidgin ? '3. Score Source Truth' : '3. Score Evidence Truth',
      badge: isPidgin ? 'Smart Proof Check' : 'Smart Proof Check',
      desc: isPidgin
        ? 'Checks how official and recent the proof is, giving Supported, Contradicted, Misleading, Satire, or Unverified.'
        : 'Evaluates source authority, freshness, and relevance to yield a clear verdict.',
      icon: <Calculator className="w-5 h-5 text-purple-400" />
    },
    {
      stage: 4,
      title: isPidgin ? '4. Share Result & Audio' : '4. Instant Audio & Share Card',
      badge: isPidgin ? 'WhatsApp Broadcast' : 'WhatsApp Broadcast',
      desc: isPidgin
        ? 'Generates voice audio in 5 Nigerian languages and 1-click share cards for WhatsApp & X.'
        : 'Generates voice audio in 5 local languages and 1-click shareable cards for WhatsApp & X.',
      icon: <Volume2 className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="section-stagger space-y-8 animate-result-enter">
      {/* Top Banner & Tab Navigation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="/images/logowhite.jpeg"
              alt="RumourRadar Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border border-emerald-500/40 shadow-lg shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  ABOUT RUMOUR RADAR NIGERIA
                </span>
                <span className="text-xs font-mono text-slate-400">
                  BUILDXNACOS &apos;26 Hackathon AI Track
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
                {isPidgin
                  ? 'Check Any News or Message with Real Proof in Seconds'
                  : 'Check Any News or Message with Real Proof in Seconds'}
              </h2>

              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isPidgin
                  ? 'Rumour Radar dey help you check if any WhatsApp message, Twitter post, AI photo, or bank rumor na TRUE or FAKE before you share am.'
                  : 'Rumour Radar helps you check if any news, WhatsApp forward, AI photo, video, or bank claim in Nigeria is TRUE or FAKE in seconds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {onOpenTipModal && (
              <button
                onClick={onOpenTipModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isPidgin ? 'Report to Newsroom →' : 'Tip Newsroom →'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display flex items-center gap-1.5 ${activeTab === 'features'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPidgin ? '✨ New Features We Build' : '✨ New Features Showcase'}
          </button>

          <button
            onClick={() => setActiveTab('bmoni')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display flex items-center gap-1.5 ${activeTab === 'bmoni'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/80 text-blue-400 hover:text-white border border-blue-500/30'
              }`}
          >
            💳 {isPidgin ? 'BMoni Bank Rail & Hackathon API' : 'BMoni API & Hackathon Role'}
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${activeTab === 'market'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            🎯 {isPidgin ? 'Why We Pass Other AI' : 'Our Place in the Market'}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${activeTab === 'pipeline'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            ⚙️ {isPidgin ? 'How We Dey Work (AI Engine)' : 'How We Work (Dual-Rail AI)'}
          </button>

          <button
            onClick={() => setActiveTab('civic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${activeTab === 'civic'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            🇳🇬 {isPidgin ? 'Naija People Duty & Promise' : 'Civic Mission & Citizen Appeal'}
          </button>
        </div>
      </div>

      {/* TAB 0: NEW FEATURES SHOWCASE */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {isPidgin ? 'New Power for Rumour Radar' : 'Platform Expansion & New Capabilities'}
            </span>
            <h3 className="text-xl sm:text-3xl font-display font-bold text-white">
              {isPidgin ? 'Everything Wey We Don Add Give Naija People' : 'Advanced Tools Built for Citizens & Organizations'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isPidgin
                ? 'From deepfake video scanner to brand protection guard and 36-state heatmap alert, see all our new features below.'
                : 'Explore our newly launched capabilities spanning deepfake media inspection, enterprise & creator brand protection, geopolitical risk heatmapping, and 5-language vernacular TTS speech.'}
            </p>
          </div>

          {/* Grid of New Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEW_FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-opacity-20 ${feat.color}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  {onSelectTab ? (
                    <button
                      onClick={() => onSelectTab(feat.targetTab)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold font-display transition-all flex items-center justify-center gap-1.5 group-hover:shadow-lg group-hover:shadow-emerald-500/10"
                    >
                      <span>{feat.cta}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <span>✓ {isPidgin ? 'Ready for Use' : 'Active Feature'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB BMONI: BMONI API & HACKATHON ROLE */}
      {activeTab === 'bmoni' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-blue-950/40 border border-blue-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-400" />
                  {isPidgin ? 'BMoni Bank Rail API • Core Hackathon Criteria' : 'BMoni Payment API • Essential Hackathon Foundation'}
                </span>
                <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white">
                  {isPidgin
                    ? 'How BMoni Financial API Dey Power RumourRadar Subscription'
                    : 'How BMoni Financial API Powers RumourRadar Institutional Rails'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {isPidgin
                    ? 'Building with BMoni API na key criteria for dis BUILDXNACOS \'26 Hackathon. RumourRadar dey use BMoni NGN Virtual Account API to give newsroom and company instant bank transfer account with zero card error.'
                    : 'Building with BMoni\'s API is a critical rubric requirement for the BUILDXNACOS \'26 Hackathon. RumourRadar integrates BMoni\'s financial infrastructure to enable zero-friction B2B payments, instant NGN virtual bank accounts, and BVN identity verification.'}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold shrink-0">
                ⚡ 10-Second Webhook Settlement
              </div>
            </div>

            {/* Mobile App Download Promotion Banner */}
            <BmoniAppDownloadButton appLanguage={appLanguage} />

            {/* 3 Pillar Cards Header & Control Bar */}
            <div className="flex items-center justify-between pt-2 pb-1">
              <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                {isPidgin ? 'Swipe or tap arrows to view our 3 BMoni rails:' : 'Swipe or tap arrows to view our 3 BMoni rails:'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollBmoniCards('left')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500/50 transition-all active:scale-95"
                  aria-label="Previous BMoni card"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBmoniCards('right')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500/50 transition-all active:scale-95"
                  aria-label="Next BMoni card"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Pillar Cards for BMoni Role — Horizontal Scrollable Carousel with Visible Peek */}
            <div
              ref={bmoniScrollRef}
              className="flex flex-row overflow-x-auto gap-3.5 pb-4 pt-1 scrollbar-thin scrollbar-thumb-blue-500/30 snap-x snap-mandatory scroll-smooth"
            >
              <div className="w-[80%] max-w-[270px] sm:w-[85%] md:w-full md:flex-1 shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3 flex flex-col justify-between group hover:border-blue-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
                      className="text-[11px] font-mono text-blue-400 hover:text-blue-300 underline"
                    >
                      {expandedCard === 1 ? 'Hide ▲' : 'Details ▼'}
                    </button>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">
                    {isPidgin ? '1. Instant NGN Virtual Accounts' : '1. Instant Dynamic NGN Virtual Accounts'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {isPidgin
                      ? 'When newsroom or company want to subscribe, BMoni API dey generate unique virtual bank account instantly. You fit transfer money from GTBank, Access, Zenith, or Kuda.'
                      : 'Every enterprise brand or newsroom tier generates a dedicated NGN virtual bank account via BMoni API. Subscriptions can be paid directly from any Nigerian banking app without card failures.'}
                  </p>

                  {expandedCard === 1 && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-blue-500/30 text-[10px] text-slate-300 space-y-1 animate-in fade-in">
                      <span className="font-bold text-blue-400 block">⚡ Virtual Account Details:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Generates real-time Wema Bank / Providus NUBAN accounts. Bypasses 40%+ card failure rates in Nigeria. Supports zero-friction B2B settlements.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onOpenBmoniModal}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 group/btn"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isPidgin ? 'Test NGN Virtual Account' : 'Explore Virtual Account Rail'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="w-[80%] max-w-[270px] sm:w-[85%] md:w-full md:flex-1 shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
                      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
                    >
                      {expandedCard === 2 ? 'Hide ▲' : 'Details ▼'}
                    </button>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">
                    {isPidgin ? '2. Automated Webhook Deployment' : '2. Real-Time Deposit Webhook Listening'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {isPidgin
                      ? 'Once deposit enter BMoni account, BMoni webhook go trigger within 10 seconds to deploy API key, brand shield dashboard, and breaking news alert.'
                      : 'The moment a deposit hits the generated BMoni virtual account, automated webhooks provision Newsroom API keys and Brand Shield surveillance nodes within 10 seconds.'}
                  </p>

                  {expandedCard === 2 && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-[10px] text-slate-300 space-y-1 animate-in fade-in">
                      <span className="font-bold text-emerald-400 block">⚡ Webhook Settlement:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Instant 10-second deposit listening eliminates manual transaction confirmation. Provisions enterprise API keys automatically upon NGN settlement.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onOpenBmoniModal}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 group/btn"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isPidgin ? 'Test Webhook & Delivery' : 'Check Deposit Webhook Rail'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="w-[80%] max-w-[270px] sm:w-[85%] md:w-full md:flex-1 shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3 flex flex-col justify-between group hover:border-purple-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
                      <Database className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedCard(expandedCard === 3 ? null : 3)}
                      className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline"
                    >
                      {expandedCard === 3 ? 'Hide ▲' : 'Details ▼'}
                    </button>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">
                    {isPidgin ? '3. BVN & Anti-Scam Identity' : '3. BVN-Linked Newsroom Credentialing'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {isPidgin
                      ? 'BMoni banking rails ensure say fake anonymous scammers no fit buy enterprise API key. Every account link to verified Nigerian banking identity.'
                      : 'BMoni\'s regulatory compliance prevents anonymous malicious actors from purchasing high-throughput debunk API access, ensuring verified accountability.'}
                  </p>

                  {expandedCard === 3 && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-purple-500/30 text-[10px] text-slate-300 space-y-1 animate-in fade-in">
                      <span className="font-bold text-purple-400 block">🛡️ Crime Detection Extent:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Verifies real NIBSS account holder names against claims (detecting 90%+ fake grant scams). Enforces BVN identity auditability for all API keys.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onOpenBmoniModal}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 group/btn"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isPidgin ? 'Verify BVN Identity Rail' : 'Check BVN Credential Rail'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: OUR PLACE IN THE MARKET */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Comparison Matrix Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {isPidgin ? 'Why Normal AI Dey Fail for Nigeria' : 'Why Standard AI Fails in Nigeria'}
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
                {isPidgin
                  ? 'Normal ChatGPT & AI dey craft lie lie story. Rumour Radar dey carry proof from real government paper.'
                  : 'Generic LLMs hallucinate on local context. Rumour Radar Grounds Every Word in Live Nigerian Evidence.'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isPidgin
                  ? 'When viral audio message talk say CBN don block bank account, normal ChatGPT AI no dey get today news from Lagos or Abuja. Rumour Radar dey search CBN, INEC, NCDC and news press desk sharp sharp.'
                  : 'When a viral audio note claims CBN has frozen mobile bank accounts, standard AI models like ChatGPT often fall for training data cutoffs or produce generic responses. Rumour Radar routes directly to official Nigerian regulators and fact-checkers in real time.'}
              </p>
            </div>

            {/* Rich Editorial Graphic */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/about_dual_rail.jpg"
                  alt="Rumour Radar Dual Rail AI Engine Operations"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {isPidgin ? 'Live Proof System' : 'Live Operations Node'}
                </span>
                <p className="text-xs font-bold text-white">
                  {isPidgin ? 'CBN, INEC, NCDC & Newsroom Real-Time Desk' : 'CBN, INEC, NCDC & Press Desk Ingestion Hub'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard LLMs Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <h4 className="font-bold text-sm text-rose-200 font-display">
                    {isPidgin ? 'Normal Commercial AI (ChatGPT & Others)' : 'Generic Commercial LLMs'}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  {isPidgin ? 'E Dey Lie Plenty' : 'High Hallucination Risk'}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>{isPidgin ? 'Old Memory Cutoff:' : 'Training Memory Cutoffs:'}</strong>{' '}
                    {isPidgin ? 'E no fit check news wey happen today for Lagos or Abuja.' : 'Incapable of verifying breaking news published today in Lagos or Abuja.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>{isPidgin ? 'Fake Letterhead Dey Fool Am:' : 'Fooled by Forged Memo Letterheads:'}</strong>{' '}
                    {isPidgin ? 'E dey believe fake government memo with fake signature.' : 'Accepts fake circulars with forged signatures as authentic.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>{isPidgin ? 'E No Sabi Pidgin & Slang:' : 'Fails on Naija Pidgin & Slang:'}</strong>{' '}
                    {isPidgin ? 'E dey mistake cruise, comedy skit, and banter for real threat.' : 'Misinterprets local banter, satire skits, and regional phrases as serious threats.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Rumour Radar Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-emerald-200 font-display">Rumour Radar AI Engine</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isPidgin ? 'Zero Lie Proof' : 'Zero Hallucination'}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>{isPidgin ? 'Live Proof Search:' : 'Live Evidence Retrieval:'}</strong>{' '}
                    {isPidgin ? 'E dey check Google Fact Check API, federal regulator database, and news desks.' : 'Queries live Google Fact Check API, federal regulator databases, and certified news desks.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>{isPidgin ? 'Math Formula Scoring:' : 'Deterministic Scoring Formula:'}</strong>{' '}
                    {isPidgin ? 'E dey use clear math formula so AI no go guess answer.' : 'Math-driven authority weighting removes arbitrary AI guesswork.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>{isPidgin ? '5-Language Voice & Text:' : 'Multilingual Pidgin Audio:'}</strong>{' '}
                    {isPidgin ? 'Native voice reading + Pidgin, Yorùbá, Hausa, Igbo debunk card.' : 'Native Google Maps Nigerian English voice narration + Pidgin debunk summaries.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOW WE WORK (DUAL-RAIL AI PIPELINE) */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {isPidgin ? 'How Engine Take Work' : 'Architecture Deep Dive'}
            </span>
            <h3 className="text-xl sm:text-3xl font-display font-bold text-white">
              {isPidgin ? 'The 4-Stage Dual-Rail AI Pipeline' : 'The 4-Stage Dual-Rail Verification Pipeline'}
            </h3>
            <p className="text-xs text-slate-400">
              {isPidgin ? 'Click any stage below make you see how data dey move.' : 'Click any stage below to inspect the internal telemetry and data flow.'}
            </p>
          </div>

          {/* Pipeline Interactive Stage Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PIPELINE_STAGES.map((s) => (
              <button
                key={s.stage}
                onClick={() => setActiveStage(s.stage)}
                className={`p-4 rounded-2xl border text-left transition-all ${activeStage === s.stage
                    ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50 scale-[1.02]'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    STAGE {s.stage}
                  </span>
                  {s.icon}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1 mb-1">{s.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{s.desc}</p>
              </button>
            ))}
          </div>

          {/* Active Stage Detail Panel */}
          {PIPELINE_STAGES.find(s => s.stage === activeStage) && (
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {PIPELINE_STAGES[activeStage - 1].icon}
                  <h4 className="font-bold text-base text-white font-display">
                    Stage {activeStage}: {PIPELINE_STAGES[activeStage - 1].title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {PIPELINE_STAGES[activeStage - 1].badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {PIPELINE_STAGES[activeStage - 1].desc}
              </p>

              {activeStage === 3 && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">
                    {isPidgin ? 'Math Scoring Formula' : 'Scoring Matrix Formula'}
                  </div>
                  <div>Score = 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CIVIC MISSION & CITIZEN APPEAL */}
      {activeTab === 'civic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column Text & Pledge */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {isPidgin ? 'Naija Duty & People Safety' : 'Civic Responsibility & Appeal'}
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
                {isPidgin ? 'Dey Protect Naija People from Fake News Panic' : 'Protecting Nigerian Communities from Information Panic'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isPidgin
                  ? 'Fake news about election, bank money, and sickness dey cause big problem. Rumour Radar dey give every citizen power to check truth before dem forward message.'
                  : 'Misinformation during elections, banking policy changes, and public health advisories costs lives and livelihoods. Rumour Radar empowers every citizen, journalist, and student to act as a verified truth node in their community.'}
              </p>

              {/* Citizen Fact-Checker Pledge Box */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white font-display">
                      {isPidgin ? 'Make The Naija Citizen Truth Promise' : 'Take the Nigerian Citizen Truth Pledge'}
                    </h4>
                  </div>
                  {hasPledged && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                      {isPidgin ? 'PROMISE SIGNED 🇳🇬' : 'PLEDGE SIGNED 🇳🇬'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {isPidgin
                    ? '“I promise say I go check any viral WhatsApp or social media message for Rumour Radar before I share am give people.”'
                    : '“I pledge to verify viral broadcasts with Rumour Radar before sharing on WhatsApp groups or social media.”'}
                </p>

                <button
                  onClick={() => setHasPledged(true)}
                  disabled={hasPledged}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-60"
                >
                  {isPidgin
                    ? (hasPledged ? '✓ God bless you as you dey stand for truth!' : 'Sign Citizen Promise 🇳🇬')
                    : (hasPledged ? '✓ Thank you for defending truth!' : 'Sign Citizen Pledge 🇳🇬')}
                </button>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/about_civic.jpg"
                  alt="Nigerian Digital Fact-Checking Newsroom"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {isPidgin ? 'Civic Newsroom Hub' : 'Civic Media Hub'}
                </span>
                <p className="text-xs font-bold text-white">
                  {isPidgin ? 'Dey Give Citizens & News Desks Power Across 36 States' : 'Empowering Citizens & Independent Newsrooms Across 36 States'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
