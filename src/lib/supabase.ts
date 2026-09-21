import { createClient } from '@supabase/supabase-js';
import { VerificationResult } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

// In-memory fallback map if Supabase table is unreachable or not yet created
const localStore = new Map<string, VerificationResult>();

/**
 * Persists a verification result to Supabase 'verifications' table, with local fallback
 */
export async function saveVerificationToDB(result: VerificationResult): Promise<void> {
  // Always update local memory store for instant retrieval
  localStore.set(result.id, result);

  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase
      .from('verifications')
      .upsert({
        id: result.id,
        query: result.query,
        normalized_claim: result.extractedClaim.normalizedClaim,
        entity: result.extractedClaim.entity,
        category: result.extractedClaim.category,
        verdict: result.verdict,
        confidence: result.confidence,
        confidence_score: result.confidenceScore,
        short_explanation: result.shortExplanation,
        pidgin_explanation: result.pidginExplanation,
        reasoning: result.reasoning,
        key_quote: result.keyQuote,
        evidence: result.evidence,
        fact_check_found: result.factCheckFound,
        fact_check_details: result.factCheckDetails,
        pipeline_stages: result.pipelineStages,
        processing_time_ms: result.processingTimeMs,
        verified_at: result.verifiedAt,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      // Table may not exist yet in new Supabase projects; log gently without crashing
      console.warn('[Supabase] Non-fatal upsert notice (fallback to in-memory store):', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] Connection notice (local fallback active):', err);
  }
}

/**
 * Fetches a verification result by ID from Supabase or fallback store
 */
export async function getVerificationFromDB(id: string): Promise<VerificationResult | null> {
  // Check local store first
  if (localStore.has(id)) {
    return localStore.get(id)!;
  }

  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    const result: VerificationResult = {
      id: data.id,
      query: data.query,
      extractedClaim: {
        normalizedClaim: data.normalized_claim,
        entity: data.entity,
        category: data.category,
        rawText: data.query
      },
      verdict: data.verdict,
      confidence: data.confidence,
      confidenceScore: data.confidence_score,
      shortExplanation: data.short_explanation,
      pidginExplanation: data.pidgin_explanation,
      reasoning: data.reasoning,
      keyQuote: data.key_quote,
      evidence: data.evidence || [],
      factCheckFound: data.fact_check_found || false,
      factCheckDetails: data.fact_check_details,
      pipelineStages: data.pipeline_stages || [],
      processingTimeMs: data.processing_time_ms || 0,
      verifiedAt: data.verified_at || new Date().toISOString()
    };

    // Cache locally
    localStore.set(id, result);
    return result;
  } catch (err) {
    console.warn('[Supabase] Fetch error:', err);
    return null;
  }
}
