import Anthropic from '@anthropic-ai/sdk';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import crypto from 'crypto';

// Provide a mock key if it's missing during build to prevent crashing
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "mock" });

export async function claudeAnalyze(
  prompt: string,
  cacheKey: string,
  ttlHours: number = 24
): Promise<string> {
  const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
  const cacheRef = doc(db, 'claude_cache', hash);

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

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  const result = message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    await setDoc(cacheRef, { result, createdAt: Timestamp.now(), prompt: cacheKey });
  } catch (e) {
    console.warn("Firestore cache write failed", e);
  }

  return result;
}
