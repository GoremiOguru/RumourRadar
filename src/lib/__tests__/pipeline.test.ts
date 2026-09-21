import { describe, it, expect } from 'vitest';
import { rankEvidence } from '../evidence-ranker';
import { computeClaimHash, getCachedResult, setCachedResult } from '../cache';
import { extractUrlFromText } from '../url-scraper';
import { verifyClaimWithEvidence } from '../verifier';
import { EvidenceItem, ExtractedClaim } from '@/types';

describe('1. Mathematical Evidence Ranking Formula (30/25/20/15/10)', () => {
  it('correctly scores evidence using 0.30*Auth + 0.25*Rel + 0.20*Rec + 0.15*Corr + 0.10*Ctx', () => {
    const mockEvidence: EvidenceItem[] = [
      {
        id: 'ev-test-1',
        title: 'Official CBN Regulatory Gazette',
        snippet: 'Central Bank of Nigeria issues directive affirming licensed fintech status with full consumer deposit protection.',
        url: 'https://cbn.gov.ng/gazette.pdf',
        domain: 'cbn.gov.ng',
        sourceName: 'Central Bank of Nigeria',
        isOfficialAuthority: true,
        score: 0,
        authorityScore: 100,
        relevanceScore: 100,
        recencyScore: 100,
        corroborationScore: 100
      }
    ];

    const keywords = ['cbn', 'fintech', 'licensed', 'directive'];
    const ranked = rankEvidence(mockEvidence, keywords);

    expect(ranked.length).toBe(1);
    // Calculated score: 0.30(100) + 0.25(100) + 0.20(100) + 0.15(30) + 0.10(90) = 88.5 => 89
    expect(ranked[0].score).toBe(89);
    expect(ranked[0].authorityScore).toBe(100);
  });

  it('ranks official .gov.ng regulators above general social media or unverified blogs', () => {
    const mixedEvidence: EvidenceItem[] = [
      {
        id: 'ev-blog',
        title: 'Random Blog Post About Shutdown',
        snippet: 'Anonymous reports claim an app is closing.',
        url: 'https://randomblog.ng/news',
        domain: 'randomblog.ng',
        sourceName: 'Random Blog',
        isOfficialAuthority: false,
        score: 0,
        authorityScore: 40,
        relevanceScore: 50,
        recencyScore: 50,
        corroborationScore: 30
      },
      {
        id: 'ev-official',
        title: 'CBN Refutes Fintech Closures',
        snippet: 'The Central Bank of Nigeria confirms normal operations.',
        url: 'https://cbn.gov.ng/press.pdf',
        domain: 'cbn.gov.ng',
        sourceName: 'Central Bank of Nigeria',
        isOfficialAuthority: true,
        score: 0,
        authorityScore: 100,
        relevanceScore: 95,
        recencyScore: 90,
        corroborationScore: 90
      }
    ];

    const keywords = ['cbn', 'fintech', 'operations'];
    const ranked = rankEvidence(mixedEvidence, keywords);

    expect(ranked[0].id).toBe('ev-official');
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });
});

describe('2. SHA-256 Claim Hash Caching (<100ms Invariant)', () => {
  it('generates identical hash for claims with identical semantic meaning despite case or extra spaces', () => {
    const claim1 = 'OPay is shutting down its operations in Nigeria';
    const claim2 = '  opay is SHUTTING down its operations in nigeria!  ';

    const hash1 = computeClaimHash(claim1);
    const hash2 = computeClaimHash(claim2);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });

  it('stores and retrieves cached verification results', () => {
    const query = 'Test Cached Nigerian Claim';
    const mockResult: any = {
      id: 'check-cached-123',
      query,
      verdict: 'CONTRADICTED',
      confidenceScore: 95,
      extractedClaim: { normalizedClaim: query }
    };

    setCachedResult(query, mockResult);
    const cached = getCachedResult(query);

    expect(cached).not.toBeNull();
    expect(cached?.id).toBe('check-cached-123');
    expect(cached?.processingTimeMs).toBeLessThanOrEqual(50);
  });
});

describe('3. Live URL Extraction', () => {
  it('extracts valid HTTP/HTTPS URLs from mixed text', () => {
    const textWithUrl = 'Check this breaking news on Punch: https://punchng.com/cbn-governor-speaks-on-naira please verify';
    const extracted = extractUrlFromText(textWithUrl);

    expect(extracted).toBe('https://punchng.com/cbn-governor-speaks-on-naira');
  });

  it('returns null when no URL is present in plain text', () => {
    const plainText = 'OPay is shutting down in Nigeria next week';
    const extracted = extractUrlFromText(plainText);

    expect(extracted).toBeNull();
  });
});

describe('4. Built-in Humility & Uncertainty Fallback (<60% Rule)', () => {
  it('yields UNVERIFIED when no corroborating official evidence is found', () => {
    const claim: ExtractedClaim = {
      normalizedClaim: 'Aliens landed in Maitama Abuja yesterday evening',
      entity: 'Maitama Abuja',
      category: 'general',
      rawText: 'Aliens landed in Maitama Abuja'
    };

    const emptyEvidence: EvidenceItem[] = [];
    const result = verifyClaimWithEvidence(claim, emptyEvidence, null, claim.rawText, Date.now());

    expect(result.verdict).toBe('UNVERIFIED');
    expect(result.confidenceScore).toBeLessThan(60);
  });
});
