import { NextRequest, NextResponse } from 'next/server';
import { BrandShieldScanResult, BrandAlert, DebunkKit } from '@/types';
import * as cheerio from 'cheerio';
import { executeLlmWithFailover } from '@/lib/gemini';

export interface VerifiedBrandNewsItem {
  id: string;
  title: string;
  snippet: string;
  link: string;
  source: string;
  publishedDate: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

const KNOWN_PEOPLE = [
  'davido', 'burna boy', 'wizkid', 'hilda baci', 'tiwa savage', 'don jazzy', 
  'asake', 'tony elumelu', 'tunde ednut', 'rema', 'olamide', 'ayra starr', 
  'peter obi', 'tinubu', 'portable', 'symply tacha', 'falz', 'funke akindele',
  'genevieve nnaji', 'kizz daniel', 'seyi vibez', 'wandecoal', 'mr eazi', 'ebuka'
];

const KNOWN_AGENCIES = [
  'cbn', 'inec', 'efcc', 'ncdc', 'nnpc', 'ncaa', 'jamb', 'waec', 'nafdac', 
  'frsc', 'police', 'customs', 'firs', 'sec', 'ndlea'
];

function detectEntityCategory(brandName: string, requestedCategory?: string): 'creator' | 'corporation' | 'agency' {
  if (requestedCategory === 'creator' || requestedCategory === 'corporation' || requestedCategory === 'agency') {
    return requestedCategory;
  }
  const lower = brandName.toLowerCase();
  if (KNOWN_PEOPLE.some(p => lower.includes(p))) return 'creator';
  if (KNOWN_AGENCIES.some(a => lower.includes(a))) return 'agency';
  return 'corporation';
}

function cleanStoryTitle(title?: string): string {
  if (!title) return '';
  return title
    .replace(/\s*-\s*[^ -]+(\s+[^ -]+)?$/i, '') // Remove publisher suffix like "- Punch Newspapers"
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Generates an authentic, persona-tailored, article-specific PR debunk kit
 */
async function generateTailoredDebunkKit(
  brandName: string,
  category: 'creator' | 'corporation' | 'agency',
  targetTitle?: string,
  targetSnippet?: string
): Promise<DebunkKit> {
  const cleanTitle = cleanStoryTitle(targetTitle) || `unverified circulating claims regarding ${brandName}`;
  const cleanSnippet = targetSnippet ? targetSnippet.slice(0, 200) : '';

  // 1. Attempt AI Generation via LLM for hyper-realistic and context-tailored copy
  const isPerson = category === 'creator';
  const isAgency = category === 'agency';

  const prompt = `You are a Crisis PR Communications Director in Nigeria.
Generate a platform-tailored PR Debunk & Clarification Kit for the entity: "${brandName}".

ENTITY TYPE: ${isPerson ? 'Individual Public Figure / Creator / Celebrity (Must use natural, authentic, direct voice)' : isAgency ? 'Federal Regulatory Agency / Government Body (Formal government gazette disclaimer tone)' : 'Corporation / Bank / Enterprise (Customer-protective, reassuring corporate communications tone)'}
SPECIFIC STORY / RUMOR BEING ADDRESSED:
Title: "${cleanTitle}"
Context: "${cleanSnippet}"

REQUIREMENTS:
1. Make every post EXPLICITLY reference the specific story topic ("${cleanTitle}") so it does not feel like a generic placeholder.
2. If it's a person/creator (like Davido or Burna Boy), write like the actual person or their close management speaking directly to fans and partners ("Hey guys / To all my fans: Disregard the fake news claiming..."). Never use robotic corporate speak like "All Davido operations remain 100% active".
3. If it's a bank/corporation, protect customers, warn against fake promo/phishing links, and confirm secure operations.
4. Emphasize checking ONLY official verified handles.
5. Provide tailored versions for Twitter/X (punchy with emojis and hashtags), WhatsApp (formatted with bold *...* for broadcast chains), LinkedIn (formal executive memo), and Instagram (engaging caption).

Return ONLY a valid JSON object matching this schema:
{
  "officialStatementDraft": "Formal clarification statement draft",
  "bulletPoints": ["Key clarification point 1", "Key clarification point 2", "Key clarification point 3"],
  "suggestedAction": "Recommended PR distribution strategy",
  "twitterPost": "X / Twitter post copy",
  "whatsappBroadcastTemplate": "WhatsApp broadcast copy with *bold* formatting",
  "linkedInStatement": "LinkedIn / Management memo copy",
  "facebookInstagramCaption": "Instagram caption copy"
}`;

  try {
    const aiResponse = await executeLlmWithFailover(prompt, { maxTokens: 800, temperature: 0.2 });
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.officialStatementDraft && parsed.twitterPost) {
        return {
          brandName,
          targetRumour: cleanTitle,
          officialStatementDraft: parsed.officialStatementDraft,
          bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [
            `Official verification confirms the circulating narrative regarding "${cleanTitle}" is false.`,
            `Authentic notices are exclusively published on verified handles.`,
            `The public is advised not to forward unverified broadcasts.`
          ],
          suggestedAction: parsed.suggestedAction || 'Deploy rapid broadcast across verified channels within 60 minutes.',
          twitterPost: parsed.twitterPost,
          whatsappBroadcastTemplate: parsed.whatsappBroadcastTemplate,
          linkedInStatement: parsed.linkedInStatement,
          facebookInstagramCaption: parsed.facebookInstagramCaption
        };
      }
    }
  } catch (err) {
    console.warn('[BrandShield] LLM Debunk Kit generation fallback:', err);
  }

