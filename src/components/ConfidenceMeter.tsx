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
          bar: 'bg-emerald-400',
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/40 border-emerald-800/40',
          icon: ShieldCheck
        };
      case 'MEDIUM':
        return {
          bar: 'bg-amber-400',
          text: 'text-amber-400',
          bg: 'bg-amber-950/40 border-amber-800/40',
          icon: Shield
        };
      case 'LOW':
      default:
        return {
          bar: 'bg-slate-400',
          text: 'text-slate-400',
          bg: 'bg-slate-900/40 border-slate-800/40',
          icon: ShieldAlert
        };
    }
  };

  const style = getColors();
  const Icon = style.icon;

  return (
    <div className={`p-4 rounded-xl border ${style.bg} backdrop-blur-sm flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${style.text}`} />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Confidence Band
          </span>
        </div>
        <span className={`text-xs font-mono font-bold ${style.text}`}>
          {confidence} ({animatedScore}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className={`h-full ${style.bar}`}
          style={{ width: `${Math.min(100, Math.max(10, animatedScore))}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400 mt-2">
        {confidence === 'HIGH' && 'Corroborated by high-authority direct registries.'}
        {confidence === 'MEDIUM' && 'Supported by secondary media reports.'}
        {confidence === 'LOW' && 'Scant evidence available; uncorroborated claim.'}
      </p>
    </div>
  );
};
