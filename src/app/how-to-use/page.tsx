'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HeroDecorativeBackground } from '@/components/HeroDecorativeBackground';
import { WhyTruetalkModal } from '@/components/WhyTruetalkModal';
import { PagaSubscriptionModal } from '@/components/PagaSubscriptionModal';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Play
} from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

export default function HowToUsePage() {
  const { t } = useTranslations();
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isPagaModalOpen, setIsPagaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'verify' | 'brand_shield' | 'about'>('about');

  const steps = [
    {
      number: '01',
      icon: Search,
      title: t('howToUse.step1Title'),
      description: t('howToUse.step1Desc')
    },
    {
      number: '02',
      icon: ShieldCheck,
      title: t('howToUse.step2Title'),
      description: t('howToUse.step2Desc')
    },
    {
      number: '03',
      icon: CheckCircle2,
      title: t('howToUse.step3Title'),
      description: t('howToUse.step3Desc')
    },
    {
      number: '04',
      icon: Share2,
      title: t('howToUse.step4Title'),
      description: t('howToUse.step4Desc')
    }
  ];

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
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 relative z-10 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#005b9c] transition-all shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('howToUse.backHome')}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#005b9c]/10 border border-[#005b9c]/20 text-[#005b9c] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('howToUse.tourTitle')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0b2540]">
            {t('howToUse.pageTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#4a6076] max-w-2xl leading-relaxed">
            {t('howToUse.pageSubtitle')}
          </p>
        </div>

        {/* Step-by-Step Glass Cards Grid */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-[20px] bg-white/60 backdrop-blur-md border border-white/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:bg-white/75 transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
              >
                {/* Step Number Badge */}
                <div className="w-12 h-12 rounded-[16px] bg-[#005b9c] text-white flex items-center justify-center font-mono font-bold text-base shrink-0 shadow-sm shadow-blue-500/25">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#005b9c]" />
                    <h3 className="font-semibold text-base sm:text-lg text-[#0b2540]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a6076] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video / Interactive Demo Banner */}
        <div className="rounded-[24px] bg-white/75 backdrop-blur-md border border-[#005b9c]/25 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#005b9c]">
              <Play className="w-4 h-4 fill-[#005b9c]" />
              <span>{t('howToUse.tourTitle')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0b2540]">
              {t('howToUse.tourClaim')}
            </h3>
            <p className="text-xs sm:text-sm text-[#4a6076] max-w-md">
              {t('howToUse.tourSummary')}
            </p>
          </div>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-[16px] bg-[#005b9c] hover:bg-[#00477e] text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{t('howToUse.startVerifyingBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
