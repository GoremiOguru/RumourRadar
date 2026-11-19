'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HeroDecorativeBackground } from '@/components/HeroDecorativeBackground';
import { NigeriaHeatmap } from '@/components/NigeriaHeatmap';
import { WhyTruetalkModal } from '@/components/WhyTruetalkModal';
import { PagaSubscriptionModal } from '@/components/PagaSubscriptionModal';
import { ArrowLeft, Sparkles, MapPin, Flame } from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

export default function MapPage() {
  const { t } = useTranslations();
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isPagaModalOpen, setIsPagaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'verify' | 'brand_shield' | 'about'>('about');

  return (
    <div className="min-h-[100dvh] bg-[#dcebf6] text-[#0b2540] flex flex-col font-sans relative overflow-x-hidden">
      {/* 1. Shared Header */}
      <Header
        onOpenWhyModal={() => setIsWhyModalOpen(true)}
        onOpenPagaModal={() => setIsPagaModalOpen(true)}
      />

      {/* Decorative Map Background */}
      <HeroDecorativeBackground />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 relative z-10 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#005b9c] transition-all shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('map.backHome')}</span>
          </Link>
        </div>

        {/* 36-State Threat Intelligence Heatmap Component */}
        <div className="rounded-[28px] bg-white/70 backdrop-blur-md border border-white/80 p-4 sm:p-7 shadow-sm">
          <NigeriaHeatmap
            onSelectClaim={(claim) => {
              if (typeof window !== 'undefined') {
                window.location.href = `/?claim=${encodeURIComponent(claim)}`;
              }
            }}
          />
        </div>

        {/* Floating Navigation Pill */}
        <div className="pt-6 flex justify-center">
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'verify') window.location.href = '/';
            }}
          />
        </div>
      </main>

      {/* Modals */}
      <WhyTruetalkModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />

      <PagaSubscriptionModal
        isOpen={isPagaModalOpen}
        onClose={() => setIsPagaModalOpen(false)}
      />
    </div>
  );
}
