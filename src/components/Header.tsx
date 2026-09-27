import React from 'react';
import { Radio, ShieldCheck, CreditCard, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenWhyModal?: () => void;
  onOpenBmoniModal?: () => void;
  appLanguage?: 'en' | 'pcm';
  onToggleLanguage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWhyModal, onOpenBmoniModal, appLanguage = 'en', onToggleLanguage }) => {
  const isPidgin = appLanguage === 'pcm';

  return (
    <header className="w-full border-b border-emerald-500/20 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand & National Emblem Indicator */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20">
            <Radio className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 animate-pulse text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-1">
              <span className="font-display font-black text-xs xs:text-sm sm:text-lg tracking-tight text-white leading-none whitespace-nowrap">
                RUMOUR <span className="text-emerald-400">RADAR</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 w-fit">
                NG
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline font-medium">
                • {isPidgin ? 'Truth Engine for X, WhatsApp & News Tori' : 'National Disinformation Surveillance & Evidence Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Router Telemetry (Desktop) */}
        <div className="hidden xl:flex items-center space-x-2 bg-slate-900/80 border border-slate-800/90 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400 text-[11px]">Router:</span>
          <span className="text-emerald-300 font-bold text-[11px]">CBN • INEC • NCDC • Google FactCheck</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Global Language Switcher */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl border text-[10px] xs:text-[11px] sm:text-xs font-extrabold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 ${
                isPidgin
                  ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:text-emerald-300'
              }`}
              title={isPidgin ? 'Switch entire app to English' : 'Switch entire app to Naija Pidgin'}
            >
              <span className="sm:hidden">{isPidgin ? 'Pidgin 🇳🇬' : 'English 🇬🇧'}</span>
              <span className="hidden sm:inline">{isPidgin ? 'Naija Pidgin 🇳🇬' : 'English 🇬🇧'}</span>
            </button>
          )}

          {onOpenBmoniModal && (
            <button
              onClick={onOpenBmoniModal}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/40 hover:bg-blue-500/25 text-blue-300 text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              title="Enterprise & Newsroom Billing via BMONI Virtual Accounts"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">BMONI Pro</span>
              <span className="sm:hidden">Pro</span>
            </button>
          )}

          {onOpenWhyModal && (
            <button
              onClick={onOpenWhyModal}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] xs:text-[11px] sm:text-xs font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              title="View Dual-Rail Architectural Comparison"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Why Radar?</span>
              <span className="sm:hidden">Why?</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
