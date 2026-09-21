import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  isUrl: boolean;
  url?: string;
  title?: string;
  text?: string;
  sourceDomain?: string;
  extractedQuery?: string;
}

/**
 * Checks if a string contains a valid HTTP/HTTPS URL
 */
export function extractUrlFromText(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches ? matches[0] : null;
}

/**
 * Scrapes news articles from pasted URLs (e.g. Punch, Vanguard, TheCable, Sahara Reporters)
 * and extracts the core headline and text for fact-checking.
 */
export async function scrapeArticleIfUrl(input: string): Promise<ScrapedArticle> {
  const url = extractUrlFromText(input);
  if (!url) {
    return { isUrl: false };
  }

  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        isUrl: true,
        url,
        sourceDomain: domain,
        extractedQuery: input
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, ad tags
    $('script, style, noscript, nav, footer, header, aside, .ad, .ads, .sidebar').remove();

    // Extract title
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('h1').first().text().trim() ||
                  $('title').text().trim();

    // Extract description or body text
    const description = $('meta[property="og:description"]').attr('content') ||
                        $('meta[name="description"]').attr('content');

    // Collect first few paragraphs of article content
    const paragraphs: string[] = [];
    $('article p, .entry-content p, .post-content p, main p, p').each((_, el) => {
      const pText = $(el).text().trim();
      if (pText.length > 40 && !pText.includes('Copyright') && !pText.includes('All rights reserved')) {
        paragraphs.push(pText);
      }
    });

    const bodyContent = paragraphs.slice(0, 3).join(' ');
    const combinedSummary = `${title}. ${description || bodyContent}`.slice(0, 500);

    return {
      isUrl: true,
      url,
      title,
      text: bodyContent || description || title,
      sourceDomain: domain,
      extractedQuery: combinedSummary || input
    };
  } catch (err) {
    console.warn('[UrlScraper] Scrape failed, using raw query:', err);
    return {
      isUrl: true,
      url,
      extractedQuery: input
    };
  }
}
