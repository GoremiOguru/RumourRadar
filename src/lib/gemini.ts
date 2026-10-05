import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedClaim, EvidenceItem, FactCheckMatch, VerdictType, ConfidenceLevel, ClaimCategory, BrandAlert, DebunkKit } from '@/types';

const rawGeminiKey = process.env.GEMINI_API_KEY || '';
const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';

// Valid Google AI Studio keys start with 'AIzaSy'
const isGeminiKeyValid = rawGeminiKey.startsWith('AIzaSy');
let isGeminiDisabled = !isGeminiKeyValid;

let genAI: GoogleGenerativeAI | null = null;
if (isGeminiKeyValid) {
  try {
    genAI = new GoogleGenerativeAI(rawGeminiKey);
  } catch (e) {
    console.warn('[LLM] Gemini initialization warning:', e);
  }
}

/**
 * Universal Dual-Rail LLM Runner (High Performance / Low Latency)
 * Instantly routes to OpenRouter in 0ms if Gemini is unconfigured/invalid.
 */
export async function executeLlmWithFailover(
  prompt: string,
  options?: {
    imageBase64?: string;
    imagesBase64?: Array<{ base64: string; mimeType?: string }>;
    mimeType?: string;
    temperature?: number;
    openRouterModel?: string;
    maxTokens?: number;
  }
): Promise<string | null> {
  const temp = options?.temperature ?? 0.1;
  const maxTokens = options?.maxTokens || 1000;

  // Prepare normalized image list
  const imageList: Array<{ dataUrl: string; cleanBase64: string; mimeType: string }> = [];
  if (options?.imagesBase64 && options.imagesBase64.length > 0) {
    for (const img of options.imagesBase64) {
      if (img.base64) {
        const mime = img.mimeType || 'image/jpeg';
        const clean = img.base64.replace(/^data:image\/\w+;base64,/, '');
        const url = img.base64.startsWith('data:') ? img.base64 : `data:${mime};base64,${clean}`;
        imageList.push({ dataUrl: url, cleanBase64: clean, mimeType: mime });
      }
    }
  } else if (options?.imageBase64) {
    const mime = options.mimeType || 'image/jpeg';
    const clean = options.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const url = options.imageBase64.startsWith('data:') ? options.imageBase64 : `data:${mime};base64,${clean}`;
    imageList.push({ dataUrl: url, cleanBase64: clean, mimeType: mime });
  }

  // 1. PRIMARY RAIL: Google Gemini (Only attempted if key format is valid)
  if (genAI && !isGeminiDisabled) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { temperature: temp, maxOutputTokens: maxTokens }
      });

      if (imageList.length > 0) {
        const parts: any[] = [prompt];
        for (const img of imageList) {
          parts.push({
            inlineData: {
              data: img.cleanBase64,
              mimeType: img.mimeType
            }
          });
        }
        const result = await model.generateContent(parts);
        const text = result.response.text();
        if (text && text.trim().length > 0) return text.trim();
      } else {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 0) return text.trim();
      }
    } catch (geminiError: any) {
      console.warn('[LLM Failover] Primary Gemini request failed, routing to OpenRouter in 0ms...', geminiError?.message || geminiError);
      isGeminiDisabled = true; // Disable for current runtime to avoid repeated timeout delays
    }
  }

  // 2. SECONDARY RAIL: High-Speed OpenRouter (Google Gemini 2.5 Flash for vision / gpt-4o-mini for text)
  if (openRouterApiKey) {
    const candidateModels = options?.openRouterModel 
      ? [options.openRouterModel]
      : imageList.length > 0
      ? ['google/gemini-2.5-flash', 'qwen/qwen-2.5-vl-72b-instruct', 'openai/gpt-4o-mini']
      : ['openai/gpt-4o-mini', 'google/gemini-2.5-flash'];

    for (const selectedModel of candidateModels) {
      try {
        const contentParts: any[] = [{ type: 'text', text: prompt }];
        for (const img of imageList) {
          contentParts.push({ type: 'image_url', image_url: { url: img.dataUrl } });
        }

        const messages = [{ role: 'user', content: imageList.length > 0 ? contentParts : prompt }];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://rumourradar.vercel.app',
            'X-Title': 'RumourRadar'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages,
            temperature: temp,
            max_tokens: maxTokens
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && typeof content === 'string' && content.trim().length > 0) {
            return content.trim();
          }
        } else {
          const errText = await response.text();
          console.warn(`[LLM] OpenRouter ${selectedModel} returned non-200:`, response.status, errText);
        }
      } catch (openRouterError: any) {
        console.warn(`[LLM] OpenRouter ${selectedModel} failover error:`, openRouterError?.message || openRouterError);
      }
    }
  }

  return null;
}

