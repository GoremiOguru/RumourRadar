'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HeartHandshake, CheckCircle2, ShieldAlert, Sparkles, Building2, ChevronRight, X } from 'lucide-react';
import { VERIFIED_NEWSROOM_DESKS } from '@/lib/bmoni';
import { BmoniAppDownloadButton } from '@/components/BmoniAppDownloadButton';

interface NewsroomTipButtonProps {
  sourceName?: string;
  domain?: string;
}

export function NewsroomTipButton({ sourceName, domain }: NewsroomTipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [selectedDesk, setSelectedDesk] = useState('premium-times');
  const [donorName, setDonorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settlementResult, setSettlementResult] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deskList = Object.values(VERIFIED_NEWSROOM_DESKS);

  const handleSendTip = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bmoni/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsroomSlug: selectedDesk,
          amountNGN: selectedAmount,
          donorName: donorName.trim() || undefined
        })
      });
      const data = await res.json();
      setSettlementResult(data);
    } catch (e) {
      console.error('Failed to submit tip:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative w-full max-w-md p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!settlementResult ? (
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <HeartHandshake className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">BMONI Ecosystem Rail</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              Support Verified Nigerian Journalism
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Send a micro-grant directly to the accredited Nigerian news desk whose investigative reporting corroborated this check.
            </p>

            {/* Newsroom Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Recipient News Desk:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {deskList.map((desk) => (
                  <div
                    key={desk.slug}
                    onClick={() => setSelectedDesk(desk.slug)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedDesk === desk.slug
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100">{desk.name}</div>
                      <div className="text-[11px] text-emerald-400/90">{desk.badge}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {desk.bankName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Options */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Tip Amount (NGN):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedAmount === amt
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Name */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name / Handle (Optional):
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Concerned Citizen, Chidi, Folake"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Settlement Button */}
            <button
              onClick={handleSendTip}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isSubmitting ? 'Routing via BMONI Rails...' : `Transfer ₦${selectedAmount.toLocaleString()} to Newsroom`}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Transfer Settled via BMONI</h3>
              <p className="text-xs text-slate-400 mt-1">
                {settlementResult.message}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Ref:</span>
                <span className="text-slate-200 font-bold">{settlementResult.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Recipient:</span>
                <span className="text-slate-200">{settlementResult.newsroom}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settled Amount:</span>
                <span className="text-emerald-400 font-bold">₦{settlementResult.amountNGN?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>BMONI Status:</span>
                <span className="text-emerald-400 font-bold">{settlementResult.status}</span>
              </div>
            </div>

            <BmoniAppDownloadButton variant="compact" className="w-full justify-center py-2" />

            <button
              onClick={() => {
                setSettlementResult(null);
                setIsOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => {
          setSettlementResult(null);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95 shrink-0"
      >
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>Support Newsroom (Tip)</span>
      </button>

      {mounted && typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
