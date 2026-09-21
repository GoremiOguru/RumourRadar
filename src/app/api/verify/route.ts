/**
 * ============================================================================
 * RUMOR RADAR — 5-STAGE VERIFICATION PIPELINE API ROUTE
 * ============================================================================
 * 
 * Architectural Philosophy:
 * Rumor Radar isn't just "ask an LLM if this is true" — it wraps the LLM in a
 * deterministic pipeline specifically engineered to eliminate hallucinations
 * and provide auditable, Nigeria-grounded verification.
 * 
 * Pipeline Execution Stages:
 * 1. Stage 1: Claim Normalization & Entity Extraction (NLP / Structured Parsing)
 * 2. Stage 2: Parallel Dual-Channel Retrieval:
 *    - Google Fact Check Tools API (IFCN-certified claims database)
 *    - Nigeria-First Authority Router (CBN, INEC, NCDC, JAMB, WAEC, etc.)
 * 3. Stage 3: Multi-Factor Deterministic Ranking Engine:
 *    Score = (0.30 * Authority) + (0.25 * Relevance) + (0.20 * Recency) + 
 *            (0.15 * Corroboration) + (0.10 * Context)
 * 4. Stage 4: Evidence-Grounded Verification Synthesis:
 *    - Forbidden from using pretraining memory.
 *    - Strict Humility Check: If confidence < 60%, automatically yields 'UNVERIFIED'.
 * 5. Stage 5: Fixed Verdict Schema & Provenance Generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractClaim } from '@/lib/claim-extractor';
import { extractClaimWithGemini, synthesizeVerdictWithGemini } from '@/lib/gemini';
import { lookupGoogleFactCheck } from '@/lib/factcheck-api';
import { searchAuthoritativeEvidence } from '@/lib/search-provider';
import { rankEvidence } from '@/lib/evidence-ranker';
import { verifyClaimWithEvidence } from '@/lib/verifier';
import { scrapeArticleIfUrl } from '@/lib/url-scraper';
import { getCachedResult, setCachedResult } from '@/lib/cache';
import { saveVerificationToDB } from '@/lib/supabase';
import { VerificationResult } from '@/types';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query text is required' }, { status: 400 });
    }

    // Stage 0: Check SHA-256 Claim Cache for instant (<100ms) repeat response
    const cached = getCachedResult(query);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Stage 0.5: Live Web URL Scraping (if user pasted a news link)
    const scraped = await scrapeArticleIfUrl(query);
    const textToProcess = scraped.isUrl && scraped.extractedQuery ? scraped.extractedQuery : query;

    // Stage 1: Claim Extraction & Normalization (Gemini AI with heuristic fallback)
    const geminiClaim = await extractClaimWithGemini(textToProcess);
    const claim = geminiClaim || await extractClaim(textToProcess);

    // Stage 2: Parallel Dual-Channel Retrieval (Google Fact Check + Nigeria-First Authority Router)
    const [factCheckMatch, rawEvidence] = await Promise.all([
      lookupGoogleFactCheck(claim.normalizedClaim),
      searchAuthoritativeEvidence(claim)
    ]);

    // Stage 3: Multi-Factor Deterministic Ranking Engine (30% Auth, 25% Rel, 20% Rec, 15% Corr, 10% Ctx)
    const claimKeywords = claim.normalizedClaim.split(/\s+/).filter(w => w.length > 3);
    const rankedEvidence = rankEvidence(rawEvidence, claimKeywords);

    // Stage 4: Evidence-Grounded Verification Synthesis
    const result = await verifyClaimWithEvidence(
      claim,
      rankedEvidence,
      factCheckMatch,
      query,
      startTime
    );

    // Stage 5: Cache & Persist (Instant repeat queries + Supabase storage)
    setCachedResult(query, result);
    saveVerificationToDB(result).catch(err => console.warn('Background save notice:', err));

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Pipeline verification error:', err);
    return NextResponse.json(
      { error: 'An error occurred during verification pipeline execution.', details: err.message },
      { status: 500 }
    );
  }
}


