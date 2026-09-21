import { ClaimCategory, ExtractedClaim } from '@/types';
import { ExtractedClaimSchema } from './ai-schemas';
import { openrouter, openRouterApiKey, FREE_MODELS } from './openrouter';

/**
 * Stage 1: Claim Extractor & Normalizer
 * Extracts normalized factual assertions from messy social messages or URLs using OpenRouter.
 * Routes dynamically through OpenRouter's free tier pool.
 */
export async function extractClaim(rawInput: string): Promise<ExtractedClaim> {
  const cleanedInput = rawInput.trim();

  if (!openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in .env.local');
  }

  const systemInstruction = `
You are the Claim Extraction Engine of Rumor Radar, a specialized fact-checking platform for Nigeria.
Your job is to read raw, noisy social messages (e.g. WhatsApp forwards, tweets, Facebook posts) and return a JSON object with:
1. "normalizedClaim": Strip all panic and forwarding text ("BREAKING", "Forward to all groups", "Pls read urgent!"). Rephrase the core factual assertion into a neutral, single-sentence claim.
2. "entity": Identify the primary Nigerian institution or personality (e.g. CBN, INEC, JAMB, NCDC, OPay, Dangote).
3. "category": Must be one of: "banking_fintech", "elections_politics", "education_exams", "telecom_tech", "public_health", "security_alerts", "general".
4. "location": City or state if mentioned (e.g. "Lagos", "Abuja"), otherwise "Nigeria (National)".
5. "isTestableClaim": true if this is an objective testable assertion of fact; false if it is merely an opinion, greeting, religious text, or nonsense.

Respond ONLY with valid JSON.
`.trim();

  let completion;
  try {
    // 1. Primary: openrouter/free dynamic router
    completion = await openrouter.chat.completions.create({
      model: FREE_MODELS.PRIMARY,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `Extract the claim from this raw message:\n\n"${cleanedInput}"` }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
  } catch (primaryErr) {
    console.warn('[RumorRadar AI] Primary model busy, switching to fallback free model...', primaryErr);
    completion = await openrouter.chat.completions.create({
      model: FREE_MODELS.FALLBACK,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `Extract the claim from this raw message:\n\n"${cleanedInput}"` }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
  }

  const content = completion.choices[0]?.message?.content || '{}';
  const sanitized = sanitizeClaimOutput(content, cleanedInput);
  const validated = ExtractedClaimSchema.parse(sanitized);

  return {
    normalizedClaim: validated.normalizedClaim,
    entity: validated.entity,
    category: validated.category as ClaimCategory,
    location: validated.location,
    dateClaimed: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    rawText: cleanedInput
  };
}

function sanitizeClaimOutput(raw: string, fallbackText: string): any {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.warn('[RumorRadar AI] Claim parse notice, text was:', text);
  }

  if (data && typeof data === 'object' && !data.normalizedClaim) {
    for (const key of ['result', 'data', 'claim', 'output']) {
      if (data[key] && typeof data[key] === 'object' && data[key].normalizedClaim) {
        data = data[key];
        break;
      }
    }
    if (!data.normalizedClaim) {
      for (const k of Object.keys(data)) {
        if (data[k] && typeof data[k] === 'object' && data[k].normalizedClaim) {
          data = data[k];
          break;
        }
      }
    }
  }

  if (!data.normalizedClaim || typeof data.normalizedClaim !== 'string') {
    data.normalizedClaim = fallbackText;
  }
  if (!data.entity || typeof data.entity !== 'string') {
    data.entity = 'Nigeria';
  }
  if (!data.category || typeof data.category !== 'string') {
    data.category = 'general';
  }
  if (!data.location || typeof data.location !== 'string') {
    data.location = 'Nigeria (National)';
  }
  if (typeof data.isTestableClaim !== 'boolean') {
    data.isTestableClaim = true;
  }

  return data;
}
