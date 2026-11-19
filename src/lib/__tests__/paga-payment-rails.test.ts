import { describe, it, expect } from 'vitest';
import {
  createPagaDynamicVirtualAccount,
  verifyPagaVirtualAccountPayment,
  createPagaCheckoutSession,
  verifyPagaCheckoutPayment,
  generatePagaHash,
  verifyPagaWebhookSignature,
  verifyNigerianAccount,
  checkPaymentRedFlag
} from '../paga';
import { verifyClaimWithEvidence } from '../verifier';
import { ExtractedClaim, EvidenceItem } from '@/types';

describe('Paga Payment Rails: Checkout & Dynamic Virtual Accounts', () => {
  it('should provision a dedicated Paga Dynamic Virtual Account for Newsroom Pro (₦50,000)', async () => {
    const acc = await createPagaDynamicVirtualAccount('newsroom_pro', 'Premium Times Fact Desk');
    expect(acc.accountNumber).toBeDefined();
    expect(acc.accountNumber.length).toBe(10);
    expect(acc.amountNGN).toBe(50000);
    expect(acc.monthlyFeeNGN).toBe(50000);
    expect(acc.bankName).toContain('Paga');
    expect(acc.reference).toContain('TT-PAGA-DVA-');
  });

  it('should provision an Enterprise Brand Shield dynamic virtual account with higher tier limits (₦250,000)', async () => {
    const acc = await createPagaDynamicVirtualAccount('enterprise_shield', 'Access Bank PR');
    expect(acc.amountNGN).toBe(250000);
    expect(acc.monthlyFeeNGN).toBe(250000);
    expect(acc.tier).toBe('enterprise_shield');
  });

  it('should verify payment settlement for a dynamic virtual account', async () => {
    const acc = await createPagaDynamicVirtualAccount('newsroom_pro', 'TheCable Fact Desk');
    const result = await verifyPagaVirtualAccountPayment(acc.reference);
    expect(result.success).toBe(true);
    expect(result.status).toBe('ACTIVE');
    expect(result.amountNGN).toBe(50000);
  });

  it('should initialize a Paga Checkout session with multi-payment methods (Cards, USSD, Wallet)', async () => {
    const session = await createPagaCheckoutSession(
      'newsroom_pro',
      'Channels TV Newsroom',
      'billing@channelstv.com'
    );
    expect(session.checkoutToken).toBeDefined();
    expect(session.transactionReference).toContain('TT-PAGA-CHK-');
    expect(session.amountNGN).toBe(50000);
    expect(session.paymentMethods).toContain('CARD');
    expect(session.paymentMethods).toContain('USSD');
    expect(session.paymentMethods).toContain('PAGA_WALLET');
    expect(session.pagaHash).toBeDefined();
    expect(session.status).toBe('INITIALIZED');
  });

  it('should verify payment completion for a Paga Checkout transaction', async () => {
    const session = await createPagaCheckoutSession(
      'enterprise_shield',
      'Zenith Bank PR',
      'pr@zenithbank.com'
    );
    const verification = await verifyPagaCheckoutPayment(session.transactionReference);
    expect(verification.success).toBe(true);
    expect(verification.status).toBe('SUCCESS');
    expect(verification.amountNGN).toBe(250000);
  });

  it('should compute valid SHA-512 hashes and verify webhook signatures', () => {
    const data = 'TT-PAGA-1234550000NGNpaga_mch_truetalk_2026';
    const hash = generatePagaHash(data);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(128); // 128 hex chars for SHA-512
    expect(verifyPagaWebhookSignature(data, hash)).toBe(true);
    expect(verifyPagaWebhookSignature(data, 'invalid_signature_xyz')).toBe(false);
  });

  it('should verify a valid 10-digit Nigerian bank account', async () => {
    const res = await verifyNigerianAccount('0123456789', '058');
    expect(res.success).toBe(true);
    expect(res.bankName).toContain('Guaranty Trust Bank');
  });

  it('should reject invalid bank account numbers', async () => {
    const res = await verifyNigerianAccount('123', '058');
    expect(res.success).toBe(false);
  });

  it('should detect NUBAN payment scam details and flag a payment mismatch', async () => {
    const scamText = 'FG PALLIATIVE ALERT: Pay N5,000 fee to GTBank 0581928374 (Federal Govt) for N50,000 grant';
    const result = await checkPaymentRedFlag(scamText);

    expect(result).not.toBeNull();
    expect(result?.detectedNuban).toBe('0581928374');
    expect(result?.detectedBank).toContain('Guaranty Trust Bank');
    expect(['ACCOUNT_VERIFIED_MISMATCH', 'ACCOUNT_NOT_FOUND']).toContain(result?.status);
    expect(result?.riskScore).toBeGreaterThan(80);
  });
});

describe('Satire & Parody 5th Verdict Classification', () => {
  it('should classify parody / humor content as SATIRE_PARODY', async () => {
    const satireClaim: ExtractedClaim = {
      rawText: 'President Tinubu appoints Wizkid as the new CBN governor of Afrobeats',
      normalizedClaim: 'President Bola Ahmed Tinubu has appointed musical artist Wizkid as the Central Bank of Nigeria Governor in charge of Afrobeats',
      entity: 'CBN',
      category: 'banking_fintech',
      isSatireOrParody: true
    };

    const evidence: EvidenceItem[] = [
      {
        id: 'ev-satire-1',
        url: 'https://theonion.com/nigeria-wizkid-cbn',
        title: 'Tinubu appoints Wizkid as minister of good vibes — Satire Gazette',
        snippet: 'This is a satirical parody piece for amusement purposes only. No official appointment was made.',
        domain: 'theonion.com',
        sourceName: 'The Satire Times',
        score: 95,
        authorityScore: 70,
        relevanceScore: 95,
        recencyScore: 90,
        corroborationScore: 80,
        isOfficialAuthority: false,
        publishedDate: '2026-03-01'
      }
    ];

    const verdict = await verifyClaimWithEvidence(satireClaim, evidence, null, satireClaim.rawText, Date.now());
    expect(verdict.verdict).toBe('SATIRE_PARODY');
    expect(verdict.confidence).toBe('HIGH');
  });
});