  // 2. High-Quality Deterministic Persona-Aware Fallback
  if (isPerson) {
    return {
      brandName,
      targetRumour: cleanTitle,
      officialStatementDraft: `LAGOS, NIGERIA — The Management of ${brandName} has released an official statement addressing viral online publications claiming that "${cleanTitle}". We categorically state that these reports are entirely false, fabricated, and malicious. ${brandName} remains fully focused on creative and professional engagements. The public is advised to disregard any announcements not originating from verified official channels.`,
      bulletPoints: [
        `Directly addresses the circulating report regarding "${cleanTitle}".`,
        `Confirms that neither ${brandName} nor management authorized the claims.`,
        `Fans and the public are urged to verify all news on official social accounts.`
      ],
      suggestedAction: `Publish direct video or story clarification on Instagram & X within 2 hours of viral spike.`,
      twitterPost: `🚨 PUBLIC CLARIFICATION: Please disregard the false rumor circulating regarding "${cleanTitle}". It is completely fake cap! Always check my official verified handles for genuine updates. 🇳🇬 #OfficialStatement #${brandName.replace(/\s+/g, '')}`,
      whatsappBroadcastTemplate: `⚠️ *DIRECT PUBLIC CLARIFICATION FROM ${brandName.toUpperCase()}'S MEDIA DESK*\n\n` +
        `We urge all fans, partners, and the general public to completely disregard the viral message claiming that *"${cleanTitle}"*.\n\n` +
        `❌ *FACT:* This report is 100% fabricated and does NOT originate from ${brandName} or authorized representatives.\n\n` +
        `🔐 Always verify information directly from official verified handles before forwarding.`,
      linkedInStatement: `Public Statement from the Management of ${brandName}: In light of unsubstantiated digital publications claiming "${cleanTitle}", we categorically refute these narratives. All ongoing projects, partnerships, and brand representations continue uninterrupted. Legal teams are monitoring defamatory publications.`,
      facebookInstagramCaption: `To all my fans, family & supporters: My attention has been drawn to viral posts claiming "${cleanTitle}". This is completely FALSE and unverified. Always verify news directly on my official verified handles before believing rumors. Much love! 🇳🇬❤️ #${brandName.replace(/\s+/g, '')}`
    };
  }

  if (isAgency) {
    return {
      brandName,
      targetRumour: cleanTitle,
      officialStatementDraft: `ABUJA, NIGERIA — The Management of the ${brandName} issues a formal rebuttal regarding circulating circulars and media reports alleging that "${cleanTitle}". The public is hereby notified that no such policy directive, directive, or statement has emanated from the ${brandName}. All official regulatory notices are published exclusively on official federal portals and gazettes.`,
      bulletPoints: [
        `Rebuttal against doctored circulars concerning "${cleanTitle}".`,
        `Reiterates that authentic directives are only issued through official gazettes and portals.`,
        `Warns against falling for fraudulent impersonation schemes.`
      ],
      suggestedAction: `Issue emergency press bulletin to national newsdesks and pin disclaimer on official X page.`,
      twitterPost: `🚨 REGULATORY DISCLAIMER: The ${brandName} has NOT issued any directive concerning "${cleanTitle}". The public is warned against forged circulars. Official gazettes are published exclusively on official portals. #${brandName}Alert`,
      whatsappBroadcastTemplate: `⚠️ *OFFICIAL REGULATORY DISCLAIMER FROM ${brandName.toUpperCase()}*\n\n` +
        `The general public is strictly advised to disregard circulating circulars claiming that *"${cleanTitle}"*.\n\n` +
        `❌ *OFFICIAL POSITION:* No such directive has been issued by ${brandName}.\n\n` +
        `🏛️ Cross-check all government directives on verified official government channels.`,
      linkedInStatement: `${brandName} Public Advisory: We formally clarify that recent digital circulation concerning "${cleanTitle}" is unauthorized and inaccurate. Regulated institutions and stakeholders should adhere only to official gazetted communication.`,
      facebookInstagramCaption: `DISCLAIMER NOTICE: The ${brandName} has not issued any announcement regarding "${cleanTitle}". Disregard false circulars. 🏛️`
    };
  }

