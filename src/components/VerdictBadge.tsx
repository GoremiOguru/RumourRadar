import React from 'react';
import { VerdictType } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  isPidgin?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md', isPidgin = false }) => {
  const configs = {
    SUPPORTED: {
      label: isPidgin ? 'TRUE / CONFIRMED (TRUE TORI)' : 'LIKELY TRUE / SUPPORTED',
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(160,185,129,0.25)]',
      desc: isPidgin ? 'Government paper and verified news confirm am' : 'Corroborated by official bulletins & direct reporting'
    },
    CONTRADICTED: {
      label: isPidgin ? 'FAKE TORI / DEBUNKED (LIE LIE)' : 'FALSE / CONTRADICTED',
      icon: XCircle,
      bg: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      desc: isPidgin ? 'Official bodies don debunk dis tori as fake' : 'Refuted by verified authorities & fact-checking desks'
    },
    MISLEADING: {
      label: isPidgin ? 'MISLEADING (DON MIX LIE JOIN)' : 'MISLEADING / OUT OF CONTEXT',
      icon: AlertTriangle,
      bg: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      desc: isPidgin ? 'Some part correct but dem twist the meaning' : 'Contains distorted context or conflated policies'
    },
    SATIRE_PARODY: {
      label: isPidgin ? 'JOKE / COMEDY SKIT (NO BE NEWS)' : 'SATIRE / PARODY / JOKE',
      icon: AlertTriangle,
      bg: 'bg-purple-500/10 border-purple-500/40 text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      desc: isPidgin ? 'Na cruise, comedy or meme — no be real news' : 'Humor, social media parody, or comedy banter (not factual news)'
    },
    NON_CLAIM: {
      label: isPidgin ? 'GREETING / NO BE NEWS CLAIM' : 'NOT A NEWS CLAIM / GREETING',
      icon: HelpCircle,
      bg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      desc: isPidgin ? 'Na ordinary talk or question, no be news claim' : 'Input is a greeting or question, not a testable news claim'
    },
    UNVERIFIED: {
      label: isPidgin ? 'UNVERIFIED / RUMOUR (NO PROOF YET)' : 'UNVERIFIED / RUMOUR',
      icon: HelpCircle,
      bg: 'bg-slate-500/10 border-slate-500/40 text-slate-300',
      glow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]',
      desc: isPidgin ? 'Tori never get proof from official record — na rumour until dem prove am' : 'Circulating uncorroborated claim or rumour — not yet proven by official records'
    }
  };

  const current = configs[verdict] || configs.UNVERIFIED;

  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
    lg: 'text-base sm:text-lg px-5 py-2.5 gap-2.5 font-bold tracking-wide'
  };

  return (
    <div className={`inline-flex items-center rounded-xl border ${current.bg} ${current.glow} ${sizeClasses[size]} transition-all duration-300`}>
      <Icon className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      <span>{current.label}</span>
    </div>
  );
};
