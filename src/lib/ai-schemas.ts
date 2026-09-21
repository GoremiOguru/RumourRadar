import { z } from 'zod';

/**
 * 1. Allowed categories for Nigerian rumors/claims.
 * Strictly limited to 7 categories to prevent arbitrary values
 * from breaking downstream Nigeria-First Authority routing.
 */
export const ClaimCategorySchema = z.enum([
  'banking_fintech',    // e.g. OPay, CBN, Naira redesign, bank closures
  'elections_politics', // e.g. INEC, presidential orders, ministerial claims
  'education_exams',    // e.g. JAMB cutoff, WAEC leaks, ASUU strikes
  'telecom_tech',       // e.g. NCC NIN-SIM linkage, MTN network shutdown
  'public_health',      // e.g. Cholera outbreak, NCDC advisories, vaccines
  'security_alerts',    // e.g. Curfews, military movements, highway alerts
  'general'             // Other general viral rumors
]);

/**
 * 2. Stage 1 Contract: Extracted Claim Schema
 * Standardizes noisy social forwards into clean, testable claims.
 */
export const ExtractedClaimSchema = z.object({
  normalizedClaim: z.string().describe(
    'The core factual assertion stripped of clickbait, panic words, and forward warnings.'
  ),
  entity: z.string().describe(
    'The primary institution or entity named (e.g., Central Bank of Nigeria, OPay, JAMB, INEC).'
  ),
  category: ClaimCategorySchema.describe(
    'The most relevant Nigerian thematic sector for this claim.'
  ),
  location: z.string().default('Nigeria (National)').describe(
    'The location referenced in the claim (e.g. Lagos, Abuja, or Nigeria (National)).'
  ),
  isTestableClaim: z.boolean().describe(
    'True if this text contains an objective factual claim that can be fact-checked. False if opinion, greeting, or nonsense.'
  )
});

export type ExtractedClaimData = z.infer<typeof ExtractedClaimSchema>;

/**
 * 3. Allowed Verdict Types for Stage 4 Verifier.
 * Strictly limited to 4 possible outcomes as defined in the Hackathon Specification.
 */
export const VerdictTypeSchema = z.enum([
  'SUPPORTED',    // Evidence directly confirms the claim is true
  'CONTRADICTED', // Evidence directly disproves/refutes the claim (fake/false)
  'MISLEADING',   // Contains partial truth or cherry-picked facts, but distorts context
  'UNVERIFIED'    // Insufficient evidence or conflicting information
]);

export const ConfidenceLevelSchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

/**
 * 4. Stage 4 Contract: Evidence-Grounded Verifier Schema
 * Structured synthesis of evidence into an auditable, transparent verdict.
 */
export const VerifierOutputSchema = z.object({
  verdict: VerdictTypeSchema.describe(
    'The factual verdict based STRICTLY on the retrieved evidence. Must be SUPPORTED, CONTRADICTED, MISLEADING, or UNVERIFIED.'
  ),
  confidence: ConfidenceLevelSchema.describe(
    'Confidence level: HIGH if corroborated by primary official regulatory authority, MEDIUM if reliable secondary news, LOW if ambiguous or unverified.'
  ),
  confidenceScore: z.number().min(0).max(100).describe(
    'Numerical confidence score between 0 and 100. If below 60, the verdict MUST be UNVERIFIED.'
  ),
  shortExplanation: z.string().describe(
    'Concise 2-sentence explanation of the verdict in clear, objective standard English.'
  ),
  pidginExplanation: z.string().describe(
    'A natural, friendly Nigerian Pidgin English translation of the verdict explanation for viral accessibility.'
  ),
  reasoning: z.string().describe(
    'Detailed step-by-step reasoning explaining how the evidence led to this verdict.'
  ),
  keyQuote: z.string().optional().describe(
    'An exact quote or notable statement from the primary authoritative source, if available.'
  )
});

export type VerifierOutputData = z.infer<typeof VerifierOutputSchema>;