  // Corporate / Enterprise Default
  return {
    brandName,
    targetRumour: cleanTitle,
    officialStatementDraft: `LAGOS, NIGERIA — The Executive Communications Directorate of ${brandName} formally addresses circulating false narratives alleging that "${cleanTitle}". The institution reassures all customers, partners, and stakeholders that corporate operations, systems, and consumer services remain completely secure and uninterrupted. The public is advised to disregard fraudulent forwards and rely exclusively on verified institutional channels.`,
    bulletPoints: [
      `Formally dispels misleading claims regarding "${cleanTitle}".`,
      `Reassures stakeholders that institutional operations and customer funds remain 100% safe.`,
      `Warns users never to share OTPs, passwords, or financial credentials on unofficial handles.`
    ],
    suggestedAction: `Trigger automated customer advisory across mobile banking push notifications and WhatsApp verified channel.`,
    twitterPost: `⚠️ CUSTOMER ADVISORY: Please disregard misleading messages claiming "${cleanTitle}". All ${brandName} operations and customer services remain 100% safe and fully operational. Never share your OTP or confidential PIN on unofficial channels! #${brandName}Care`,
    whatsappBroadcastTemplate: `🚨 *OFFICIAL SECURITY ADVISORY FROM ${brandName.toUpperCase()}*\n\n` +
      `Our attention has been drawn to misleading WhatsApp forwards claiming that *"${cleanTitle}"*.\n\n` +
      `✅ *FACT:* All ${brandName} infrastructure, customer accounts, and branches are operating at 100% capacity with zero disruptions.\n\n` +
      `🔒 We will *NEVER* ask for your OTP, PIN, or login credentials via social media. Always verify news on our official website.`,
    linkedInStatement: `Institutional Stakeholder Update: ${brandName} addresses recent unsubstantiated digital chatter regarding "${cleanTitle}". We reassure all corporate partners, investors, and clients that institutional governance and infrastructure remain robust and fully operational.`,
    facebookInstagramCaption: `IMPORTANT ADVISORY: Don't fall for fake circulars claiming "${cleanTitle}"! 🛡️ All ${brandName} operations are 100% active and secure. Always verify with our official page. #${brandName}Safety`
  };
}

function isRelevantToSubject(title: string, snippet: string, brandName: string): boolean {
  const text = `${title} ${snippet}`.toLowerCase();
  const brandLower = brandName.toLowerCase();

  const words = brandLower.split(/\s+/).filter(w => w.length > 2);
  const matchesBrand = text.includes(brandLower) || (words.length > 0 && words.every(w => text.includes(w)));

  const isUnrelatedForeignCase = 
    (text.includes('london police') || text.includes('1976 theft') || text.includes('court of appeal') || text.includes('ridge-well')) &&
    !text.includes('nigeria') && !text.includes('lagos') && !text.includes('restaurant') && !text.includes('uac');

  return matchesBrand && !isUnrelatedForeignCase;
}

/**
 * Fetches real-time news via Google News RSS for a specific brand/person over the past 7 days with strict relevance filtering
 */
