import { Index } from "@upstash/vector";
import { getEmbedding } from "./embeddings";

const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string || "http://mock.upstash.com",
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string || "mock",
});

export async function upsertAgentVector(agentId: string, text: string) {
  try {
    const vector = await getEmbedding(text);
    await vectorIndex.upsert({
      id: agentId,
      vector,
      metadata: { text }
    });
  } catch (error) {
    console.error("Failed to upsert vector", error);
  }
}

export async function queryNearestAgents(query: string, topK: number = 10) {
  try {
    const vector = await getEmbedding(query);
    const results = await vectorIndex.query({
      vector,
      topK,
      includeMetadata: true
    });
    return results;
  } catch (error) {
    console.error("Failed to query vectors", error);
    return [];
  }
}
