'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Video,
  Sparkles,
  Play,
  Pause,
  Zap,
  Check,
  Copy,
  Volume2,
  VolumeX,
  Mic,
  Radio
} from 'lucide-react';
import { AppLanguage } from '@/lib/i18n';

export type HelpSectionType = 'verify' | 'brand_shield' | 'heatmap' | 'deepfake';

interface SectionHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: HelpSectionType;
  appLanguage?: AppLanguage;
}

const READING_BUFFER_MS = 4000; // 4 seconds extra reading time after voice narrator finishes talking

export function SectionHelpModal({ isOpen, onClose, section, appLanguage = 'en' }: SectionHelpModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<HelpSectionType>(section);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [voiceLang, setVoiceLang] = useState<'en' | 'pcm'>(appLanguage === 'pcm' ? 'pcm' : 'en');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedPrKit, setCopiedPrKit] = useState<boolean>(false);

  const stepCardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const isPidgin = appLanguage === 'pcm' || voiceLang === 'pcm';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveSection(section);
    setActiveStep(1);
    setIsPlayingDemo(false);
    setStepProgress(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [section]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Web Speech API Voice Narrator trigger with completion callback
  const speakStep = (stepNum: number, onSpeechEnd?: () => void) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    window.speechSynthesis.cancel(); // cancel previous speech

    const secData = getSectionData();
    const currentStepObj = secData.steps.find((s) => s.step === stepNum);
    if (!currentStepObj) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    const rawSpeechText = `Step ${currentStepObj.step}: ${currentStepObj.title}. ${currentStepObj.desc}`;
    const speechText = rawSpeechText
      .replace(/\bINEC\b/g, 'Eye-neck')
      .replace(/\bCBN\b/g, 'C B N')
      .replace(/\bNCDC\b/g, 'N C D C')
      .replace(/\bWAEC\b/g, 'Why-eck')
      .replace(/\bJAMB\b/g, 'Jamb')
      .replace(/\bGTBank\b/g, 'G T Bank');

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.90; // Clear, relaxed pace
    utterance.pitch = 1.0;

    // Select suitable English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-NG') || v.lang.startsWith('en-GB') || v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    let callbackFired = false;
    const triggerEndOnce = () => {
      if (!callbackFired) {
        callbackFired = true;
        if (onSpeechEnd) onSpeechEnd();
      }
    };

    utterance.onend = triggerEndOnce;
    utterance.onerror = triggerEndOnce;

    window.speechSynthesis.speak(utterance);
  };

  // Smart Dynamic Auto-Play Logic:
  // Speaks the card text -> waits for speech onend -> delays 4s for reading -> advances step
  useEffect(() => {
    if (!isPlayingDemo) {
      setStepProgress(0);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Scroll active step into center of modal view
    const activeEl = stepCardRefs.current[activeStep];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }

    setStepProgress(0);
    const startTime = Date.now();
    let speechDone = false;
    let speechEndTime = 0;

    const useVoice = !isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window;
    const postSpeechBufferMs = useVoice ? READING_BUFFER_MS : 10000; // 10s fallback if muted

    speakStep(activeStep, () => {
      speechDone = true;
      speechEndTime = Date.now();
    });

    const progressInterval = setInterval(() => {
      const now = Date.now();

      if (!speechDone) {
        // Voice is active - animate progress bar up to 70% while voice narrates
        const elapsed = now - startTime;
        const speechProgress = Math.min((elapsed / 6500) * 70, 70);
        setStepProgress(speechProgress);
      } else {
        // Voice finished - animate progress bar from 70% -> 100% during the 4-second reading delay
        const postElapsed = now - (speechEndTime || startTime);
        const postProgress = useVoice
          ? 70 + Math.min((postElapsed / postSpeechBufferMs) * 30, 30)
          : Math.min((postElapsed / postSpeechBufferMs) * 100, 100);

        setStepProgress(postProgress);

        if (postElapsed >= postSpeechBufferMs) {
          clearInterval(progressInterval);
          if (activeStep < 4) {
            setActiveStep((prev) => prev + 1);
          } else {
            // Finished Step 4 - pause auto-play automatically!
            setIsPlayingDemo(false);
            setStepProgress(100);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
          }
        }
      }
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [isPlayingDemo, activeStep, voiceLang, isMuted]);

  if (!isOpen || !mounted) return null;

  const getSectionData = () => {
    switch (activeSection) {
      case 'verify':
        return {
          title: isPidgin ? 'How to Check Tori (Claim Verification Guide)' : 'How to Use Claim Verification Engine',
          subtitle: isPidgin
            ? 'Learn how to verify viral tweets, WhatsApp messages, news links & voice claims against official government proof.'
            : 'Step-by-step guide to testing circulating claims against live Nigerian regulatory registries.',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
          steps: [
            {
              step: 1,
              title: isPidgin ? 'Input Your Claim or Link' : 'Enter Text, Link or Speech',
              desc: isPidgin
                ? 'Copy and paste any message from WhatsApp, tweet from X (Twitter), TikTok post, news URL, or tap the microphone to speak.'
                : 'Paste viral text, X tweet URL, WhatsApp forward, news headline, or tap the microphone to dictate your claim.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 1: INPUT CLAIM / LINK</span>
                    <span className="text-emerald-400">Microphone Active 🎙️</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between gap-2">
                    <span className="truncate text-slate-300">"CBN orders immediate shutdown of bank apps..."</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shrink-0">PASTE</span>
                  </div>
                </div>
              )
            },
            {
              step: 2,
              title: isPidgin ? 'Upload Screenshot (Optional)' : 'Upload Media Screenshot (Optional)',
              desc: isPidgin
                ? 'You fit also upload picture screenshot of WhatsApp memo or tweet. Our AI Vision go read all the text automatically.'
                : 'Attach a PNG or JPG screenshot of a viral broadcast or social post. Gemini Vision OCR extracts the text automatically.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 2: SCREENSHOT OCR INSPECTOR</span>
                    <span className="text-emerald-400">Gemini Vision OCR</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-dashed border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">🖼️</div>
                      <span className="text-slate-200 text-[10px]">whatsapp_memo_screenshot.png</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[9px]">OCR 100% READ</span>
                  </div>
                </div>
              )
            },
            {
              step: 3,
              title: isPidgin ? 'Click "Check This Claim"' : 'Trigger Verification Pipeline',
              desc: isPidgin
                ? 'Our engine go check official database of CBN, INEC, NCDC, JAMB, WAEC, and certified news desks in real time.'
                : 'RumourRadar queries live regulator databases (CBN, INEC, NCDC) and Google Fact Check APIs using deterministic scoring.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 3: LIVE REGULATOR CHECK</span>
                    <span className="text-emerald-400 animate-pulse">CBN • INEC • NCDC Scanned</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-between shadow-md">
                    <span className="flex items-center gap-1.5">⚡ CHECK THIS CLAIM NOW</span>
                    <span className="text-[9px] bg-slate-950 text-emerald-400 px-2 py-0.5 rounded">RUNNING</span>
                  </div>
                </div>
              )
            },
            {
              step: 4,
              title: isPidgin ? 'Read Verdict & Listen Audio' : 'Review Factual Verdict & Listen',
              desc: isPidgin
                ? 'See clear verdict badge (Supported, Contradicted, Misleading, Satire, Unverified) with source link & audio summary in 5 Naija dialects.'
                : 'Examine official verdict badge, source citations, evidence breakdown, and listen to vernacular TTS audio summary.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">CONTRADICTED (96%)</span>
                    <span className="text-emerald-400 text-[10px]">CBN Official Press Desk</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between">
                    <span>🔊 Audio Summary (Pidgin / Hausa / Yoruba)</span>
                    <span className="text-emerald-400 font-bold">▶ PLAY</span>
                  </div>
                </div>
              )
            }
          ]
        };

      case 'brand_shield':
        return {
          title: isPidgin ? 'How to Protect Company & Creator (Brand Shield Guide)' : 'How to Use Brand & Creator Shield',
          subtitle: isPidgin
            ? 'Track rumors targeting your company, bank, creator brand, or public figure and generate 1-click PR debunk kits.'
            : 'Monitor live disinformation threats targeting corporations, public figures, and institutions in real-time.',
          icon: <Building2 className="w-6 h-6 text-blue-400" />,
          steps: [
            {
              step: 1,
              title: isPidgin ? 'Enter Brand / Company Name' : 'Specify Entity Name',
              desc: isPidgin
                ? 'Type any company name like GTBank, Kuda, Davido, Air Peace, or choose from our quick presets.'
                : 'Enter any Nigerian corporate brand, public figure, bank, or state agency name in the search bar.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 1: BRAND SEARCH BAR</span>
                    <span className="text-blue-400">Presets: GTBank, Kuda</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold flex justify-between">
                    <span>🔍 "GTBank Nigeria"</span>
                    <span className="text-blue-400">SELECTED</span>
                  </div>
                </div>
              )
            },
            {
              step: 2,
              title: isPidgin ? 'Select Category' : 'Choose Entity Category',
              desc: isPidgin
                ? 'Select whether e be Corporation & Banks, Content Creator & Celebrity, or Government Agency.'
                : 'Filter telemetry by Corporation/Bank, Creator/Public Figure, or Government Agency.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 2: CATEGORY SELECTOR</span>
                    <span className="text-blue-400">3 Telemetry Pools</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded bg-blue-500 text-slate-950 font-bold">Corporation/Bank ✓</span>
                    <span className="px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">Creator/Celebrity</span>
                  </div>
                </div>
              )
            },
            {
              step: 3,
              title: isPidgin ? 'Scan Viral Social Signals' : 'Analyze Social Threat Radar',
              desc: isPidgin
                ? 'Click "Scan Brand Signals". Our radar checks viral X tweets, WhatsApp broadcast groups, and news desks.'
                : 'Click "Scan Brand Signals" to evaluate sentiment, misinfo velocity, and threat severity index.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 3: THREAT & SENTIMENT RADAR</span>
                    <span className="text-emerald-400">94% Positive (Safe)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-400 h-full w-[94%]" />
                  </div>
                </div>
              )
            },
            {
              step: 4,
              title: isPidgin ? 'Generate 1-Click PR Kit' : 'Deploy 1-Click PR Debunk Kit',
              desc: isPidgin
                ? 'Click PR Debunk Kit to copy ready-made official press release, WhatsApp crisis text, and X thread.'
                : 'Generate pre-formatted official debunk statements for WhatsApp, X (Twitter), press releases, and LinkedIn.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold">✨ 1-CLICK AI PR DEBUNK KIT</span>
                    <span className="bg-blue-500 text-slate-950 font-bold px-2 py-0.5 rounded">COPY KIT</span>
                  </div>
                  <p className="text-slate-300 text-[9.5px]">Pre-written press statements for WhatsApp, Twitter & Press releases.</p>
                </div>
              )
            }
          ]
        };

      case 'heatmap':
        return {
          title: isPidgin ? 'How to Use Naija State Alert Map (Geo Heatmap Guide)' : 'How to Use Geopolitical Rumor Heatmap',
          subtitle: isPidgin
            ? 'See live rumor spikes across all 36 states and Abuja in real-time.'
            : 'Track state-by-state misinformation velocity, geopolitical threat indices, and local alerts.',
          icon: <MapPin className="w-6 h-6 text-amber-400" />,
          steps: [
            {
              step: 1,
              title: isPidgin ? 'Explore Nigeria Map' : 'Inspect Geopolitical Map',
              desc: isPidgin
                ? 'Look at the interactive map showing all 6 zones (South West, North Central, South East, etc.).'
                : 'Examine the interactive vector map spanning all 36 Nigerian states and FCT Abuja.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 1: NIGERIA GEOPOLITICAL MAP</span>
                    <span className="text-amber-400">36 States + FCT</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-bold flex items-center justify-between">
                    <span>🗺️ Interactive Geopolitical Vector Map</span>
                    <span className="text-slate-400">6 Zones</span>
                  </div>
                </div>
              )
            },
            {
              step: 2,
              title: isPidgin ? 'Filter by Zone or State' : 'Filter Zone or Click State',
              desc: isPidgin
                ? 'Tap any zone button or click directly on any state on the map to see local rumors for that state.'
                : 'Select a zone pill or click on a state path to narrow down regional misinfo telemetry.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 2: STATE SELECTOR PILLS</span>
                    <span className="text-amber-400">State Telemetry</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">📍 Lagos State</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">📍 FCT Abuja</span>
                  </div>
                </div>
              )
            },
            {
              step: 3,
              title: isPidgin ? 'Check Category Risk' : 'Evaluate Category Risk',
              desc: isPidgin
                ? 'See if rumors dey high for Banking, Education, Elections, Fuel/Naira scarcity, or Public Health.'
                : 'Monitor domain risk distribution across Elections, Public Health, Banking, and Security.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 3: CATEGORY RISK DISTRIBUTION</span>
                    <span className="text-amber-400">Banking: 85% High</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-400 h-full w-[85%]" />
                  </div>
                </div>
              )
            },
            {
              step: 4,
              title: isPidgin ? 'Verify Regional Claim' : 'Verify Regional Rumor',
              desc: isPidgin
                ? 'Click "Verify Dis Tori" on any regional rumor card to run full AI evidence check instantly.'
                : 'Click "Verify Claim" on any rumor card to inspect verified regulator refutations.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">VIRAL RUMOR ALERT</span>
                    <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">VERIFY CLAIM</span>
                  </div>
                  <p className="text-slate-300 text-[9.5px]">"Voice note claiming mobile banking freeze in Lagos..."</p>
                </div>
              )
            }
          ]
        };

      case 'deepfake':
      default:
        return {
          title: isPidgin ? 'How to Catch Fake Video & AI Photo (Deepfake Scanner Guide)' : 'How to Use Deepfake Video & Image Scanner',
          subtitle: isPidgin
            ? 'Detect AI-generated photos, synthetic faces, cloned voice audio, and deepfake videos.'
            : 'Forensic inspection tool for analyzing deepfake video clips, AI-generated images, and voice biometrics.',
          icon: <Video className="w-6 h-6 text-purple-400" />,
          steps: [
            {
              step: 1,
              title: isPidgin ? 'Upload Video or Image File' : 'Upload Video or AI Image File',
              desc: isPidgin
                ? 'Drag & drop any video file (MP4, WebM) or photo image (JPG, PNG, WebP) into the dropzone.'
                : 'Upload MP4/WebM video clips or synthetic AI-generated images (JPG, PNG, WebP).',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 1: MEDIA UPLOAD DROPZONE</span>
                    <span className="text-purple-400">MP4 / JPG / WebP</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-dashed border-purple-500/40 text-purple-300 font-bold flex justify-between">
                    <span>📁 drag_drop_fake_video.mp4</span>
                    <span>READY</span>
                  </div>
                </div>
              )
            },
            {
              step: 2,
              title: isPidgin ? 'Or Paste Video / Image Link' : 'Or Paste Social Link',
              desc: isPidgin
                ? 'Alternatively, paste a video or photo link from TikTok, X (Twitter), YouTube, or Facebook.'
                : 'Paste direct URLs to videos or images circulating on social media.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 2: SOCIAL URL INPUT</span>
                    <span className="text-purple-400">TikTok / X / YouTube</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex justify-between">
                    <span className="truncate text-slate-300">https://tiktok.com/@user/video/7481...</span>
                    <span className="text-purple-400 font-bold">PASTE</span>
                  </div>
                </div>
              )
            },
            {
              step: 3,
              title: isPidgin ? 'Click "Scan Video & Image"' : 'Initiate Forensic Scan',
              desc: isPidgin
                ? 'Our AI engine go extract keyframes, check facial landmark grid, spatial GAN noise, and voice lip-sync.'
                : 'The scanner analyzes spatial GAN pixel anomalies, face-swap borders, temporal frame jumps, and audio spectral biometrics.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>STEP 3: FACIAL MESH & GAN SCANNER</span>
                    <span className="text-purple-400 animate-pulse">Laser Scan Active</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold flex justify-between">
                    <span>⚡ Laser Landmark Spatial GAN Scan</span>
                    <span>SCANNING</span>
                  </div>
                </div>
              )
            },
            {
              step: 4,
              title: isPidgin ? 'View Deepfake Confidence' : 'Inspect Forensic Verdict',
              desc: isPidgin
                ? 'See exact confidence percentage (e.g. 94% Deepfake AI), extracted frame timeline, and synthetic facial mesh.'
                : 'Examine overall risk level, keyframe bounding boxes, spectral frequency analysis, and safety verdict.',
              mockup: (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">94% DEEPFAKE DETECTED</span>
                    <span className="text-purple-400 font-bold">CRITICAL RISK</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="px-1 py-0.5 rounded bg-slate-900 border border-purple-500/40 text-center text-purple-300">Frame #1</span>
                    <span className="px-1 py-0.5 rounded bg-purple-950 border border-purple-400 text-center text-purple-200 font-bold">Frame #2 ✓</span>
                    <span className="px-1 py-0.5 rounded bg-slate-900 border border-purple-500/40 text-center text-purple-300">Frame #3</span>
                  </div>
                </div>
              )
            }
          ]
        };
    }
  };

  const data = getSectionData();
  const currentStepData = data.steps.find((s) => s.step === activeStep) || data.steps[0];

  const modalElement = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto overflow-x-hidden my-auto space-y-5 box-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-40"
          title="Close help modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className={`flex items-center gap-3 pr-8 transition-all duration-500 ${isPlayingDemo ? 'filter blur-[3px] opacity-40 scale-[0.98] pointer-events-none' : 'filter blur-none opacity-100'}`}>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-800 border border-slate-700 shrink-0">
            {data.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase truncate">
                {isPidgin ? 'Interactive Tool Guide' : 'Interactive Tool Guide'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-extrabold text-white leading-tight mt-0.5 truncate">
              {data.title}
            </h2>
            <p className="text-xs text-slate-400 line-clamp-2">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Section Tool Switcher Tabs */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 font-sans transition-all duration-500 ${isPlayingDemo ? 'filter blur-[3px] opacity-40 scale-[0.98] pointer-events-none' : 'filter blur-none opacity-100'}`}>
          {[
            { id: 'verify', label: 'Claim Check', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { id: 'brand_shield', label: 'Brand Shield', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'heatmap', label: 'Geo Map', icon: <MapPin className="w-3.5 h-3.5" /> },
            { id: 'deepfake', label: 'Deepfake AI', icon: <Video className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveSection(t.id as HelpSectionType);
                setActiveStep(1);
                setIsPlayingDemo(false);
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${activeSection === t.id
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              {t.icon}
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Animated Progress Bar & Auto-Play Control Bar */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 z-30 relative shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Step {activeStep} of 4 ({(activeStep / 4) * 100}%)
              {isPlayingDemo && (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 animate-pulse ml-1 hidden sm:inline">
                  FOCUS SPOTLIGHT ACTIVE
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                if (isPlayingDemo) {
                  setIsPlayingDemo(false);
                } else {
                  if (activeStep >= 4) {
                    setActiveStep(1);
                  }
                  setIsPlayingDemo(true);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-lg ${isPlayingDemo
                ? 'bg-rose-500 text-slate-950 border border-rose-400 shadow-rose-500/30 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
            >
              {isPlayingDemo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingDemo ? 'Pause Auto Demo' : '▶ Auto-Play Tutorial Demo'}</span>
            </button>
          </div>

          {/* Total Tutorial Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((activeStep - 1 + stepProgress / 100) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* AI Audio Voice Narrator Box (Replaces Static Screenshot Mockup) */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-xl relative overflow-hidden font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Mic className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  AUDIO VOICE TUTORIAL ASSISTANT
                  {isPlayingDemo && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  )}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {isPlayingDemo ? 'Live voice narrator talking user through demo...' : 'Push Auto-Play Demo to start audio guide'}
                </span>
              </div>
            </div>

            {/* Language & Sound Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVoiceLang('en')}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${voiceLang === 'en'
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('pcm')}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${voiceLang === 'pcm'
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
              >
                🇳🇬 PIDGIN
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`p-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${isMuted
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                title={isMuted ? 'Unmute Audio Voice Guide' : 'Mute Audio Voice Guide'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Voice Narrator Transcript Box */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            {/* Audio Wave animation indicator */}
            <div className="flex items-end gap-1 h-6 shrink-0 pt-1">
              <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlayingDemo ? 'animate-audio-wave-1 h-4' : 'h-2'}`} />
              <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlayingDemo ? 'animate-audio-wave-2 h-6' : 'h-3'}`} />
              <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlayingDemo ? 'animate-audio-wave-3 h-5' : 'h-2'}`} />
              <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlayingDemo ? 'animate-audio-wave-4 h-6' : 'h-4'}`} />
            </div>

            <div className="space-y-0.5 text-xs">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                🎙️ Voice Narrator Speaking (Step {currentStepData.step} of 4):
              </span>
              <p className="text-white font-medium italic leading-relaxed text-[11.5px]">
                "{currentStepData.title}: {currentStepData.desc}"
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Step Cards */}
        <div className="space-y-3">
          <h3 className={`text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider transition-all duration-500 ${isPlayingDemo ? 'filter blur-[2px] opacity-60' : ''}`}>
            {isPidgin ? 'Click any step to inspect details:' : 'Click any step to inspect details:'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.steps.map((s) => {
              const isActive = activeStep === s.step;
              const isOtherAndPlaying = isPlayingDemo && !isActive;

              return (
                <div
                  key={s.step}
                  ref={(el) => { stepCardRefs.current[s.step] = el; }}
                  onClick={() => {
                    setActiveStep(s.step);
                    setIsPlayingDemo(false);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden box-border active:scale-95 ${isOtherAndPlaying
                    ? 'filter blur-[3px] opacity-30 scale-[0.97] pointer-events-none bg-slate-950/40 border-slate-800'
                    : isActive
                      ? 'bg-slate-900 border-emerald-400 ring-4 ring-emerald-500/50 shadow-2xl shadow-emerald-500/30 scale-[1.01] sm:scale-[1.02] z-30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 filter blur-none opacity-100'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center border shrink-0 transition-all duration-300 ${isActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black scale-105 sm:scale-110 shadow-lg shadow-emerald-500/50 ring-2 sm:ring-4 ring-emerald-400/40 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                        {s.step}
                      </span>
                      <h4 className="font-bold text-xs text-white font-display truncate">{s.title}</h4>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed sm:pl-7 pl-0 break-words">
                    {s.desc}
                  </p>

                  {/* Step Action Visual Screenshot UI Preview */}
                  {s.mockup && (
                    <div className="pt-1 sm:pl-7 pl-0 w-full overflow-hidden">
                      {s.mockup}
                    </div>
                  )}

                  {/* Individual Live Step Progress Bar (Shown during Auto-Play) */}
                  {isActive && isPlayingDemo && (
                    <div className="pt-1.5 sm:pl-7 pl-0 space-y-1 w-full overflow-hidden">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300">
                        <span>Step Progress</span>
                        <span>{Math.round(stepProgress)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-emerald-500/30">
                        <div
                          className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 h-full transition-all duration-75"
                          style={{ width: `${stepProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className={`pt-2 border-t border-slate-800 flex justify-end transition-all duration-500 ${isPlayingDemo ? 'filter blur-[3px] opacity-40 pointer-events-none' : 'filter blur-none opacity-100'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isPidgin ? 'Got It! Start Using Tool' : 'Got It! Proceed to Tool'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}


