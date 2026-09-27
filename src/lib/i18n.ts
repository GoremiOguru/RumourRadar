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
    bmoniButton: "BMONI Rails"
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
    bmoniButton: "BMONI Bank Rail"
  }
};
