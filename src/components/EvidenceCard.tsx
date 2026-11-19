import React from 'react';
import { EvidenceItem } from '@/types';
import { Landmark, Newspaper, ArrowUpRight } from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  rank: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, rank }) => {
  const { isPidgin } = useTranslations();

  return (
    <article className="group rounded-xl p-3 sm:p-3.5 bg-white border border-[#D5E7FA] shadow-2xs hover:border-[#005b9c] hover:shadow-xs transition-all duration-150">
      {/* Top Header Row: Rank + Authority Badge + Source Name + Direct Link */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF3FC] text-[10px] font-mono text-[#005b9c] font-bold border border-[#D5E7FA] shrink-0">
            {rank}
          </span>
          {evidence.isOfficialAuthority ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#005b9c] bg-[#EAF3FC] px-1.5 py-0.5 rounded-full shrink-0">
              <Landmark className="w-2.5 h-2.5 text-[#005b9c]" />
              {isPidgin ? 'Official' : 'Official Authority'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2786D1] bg-sky-50 px-1.5 py-0.5 rounded-full shrink-0">
              <Newspaper className="w-2.5 h-2.5 text-[#2786D1]" />
              {isPidgin ? 'News Desk' : 'Verified Media'}
            </span>
          )}
          <span className="text-xs font-semibold text-[#0b2540] truncate">{evidence.sourceName}</span>
        </div>

        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-0.5 text-xs text-[#005b9c] hover:text-[#00406e] font-semibold shrink-0 group-hover:underline"
        >
          <span>{isPidgin ? 'Check' : 'Source'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Short 1-Line Headline */}
      <h4 className="mt-1.5 font-semibold text-xs sm:text-sm text-[#0b2540] group-hover:text-[#005b9c] transition-colors line-clamp-1">
        {evidence.title}
      </h4>

      {/* Short 2-Line Key Snippet Excerpt */}
      <p className="mt-1 text-xs text-[#4a6076] leading-relaxed line-clamp-2">
        {evidence.snippet}
      </p>
    </article>
  );
};
