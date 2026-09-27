import { ClaimCategory, DemoPreset } from '@/types';

export const NIGERIAN_AUTHORITY_DOMAINS: Record<string, { name: string; authorityWeight: number; category: ClaimCategory }> = {
  // Financial & Banking
  'cbn.gov.ng': { name: 'Central Bank of Nigeria (CBN)', authorityWeight: 1.0, category: 'banking_fintech' },
  'sec.gov.ng': { name: 'Securities and Exchange Commission', authorityWeight: 0.95, category: 'banking_fintech' },
  'ndic.gov.ng': { name: 'Nigeria Deposit Insurance Corp (NDIC)', authorityWeight: 0.95, category: 'banking_fintech' },
  'opayweb.com': { name: 'OPay Official Channel', authorityWeight: 0.9, category: 'banking_fintech' },
  'moniepoint.com': { name: 'Moniepoint Official Channel', authorityWeight: 0.9, category: 'banking_fintech' },
  'flutterwave.com': { name: 'Flutterwave Official', authorityWeight: 0.9, category: 'banking_fintech' },
  'paystack.com': { name: 'Paystack Official', authorityWeight: 0.9, category: 'banking_fintech' },

  // Elections & Government
  'inec.gov.ng': { name: 'Independent National Electoral Commission (INEC)', authorityWeight: 1.0, category: 'elections_politics' },
  'statehouse.gov.ng': { name: 'State House / Presidency Nigeria', authorityWeight: 0.95, category: 'elections_politics' },
  'fmic.gov.ng': { name: 'Federal Ministry of Information & National Orientation', authorityWeight: 0.95, category: 'elections_politics' },

  // Education & Exams
  'jamb.gov.ng': { name: 'Joint Admissions and Matriculation Board (JAMB)', authorityWeight: 1.0, category: 'education_exams' },
  'waecnigeria.org': { name: 'WAEC Nigeria', authorityWeight: 1.0, category: 'education_exams' },
  'neconigeria.org': { name: 'National Examinations Council (NECO)', authorityWeight: 1.0, category: 'education_exams' },
  'nuc.edu.ng': { name: 'National Universities Commission (NUC)', authorityWeight: 0.95, category: 'education_exams' },

  // Telecom & Technology
  'ncc.gov.ng': { name: 'Nigerian Communications Commission (NCC)', authorityWeight: 1.0, category: 'telecom_tech' },
  'nitda.gov.ng': { name: 'National Information Technology Development Agency (NITDA)', authorityWeight: 0.95, category: 'telecom_tech' },

  // Public Health
  'ncdc.gov.ng': { name: 'Nigeria Centre for Disease Control (NCDC)', authorityWeight: 1.0, category: 'public_health' },
  'health.gov.ng': { name: 'Federal Ministry of Health', authorityWeight: 0.95, category: 'public_health' },
  'nafdac.gov.ng': { name: 'NAFDAC Nigeria', authorityWeight: 0.95, category: 'public_health' },
  'who.int': { name: 'World Health Organization (WHO)', authorityWeight: 0.95, category: 'public_health' },

  // Security & Defence
  'defenceinfo.mil.ng': { name: 'Defence Headquarters Nigeria', authorityWeight: 1.0, category: 'security_alerts' },
  'npf.gov.ng': { name: 'Nigeria Police Force (NPF)', authorityWeight: 0.95, category: 'security_alerts' },
  'dss.gov.ng': { name: 'Department of State Services (DSS)', authorityWeight: 0.95, category: 'security_alerts' },
  'frsc.gov.ng': { name: 'Federal Road Safety Corps (FRSC)', authorityWeight: 0.95, category: 'security_alerts' }
};

