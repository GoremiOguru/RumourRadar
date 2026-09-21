import OpenAI from 'openai';

/**
 * OpenRouter API Key loaded securely from .env.local
 */
export const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';

/**
 * Central OpenRouter Client
 * 
 * Notice baseURL is 'https://openrouter.ai/api/v1'.
 * This redirects all standard OpenAI method calls to OpenRouter's universal gateway!
 */
export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: openRouterApiKey || 'sk-or-v1-placeholder-key',
  defaultHeaders: {
    'HTTP-Referer': 'https://rumourradar.vercel.app',
    'X-Title': 'Rumour Radar Nigeria',
  },
});

/**
 * High-performing 100% free models on OpenRouter
 * LLaMA 3.3 70B: Outstanding reasoning and multilingual/slang awareness.
 * Gemini 2.0 Flash: Extremely fast fallback.
 * Qwen 2.5 72B: Excellent at strict structured JSON formats.
 */
export const FREE_MODELS = {
  PRIMARY: 'openrouter/free',
  FALLBACK: 'google/gemma-4-31b-it:free',
  JSON_SPECIALIST: 'qwen/qwen3.8-27b:free',
} as const;
