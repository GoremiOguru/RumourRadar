'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Sparkles, Mic, Compass, Globe } from 'lucide-react';
import { MultilingualExplanations } from '@/lib/naijaml';

interface PidginVoicePlayerProps {
  pidginText: string;
  englishText?: string;
  multilingual?: MultilingualExplanations;
  claimEntity?: string;
  verdict?: string;
}

export function PidginVoicePlayer({ pidginText, englishText, multilingual, claimEntity, verdict }: PidginVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [mode, setMode] = useState<'english' | 'pidgin' | 'yoruba' | 'hausa' | 'igbo'>('english');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [voiceLabel, setVoiceLabel] = useState<string>('Google Maps Nigeria Voice');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const prioritized = rankNigerianVoices(allVoices);
      setAvailableVoices(prioritized);

      if (prioritized.length > 0) {
        setVoiceLabel(formatVoiceDisplay(prioritized[0]));
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const rankNigerianVoices = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] => {
    return [...voices].sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        let pts = 0;
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();

        if (name.includes('google') && (lang.includes('en-ng') || lang.includes('en_ng'))) pts += 200;
        if (lang.includes('en-ng') || lang.includes('en_ng')) pts += 150;
        if (lang.includes('en-za') || lang.includes('en-ke') || lang.includes('en-gh')) pts += 80;
        if (name.includes('natural') || name.includes('neural')) pts += 40;
        if (name.includes('david') || name.includes('zira')) pts -= 60;

        return pts;
      };

      return score(b) - score(a);
    });
  };

  const formatVoiceDisplay = (v: SpeechSynthesisVoice): string => {
    const name = v.name.replace(/Microsoft|Google|Online \(Natural\)|\(Natural\)/gi, '').trim();
    if (v.name.toLowerCase().includes('google') && v.lang.includes('NG')) {
      return `🇳🇬 Google Maps Nigeria Voice`;
    }
    if (v.lang.includes('NG')) return `🇳🇬 ${name || 'Ezinne'} (Nigerian Voice)`;
    if (v.lang.includes('ZA')) return `🇿🇦 ${name || 'Leah'} (African Natural)`;
    return `🔊 ${name || 'Default Voice'} (${v.lang})`;
  };

  const getTextForMode = (): string => {
    if (!multilingual) {
      return mode === 'pidgin' ? pidginText : (englishText || pidginText);
    }
    switch (mode) {
      case 'pidgin': return multilingual.pidgin || pidginText;
      case 'yoruba': return multilingual.yoruba;
      case 'hausa': return multilingual.hausa;
      case 'igbo': return multilingual.igbo;
      case 'english':
      default: return multilingual.english || englishText || pidginText;
    }
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const rawText = getTextForMode();
    const prefix = mode === 'pidgin'
      ? 'Rumour Radar Naija voice report. '
      : mode === 'yoruba'
      ? 'Akiyesi Rumour Radar ni ede Yoruba. '
      : mode === 'hausa'
      ? 'Bayanin Rumour Radar a harshen Hausa. '
      : mode === 'igbo'
      ? 'Nkọwa Rumour Radar na asụsụ Igbo. '
      : 'Rumour Radar Nigeria verification verdict. ';

    const speechScript = `${prefix}${rawText
      .replace(/₦\s*([0-9,]+)/g, '$1 Naira')
      .replace(/\bCBN\b/g, 'Central Bank of Nigeria')
      .replace(/\bINEC\b/g, 'INEC')}`;

    const utterance = new SpeechSynthesisUtterance(speechScript);
    utteranceRef.current = utterance;

    const currentVoice = availableVoices[selectedVoiceIndex] || availableVoices[0];
    if (currentVoice) {
      utterance.voice = currentVoice;
      utterance.lang = currentVoice.lang.includes('NG') ? currentVoice.lang : 'en-NG';
    }

    utterance.rate = 0.96;
    utterance.pitch = 1.02;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/60 border border-emerald-500/30 shadow-xl backdrop-blur-md space-y-3">
      {/* Top Bar: Play, Title & Voice Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Play Action & Active Track */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 animate-pulse ring-2 ring-emerald-400/50 shadow-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
            title={isPlaying ? 'Pause Audio' : 'Listen Aloud in Local Language'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
          </button>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 font-display">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                Audio Fact-Check (Naija Voice)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-200 font-bold">
                🔊 Listen in Native Dialect
              </span>
            </div>
            <p className="text-[11px] text-slate-300 italic line-clamp-1 max-w-sm sm:max-w-md">
              &ldquo;{getTextForMode()}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Button & Equalizer */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-7 px-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 py-1">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-4"></span>
              <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s] h-5"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3"></span>
              <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.25s] h-4.5"></span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold ml-1.5">Reading Aloud...</span>
            </div>
          ) : (
            <button
              onClick={handleTogglePlay}
              className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Listen Now</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Dialect Voice Audio Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-emerald-900/30 text-[11px]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-slate-400 font-semibold mr-1">Voice Dialect:</span>
          {[
            { code: 'english', label: 'English 🇬🇧' },
            { code: 'pidgin', label: 'Pidgin 🇳🇬' },
            { code: 'yoruba', label: 'Yorùbá 🇳🇬' },
            { code: 'hausa', label: 'Hausa 🇳🇬' },
            { code: 'igbo', label: 'Igbo 🇳🇬' }
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setMode(item.code as any);
                if (isPlaying) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                mode === item.code
                  ? 'bg-emerald-500 text-black shadow-sm font-black'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
