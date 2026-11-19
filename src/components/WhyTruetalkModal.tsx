'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTranslations } from '@/context/LanguageContext';

interface WhyTruetalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage?: 'en' | 'pcm';
}

export const WhyTruetalkModal: React.FC<WhyTruetalkModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const comparisonRows = [
    {
      title: t('whyModal.row1Title'),
      truetalk: t('whyModal.row1Truetalk'),
      generic: t('whyModal.row1Generic')
    },
    {
      title: t('whyModal.row2Title'),
      truetalk: t('whyModal.row2Truetalk'),
      generic: t('whyModal.row2Generic')
    },
    {
      title: t('whyModal.row3Title'),
      truetalk: t('whyModal.row3Truetalk'),
      generic: t('whyModal.row3Generic')
    },
    {
      title: t('whyModal.row4Title'),
      truetalk: t('whyModal.row4Truetalk'),
      generic: t('whyModal.row4Generic')
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-[24px] sm:rounded-[28px] overflow-hidden my-4 sm:my-8 bg-white border border-[#D5E7FA] shadow-2xl text-[#0b2540] max-h-[92dvh] flex flex-col animate-in zoom-in-95 duration-200"
        style={{
          background: `
            radial-gradient(circle at 10% 0%, rgba(234,243,252,0.9), transparent 50%),
            linear-gradient(180deg, #ffffff 0%, #f4f8fc 100%)
          `
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-[#D5E7FA] flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FC] border border-[#D5E7FA] flex items-center justify-center shrink-0 text-[#005b9c]">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-[#0b2540] tracking-tight flex items-center gap-2">
                <span>{t('whyModal.title')}</span>
              </h2>
              <p className="text-xs text-[#4a6076]">
                {t('whyModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0b2540] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-sm scrollbar-none">
          {/* Executive Summary Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#D5E7FA] shadow-2xs leading-relaxed text-[#0b2540]">
            <strong className="text-[#005b9c] font-bold">{t('whyModal.whyMattersHeading')}</strong>{' '}
            <span className="text-[#4a6076]">{t('whyModal.whyMattersDesc')}</span>
          </div>

          {/* Three Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#D5E7FA] shadow-2xs space-y-1">
              <h3 className="text-xs font-bold text-[#005b9c] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#005b9c]" />
                {t('whyModal.pillar1Title')}
              </h3>
              <p className="text-xs leading-relaxed text-[#4a6076]">{t('whyModal.pillar1Desc')}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#D5E7FA] shadow-2xs space-y-1">
              <h3 className="text-xs font-bold text-[#005b9c] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005b9c]" />
                {t('whyModal.pillar2Title')}
              </h3>
              <p className="text-xs leading-relaxed text-[#4a6076]">{t('whyModal.pillar2Desc')}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#D5E7FA] shadow-2xs space-y-1">
              <h3 className="text-xs font-bold text-[#005b9c] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005b9c]" />
                {t('whyModal.pillar3Title')}
              </h3>
              <p className="text-xs leading-relaxed text-[#4a6076]">{t('whyModal.pillar3Desc')}</p>
            </div>
          </div>

          {/* Comparison Section Header */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#005b9c]">
              {t('whyModal.tableHeading')}
            </h3>

            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-[#D5E7FA] bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#eaf3fc]/80 border-b border-[#D5E7FA] text-[#0b2540]">
                    <th className="p-3.5 font-bold w-1/3">{t('whyModal.colFeature')}</th>
                    <th className="p-3.5 font-bold text-[#005b9c] w-1/3">{t('whyModal.colTruetalk')}</th>
                    <th className="p-3.5 font-bold text-[#4a6076] w-1/3">{t('whyModal.colGeneric')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5E7FA]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f4f8fc]/60 transition-colors">
                      <td className="p-3.5 font-semibold text-[#0b2540]">{row.title}</td>
                      <td className="p-3.5 text-[#005b9c] font-semibold">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.truetalk}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#4a6076]">
                        <div className="flex items-start gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.generic}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Card View (< 640px) */}
            <div className="sm:hidden space-y-2.5">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#D5E7FA] shadow-2xs space-y-2.5">
                  <span className="text-xs font-bold text-[#0b2540] block">{row.title}</span>

                  <div className="space-y-1.5 text-xs">
                    {/* Truetalk Capable */}
                    <div className="p-2.5 rounded-xl bg-[#e6f1f8] border border-[#d5e7fa] text-[#005b9c] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider block text-[#005b9c]/70">Truetalk AI</span>
                        <span className="font-semibold">{row.truetalk}</span>
                      </div>
                    </div>

                    {/* Generic AI Limitation */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[#4a6076] flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400">Generic AI</span>
                        <span>{row.generic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005b9c] hover:bg-[#00406e] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{t('whyModal.startBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhyRumorRadarModal = WhyTruetalkModal;
