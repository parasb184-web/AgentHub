import Anthropic from '@anthropic-ai/sdk';
import { geminiAnalyze, isGeminiConfigured } from './geminiClient';
import { readCache, writeCache } from './aiCache';

// A placeholder key keeps builds working without credentials; isClaudeConfigured
// lets callers fail fast in demo mode instead of waiting on a doomed request.
export const isClaudeConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "mock" });

export async function claudeAnalyze(
  prompt: string,
  cacheKey: string,
  ttlHours: number = 24
): Promise<string> {
  const cached = await readCache('claude_cache', cacheKey, ttlHours);
  if (cached) return cached;

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

  await writeCache('claude_cache', cacheKey, result);

  return result;
}
