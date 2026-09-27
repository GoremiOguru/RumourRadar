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

  const isNonClaim = verdict === 'NON_CLAIM';
  const isSatire = verdict === 'SATIRE_PARODY';

  // Pidgin
  const pidgin = pidginExplanation || (
    isNonClaim
      ? 'Dis text na greeting or play question, no be news rumor or scam. Paste real tweet or news link make we check am.'
      : isSatire
      ? 'Dis one na just cruise and comedy skit! Dem dey play play, no take am like official news.'
      : isFalse 
      ? 'Dis news na fake talk! Authorities don confirm say na lie. No share am give anybody.'
      : isSupported
      ? 'Dis matter na true talk! Government and news desks don confirm am say e legit.'
      : 'Dis talk get small truth but dem twist the story. Check well before you believe.'
  );

  // Yoruba
  const yoruba = isNonClaim
    ? 'Ọ̀rọ̀ yìí jẹ́ ìkíni tabi ìbéèrè lásán, kì í ṣe ìròyìn èke. Jọ̀wọ́ fi ìròyìn tabi tweet gidi ránṣẹ́.'
    : isSatire
    ? 'Ọ̀rọ̀ yìí jẹ́ àwàdà àti àwòran ìfeṣèwé gbe (comedy/cruise), kì í ṣe ìròyìn aṣẹ ìjọba.'
    : isFalse
    ? 'Ọ̀rọ̀ yìí jẹ́ ìròyìn èke (fake news)! Awọn alaṣẹ ati awọn ajọ fact-check ti fidi rẹ̀ mulẹ pe irọ́ ni. Ẹ ma ṣe tan an kálẹ̀.'
    : isSupported
    ? 'Ọ̀rọ̀ yìí jẹ́ otitọ pátápátá! Awọn alaṣẹ ati ajọ ìròyìn ti fọwọ́ sí i pe otitọ ni.'
    : 'Ọ̀rọ̀ yìí nira láti gbà gbọ́ patapata, atunṣe ati àyẹ̀wò wa ninu itan naa.';

  // Hausa
  const hausa = isNonClaim
    ? 'Wannan sakon gaisuwa ne kawai ko tambaya, ba jita-jita ba ne. Da fatan zaka saka ainihin labarin da kake son dubawa.'
    : isSatire
    ? 'Wannan magana ta wasan barkwanci ce (comedy/cruise), ba labarin gwamnati ba ne.'
    : isFalse
    ? 'Wannan labarin bashi da inganci (fake news)! Hukumomi da ma\'aikatan fact-check sun tabbatar karya ne. Kar a yada ta.'
    : isSupported
    ? 'Wannan labarin gaskiya ne palla-palla! Hukumomi da ma\'aikatan jarida sun tabbatar da haka.'
    : 'Wannan magana tana da rudani da rance, a kiyaye sosai kafin a yada ta.';

  // Igbo
  const igbo = isNonClaim
    ? 'Ozi a bụ naanị ekele ma ọ bụ ajụjụ nkịtị, ọ bụghị okwu asị ma ọ bụ akụkọ a ga-enyocha. Biko zipụ ozi akụkọ ka anyị nyochaa.'
    : isSatire
    ? 'Ozi a bụ naanị ihe ọchị na egwuregwu, ọ bụghị okwu sitere n\'aka ndị ọchịchị.'
    : isFalse
    ? 'Ozi a bụ okwu asị na okwu ụgha! Ndị ọchịchị na ndị nta akụkọ nyocha kwadoro na ọ bụ okwu asị. Biko zere ikesa ozi a.'
    : isSupported
    ? 'Ozi a bụ eziokwu zuru ezu! Ndị ọchịchị na ndị nta akụkọ nyocha kwadoro na ọ bụ eziokwu doro anya.'
    : 'Ozi a nwere okwu na-eduhie eduhie. E nwere obere eziokwu mana a kọwara ya n\'ụzọ na-ezighi ezi. Nyochaa nke ọma.';

  return {
    english: shortExplanation,
    pidgin,
    yoruba,
    hausa,
    igbo
  };
}
