'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, ExternalLink, Download } from 'lucide-react';

interface BmoniAppDownloadButtonProps {
  className?: string;
  variant?: 'default' | 'compact' | 'banner';
  appLanguage?: 'en' | 'pcm';
}

export function BmoniAppDownloadButton({ className = '', variant = 'default', appLanguage = 'en' }: BmoniAppDownloadButtonProps) {
  const isPidgin = appLanguage === 'pcm';
  const [device, setDevice] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      if (/android/i.test(ua)) {
        setDevice('android');
      } else if (/iPad|iPhone|iPod|Macintosh/i.test(ua) && (navigator.maxTouchPoints > 0 || /iPhone|iPad|iPod/i.test(ua))) {
        setDevice('ios');
      }
    }
  }, []);

  const getSmartUrl = () => {
    if (device === 'android') return 'https://play.google.com/store/apps/details?id=com.bmoni.app';
    if (device === 'ios') return 'https://apps.apple.com/us/app/bmoni-by-bkey/id6751323804';
    return 'https://bmoni.com';
  };

  if (variant === 'compact') {
    return (
      <a
        href={getSmartUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 group ${className}`}
        title="Download BMoni App for Android & iOS"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span>
          {device === 'android'
            ? (isPidgin ? 'Download BMoni Android App' : 'Get BMoni on Google Play')
            : device === 'ios'
            ? (isPidgin ? 'Download BMoni iPhone App' : 'Get BMoni on App Store')
            : (isPidgin ? 'Download BMoni Mobile App' : 'Download BMoni App')}
        </span>
        <ExternalLink className="w-3 h-3 text-emerald-400" />
      </a>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-blue-950/80 border border-emerald-500/40 shadow-lg space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40">
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display">
              {isPidgin ? 'Download BMoni Mobile Banking App' : 'Download BMoni Mobile App (Android & Apple)'}
            </h4>
            <p className="text-[11px] text-slate-300">
              {isPidgin
                ? 'Manage your NGN virtual accounts, webhooks, and BVN identity on your mobile phone.'
                : 'Manage NGN virtual deposit accounts, webhooks, and BVN identity on mobile.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href="https://play.google.com/store/apps/details?id=com.bmoni.app"
          target="_blank"
          rel="noopener noreferrer"
          className={`py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border transition-all flex items-center justify-center gap-2 active:scale-95 group ${
            device === 'android' ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50' : 'border-slate-800'
          }`}
        >
          <span className="text-base group-hover:scale-110 transition-transform">🤖</span>
          <div className="text-left">
            <div className="text-[9px] font-mono text-slate-400 uppercase leading-none">GET IT ON</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Google Play (Android)</div>
          </div>
        </a>

        <a
          href="https://apps.apple.com/us/app/bmoni-by-bkey/id6751323804"
          target="_blank"
          rel="noopener noreferrer"
          className={`py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border transition-all flex items-center justify-center gap-2 active:scale-95 group ${
            device === 'ios' ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/50' : 'border-slate-800'
          }`}
        >
          <span className="text-base group-hover:scale-110 transition-transform">🍎</span>
          <div className="text-left">
            <div className="text-[9px] font-mono text-slate-400 uppercase leading-none">DOWNLOAD ON THE</div>
            <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">App Store (Apple iOS)</div>
          </div>
        </a>
      </div>
    </div>
  );
}
