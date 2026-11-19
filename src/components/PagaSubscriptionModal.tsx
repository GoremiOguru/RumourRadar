'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  Check,
  Building,
  Zap,
  ArrowRight,
  Copy,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  Lock,
  Clock,
  Smartphone,
  Wallet,
  RotateCw
} from 'lucide-react';
import { PagaDynamicVirtualAccount, PagaCheckoutSession } from '@/lib/paga';
import { useTranslations } from '@/context/LanguageContext';

interface PagaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: 'newsroom_pro' | 'enterprise_shield';
  onLaunchBrandShield?: (orgName: string) => void;
}

type PaymentRail = 'checkout' | 'virtual_account';
type CheckoutMethod = 'card' | 'ussd' | 'wallet';

export function PagaSubscriptionModal({
  isOpen,
  onClose,
  initialTier = 'newsroom_pro',
  onLaunchBrandShield
}: PagaSubscriptionModalProps) {
  const { t, isPidgin } = useTranslations();
  const [selectedTier, setSelectedTier] = useState<'newsroom_pro' | 'enterprise_shield'>(initialTier);
  const [paymentRail, setPaymentRail] = useState<PaymentRail>('checkout');
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Dynamic Virtual Account State
  const [virtualAccount, setVirtualAccount] = useState<PagaDynamicVirtualAccount | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800); // 30 minutes
  const [isCopied, setIsCopied] = useState(false);

  // Paga Checkout State
  const [checkoutSession, setCheckoutSession] = useState<PagaCheckoutSession | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<CheckoutMethod>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8921 4410');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('834');
  const [ussdBank, setUssdBank] = useState('gtbank');
  const [pagaPhone, setPagaPhone] = useState('0802 345 6789');

  // Success State
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    reference: string;
    amount: number;
    method: string;
  } | null>(null);

  const [mounted, setMounted] = useState(false);

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

  // 30-minute dynamic account countdown timer
  useEffect(() => {
    if (!virtualAccount || isPaymentSuccess) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [virtualAccount, isPaymentSuccess]);

  if (!isOpen || !mounted) return null;

  const currentFee = selectedTier === 'enterprise_shield' ? 250000 : 50000;
  const currentTierName = selectedTier === 'enterprise_shield' ? 'Enterprise Brand Shield' : 'Newsroom Pro';

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivateSubscription = (reference: string, methodLabel: string) => {
    const targetOrg = orgName.trim() || 'Newsroom Partner';
    if (typeof window !== 'undefined') {
      localStorage.setItem('truetalk_plus_active', 'true');
      localStorage.setItem('truetalk_org_name', targetOrg);
      localStorage.setItem('truetalk_tier', selectedTier);
      localStorage.setItem('truetalk_payment_ref', reference);
      window.dispatchEvent(new Event('truetalk_plus_updated'));
    }
    setSuccessReceipt({
      reference,
      amount: currentFee,
      method: methodLabel
    });
    setIsPaymentSuccess(true);
  };

  // Submit Handler: Triggers either Paga Checkout or Dynamic Virtual Account creation
  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    setIsLoading(true);

    if (paymentRail === 'checkout') {
      try {
        const res = await fetch('/api/paga/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: selectedTier,
            orgName: orgName.trim(),
            customerEmail: contactEmail.trim()
          })
        });
        const data = await res.json();
        if (data.checkoutSession) {
          setCheckoutSession(data.checkoutSession);
        }
      } catch (err) {
        console.error('Failed to initialize checkout session:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Dynamic Virtual Account creation
      try {
        const res = await fetch('/api/paga/virtual-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: selectedTier,
            orgName: orgName.trim(),
            customerEmail: contactEmail.trim()
          })
        });
        const data = await res.json();
        if (data.virtualAccount) {
          setVirtualAccount(data.virtualAccount);
          setTimeLeftSeconds(1800);
        }
      } catch (err) {
        console.error('Failed to provision dynamic virtual account:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Verify Virtual Account Transfer
  const handleVerifyVirtualAccountTransfer = async () => {
    if (!virtualAccount) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/paga/virtual-account?reference=${encodeURIComponent(virtualAccount.reference)}`);
      const data = await res.json();
      if (data.success) {
        handleActivateSubscription(virtualAccount.reference, 'Paga Dynamic NUBAN Transfer');
      }
    } catch (err) {
      console.error('Verification error:', err);
      handleActivateSubscription(virtualAccount.reference, 'Paga Dynamic NUBAN Transfer');
    } finally {
      setIsVerifying(false);
    }
  };

  // Authorize Paga Checkout (Card / USSD / Wallet)
  const handleAuthorizeCheckout = async () => {
    if (!checkoutSession) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/paga/checkout?reference=${encodeURIComponent(checkoutSession.transactionReference)}`);
      const data = await res.json();
      if (data.success) {
        const methodDesc =
          checkoutMethod === 'card'
            ? 'Paga Debit Card'
            : checkoutMethod === 'ussd'
            ? 'Paga USSD Bank Rail'
            : 'Paga Wallet';
        handleActivateSubscription(checkoutSession.transactionReference, methodDesc);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      handleActivateSubscription(checkoutSession.transactionReference, 'Paga Checkout');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyAccount = () => {
    if (!virtualAccount) return;
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleLaunchBrandShield = () => {
    const targetOrg = orgName.trim() || 'Verified Partner';
    if (onLaunchBrandShield && targetOrg) {
      onLaunchBrandShield(targetOrg);
    }
    onClose();
  };

  const modalElement = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-[min(94vw,620px)] max-h-[92dvh] overflow-y-auto rounded-[22px] sm:rounded-[26px] border border-white/80 shadow-[0_20px_50px_-12px_rgba(0,91,156,0.25)] p-5 sm:p-7 space-y-4 sm:space-y-5 text-[#0b2540] animate-in zoom-in-95 duration-250 scrollbar-none"
        style={{
          background: `
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.95), transparent 55%),
            radial-gradient(circle at 80% 10%, rgba(255,236,230,0.35), transparent 50%),
            linear-gradient(180deg, #f4f8fc 0%, #e3eef8 45%, #cfe2f3 75%, #b9d3ec 100%)
          `
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Round Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/75 hover:bg-white text-[#0b2540] shadow-2xs hover:shadow flex items-center justify-center hover:rotate-90 transition-all duration-200 focus:outline-none z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Paintbrush Crown on 'Plus' */}
        <div className="title-with-crown space-y-1 pr-8 pt-1">
          <h3 className="text-xl sm:text-[24px] font-bold tracking-tight text-[#0b2540] flex items-center flex-wrap gap-1.5 leading-snug">
            <span>{t('plusPopup.titlePrefix')}</span>
            <span className="paintbrush-crown-container font-extrabold text-[#005b9c]">
              {t('plusPopup.titleHighlight')}
              <svg
                viewBox="0 0 36 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="paintbrush-crown"
                aria-hidden="true"
              >
                <path d="M 3 24 C 12 25.5 24 25 33 23.5" stroke="#E5A800" strokeWidth="2.8" strokeLinecap="round" />
                <path
                  d="M 4 23 L 6 9 L 14 17 L 18 4 L 22 17 L 30 9 L 32 23"
                  stroke="#FFC93C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M 7 11 L 13 16" stroke="#FFE27A" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 18 6 L 21 16" stroke="#FFE27A" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 29 11 L 23 16" stroke="#FFE27A" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="6" cy="7" r="1.5" fill="#FFE27A" />
                <circle cx="18" cy="3" r="1.8" fill="#FFE27A" />
                <circle cx="30" cy="7" r="1.5" fill="#FFE27A" />
              </svg>
            </span>
          </h3>
          <p className="text-xs sm:text-[13px] text-[#4a6076] leading-relaxed">
            {t('plusPopup.subtitle')}
          </p>
        </div>

        {/* ================================================================= */}
        {/* CASE 1: SUCCESSFUL ACTIVATION RECEIPT                             */}
        {/* ================================================================= */}
        {isPaymentSuccess && successReceipt ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 rounded-[20px] bg-white border border-emerald-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0b2540]">
                  {t('plusPopup.paymentSuccess')}
                </h4>
                <p className="text-xs text-[#4a6076] mt-0.5">
                  {t('plusPopup.paymentSuccessDesc')}
                </p>
              </div>

              <div className="p-3 bg-[#f8fbfe] rounded-xl border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4a6076]">Subscribed Tier:</span>
                  <span className="font-bold text-[#005b9c]">{currentTierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6076]">Amount Settled:</span>
                  <span className="font-bold text-[#0b2540]">₦{successReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6076]">Payment Rail:</span>
                  <span className="font-semibold text-emerald-700">{successReceipt.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6076]">Paga Transaction Ref:</span>
                  <span className="font-mono text-[11px] text-slate-600">{successReceipt.reference}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={handleLaunchBrandShield}
                className="flex-1 h-12 rounded-[14px] bg-[#005b9c] hover:bg-[#00477e] text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Brand Shield Sentinel</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 h-12 rounded-[14px] border border-slate-300 bg-white/80 text-slate-700 hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('plusPopup.close')}
              </button>
            </div>
          </div>
        ) : checkoutSession ? (
          /* ================================================================= */
          /* CASE 2: PAGA CHECKOUT GATEWAY INTERFACE                           */
          /* ================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-[20px] bg-white border border-[#005b9c]/25 shadow-md overflow-hidden">
              {/* Paga Checkout Header */}
              <div className="bg-[#005b9c] px-4 py-3 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-white text-[#005b9c] font-black text-xs flex items-center justify-center">
                    p
                  </div>
                  <span className="font-bold text-sm tracking-tight">{t('plusPopup.checkoutTitle')}</span>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  ₦{checkoutSession.amountNGN.toLocaleString()}
                </span>
              </div>

              {/* Checkout Method Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('card')}
                  className={`py-2.5 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                    checkoutMethod === 'card'
                      ? 'bg-white text-[#005b9c] border-b-2 border-[#005b9c] font-bold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('ussd')}
                  className={`py-2.5 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                    checkoutMethod === 'ussd'
                      ? 'bg-white text-[#005b9c] border-b-2 border-[#005b9c] font-bold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>USSD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('wallet')}
                  className={`py-2.5 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                    checkoutMethod === 'wallet'
                      ? 'bg-white text-[#005b9c] border-b-2 border-[#005b9c] font-bold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Paga Wallet</span>
                </button>
              </div>

              {/* Payment Details Form */}
              <div className="p-4 space-y-3.5">
                {checkoutMethod === 'card' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        CARD NUMBER (MASTERCARD / VISA / VERVE)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:border-[#005b9c] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">EXPIRY</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:border-[#005b9c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:border-[#005b9c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutMethod === 'ussd' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-500">CHOOSE YOUR BANK FOR USSD</label>
                    <select
                      value={ussdBank}
                      onChange={(e) => setUssdBank(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:border-[#005b9c] focus:outline-none bg-white"
                    >
                      <option value="gtbank">Guaranty Trust Bank (*737*50*...#)</option>
                      <option value="zenith">Zenith Bank (*966*00*...#)</option>
                      <option value="access">Access Bank (*901*00*...#)</option>
                      <option value="uba">United Bank for Africa (*919*00*...#)</option>
                    </select>
                    <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-[#005b9c]">
                      Dial code generated: <strong>*737*50*50000*8192#</strong> from your registered banking SIM.
                    </div>
                  </div>
                )}

                {checkoutMethod === 'wallet' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-500">PAGA PHONE NUMBER</label>
                    <input
                      type="text"
                      value={pagaPhone}
                      onChange={(e) => setPagaPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:border-[#005b9c] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#4a6076]">
                      Enter your Paga registered phone number to authorize with your 4-digit security PIN.
                    </p>
                  </div>
                )}

                {/* Authorize Action Button */}
                <button
                  type="button"
                  onClick={handleAuthorizeCheckout}
                  disabled={isVerifying}
                  className="w-full h-11 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
                >
                  {isVerifying ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Contacting Paga Rails...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Payment of ₦{checkoutSession.amountNGN.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Ref: {checkoutSession.transactionReference}</span>
                <span>🔒 256-Bit Paga Secure</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutSession(null)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Plan Options
            </button>
          </div>
        ) : virtualAccount ? (
          /* ================================================================= */
          /* CASE 3: PAGA DYNAMIC VIRTUAL ACCOUNT (DEDICATED NUBAN)            */
          /* ================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-[18px] bg-white/85 border border-[#005b9c]/25 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-[#005b9c] font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>{t('plusPopup.accountTitle')}</span>
                </div>
                {/* 30-min countdown badge */}
                <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-bold">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{t('plusPopup.expiresIn')}: {formatCountdown(timeLeftSeconds)}</span>
                </div>
              </div>

              {/* Dynamic Account Card */}
              <div className="p-3.5 bg-white rounded-[14px] border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[10px] text-[#4a6076] font-mono uppercase tracking-wider">
                    {t('plusPopup.accountNumber')}
                  </span>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-[#0b2540] tracking-wider mt-0.5">
                    {virtualAccount.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 rounded-lg bg-[#e6f1f8] hover:bg-[#d9ecfa] text-[#005b9c] text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? t('plusPopup.copied') : t('plusPopup.copyAccount')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#4a6076]">
                <div>
                  <span className="text-slate-400 text-[11px]">{t('plusPopup.bankName')}:</span>
                  <p className="font-semibold text-[#0b2540]">{virtualAccount.bankName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">{t('plusPopup.accountName')}:</span>
                  <p className="font-semibold text-[#0b2540] truncate">{virtualAccount.accountHolderName}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">Amount Due:</span>
                <span className="font-bold text-sm text-[#005b9c]">₦{virtualAccount.amountNGN.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-white text-xs text-[#005b9c] leading-relaxed flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>
                <strong>Live Listener Active:</strong> {t('plusPopup.instructions')}
              </span>
            </div>

            {/* Confirm Transfer Button */}
            <button
              type="button"
              onClick={handleVerifyVirtualAccountTransfer}
              disabled={isVerifying}
              className="w-full h-11 rounded-[14px] bg-[#005b9c] hover:bg-[#00477e] text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Checking Paga Transfer...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('plusPopup.confirmTransfer')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setVirtualAccount(null)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Plan Options
            </button>
          </div>
        ) : (
          /* ================================================================= */
          /* CASE 4: STEP 1 - PLAN SELECTION & PAYMENT RAIL CHOOSER            */
          /* ================================================================= */
          <form onSubmit={handleProceedPayment} className="space-y-4 sm:space-y-5">
            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 items-stretch">
              {/* Plan 1: Newsroom Pro */}
              <div
                onClick={() => setSelectedTier('newsroom_pro')}
                className={`relative flex flex-col justify-between rounded-[20px] p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
                  selectedTier === 'newsroom_pro'
                    ? 'bg-[#0b2a4a] text-white shadow-lg shadow-[#005b9c]/25 border border-[#2786d1]/40 sm:scale-[1.01] z-10'
                    : 'bg-white/55 backdrop-blur-md border border-white/75 text-[#0b2540] hover:bg-white/70 shadow-2xs'
                }`}
              >
                {selectedTier === 'newsroom_pro' && (
                  <span className="absolute top-3.5 right-3.5 bg-white/16 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                    {t('plusPopup.mostPopular')}
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight">{t('plusPopup.plan1Price')}</span>
                    <span className={`text-xs ${selectedTier === 'newsroom_pro' ? 'text-white/70' : 'text-[#4a6076]'}`}>
                      {t('plusPopup.plan1Period')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm sm:text-base">{t('plusPopup.plan1Title')}</span>
                      <Zap className={`w-3.5 h-3.5 ${selectedTier === 'newsroom_pro' ? 'text-[#a3d3fc]' : 'text-[#005b9c]'}`} />
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-snug ${selectedTier === 'newsroom_pro' ? 'text-white/75' : 'text-[#4a6076]'}`}>
                      {t('plusPopup.plan1Desc')}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-current/15 text-[11px] sm:text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'newsroom_pro' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan1Feature1')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'newsroom_pro' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan1Feature2')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'newsroom_pro' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan1Feature3')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier('newsroom_pro');
                    }}
                    className={`w-full py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                      selectedTier === 'newsroom_pro'
                        ? 'bg-[#2a8be0] hover:bg-[#1f7ccf] text-white shadow-xs'
                        : 'bg-[#6b7f95] hover:bg-[#5b6f85] text-white'
                    }`}
                  >
                    {selectedTier === 'newsroom_pro' ? t('plusPopup.selected') : t('plusPopup.selectPlan')}
                  </button>
                </div>
              </div>

              {/* Plan 2: Brand Shield */}
              <div
                onClick={() => setSelectedTier('enterprise_shield')}
                className={`relative flex flex-col justify-between rounded-[20px] p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
                  selectedTier === 'enterprise_shield'
                    ? 'bg-[#0b2a4a] text-white shadow-lg shadow-[#005b9c]/25 border border-[#2786d1]/40 sm:scale-[1.01] z-10'
                    : 'bg-white/55 backdrop-blur-md border border-white/75 text-[#0b2540] hover:bg-white/70 shadow-2xs'
                }`}
              >
                {selectedTier === 'enterprise_shield' && (
                  <span className="absolute top-3.5 right-3.5 bg-white/16 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                    {t('plusPopup.selected')}
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight">{t('plusPopup.plan2Price')}</span>
                    <span className={`text-xs ${selectedTier === 'enterprise_shield' ? 'text-white/70' : 'text-[#4a6076]'}`}>
                      {t('plusPopup.plan2Period')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm sm:text-base">{t('plusPopup.plan2Title')}</span>
                      <Building className={`w-3.5 h-3.5 ${selectedTier === 'enterprise_shield' ? 'text-[#a3d3fc]' : 'text-[#005b9c]'}`} />
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-snug ${selectedTier === 'enterprise_shield' ? 'text-white/75' : 'text-[#4a6076]'}`}>
                      {t('plusPopup.plan2Desc')}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-current/15 text-[11px] sm:text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'enterprise_shield' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan2Feature1')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'enterprise_shield' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan2Feature2')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedTier === 'enterprise_shield' ? 'bg-white/20 text-white' : 'bg-[#e6f1f8] text-[#005b9c]'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="leading-tight">{t('plusPopup.plan2Feature3')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier('enterprise_shield');
                    }}
                    className={`w-full py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                      selectedTier === 'enterprise_shield'
                        ? 'bg-[#2a8be0] hover:bg-[#1f7ccf] text-white shadow-xs'
                        : 'bg-[#6b7f95] hover:bg-[#5b6f85] text-white'
                    }`}
                  >
                    {selectedTier === 'enterprise_shield' ? t('plusPopup.selected') : t('plusPopup.selectPlan')}
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs: Brand Name & Email */}
            <div className="space-y-2.5 pt-0.5">
              <div>
                <label className="block text-[13px] font-medium text-[#0b2540] mb-1">
                  {t('plusPopup.labelBrandName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('plusPopup.placeholderBrandName')}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-[14px] bg-white border border-[#005b9c]/20 text-sm text-[#0b2540] placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-[#005b9c]/15 focus:border-[#005b9c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0b2540] mb-1">
                  {t('plusPopup.labelEmail')}
                </label>
                <input
                  type="email"
                  placeholder={t('plusPopup.placeholderEmail')}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-[14px] bg-white border border-[#005b9c]/20 text-sm text-[#0b2540] placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-[#005b9c]/15 focus:border-[#005b9c] transition-all"
                />
              </div>
            </div>

            {/* Dual Payment Rail Selector: Paga Checkout vs Dynamic Virtual Account */}
            <div className="space-y-2 pt-1">
              <label className="block text-[12px] font-semibold text-[#005b9c] uppercase tracking-wider">
                Select Paga Payment Rail
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Rail 1: Paga Checkout */}
                <div
                  onClick={() => setPaymentRail('checkout')}
                  className={`p-3 rounded-[16px] border cursor-pointer transition-all flex items-start space-x-2.5 ${
                    paymentRail === 'checkout'
                      ? 'bg-white border-[#005b9c] shadow-sm ring-2 ring-[#005b9c]/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${paymentRail === 'checkout' ? 'bg-[#e6f1f8] text-[#005b9c]' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-[#0b2540]">Paga Checkout</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4a6076] leading-tight mt-0.5">
                      Cards, USSD (*737#), Paga Wallet & Bank
                    </p>
                  </div>
                </div>

                {/* Rail 2: Dynamic Virtual Account */}
                <div
                  onClick={() => setPaymentRail('virtual_account')}
                  className={`p-3 rounded-[16px] border cursor-pointer transition-all flex items-start space-x-2.5 ${
                    paymentRail === 'virtual_account'
                      ? 'bg-white border-[#005b9c] shadow-sm ring-2 ring-[#005b9c]/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${paymentRail === 'virtual_account' ? 'bg-[#e6f1f8] text-[#005b9c]' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-[#0b2540]">Dynamic NUBAN</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded-full">
                        Auto-Match
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4a6076] leading-tight mt-0.5">
                      Dedicated 30-min bank transfer account
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading || !orgName.trim()}
              className="group w-full h-12 rounded-[14px] bg-[#005b9c] hover:bg-[#00477e] text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>{paymentRail === 'checkout' ? 'Opening Paga Checkout...' : t('plusPopup.btnGenerating')}</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentRail === 'checkout'
                      ? t('plusPopup.btnProceedCheckout')
                      : t('plusPopup.btnGenerate')}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}

export const BmoniSubscriptionModal = PagaSubscriptionModal;
