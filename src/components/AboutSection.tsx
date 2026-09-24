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
  Award
} from 'lucide-react';

interface AboutSectionProps {
  onOpenTipModal?: () => void;
  onSelectTab?: (tab: 'verify' | 'brand_shield' | 'heatmap' | 'deepfake') => void;
}

export function AboutSection({ onOpenTipModal, onSelectTab }: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<'market' | 'pipeline' | 'civic'>('market');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [hasPledged, setHasPledged] = useState(false);

  const PIPELINE_STAGES = [
    {
      stage: 1,
      title: 'Multimodal Vision & Extraction',
      badge: 'Gemini Vision OCR',
      desc: 'Parses viral WhatsApp forwards, tweets, circulars, or uploaded screenshot memos. Extracts core factual claims while stripping panic fluff ("Share to 10 groups").',
      icon: <Brain className="w-5 h-5 text-emerald-400" />
    },
    {
      stage: 2,
      title: 'Nigeria Authority Router',
      badge: 'Live Registry Search',
      desc: 'Directly routes claims to official Nigerian regulatory bodies (CBN, INEC, NCDC, JAMB, WAEC, SEC, NPF) and accredited fact-checking desks (Dubawa, Africa Check, FactCheckHub).',
      icon: <Database className="w-5 h-5 text-blue-400" />
    },
    {
      stage: 3,
      title: 'Deterministic Scoring Matrix',
      badge: 'Math Scoring',
      desc: 'Applies weighted evidence formula: 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context. Yields Supported, Contradicted, Misleading, Satire, or Unverified.',
      icon: <Calculator className="w-5 h-5 text-purple-400" />
    },
    {
      stage: 4,
      title: 'Pidgin Audio & Social Debunk Kit',
      badge: 'Universal Broadcast',
      desc: 'Generates authentic Google Maps Nigerian English voice audio, Naija Pidgin translations, and high-res 1080p Canvas PNG debunk cards for 1-click broadcast across WhatsApp, 𝕏, and Instagram.',
      icon: <Volume2 className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="space-y-8 animate-result-enter">
      {/* Top Banner & Tab Navigation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Stopping Disinformation with Evidence-Grounded AI
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Rumour Radar is Nigeria&apos;s premier evidence-first verification engine designed to neutralize viral WhatsApp hoaxes, forged government circulars, and panic threats before they cause real-world harm.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {onOpenTipModal && (
              <button
                onClick={onOpenTipModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Tip Newsroom &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'market'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🎯 Our Place in the Market
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'pipeline'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚙️ How We Work (Dual-Rail AI)
          </button>

          <button
            onClick={() => setActiveTab('civic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'civic'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🇳🇬 Civic Mission & Citizen Appeal
          </button>
        </div>
      </div>

      {/* TAB 1: OUR PLACE IN THE MARKET */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Comparison Matrix Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Why Standard AI Fails in Nigeria
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
                Generic LLMs hallucinate on local context. Rumour Radar Grounds Every Word in Live Nigerian Evidence.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When a viral audio note claims CBN has frozen mobile bank accounts, standard AI models like ChatGPT often fall for training data cutoffs or produce generic responses. Rumour Radar routes directly to official Nigerian regulators and fact-checkers in real time.
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
                  Live Operations Node
                </span>
                <p className="text-xs font-bold text-white">
                  CBN, INEC, NCDC & Press Desk Ingestion Hub
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
                  <h4 className="font-bold text-sm text-rose-200 font-display">Generic Commercial LLMs</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  High Hallucination Risk
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Training Memory Cutoffs:</strong> Incapable of verifying breaking news published today in Lagos or Abuja.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Fooled by Forged Memo Letterheads:</strong> Accepts fake circulars with forged signatures as authentic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Fails on Naija Pidgin & Slang:</strong> Misinterprets local banter, satire skits, and regional phrases as serious threats.</span>
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
                  Zero Hallucination
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Live Evidence Retrieval:</strong> Queries live Google Fact Check API, federal regulator databases, and certified news desks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Deterministic Scoring Formula:</strong> Math-driven authority weighting removes arbitrary AI guesswork.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Multilingual Pidgin Audio:</strong> Native Google Maps Nigerian English voice narration + Pidgin debunk summaries.</span>
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
              Architecture Deep Dive
            </span>
            <h3 className="text-xl sm:text-3xl font-display font-bold text-white">
              The 4-Stage Dual-Rail Verification Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Click any stage below to inspect the internal telemetry and data flow.
            </p>
          </div>

          {/* Pipeline Interactive Stage Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PIPELINE_STAGES.map((s) => (
              <button
                key={s.stage}
                onClick={() => setActiveStage(s.stage)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeStage === s.stage
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
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Scoring Matrix Formula</div>
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
                Civic Responsibility & Appeal
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
                Protecting Nigerian Communities from Information Panic
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Misinformation during elections, banking policy changes, and public health advisories costs lives and livelihoods. Rumour Radar empowers every citizen, journalist, and student to act as a verified truth node in their community.
              </p>

              {/* Citizen Fact-Checker Pledge Box */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white font-display">Take the Nigerian Citizen Truth Pledge</h4>
                  </div>
                  {hasPledged && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                      PLEDGE SIGNED 🇳🇬
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;I pledge to verify viral broadcasts with Rumour Radar before sharing on WhatsApp groups or social media.&rdquo;
                </p>

                <button
                  onClick={() => setHasPledged(true)}
                  disabled={hasPledged}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-60"
                >
                  {hasPledged ? '✓ Thank you for defending truth!' : 'Sign Citizen Pledge 🇳🇬'}
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
                  Civic Media Hub
                </span>
                <p className="text-xs font-bold text-white">
                  Empowering Citizens & Independent Newsrooms Across 36 States
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
