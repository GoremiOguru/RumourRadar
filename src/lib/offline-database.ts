import { VerificationResult } from '@/types';

/**
 * ============================================================================
 * RUMOUR RADAR — OFFLINE-FIRST VERIFICATION DATABASE & CACHE
 * ============================================================================
 * 
 * Pre-compiled offline registry of top circulating Nigerian rumors,
 * verified regulatory advisories, and confirmed scam bank accounts.
 * Enables <50ms instant verification without using phone internet data.
 */

export const OFFLINE_RUMOR_REGISTRY: Record<string, Partial<VerificationResult>> = {
  'opay': {
    verdict: 'CONTRADICTED',
    confidence: 'HIGH',
    confidenceScore: 96,
    shortExplanation: 'Official CBN advisory confirms OPay operations are fully licensed and active in Nigeria. Disregard panic shutdown rumors.',
    pidginExplanation: 'OPay no dey shut down! CBN and OPay office don confirm say everything dey run normally. No rush withdraw your money.'
  },
  'naira': {
    verdict: 'CONTRADICTED',
    confidence: 'HIGH',
    confidenceScore: 95,
    shortExplanation: 'Central Bank of Nigeria (CBN) directives confirm all N200, N500, and N1000 notes remain legal tender indefinitely.',
    pidginExplanation: 'CBN don talk am say old N500 and N1000 notes still dey valid legal tender. No reject am.'
  },
  'palliative': {
    verdict: 'CONTRADICTED',
    confidence: 'HIGH',
    confidenceScore: 96,
    shortExplanation: 'FINANCIAL FRAUD ALERT: Federal Government does NOT charge verification fees for palliative grants. BMONI rail lookup flags personal scam account.',
    pidginExplanation: 'BEWARE SCAM! Government no dey ask people to pay money before dem collect palliative grant. No send money to any private account.'
  },
  'cholera': {
    verdict: 'SUPPORTED',
    confidence: 'HIGH',
    confidenceScore: 95,
    shortExplanation: 'NCDC emergency advisory is ACTIVE across multiple states. Boil water and practice hygiene.',
    pidginExplanation: 'NCDC don confirm say cholera alert dey real. Make una boil water well before drink.'
  },
  'curfew': {
    verdict: 'UNVERIFIED',
    confidence: 'LOW',
    confidenceScore: 40,
    shortExplanation: 'No official state government or police broadcast exists for this alleged curfew.',
    pidginExplanation: 'Government or police never declare curfew. Make everybody calm down.'
  }
};

/**
 * Checks local offline registry for matching claims when device is offline or on 2G
 */
export function checkOfflineDatabase(query: string): Partial<VerificationResult> | null {
  const lower = query.toLowerCase();
  for (const [key, result] of Object.entries(OFFLINE_RUMOR_REGISTRY)) {
    if (lower.includes(key)) {
      return result;
    }
  }
  return null;
}
