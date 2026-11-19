'use client';

import React from 'react';
import { CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

interface PagaAppDownloadButtonProps {
  appLanguage?: 'en' | 'pcm';
}

export function PagaAppDownloadButton({ appLanguage = 'en' }: PagaAppDownloadButtonProps) {
  const isPidgin = appLanguage === 'pcm';

  return (
    <a
      href="https://www.mypaga.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#00477E] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
      title="Get the Paga App for Secure Nigerian Payments"
    >
      <CreditCard className="w-4 h-4 text-white" />
      <span>{isPidgin ? 'Download Paga App 💳' : 'Download Paga App 💳'}</span>
      <ExternalLink className="w-3 h-3 text-white/80" />
    </a>
  );
}

export const BmoniAppDownloadButton = PagaAppDownloadButton;
