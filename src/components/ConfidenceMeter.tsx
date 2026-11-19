'use client';

import React, { useEffect, useState } from 'react';
import { ConfidenceLevel } from '@/types';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: ConfidenceLevel;
  score: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence, score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const targetScore = Math.min(100, Math.max(0, score));
    let frameId = 0;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frameId = window.requestAnimationFrame(() => setAnimatedScore(targetScore));
      return () => window.cancelAnimationFrame(frameId);
    }

    const duration = 900;
    let startTime: number | null = null;
    const animateScore = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min(1, (time - startTime) / duration);
      const easedProgress = 1 - (1 - progress) ** 3;
      setAnimatedScore(Math.round(targetScore * easedProgress));

      if (progress < 1) frameId = window.requestAnimationFrame(animateScore);
    };

    frameId = window.requestAnimationFrame(animateScore);
    return () => window.cancelAnimationFrame(frameId);
  }, [score]);

  const getColors = () => {
    switch (confidence) {
      case 'HIGH':
        return {
          bar: 'bg-[#16A36A]',
          text: 'text-[#16A36A]',
          bg: 'bg-white border-[#D5E7FA]',
          icon: ShieldCheck
        };
      case 'MEDIUM':
        return {
          bar: 'bg-amber-500',
          text: 'text-amber-600',
          bg: 'bg-white border-[#D5E7FA]',
          icon: Shield
        };
      case 'LOW':
      default:
        return {
          bar: 'bg-slate-400',
          text: 'text-slate-600',
          bg: 'bg-white border-[#D5E7FA]',
          icon: ShieldAlert
        };
    }
  };

  const style = getColors();
  const Icon = style.icon;

  return (
    <div className={`p-4 rounded-2xl border ${style.bg} shadow-xs flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${style.text}`} />
          <span className="text-xs uppercase tracking-wider font-bold text-[#0C2340]">
            Confidence Band
          </span>
        </div>
        <span className={`text-xs font-mono font-bold ${style.text}`}>
          {confidence} ({animatedScore}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className={`h-full ${style.bar} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(100, Math.max(10, animatedScore))}%` }}
        />
      </div>

      <p className="text-[11px] text-[#64748B] mt-2">
        {confidence === 'HIGH' && 'Corroborated by high-authority direct registries.'}
        {confidence === 'MEDIUM' && 'Supported by secondary media reports.'}
        {confidence === 'LOW' && 'Scant evidence available; uncorroborated claim.'}
      </p>
    </div>
  );
};
