import { NextResponse } from "next/server";
import { queryNearestAgents } from "@/lib/vectorSearch";
import { claudeAnalyze } from "@/lib/claudeClient";
import crypto from "crypto";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAgentById } from "@/lib/firestore";
import { MOCK_AGENTS } from "@/lib/dummyData";
import { Agent } from "@/lib/types";

const SEARCH_SYNONYMS: Record<string, string[]> = {
  study: ["research", "analysis", "summarization", "education", "learning"],
  research: ["study", "analysis", "summarization", "data-extraction"],
  learn: ["study", "education", "summarization"],
  power: ["presentation", "slides", "deck", "ppt", "powerpoint"],
  point: ["presentation", "slides", "deck", "ppt", "powerpoint"],
  powerpoint: ["presentation", "slides", "deck", "ppt"],
  ppt: ["presentation", "slides", "deck", "powerpoint"],
  slides: ["presentation", "deck", "powerpoint", "ppt"],
  presentation: ["slides", "deck", "powerpoint", "ppt", "summarization"],
  write: ["content-creation", "marketing", "generative"],
  code: ["code-review", "code-generation", "testing"],
  data: ["data-extraction", "analytics", "database", "summarization"],
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .filter(Boolean);

const buildReason = (agent: Agent, query: string) => {
  const q = query.toLowerCase();
  const tags = agent.capabilityTags.join(", ");
  if (agent.name.toLowerCase().includes(q)) {
    return `Matches "${query}" directly by name and is focused on ${tags}.`;
  }
  if (agent.description.toLowerCase().includes(q)) {
    return `Its description directly matches "${query}" and aligns with ${tags}.`;
  }
  return `Relevant for "${query}" because it covers ${tags} and supports this workflow.`;
};

const getLocalScore = (agent: Agent, query: string) => {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = tokenize(normalizedQuery);
  const expandedTokens = new Set(
    queryTokens.flatMap((token) => [token, ...(SEARCH_SYNONYMS[token] || [])])
  );

  const searchableText = [
    agent.name,
    agent.description,
    agent.creatorUsername,
    agent.capabilityTags.join(" "),
    agent.supportedLanguages.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  if (searchableText.includes(normalizedQuery)) {
    score += 12;
  }

  for (const token of expandedTokens) {
    if (searchableText.includes(token)) {
      score += queryTokens.includes(token) ? 4 : 2;
    }
  }

  for (const tag of agent.capabilityTags) {
    const normalizedTag = tag.toLowerCase();
    if (expandedTokens.has(normalizedTag)) score += 5;
    if (queryTokens.some((token) => normalizedTag.includes(token))) score += 3;
  }

  return score;
};

const getFallbackResults = (query: string) => {
  return MOCK_AGENTS
    .map((agent) => ({
      agent,
      score: getLocalScore(agent, query),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || (b.agent.rating || 0) - (a.agent.rating || 0))
    .slice(0, 5)
    .map(({ agent }) => ({
      agent,
      matchReason: buildReason(agent, query),
    }));
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const hash = crypto.createHash("md5").update(query).digest("hex");
    const cacheRef = doc(db, "search_cache", hash);

    try {
      const cached = await getDoc(cacheRef);
      if (cached.exists()) {
        const data = cached.data();
        const ageHours = (Date.now() - (data.createdAt as Timestamp).toMillis()) / 3600000;
        if (ageHours < 1) return NextResponse.json(data.results);
      }
    } catch (e) {
      console.warn("Search cache read error", e);
    }

    let validCandidates: Agent[] = [];

    try {
      const nearest = await queryNearestAgents(query, 10);
      const candidateIds = nearest.map((candidate) => String(candidate.id));
      const candidateDocs = await Promise.all(candidateIds.map((id) => getAgentById(id)));
      validCandidates = candidateDocs.filter(Boolean) as Agent[];
    } catch (e) {
      console.warn("Vector search failed, falling back to local ranking", e);
    }

    if (validCandidates.length === 0) {
      return NextResponse.json(getFallbackResults(query));
    }

    const agentListText = validCandidates.map((a) =>
      `ID: ${a.id}\nName: ${a.name}\nDesc: ${a.description}\nTags: ${a.capabilityTags?.join(",")}`
    ).join("\n\n");

    const prompt = `You are a helpful AI agent recommender. A user is looking for: '${query}'. Here are 10 candidate agents:\n\n${agentListText}\n\nReturn a JSON array of the top 5 agents ranked by relevance, with a one-sentence 'matchReason' for each explaining why it fits. Format: [{"id": "...", "matchReason": "..."}]`;

    let claudeResp = "";
    try {
      claudeResp = await claudeAnalyze(prompt, `search-${hash}`, 24);
    } catch (e) {
      console.warn("Claude ranking failed, falling back to local ranking", e);
      return NextResponse.json(getFallbackResults(query));
    }

    // Parse JSON safely
    let aiRanking: { id: string, matchReason: string }[] = [];
    try {
      const jsonStr = claudeResp.substring(claudeResp.indexOf("["), claudeResp.lastIndexOf("]") + 1);
      if (jsonStr) aiRanking = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Claude JSON parse error", e);
    }

    const finalResults = aiRanking.map(rank => {
      const agent = validCandidates.find((a) => a.id === rank.id);
      return { agent, matchReason: rank.matchReason };
    }).filter(r => r.agent);

    if (finalResults.length === 0) {
      return NextResponse.json(getFallbackResults(query));
    }

    try {
      await setDoc(cacheRef, { results: finalResults, queryHash: hash, createdAt: Timestamp.now() });
    } catch (e) {
      console.warn("Search cache write error", e);
    }

    return NextResponse.json(finalResults);
  } catch (error: unknown) {
    console.error("Search route failed", error);
    const message = error instanceof Error ? error.message : "Unknown search error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
