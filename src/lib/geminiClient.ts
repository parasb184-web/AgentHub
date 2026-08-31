import { GoogleGenerativeAI } from '@google/generative-ai';
import { readCache, writeCache } from './aiCache';

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

// gemini-2.0-flash was retired and now 404s. Override with GEMINI_MODEL if this
// one is ever retired too; `gemini-flash-latest` tracks the current flash model.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function geminiAnalyze(
  prompt: string,
  cacheKey: string,
  ttlHours: number = 24
): Promise<string> {
  if (!isGeminiConfigured) {
    throw new Error('GEMINI_API_KEY is not set - Gemini analysis unavailable.');
  }

  const cached = await readCache('gemini_cache', cacheKey, ttlHours);
  if (cached) return cached;

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const response = await model.generateContent(prompt);
  const result = response.response.text();

  await writeCache('gemini_cache', cacheKey, result);

  return result;
}
