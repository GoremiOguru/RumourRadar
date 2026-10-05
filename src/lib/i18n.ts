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
    heroTagline: "Engineered for ALL social media platforms — especially where rumors spread fastest like WhatsApp & X (Twitter) — plus TikTok, Telegram, Facebook, and newsrooms.",
    searchPlaceholder: "Paste any WhatsApp forward, tweet from X, TikTok post, Telegram message, Facebook post, news link, or screenshot to verify...",
    checkClaimBtn: "Check This Claim",
    scanningText: "Finding Proof...",
    presetsTitle: "Try a viral rumor circulating right now on WhatsApp & X",
    tabVerify: "Claim Verify",
    tabShield: "Brand Shield",
    tabHeatmap: "Geo Heatmap",
    tabDeepfake: "Deepfake Scanner",
    tabAbout: "About RumourRadar",
    officialVerdict: "Official Verdict",
    checkedClaim: "Checked Claim:",
    evidenceExplanation: "Evidence-Based Explanation",
    listenAudio: "Listen Audio",
    shareWhatsApp: "Share to WhatsApp",
    shareX: "Post to X (Twitter)",
    permalink: "Permalink",
    whyModalTitle: "Why RumourRadar?",
    bmoniButton: "BMONI Rails",
    heroBadge: "Real-Time Defense for ALL Social Media • Built for WhatsApp & X Speed",
    heroTitleWord1: "Stop Rumors",
    heroTitleWord2: "Before They Spread in Nigeria",
    whyBannerTitle: "Why Rumour Radar is better than generic AI",
    whyBannerSubtitle: "Built specifically to stop viral falsehoods across WhatsApp groups, X threads, and social feeds using grounded official data.",
    whyBannerBtn: "How It Works",
    speakBtn: "Speak Claim (Voice)",
    speakBtnListening: "Listening... Speak Now",
    uploadBtn: "Upload Image",
    uploadBtnReplace: "Replace Screenshot",
    clearBtn: "Clear",
    pillarsTitle: "How Rumour Radar Works",
    pillarsSubtitle: "Simple breakdown of how we verify facts without guessing across all social channels",
    pillar1Title: "Real Live Proof",
    pillar1Desc: "Uses live official reports and news desk updates instead of outdated AI memory.",
    pillar2Title: "Nigeria Authority Check",
    pillar2Desc: "Checks official portals like CBN, INEC, NCDC, JAMB, and WAEC for verified statements.",
    pillar3Title: "Smart Source Scoring",
    pillar3Desc: "Ranks news by source credibility, official authority, and freshness.",
    pillar4Title: "Clear Verdicts",
    pillar4Desc: "Gives clear results (Supported, Contradicted, Misleading, Satire, or Unverified) with source links.",
    pillar5Title: "Honest When Unsure",
    pillar5Desc: "If there is not enough proof, Rumour Radar honestly tells you it is Unverified.",
    pillar6Title: "Built for WhatsApp, X & All Socials",
    pillar6Desc: "Instant checks engineered for platforms where rumors spread the fastest: WhatsApp group broadcasts, X threads, TikTok, Telegram, and Facebook."
  },
  pcm: {
    heroTagline: "We build am for ALL social media platforms — especially places wey lie lie dey run fastest like WhatsApp & X (Twitter) — plus TikTok, Telegram, Facebook & Instagram.",
    searchPlaceholder: "Copy WhatsApp message, tweet from X (Twitter), TikTok text, Telegram forward, Facebook post, news link, or upload screenshot make we check am...",
    checkClaimBtn: "Check Dis Tori",
    scanningText: "We Dey Find Proof...",
    presetsTitle: "Try dis viral tori wey dey hot for WhatsApp & X now",
    tabVerify: "Check Tori",
    tabShield: "Company Guard",
    tabHeatmap: "Naija Map Alert",
    tabDeepfake: "Fake Video Catch",
    tabAbout: "About Radar",
    officialVerdict: "Truth Wey Dey Ground",
    checkedClaim: "Tori Wey We Check:",
    evidenceExplanation: "Why E Be So (Proof Wey We Find)",
    listenAudio: "Listen Voice",
    shareWhatsApp: "Share WhatsApp",
    shareX: "Post to X",
    permalink: "Share Link",
    whyModalTitle: "Why RumourRadar?",
    bmoniButton: "BMONI Bank Rail",
    heroBadge: "Dual-Rail AI Engine • E Dey Protect WhatsApp, X & All Social Media",
    heroTitleWord1: "Stop Lie Lie Tori",
    heroTitleWord2: "Before E Carry Go for Nigeria",
    whyBannerTitle: "Why Rumour Radar No Be \"Ask Normal ChatGPT\"",
    whyBannerSubtitle: "E dey fight viral fake news for WhatsApp group, X threads & social media with real government proof.",
    whyBannerBtn: "See Comparison",
    speakBtn: "Talk Am Give Us (Voice)",
    speakBtnListening: "We Dey Hear You... Talk Now",
    uploadBtn: "Upload Picture",
    uploadBtnReplace: "Change Picture",
    clearBtn: "Clear All",
    pillarsTitle: "The 6 Pillar Wey Rumour Radar Stand On",
    pillarsSubtitle: "How our engine dey ensure zero lie & pure proof across all social channels",
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
    pillar6Title: "Built for WhatsApp, X & All Social Media",
    pillar6Desc: "Fast memory cache and instant debunk kits custom-built for WhatsApp group chats, X viral posts, TikTok, and Telegram channels."
  }
};
