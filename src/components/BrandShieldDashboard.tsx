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
import { SectionHelpModal } from '@/components/SectionHelpModal';
import { useTranslations } from '@/context/LanguageContext';

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

export function BrandShieldDashboard({ onOpenSubscriptionModal, appLanguage, initialBrand, onVerifyClaim }: BrandShieldDashboardProps) {
  const { isPidgin: contextIsPidgin, t } = useTranslations();
  const isPidgin = appLanguage === 'pcm' || contextIsPidgin;
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

  // Sentinel Pro tier state
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [proOrgName, setProOrgName] = useState<string>('');

  // 24/7 Sentinel Real-Time Telemetry & Alert State
  const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);
  const [alertWhatsappNumber, setAlertWhatsappNumber] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [isAlertConfigSaved, setIsAlertConfigSaved] = useState(false);
  const [sentinelLogs, setSentinelLogs] = useState<{ timestamp: string; message: string; type: 'info' | 'alert' | 'success' }[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [latestNewArticleAlert, setLatestNewArticleAlert] = useState<VerifiedBrandNewsItem | null>(null);

  // Debunk Kit Story Targeting State
  const [selectedStoryForDebunk, setSelectedStoryForDebunk] = useState<{ title: string; summary: string; source: string } | null>(null);
  const [isGeneratingDebunk, setIsGeneratingDebunk] = useState(false);

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

  // Check Plus tier status from localStorage
  const refreshProStatus = () => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('truetalk_plus_active') === 'true';
      const org = localStorage.getItem('truetalk_org_name') || '';
      setIsProActive(active);
      setProOrgName(org);

      const savedPhone = localStorage.getItem('truetalk_alert_phone') || '';
      const savedEmail = localStorage.getItem('truetalk_alert_email') || '';
      if (savedPhone) setAlertWhatsappNumber(savedPhone);
      if (savedEmail) setAlertEmail(savedEmail);
    }
  };

  useEffect(() => {
    refreshProStatus();
    const handleUpdate = () => refreshProStatus();
    window.addEventListener('truetalk_plus_updated', handleUpdate);
    return () => window.removeEventListener('truetalk_plus_updated', handleUpdate);
  }, []);

  // Execute scan for given brand
  const executeScan = async (targetBrand?: string, isSilentPoll = false) => {
    const brandToQuery = (targetBrand || brandInput || 'GTBank').trim();
    if (!brandToQuery) return;

    if (!isSilentPoll) {
      setIsScanning(true);
    }

    try {
      const res = await fetch(`/api/brand-shield/scan?brand=${encodeURIComponent(brandToQuery)}&entityType=${entityCategory}&lang=${appLanguage || 'en'}`);
      const data = await res.json();
      if (data && data.brandName) {
        setScanResult(data);
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastScannedTime(timeNow);

        setSentinelLogs(prev => [
          {
            timestamp: timeNow,
            message: `Ingested ${data.recentWeeklyNews?.length || 0} stories & ${data.alerts?.length || 0} signals for ${brandToQuery}`,
            type: data.alerts?.length > 0 ? 'alert' : 'info'
          },
          ...prev.slice(0, 19)
        ]);

        if (data.recentWeeklyNews && data.recentWeeklyNews.length > 0) {
          const newest = data.recentWeeklyNews[0];
          if (newest.isNewlyIngested) {
            setLatestNewArticleAlert(newest);
          }
        }
      }
    } catch (err) {
      console.error('Failed to run brand scan:', err);
    } finally {
      if (!isSilentPoll) {
        setIsScanning(false);
      }
    }
  };

  // Initial scan on mount
  useEffect(() => {
    executeScan(brandInput);
  }, []);

  // 45-second Auto-Update Sentinel Poll
  useEffect(() => {
    if (!isAutoUpdating) return;
    const interval = setInterval(() => {
      executeScan(brandInput, true);
    }, 45000);
    return () => clearInterval(interval);
  }, [isAutoUpdating, brandInput, entityCategory]);

  const handleAddToWatchlist = (customBrand?: string) => {
    const target = (customBrand || newWatchlistInput).trim();
    if (!target) return;
    if (!watchlist.some(w => w.toLowerCase() === target.toLowerCase())) {
      setWatchlist(prev => [...prev, target]);
    }
    setNewWatchlistInput('');
    setBrandInput(target);
    executeScan(target);
  };

  const handleRemoveFromWatchlist = (target: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist(prev => prev.filter(w => w.toLowerCase() !== target.toLowerCase()));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveAlertConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('truetalk_alert_phone', alertWhatsappNumber.trim());
      localStorage.setItem('truetalk_alert_email', alertEmail.trim());
    }
    setIsAlertConfigSaved(true);
    setTimeout(() => {
      setIsAlertConfigSaved(false);
      setIsAlertConfigOpen(false);
    }, 1500);
  };

  const handleQuickDispatchWhatsapp = (overrideText?: string) => {
    const textToShare = overrideText || (
      scanResult?.debunkKit
        ? `*TRUETALK BRAND SHIELD ALERT*\n\nBrand: *${scanResult.brandName}*\nStatus: ${scanResult.threatLevel}\n\n*Official Debunk Statement:*\n${scanResult.debunkKit.whatsappBroadcastTemplate}\n\nSurveillance link: https://truetalk.ng`
        : `*TRUETALK SURVEILLANCE REPORT*\n\nBrand: *${brandInput}*\nThreat Level: ALL CLEAR\nNo active disinformation signals circulating.`
    );
    const cleanNumber = formatNigerianWhatsappNumber(alertWhatsappNumber);
    const waUrl = cleanNumber 
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToShare)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(waUrl, '_blank');
  };

  const handleQuickDispatchTelegram = () => {
    const textToShare = scanResult?.debunkKit
      ? `🚨 TRUETALK BRAND SHIELD ALERT\nBrand: ${scanResult.brandName}\nStatus: ${scanResult.threatLevel}\n\nOfficial Statement:\n${scanResult.debunkKit.officialStatementDraft}`
      : `TRUETALK SURVEILLANCE: ${brandInput} — Telemetry scan completed.`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://truetalk.ng')}&text=${encodeURIComponent(textToShare)}`, '_blank');
  };

  const handleGenerateDebunkForStory = (title: string, summary: string, source: string) => {
    setSelectedStoryForDebunk({ title, summary, source });
    setActiveTab('debunk_kit');
    setIsGeneratingDebunk(true);
    setTimeout(() => setIsGeneratingDebunk(false), 600);
  };

  const getSocialPostText = (kit: DebunkKit) => {
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
      {/* 1. Header Banner — Modern Truetalk Brand Gradient */}
      <div className="p-5 sm:p-7 rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#005b9c] to-[#0b2540] text-white shadow-lg border border-white/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {lastScannedTime && (
                <span className="text-[11px] text-white/75 flex items-center gap-1 font-mono">
                  <Activity className="w-3 h-3 text-emerald-300 animate-pulse" /> Live Telemetry ({lastScannedTime})
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {isPidgin ? 'Brand Shield: Live Misinformation & Crisis Radar' : 'Brand Shield: Real-Time Crisis & Disinformation Radar'}
            </h2>
            <p className="text-xs sm:text-[13px] text-white/80 max-w-2xl leading-relaxed">
              {isPidgin
                ? 'Continuous surveillance for companies, banks, creators & executives in Nigeria. Monitors viral WhatsApp forwards, fake circulars & generates 1-click PR debunk kits.'
                : 'Continuous 24/7 surveillance for Nigerian corporations, public figures & institutions. Tracks viral social claims and auto-generates multi-platform PR debunk statements.'}
            </p>
          </div>

          <button
            onClick={onOpenSubscriptionModal}
            className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-[16px] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 self-start md:self-center cursor-pointer ${
              isProActive 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-white hover:bg-white/95 text-[#005b9c] shadow-blue-900/20'
            }`}
          >
            {isProActive ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4 text-[#005b9c]" />}
            <span>{isProActive ? (proOrgName ? `Plus Active: ${proOrgName}` : 'Paga Plus Active Tier') : '⚡ Upgrade to Paga Plus (₦50k/mo)'}</span>
          </button>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Why Brand Shield?</span>
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-white" />
              <span>How to Use?</span>
            </button>
          </div>

          <button
            onClick={() => setIsAutoUpdating(!isAutoUpdating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isAutoUpdating
                ? 'bg-emerald-400/25 text-emerald-100 border-emerald-400/40'
                : 'bg-white/10 text-white/70 border-white/20'
            }`}
          >
            {isAutoUpdating ? '● Auto-Update ON (45s)' : '○ Auto-Update Paused'}
          </button>
        </div>
      </div>

      {/* 2. Real-Time Sentinel Alert Banner */}
      {latestNewArticleAlert && (
        <div className="p-4 sm:p-5 rounded-[20px] bg-rose-50 border border-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white tracking-wider">
                  🚨 Real-Time Alert
                </span>
                <span className="text-xs text-[#4a6076]">
                  New Press Story Ingested ({latestNewArticleAlert.source})
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0b2540]">
                "{latestNewArticleAlert.title}"
              </h4>
              <p className="text-xs text-[#4a6076] line-clamp-1">
                {latestNewArticleAlert.snippet}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => handleQuickDispatchWhatsapp(`🚨 *TRUETALK NEW STORY ALERT*\n\nBrand: *${brandInput}*\nStory: *${latestNewArticleAlert.title}*\nSource: ${latestNewArticleAlert.source}\nLink: ${latestNewArticleAlert.link}`)}
              className="px-3.5 py-2 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Dispatch Alert</span>
            </button>

            <button
              onClick={() => setLatestNewArticleAlert(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Search Bar, Presets & Watchlist — Crisp White Home Card Styling */}
      <div className="p-5 sm:p-6 rounded-[22px] sm:rounded-[26px] bg-white border border-[#D5E7FA] shadow-xs space-y-4">
        {/* Category Selector Tabs */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[#005b9c] uppercase tracking-wider block">
            Target Entity Category:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'corporation', label: '🏢 Corporations & Banks', desc: 'Banks, Telecoms, Fintechs & FMCG' },
              { id: 'creator', label: '👤 Public Figures & Creators', desc: 'Executives, Celebrities & Influencers' },
              { id: 'agency', label: '🏛️ Government & Regulators', desc: 'CBN, INEC, EFCC, NCDC, JAMB' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEntityCategory(tab.id as any)}
                className={`p-3 rounded-[16px] text-xs font-semibold transition-all text-left flex flex-col justify-between border cursor-pointer ${
                  entityCategory === tab.id
                    ? 'bg-[#005b9c] text-white border-[#005b9c] shadow-xs'
                    : 'bg-[#f4f8fc] border-[#D5E7FA] text-[#0b2540] hover:bg-[#e6f1f8]'
                }`}
              >
                <span className="font-bold">{tab.label}</span>
                <span className={`text-[11px] mt-0.5 ${entityCategory === tab.id ? 'text-white/80' : 'text-[#4a6076]'}`}>
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6076]" />
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeScan()}
              placeholder={isPidgin ? "Type company name, creator or public person to scan..." : "Search brand name, corporate entity, creator, or government agency..."}
              className="w-full h-12 pl-10 pr-4 rounded-[14px] bg-white border border-[#005b9c]/25 text-sm text-[#0b2540] placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-[#005b9c]/15 focus:border-[#005b9c] transition-all"
            />
          </div>

          <button
            onClick={() => executeScan()}
            disabled={isScanning || !brandInput.trim()}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-[14px] bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 shrink-0 cursor-pointer"
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

        {/* Preset Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#4a6076] shrink-0 mr-1">Trending:</span>
          {ENTITY_PRESETS[entityCategory].map((b) => (
            <button
              key={b}
              onClick={() => {
                setBrandInput(b);
                executeScan(b);
              }}
              className="px-3 py-1 rounded-xl bg-[#005b9c]/[0.08] hover:bg-[#005b9c]/[0.15] text-xs font-semibold text-[#005b9c] transition-all shrink-0 cursor-pointer"
            >
              {b}
            </button>
          ))}
        </div>

        {/* Watchlist Manager */}
        <div className="pt-3 border-t border-[#D5E7FA] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-[#0b2540]">
                {isPidgin ? 'Sentinel Watchlist (Multi-Entity Surveillance):' : 'Multi-Entity Sentinel Watchlist:'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e6f1f8] text-[#005b9c]">
                {watchlist.length} Active
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <input 
                type="text"
                value={newWatchlistInput}
                onChange={(e) => setNewWatchlistInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddToWatchlist()}
                placeholder="Track celebrity or brand..."
                className="h-9 px-3 text-xs rounded-xl bg-white border border-[#005b9c]/25 text-[#0b2540] placeholder-slate-400 focus:outline-none focus:border-[#005b9c] w-48 sm:w-56"
              />
              <button
                onClick={() => handleAddToWatchlist()}
                className="h-9 px-3 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                + Track
              </button>
            </div>
          </div>

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
                  className={`group flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#005b9c] text-white border-[#005b9c] shadow-xs'
                      : 'bg-[#e6f1f8] text-[#005b9c] border-[#d5e7fa] hover:bg-[#d9ecfa]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-emerald-500'}`} />
                  <span>{entity}</span>
                  <button
                    onClick={(e) => handleRemoveFromWatchlist(entity, e)}
                    className="opacity-50 group-hover:opacity-100 hover:text-rose-600 p-0.5 transition-opacity"
                    title={`Stop tracking ${entity}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Upgrade Teaser vs Active Sentinel Banner */}
      {!isProActive ? (
        <div 
          onClick={onOpenSubscriptionModal}
          className="p-4 sm:p-5 rounded-[22px] bg-white border border-[#005b9c]/25 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f1f8] border border-[#d5e7fa] flex items-center justify-center text-[#005b9c] shrink-0">
              <Lock className="w-5 h-5 text-[#005b9c]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-bold text-[#0b2540]">24/7 Automated Sentinel & Instant WhatsApp Alerts</h4>
                <span className="text-[10px] font-semibold bg-[#e6f1f8] text-[#005b9c] px-2 py-0.5 rounded-full border border-[#d5e7fa]">
                  Paga Plus Feature
                </span>
              </div>
              <p className="text-xs text-[#4a6076]">
                Get notified immediately on WhatsApp & Telegram when breaking rumors or press articles mention your brand.
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSubscriptionModal();
            }}
            className="px-4 py-2 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Unlock Automated Sentinel &rarr;</span>
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-[22px] bg-white border border-emerald-300 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5E7FA]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-[#0b2540]">24/7 Automated Sentinel Node Active</h4>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                    Continuous Surveillance Live
                  </span>
                </div>
                <p className="text-xs text-[#4a6076]">
                  Active Target: <strong className="text-[#005b9c]">{scanResult?.brandName || brandInput}</strong> • Continuous 45s Multi-Source RSS & Social Crawl
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <button
                onClick={() => handleQuickDispatchWhatsapp()}
                className="px-3.5 py-1.5 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Instant WhatsApp Dispatch</span>
              </button>

              <button
                onClick={() => setIsAlertConfigOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#0b2540] border border-[#d5e7fa] font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#005b9c]" />
                <span>{alertWhatsappNumber ? `Alerts: ${alertWhatsappNumber.slice(-4)}` : 'Alert Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Results View */}
      {scanResult && (
        <div className="space-y-6">
          {/* Status Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#D5E7FA] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-[#4a6076] uppercase tracking-wider">Monitored Entity</span>
              <div className="text-lg font-bold text-[#0b2540] truncate">{scanResult.brandName}</div>
              <div className="text-xs text-[#005b9c] font-medium">Nigeria Surveillance Grid</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D5E7FA] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-[#4a6076] uppercase tracking-wider">Surveillance Threat Level</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  scanResult.threatLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {scanResult.threatLevel}
                </span>
                <span className="text-xs text-[#4a6076]">Total Alerts: {scanResult.totalAlerts}</span>
              </div>
              <div className="text-[11px] text-[#4a6076]">Active Rumors Detected: {scanResult.alerts.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D5E7FA] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-[#4a6076] uppercase tracking-wider">Weekly Press Ingestion</span>
              <div className="text-lg font-bold text-emerald-700">
                {scanResult.recentWeeklyNews?.length || 0} Articles Scanned
              </div>
              <div className="text-[11px] text-[#4a6076]">Continuous 7-Day Live Ingestion</div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#eaf3fc] border border-[#D5E7FA] overflow-x-auto">
            <button
              onClick={() => setActiveTab('rumours')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'rumours'
                  ? 'bg-[#005b9c] text-white shadow-xs'
                  : 'text-[#4a6076] hover:text-[#0b2540] hover:bg-white/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Unverified Rumours & Threat Alerts ({scanResult.alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly_news')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'weekly_news'
                  ? 'bg-[#005b9c] text-white shadow-xs'
                  : 'text-[#4a6076] hover:text-[#0b2540] hover:bg-white/60'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>All Recent News This Week ({scanResult.recentWeeklyNews?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('debunk_kit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'debunk_kit'
                  ? 'bg-[#005b9c] text-white shadow-xs'
                  : 'text-[#4a6076] hover:text-[#0b2540] hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1-Click Multi-Platform PR Debunk Kit</span>
            </button>
          </div>

          {/* Tab 1: Unverified Rumours & Threats */}
          {activeTab === 'rumours' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b2540] flex items-center gap-2">
                    <span>{isPidgin ? `Detected Rumor Signals (${scanResult.alerts.length})` : `Detected Misinformation Signals (${scanResult.alerts.length})`}</span>
                    <span className="text-[10px] text-[#005b9c] bg-[#e6f1f8] px-2 py-0.5 rounded-full border border-[#d5e7fa]">
                      ← Horizontal Stream →
                    </span>
                  </span>
                </div>

                {scanResult.alerts.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => signalsScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#0b2540] border border-[#D5E7FA] shadow-xs cursor-pointer"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => signalsScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#0b2540] border border-[#D5E7FA] shadow-xs cursor-pointer"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {scanResult.alerts.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-[#D5E7FA] shadow-xs space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0b2540]">
                    Surveillance Scan Complete: No active rumors detected for {scanResult.brandName}.
                  </h3>
                  <p className="text-xs text-[#4a6076]">
                    Threat Status: ALL CLEAR (0 Monitored Rumors Found)
                  </p>
                </div>
              ) : (
                <div 
                  ref={signalsScrollRef}
                  className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
                >
                  {(isProActive ? scanResult.alerts : scanResult.alerts.slice(0, 1)).map((alert) => {
                    const cleanSummary = cleanHtmlEntities(alert.summary);
                    const cleanTitle = cleanHtmlEntities(alert.title);
                    return (
                      <div 
                        key={alert.id}
                        className="w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start p-5 rounded-2xl bg-white border border-[#D5E7FA] shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              {alert.severity}
                            </span>
                            <span className="text-[11px] text-[#4a6076] font-medium">{alert.publishedDate}</span>
                          </div>

                          <h4 className="font-bold text-sm text-[#0b2540] leading-snug line-clamp-2">{cleanTitle}</h4>

                          <p className="text-xs text-[#4a6076] leading-relaxed bg-[#f8fbfe] p-3 rounded-xl border border-[#d5e7fa] line-clamp-3">
                            {cleanSummary}
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-[#D5E7FA] text-xs">
                          <div className="flex items-center justify-between text-[#4a6076]">
                            <span>Source: <strong className="text-[#0b2540] truncate max-w-[150px]">{alert.sourceName}</strong></span>
                            {alert.sourceUrl && (
                              <a
                                href={alert.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#005b9c] font-semibold hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Source</span>
                              </a>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {onVerifyClaim && (
                              <button
                                onClick={() => onVerifyClaim(`${cleanTitle} — ${cleanSummary}`)}
                                className="w-full py-2 px-3 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Verify Claim</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleGenerateDebunkForStory(cleanTitle, cleanSummary, alert.sourceName)}
                              className={`w-full py-2 px-3 rounded-xl bg-[#e6f1f8] hover:bg-[#d9ecfa] text-[#005b9c] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#d5e7fa] cursor-pointer ${!onVerifyClaim ? 'sm:col-span-2' : ''}`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>PR Debunk Kit →</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: All Recent News This Week */}
          {activeTab === 'weekly_news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b2540] flex items-center gap-2">
                    <span>Verified News This Week ({scanResult.recentWeeklyNews?.length || 0})</span>
                  </span>
                </div>

                {scanResult.recentWeeklyNews && scanResult.recentWeeklyNews.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => newsScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#0b2540] border border-[#D5E7FA] shadow-xs cursor-pointer"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => newsScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#0b2540] border border-[#D5E7FA] shadow-xs cursor-pointer"
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
                  className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
                >
                  {(isProActive ? scanResult.recentWeeklyNews : scanResult.recentWeeklyNews.slice(0, 1)).map((news) => {
                    const cleanNewsTitle = cleanHtmlEntities(news.title);
                    const cleanNewsSnippet = cleanHtmlEntities(news.snippet);
                    return (
                      <div
                        key={news.id}
                        className="w-[85vw] sm:w-[380px] min-w-[300px] max-w-[420px] shrink-0 snap-start p-5 rounded-2xl bg-white border border-[#D5E7FA] shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#005b9c] truncate max-w-[180px]">
                              {news.source}
                            </span>
                            <span className="text-[11px] text-[#4a6076]">
                              {news.publishedDate}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-[#0b2540] leading-snug line-clamp-2">
                            {cleanNewsTitle}
                          </h4>

                          <p className="text-xs text-[#4a6076] leading-relaxed bg-[#f8fbfe] p-3 rounded-xl border border-[#d5e7fa] line-clamp-3">
                            {cleanNewsSnippet}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#D5E7FA] space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              news.sentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' :
                              news.sentiment === 'NEGATIVE' ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {news.sentiment}
                            </span>

                            <a
                              href={news.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#005b9c] hover:underline"
                            >
                              <span>Read Full Story</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {onVerifyClaim && (
                              <button
                                onClick={() => onVerifyClaim(`${cleanNewsTitle} — ${cleanNewsSnippet}`)}
                                className="w-full py-1.5 px-3 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Verify Story</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleGenerateDebunkForStory(cleanNewsTitle, cleanNewsSnippet, news.source)}
                              className={`w-full py-1.5 px-3 rounded-xl bg-[#e6f1f8] hover:bg-[#d9ecfa] text-[#005b9c] border border-[#d5e7fa] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${!onVerifyClaim ? 'sm:col-span-2' : ''}`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Debunk Kit →</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white border border-[#D5E7FA] text-[#4a6076] text-xs">
                  No press releases recorded in the past 7 days for this keyword.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: PR Debunk Kit */}
          {activeTab === 'debunk_kit' && scanResult.debunkKit && (
            <div className="p-5 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-[#D5E7FA] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5E7FA]">
                <div>
                  <h3 className="text-base font-bold text-[#0b2540] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#005b9c]" />
                    <span>Multi-Platform Crisis PR Debunk Kit for {scanResult.brandName}</span>
                  </h3>
                  <p className="text-xs text-[#4a6076]">
                    Ready-to-publish executive statements crafted by Truetalk AI.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleQuickDispatchWhatsapp()}
                    className="px-3.5 py-2 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Share to WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      if (scanResult.debunkKit) {
                        handleCopy(scanResult.debunkKit.officialStatementDraft, 'official_stmt');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#e6f1f8] hover:bg-[#d9ecfa] text-[#005b9c] border border-[#d5e7fa] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'official_stmt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'official_stmt' ? 'Copied Statement!' : 'Copy Statement'}</span>
                  </button>
                </div>
              </div>

              {/* Social Channels Tabs */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#0b2540] uppercase tracking-wider block">
                  Platform-Tailored Debunk Broadcasts:
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'twitter', label: '𝕏 Twitter / X' },
                    { id: 'whatsapp', label: '💬 WhatsApp' },
                    { id: 'linkedin', label: '💼 LinkedIn' },
                    { id: 'instagram', label: '📷 Instagram' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveSocialTab(p.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        activeSocialTab === p.id
                          ? 'bg-[#005b9c] text-white shadow-xs font-bold'
                          : 'bg-[#f4f8fc] text-[#4a6076] hover:bg-[#e6f1f8] border border-[#d5e7fa]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Social Post Content Box */}
                <div className="relative p-4 sm:p-5 rounded-2xl bg-[#f8fbfe] border border-[#d5e7fa] font-mono text-xs text-[#0b2540] whitespace-pre-wrap leading-relaxed">
                  {getSocialPostText(scanResult.debunkKit)}

                  <button
                    onClick={() => {
                      const text = getSocialPostText(scanResult.debunkKit!);
                      handleCopy(text, activeSocialTab);
                    }}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white border border-[#d5e7fa] text-xs font-semibold text-[#005b9c] shadow-2xs hover:bg-[#e6f1f8] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === activeSocialTab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === activeSocialTab ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alert Configuration Modal */}
      {isAlertConfigOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-[24px] bg-white border border-[#D5E7FA] shadow-2xl text-[#0b2540] space-y-4">
            <button
              onClick={() => setIsAlertConfigOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-2 border-b border-[#D5E7FA]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f1f8] border border-[#d5e7fa] flex items-center justify-center text-[#005b9c]">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0b2540]">Configure Sentinel Alert Channels</h3>
                <p className="text-xs text-[#4a6076]">Instant notification rails for {brandInput}</p>
              </div>
            </div>

            <form onSubmit={handleSaveAlertConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0b2540] mb-1">
                  WhatsApp Phone Number for Urgent Alerts:
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={alertWhatsappNumber}
                    onChange={(e) => setAlertWhatsappNumber(e.target.value)}
                    placeholder="e.g. 08012345678 or +234 801 234 5678"
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white border border-[#005b9c]/25 text-sm text-[#0b2540] placeholder-slate-400 focus:outline-none focus:border-[#005b9c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0b2540] mb-1">
                  PR Desk Email (Optional):
                </label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="pr-desk@company.ng"
                  className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#005b9c]/25 text-sm text-[#0b2540] placeholder-slate-400 focus:outline-none focus:border-[#005b9c]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAlertConfigSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{isAlertConfigSaved ? 'Alert Channels Saved!' : 'Save & Arm Alerts'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAlertConfigOpen(false)}
                  className="px-4 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Why Brand Shield Modal */}
      {isWhyModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setIsWhyModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-[24px] bg-white border border-[#D5E7FA] shadow-2xl text-[#0b2540] max-h-[90vh] overflow-y-auto my-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWhyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#D5E7FA]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f1f8] border border-[#d5e7fa] flex items-center justify-center text-[#005b9c] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#005b9c] uppercase tracking-wider block">
                  ⚡ Paga Surveillance Intelligence
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0b2540]">
                  Why Brand Shield & Paga Plus Tier is Critical
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fbfe] border border-[#d5e7fa] space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-[#005b9c]">
                Target 1: Companies, Brands & Creators
              </h4>
              <p className="text-xs text-[#4a6076] leading-relaxed">
                Stay ahead of viral defamatory rumors, fabricated bank circulars, and damaging trends across WhatsApp forwards and X quotes before panic hits customers or investors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fbfe] border border-[#d5e7fa] space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-[#005b9c]">
                Target 2: Brand Trackers & Newsrooms
              </h4>
              <p className="text-xs text-[#4a6076] leading-relaxed">
                Keep complete real-time tabs on all verified updates, breaking press articles, and viral stories across national media desks.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  setIsWhyModalOpen(false);
                  onOpenSubscriptionModal();
                }}
                className="w-full sm:flex-1 h-12 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isProActive ? 'Manage Paga Plus Tier' : '⚡ Upgrade to Paga Plus (₦50k/mo)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsWhyModalOpen(false);
                  setIsHelpOpen(true);
                }}
                className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white border border-[#d5e7fa] text-[#4a6076] text-xs font-semibold cursor-pointer"
              >
                How to Use Guide
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
