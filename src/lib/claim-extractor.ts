import { GoogleGenAI, Type } from '@google/genai';
import { ClaimCategory, ExtractedClaim } from '@/types';
import { ExtractedClaimSchema } from './ai-schemas';

/**
 * Initialize Google GenAI client if the GEMINI_API_KEY environment variable is present.
 */
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Stage 1: Claim Extractor & Normalizer
 * Extracts normalized factual assertions from messy social messages or URLs using Gemini 1.5 Flash.
 * Falls back to deterministic Nigerian heuristic rules if API key is missing or request fails.
 */
export async function extractClaim(rawInput: string): Promise<ExtractedClaim> {
  const cleanedInput = rawInput.trim();

  // If no API key is configured, gracefully fall back to local rule-based extraction
  if (!ai) {
    console.info('[RumorRadar AI] GEMINI_API_KEY not found. Running heuristic fallback.');
    return extractClaimFallback(cleanedInput);
  }

  try {
    const systemInstruction = `
You are the Claim Extraction Engine of Rumor Radar, a specialized fact-checking platform for Nigeria.
Your job is to read raw, noisy social messages (e.g. WhatsApp forwards, tweets, Facebook posts) and extract:
1. "normalizedClaim": Strip all panic and forwarding text ("BREAKING", "Forward to all groups", "Pls read urgent!"). Rephrase the core factual assertion into a neutral, single-sentence claim.
2. "entity": Identify the primary Nigerian institution or personality (e.g. CBN, INEC, JAMB, NCDC, OPay, Dangote).
3. "category": Must be one of: banking_fintech, elections_politics, education_exams, telecom_tech, public_health, security_alerts, general.
4. "location": City or state if mentioned (e.g. "Lagos", "Abuja"), otherwise "Nigeria (National)".
5. "isTestableClaim": true if this is an objective testable assertion of fact; false if it is merely an opinion, greeting, religious text, or nonsense.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Extract the claim from this raw message:\n\n"${cleanedInput}"`,
      config: {
        systemInstruction,
        temperature: 0.1, // Near-zero temperature for strictly factual, repeatable classification
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            normalizedClaim: { type: Type.STRING },
            entity: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: [
                'banking_fintech',
                'elections_politics',
                'education_exams',
                'telecom_tech',
                'public_health',
                'security_alerts',
                'general'
              ]
            },
            location: { type: Type.STRING },
            isTestableClaim: { type: Type.BOOLEAN }
          },
          required: ['normalizedClaim', 'entity', 'category', 'location', 'isTestableClaim']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    const validated = ExtractedClaimSchema.parse(parsedData);

    return {
      normalizedClaim: validated.normalizedClaim,
      entity: validated.entity,
      category: validated.category as ClaimCategory,
      location: validated.location,
      dateClaimed: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      rawText: cleanedInput
    };
  } catch (error) {
    console.error('[RumorRadar AI] Gemini extraction failed, using heuristic fallback:', error);
    return extractClaimFallback(cleanedInput);
  }
}

/**
 * Deterministic Heuristic Fallback Engine
 * Ensures 100% uptime during hackathon demos even without internet or if API rate limit triggers.
 */
function extractClaimFallback(rawInput: string): ExtractedClaim {
  const lower = rawInput.toLowerCase();

  let category: ClaimCategory = 'general';
  let entity = 'Nigeria';

  if (lower.includes('cbn') || lower.includes('opay') || lower.includes('moniepoint') || lower.includes('bank') || lower.includes('naira') || lower.includes('fintech') || lower.includes('withdraw') || lower.includes('flutterwave')) {
    category = 'banking_fintech';
    if (lower.includes('opay')) entity = 'OPay';
    else if (lower.includes('cbn') || lower.includes('central bank')) entity = 'Central Bank of Nigeria (CBN)';
    else if (lower.includes('moniepoint')) entity = 'Moniepoint';
    else entity = 'Banking / Financial System';
  } else if (lower.includes('inec') || lower.includes('election') || lower.includes('tinubu') || lower.includes('president') || lower.includes('governor') || lower.includes('minister') || lower.includes('vote')) {
    category = 'elections_politics';
    if (lower.includes('inec')) entity = 'INEC';
    else if (lower.includes('tinubu')) entity = 'President Bola Tinubu';
    else entity = 'Federal Government of Nigeria';
  } else if (lower.includes('jamb') || lower.includes('waec') || lower.includes('neco') || lower.includes('utme') || lower.includes('admission') || lower.includes('university') || lower.includes('nuc')) {
    category = 'education_exams';
    if (lower.includes('jamb') || lower.includes('utme')) entity = 'JAMB';
    else if (lower.includes('waec')) entity = 'WAEC';
    else entity = 'Education Authorities';
  } else if (lower.includes('ncdc') || lower.includes('cholera') || lower.includes('lassa') || lower.includes('outbreak') || lower.includes('health') || lower.includes('vaccine') || lower.includes('hospital') || lower.includes('nafdac')) {
    category = 'public_health';
    if (lower.includes('ncdc')) entity = 'NCDC';
    else if (lower.includes('nafdac')) entity = 'NAFDAC';
    else entity = 'Federal Ministry of Health / NCDC';
  } else if (lower.includes('ncc') || lower.includes('mtn') || lower.includes('airtel') || lower.includes('glo') || lower.includes('network') || lower.includes('sim') || lower.includes('nin') || lower.includes('data')) {
    category = 'telecom_tech';
    if (lower.includes('ncc')) entity = 'NCC';
    else if (lower.includes('mtn')) entity = 'MTN Nigeria';
    else entity = 'Telecom Regulatory Commission';
  } else if (lower.includes('curfew') || lower.includes('riot') || lower.includes('kidnap') || lower.includes('police') || lower.includes('army') || lower.includes('attack') || lower.includes('gunmen') || lower.includes('alert') || lower.includes('security')) {
    category = 'security_alerts';
    if (lower.includes('lagos')) entity = 'Lagos State Security Council';
    else if (lower.includes('police')) entity = 'Nigeria Police Force';
    else entity = 'Security & Defence Authorities';
  }

  // Strip clickbait and urgency markers
  let normalized = rawInput
    .replace(/^(BREAKING|URGENT|ATTENTION|VIRAL|ALERT|SECURITY ALERT|JUST IN):\s*/i, '')
    .replace(/(share this to 10 groups|forward to everyone|withdraw all your money|do not ignore)\.?/gi, '')
    .trim();

  if (normalized.length > 200) {
    const firstSentence = normalized.split(/[.\n!?]/)[0];
    if (firstSentence && firstSentence.length > 20) {
      normalized = firstSentence.trim();
    }
  }

  return {
    normalizedClaim: normalized,
    entity,
    category,
    location: lower.includes('lagos') ? 'Lagos, Nigeria' : lower.includes('abuja') ? 'Abuja, Nigeria' : 'Nigeria (National)',
    dateClaimed: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    rawText: rawInput
  };
}
