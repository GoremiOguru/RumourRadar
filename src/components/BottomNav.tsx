'use client';

import React from 'react';
import { ShieldCheck, Building2, Info, Lock } from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

export type BottomNavTab = 'verify' | 'brand_shield' | 'about' | 'heatmap';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: 'verify' | 'brand_shield' | 'about') => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, className = '' }) => {
  const { t } = useTranslations();

  const navItems = [
    {
      id: 'verify' as const,
      label: t('nav.claim'),
      shortLabel: t('nav.claim'),
      icon: ShieldCheck,
      hasLock: false
    },
    {
      id: 'brand_shield' as const,
      label: t('nav.brandShield'),
      shortLabel: t('nav.brandShield'),
      icon: Building2,
      hasLock: true
    },
    {
      id: 'about' as const,
      label: t('nav.aboutUs'),
      shortLabel: t('nav.about'),
      icon: Info,
      hasLock: false
    }
  ];

  return (
    <nav
      className={`mx-auto w-fit max-w-[92vw] sm:max-w-[640px] bg-[#005b9c] rounded-[18px] sm:rounded-[22px] p-1.5 sm:p-2 shadow-[0_10px_30px_rgba(0,91,156,0.30)] border border-white/15 flex items-center justify-center gap-1 sm:gap-2 z-30 transition-all ${
        /* On mobile (<640px), dock 12px above bottom with safe-area padding; on desktop, flow naturally */
        'max-sm:fixed max-sm:bottom-3 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:z-40 max-sm:w-[calc(100%-24px)] max-sm:max-w-md'
      } ${className}`}
      style={{
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))'
      }}
      aria-label={t('nav.ariaNav')}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (activeTab === 'heatmap' && item.id === 'verify');

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-[14px] sm:rounded-[16px] text-xs sm:text-[14px] font-medium transition-all duration-200 select-none ${
              isActive
                ? 'bg-white/16 text-white font-semibold shadow-inner ring-1 ring-white/20'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="tracking-normal whitespace-nowrap hidden xs:inline">
              {item.label}
            </span>
            <span className="tracking-normal whitespace-nowrap xs:hidden">
              {item.shortLabel}
            </span>
            {item.hasLock && (
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E6A23C] fill-[#E6A23C] shrink-0 ml-0.5" />
            )}

            {/* Indicator bar beneath active item */}
            {isActive && (
              <span className="absolute -bottom-0.5 left-3 sm:left-4 right-3 sm:right-4 h-[2px] sm:h-[2.5px] bg-white rounded-full transition-all" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