/**
 * Stage 1 Live LLM: Entity Normalization & Claim Extraction (Supports Multimodal Vision)
 */
export async function extractClaimWithGemini(
  rawText: string,
  imageBase64?: string,
  mimeType?: string
): Promise<ExtractedClaim | null> {
  const prompt = `You are Rumour Radar's Claim Normalization & Multimodal Vision Engine for Nigeria.
Analyze the following user input (which may be a viral WhatsApp broadcast, tweet, headline, circular, or screenshot):

INPUT TEXT: "${rawText || 'Examine uploaded image for circulating claim or memo'}"

TASK:
1. Extract the single core factual claim being made. Strip out conversational fluff, emojis, and panic calls like "Share to 10 groups". If an image is provided, OCR and extract any circular, memo ref number, forged signature, or headline.
2. Identify the primary Nigerian entity (institution, company, or figure, e.g., CBN, INEC, NCDC, GTBank, Dangote).
3. Assign the exact category from this list: banking_fintech, elections_politics, education_exams, telecom_tech, public_health, security_alerts, general.
4. Detect if this is an obvious satire, comedy sketch, political parody, or sarcasm (e.g. Parody handles, exaggerated banter). Set "isSatireOrParody": true if so.

Return ONLY a valid JSON object in this exact schema without markdown code blocks:
{
  "normalizedClaim": "concise factual statement",
  "entity": "Primary Entity Name",
  "category": "category_name",
  "location": "Nigeria / State",
  "isSatireOrParody": false
}`;

  const responseText = await executeLlmWithFailover(prompt, { imageBase64, mimeType });
  if (!responseText) return null;

  try {
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      normalizedClaim: parsed.normalizedClaim || rawText,
      entity: parsed.entity || 'General Nigerian Entity',
      category: (parsed.category as ClaimCategory) || 'general',
      location: parsed.location || 'Nigeria',
      rawText: rawText || 'Image/Screenshot Upload',
      isSatireOrParody: !!parsed.isSatireOrParody
    };
  } catch (err) {
    console.warn('[LLM] Claim extraction JSON parse error:', err, responseText);
    return null;
  }
}

export interface LiveSynthesisResult {
  verdict: VerdictType;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  shortExplanation: string;
  pidginExplanation: string;
  reasoning: string;
  keyQuote?: string;
}

/**
 * Stage 4 Live LLM: Evidence-Grounded Verification Synthesis
 * STRICT RULE: The LLM is forbidden from using pretraining memory. It may ONLY synthesize over the retrieved evidence.
 */
export async function synthesizeVerdictWithGemini(
  claim: ExtractedClaim,
  evidence: EvidenceItem[],
  factCheck: FactCheckMatch | null
): Promise<LiveSynthesisResult | null> {
  const evidenceText = evidence.map((e, idx) => 
    `[Evidence ${idx + 1}] Source: ${e.sourceName} (${e.domain}, Score: ${e.score}/100, Authority: ${e.isOfficialAuthority ? 'OFFICIAL GOV/REGULATOR' : 'MEDIA'})\nSnippet: ${e.snippet}\nURL: ${e.url}`
  ).join('\n\n');

  const factCheckText = factCheck 
    ? `PUBLISHED FACT-CHECK FOUND:\nPublisher: ${factCheck.publisher}\nRating: ${factCheck.rating}\nURL: ${factCheck.reviewUrl}`
    : 'No pre-existing fact check in global registry.';

  const prompt = `You are Rumour Radar's Evidence-Grounded Verification Synthesizer for Nigeria.

STRICT OPERATIONAL DIRECTIVES:
1. EVIDENCE-GROUNDED ONLY: You are strictly FORBIDDEN from using your pretraining memory to determine truth. You may ONLY reason over the live retrieved evidence items and fact-check records provided below.
2. 5 FIXED VERDICT CATEGORIES:
   - "SUPPORTED": Clear official or credible media confirmation found.
   - "CONTRADICTED": Proven false, fabricated, or debunked by official bulletins/fact-checkers.
   - "MISLEADING": Real event distorted with false dates, altered figures, or clickbait framing.
   - "SATIRE_PARODY": Humor, satire page, comedy banter, or political parody (NOT meant as malicious factual deception).
   - "UNVERIFIED": Insufficient authoritative evidence or breaking event too fresh (<60% confidence).
3. DESIGNED HUMILITY (<60% RULE): If the evidence is insufficient or ambiguous, yield "UNVERIFIED" with confidenceScore < 60.
4. DUAL EXPLANATIONS: Provide an authoritative English explanation and an authentic Nigerian Pidgin ("Naija Pidgin") summary.

CLAIM TO VERIFY:
"${claim.normalizedClaim}" (Target Entity: ${claim.entity}, Category: ${claim.category}, Marked Satire: ${claim.isSatireOrParody ? 'YES' : 'NO'})

${factCheckText}

RETRIEVED AUTHORITATIVE EVIDENCE:
${evidenceText}

Return ONLY a valid JSON object matching this schema without markdown code blocks:
{
  "verdict": "SUPPORTED" | "CONTRADICTED" | "MISLEADING" | "UNVERIFIED" | "SATIRE_PARODY",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "confidenceScore": number (0 to 100),
  "shortExplanation": "Clear, objective 2-sentence explanation citing the primary authority",
  "pidginExplanation": "Engaging, authentic Nigerian Pidgin translation of the verdict and advice",
  "reasoning": "Step-by-step reasoning explaining why the evidence supports or contradicts the claim",
  "keyQuote": "Direct quote from primary authority snippet if available"
}`;

  const responseText = await executeLlmWithFailover(prompt);
  if (!responseText) return null;

  try {
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      verdict: (parsed.verdict as VerdictType) || (claim.isSatireOrParody ? 'SATIRE_PARODY' : 'UNVERIFIED'),
      confidence: parsed.confidence as ConfidenceLevel,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 85,
      shortExplanation: parsed.shortExplanation,
      pidginExplanation: parsed.pidginExplanation,
      reasoning: parsed.reasoning,
      keyQuote: parsed.keyQuote
    };
  } catch (err) {
    console.warn('[LLM] Evidence synthesis JSON parse error:', err, responseText);
    return null;
  }
}

