'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  HelpCircle,
  Bell,
  BellRing,
  Radio,
  Settings,
  X,
  Zap,
  Phone,
  Save,
  ArrowRight
} from 'lucide-react';
import { VerifiedBrandNewsItem } from '@/app/api/brand-shield/scan/route';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHelpModal } from '@/components/SectionHelpModal';

interface BrandShieldDashboardProps {
  onOpenSubscriptionModal: () => void;
  appLanguage?: 'en' | 'pcm';
  initialBrand?: string;
  onVerifyClaim?: (claimText: string) => void;
}

export function formatNigerianWhatsappNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }
  if (digits.length === 10) {
    return '234' + digits;
  }
  return digits;
}

export function cleanHtmlEntities(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<[^>]*>/g, '')
    .trim();
}

const ENTITY_PRESETS = {
  corporation: ['GTBank', 'Access Bank', 'Opay', 'Dangote Group', 'MTN Nigeria', 'Air Peace', 'Flutterwave', 'Kuda Bank', 'Zenith Bank'],
  creator: ['Davido', 'Burna Boy', 'Wizkid', 'Hilda Baci', 'Tiwa Savage', 'Don Jazzy', 'Asake', 'Tony Elumelu', 'Tunde Ednut'],
  agency: ['CBN', 'INEC', 'EFCC', 'NCDC', 'NNPC Limited', 'NCAA', 'JAMB', 'WAEC']
};

const DEFAULT_WATCHLIST = ['GTBank', 'Davido', 'Dangote Group', 'CBN', 'Burna Boy', 'Opay', 'Hilda Baci'];

