import React from 'react';
import { VerdictType } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  isPidgin?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md', isPidgin: propIsPidgin }) => {
  const { isPidgin: contextIsPidgin, t } = useTranslations();
  const isPidgin = propIsPidgin !== undefined ? propIsPidgin : contextIsPidgin;

  const configs = {
    SUPPORTED: {
      label: isPidgin ? t('results.verdictVerified') : 'LIKELY TRUE / SUPPORTED',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Government paper and verified news confirm am' : 'Corroborated by official bulletins & direct reporting'
    },
    CONTRADICTED: {
      label: isPidgin ? t('results.verdictContradicted') : 'FALSE / CONTRADICTED',
      icon: XCircle,
      bg: 'bg-rose-50 border-rose-300 text-rose-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Official bodies don debunk dis tori as fake' : 'Refuted by verified authorities & fact-checking desks'
    },
    MISLEADING: {
      label: isPidgin ? t('results.verdictMisleading') : 'MISLEADING / OUT OF CONTEXT',
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Some part correct but dem twist the meaning' : 'Contains distorted context or conflated policies'
    },
    SATIRE_PARODY: {
      label: isPidgin ? t('results.verdictSatire') : 'SATIRE / PARODY / JOKE',
      icon: AlertTriangle,
      bg: 'bg-purple-50 border-purple-300 text-purple-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Na cruise, comedy or meme — no be real news' : 'Humor, social media parody, or comedy banter (not factual news)'
    },
    NON_CLAIM: {
      label: isPidgin ? 'NO BE NEWS CLAIM' : 'NOT A NEWS CLAIM / GREETING',
      icon: HelpCircle,
      bg: 'bg-sky-50 border-sky-300 text-sky-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Na ordinary talk or question, no be news claim' : 'Input is a greeting or question, not a testable news claim'
    },
    UNVERIFIED: {
      label: isPidgin ? t('results.verdictUnverified') : 'UNVERIFIED / RUMOUR',
      icon: HelpCircle,
      bg: 'bg-slate-100 border-slate-300 text-slate-800',
      shadow: 'shadow-xs',
      desc: isPidgin ? 'Tori never get proof from official record — na rumour until dem prove am' : 'Circulating uncorroborated claim or rumour — not yet proven by official records'
    }
  };

  const current = configs[verdict] || configs.UNVERIFIED;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
    lg: 'text-base sm:text-lg px-5 py-2.5 gap-2.5 font-black tracking-wide'
  };

  return (
    <div className={`inline-flex items-center rounded-2xl border ${current.bg} ${current.shadow} ${sizeClasses[size]} transition-all duration-300`}>
      <Icon className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      <span>{current.label}</span>
    </div>
  );
};
