'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Flame, 
  Activity, 
  RefreshCw, 
  ExternalLink, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { NigeriaMapSvg, GeopoliticalZone } from './NigeriaMapSvg';
import { LiveRegionalRumour } from '@/app/api/heatmap/live-rumors/route';
import { SectionHelpModal } from '@/components/SectionHelpModal';
import { useTranslations } from '@/context/LanguageContext';

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
    title: 'Fabricated Market Levy Directive Alleging Weekly Fuel Station Surcharge',
    headline: 'Fake state revenue service letter demanding weekly levy from independent petroleum marketers',
    zone: 'South East',
    state: 'Enugu',
    category: 'Governance & Economy',
    verdict: 'CONTRADICTED',
    velocity: 'HIGH',
    verifiedCount: 650,
    publishedAt: 'Past 3 Days',
    source: 'Enugu Internal Revenue Service & TheCable',
    sourceUrl: 'https://www.thecable.ng',
    summary: 'Enugu State Internal Revenue Service disowned the viral memo as fraudulent extortion attempt.'
  },
  {
    id: 'init-ne-1',
    title: 'Relief Food Palliative Registration Fee Telegram Scam',
    headline: 'Scam Telegram bots demanding N3,500 bank transfer processing fee for FG grains distribution',
    zone: 'North East',
    state: 'Borno (Maiduguri)',
    category: 'Banking / Fintech',
    verdict: 'CONTRADICTED',
    velocity: 'CRITICAL',
    verifiedCount: 1420,
    publishedAt: 'Today',
    source: 'Federal Ministry of Agriculture & Africa Check',
    sourceUrl: 'https://africacheck.org',
    summary: 'Paga rail lookup identified beneficiary account as private retail account. FG grains distribution requires zero fee.'
  }
];

export function NigeriaHeatmap({ onSelectClaim }: NigeriaHeatmapProps) {
  const { t, locale, isPidgin } = useTranslations();
  const [selectedZone, setSelectedZone] = useState<GeopoliticalZone | 'ALL'>('ALL');
  const [rumours, setRumours] = useState<LiveRegionalRumour[]>(INITIAL_RUMOURS);
  const [selectedRumour, setSelectedRumour] = useState<LiveRegionalRumour | null>(INITIAL_RUMOURS[0]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-white via-[#EAF3FC] to-white border border-[#D5E7FA] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#EAF3FC] text-[#005A9C] border border-[#D5E7FA] text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#005A9C] animate-pulse" />
              {t('map.radarTitle')}
            </span>
            <span className="text-[11px] font-mono text-[#16A36A] flex items-center gap-1 font-bold">
              <Activity className="w-3 h-3 animate-pulse" /> {t('map.liveFeed')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0C2340] tracking-tight font-display">
            {t('map.pageTitle')}
          </h2>
          <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
            {t('map.pageSubtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D5E7FA] hover:bg-slate-50 text-[#0C2340] text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title={t('map.howToUseBtn')}
          >
            <HelpCircle className="w-4 h-4 text-[#005A9C]" />
            <span>{t('map.howToUseBtn')}</span>
          </button>

          <button
            onClick={() => fetchLiveRumours()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#005A9C] hover:bg-[#00477E] text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            title={t('map.refreshBtn')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('map.refreshBtn')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Realistic Map on Left, Rumor Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-7">
          <NigeriaMapSvg 
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            zoneThreatCounts={zoneThreatCounts}
            zoneCriticalCounts={zoneCriticalCounts}
          />
        </div>

        {/* Right Column: Zone Rumor Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#D5E7FA] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5E7FA] pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#005A9C]" />
                <h3 className="font-bold text-sm text-[#0C2340] font-display">
                  {selectedZone === 'ALL' ? t('map.nationwideFeed') : t('map.zoneFeed', { zone: selectedZone })}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">
                {t('map.activeItems', { count: filteredRumours.length })}
              </span>
            </div>

            {/* List of rumors */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredRumours.map((r) => {
                const isSelected = activeFocus?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRumour(r)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EAF3FC] border-[#005A9C] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#0C2340]">
                        {r.state} ({r.zone})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.velocity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.velocity === 'CRITICAL' ? t('map.criticalVelocity') : t('map.highVelocity')}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#0C2340] leading-snug">
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">
                      {r.summary}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#D5E7FA] flex items-center justify-between">
                      <span className="text-[10px] text-[#64748B]">
                        {t('map.source', { source: r.source })}
                      </span>
                      {onSelectClaim && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectClaim(r.title);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#005A9C] text-white text-[10px] font-bold hover:bg-[#00477E] transition-colors cursor-pointer"
                        >
                          {t('map.verifyClaimBtn')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SectionHelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        section="heatmap" 
        appLanguage={locale} 
      />
    </div>
  );
}
