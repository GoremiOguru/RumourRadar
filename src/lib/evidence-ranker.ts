/**
 * ============================================================================
 * RUMOR RADAR — DETERMINISTIC 5-FACTOR EVIDENCE RANKING ENGINE
 * ============================================================================
 * 
 * Formula:
 * Score = (0.30 * Authority) + (0.25 * Relevance) + (0.20 * Recency) + 
 *         (0.15 * Corroboration) + (0.10 * Context)
 * 
 * Weights Rationale:
 * - Authority (30%): Official Nigerian regulators (.gov.ng) & certified fact-checkers.
 * - Relevance (25%): Normalized claim and semantic keyword overlap.
 * - Recency (20%): Time decay factor prioritizing current announcements.
 * - Corroboration (15%): Cross-domain corroboration bonus.
 * - Context (10%): Information completeness and snippet density.
 */

import { EvidenceItem } from '@/types';

export function rankEvidence(items: EvidenceItem[], claimKeywords: string[]): EvidenceItem[] {
  if (!items || items.length === 0) return [];


  // Deduplicate items with similar titles or same URL
  const seenUrls = new Set<string>();
  const uniqueItems: EvidenceItem[] = [];

  for (const item of items) {
    const cleanUrl = item.url.toLowerCase().split('?')[0];
    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);
      uniqueItems.push(item);
    }
  }

  // Calculate dynamic corroboration bonus based on domain diversity
  const uniqueDomainsCount = new Set(uniqueItems.map(i => i.domain)).size;
  const corroborationFactor = Math.min(100, uniqueDomainsCount * 30);

  const scored = uniqueItems.map(item => {
    // Dynamic relevance check against claim keywords
    const textToMatch = `${item.title} ${item.snippet}`.toLowerCase();
    const matchedWords = claimKeywords.filter(k => textToMatch.includes(k.toLowerCase()));
    const dynamicRelevance = Math.min(100, Math.max(item.relevanceScore, (matchedWords.length / Math.max(1, claimKeywords.length)) * 100));

    const authority = item.authorityScore || (item.isOfficialAuthority ? 95 : 75);
    const relevance = dynamicRelevance;
    const recency = item.recencyScore || 80;
    const corroboration = corroborationFactor;
    const context = item.snippet.length > 50 ? 90 : 60;

    const compositeScore = Math.round(
      0.30 * authority +
      0.25 * relevance +
      0.20 * recency +
      0.15 * corroboration +
      0.10 * context
    );

    return {
      ...item,
      score: compositeScore,
      authorityScore: authority,
      relevanceScore: Math.round(relevance),
      recencyScore: recency,
      corroborationScore: corroboration
    };
  });

  // Sort descending by calculated score
  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}
