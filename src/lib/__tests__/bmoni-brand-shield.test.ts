import { describe, it, expect } from 'vitest';
import { createBmoniVirtualAccount, verifyNigerianAccount, tipNewsroom, VERIFIED_NEWSROOM_DESKS } from '../bmoni';
import { verifyClaimWithEvidence } from '../verifier';
import { ExtractedClaim, EvidenceItem } from '@/types';

describe('BMONI Fintech Rails & Newsroom Tipping', () => {
  it('should provision a dedicated BMONI virtual account for Newsroom Pro', async () => {
    const acc = await createBmoniVirtualAccount('newsroom_pro', 'Premium Times Fact Desk');
    expect(acc.accountNumber).toBeDefined();
    expect(acc.accountNumber.length).toBe(10);
    expect(acc.monthlyFeeNGN).toBe(50000);
    expect(acc.bankName).toContain('BMONI');
    expect(acc.status).toBe('ACTIVE');
  });

  it('should provision an Enterprise Brand Shield virtual account with higher tier limits', async () => {
    const acc = await createBmoniVirtualAccount('enterprise_shield', 'Access Bank PR');
    expect(acc.monthlyFeeNGN).toBe(250000);
    expect(acc.tier).toBe('enterprise_shield');
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

  it('should settle a tip to an accredited newsroom desk', async () => {
    const res = await tipNewsroom('premium-times', 2500, 'Anonymous Fact-Checker');
    expect(res.success).toBe(true);
    expect(res.reference).toContain('BMONI-TIP');
    expect(res.amountNGN).toBe(2500);
    expect(res.newsroom).toBe(VERIFIED_NEWSROOM_DESKS['premium-times'].name);
  });
});

describe('Satire & Parody 5th Verdict Classification', () => {
  it('should classify parody / humor content as SATIRE_PARODY', () => {
    const claim: ExtractedClaim = {
      normalizedClaim: 'President Tinubu appoints speed darlington as minister of cruise',
      entity: 'Bola Tinubu',
      category: 'elections_politics',
      rawText: 'Just cruise and comedy skit by parody account',
      isSatireOrParody: true
    };

    const evidence: EvidenceItem[] = [];
    const result = verifyClaimWithEvidence(claim, evidence, null, claim.rawText, Date.now());

    expect(result.verdict).toBe('SATIRE_PARODY');
    expect(result.confidence).toBe('HIGH');
    expect(result.pidginExplanation).toContain('cruise');
  });
});