/**
 * Enterprise Brand Shield: Threat Intelligence & Debunk Kit Generator
 */
export async function analyzeBrandThreatsWithLlm(
  brandName: string,
  newsArticles: { title: string; snippet: string; link: string; date?: string; source?: string }[]
): Promise<{ alerts: BrandAlert[]; debunkKit?: DebunkKit } | null> {
  const articlesText = newsArticles.map((a, i) => 
    `[Item ${i + 1}] Title: ${a.title}\nSource: ${a.source || 'Nigerian Web'}\nSnippet: ${a.snippet}\nLink: ${a.link}\nDate: ${a.date || 'Recent'}`
  ).join('\n\n');

  const prompt = `You are Rumour Radar's Enterprise Crisis Intelligence System for Nigerian Brands.
Analyze live media reports and public chatter for the company/brand: "${brandName}".

INGESTED LIVE MEDIA ITEMS:
${articlesText || 'No recent negative media reports found.'}

TASK:
1. Identify any active rumours, phishing scams, fake promo broadcasts, false executive claims, or regulatory crises targeting "${brandName}".
2. Classify threat severity for each detected issue: "CRITICAL" (risk of panic/bank run), "HIGH" (customer phishing/fake promo), "MEDIUM" (distorted news), "SAFE" (positive or routine operations).
3. If any high or critical threat is detected, generate an immediate PR Debunk Kit containing tailored broadcast copies for ALL major social platforms (WhatsApp, X/Twitter, LinkedIn, and Facebook/Instagram).

Return ONLY a valid JSON object matching this schema:
{
  "alerts": [
    {
      "id": "alert-1",
      "title": "Brief threat headline",
      "summary": "1-2 sentence breakdown of what is falsely circulating",
      "sourceUrl": "URL or source",
      "sourceName": "Source Name",
      "publishedDate": "YYYY-MM-DD",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE",
      "category": "VIRAL_RUMOUR" | "PHISHING_SCAM" | "FAKE_DIRECTIVE" | "ROUTINE_NEWS",
      "verdictRecommendation": "CONTRADICTED" | "MISLEADING" | "UNVERIFIED" | "SUPPORTED",
      "confidenceScore": 90
    }
  ],
  "debunkKit": {
    "brandName": "${brandName}",
    "targetRumour": "Core false narrative being addressed",
    "officialStatementDraft": "Formal public clarification draft from corporate communications desk",
    "bulletPoints": ["Key fact 1", "Key fact 2"],
    "suggestedAction": "Advice to PR / Security desk",
    "twitterPost": "Punchy, high-impact X/Twitter broadcast with warning emojis, hashtags, and official handle tag",
    "whatsappBroadcastTemplate": "WhatsApp-optimized broadcast formatted with bold asterisks *...* and WARNING tag",
    "linkedInStatement": "Professional corporate executive memo addressing investors, partners, and B2B clients",
    "facebookInstagramCaption": "Engaging, clear caption for Instagram and Facebook carousel debunks"
  }
}`;

  const responseText = await executeLlmWithFailover(prompt);
  if (!responseText) return null;

  try {
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.warn('[LLM] Brand threat analysis parse error:', err);
    return null;
  }
}
