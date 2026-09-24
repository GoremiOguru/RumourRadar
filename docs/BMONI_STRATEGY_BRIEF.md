# RumourRadar & BMONI: Strategic Architecture & Monetization Whitepaper

## 1. Executive Summary
The standard approach to fintech integration in civic tech—paying citizens token micro-bounties for submitting evidence—creates fatal misaligned incentives. It encourages Sybil attacks, manufactured evidence, and introduces complex KYC obligations for anonymous citizens.

**RumourRadar inverts this paradigm.** Rather than paying for evidence, we use BMONI to *monetize access, institutional threat intelligence, and verified newsroom support*. This preserves 100% evidence integrity while embedding BMONI as an indispensable B2B revenue and micro-donation infrastructure.

---

## 2. Architectural Comparison

| Dimension | ❌ Citizen Evidence Bounty Model | ✅ RumourRadar + BMONI Model |
| :--- | :--- | :--- |
| **Evidence Integrity** | **High Risk:** Users game prompts and falsify data to farm micro-bounties. | **Pristine:** 100% deterministic & evidence-grounded AI synthesis. |
| **BMONI Usage** | **Forced:** High-friction micro-payouts to anonymous citizens. | **Native:** NGN Virtual Bank Accounts & Verified Bank Rails. |
| **Business Model** | **Unsustainable:** High grant/cash burn on payouts. | **High MRR:** B2B SaaS Subscriptions for Brands & Newsrooms. |
| **Compliance / KYC** | **Complex:** High barrier BVN requirements for every citizen. | **Streamlined:** B2B institutional onboarding via BMONI. |

---

## 3. Commercial Offerings Powered by BMONI

### A. Newsroom Pro Tier (₦50,000 / month)
- Dedicated BMONI NGN Virtual Bank Account for automated billing.
- Priority verification queue during breaking news events.
- High-throughput bulk claim verification API key.
- Exportable high-contrast WhatsApp fact-check graphics.

### B. Enterprise Brand Shield (₦250,000 / month)
- Real-time brand misinformation surveillance & social listening.
- Instant WhatsApp & Webhook crisis alerts on false viral memos.
- AI Phishing & Fake Circular Threat Detection.
- 1-Click Auto-Generated PR Debunk Kits (press releases + social assets).

### C. "Support Verified Journalism" Tip Rail
- Located on every fact-check result card next to cited authoritative newsrooms (*Premium Times, Dubawa, TheCable*).
- Users route ₦500 – ₦5,000 micro-tips directly to accredited newsrooms using BMONI's verified Nigerian bank transfer rails (`/verify-nigerian-account` + `/withdrawal-accounts/nigeria`).

---

## 4. Technical BMONI API Integration Blueprint

### Provisioning NGN Virtual Bank Account:
```http
POST /v1/users/{userId}/smart-wallets/{smartWalletId}/onramp/vba/nigeria
```

### Verified Newsroom Bank Transfer:
```http
// 1. Bank Code Lookup
GET /v1/users/{userId}/bank-accounts/nigerian-banks

// 2. Account Name Verification
POST /v1/users/{userId}/bank-accounts/verify-nigerian-account
{ "accountNumber": "0123456789", "bankCode": "058" }

// 3. Register & Settle Transfer
POST /v1/users/{userId}/bank-accounts/withdrawal-accounts/nigeria
```
