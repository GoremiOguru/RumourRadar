export type AppLanguage = 'en' | 'pcm';

export interface UiTranslations {
  heroTagline: string;
  searchPlaceholder: string;
  checkClaimBtn: string;
  scanningText: string;
  presetsTitle: string;
  tabVerify: string;
  tabShield: string;
  tabHeatmap: string;
  tabDeepfake: string;
  tabAbout: string;
  officialVerdict: string;
  checkedClaim: string;
  evidenceExplanation: string;
  listenAudio: string;
  shareWhatsApp: string;
  shareX: string;
  permalink: string;
  whyModalTitle: string;
  bmoniButton: string;
  heroBadge: string;
  heroTitleWord1: string;
  heroTitleWord2: string;
  whyBannerTitle: string;
  whyBannerSubtitle: string;
  whyBannerBtn: string;
  speakBtn: string;
  speakBtnListening: string;
  uploadBtn: string;
  uploadBtnReplace: string;
  clearBtn: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  pillar5Title: string;
  pillar5Desc: string;
  pillar6Title: string;
  pillar6Desc: string;
}

export const DICTIONARY: Record<AppLanguage, UiTranslations> = {
  en: {
    heroTagline: "Verify viral tweets on X, WhatsApp forwards, TikTok posts, and news headlines against official Nigerian regulators & BVN bank rails.",
    searchPlaceholder: "Paste a tweet from X (Twitter), WhatsApp forward, TikTok post, Telegram message, news link, or upload a screenshot...",
    checkClaimBtn: "Check This Claim",
    scanningText: "Scanning Evidence...",
    presetsTitle: "Try a real circulating claim",
    tabVerify: "Claim Verify",
    tabShield: "Brand Shield",
    tabHeatmap: "Geo Heatmap",
    tabDeepfake: "Deepfake Scanner",
    tabAbout: "About RumourRadar",
    officialVerdict: "Official Verdict",
    checkedClaim: "Checked Claim:",
    evidenceExplanation: "Evidence-Based Explanation",
    listenAudio: "Listen Audio",
    shareWhatsApp: "Share WhatsApp",
    shareX: "Post to X",
    permalink: "Permalink",
    whyModalTitle: "Why RumourRadar?",
    bmoniButton: "BMONI Rails",
    heroBadge: "Dual-Rail AI Fact-Checking Engine • Multi-Social Platform Protection",
    heroTitleWord1: "Stop Rumors",
    heroTitleWord2: "Before They Spread in Nigeria",
    whyBannerTitle: "Why Rumour Radar isn't just \"ask an LLM\"",
    whyBannerSubtitle: "Dual-rail failover (Gemini + OpenRouter) • Nigeria Authority Router • 5 verdict categories • Claim Guardrail",
    whyBannerBtn: "Compare Architecture",
    speakBtn: "Speak Claim (Voice)",
    speakBtnListening: "Listening... Speak Now",
    uploadBtn: "Upload Image",
    uploadBtnReplace: "Replace Screenshot",
    clearBtn: "Clear",
    pillarsTitle: "The 6 Pillars of Rumour Radar",
    pillarsSubtitle: "How our pipeline ensures factual accuracy and zero hallucination",
    pillar1Title: "Evidence-Grounded",
    pillar1Desc: "Forbidden from using training memory. Synthesizes answers exclusively over live verified sources retrieved for that claim.",
    pillar2Title: "Nigeria-First Router",
    pillar2Desc: "Targeted routing to CBN, INEC, NCDC, JAMB, and WAEC databases prevents social media noise from skewing verdicts.",
    pillar3Title: "Deterministic Scoring",
    pillar3Desc: "Formula: 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context.",
    pillar4Title: "Fixed Verdict Schema",
    pillar4Desc: "Strict schema: Supported, Contradicted, Misleading, Satire, or Unverified with verified source citations & timestamps.",
    pillar5Title: "Built-in Humility",
    pillar5Desc: "If confidence falls below 60%, it deliberately yields Unverified instead of hallucinating.",
    pillar6Title: "Production Hardened",
    pillar6Desc: "Fast cache layer, multi-search provider fallback chains, and adversarial defense against Nigerian satire & jailbreaks."
  },
  pcm: {
    heroTagline: "Check viral tweets for X, WhatsApp messages, TikTok video text, and news tori against official government office & BMONI bank record.",
    searchPlaceholder: "Copy tweet from X (Twitter), WhatsApp message, TikTok text, Telegram message, news link, or upload screenshot make we check am...",
    checkClaimBtn: "Check Dis Tori",
    scanningText: "We Dey Find Proof...",
    presetsTitle: "Try dis viral tori wey people dey share",
    tabVerify: "Check Tori",
    tabShield: "Company Guard",
    tabHeatmap: "Naija Map Alert",
    tabDeepfake: "Fake Video Scanner",
    tabAbout: "About Us",
    officialVerdict: "Truth Wey Dey Ground",
    checkedClaim: "Tori Wey We Check:",
    evidenceExplanation: "Why E Be So (Proof Wey We Find)",
    listenAudio: "Listen Voice",
    shareWhatsApp: "Share WhatsApp",
    shareX: "Post to X",
    permalink: "Share Link",
    whyModalTitle: "Why RumourRadar?",
    bmoniButton: "BMONI Bank Rail",
    heroBadge: "Dual-Rail AI Engine • E Dey Protect All Social Media Tori",
    heroTitleWord1: "Stop Lie Lie Tori",
    heroTitleWord2: "Before E Carry Go for Nigeria",
    whyBannerTitle: "Why Rumour Radar No Be \"Ask Normal ChatGPT\"",
    whyBannerSubtitle: "Dual-rail failover AI • Naija Government Office Search • 5 Truth Categories • Claim Guardrail",
    whyBannerBtn: "See Comparison",
    speakBtn: "Talk Am Give Us (Voice)",
    speakBtnListening: "We Dey Hear You... Talk Now",
    uploadBtn: "Upload Picture",
    uploadBtnReplace: "Change Picture",
    clearBtn: "Clear All",
    pillarsTitle: "The 6 Pillar Wey Rumour Radar Stand On",
    pillarsSubtitle: "How our engine dey ensure zero lie & pure proof",
    pillar1Title: "Solid Proof Only",
    pillar1Desc: "AI no dey use memory guess answer. E dey use real news & government proof wey e find for internet.",
    pillar2Title: "Naija Government Router",
    pillar2Desc: "Direct search to CBN, INEC, NCDC, JAMB, and WAEC so social media noise no go spoil truth.",
    pillar3Title: "Clear Math Scoring",
    pillar3Desc: "Math Formula: 0.30×Authority + 0.25×Relevance + 0.20×Recency + 0.15×Corroboration + 0.10×Context.",
    pillar4Title: "5 Truth Categories",
    pillar4Desc: "Strict categories: Supported, Contradicted, Misleading, Satire, or Unverified with real source link & time.",
    pillar5Title: "No Guessing Rule",
    pillar5Desc: "If proof no reach 60%, e dey talk Unverified instead of guessing lie.",
    pillar6Title: "Strong & Fast Defense",
    pillar6Desc: "Fast memory cache, fallback search, and defense against fake comedy skits & tricks."
  }
};