export function BrandShieldDashboard({ onOpenSubscriptionModal, appLanguage = 'en', initialBrand, onVerifyClaim }: BrandShieldDashboardProps) {
  const isPidgin = appLanguage === 'pcm';
  const [brandInput, setBrandInput] = useState(initialBrand || 'GTBank');
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [newWatchlistInput, setNewWatchlistInput] = useState('');
  const [entityCategory, setEntityCategory] = useState<'corporation' | 'creator' | 'agency'>('corporation');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<(BrandShieldScanResult & { recentWeeklyNews?: (VerifiedBrandNewsItem & { isNewlyIngested?: boolean })[] }) | null>(null);
  const [activeTab, setActiveTab] = useState<'rumours' | 'weekly_news' | 'debunk_kit'>('rumours');
  const [activeSocialTab, setActiveSocialTab] = useState<'twitter' | 'whatsapp' | 'press' | 'linkedin' | 'instagram'>('twitter');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(true);
  const [lastScannedTime, setLastScannedTime] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const signalsScrollRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isWhyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWhyModalOpen]);

  // Pro & Enterprise Sentinel State
  const [isProActive, setIsProActive] = useState(false);
  const [proOrgName, setProOrgName] = useState('');
  const [proTier, setProTier] = useState<'newsroom_pro' | 'enterprise_shield'>('enterprise_shield');

  // Real-Time Sentinel Article Alerts State
  const [latestNewArticleAlert, setLatestNewArticleAlert] = useState<VerifiedBrandNewsItem | null>(null);
  const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);
  const [alertWhatsappNumber, setAlertWhatsappNumber] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [isAlertConfigSaved, setIsAlertConfigSaved] = useState(false);
  const [sentinelLogs, setSentinelLogs] = useState<Array<{ timestamp: string; message: string; type: 'info' | 'alert' | 'success' }>>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Track known article links across sessions to detect REAL new articles
  const seenArticleLinksRef = useRef<Set<string>>(new Set());
  const initialScanDoneRef = useRef(false);

  // Load Pro status from localStorage
  useEffect(() => {
    const checkProStatus = () => {
      if (typeof window !== 'undefined') {
        const active = localStorage.getItem('rumourradar_pro_active') === 'true';
        const org = localStorage.getItem('rumourradar_org_name') || '';
        const tier = (localStorage.getItem('rumourradar_tier') as any) || 'enterprise_shield';
        const savedPhone = localStorage.getItem('rumourradar_alert_phone') || '';
        const savedEmail = localStorage.getItem('rumourradar_alert_email') || '';
        const savedWatchlist = localStorage.getItem('rumourradar_brand_watchlist');

        setIsProActive(active);
        setProOrgName(org);
        setProTier(tier);
        if (savedPhone) setAlertWhatsappNumber(savedPhone);
        if (savedEmail) setAlertEmail(savedEmail);
        if (savedWatchlist) {
          try {
            const parsed = JSON.parse(savedWatchlist);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWatchlist(parsed);
            }
          } catch (e) {
            // ignore JSON parse error
          }
        }
      }
    };

    checkProStatus();
    window.addEventListener('rumourradar_pro_updated', checkProStatus);
    window.addEventListener('storage', checkProStatus);

    return () => {
      window.removeEventListener('rumourradar_pro_updated', checkProStatus);
      window.removeEventListener('storage', checkProStatus);
    };
  }, []);

  const handleAddToWatchlist = (nameToAdd?: string) => {
    const target = (nameToAdd || newWatchlistInput || brandInput).trim();
    if (!target) return;
    if (!watchlist.includes(target)) {
      const updated = [target, ...watchlist];
      setWatchlist(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rumourradar_brand_watchlist', JSON.stringify(updated));
      }
      addSentinelLog(`Added "${target}" to Multi-Entity Sentinel Watchlist`, 'success');
    }
    setNewWatchlistInput('');
    setBrandInput(target);
    executeScan(target);
  };

  const handleRemoveFromWatchlist = (target: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = watchlist.filter(w => w !== target);
    setWatchlist(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rumourradar_brand_watchlist', JSON.stringify(updated));
    }
    addSentinelLog(`Removed "${target}" from Watchlist`, 'info');
  };

  const addSentinelLog = (message: string, type: 'info' | 'alert' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSentinelLogs(prev => [{ timestamp: time, message, type }, ...prev.slice(0, 19)]);
  };

  const executeScan = async (targetBrand?: string) => {
    const brand = targetBrand || brandInput;
    if (!brand.trim()) return;

    setIsScanning(true);
    addSentinelLog(`Polling 15+ Nigerian media RSS endpoints & social feeds for "${brand}"...`, 'info');

    try {
      const res = await fetch('/api/brand-shield/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName: brand })
      });

      if (res.ok) {
        const data = await res.json();
        const result = data.result as BrandShieldScanResult & { recentWeeklyNews?: VerifiedBrandNewsItem[] };

        // Check for newly discovered real articles since last check
        const newArticles: VerifiedBrandNewsItem[] = [];
        const enrichedWeeklyNews = (result.recentWeeklyNews || []).map(newsItem => {
          const isBrandNew = initialScanDoneRef.current && !seenArticleLinksRef.current.has(newsItem.link);
          if (isBrandNew) {
            newArticles.push(newsItem);
          }
          seenArticleLinksRef.current.add(newsItem.link);
          return {
            ...newsItem,
            isNewlyIngested: isBrandNew
          };
        });

        if (!initialScanDoneRef.current) {
          initialScanDoneRef.current = true;
          // Populate initial set
          (result.recentWeeklyNews || []).forEach(item => seenArticleLinksRef.current.add(item.link));
        } else if (newArticles.length > 0) {
          // Trigger REAL Live Alert Banner
          const newest = newArticles[0];
          setLatestNewArticleAlert(newest);
          addSentinelLog(`🚨 NEW ARTICLE DETECTED: "${newest.title}" from ${newest.source}`, 'alert');
        }

        setScanResult({
          ...result,
          recentWeeklyNews: enrichedWeeklyNews
        });

        addSentinelLog(`Surveillance synchronized. ${enrichedWeeklyNews.length} articles indexed. Threat Level: ${result.threatLevel}`, 'success');
      }
    } catch (err) {
      console.error('Brand Shield scan failed:', err);
      addSentinelLog(`Scan error: Connection timeout with RSS crawler`, 'alert');
    } finally {
      setIsScanning(false);
      setLastScannedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    if (initialBrand && initialBrand.trim().length > 0) {
      setBrandInput(initialBrand);
      executeScan(initialBrand);
    }
  }, [initialBrand]);

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

  const handleSaveAlertConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatNigerianWhatsappNumber(alertWhatsappNumber.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('rumourradar_alert_phone', formatted || alertWhatsappNumber.trim());
      localStorage.setItem('rumourradar_alert_email', alertEmail.trim());
    }
    if (formatted && formatted !== alertWhatsappNumber) {
      setAlertWhatsappNumber(formatted);
    }
    setIsAlertConfigSaved(true);
    addSentinelLog(`WhatsApp notification armed for +${formatted || 'PR Desk'}`, 'success');
    setTimeout(() => {
      setIsAlertConfigSaved(false);
      setIsAlertConfigOpen(false);
    }, 1500);
  };

  const handleQuickDispatchWhatsapp = (customText?: string) => {
    const brand = scanResult?.brandName || brandInput;
    const cleanBrief = cleanHtmlEntities(scanResult?.alerts?.[0]?.summary) || 'Continuous live surveillance active. No critical rumors detected.';
    const text = customText || (scanResult?.debunkKit?.whatsappBroadcastTemplate || `🚨 *RUMOUR RADAR SENTINEL ALERT*\n\nBrand Monitored: *${brand}*\nThreat Level: *${scanResult?.threatLevel || 'MODERATE'}*\n\nLatest Briefing: ${cleanBrief}\n\nVerified by Rumour Radar Nigeria: https://rumourradar.vercel.app`);
    const encoded = encodeURIComponent(text);
    const formattedPhone = formatNigerianWhatsappNumber(alertWhatsappNumber);
    const phoneParam = formattedPhone ? `&phone=${formattedPhone}` : '';
    window.open(`https://api.whatsapp.com/send?text=${encoded}${phoneParam}`, '_blank');
  };

  const handleQuickDispatchTelegram = () => {
    const brand = scanResult?.brandName || brandInput;
    const text = `🚨 *RUMOUR RADAR SENTINEL ALERT*\n\nBrand: *${brand}*\nThreat: *${scanResult?.threatLevel}*\n\n${scanResult?.alerts?.[0]?.summary || 'Live surveillance active.'}\n\nhttps://rumourradar.vercel.app`;
    window.open(`https://t.me/share/url?url=https://rumourradar.vercel.app&text=${encodeURIComponent(text)}`, '_blank');
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
    <div className="section-stagger space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{isPidgin ? 'BMONI BRAND & ENTITY SHIELD' : 'BMONI ENTERPRISE RADAR'}</span>
              </span>
              {isProActive && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>ENTERPRISE SENTINEL ACTIVE</span>
                </span>
              )}
              {lastScannedTime && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Live Telemetry ({lastScannedTime})
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isPidgin ? 'Brand Shield: Live Misinformation & Crisis Radar for Brands & People' : 'Brand Shield: Real-Time Crisis & Misinformation Radar'}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {isPidgin
                ? 'Real-time surveillance for companies, creators, executives & public entities in Nigeria. Monitors viral WhatsApp forwards, fake news & generates 1-click PR Debunk Kits.'
                : 'Surveillance for Nigerian institutions & entities. Monitors viral WhatsApp forwards, fake circulars, and all weekly brand news with auto-generated PR Debunk Kits.'}
            </p>
          </div>

          <button
            onClick={onOpenSubscriptionModal}
            className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 shrink-0 self-start md:self-center ${
              isProActive 
                ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 ring-1 ring-blue-400/50'
            }`}
          >
            {isProActive ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-300" />}
            <span>{isProActive ? (proOrgName ? `Pro Active (${proOrgName})` : 'BMoni Pro Active Tier') : '⚡ Create BMoni Pro Tier Account (₦50k/mo)'}</span>
          </button>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Why Brand Shield?</span>
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>How to Use?</span>
            </button>
          </div>

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
        </div>
      </div>

      {/* REAL-TIME ALERT BANNER WHEN NEW ARTICLE OR CRISIS IS DETECTED */}
      {latestNewArticleAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-500 text-white tracking-wider animate-pulse">
                  🚨 REAL-TIME SENTINEL ALERT
                </span>
                <span className="text-xs font-mono text-slate-300">
                  New Press Story Ingested Just Now ({latestNewArticleAlert.source})
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                "{latestNewArticleAlert.title}"
              </h4>
              <p className="text-xs text-slate-300 line-clamp-1">
                {latestNewArticleAlert.snippet}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => handleQuickDispatchWhatsapp(`🚨 *RUMOUR RADAR NEW STORY ALERT*\n\nBrand: *${brandInput}*\nStory: *${latestNewArticleAlert.title}*\nSource: ${latestNewArticleAlert.source}\nLink: ${latestNewArticleAlert.link}\n\nAutomated Sentinel Alert from RumourRadar.ng`)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Dispatch WhatsApp Alert</span>
            </button>

            <button
              onClick={() => setLatestNewArticleAlert(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Brand Search Bar & Presets */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-blue-500/30 space-y-4 shadow-lg">
        {/* Entity Type Filter Tabs - Fully Visible on Mobile & Desktop */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 font-bold block">
            {isPidgin ? 'Target Entity Type (Choose one to scan):' : 'Target Entity Category (Select to scan):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'corporation', label: '🏢 Corporations & SMEs', desc: 'Banks, Fintechs, Telecoms' },
              { id: 'creator', label: '👤 Personal Brands & Creators', desc: 'Celebrities, Influencers & Leaders' },
              { id: 'agency', label: '🏛️ Government & Regulators', desc: 'CBN, INEC, EFCC, NCDC' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEntityCategory(tab.id as any)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between border ${
                  entityCategory === tab.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal mt-0.5 ${entityCategory === tab.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeScan()}
              placeholder={isPidgin ? "Type company name, creator or public person to scan..." : "Search brand name, corporate entity, creator, or government agency..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            onClick={() => executeScan()}
            disabled={isScanning || !brandInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isPidgin ? 'We Dey Scan News...' : 'Scanning Surveillance Grid...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isPidgin ? 'Scan Brand News & Rumours' : 'Run Crisis Radar Scan'}</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Quick-Search Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-mono text-slate-400 font-bold shrink-0 mr-1">Trending Entities:</span>
          {ENTITY_PRESETS[entityCategory].map((b) => (
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

        {/* Multi-Entity Sentinel Watchlist Manager */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">
                {isPidgin ? 'Your Sentinel Watchlist (Track Multi-Entities & Celebrities):' : 'Multi-Entity Sentinel Watchlist (Celebrities, Brands & Agencies):'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {watchlist.length} Active
              </span>
            </div>

            {/* Quick Add Custom Entity */}
            <div className="flex items-center gap-1.5">
              <input 
                type="text"
                value={newWatchlistInput}
                onChange={(e) => setNewWatchlistInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddToWatchlist()}
                placeholder="Add celebrity or brand (e.g. Davido, Opay)..."
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 w-48 sm:w-56"
              />
              <button
                onClick={() => handleAddToWatchlist()}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
              >
                + Track
              </button>
            </div>
          </div>

          {/* Watchlist Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {watchlist.map((entity) => {
              const isSelected = brandInput.toLowerCase() === entity.toLowerCase();
              return (
                <div
                  key={entity}
                  onClick={() => {
                    setBrandInput(entity);
                    executeScan(entity);
                  }}
                  className={`group flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-blue-500 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-emerald-400'}`} />
                  <span>{entity}</span>
                  <button
                    onClick={(e) => handleRemoveFromWatchlist(entity, e)}
                    className="opacity-40 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity"
                    title={`Stop tracking ${entity}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            {!watchlist.includes(brandInput.trim()) && brandInput.trim().length > 0 && (
              <button
                onClick={() => handleAddToWatchlist(brandInput)}
                className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-medium hover:bg-blue-500/30 transition-all flex items-center gap-1"
              >
                <span>+ Add "{brandInput}" to Watchlist</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400">● 24/7 Multi-Platform Coverage:</span>
            <span>WhatsApp forward chains, X (Twitter) viral quotes, TikTok skits, Telegram channels & Nigerian newsrooms.</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC 24/7 SENTINEL NODE: LOCKED TEASER vs ACTIVE LIVE DISPATCHER */}
      {!isProActive ? (
        /* Free Tier: Informational Upgrade Banner */
        <div 
          onClick={onOpenSubscriptionModal}
          className="glass-panel p-4 rounded-2xl border-blue-500/40 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 hover:border-blue-400 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Automated Sentinel & Instant WhatsApp Alerts</h4>
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  BMONI Pro Feature
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Get notified immediately on WhatsApp & Telegram the second viral rumors or new press articles mention your brand.
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSubscriptionModal();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Unlock Automated Sentinel &rarr;</span>
          </button>
        </div>
      ) : (
        /* PRO & ENTERPRISE TIER: LIVE ACTIVE SENTINEL NODE */
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-extrabold text-white">24/7 Automated Sentinel Node Active</h4>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                    Continuous Surveillance Live
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Active Target: <strong className="text-emerald-400">{scanResult?.brandName || brandInput}</strong> • Continuous 45s Multi-Source RSS & Social Crawl
                </p>
              </div>
            </div>

            {/* Instant Actions */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <button
                onClick={() => handleQuickDispatchWhatsapp()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="Send active debunk & crisis status to WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Instant WhatsApp Dispatch</span>
              </button>

              <button
                onClick={handleQuickDispatchTelegram}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                title="Share to Telegram channel"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </button>

              <button
                onClick={() => setIsAlertConfigOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                title="Configure alert phone number & channels"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>{alertWhatsappNumber ? `Alerts: ${alertWhatsappNumber.slice(-4)}` : 'Alert Settings'}</span>
              </button>

              <button
                onClick={() => setShowLogs(!showLogs)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 font-mono text-[11px] transition-colors"
                title="View Sentinel Telemetry Stream"
              >
                {showLogs ? 'Hide Logs ▲' : 'Logs ▼'}
              </button>
            </div>
          </div>

          {/* Collapsible Telemetry Ingestion Log Box */}
          {showLogs && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              <div className="text-slate-500 pb-1 border-b border-slate-900 flex justify-between items-center">
                <span>🛰️ Sentinel Live Ingestion Stream ({sentinelLogs.length} events):</span>
                <span className="text-emerald-400">Node Status: Operational</span>
              </div>
              {sentinelLogs.length === 0 ? (
                <div className="text-slate-500 py-2">Listening for incoming media streams...</div>
              ) : (
                sentinelLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={log.type === 'alert' ? 'text-rose-400 font-bold' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

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
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
                    <span>{isPidgin ? `Detected Rumor Signals (${scanResult.alerts.length})` : `Detected Misinformation Signals (${scanResult.alerts.length})`}</span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      ← Swipe Horizontal Stream →
                    </span>
                    {!isProActive && scanResult.alerts.length > 1 && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Sample Preview (1 of {scanResult.alerts.length})
                      </span>
                    )}
                  </span>
                  <p className="text-[11px] font-mono text-slate-500">
                    {isPidgin ? 'Click "Check in Claim Engine" to verify why any tori be rumour' : 'Click "Check in Claim Engine" to inspect grounded evidence for any rumor'}
                  </p>
                </div>

                {/* Horizontal Navigation Arrow Buttons */}
                {scanResult.alerts.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => signalsScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all shadow-sm"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => signalsScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all shadow-sm"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {scanResult.alerts.length === 0 ? (
                <div className="glass-panel p-8 text-center rounded-2xl border-emerald-500/40 bg-emerald-950/20 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {isPidgin 
                      ? `Everything Clean! We don scan everywhere and no lie-lie tori or fake news dey about ${scanResult.brandName}.`
                      : `Surveillance Scan Complete: No active rumors, fake news, or circulars detected for ${scanResult.brandName}.`}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                    {isPidgin
                      ? `Status: ALL CLEAR (0 Rumor Found in past 7 days)`
                      : `Threat Status: ALL CLEAR (0 Monitored Rumors Found)`}
                  </p>
                </div>
              ) : (
                <div 
                  ref={signalsScrollRef}
                  className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700"
                >
                  {/* For Free Tier: Only display the first card as sample preview */}
                  {(isProActive ? scanResult.alerts : scanResult.alerts.slice(0, 1)).map((alert) => {
                    const cleanSummary = cleanHtmlEntities(alert.summary);
                    const cleanTitle = cleanHtmlEntities(alert.title);
                    return (
                      <div 
                        key={alert.id}
                        className="w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start glass-panel p-4 sm:p-5 rounded-2xl border-rose-500/30 flex flex-col justify-between shadow-xl space-y-3 hover:border-rose-500/60 transition-all bg-slate-950/80"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                              {alert.severity}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 font-semibold">{alert.publishedDate}</span>
                          </div>

                          <h4 className="font-bold text-sm text-white leading-snug line-clamp-2">{cleanTitle}</h4>

                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800 line-clamp-3">
                            {cleanSummary}
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                            <span>Source: <strong className="text-slate-200 truncate max-w-[150px] inline-block align-bottom">{alert.sourceName}</strong></span>
                            {alert.sourceUrl && (
                              <a
                                href={alert.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>{isPidgin ? 'Source' : 'Source Article'}</span>
                              </a>
                            )}
                          </div>

                          {/* Action Buttons: 1-Click Verify Claim & PR Debunk */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {onVerifyClaim && (
                              <button
                                onClick={() => onVerifyClaim(`${cleanTitle} — ${cleanSummary}`)}
                                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                                title="Load into Claim Verification Engine"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isPidgin ? '🔍 Check Tori' : '🔍 Verify Claim'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => setActiveTab('debunk_kit')}
                              className={`w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${!onVerifyClaim ? 'sm:col-span-2' : ''}`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isPidgin ? 'PR Debunk Kit →' : 'PR Debunk Kit →'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Free Tier: Locked Threat Stream Card appended immediately after the first card */}
                  {!isProActive && (
                    <div 
                      onClick={onOpenSubscriptionModal}
                      className="w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start glass-panel p-5 rounded-2xl border-2 border-dashed border-blue-500/50 bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 flex flex-col justify-between shadow-2xl space-y-4 hover:border-blue-400 transition-all cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Lock className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                            BMoni Pro Tier Only
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-white leading-snug">
                            {scanResult.alerts.length > 1 
                              ? `🔒 +${scanResult.alerts.length - 1} More Threat Signals Detected` 
                              : '🔒 Unlock Continuous Threat Surveillance'}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Upgrade to <strong>BMoni Pro Tier</strong> to unlock the complete threat intelligence stream, all active WhatsApp rumors, TikTok skits, and 24/7 background sentinel alerts.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>✓</span> <span>All Detected Misinformation Signals</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>✓</span> <span>WhatsApp & Telegram Sentinel Dispatches</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>✓</span> <span>Unlimited Multi-Entity Tracking</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSubscriptionModal();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        <span>⚡ Create BMoni Pro Tier Account (₦50k/mo)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: All Recent News This Week (Live Weekly Ingestion) */}
          {activeTab === 'weekly_news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-2">
                    <span>Verified News This Week ({scanResult.recentWeeklyNews?.length || 0})</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ← Swipe Horizontal Stream →
                    </span>
                    {!isProActive && (scanResult.recentWeeklyNews?.length || 0) > 1 && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Sample Preview (1 of {scanResult.recentWeeklyNews?.length || 0})
                      </span>
                    )}
                  </span>
                  <p className="text-[11px] font-mono text-slate-500">
                    Continuous 7-Day Live Ingestion
                  </p>
                </div>

                {/* Horizontal Navigation Arrow Buttons */}
                {scanResult.recentWeeklyNews && scanResult.recentWeeklyNews.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => newsScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all shadow-sm"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => newsScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all shadow-sm"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {scanResult.recentWeeklyNews && scanResult.recentWeeklyNews.length > 0 ? (
                <div 
                  ref={newsScrollRef}
                  className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700"
                >
                  {/* For Free Tier: Only display the first news card as sample preview */}
                  {(isProActive ? scanResult.recentWeeklyNews : scanResult.recentWeeklyNews.slice(0, 1)).map((news) => {
                    const cleanNewsTitle = cleanHtmlEntities(news.title);
                    const cleanNewsSnippet = cleanHtmlEntities(news.snippet);
                    return (
                      <div
                        key={news.id}
                        className={`w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between space-y-3 ${
                          news.isNewlyIngested 
                            ? 'border-emerald-500/80 bg-emerald-950/20 ring-1 ring-emerald-500/40 shadow-lg' 
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[11px] font-bold text-emerald-400 truncate max-w-[180px]">
                                {news.source}
                              </span>
                              {news.isNewlyIngested && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500 text-black uppercase animate-pulse">
                                  ✨ NEW STORY
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {news.publishedDate}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
                            {cleanNewsTitle}
                          </h4>

                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 line-clamp-3">
                            {cleanNewsSnippet}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                news.sentiment === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                                news.sentiment === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-300' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {news.sentiment}
                              </span>

                              <button
                                onClick={() => handleQuickDispatchWhatsapp(`📰 *RUMOUR RADAR NEWS RADAR*\n\nBrand: *${brandInput}*\nHeadline: *${cleanNewsTitle}*\nPublisher: ${news.source}\nLink: ${news.link}`)}
                                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                title="Forward article to WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-400" />
                                <span>Share</span>
                              </button>
                            </div>

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

                          {onVerifyClaim && (
                            <button
                              onClick={() => onVerifyClaim(`${cleanNewsTitle} — ${cleanNewsSnippet}`)}
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isPidgin ? 'Check Dis News for Claim Engine' : 'Check Story in Claim Verify'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Free Tier: Locked Weekly News Feed Card appended after first sample */}
                  {!isProActive && (
                    <div 
                      onClick={onOpenSubscriptionModal}
                      className="w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start glass-panel p-5 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 flex flex-col justify-between shadow-2xl space-y-4 hover:border-emerald-400 transition-all cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Lock className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                            BMoni Pro Feed
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-white leading-snug">
                            🔒 +{(scanResult.recentWeeklyNews?.length || 1) - 1} More Articles Ingested
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Continuous 7-Day Live Ingestion stream is locked. Upgrade to <strong>BMoni Pro Tier</strong> to monitor all weekly press drops, sentiment indexes, and automated newsroom feeds.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>✓</span> <span>Continuous 45s Multi-Source RSS & Media Crawl</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>✓</span> <span>Full Coverage of TechCabal, Punch, Vanguard & Nairametrics</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSubscriptionModal();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        <span>⚡ Unlock All Weekly Articles (₦50k/mo)</span>
                      </button>
                    </div>
                  )}
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

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      if (!isProActive) {
                        onOpenSubscriptionModal();
                      } else {
                        handleQuickDispatchWhatsapp();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                      isProActive ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {!isProActive ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    <span>{isProActive ? 'Send to WhatsApp' : '⚡ Pro: Send to WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => scanResult.debunkKit && handleCopy(scanResult.debunkKit.officialStatementDraft, 'official_stmt')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    {copiedKey === 'official_stmt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'official_stmt' ? 'Copied Statement!' : 'Copy Official Statement'}</span>
                  </button>
                </div>
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
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Platform-Tailored Debunk Broadcasts:
                  </span>
                  {!isProActive && (
                    <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Pro unlocks full WhatsApp, LinkedIn & Instagram templates
                    </span>
                  )}
                </div>

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
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Broadcast {!isProActive && '🔒'}
                  </button>

                  <button
                    onClick={() => setActiveSocialTab('linkedin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'linkedin' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> LinkedIn Statement {!isProActive && '🔒'}
                  </button>

                  <button
                    onClick={() => setActiveSocialTab('instagram')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeSocialTab === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" /> Instagram Caption {!isProActive && '🔒'}
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

                {/* Free Tier Callout in Debunk Kit */}
                {!isProActive && (
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-300 space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Unlock Instant WhatsApp Auto-Dispatch & Executive Spokesperson Modes</span>
                      </div>
                      <p className="text-slate-400">BMoni Pro tier enables 1-click broadcasts directly to your brand's WhatsApp channels & PR distribution lists.</p>
                    </div>
                    <button
                      onClick={onOpenSubscriptionModal}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-md"
                    >
                      <span>⚡ Unlock BMoni Pro</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALERT CONFIGURATION MODAL */}
      {isAlertConfigOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 space-y-4">
            <button
              onClick={() => setIsAlertConfigOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Configure Sentinel Alert Channels</h3>
                <p className="text-xs text-slate-400">Instant notification rails for {brandInput}</p>
              </div>
            </div>

            <form onSubmit={handleSaveAlertConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  WhatsApp Phone Number for Urgent Alerts:
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={alertWhatsappNumber}
                    onChange={(e) => setAlertWhatsappNumber(e.target.value)}
                    placeholder="e.g. 08012345678 or +234 801 234 5678"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block font-mono">
                  ✓ Accepts all Nigerian formats (080..., 090..., 070... or +234...). Auto-formats to international country code.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  PR Desk Email (Optional):
                </label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="pr-desk@company.ng"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Continuous crawler scans news every 45s and triggers instant WhatsApp broadcast intents.</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isAlertConfigSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 hidden" />}
                  <span>{isAlertConfigSaved ? 'Alert Channels Saved!' : 'Save & Arm Sentinel Alerts'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAlertConfigOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WHY BRAND SHIELD & BMONI PRO POPUP MODAL */}
      {isWhyModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setIsWhyModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto my-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWhyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header matching BmoniSubscriptionModal branding */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <img
                src="/images/logowhite.jpeg"
                alt="RumourRadar Logo"
                className="w-10 h-10 rounded-xl object-cover border border-blue-500/40 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    ⚡ BMONI SURVEILLANCE INTELLIGENCE
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isPidgin ? 'Why Brand Shield & BMoni Pro Tier Dey Critical?' : 'Why Brand Shield & BMoni Pro Tier is Critical'}
                </h3>
              </div>
            </div>

            {/* Audience 1: Companies & Creators */}
            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm">
                <span className="text-base">🏢</span>
                <span>Target 1: Companies, Brands & Creators (People)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stay ahead of viral defamatory rumors, fabricated bank circulars, and damaging trends across WhatsApp forwards and X quotes before panic hits customers or investors.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                <span>✓ Auto-generate 1-click PR Debunk Kits for WhatsApp, X, LinkedIn & Press in 60s</span>
              </div>
            </div>

            {/* Audience 2: Brand Trackers & Fans */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs sm:text-sm">
                <span className="text-base">⭐</span>
                <span>Target 2: Brand Trackers, Fans & Super-Followers</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Keep complete real-time tabs on all verified updates, breaking press articles, and viral stories about your favorite celebrities (Davido, Burna Boy, Wizkid), banks (GTBank, Opay), or agencies (CBN, EFCC).
              </p>
              <div className="text-[11px] text-purple-300 font-mono flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                <span>✓ 24/7 continuous 7-day live news ingestion & instant alert rails</span>
              </div>
            </div>

            {/* Continuous Surveillance Tech Badge */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-slate-300 flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] text-slate-300 font-mono">
                Surveillance grid crawls national newsrooms (TechCabal, Punch, Vanguard, Nairametrics), WhatsApp forward trends & social quotes every 45 seconds.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  setIsWhyModalOpen(false);
                  onOpenSubscriptionModal();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isProActive ? 'Manage BMoni Pro Tier' : '⚡ Create BMoni Pro Tier Account (₦50k/mo)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsWhyModalOpen(false);
                  setIsHelpOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>How to Use Guide</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Brand Shield Section Help Modal */}
      <SectionHelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        section="brand_shield" 
        appLanguage={appLanguage} 
      />
    </div>
  );
}
