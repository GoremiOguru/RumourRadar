'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BrandShieldScanResult, BrandAlert, DebunkKit } from '@/types';
import { 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Lock, 
  Send, 
  MessageSquare,
  Camera,
  Briefcase,
  FileText,
  Flame,
  Globe,
  Activity,
  Newspaper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { VerifiedBrandNewsItem } from '@/app/api/brand-shield/scan/route';

interface BrandShieldDashboardProps {
  onOpenSubscriptionModal: () => void;
}

const BRAND_PRESETS = [
  'GTBank',
  'Kuda Bank',
  'Opay',
  'Access Bank',
  'Dangote Group',
  'MTN Nigeria',
  'Airtel Nigeria',
  'Flutterwave',
  'NNPC Limited'
];

export function BrandShieldDashboard({ onOpenSubscriptionModal }: BrandShieldDashboardProps) {
  const [brandInput, setBrandInput] = useState('GTBank');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<(BrandShieldScanResult & { recentWeeklyNews?: VerifiedBrandNewsItem[] }) | null>(null);
  const [activeTab, setActiveTab] = useState<'rumours' | 'weekly_news' | 'debunk_kit'>('rumours');
  const [activeSocialTab, setActiveSocialTab] = useState<'twitter' | 'whatsapp' | 'press' | 'linkedin' | 'instagram'>('twitter');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(true);
  const [lastScannedTime, setLastScannedTime] = useState<string>('');
  const signalsScrollRef = useRef<HTMLDivElement>(null);

  const executeScan = async (targetBrand?: string) => {
    const brand = targetBrand || brandInput;
    if (!brand.trim()) return;

    setIsScanning(true);
    try {
      const res = await fetch('/api/brand-shield/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName: brand })
      });

      if (res.ok) {
        const data = await res.json();
        setScanResult(data.result);
      }
    } catch (err) {
      console.error('Brand Shield scan failed:', err);
    } finally {
      setIsScanning(false);
      setLastScannedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    executeScan('GTBank');
  }, []);

  // Auto-update polling (every 45s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoUpdating && scanResult?.brandName) {
      interval = setInterval(() => {
        executeScan(scanResult.brandName);
      }, 45000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoUpdating, scanResult?.brandName]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getSocialPostText = (kit?: DebunkKit): string => {
    if (!kit) return '';
    switch (activeSocialTab) {
      case 'twitter':
        return kit.twitterPost;
      case 'whatsapp':
        return kit.whatsappBroadcastTemplate;
      case 'linkedin':
        return kit.linkedInStatement;
      case 'instagram':
        return kit.facebookInstagramCaption;
      default:
        return kit.officialStatementDraft;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              BMONI ENTERPRISE RADAR
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Weekly Ingestion & PR Debunk Kits
            </span>
            {lastScannedTime && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> Live Telemetry ({lastScannedTime})
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Brand Shield: Real-Time Crisis & Misinformation Radar
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Surveillance for Nigerian institutions. Monitors viral WhatsApp forwards, fake circulars, and all weekly brand news with auto-generated PR Debunk Kits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsAutoUpdating(!isAutoUpdating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isAutoUpdating
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isAutoUpdating ? '● Auto-Update ON (45s)' : '○ Auto-Update Paused'}
          </button>

          <button
            onClick={onOpenSubscriptionModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Manage Enterprise Plan (₦250k/mo)</span>
          </button>
        </div>
      </div>

      {/* Brand Search Bar & Presets */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-blue-500/30 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="Search any Nigerian entity (e.g. GTBank, Kuda, Dangote, Opay, Access Bank)..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && executeScan()}
            />
          </div>

          <button
            onClick={() => executeScan()}
            disabled={isScanning || !brandInput.trim()}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning Media...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan Brand Threats</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">Monitored Brands:</span>
          {BRAND_PRESETS.map((b) => (
            <button
              key={b}
              onClick={() => {
                setBrandInput(b);
                executeScan(b);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 transition-all shrink-0 active:scale-95"
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results View */}
      {scanResult && (
        <div className="space-y-6">
          {/* Status Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Monitored Entity</span>
              <div className="text-lg font-black text-white truncate">{scanResult.brandName}</div>
              <div className="text-xs text-blue-400 font-mono">Nigeria Surveillance Grid</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Surveillance Threat Level</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-black ${
                  scanResult.threatLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {scanResult.threatLevel}
                </span>
                <span className="text-xs font-mono text-slate-400">Total Alerts: {scanResult.totalAlerts}</span>
              </div>
              <div className="text-[11px] text-slate-400">Active Rumours Detected: {scanResult.alerts.length}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Weekly Press Ingestion</span>
              <div className="text-lg font-black text-emerald-400">
                {scanResult.recentWeeklyNews?.length || 0} Articles Scanned
              </div>
              <div className="text-[11px] text-slate-400">Continuous 7-Day Live Ingestion</div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('rumours')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'rumours'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>Unverified Rumours & Threat Alerts ({scanResult.alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly_news')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'weekly_news'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-emerald-300" />
              <span>All Recent News This Week ({scanResult.recentWeeklyNews?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('debunk_kit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'debunk_kit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-300" />
              <span>1-Click Multi-Platform PR Debunk Kit</span>
            </button>
          </div>

          {/* Tab 1: Unverified Rumours & Threats */}
          {activeTab === 'rumours' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
                    <span>Detected Misinformation Signals ({scanResult.alerts.length})</span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Horizontal Stream
                    </span>
                  </span>
                  <p className="text-[11px] font-mono text-slate-500">Auto-prioritized by enterprise risk level</p>
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => signalsScrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => signalsScrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div 
                ref={signalsScrollRef}
                className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700"
              >
                {scanResult.alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="min-w-[300px] sm:min-w-[360px] max-w-[420px] shrink-0 snap-start glass-panel p-4 sm:p-5 rounded-xl border-rose-500/30 flex flex-col justify-between shadow-xl space-y-3 hover:border-rose-500/50 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                          {alert.severity}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">{alert.publishedDate}</span>
                      </div>

                      <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">{alert.title}</h4>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        {alert.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400 font-mono">
                        Source: <strong className="text-slate-200">{alert.sourceName}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {alert.sourceUrl && (
                          <a
                            href={alert.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Source Article</span>
                          </a>
                        )}

                        <button
                          onClick={() => setActiveTab('debunk_kit')}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                        >
                          Generate PR Debunk Kit &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: All Recent News This Week (Live Weekly Ingestion) */}
          {activeTab === 'weekly_news' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified News Published This Week ({scanResult.recentWeeklyNews?.length || 0})
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Real-time Press Ingestion
                </span>
              </div>

              {scanResult.recentWeeklyNews && scanResult.recentWeeklyNews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scanResult.recentWeeklyNews.map((news) => (
                    <div
                      key={news.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-emerald-400 truncate max-w-[180px]">
                            {news.source}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {news.publishedDate}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 leading-relaxed">
                          {news.title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {news.snippet}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          news.sentiment === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                          news.sentiment === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {news.sentiment}
                        </span>

                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>Read Full Story</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs font-mono">
                  No press releases recorded in the past 7 days for this keyword.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: 1-Click Multi-Platform PR Debunk Kit */}
          {activeTab === 'debunk_kit' && scanResult.debunkKit && (
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border-blue-500/30 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Multi-Platform Crisis PR Debunk Kit for {scanResult.brandName}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ready-to-publish executive statements crafted by Rumour Radar crisis AI.
                  </p>
                </div>

                <button
                  onClick={() => scanResult.debunkKit && handleCopy(scanResult.debunkKit.officialStatementDraft, 'official_stmt')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  {copiedKey === 'official_stmt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'official_stmt' ? 'Copied Press Release!' : 'Copy Official Statement'}</span>
                </button>
              </div>

              {/* Official Statement Draft */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                  Official Press Clarification Draft
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {scanResult.debunkKit.officialStatementDraft}
                </p>
              </div>

              {/* Social Media Channels Copy Bar */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Platform-Tailored Debunk Broadcasts:
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveSocialTab('twitter')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'twitter' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-mono">𝕏</span> Twitter / X
                  </button>

                  <button
                    onClick={() => setActiveSocialTab('whatsapp')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Broadcast
                  </button>

                  <button
                    onClick={() => setActiveSocialTab('linkedin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'linkedin' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> LinkedIn Statement
                  </button>

                  <button
                    onClick={() => setActiveSocialTab('instagram')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" /> Instagram Caption
                  </button>
                </div>

                {/* Social Copy Box */}
                <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {getSocialPostText(scanResult.debunkKit)}

                  <button
                    onClick={() => {
                      const text = getSocialPostText(scanResult.debunkKit);
                      handleCopy(text, activeSocialTab);
                    }}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1"
                  >
                    {copiedKey === activeSocialTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === activeSocialTab ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
