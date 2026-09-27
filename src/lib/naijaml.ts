/**
 * ============================================================================
 * RUMOUR RADAR — NAIJAML VERNACULAR & LANGUAGE INTELLIGENCE ENGINE
 * ============================================================================
 * 
 * Inspired by NaijaML (https://github.com/naijaml/naijaml):
 * Open-source, CPU-first, offline-capable ML tools for the Nigerian ecosystem.
 * 
 * Key Capabilities:
 * 1. Offline Vernacular Language Detection (Pidgin, Yoruba, Hausa, Igbo, English)
 * 2. Tone & Diacritic Normalization for Nigerian Named Entities
 * 3. CPU-Fast Tokenization & Vernacular Debunk Transliteration
 */

export type NigerianLanguageCode = 'pcm' | 'yo' | 'ha' | 'ig' | 'en';

export interface VernacularDetectionResult {
  code: NigerianLanguageCode;
  name: string;
  flag: string;
  isVernacular: boolean;
  confidenceScore: number; // 0 - 100
  matchedTokens: string[];
}

export interface MultilingualExplanations {
  english: string;
  pidgin: string;
  yoruba: string;
  hausa: string;
  igbo: string;
}

// Marker dictionaries for CPU-fast zero-latency offline detection
const PIDGIN_MARKERS = [
  'dey', 'don', 'wey', 'una', 'abeg', 'weti', 'wetin', 'naira', 'wahala', 'shey',
  'sabi', 'kpai', 'make', 'palliative', 'complain', 'cruise', 'pikin', 'japa', 'chop',
  'gbege', 'vawence', 'sharp', 'how far', 'no be', 'na lie', 'gist'
];

const YORUBA_MARKERS = [
  'awon', 'pe', 'mori', 'baba', 'fun', 'se', 'nitori', 'ekuo', 'nitorina', 'odabo',
  'ori', 'osun', 'eko', 'olowa', 'adura', 'gbogbo', 'egbe', 'omo', 'wahala'
];

const HAUSA_MARKERS = [
  'sannu', 'yaya', 'ina', 'baba', 'aboki', 'murna', 'kudin', 'nagode', 'akwai', 'ba',
  'da', 'kuma', 'wannan', 'toro', 'naira'
];

const IGBO_MARKERS = [
  'kedu', 'biko', 'nde', 'nna', 'kodu', 'nso', 'uche', 'nke', 'nnaa', 'dalalu',
  'nwa', 'chuku', 'chineke', 'anyi', 'anyi'
];

/**
 * CPU-fast, offline language identification for viral Nigerian social messages
 */
export function detectNigerianVernacular(text: string): VernacularDetectionResult {
  const lower = text.toLowerCase();
  const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1);

  let pidginCount = 0;
  let yorubaCount = 0;
  let hausaCount = 0;
  let igboCount = 0;

  const matchedTokens: string[] = [];

  words.forEach(word => {
    if (PIDGIN_MARKERS.includes(word)) { pidginCount++; matchedTokens.push(`pidgin:${word}`); }
    if (YORUBA_MARKERS.includes(word)) { yorubaCount++; matchedTokens.push(`yoruba:${word}`); }
    if (HAUSA_MARKERS.includes(word)) { hausaCount++; matchedTokens.push(`hausa:${word}`); }
    if (IGBO_MARKERS.includes(word)) { igboCount++; matchedTokens.push(`igbo:${word}`); }
  });

  const totalWords = Math.max(words.length, 1);

  if (pidginCount >= 2 || (pidginCount >= 1 && totalWords < 10)) {
    return {
      code: 'pcm',
      name: 'Naija Pidgin',
      flag: '🇳🇬',
      isVernacular: true,
      confidenceScore: Math.min(85 + pidginCount * 5, 98),
      matchedTokens
    };
  }

  if (yorubaCount >= 2) {
    return {
      code: 'yo',
      name: 'Yorùbá',
      flag: '🇳🇬',
      isVernacular: true,
      confidenceScore: Math.min(80 + yorubaCount * 6, 96),
      matchedTokens
    };
  }

  if (hausaCount >= 2) {
    return {
      code: 'ha',
      name: 'Hausa',
      flag: '🇳🇬',
      isVernacular: true,
      confidenceScore: Math.min(80 + hausaCount * 6, 96),
      matchedTokens
    };
  }

  if (igboCount >= 2) {
    return {
      code: 'ig',
      name: 'Igbo',
      flag: '🇳🇬',
      isVernacular: true,
      confidenceScore: Math.min(80 + igboCount * 6, 96),
      matchedTokens
    };
  }

  return {
    code: 'en',
    name: 'English (Nigerian Context)',
    flag: '🇳🇬',
    isVernacular: false,
    confidenceScore: 90,
    matchedTokens: []
  };
}

