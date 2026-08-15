import { NextResponse } from "next/server";
import {
  FALLBACK_TRENDING_AGENTS,
  TrendingAgentFeedItem,
  TrendingAgentsResponse,
} from "@/lib/homepageFeed";

const SEARCH_WINDOW_DAYS = 21;

interface GitHubRepositoryItem {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  owner?: {
    login?: string;
    avatar_url?: string;
  };
}

const formatDateQualifier = () => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - SEARCH_WINDOW_DAYS);
  return date.toISOString().slice(0, 10);
};

const calculateVelocityScore = (stars: number, forks: number, updatedAt: string) => {
  const updatedMs = new Date(updatedAt).getTime();
  const ageInDays = Math.max(1, (Date.now() - updatedMs) / (1000 * 60 * 60 * 24));
  const momentum = stars * 0.7 + forks * 1.8;
  return Math.round(Math.min(99, momentum / ageInDays / 12));
};

const normalizeRepo = (repo: GitHubRepositoryItem): TrendingAgentFeedItem => ({
  id: repo.id,
  name: repo.name,
  description: repo.description || "Trending AI agent project gaining traction this week.",
  url: repo.html_url,
  owner: repo.owner?.login || "unknown",
  ownerAvatarUrl: repo.owner?.avatar_url || `https://github.com/${repo.owner?.login || "github"}.png`,
  stars: repo.stargazers_count || 0,
  forks: repo.forks_count || 0,
  language: repo.language || "Mixed",
  topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : [],
  updatedAt: repo.updated_at || new Date().toISOString(),
  velocityScore: calculateVelocityScore(
    repo.stargazers_count || 0,
    repo.forks_count || 0,
    repo.updated_at || new Date().toISOString()
  ),
});

export async function GET() {
  const dateQualifier = formatDateQualifier();
  const query = encodeURIComponent(
    `topic:ai-agent pushed:>=${dateQualifier} archived:false`
  );
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=9`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "agenthub-homepage-feed",
      },
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed with ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items.map(normalizeRepo) : [];
    const trending = items.length > 0 ? items.slice(0, 6) : FALLBACK_TRENDING_AGENTS;
    const picked = [...trending]
      .sort((a, b) => b.stars + b.forks - (a.stars + a.forks))
      .slice(0, 3);

    return NextResponse.json<TrendingAgentsResponse>({
      trending,
      picked,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json<TrendingAgentsResponse>({
      trending: FALLBACK_TRENDING_AGENTS,
      picked: FALLBACK_TRENDING_AGENTS.slice(0, 3),
      fetchedAt: new Date().toISOString(),
    });
  }
}