export const REPUTABLE_MEDIA_DOMAINS: Record<string, { name: string; authorityWeight: number; isFactChecker?: boolean }> = {
  // Fact-Checkers
  'africacheck.org': { name: 'Africa Check', authorityWeight: 0.98, isFactChecker: true },
  'dubawa.org': { name: 'Dubawa Fact-Checking', authorityWeight: 0.98, isFactChecker: true },
  'factcheckhub.com': { name: 'The FactCheckHub (ICIR)', authorityWeight: 0.95, isFactChecker: true },
  'reuters.com': { name: 'Reuters Fact Check', authorityWeight: 0.95, isFactChecker: true },
  'afp.com': { name: 'AFP Fact Check', authorityWeight: 0.95, isFactChecker: true },

  // Major Tier-1 Nigerian Outlets
  'premiumtimesng.com': { name: 'Premium Times Nigeria', authorityWeight: 0.88 },
  'thecable.ng': { name: 'TheCable Nigeria', authorityWeight: 0.88 },
  'channelstv.com': { name: 'Channels Television', authorityWeight: 0.88 },
  'punchng.com': { name: 'Punch Newspapers', authorityWeight: 0.85 },
  'businessday.ng': { name: 'BusinessDay Nigeria', authorityWeight: 0.85 },
  'nairametrics.com': { name: 'Nairametrics', authorityWeight: 0.85 },
  'humanglemedia.com': { name: 'HumAngle (Security & Conflict)', authorityWeight: 0.88 },
  'vanguardngr.com': { name: 'Vanguard News', authorityWeight: 0.82 },
  'dailytrust.com': { name: 'Daily Trust', authorityWeight: 0.82 },
  'techcabal.com': { name: 'TechCabal', authorityWeight: 0.85 }
};

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'opay-shutdown',
    title: 'OPay Shutting Down Operations in Nigeria',
    category: 'banking_fintech',
    prompt: 'BREAKING: CBN has ordered OPay to shut down all operations in Nigeria starting next month due to compliance violations. Withdraw all your money immediately!',
    expectedVerdict: 'CONTRADICTED',
    tag: 'Fintech / Banking',
    badgeColor: 'rose'
  },
  {
    id: 'cbn-naira-ban',
    title: 'CBN Old N500 and N1000 Notes Ban Reversal',
    category: 'banking_fintech',
    prompt: 'URGENT: Central Bank of Nigeria announces old N500 and N1000 banknotes will stop being legal tender by midnight this Friday.',
    expectedVerdict: 'CONTRADICTED',
    tag: 'Currency / Economy',
    badgeColor: 'rose'
  },
  {
    id: 'ncdc-cholera-alert',
    title: 'NCDC Emergency Public Health Advisory on Cholera',
    category: 'public_health',
    prompt: 'Nigeria Centre for Disease Control (NCDC) issues national public health advisory activating emergency response for rising cholera cases across multiple states.',
    expectedVerdict: 'SUPPORTED',
    tag: 'Health Advisory',
    badgeColor: 'emerald'
  },
  {
    id: 'jamb-cutoff-rumor',
    title: 'JAMB Sets 2026 Cutoff Mark to 120 for Medicine',
    category: 'education_exams',
    prompt: 'JAMB registrar announces that universities are now mandated to accept a minimum UTME cutoff score of 120 for Medicine and Law admissions in 2026.',
    expectedVerdict: 'MISLEADING',
    tag: 'Exams & UTME',
    badgeColor: 'amber'
  },
  {
    id: 'lagos-unrest-curfew',
    title: '24-Hour Curfew Declared in All Lagos Local Governments',
    category: 'security_alerts',
    prompt: 'SECURITY ALERT: Lagos State Government has declared an immediate 24-hour total lockdown and curfew across all 20 LGAs starting 6:00 AM tomorrow due to suspected riots.',
    expectedVerdict: 'UNVERIFIED',
    tag: 'Security & Curfew',
    badgeColor: 'slate'
  },
  {
    id: 'nin-palliative-scam',
    title: 'FG NIN Palliative Payment Scam (BMONI Rail Check)',
    category: 'banking_fintech',
    prompt: 'FG PALLIATIVE ALERT: Send N5,000 verification fee to GTBank account 0581928374 (Federal Ministry of Humanitarian Affairs) to claim your N50,000 NIN palliative grant immediately!',
    expectedVerdict: 'CONTRADICTED',
    tag: 'BMONI Fraud Rail',
    badgeColor: 'rose'
  }
];
