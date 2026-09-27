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
  appLanguage?: 'en' | 'pcm';
}

export function AboutSection({ onOpenTipModal, onSelectTab, appLanguage = 'en' }: AboutSectionProps) {
  const isPidgin = appLanguage === 'pcm';
  const [activeTab, setActiveTab] = useState<'market' | 'pipeline' | 'civic'>('market');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [hasPledged, setHasPledged] = useState(false);

  const PIPELINE_STAGES = [
    {
      stage: 1,
      title: isPidgin ? 'Multimodal Vision & Social Media Extract' : 'Multimodal Vision & Social Media Extraction',
      badge: isPidgin ? 'OCR & Text Scanner' : 'Gemini Vision OCR',
      desc: isPidgin 
        ? 'Parses viral WhatsApp messages, X (Twitter) tweets, TikTok video text, Telegram posts, or uploaded screenshots. E dey separate real tori from fake panic text.' 
        : 'Parses viral WhatsApp forwards, X (Twitter) tweets, TikTok captions, Telegram posts, news links, or uploaded screenshot memos. Extracts core factual claims while stripping panic fluff.',
      icon: <Brain className="w-5 h-5 text-emerald-400" />
    },
    {
      stage: 2,
      title: isPidgin ? 'Claim Guardrail & Nigeria Authority Router' : 'Claim Guardrail & Nigeria Authority Router',
      badge: isPidgin ? 'Live Guardrail + Registry' : 'Live Registry Search',
      desc: isPidgin
        ? 'Intercepts greetings like "how are you doing" so e no go give fake verdict. Directly checks official CBN, INEC, NCDC, JAMB, WAEC, SEC, and NPF registries.'
        : 'Intercepts casual greetings/banter via Claim Guardrail. Directly routes factual claims to official Nigerian regulatory bodies (CBN, INEC, NCDC, JAMB, WAEC, SEC, NPF) and accredited fact-checking desks (Dubawa, Africa Check, FactCheckHub).',
      icon: <Database className="w-5 h-5 text-blue-400" />
    },
    {
      stage: 3,
      title: isPidgin ? 'Math Formula Scoring' : 'Deterministic Scoring Matrix',
      badge: isPidgin ? 'Zero Lie Math' : 'Math Scoring',
      desc: isPidgin
        ? 'Uses clear math formula: 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context. E dey give Supported, Contradicted, Misleading, Satire, or Unverified.'
        : 'Applies weighted evidence formula: 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context. Yields Supported, Contradicted, Misleading, Satire, Non-Claim, or Unverified.',
      icon: <Calculator className="w-5 h-5 text-purple-400" />
    },
    {
      stage: 4,
      title: isPidgin ? 'Global Pidgin & 5-Language Audio Kit' : 'Pidgin Audio & Social Debunk Kit',
      badge: isPidgin ? 'Universal Broadcast' : 'Universal Broadcast',
      desc: isPidgin
        ? 'Generates audio in Nigerian accent, full app translation to Naija Pidgin, plus Yorùbá, Hausa, and Igbo summaries for instant share on WhatsApp & X.'
        : 'Generates authentic Google Maps Nigerian English voice audio, Naija Pidgin translations, 5-language summaries (Pidgin, Yoruba, Hausa, Igbo), and 1-click shareable cards for WhatsApp & X.',
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
              {isPidgin 
                ? 'We Dey Stop Lie Lie Tori with Solid Proof from Government & News' 
                : 'Stopping Disinformation with Evidence-Grounded AI'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isPidgin
                ? 'Rumour Radar na Nigeria number 1 tool wey dey check viral WhatsApp audio, X (Twitter) tweets, TikTok video text, Telegram posts, and fake government memo before e cause trouble.'
                : 'Rumour Radar is Nigeria\'s premier evidence-first verification engine designed to neutralize viral WhatsApp hoaxes, X (Twitter) tweets, TikTok captions, forged government circulars, and panic threats.'}
            </p>
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
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'market'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🎯 {isPidgin ? 'Why We Pass Other AI' : 'Our Place in the Market'}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'pipeline'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚙️ {isPidgin ? 'How We Dey Work (AI Engine)' : 'How We Work (Dual-Rail AI)'}
          </button>

          <button
            onClick={() => setActiveTab('civic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-display ${
              activeTab === 'civic'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🇳🇬 {isPidgin ? 'Naija People Duty & Promise' : 'Civic Mission & Citizen Appeal'}
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
