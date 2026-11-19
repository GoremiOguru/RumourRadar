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
  MapPin,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
  Globe,
  CreditCard
} from 'lucide-react';
import { PagaAppDownloadButton } from '@/components/PagaAppDownloadButton';
import { useTranslations } from '@/context/LanguageContext';

interface AboutSectionProps {
  onSelectTab?: (tab: 'verify' | 'brand_shield' | 'heatmap') => void;
  onOpenPagaModal?: () => void;
  appLanguage?: 'en' | 'pcm';
}

export function AboutSection({ onSelectTab, onOpenPagaModal, appLanguage }: AboutSectionProps) {
  const { isPidgin: contextIsPidgin, t } = useTranslations();
  const isPidgin = appLanguage === 'pcm' || contextIsPidgin;
  const [activeTab, setActiveTab] = useState<'features' | 'paga' | 'market' | 'pipeline' | 'civic'>('features');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [hasPledged, setHasPledged] = useState(false);
  const pagaScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollPagaCards = (direction: 'left' | 'right') => {
    if (!pagaScrollRef.current) return;
    const container = pagaScrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const PLATFORM_FEATURES = [
    {
      id: 'brand_shield',
      icon: <Building2 className="w-6 h-6 text-[#005A9C]" />,
      badge: isPidgin ? 'Company & Brand Guard' : 'Brand & Entity Shield',
      title: isPidgin ? 'Company & Brand Guard' : 'Enterprise Brand Shield',
      desc: isPidgin
        ? 'Track viral rumors, fake promo announcements, and false claims about your company or public figure in real-time.'
        : 'Track viral rumors, fake promotional claims, and social media impersonations targeting your business or institution in real time.',
      cta: isPidgin ? 'Open Brand Guard →' : 'Launch Brand Shield →',
      targetTab: 'brand_shield' as const,
      color: 'bg-white border-[#D5E7FA] text-[#0C2340]'
    },
    {
      id: 'heatmap',
      icon: <MapPin className="w-6 h-6 text-[#2786D1]" />,
      badge: isPidgin ? 'All 36 States & Abuja' : 'All 36 States & Abuja',
      title: isPidgin ? 'State-by-State Rumour Map' : 'Geopolitical Rumour Radar',
      desc: isPidgin
        ? 'See live rumor alerts across all 36 states and Abuja for security, election, fuel, and bank news on a realistic map.'
        : 'Realistic vector map of Nigeria tracking regional rumor contagions and velocity spikes across all 6 geopolitical zones.',
      cta: isPidgin ? 'Open State Map →' : 'View Geopolitical Map →',
      targetTab: 'heatmap' as const,
      color: 'bg-white border-[#D5E7FA] text-[#0C2340]'
    },
    {
      id: 'audio_engine',
      icon: <Volume2 className="w-6 h-6 text-[#16A36A]" />,
      badge: isPidgin ? '5 Nigerian Languages' : 'Vernacular Voice Engine',
      title: isPidgin ? 'Listen for Pidgin, Yoruba, Hausa & Igbo' : '5-Language Voice Synthesizer',
      desc: isPidgin
        ? 'No need to read long English text! Listen to clear verdict summaries spoken in Nigerian Pidgin, Yoruba, Hausa, or Igbo.'
        : 'Instant vernacular audio syntheses in Nigerian Pidgin, Yorùbá, Hausa, and Igbo to reach millions in grassroots communities.',
      cta: isPidgin ? 'Test Voice Check →' : 'Test Audio Engine →',
      targetTab: 'verify' as const,
      color: 'bg-white border-[#D5E7FA] text-[#0C2340]'
    },
    {
      id: 'whatsapp_card',
      icon: <Share2 className="w-6 h-6 text-[#16A36A]" />,
      badge: isPidgin ? 'WhatsApp Fast Forward' : '1-Click Debunk Card',
      title: isPidgin ? 'WhatsApp Broadcast Debunk Card' : 'Instant WhatsApp Debunk Card',
      desc: isPidgin
        ? 'Generate clean, emoji-styled WhatsApp cards to forward into family and community groups to stop fake news instantly.'
        : 'One-click share card formatted with clear emojis and citations, ready to forward into WhatsApp community groups to stop misinformation at the source.',
      cta: isPidgin ? 'Check Claim Now →' : 'Try Verification →',
      targetTab: 'verify' as const,
      color: 'bg-white border-[#D5E7FA] text-[#0C2340]'
    }
  ];

  return (
    <div className="space-y-8 animate-result-enter">
      {/* Top Banner & Tab Navigation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D5E7FA] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#D5E7FA] bg-[#EAF3FC] flex items-center justify-center shrink-0">
              <Image
                src="/truetalk-logo.png"
                alt="Truetalk Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#EAF3FC] border border-[#D5E7FA] text-[#005A9C] text-xs font-mono font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#005A9C]" />
                  ABOUT TRUETALK NIGERIA
                </span>
                <span className="text-xs font-mono text-[#64748B] font-bold">
                  Engineered by Team GODEC
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-black text-[#0C2340] tracking-tight leading-tight">
                {isPidgin
                  ? 'Check Any News or Message with Real Proof in Seconds'
                  : 'National Disinformation Surveillance & Evidence Verification'}
              </h2>

              <p className="text-sm text-[#64748B] max-w-3xl leading-relaxed">
                {isPidgin
                  ? 'Truetalk na sovereign evidence verification platform wey Team GODEC build to check if any WhatsApp forward, tweet from X, or bank claim in Nigeria na TRUE or FAKE in seconds.'
                  : 'Truetalk is Nigeria’s national information verification platform built by Team GODEC. It cross-examines fast-moving social claims against official sovereign portals and Paga banking rails.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#D5E7FA]">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display flex items-center gap-1.5 ${
              activeTab === 'features'
                ? 'bg-[#005A9C] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0C2340] border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPidgin ? '✨ Feature Showcase' : '✨ Feature Showcase'}
          </button>

          <button
            onClick={() => setActiveTab('paga')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display flex items-center gap-1.5 ${
              activeTab === 'paga'
                ? 'bg-[#005A9C] text-white shadow-xs'
                : 'bg-white text-[#005A9C] hover:bg-blue-50 border border-[#D5E7FA]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            {isPidgin ? '💳 Paga Payment Rails' : '💳 Paga Payment Infrastructure'}
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'market'
                ? 'bg-[#005A9C] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0C2340] border border-slate-200'
            }`}
          >
            🎯 {isPidgin ? 'Why We Pass Other AI' : 'Why Truetalk Outperforms Generic AI'}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'pipeline'
                ? 'bg-[#005A9C] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0C2340] border border-slate-200'
            }`}
          >
            ⚙️ {isPidgin ? 'Dual-Rail Engine' : 'Dual-Rail Verification Pipeline'}
          </button>

          <button
            onClick={() => setActiveTab('civic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'civic'
                ? 'bg-[#005A9C] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0C2340] border border-slate-200'
            }`}
          >
            🇳🇬 {isPidgin ? 'Naija Truth Pledge' : 'National Evidence Mission'}
          </button>
        </div>
      </div>

      {/* TAB 1: FEATURES */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORM_FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="p-6 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs hover:border-[#005A9C] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#EAF3FC] text-[#005A9C]">
                      {feat.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#EAF3FC] text-[#005A9C] border border-[#D5E7FA]">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#0C2340] font-display">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                {onSelectTab && (
                  <button
                    onClick={() => onSelectTab(feat.targetTab)}
                    className="w-full py-2.5 rounded-xl bg-[#EAF3FC] hover:bg-[#005A9C] text-[#005A9C] hover:text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>{feat.cta}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PAGA PAYMENT RAILS */}
      {activeTab === 'paga' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#EAF3FC] text-[#005A9C] border border-[#D5E7FA] text-xs font-mono font-bold">
              Paga Official Payment Partner
            </span>
            <h3 className="text-2xl font-black text-[#0C2340] font-display">
              How Paga Powers Truetalk Institutional Rails
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              Truetalk integrates Paga financial infrastructure to enable zero-friction B2B newsroom billing, instant NGN virtual bank accounts, and NUBAN fraud detection against palliative fee scams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#EAF3FC]/50 border border-[#D5E7FA] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#005A9C] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-sm text-[#0C2340]">Dedicated NGN Virtual Accounts</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Every newsroom or enterprise generates a dedicated NGN bank account via Paga. Subscriptions can be paid directly from any Nigerian banking app without card failures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EAF3FC]/50 border border-[#D5E7FA] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#005A9C] text-white flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-sm text-[#0C2340]">Real-Time Webhook Provisioning</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                The moment a transfer hits the generated Paga virtual account, automated webhooks provision Brand Shield nodes and Newsroom verification keys within 10 seconds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EAF3FC]/50 border border-[#D5E7FA] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#005A9C] text-white flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-sm text-[#0C2340]">NUBAN Scam Detection Rail</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Paga verification rails cross-reference bank accounts in viral claims to detect private personal accounts impersonating government palliative grants.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <PagaAppDownloadButton appLanguage={appLanguage} />
            {onOpenPagaModal && (
              <button
                onClick={onOpenPagaModal}
                className="px-5 py-2.5 rounded-xl border border-[#005A9C] text-[#005A9C] hover:bg-[#EAF3FC] text-xs font-bold transition-colors"
              >
                Create Paga Plus Account →
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MARKET COMPARISON */}
      {activeTab === 'market' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#EAF3FC] text-[#005A9C] border border-[#D5E7FA] text-xs font-mono font-bold">
              Architectural Superiority
            </span>
            <h3 className="text-2xl font-black text-[#0C2340] font-display">
              Generic LLMs Hallucinate. Truetalk Grounds Every Word in Live Nigerian Evidence.
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
              When a viral WhatsApp note claims CBN has frozen mobile bank accounts, generic AI chatbots (ChatGPT / Copilot) fall back on stale memory or produce ungrounded guesses. Truetalk queries official Nigerian regulators and fact-checkers in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center space-x-2 text-rose-700 font-bold">
                <XCircle className="w-5 h-5" />
                <span>The Problem with Generic AI Models</span>
              </div>
              <ul className="space-y-1.5 text-rose-900 leading-relaxed list-disc list-inside">
                <li>Training data cutoff dates cause blind spots on breaking news.</li>
                <li>Invent plausible-sounding false quotes from Nigerian officials.</li>
                <li>Cannot parse Nigerian Pidgin or local slang context accurately.</li>
                <li>No integration with Nigerian banking rails to verify fraud.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>The Truetalk Sovereign Advantage</span>
              </div>
              <ul className="space-y-1.5 text-emerald-950 leading-relaxed list-disc list-inside">
                <li>Direct routing to 30+ official Nigerian government agencies.</li>
                <li>Live scraping of verified fact-check desks (Dubawa, Africa Check).</li>
                <li>5-language vernacular TTS audio explanations.</li>
                <li>Paga financial fraud checks on bank account numbers.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#EAF3FC] text-[#005A9C] border border-[#D5E7FA] text-xs font-mono font-bold">
              Engineering Architecture
            </span>
            <h3 className="text-2xl font-black text-[#0C2340] font-display">
              Dual-Rail Zero-Hallucination Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-2xl">
              Engineered by Team GODEC to eliminate hallucinations through strict mathematical scoring and dual-rail evidence synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#EAF3FC]/60 border border-[#D5E7FA] space-y-2">
              <span className="text-xs font-mono font-bold text-[#005A9C]">Stage 1</span>
              <h4 className="font-bold text-sm text-[#0C2340]">Claim Extraction</h4>
              <p className="text-[#64748B]">Normalizes text, extracts named entities, and isolates checkable factual claims.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#EAF3FC]/60 border border-[#D5E7FA] space-y-2">
              <span className="text-xs font-mono font-bold text-[#005A9C]">Stage 2</span>
              <h4 className="font-bold text-sm text-[#0C2340]">Authority Routing</h4>
              <p className="text-[#64748B]">Queries verified Nigerian gazettes, fact-checkers, and Paga banking rails.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#EAF3FC]/60 border border-[#D5E7FA] space-y-2">
              <span className="text-xs font-mono font-bold text-[#005A9C]">Stage 3</span>
              <h4 className="font-bold text-sm text-[#0C2340]">Formula Ranking</h4>
              <p className="text-[#64748B]">0.30×Auth + 0.25×Rel + 0.20×Rec + 0.15×Corr + 0.10×Ctx deterministic scoring.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#EAF3FC]/60 border border-[#D5E7FA] space-y-2">
              <span className="text-xs font-mono font-bold text-[#005A9C]">Stage 4</span>
              <h4 className="font-bold text-sm text-[#0C2340]">Synthesis & Audio</h4>
              <p className="text-[#64748B]">Outputs clear verdicts, Pidgin audio, and WhatsApp debunk share cards.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CIVIC MISSION */}
      {activeTab === 'civic' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs space-y-6 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EAF3FC] text-[#005A9C] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#0C2340] font-display">
              The Nigerian Information Integrity Pledge
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Misinformation during elections, banking policy changes, and public health advisories costs lives and livelihoods. Team GODEC built Truetalk to empower every citizen to act as a verified truth node in their community.
            </p>
          </div>

          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#EAF3FC]/50 border border-[#D5E7FA] text-xs text-[#0C2340] font-medium leading-relaxed italic">
            “I pledge to verify viral broadcasts with Truetalk before sharing on WhatsApp groups or social media.”
          </div>

          <div className="pt-2">
            <button
              onClick={() => setHasPledged(true)}
              disabled={hasPledged}
              className={`px-8 py-3 rounded-full text-xs font-bold transition-all shadow-md ${
                hasPledged
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#005A9C] hover:bg-[#00477E] text-white active:scale-95'
              }`}
            >
              {hasPledged ? '✓ You have taken the Nigeria Truth Pledge!' : 'Take the Truth Pledge 🇳🇬'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
