import { ClaimCategory, ExtractedClaim } from '@/types';
import { detectNigerianVernacular, restoreNigerianDiacritics } from '@/lib/naijaml';

const NON_CLAIM_GREETINGS = [
  'how are you', 'how r u', 'good morning', 'good afternoon', 'good evening', 'hello', 'hi',
  'how far', 'how far bro', 'who be this', 'what is your name', 'who are you', 'what do you do',
  'testing', 'test', '123', 'kedu', 'sannu', 'bawo ni'
];

function checkNonClaimInput(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
  if (clean.length < 4) return true;
  if (NON_CLAIM_GREETINGS.some(g => clean === g || clean.startsWith(g + ' '))) return true;
  if (clean.startsWith('how are') || clean.startsWith('how do') || clean.startsWith('what is your') || clean.startsWith('who are')) {
    const hasNewsEntity = clean.includes('cbn') || clean.includes('opay') || clean.includes('tinubu') || clean.includes('inec') || clean.includes('jamb') || clean.includes('naira');
    if (!hasNewsEntity) return true;
  }
  return false;
}

/**
 * Extracts normalized factual claims from messy social messages, tweets, or URLs.
 * Categorizes and isolates the core testable assertion.
 */
export async function extractClaim(rawInput: string): Promise<ExtractedClaim> {
  const cleanedInput = rawInput.trim();
  const isNonClaim = checkNonClaimInput(cleanedInput);

  // Heuristic rule-based claim extraction & categorization
  const lower = cleanedInput.toLowerCase();

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

  // Generate normalized claim statement by stripping clickbait and urgency markers
  let normalized = cleanedInput
    .replace(/^(BREAKING|URGENT|ATTENTION|VIRAL|ALERT|SECURITY ALERT|JUST IN):\s*/i, '')
    .replace(/(share this to 10 groups|forward to everyone|withdraw all your money|do not ignore)\.?/gi, '')
    .trim();

  // If text is too long, take the primary sentence
  if (normalized.length > 200) {
    const firstSentence = normalized.split(/[.\n!?]/)[0];
    if (firstSentence && firstSentence.length > 20) {
      normalized = firstSentence.trim();
    }
  }

  // Apply NaijaML Offline Language & Diacritic Engine
  const langDetection = detectNigerianVernacular(cleanedInput);
  const normalizedEntity = restoreNigerianDiacritics(entity);

  return {
    normalizedClaim: normalized,
    entity: normalizedEntity,
    category,
    location: lower.includes('lagos') ? 'Lagos, Nigeria' : lower.includes('abuja') ? 'Abuja, Nigeria' : 'Nigeria (National)',
    dateClaimed: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    rawText: rawInput,
    isNonClaim,
    nonClaimReason: isNonClaim ? 'Greeting or conversational question (not a testable factual claim)' : undefined,
    detectedLanguage: {
      code: langDetection.code,
      name: langDetection.name,
      flag: langDetection.flag,
      isVernacular: langDetection.isVernacular,
      confidenceScore: langDetection.confidenceScore
    }
  };
}
