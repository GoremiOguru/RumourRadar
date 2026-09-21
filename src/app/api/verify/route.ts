import { NextRequest, NextResponse } from 'next/server';
import { extractClaim } from '@/lib/claim-extractor';
import { lookupGoogleFactCheck } from '@/lib/factcheck-api';
import { searchAuthoritativeEvidence } from '@/lib/search-provider';
import { rankEvidence } from '@/lib/evidence-ranker';
import { verifyClaimWithEvidence } from '@/lib/verifier';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query text is required' }, { status: 400 });
    }

    // Stage 1: Claim Extraction
    const claim = await extractClaim(query);

    // Stage 2: Parallel retrieval (Google Fact Check + Nigeria-First Search)
    const [factCheckMatch, rawEvidence] = await Promise.all([
      lookupGoogleFactCheck(claim.normalizedClaim),
      searchAuthoritativeEvidence(claim)
    ]);

    // Stage 3: Evidence Ranking Engine
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

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Pipeline verification error:', err);
    return NextResponse.json(
      { error: 'An error occurred during verification pipeline execution.', details: err.message },
      { status: 500 }
    );
  }
}
