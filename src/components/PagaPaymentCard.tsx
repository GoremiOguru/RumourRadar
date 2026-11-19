import React from 'react';
import { PaymentVerificationResult } from '@/types';
import { ShieldAlert, ShieldCheck, CreditCard, Building2, User, AlertTriangle } from 'lucide-react';

interface PagaPaymentCardProps {
  payment: PaymentVerificationResult;
}

export const PagaPaymentCard: React.FC<PagaPaymentCardProps> = ({ payment }) => {
  const isMismatch = payment.status === 'ACCOUNT_VERIFIED_MISMATCH' || payment.status === 'ACCOUNT_NOT_FOUND';
  const isMatch = payment.status === 'ACCOUNT_VERIFIED_MATCH';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
      isMismatch 
        ? 'bg-rose-50/90 border-rose-200 text-rose-950'
        : isMatch
        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        : 'bg-white border-[#D5E7FA] text-[#0C2340]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D5E7FA]">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl border ${
            isMismatch 
              ? 'bg-rose-100 border-rose-300 text-rose-600'
              : 'bg-emerald-100 border-emerald-300 text-emerald-700'
          }`}>
            {isMismatch ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-[#0C2340] tracking-wide font-display">
                Paga Financial Fraud Shield
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#005A9C]/10 text-[#005A9C] border border-[#005A9C]/20 font-bold">
                Paga Rail
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Deterministic CBN/NUBAN Registered Account Verification
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isMismatch ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 border border-rose-300 text-rose-700 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>PAYMENT DETAIL MISMATCH ({payment.riskScore}% Fraud Risk)</span>
            </span>
          ) : isMatch ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACCOUNT VERIFIED MATCH</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#475569] border border-slate-300">
              <span>UNRESOLVED BANK CODE</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid: Extracted Payment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 text-xs">
        {/* NUBAN & Bank */}
        <div className="p-3 rounded-xl bg-white border border-[#D5E7FA] space-y-1 shadow-xs">
          <div className="flex items-center space-x-1.5 text-[#64748B] font-semibold">
            <CreditCard className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Target NUBAN & Bank</span>
          </div>
          <p className="font-mono text-[#0C2340] font-bold text-sm">
            {payment.detectedNuban} <span className="text-[#64748B] font-sans font-medium">({payment.detectedBank})</span>
          </p>
        </div>

        {/* Resolved BVN Account Holder */}
        <div className="p-3 rounded-xl bg-white border border-[#D5E7FA] space-y-1 shadow-xs">
          <div className="flex items-center space-x-1.5 text-[#64748B] font-semibold">
            <User className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Registered Account Holder (Paga Rail)</span>
          </div>
          <p className={`font-semibold font-mono text-xs ${isMismatch ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}`}>
            {payment.actualAccountHolder || 'NOT FOUND IN CBN DIRECTORY'}
          </p>
        </div>
      </div>

      {/* Evidence Explanation Note */}
      <div className="p-3 rounded-xl bg-white/70 border border-[#D5E7FA] text-xs text-[#334155] flex items-start space-x-2">
        <Building2 className="w-4 h-4 text-[#005A9C] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-[#0C2340] font-semibold">Paga Banking Rail Evidence:</strong>
          <p className="text-[#475569] leading-relaxed">{payment.evidenceSummary}</p>
        </div>
      </div>
    </div>
  );
};

export const BmoniPaymentCard = PagaPaymentCard;
