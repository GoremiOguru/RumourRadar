import React from 'react';
import { EvidenceItem } from '@/types';
import { Landmark, Newspaper, Award, ArrowUpRight } from 'lucide-react';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  rank: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, rank }) => {
  return (
    <article className="glass-panel-subtle group relative rounded-xl p-4 transition-all duration-200 hover:border-emerald-500/40 hover:bg-slate-900/70">
      <div className="flex items-start justify-between gap-3">
        {/* Source Badge & Rank */}
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 font-bold border border-slate-700">
            {rank}
          </span>
          <div className="flex items-center space-x-1.5">
            {evidence.isOfficialAuthority ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <Landmark className="w-3 h-3" />
                Official Authority
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                <Newspaper className="w-3 h-3" />
                Reputable Media
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono">{evidence.domain}</span>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded-md">
          <Award className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-mono font-bold text-slate-300">
            {evidence.score} pts
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="mt-2.5 font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
        {evidence.title}
      </h4>

      {/* Snippet */}
      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
        {evidence.snippet}
      </p>

      {/* Footer Info & Link */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-slate-400">
          <span className="block truncate">{evidence.sourceName}</span>
          <span className="text-slate-500">
            {evidence.isOfficialAuthority ? 'Official source' : 'Reported source'}
            {evidence.publishedDate && ` • ${evidence.publishedDate}`}
          </span>
        </div>

        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium group-hover:underline"
        >
          <span>Open source</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
