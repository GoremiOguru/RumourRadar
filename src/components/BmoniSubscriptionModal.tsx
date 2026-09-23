'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, ShieldCheck, Check, Sparkles, Building, Zap, ArrowRight, Copy, CheckCircle2, X } from 'lucide-react';
import { BmoniVirtualAccount } from '@/types';

interface BmoniSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: 'newsroom_pro' | 'enterprise_shield';
}

export function BmoniSubscriptionModal({ isOpen, onClose, initialTier = 'newsroom_pro' }: BmoniSubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<'newsroom_pro' | 'enterprise_shield'>(initialTier);
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<BmoniVirtualAccount | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">BMONI Institutional Rails</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Upgrade to RumourRadar Pro
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Subscribe via an instant <strong>BMONI NGN Virtual Bank Account</strong>. Transfer directly from your Nigerian banking app (GTBank, Access, Kuda, Zenith) for instant provisioning.
            </p>

            {/* Tier Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setSelectedTier('newsroom_pro')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTier === 'newsroom_pro'
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
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTier === 'enterprise_shield'
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
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
              >
                <Zap className="w-4 h-4" />
                <span>{isLoading ? 'Generating BMONI Virtual Account...' : 'Generate BMONI NGN Deposit Account'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-center text-white mb-1">
              BMONI Virtual Account Created!
            </h3>
            <p className="text-xs text-center text-slate-400 mb-5">
              Make a transfer of <strong>₦{virtualAccount.monthlyFeeNGN.toLocaleString()}</strong> to the dedicated account details below to activate your tier instantly.
            </p>

            <div className="p-5 rounded-xl bg-slate-800 border border-emerald-500/40 space-y-3 mb-6 relative">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-xs text-slate-400">Account Bank</span>
                <span className="text-xs font-bold text-white">{virtualAccount.bankName}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-xs text-slate-400">Account Name</span>
                <span className="text-xs font-bold text-white">{virtualAccount.accountHolderName}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <div className="text-xs text-slate-400">Virtual Account Number</div>
                  <div className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                    {virtualAccount.accountNumber}
                  </div>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-xs font-bold"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900 text-xs text-emerald-300 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>BMONI webhook detects deposits within 10 seconds and automatically deploys your Pro API Key and Crisis Webhook!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Done / Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
