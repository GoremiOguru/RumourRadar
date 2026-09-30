'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Activity, 
  RefreshCw, 
  ExternalLink, 
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  HelpCircle
} from 'lucide-react';
import { NigeriaMapSvg, GeopoliticalZone } from './NigeriaMapSvg';
import { LiveRegionalRumour } from '@/app/api/heatmap/live-rumors/route';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHelpModal } from '@/components/SectionHelpModal';

interface NigeriaHeatmapProps {
  onSelectClaim?: (claim: string) => void;
  appLanguage?: 'en' | 'pcm';
}

const ZONES: Array<GeopoliticalZone | 'ALL'> = [
  'ALL',
  'South West',
  'North Central',
  'North West',
  'South South',
  'South East',
  'North East'
];

const INITIAL_RUMOURS: LiveRegionalRumour[] = [
  {
    id: 'init-sw-1',
    title: 'Viral Audio Claiming Automated CBN Freeze on Mobile Fintech Wallets',
    headline: 'Viral voice notes alleging sudden CBN restrictions and freeze on commercial fintech accounts',
    zone: 'South West',
    state: 'Lagos',
    category: 'Banking / Fintech',
    verdict: 'CONTRADICTED',
    velocity: 'CRITICAL',
    verifiedCount: 1640,
    publishedAt: 'Today',
    source: 'Central Bank of Nigeria & Premium Times',
    sourceUrl: 'https://www.premiumtimesng.com/news/top-news',
    summary: 'CBN press secretariat issued formal bulletin confirming no restrictions or account freezes have been placed on fintech operations.'
  },
  {
    id: 'init-nc-1',
    title: 'Alleged 140 Minimum UTME Cut-Off Circular for Federal Universities',
    headline: 'Forged admission circular alleging sudden 140 benchmark change across Nigerian federal universities',
    zone: 'North Central',
    state: 'Abuja (FCT)',
    category: 'Education',
    verdict: 'MISLEADING',
    velocity: 'HIGH',
    verifiedCount: 1120,
    publishedAt: 'Yesterday',
    source: 'JAMB Bulletin & Daily Trust',
    sourceUrl: 'https://dailytrust.com',
    summary: 'JAMB clarified that institutional cut-off points are determined individually by university senates at the national policy meeting.'
  },
  {
    id: 'init-nw-1',
    title: 'Emergency Cholera Night Market Curfew Advisory in Kano State',
    headline: 'Doctored state health ministry memo declaring immediate night market shutdown in Kano metropolis',
    zone: 'North West',
    state: 'Kano',
    category: 'Public Health',
    verdict: 'CONTRADICTED',
    velocity: 'CRITICAL',
    verifiedCount: 890,
    publishedAt: 'Past 48h',
    source: 'NCDC Surveillance Desk & Punch',
    sourceUrl: 'https://punchng.com',
    summary: 'Kano State Ministry of Health refuted the circular, confirming surveillance teams are active but no commercial curfews have been declared.'
  },
  {
    id: 'init-ss-1',
    title: 'Crude Pipeline Contamination Alert in Niger Delta Waterways',
    headline: 'Unverified social media warning alleging widespread river contamination in Port Harcourt creek communities',
    zone: 'South South',
    state: 'Rivers (Port Harcourt)',
    category: 'Security Alert',
    verdict: 'MISLEADING',
    velocity: 'HIGH',
    verifiedCount: 780,
    publishedAt: 'This Week',
    source: 'Vanguard Nigeria & NOSDRA',
    sourceUrl: 'https://www.vanguardngr.com',
    summary: 'NOSDRA joint environmental assessment verified localized containment without municipal drinking water grid impact.'
  },
  {
    id: 'init-se-1',
    title: 'Doctored Ministerial Gazette Circulating Ahead of Federal Appointments',
    headline: 'Parody social media handle list of ministerial reassignments taken as breaking official news',
    zone: 'South East',
    state: 'Enugu',
    category: 'Elections & Politics',
    verdict: 'SATIRE_PARODY',
    velocity: 'MODERATE',
    verifiedCount: 540,
    publishedAt: 'This Week',
    source: 'TheCable Fact Check Desk',
    sourceUrl: 'https://www.thecable.ng',
    summary: 'The purported gazette originated from a satire comedy channel and was mistaken for an official Presidency press release.'
  },
  {
    id: 'init-ne-1',
    title: 'Recycled 2022 Lake Chad Basin Flood Video Shared as 2026 Emergency',
    headline: 'Old flood footage from prior seasons recirculated on TikTok and WhatsApp as active Maiduguri dam collapse',
    zone: 'North East',
    state: 'Borno (Maiduguri)',
    category: 'Security Alert',
    verdict: 'MISLEADING',
    velocity: 'HIGH',
    verifiedCount: 670,
    publishedAt: 'This Week',
    source: 'NEMA Fact Check & Dubawa',
    sourceUrl: 'https://dubawa.org/nigeria',
    summary: 'Reverse video frame search confirmed footage was originally recorded during the 2022 flood season.'
  }
];

