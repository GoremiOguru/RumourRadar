'use client';

import React, { useState, useRef } from 'react';
import { VerificationResult } from '@/types';
import { 
  Share2, 
  Download, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Flame,
  Send,
  MessageSquare,
  Camera,
  Briefcase,
  Copy,
  ExternalLink
} from 'lucide-react';

interface WhatsAppShareCardProps {
  result: VerificationResult;
}

type SocialPlatform = 'whatsapp' | 'twitter' | 'instagram' | 'linkedin' | 'telegram';

export function WhatsAppShareCard({ result }: WhatsAppShareCardProps) {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('whatsapp');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');

  const getVerdictTheme = () => {
    switch (result.verdict) {
      case 'SUPPORTED':
        return {
          title: 'VERIFIED TRUE',
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500',
          badgeBg: 'bg-emerald-500 text-black',
          textColor: 'text-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
        };
      case 'CONTRADICTED':
        return {
          title: 'FALSE / DEBUNKED',
          bg: 'bg-rose-950/80',
          border: 'border-rose-500',
          badgeBg: 'bg-rose-500 text-white',
          textColor: 'text-rose-400',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />
        };
      case 'MISLEADING':
        return {
          title: 'MISLEADING CONTEXT',
          bg: 'bg-amber-950/80',
          border: 'border-amber-500',
          badgeBg: 'bg-amber-500 text-black',
          textColor: 'text-amber-400',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      case 'SATIRE_PARODY':
        return {
          title: 'SATIRE / PARODY',
          bg: 'bg-purple-950/80',
          border: 'border-purple-500',
          badgeBg: 'bg-purple-500 text-white',
          textColor: 'text-purple-400',
          icon: <Flame className="w-5 h-5 text-purple-400" />
        };
      default:
        return {
          title: 'UNVERIFIED / BREAKING',
          bg: 'bg-slate-900/90',
          border: 'border-slate-600',
          badgeBg: 'bg-slate-600 text-white',
          textColor: 'text-slate-300',
          icon: <HelpCircle className="w-5 h-5 text-slate-300" />
        };
    }
  };

  const theme = getVerdictTheme();

  // Multi-platform formatted text generators
  const getFormattedSocialText = (platform: SocialPlatform): string => {
    const claim = result.extractedClaim.normalizedClaim;
    const verdict = theme.title;
    const conf = `${result.confidenceScore}%`;
    const summary = result.shortExplanation;
    const pidgin = result.pidginExplanation || 'Make una verify claims before una share!';
    const permalink = `https://rumourradar.vercel.app/check/${result.id}`;

    switch (platform) {
      case 'whatsapp':
        return `🚨 *RUMOUR RADAR NIGERIA FACT-CHECK*\n\n` +
          `📌 *CLAIM:* "${claim}"\n` +
          `⚖️ *VERDICT:* ${verdict} (${conf} Confidence)\n\n` +
          `📝 *Summary:* ${summary}\n\n` +
          `🇳🇬 *Pidgin:* ${pidgin}\n\n` +
          `🔍 *Cited Authority:* ${result.evidence[0]?.sourceName || 'Verified Registry'}\n` +
          `🌐 *Read Audit Trail:* ${permalink}`;

      case 'twitter':
        return `🚨 FACT-CHECK [${verdict} - ${conf}]\n\n` +
          `Claim: "${claim.slice(0, 100)}${claim.length > 100 ? '...' : ''}"\n\n` +
          `Verdict: ${summary.slice(0, 120)}...\n\n` +
          `Full evidence breakdown via @RumourRadarNG 👇\n${permalink} #FactCheckNG #RumourRadar`;

      case 'telegram':
        return `🚨 <b>RUMOUR RADAR NIGERIA FACT-CHECK</b>\n\n` +
          `📌 <b>Claim:</b> <i>"${claim}"</i>\n` +
          `⚖️ <b>Verdict:</b> <b>${verdict}</b> (${conf})\n\n` +
          `📝 <b>Findings:</b> ${summary}\n\n` +
          `🔗 <b>Full Evidence Report:</b> ${permalink}`;

      case 'linkedin':
        return `🚨 PUBLIC INFORMATION & VERIFICATION ADVISORY\n\n` +
          `Rumour Radar has evaluated the viral statement:\n"${claim}"\n\n` +
          `Official Finding: ${verdict} (${conf} Evidence Grounding)\n\n` +
          `Analysis: ${summary}\n\n` +
          `Primary Source Verification: ${result.evidence[0]?.sourceName || 'Accredited Authority'}\n\n` +
          `Detailed institutional audit report: ${permalink}\n\n#FactChecking #Disinformation #Nigeria #RumourRadar`;

      case 'instagram':
        return `FACT CHECK: ${verdict} (${conf})\n\nClaim: "${claim}"\n\nSummary: ${summary}\n\n🇳🇬 Naija Pidgin: ${pidgin}\n\n👉 Tap link in bio or visit rumourradar.vercel.app to view verified primary source evidence! #RumourRadar #NigeriaNews #FactCheck`;
    }
  };

  const handleCopyText = () => {
    const text = getFormattedSocialText(activePlatform);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDirectShare = () => {
    const text = getFormattedSocialText(activePlatform);
    const permalink = `https://rumourradar.vercel.app/check/${result.id}`;

    switch (activePlatform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(permalink)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}`, '_blank');
        break;
      case 'instagram':
        handleCopyText();
        break;
    }
  };

  // Helper function to draw rounded rectangles
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor?: string,
    strokeColor?: string,
    lineWidth?: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor && lineWidth) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  // Robust multi-line text wrapping helper with truncation
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let linesDrawn = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        if (linesDrawn === maxLines - 1) {
          // Truncate last line with ellipsis
          let truncated = line;
          while (ctx.measureText(`${truncated}...`).width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
          }
          ctx.fillText(`${truncated}...`, x, currentY);
          return currentY + lineHeight;
        }

        ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
        linesDrawn++;
      } else {
        line = testLine;
      }
    }

    if (line && linesDrawn < maxLines) {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }

    return currentY;
  };

  // High-Resolution 1080p Canvas Graphic Generator for Instagram / Social Media
  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isStory = aspectRatio === '9:16';
      canvas.width = 1080;
      canvas.height = isStory ? 1920 : 1080;

      // Premium Dark Mesh Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.4, '#0B132B');
      bgGrad.addColorStop(0.8, '#060D1E');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, canvas.height);

      // Radial Ambient Glow
      const glowGrad = ctx.createRadialGradient(540, 300, 50, 540, 300, 600);
      glowGrad.addColorStop(0, result.verdict === 'SUPPORTED' ? 'rgba(16, 185, 129, 0.12)' : result.verdict === 'CONTRADICTED' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1080, canvas.height);

      // Outer Decorative Card Border
      const themeColor = result.verdict === 'SUPPORTED' ? '#10B981' : 
                         result.verdict === 'CONTRADICTED' ? '#EF4444' : 
                         result.verdict === 'SATIRE_PARODY' ? '#A855F7' : '#F59E0B';
      
      drawRoundedRect(ctx, 40, 40, 1000, canvas.height - 80, 28, '#0B1120', themeColor, 6);

      // Top Header Row
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('📡 RUMOUR RADAR NIGERIA', 80, 115);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 20px monospace';
      ctx.fillText('OFFICIAL AI FACT-CHECK & CITIZEN INTELLIGENCE CARD', 80, 150);

      // Header Tag Pill on Right
      drawRoundedRect(ctx, 740, 85, 260, 44, 12, 'rgba(16, 185, 129, 0.15)', '#10B981', 1.5);
      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🇳🇬 Verified NG Rail', 775, 113);

      // Verdict Banner
      const bannerY = 185;
      const bannerHeight = 100;
      drawRoundedRect(ctx, 80, bannerY, 920, bannerHeight, 18, themeColor);

      ctx.fillStyle = result.verdict === 'CONTRADICTED' || result.verdict === 'SATIRE_PARODY' ? '#FFFFFF' : '#020617';
      ctx.font = 'black 40px sans-serif';
      ctx.fillText(`VERDICT: ${theme.title}`, 115, bannerY + 62);

      // Confidence Pill on Right of Banner
      drawRoundedRect(ctx, 720, bannerY + 24, 250, 52, 14, '#020617');
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${result.confidenceScore}% Confidence`, 745, bannerY + 58);

      let currentCursorY = 325;

      // 1. Claim Box Section
      const claimBoxY = currentCursorY;
      const claimBoxHeight = isStory ? 230 : 160;
      drawRoundedRect(ctx, 80, claimBoxY, 920, claimBoxHeight, 16, '#0F172A', '#1E293B', 2);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('📌 CLAIM UNDER REVIEW:', 105, claimBoxY + 38);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 26px sans-serif';
      const claimText = `"${result.extractedClaim.normalizedClaim}"`;
      drawWrappedText(ctx, claimText, 105, claimBoxY + 76, 870, 36, isStory ? 4 : 2);

      currentCursorY = claimBoxY + claimBoxHeight + 25;

      // 2. Factual Findings & Evidence Section
      const findingsBoxY = currentCursorY;
      const findingsBoxHeight = isStory ? 340 : 250;
      drawRoundedRect(ctx, 80, findingsBoxY, 920, findingsBoxHeight, 16, '#081225', '#1E293B', 2);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('⚖️ OFFICIAL FACTUAL FINDINGS & EVIDENCE:', 105, findingsBoxY + 38);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '400 24px sans-serif';
      drawWrappedText(ctx, result.shortExplanation, 105, findingsBoxY + 76, 870, 34, isStory ? 7 : 5);

      currentCursorY = findingsBoxY + findingsBoxHeight + 25;

      // 3. Naija Pidgin Summary (for Story or when available)
      if (isStory && result.pidginExplanation) {
        const pidginBoxY = currentCursorY;
        const pidginBoxHeight = 250;
        drawRoundedRect(ctx, 80, pidginBoxY, 920, pidginBoxHeight, 16, 'rgba(6, 78, 59, 0.4)', '#059669', 2);

        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('🇳🇬 NAIJA PIDGIN BREAKDOWN:', 105, pidginBoxY + 38);

        ctx.fillStyle = '#ECFDF5';
        ctx.font = '400 24px sans-serif';
        drawWrappedText(ctx, result.pidginExplanation, 105, pidginBoxY + 76, 870, 34, 5);

        currentCursorY = pidginBoxY + pidginBoxHeight + 25;
      }

      // Footer: Source Authority, Verification Link & Watermark
      const footerY = isStory ? 1760 : 960;
      
      // Divider
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, footerY - 45);
      ctx.lineTo(1000, footerY - 45);
      ctx.stroke();

      // Authority Pill
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 22px monospace';
      const sourceName = result.evidence[0]?.sourceName || 'Federal Regulatory Agencies & Accredited Press';
      const cleanSource = sourceName.length > 40 ? `${sourceName.slice(0, 38)}...` : sourceName;
      ctx.fillText(`🔍 CITED AUTHORITY: ${cleanSource}`, 80, footerY);

      // Verified URL & Timestamp
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 20px monospace';
      ctx.fillText(`Verified: ${result.verifiedAt} WAT  •  rumourradar.vercel.app`, 80, footerY + 36);

      // Shield Verification Watermark Pill on Bottom Right
      drawRoundedRect(ctx, 770, footerY - 15, 230, 48, 12, 'rgba(15, 23, 42, 0.9)', '#334155', 1);
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('🛡️ Authenticated Card', 790, footerY + 16);

      // Download trigger
      const link = document.createElement('a');
      link.download = `RumourRadar_Debunk_${result.id}_${aspectRatio.replace(':', 'x')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to export social media debunk card:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-white">
              Universal Social Media Debunk & Share Hub
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            1-Click multi-platform broadcast copy & high-resolution visual debunk graphics.
          </p>
        </div>

        {/* Aspect Ratio Switcher for Image Export */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              aspectRatio === '1:1' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            1:1 Feed Square
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              aspectRatio === '9:16' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            9:16 Story / TikTok
          </button>
        </div>
      </div>

      {/* Social Platform Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActivePlatform('whatsapp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activePlatform === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
          <span>WhatsApp Broadcast</span>
        </button>

        <button
          onClick={() => setActivePlatform('twitter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activePlatform === 'twitter'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="font-mono font-bold text-xs">𝕏</span>
          <span>Twitter / X Thread</span>
        </button>

        <button
          onClick={() => setActivePlatform('telegram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activePlatform === 'telegram'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-blue-200" />
          <span>Telegram</span>
        </button>

        <button
          onClick={() => setActivePlatform('instagram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activePlatform === 'instagram'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-pink-300" />
          <span>Instagram / TikTok</span>
        </button>

        <button
          onClick={() => setActivePlatform('linkedin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activePlatform === 'linkedin'
              ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-200" />
          <span>LinkedIn Advisory</span>
        </button>
      </div>

      {/* Formatted Text Preview Box */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
        {getFormattedSocialText(activePlatform)}
      </div>

      {/* Action Buttons: 1-Click Launch, Copy & 1080p Image Export */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDirectShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Post to {activePlatform === 'whatsapp' ? 'WhatsApp' : activePlatform === 'twitter' ? '𝕏 (Twitter)' : activePlatform === 'telegram' ? 'Telegram' : activePlatform === 'linkedin' ? 'LinkedIn' : 'Instagram'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all active:scale-95"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
        </div>

        <button
          onClick={handleDownloadImage}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>{isGenerating ? 'Generating...' : `Export 1080p ${aspectRatio} Graphic PNG`}</span>
        </button>
      </div>
    </div>
  );
}
