'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Sparkles, Mic, Settings2, Radio, Compass } from 'lucide-react';

interface PidginVoicePlayerProps {
  pidginText: string;
  englishText?: string;
  claimEntity?: string;
  verdict?: string;
}

export function PidginVoicePlayer({ pidginText, englishText, claimEntity, verdict }: PidginVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [mode, setMode] = useState<'nigerian_english' | 'pidgin'>('nigerian_english');
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

      const prioritized = rankNigerianGoogleMapsVoices(allVoices);
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

  /**
   * Sorts voices specifically prioritizing the Google Maps Nigerian English Voice profile:
   * 1. Google English (Nigeria) / en-NG Google Voice
   * 2. Microsoft Ezinne Online (Natural) - English (Nigeria)
   * 3. African English Natural voices (en-ZA, en-KE, en-GH)
   * 4. Natural / Neural Commonwealth English voices
   */
  const rankNigerianGoogleMapsVoices = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] => {
    return [...voices].sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        let pts = 0;
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();

        // 1. Google English (Nigeria) - EXACT Google Maps Nigeria Voice
        if (name.includes('google') && (lang.includes('en-ng') || lang.includes('en_ng'))) {
          pts += 200;
        }

        // 2. Microsoft Ezinne / Nigerian English
        if (lang.includes('en-ng') || lang.includes('en_ng')) {
          pts += 150;
          if (name.includes('ezinne') || name.includes('natural') || name.includes('neural')) pts += 40;
        }

        // 3. African English (en-ZA: Leah/Ayanda, en-KE, en-GH)
        if (lang.includes('en-za') || lang.includes('en-ke') || lang.includes('en-gh')) {
          pts += 80;
          if (name.includes('natural') || name.includes('leah')) pts += 30;
        }

        // 4. Natural Commonwealth
        if (name.includes('natural') || name.includes('neural')) pts += 40;
        if (name.includes('sonia') || name.includes('libby') || name.includes('maisie')) pts += 20;

        // Penalize robotic synthesizers
        if (name.includes('david') || name.includes('george') || name.includes('zira') || name.includes('desktop')) pts -= 60;

        return pts;
      };

      return score(b) - score(a);
    });
  };

  const formatVoiceDisplay = (v: SpeechSynthesisVoice): string => {
    const name = v.name.replace(/Microsoft|Google|Online \(Natural\)|\(Natural\)/gi, '').trim();
    if (v.name.toLowerCase().includes('google') && v.lang.includes('NG')) {
      return `🇳🇬 Google Maps Nigeria Voice (Google en-NG)`;
    }
    if (v.lang.includes('NG')) return `🇳🇬 ${name || 'Ezinne'} (Nigerian English)`;
    if (v.lang.includes('ZA')) return `🇿🇦 ${name || 'Leah'} (African Natural)`;
    if (v.lang.includes('GB')) return `🇬🇧 ${name || 'Sonia'} (Commonwealth Natural)`;
    return `🔊 ${name} (${v.lang})`;
  };

  /**
   * Prepares smooth, professional Nigerian English speech script (Google Maps style)
   */
  const formatForNigerianEnglishSpeech = (text: string): string => {
    return text
      .replace(/₦\s*([0-9,]+)/g, '$1 Naira')
      .replace(/\bCBN\b/g, 'Central Bank of Nigeria')
      .replace(/\bINEC\b/g, 'Independent National Electoral Commission')
      .replace(/\bEFCC\b/g, 'E.F.C.C.')
      .replace(/\bNNPC\b/g, 'N.N.P.C.')
      .replace(/\bNCDC\b/g, 'Nigeria Centre for Disease Control')
      .replace(/\bJAMB\b/g, 'Joint Admissions and Matriculation Board')
      .replace(/\bWAEC\b/g, 'West African Examinations Council')
      .replace(/--/g, '. ')
      .replace(/\.\.\./g, '. ');
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Choose script based on active mode
    const rawText = mode === 'nigerian_english' 
      ? (englishText || pidginText)
      : pidginText;

    const speechScript = mode === 'nigerian_english'
      ? `Rumour Radar Nigeria verification verdict. ${formatForNigerianEnglishSpeech(rawText)}`
      : `Rumour Radar Naija fact check report. ${formatForNigerianEnglishSpeech(rawText)}`;

    const utterance = new SpeechSynthesisUtterance(speechScript);
    utteranceRef.current = utterance;

    const currentVoice = availableVoices[selectedVoiceIndex] || availableVoices[0];
    if (currentVoice) {
      utterance.voice = currentVoice;
      utterance.lang = currentVoice.lang.includes('NG') ? currentVoice.lang : 'en-NG';
    }

    // Google Maps Nigeria Voice Cadence Settings:
    // Pacing: 0.98 (crisp, confident, natural syllable timing)
    // Pitch: 1.0 (authentic, clear Nigerian intonation)
    utterance.rate = 0.98;
    utterance.pitch = 1.02;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/60 border border-emerald-500/30 shadow-xl backdrop-blur-md space-y-3">
      {/* Top Bar: Play, Title & Voice Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Play Action & Active Track */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 animate-pulse ring-2 ring-emerald-400/50 shadow-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
            title={isPlaying ? 'Pause Audio' : 'Play Nigerian Audio Verdict (Google Maps Voice)'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Nigerian Audio Verdict
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-200 font-bold">
                🇳🇬 Google Maps Nigeria Voice
              </span>
            </div>
            <p className="text-[11px] text-slate-300 italic line-clamp-1 max-w-sm sm:max-w-md">
              &ldquo;{mode === 'nigerian_english' ? (englishText || pidginText) : pidginText}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Button & Equalizer */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-6 px-2.5 bg-emerald-950/80 rounded-lg border border-emerald-500/30 py-1">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-4"></span>
              <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s] h-5"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3"></span>
              <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.25s] h-4.5"></span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold ml-1.5">Speaking...</span>
            </div>
          ) : (
            <button
              onClick={handleTogglePlay}
              className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Listen Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Language Dialect Selector & Voice Profile Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-emerald-900/30 text-[11px]">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => {
              setMode('nigerian_english');
              if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
              }
            }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              mode === 'nigerian_english'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇳🇬 Nigerian English (Google Maps)
          </button>

          <button
            onClick={() => {
              setMode('pidgin');
              if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
              }
            }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              mode === 'pidgin'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇳🇬 Naija Pidgin
          </button>
        </div>

        {/* Detected Voice Indicator */}
        {availableVoices.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="text-emerald-400">Profile:</span>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedVoiceIndex(idx);
                setVoiceLabel(formatVoiceDisplay(availableVoices[idx]));
                if (isPlaying) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className="bg-slate-900 text-emerald-300 border border-emerald-500/30 rounded px-2 py-0.5 text-[10px] focus:outline-none max-w-[200px] truncate"
            >
              {availableVoices.slice(0, 5).map((v, idx) => (
                <option key={v.name} value={idx}>
                  {formatVoiceDisplay(v)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
