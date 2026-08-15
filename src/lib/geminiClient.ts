import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function geminiAnalyze(
  prompt: string,
  cacheKey: string,
  ttlHours: number = 24
): Promise<string> {
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

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const response = await model.generateContent(prompt);
  const result = response.response.text();

  try {
    await setDoc(cacheRef, { result, createdAt: Timestamp.now(), prompt: cacheKey });
  } catch (e) {
    console.warn("Firestore cache write failed", e);
  }

  return result;
}
