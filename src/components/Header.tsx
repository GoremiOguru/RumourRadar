'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Crown, ChevronDown, Check, HelpCircle, Map, Play } from 'lucide-react';
import { useLanguage, AppLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onOpenWhyModal?: () => void;
  onOpenPagaModal?: () => void;
  onNavigateTab?: (tab: 'verify' | 'brand_shield' | 'about' | 'heatmap') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWhyModal,
  onOpenPagaModal,
  onNavigateTab
}) => {
  const { locale, setLocale, t } = useLanguage();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Exactly two options: English and Naija Pidgin
  const languages: Array<{ code: AppLanguage; short: string; label: string; flag: string }> = [
    { code: 'en', short: 'EN', label: t('header.english'), flag: '🇬🇧' },
    { code: 'pcm', short: 'PCM', label: t('header.pidgin'), flag: '🇳🇬' }
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll and handle Escape key for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleSelectLanguage = (langCode: AppLanguage) => {
    setLocale(langCode);
    setIsLangDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#005b9c] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        {/* Left Section: Logo inside a clean white rounded chip */}
        <Link
          href="/"
          className="inline-flex items-center bg-white rounded-[14px] px-3 py-1.5 shadow-sm hover:shadow transition-all shrink-0"
          title={t('header.logoAria')}
          aria-label={t('header.logoAria')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/truetalk-logo.png"
            alt="Truetalk"
            width={126}
            height={42}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation (Visible on md and up >=768px) */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6 shrink-0">
          {/* 1. Language Selector (globe + EN/PCM + chevron, clean white card dropdown with radius 14px) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-white hover:text-white/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm py-1 cursor-pointer"
              aria-label={t('header.langSelect')}
              aria-expanded={isLangDropdownOpen}
            >
              <Globe className="w-4 h-4 text-white" />
              <span className="font-bold tracking-wider">{currentLang.short}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-[14px] bg-white border border-[#D5E7FA] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4a6076]">
                  {t('header.langSelect')}
                </div>
                {languages.map((lang) => {
                  const isActive = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full px-3.5 py-2 text-xs font-medium text-left flex items-center justify-between hover:bg-[#e6f1f8] transition-colors cursor-pointer ${
                        isActive ? 'text-[#005b9c] font-bold bg-[#e6f1f8]/70' : 'text-[#0b2540]'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {isActive && <Check className="w-4 h-4 text-[#005b9c]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Why? (text link with permanent wavy underline in soft light yellow) */}
          {onOpenWhyModal && (
            <button
              onClick={onOpenWhyModal}
              className="why-squiggly text-white hover:text-white/95 text-xs sm:text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm py-1 cursor-pointer"
              title={t('header.whyAria')}
              aria-label={t('header.whyAria')}
            >
              {t('header.why')}
            </button>
          )}

          {/* 3. Paga Plus Button */}
          {onOpenPagaModal && (
            <button
              onClick={onOpenPagaModal}
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-[12px] bg-white text-[#005b9c] hover:bg-[#e6f1f8] text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer"
              title={t('header.pagaPlusAria')}
              aria-label={t('header.pagaPlusAria')}
            >
              <Crown className="w-4 h-4 text-[#005b9c] fill-[#005b9c]" />
              <span>{t('header.pagaPlus')}</span>
            </button>
          )}
        </div>

        {/* Mobile Actions Container (<768px) */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Paga Plus Button (Compact on mobile, hidden when hamburger menu is open) */}
          {onOpenPagaModal && !isMobileMenuOpen && (
            <button
              onClick={onOpenPagaModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-[10px] bg-white text-[#005b9c] text-xs font-semibold shadow-xs shrink-0 cursor-pointer transition-opacity"
              title={t('header.pagaPlusAria')}
            >
              <Crown className="w-3.5 h-3.5 text-[#005b9c] fill-[#005b9c]" />
              <span>Plus</span>
            </button>
          )}

          {/* Hamburger Menu Toggle (44x44px hit target, morphs into X) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? t('header.menuClose') : t('header.menuOpen')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-header-menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-250 ease-out origin-top-left ${
                  isMobileMenuOpen ? 'rotate-45 translate-x-1 translate-y-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-opacity duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-250 ease-out origin-bottom-left ${
                  isMobileMenuOpen ? '-rotate-45 translate-x-1 -translate-y-0' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay & Drawer (<768px) */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Translucent Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Drawer */}
          <div
            id="mobile-header-menu"
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-[#005b9c] border-t border-white/10 rounded-b-[20px] shadow-2xl p-5 z-50 md:hidden animate-in slide-in-from-top-3 duration-250 space-y-4"
          >
            {/* Language Selection: Two stacked rows with check on active language */}
            <div className="pb-3 pt-1 border-b border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-2">
                {t('header.langSelect')}
              </span>
              <div className="flex flex-col space-y-2">
                {languages.map((lang) => {
                  const isActive = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#005b9c] font-bold shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.label} ({lang.short})</span>
                      </span>
                      {isActive && <Check className="w-4 h-4 text-[#005b9c]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Rows */}
            <div className="space-y-1 divide-y divide-white/10 text-white text-[15px] font-medium">
              {/* Why Truetalk Link */}
              {onOpenWhyModal && (
                <div className="py-2.5">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenWhyModal();
                    }}
                    className="w-full flex items-center justify-between text-left py-1 text-white hover:text-white/80 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-[#ffe27a]" />
                      <span className="why-squiggly">{t('header.why')}</span>
                    </div>
                    <span className="text-xs text-white/60">→</span>
                  </button>
                </div>
              )}

              {/* View 36-State Map Link */}
              <div className="py-2.5">
                <Link
                  href="/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between text-left py-1 text-white hover:text-white/80"
                >
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-[#a3d3fc]" />
                    <span>{t('header.navMap')}</span>
                  </div>
                  <span className="text-xs text-white/60">→</span>
                </Link>
              </div>

              {/* How to Use Tutorial Link */}
              <div className="py-2.5">
                <Link
                  href="/how-to-use"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between text-left py-1 text-white hover:text-white/80"
                >
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-[#a3d3fc] fill-[#a3d3fc]" />
                    <span>{t('header.navHowToUse')}</span>
                  </div>
                  <span className="text-xs text-white/60">→</span>
                </Link>
              </div>
            </div>

            {/* Paga Plus Primary Button in Drawer */}
            {onOpenPagaModal && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPagaModal();
                  }}
                  className="w-full py-3 rounded-xl bg-white text-[#005b9c] font-semibold text-sm flex items-center justify-center space-x-2 shadow-md hover:bg-[#e6f1f8] transition-colors cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-[#005b9c] fill-[#005b9c]" />
                  <span>{t('header.pagaPlus')}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
