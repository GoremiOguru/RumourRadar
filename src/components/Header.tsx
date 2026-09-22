import React from 'react';
import { Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenWhyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWhyModal }) => {
  return (
    <header className="w-full border-b border-emerald-900/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
            {/* <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span> */}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-100">
                RUMOR <span className="text-emerald-400">RADAR</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Track
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Nigeria-First Disinformation Detection & Evidence Engine
            </p>
          </div>
        </div>

        {/* Status & Why Modal Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onOpenWhyModal && (
            <button
              onClick={onOpenWhyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all shadow-sm"
              title="Learn why Rumor Radar uses Nigerian evidence"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Why Rumor Radar?</span>
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-400">Active Pipeline</span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 font-medium">
            <span>🇳🇬</span>
            <span>NACOS Hackathon</span>
          </div>
        </div>
      </div>
    </header>
  );
};

