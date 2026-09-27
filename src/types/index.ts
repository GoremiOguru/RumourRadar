export type ClaimCategory =
  | 'banking_fintech'
  | 'elections_politics'
  | 'education_exams'
  | 'telecom_tech'
  | 'public_health'
  | 'security_alerts'
  | 'general';

export type VerdictType = 'SUPPORTED' | 'CONTRADICTED' | 'MISLEADING' | 'UNVERIFIED' | 'SATIRE_PARODY';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ExtractedClaim {
  normalizedClaim: string;
  entity: string;
  category: ClaimCategory;
  location?: string;
  dateClaimed?: string;
  rawText: string;
  isSatireOrParody?: boolean;
  detectedLanguage?: {
    code: string;
    name: string;
    flag: string;
    isVernacular: boolean;
    confidenceScore: number;
  };
}

export interface EvidenceItem {
  id: string;
  title: string;
  snippet: string;
  url: string;
  domain: string;
  sourceName: string;
  isOfficialAuthority: boolean;
  publishedDate?: string;
  score: number; // 0 - 100
  authorityScore: number;
  relevanceScore: number;
  recencyScore: number;
  corroborationScore: number;
}

export interface FactCheckMatch {
  claim: string;
  claimant?: string;
  publisher: string;
  rating: string;
  reviewUrl: string;
  reviewDate?: string;
}

export interface PaymentVerificationResult {
  detectedNuban: string;
  detectedBank: string;
  claimedRecipient?: string;
  actualAccountHolder?: string;
  bankCode?: string;
  status: 'NO_PAYMENT_DETAILS' | 'ACCOUNT_VERIFIED_MATCH' | 'ACCOUNT_VERIFIED_MISMATCH' | 'ACCOUNT_NOT_FOUND' | 'UNRESOLVED_BANK';
  evidenceSummary: string;
  riskScore: number; // 0 (Legit) - 100 (High Fraud Risk)
}

export interface VerificationResult {
  id: string;
  query: string;
  extractedClaim: ExtractedClaim;
  verdict: VerdictType;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  reasoning: string;
  shortExplanation: string;
  pidginExplanation?: string;
  multilingualExplanations?: {
    english: string;
    pidgin: string;
    yoruba: string;
    hausa: string;
    igbo: string;
  };
  keyQuote?: string;
  evidence: EvidenceItem[];
  factCheckFound: boolean;
  factCheckDetails?: FactCheckMatch;
  paymentVerification?: PaymentVerificationResult;
  verifiedAt: string;
  processingTimeMs: number;
  pipelineStages: {
    stage: string;
    status: 'completed' | 'skipped' | 'fallback';
    durationMs: number;
    details: string;
  }[];
}

export interface DemoPreset {
  id: string;
  title: string;
  category: ClaimCategory;
  prompt: string;
  expectedVerdict: VerdictType;
  tag: string;
  badgeColor: string;
}

export interface BrandAlert {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedDate: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
  category: 'VIRAL_RUMOUR' | 'PHISHING_SCAM' | 'FAKE_DIRECTIVE' | 'ROUTINE_NEWS';
  verdictRecommendation: VerdictType;
  confidenceScore: number;
}

export interface DebunkKit {
  brandName: string;
  targetRumour: string;
  officialStatementDraft: string;
  bulletPoints: string[];
  suggestedAction: string;
  twitterPost: string;
  whatsappBroadcastTemplate: string;
  linkedInStatement: string;
  facebookInstagramCaption: string;
}


export interface BrandShieldScanResult {
  brandName: string;
  scannedAt: string;
  totalAlerts: number;
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'LOW' | 'CLEAR';
  alerts: BrandAlert[];
  debunkKit?: DebunkKit;
}

export interface BmoniVirtualAccount {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  tier: 'newsroom_pro' | 'enterprise_shield';
  monthlyFeeNGN: number;
  expiresAt: string;
  status: 'ACTIVE' | 'PENDING_PAYMENT';
}

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT_CIRCULAR';

export interface MediaForensicAnomaly {
  type: 'VISUAL' | 'AUDIO' | 'METADATA' | 'TEXT_OCR';
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestampOrRegion?: string;
}

export interface MediaForensicReport {
  id: string;
  mediaType: MediaType;
  fileName?: string;
  mediaPreviewUrl?: string;
  analyzedAt: string;
  isSyntheticOrAiGenerated: boolean;
  syntheticConfidence: number; // 0 - 100
  overallIntegrityScore: number; // 0 - 100 (100 = authentic, 0 = pure deepfake/forgery)
  forensicVerdict: 'AUTHENTIC' | 'AI_SYNTHETIC_DEEPFAKE' | 'FORGED_DOCUMENT' | 'RECONTEXTUALIZED_CHEAPFAKE' | 'SUSPICIOUS_UNVERIFIED';
  visualAnomalies: MediaForensicAnomaly[];
  audioAnomalies: MediaForensicAnomaly[];
  extractedClaimOrText: string;
  outOfContextCheck: {
    isRecycled: boolean;
    explanation?: string;
    estimatedOriginalYear?: string;
  };
  groundedVerification?: VerificationResult;
  processingTimeMs: number;
}