/**
 * Restores tone diacritics for Nigerian named entities (Yoruba & Igbo)
 * e.g., "Tinubu" -> "Bọ̀lá Tinúbú", "Osun" -> "Ọ̀ṣun"
 */
export function restoreNigerianDiacritics(entityName: string): string {
  const diacriticMap: Record<string, string> = {
    'tinubu': 'Bola Ahmed Tinúbú',
    'osun': 'Ọ̀ṣun State',
    'oyo': 'Ọ̀yọ́ State',
    'ogun': 'Ògùn State',
    'anambra': 'Ạnambara State',
    'enugu': 'Ẹnụgụ State',
    'kano': 'Kano State (Jihar Kano)'
  };

  const lower = entityName.toLowerCase();
  for (const [key, normalized] of Object.entries(diacriticMap)) {
    if (lower.includes(key)) {
      return normalized;
    }
  }

  return entityName;
}

/**
 * Synthesizes localized vernacular explanations across 4 Nigerian languages
 */
export function generateMultilingualExplanations(
  verdict: string,
  shortExplanation: string,
  pidginExplanation?: string
): MultilingualExplanations {
  const isFalse = verdict === 'CONTRADICTED';
  const isSupported = verdict === 'SUPPORTED';
  const isMisleading = verdict === 'MISLEADING';

  // Pidgin
  const pidgin = pidginExplanation || (
    isFalse 
      ? 'Dis news na fake talk! Authorities don confirm say na lie. No share am.'
      : isSupported
      ? 'Dis matter na true talk! Government and news desks don confirm am.'
      : 'Dis talk get small truth but dem twist the story. Check well before you believe.'
  );

  // Yoruba
  const yoruba = isFalse
    ? 'Ọ̀rọ̀ yìí jẹ́ ìròyìn èke (fake news)! Awọn alaṣẹ ati awọn ajọ fact-check ti fidi rẹ̀ mulẹ pe irọ́ ni.'
    : isSupported
    ? 'Ọ̀rọ̀ yìí jẹ́ otitọ pátápátá! Awọn alaṣẹ ti fọwọ́ sí i pe otitọ ni.'
    : 'Ọ̀rọ̀ yìí nira láti gbà gbọ́ patapata, atunṣe wa ninu itan naa.';

  // Hausa
  const hausa = isFalse
    ? 'Wannan labarin bashi da inganci (fake news)! Hukumomi da ma\'aikatan fact-check sun tabbatar karya ne.'
    : isSupported
    ? 'Wannan labarin gaskiya ne! Hukumomi sun tabbatar da haka.'
    : 'Wannan magana tana da rudani, a kiyaye kafin a yada ta.';

  // Igbo
  const igbo = isFalse
    ? 'Ozi a bụ okwu asị (fake news)! Ndị ọchịchị na ndị fact-checker kwadoro na ọ bụ asị.'
    : isSupported
    ? 'Ozi a bụ eziokwu ncha! Ndị nyocha na ndị ọchịchị kwadoro ya.'
    : 'Ozi a nwere obere eziokwu mana ahaziri ya n\'ụzọ na-eduhie eduhie.';

  return {
    english: shortExplanation,
    pidgin,
    yoruba,
    hausa,
    igbo
  };
}
