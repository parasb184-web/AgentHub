import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import crypto from 'crypto';

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

  const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
  const cacheRef = doc(db, 'gemini_cache', hash);

  try {
    const cached = await getDoc(cacheRef);
    if (cached.exists()) {
      const data = cached.data();
      const ageHours = (Date.now() - (data.createdAt as Timestamp).toMillis()) / 3600000;
      if (ageHours < ttlHours) return data.result;
    }
  } catch (e) {
    console.warn("Firestore cache read failed, falling back to API", e);
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const response = await model.generateContent(prompt);
  const result = response.response.text();

  try {
    await setDoc(cacheRef, { result, createdAt: Timestamp.now(), prompt: cacheKey });
  } catch (e) {
    console.warn("Firestore cache write failed", e);
  }

  return result;
}