export function NigeriaHeatmap({ onSelectClaim, appLanguage = 'en' }: NigeriaHeatmapProps = {}) {
  const isPidgin = appLanguage === 'pcm';
  const [selectedZone, setSelectedZone] = useState<GeopoliticalZone | 'ALL'>('ALL');
  const [rumours, setRumours] = useState<LiveRegionalRumour[]>(INITIAL_RUMOURS);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live now');
  const [selectedRumour, setSelectedRumour] = useState<LiveRegionalRumour | null>(INITIAL_RUMOURS[0]);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const fetchLiveRumours = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/heatmap/live-rumors');
      if (res.ok) {
        const data = await res.json();
        if (data.rumours && data.rumours.length > 0) {
          setRumours(data.rumours);
          if (!selectedRumour) {
            setSelectedRumour(data.rumours[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load live rumours:', err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchLiveRumours();

    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefreshing) {
      interval = setInterval(() => {
        fetchLiveRumours();
      }, 60000); // 60s live poll
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefreshing]);

  // Compute live zone metrics
  const zoneThreatCounts: Record<GeopoliticalZone, number> = {
    'South West': 0,
    'South East': 0,
    'South South': 0,
    'North Central': 0,
    'North West': 0,
    'North East': 0
  };

  const zoneCriticalCounts: Record<GeopoliticalZone, number> = {
    'South West': 0,
    'South East': 0,
    'South South': 0,
    'North Central': 0,
    'North West': 0,
    'North East': 0
  };

  rumours.forEach(r => {
    if (zoneThreatCounts[r.zone] !== undefined) {
      zoneThreatCounts[r.zone]++;
      if (r.velocity === 'CRITICAL') {
        zoneCriticalCounts[r.zone]++;
      }
    }
  });

  const filteredRumours = selectedZone === 'ALL'
    ? rumours
    : rumours.filter(r => r.zone === selectedZone);

  const activeFocus = selectedRumour || filteredRumours[0] || rumours[0];

  return (
    <div className="section-stagger space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {isPidgin ? 'LIVE NAIJA TORI RADAR' : 'LIVE NIGERIA CONTAGION RADAR'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> {isPidgin ? 'Live Auto-Updated Feed' : 'Auto-Updated Live Feed'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isPidgin ? 'Naija Geopolitical Rumour & Contagion Map' : 'Nigeria Geopolitical Rumour & Contagion Heatmap'}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {isPidgin 
              ? 'Real-time surveillance of unverified breaking claims, viral voice notes, fake circulars, and lie-lie tori across all 6 geopolitical zones for Naija.'
              : 'Real-time surveillance of unverified breaking claims, viral circulars, and panic vectors across all 6 Nigerian geopolitical zones.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all shadow-sm active:scale-95"
            title={isPidgin ? 'How to use Geo Heatmap' : 'How to use Geo Heatmap'}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{isPidgin ? 'How to Use?' : 'How to Use?'}</span>
          </button>

          <button
            onClick={() => fetchLiveRumours()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Fetch latest live Nigerian news rumors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
            <span>{loading ? (isPidgin ? 'Dey Scan...' : 'Scanning...') : (isPidgin ? 'Refresh Live Tori' : 'Refresh Live')}</span>
          </button>

          {lastRefreshed && (
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              {isPidgin ? 'Updated:' : 'Updated:'} {lastRefreshed}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Geopolitical SVG Map Component */}
      <NigeriaMapSvg
        selectedZone={selectedZone}
        onSelectZone={(zone) => setSelectedZone(zone)}
        zoneThreatCounts={zoneThreatCounts}
        zoneCriticalCounts={zoneCriticalCounts}
      />

      {/* Geopolitical Zone Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1">
        <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">{isPidgin ? 'Filter Region:' : 'Filter Zone:'}</span>
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedZone === zone
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {zone === 'ALL' ? (isPidgin ? 'Everywhere for Naija (6 Zones)' : 'All Nigeria (6 Zones)') : zone}
          </button>
        ))}
      </div>

      {/* Grid: Live Rumours List + Detailed Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Regional Alerts Stream */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isPidgin ? `Live Claims We Dey Watch (${filteredRumours.length})` : `Live Monitored Claims (${filteredRumours.length})`}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {selectedZone === 'ALL' ? (isPidgin ? 'Naija Nationwide Feed' : 'Nationwide Feed') : `Region: ${selectedZone}`}
            </span>
          </div>

          {loading && rumours.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
              <p className="text-xs text-slate-300 font-mono">Ingesting live Nigerian feeds across 6 zones...</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredRumours.map((item) => {
                const isSelected = activeFocus?.id === item.id;
                return (
                  <ScrollReveal
                    key={item.id}
                    delay={Math.min(filteredRumours.indexOf(item) * 55, 220)}
                  >
                    <div
                      onClick={() => {
                        setSelectedRumour(item);
                        setSelectedZone(item.zone);
                      }}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-slate-900/95 border-amber-500 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/50 scale-[1.01]'
                        : 'bg-slate-900/45 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate">{item.state}</span>
                        <span className="text-[10px] font-mono text-slate-400">({item.zone})</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                        item.velocity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                        item.velocity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {item.velocity} VELOCITY
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-medium text-slate-100 line-clamp-2 mb-2 leading-relaxed">
                      &ldquo;{item.headline}&rdquo;
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="text-emerald-300 font-semibold">{item.category}</span>
                      <span className="font-mono text-slate-300">{item.verifiedCount.toLocaleString()} queries</span>
                    </div>
                  </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deep Inspection Node */}
        {activeFocus && (
          <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border-amber-500/30 space-y-4 h-fit sticky top-20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">{activeFocus.state} Incident Node</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">{activeFocus.zone}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-200">{activeFocus.category}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Grounding Status:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                  activeFocus.verdict === 'CONTRADICTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  activeFocus.verdict === 'MISLEADING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  activeFocus.verdict === 'SUPPORTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {activeFocus.verdict}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Surveillance Source:</span>
                <span className="font-mono text-slate-300 truncate max-w-[180px]">{activeFocus.source}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Viral Claim Headline</span>
                </div>
                <p className="text-xs text-slate-100 italic leading-relaxed font-medium">
                  &ldquo;{activeFocus.headline}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dual-Rail Grounding Analysis</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed break-words">
                  {activeFocus.summary}
                </p>

                {activeFocus.sourceUrl && (
                  <a
                    href={activeFocus.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold border border-slate-700/80 transition-colors w-full justify-between"
                  >
                    <span className="truncate">Read full reporting on {activeFocus.source}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>

              {onSelectClaim && (
                <button
                  onClick={() => onSelectClaim(activeFocus.headline)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Verify This Claim in Radar &rarr;</span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Viral Query Volume:</span>
              <span className="text-emerald-400 font-bold">{activeFocus.verifiedCount.toLocaleString()} citizen checks</span>
            </div>
          </div>
        )}
      </div>
      {/* Heatmap Section Help Modal */}
      <SectionHelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        section="heatmap" 
        appLanguage={appLanguage} 
      />
    </div>
  );
}
