import React from 'react';
import { PaymentVerificationResult } from '@/types';
import { ShieldAlert, ShieldCheck, CreditCard, Building2, User, AlertTriangle, ExternalLink } from 'lucide-react';

interface BmoniPaymentCardProps {
  payment: PaymentVerificationResult;
}

export const BmoniPaymentCard: React.FC<BmoniPaymentCardProps> = ({ payment }) => {
  const isMismatch = payment.status === 'ACCOUNT_VERIFIED_MISMATCH' || payment.status === 'ACCOUNT_NOT_FOUND';
  const isMatch = payment.status === 'ACCOUNT_VERIFIED_MATCH';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
      isMismatch 
        ? 'bg-rose-950/40 border-rose-500/40 shadow-xl shadow-rose-950/20'
        : isMatch
        ? 'bg-emerald-950/40 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl border ${
            isMismatch 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            {isMismatch ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white tracking-wide font-display">
                BMONI Financial Fraud Shield
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                BVN Bank Rail
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic CBN/BVN Registered Account Lookup
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isMismatch ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 border border-rose-500/50 text-rose-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>PAYMENT DETAIL MISMATCH ({payment.riskScore}% Fraud Risk)</span>
            </span>
          ) : isMatch ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/50 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACCOUNT VERIFIED MATCH</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              <span>UNRESOLVED BANK CODE</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid: Extracted Payment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 text-xs">
        {/* NUBAN & Bank */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span>Target NUBAN & Bank</span>
          </div>
          <p className="font-mono text-slate-200 font-bold text-sm">
            {payment.detectedNuban} <span className="text-slate-400 font-sans font-medium">({payment.detectedBank})</span>
          </p>
        </div>

        {/* Resolved BVN Account Holder */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>BVN Registered Holder (BMONI Lookup)</span>
          </div>
          <p className={`font-semibold font-mono text-xs ${isMismatch ? 'text-rose-300 font-bold' : 'text-emerald-300'}`}>
            {payment.actualAccountHolder || 'NOT FOUND IN CBN DIRECTORY'}
          </p>
        </div>
      </div>

      {/* Evidence Explanation Note */}
      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 flex items-start space-x-2">
        <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-200 font-semibold">BMONI Banking Rail Evidence:</strong>
          <p className="text-slate-300 leading-relaxed">{payment.evidenceSummary}</p>
        </div>
      </div>
    </div>
  );
};