async function fetchBrandNewsAndRumours(brandName: string) {
  const brandNews: VerifiedBrandNewsItem[] = [];
  const rawRumours: Array<{ title: string; snippet: string; link: string; date: string; source: string }> = [];

  try {
    const generalQuery = encodeURIComponent(`"${brandName}" (Nigeria OR Nigerian OR business OR restaurant OR bank OR company OR creator OR executive OR Lagos) when:7d`);
    const generalRssUrl = `https://news.google.com/rss/search?q=${generalQuery}&hl=en-NG&gl=NG&ceid=NG:en`;

    const rumourQuery = encodeURIComponent(`"${brandName}" (rumour OR fake OR scam OR warning OR circular OR claim OR closure OR fraud OR probe) when:7d`);
    const rumourRssUrl = `https://news.google.com/rss/search?q=${rumourQuery}&hl=en-NG&gl=NG&ceid=NG:en`;

    const [generalRes, rumourRes] = await Promise.allSettled([
      fetch(generalRssUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 30 }
      }),
      fetch(rumourRssUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 30 }
      })
    ]);

    if (generalRes.status === 'fulfilled' && generalRes.value.ok) {
      const xml = await generalRes.value.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      $('item').slice(0, 10).each((i, el) => {
        const title = $(el).find('title').text() || '';
        const link = $(el).find('link').text() || '';
        const pubDate = $(el).find('pubDate').text() || '';
        const desc = $(el).find('description').text() || '';
        const source = $(el).find('source').text() || 'Nigerian Press Desk';

        const cleanSnippet = desc.replace(/<[^>]*>?/gm, '').replace(/https?:\/\/[^\s]+/g, '').trim();

        if (title.length > 5 && isRelevantToSubject(title, cleanSnippet, brandName)) {
          const lower = title.toLowerCase();
          const sentiment: VerifiedBrandNewsItem['sentiment'] =
            lower.includes('profit') || lower.includes('growth') || lower.includes('award') || lower.includes('expand') ? 'POSITIVE' :
            lower.includes('scam') || lower.includes('probe') || lower.includes('loss') || lower.includes('fine') ? 'NEGATIVE' : 'NEUTRAL';

          brandNews.push({
            id: `brand-news-${i}-${Date.now()}`,
            title,
            snippet: cleanSnippet.slice(0, 180) || `Verified reporting from ${source}.`,
            link,
            source,
            publishedDate: pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'This Week',
            sentiment
          });
        }
      });
    }

    if (rumourRes.status === 'fulfilled' && rumourRes.value.ok) {
      const xml = await rumourRes.value.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      $('item').slice(0, 6).each((_, el) => {
        const title = $(el).find('title').text() || '';
        const link = $(el).find('link').text() || '';
        const pubDate = $(el).find('pubDate').text() || '';
        const desc = $(el).find('description').text() || '';
        const source = $(el).find('source').text() || 'Social Surveillance';

        const cleanSnippet = desc.replace(/<[^>]*>?/gm, '').replace(/https?:\/\/[^\s]+/g, '').trim();

        if (title && isRelevantToSubject(title, cleanSnippet, brandName)) {
          rawRumours.push({
            title,
            snippet: cleanSnippet.slice(0, 180),
            link,
            date: pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent',
            source
          });
        }
      });
    }
  } catch (err) {
    console.warn('[BrandShield] RSS fetch notice:', err);
  }

  return { brandNews, rawRumours };
}

export async function POST(req: NextRequest) {
  try {
    const { brandName = 'GTBank', entityCategory, targetStoryTitle, targetStorySnippet } = await req.json();
    const cleanBrand = brandName.trim();
    const category = detectEntityCategory(cleanBrand, entityCategory);

    const { brandNews, rawRumours } = await fetchBrandNewsAndRumours(cleanBrand);

    const alerts: BrandAlert[] = [];

    if (rawRumours.length > 0) {
      rawRumours.slice(0, 4).forEach((r, idx) => {
        alerts.push({
          id: `alert-live-${idx + 1}`,
          title: r.title,
          summary: r.snippet || `Monitored controversy involving ${cleanBrand}.`,
          sourceUrl: r.link,
          sourceName: r.source,
          publishedDate: r.date,
          severity: idx === 0 ? 'CRITICAL' : 'HIGH',
          category: 'VIRAL_RUMOUR',
          verdictRecommendation: 'CONTRADICTED',
          confidenceScore: 92
        });
      });
    }

    const overallThreat: BrandShieldScanResult['threatLevel'] = alerts.length === 0
      ? 'CLEAR'
      : alerts.some(a => a.severity === 'CRITICAL')
      ? 'CRITICAL'
      : 'ELEVATED';

    // Pick top threat or custom target story for the initial debunk kit
    const chosenStoryTitle = targetStoryTitle || alerts[0]?.title || brandNews[0]?.title || `general public updates for ${cleanBrand}`;
    const chosenStorySnippet = targetStorySnippet || alerts[0]?.summary || brandNews[0]?.snippet || '';

    const debunkKit = await generateTailoredDebunkKit(
      cleanBrand,
      category,
      chosenStoryTitle,
      chosenStorySnippet
    );

    const scanResult: BrandShieldScanResult & { recentWeeklyNews: VerifiedBrandNewsItem[] } = {
      brandName: cleanBrand,
      scannedAt: new Date().toISOString(),
      threatLevel: overallThreat,
      totalAlerts: alerts.length,
      alerts,
      debunkKit,
      recentWeeklyNews: brandNews
    };

    return NextResponse.json({
      success: true,
      result: scanResult
    });
  } catch (err) {
    console.error('Brand Shield Scan API Error:', err);
    return NextResponse.json({ error: 'Failed to complete brand surveillance scan' }, { status: 500 });
  }
}
