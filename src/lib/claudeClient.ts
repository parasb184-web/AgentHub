import Anthropic from '@anthropic-ai/sdk';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { geminiAnalyze, isGeminiConfigured } from './geminiClient';
import crypto from 'crypto';

// A placeholder key keeps builds working without credentials; isClaudeConfigured
// lets callers fail fast in demo mode instead of waiting on a doomed request.
export const isClaudeConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

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

  // Anthropic is optional. With no ANTHROPIC_API_KEY but a Gemini key present,
  // run the same prompt through Gemini so these features still work.
  if (!isClaudeConfigured) {
    if (isGeminiConfigured) {
      return geminiAnalyze(prompt, cacheKey, ttlHours);
    }
    throw new Error(
      "Neither ANTHROPIC_API_KEY nor GEMINI_API_KEY is set - AI analysis unavailable."
    );
  }

  const message = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: prompt }]
  });

  // `content` is a discriminated union and adaptive thinking puts a thinking
  // block first, so collect the text blocks rather than indexing content[0].
  const result = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  try {
    await setDoc(cacheRef, { result, createdAt: Timestamp.now(), prompt: cacheKey });
  } catch (e) {
    console.warn("Firestore cache write failed", e);
  }

  return result;
}
