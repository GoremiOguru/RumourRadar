'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, ShieldCheck, Check, Sparkles, Building, Zap, ArrowRight, Copy, CheckCircle2, X } from 'lucide-react';
import { BmoniVirtualAccount } from '@/types';
import { BmoniAppDownloadButton } from '@/components/BmoniAppDownloadButton';

interface BmoniSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: 'newsroom_pro' | 'enterprise_shield';
  onLaunchBrandShield?: (orgName: string) => void;
}

export function BmoniSubscriptionModal({ isOpen, onClose, initialTier = 'newsroom_pro', onLaunchBrandShield }: BmoniSubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<'newsroom_pro' | 'enterprise_shield'>(initialTier);
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<BmoniVirtualAccount | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBmoniDetails, setShowBmoniDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleGenerateVirtualAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/bmoni/virtual-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          orgName: orgName.trim()
        })
      });
      const data = await res.json();
      if (data.virtualAccount) {
        setVirtualAccount(data.virtualAccount);
      }
    } catch (err) {
      console.error('Failed to provision virtual account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccount = () => {
    if (!virtualAccount) return;
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleLaunchBrandShield = () => {
    const targetOrg = orgName.trim() || (virtualAccount ? virtualAccount.accountHolderName.replace('RumourRadar / ', '').trim() : '');
    if (onLaunchBrandShield && targetOrg) {
      onLaunchBrandShield(targetOrg);
    }
    onClose();
  };

  const modalElement = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!virtualAccount ? (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <img
                src="/images/logowhite.jpeg"
                alt="RumourRadar Logo"
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">BMONI Institutional Payment Rails</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Upgrade to RumourRadar Pro
                </h2>
              </div>
            </div>

            {/* Exclusive BMoni Payment Notice & Hackathon Criteria Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/50 space-y-3 mb-6 shadow-lg font-sans">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  EXCLUSIVE PAYMENT CHANNEL: BMONI VIRTUAL ACCOUNTS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hackathon Core Criteria
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>We ONLY bill and accept payments directly through BMoni Virtual NGN Bank Accounts.</strong> Building on BMoni&apos;s financial infrastructure is a foundational requirement for RumourRadar in the BUILDXNACOS &apos;26 Hackathon.
              </p>

              {/* View More / Full Breakdown Collapsible Section */}
              {showBmoniDetails && (
                <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs text-slate-300 animate-in fade-in">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      💡 What is BMoni in Simple Terms?
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      BMoni is a Nigerian financial infrastructure API (like Paystack + BVN identity lookup). It lets apps generate instant NGN bank accounts and verify the real identity behind any Nigerian bank account.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-400 flex items-center gap-1">
                      ⚡ How It Works (10-Second Webhooks)
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Every subscription generates a unique NGN virtual deposit account (Wema/Providus/GTBank). Deposits trigger automated webhooks within 10 seconds to deploy API keys and Brand Shield nodes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 space-y-1">
                      <span className="font-bold text-emerald-300 flex items-center gap-1 text-[11px]">
                        🛡️ What BMoni CAN Detect:
                      </span>
                      <ul className="text-[10px] text-slate-300 space-y-1 list-disc pl-3">
                        <li>Real-name BVN lookup flags fake palliative grant scams (90%+ scam detection).</li>
                        <li>Detects ghost/fake 10-digit NUBAN numbers (`ACCOUNT_NOT_FOUND`).</li>
                        <li>Enforces BVN identity verification for enterprise subscribers.</li>
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 space-y-1">
                      <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                        ⚠️ What BMoni CANNOT Do (Limits):
                      </span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        BMoni operates at the <em>banking & identity layer</em>. It does not analyze rumor text or video deepfakes alone — that is powered by RumourRadar AI.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowBmoniDetails(!showBmoniDetails)}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{showBmoniDetails ? 'Hide Full BMoni Breakdown ▲' : 'View Full BMoni Breakdown & Capabilities ▼'}</span>
              </button>
            </div>

            {/* Download BMoni App Button Banner */}
            <BmoniAppDownloadButton className="mb-6" />

            {/* Tier Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setSelectedTier('newsroom_pro')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTier === 'newsroom_pro'
                    ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  }`}
              >
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Newsrooms & Media
                </div>
                <div className="text-lg font-extrabold text-white">Newsroom Pro</div>
                <div className="text-sm font-bold text-emerald-400 my-1">₦50,000 / mo</div>
                <ul className="text-xs text-slate-300 space-y-1 mt-2">
                  <li>✓ Priority breaking news queue</li>
                  <li>✓ High-throughput API Key</li>
                  <li>✓ Bulk claim verification</li>
                </ul>
              </div>

              <div
                onClick={() => setSelectedTier('enterprise_shield')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTier === 'enterprise_shield'
                    ? 'bg-blue-950/50 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  }`}
              >
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Corporate & Banks
                </div>
                <div className="text-lg font-extrabold text-white">Enterprise Shield</div>
                <div className="text-sm font-bold text-blue-400 my-1">₦250,000 / mo</div>
                <ul className="text-xs text-slate-300 space-y-1 mt-2">
                  <li>✓ Live brand threat surveillance</li>
                  <li>✓ Instant WhatsApp crisis alerts</li>
                  <li>✓ 1-Click AI PR Debunk Kits</li>
                </ul>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleGenerateVirtualAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Organization / Brand Name:
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Access Bank PR Desk, Channels Media, Kuda"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Billing Email:
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="billing@organization.ng"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !orgName.trim()}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 active:scale-95"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>{isLoading ? 'Generating BMONI Virtual Account...' : 'Generate BMONI NGN Deposit Account'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                ⚡ 10-SEC WEBHOOK SETTLED • ACTIVE PRO TIER
              </span>
              <h3 className="text-xl font-bold text-white pt-1">
                BMONI Virtual Account Created!
              </h3>
              <p className="text-xs text-slate-300">
                Payment simulated & verified via BMoni financial rails for <strong>{orgName || virtualAccount.accountHolderName}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 relative shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">Account Bank</span>
                <span className="text-xs font-bold text-emerald-400">{virtualAccount.bankName}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">Account Name</span>
                <span className="text-xs font-bold text-white">{virtualAccount.accountHolderName}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Virtual NGN Account Number</div>
                  <div className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                    {virtualAccount.accountNumber}
                  </div>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-1 flex justify-between items-center text-xs">
                <span className="text-slate-400">Allocated Live API Key:</span>
                <span className="font-mono text-[11px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                  rr_bmoni_live_pk_{virtualAccount.accountNumber}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>BMoni deposit webhook deployed your Brand Shield surveillance node & 100k/mo API key!</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleLaunchBrandShield}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 group"
              >
                <Zap className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>🚀 Launch Brand Shield for "{orgName.trim() || 'Organization'}" →</span>
              </button>

              <button
                onClick={() => setVirtualAccount(null)}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
              >
                🔄 Provision Different Account / Reset Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
