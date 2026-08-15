export interface TrendingAgentFeedItem {
  id: number;
  name: string;
  description: string;
  url: string;
  owner: string;
  ownerAvatarUrl: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string;
  velocityScore: number;
}

export interface AINewsFeedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface TrendingAgentsResponse {
  trending: TrendingAgentFeedItem[];
  picked: TrendingAgentFeedItem[];
  fetchedAt: string;
}

export interface AINewsResponse {
  items: AINewsFeedItem[];
  fetchedAt: string;
}

export const FALLBACK_TRENDING_AGENTS: TrendingAgentFeedItem[] = [
  {
    id: 1,
    name: "openai-agents-starter",
    description: "Starter kit for shipping production-ready AI agents with evals, tools, and observability.",
    url: "https://github.com/openai/openai-agents-python",
    owner: "openai",
    ownerAvatarUrl: "https://github.com/openai.png",
    stars: 18200,
    forks: 2100,
    language: "Python",
    topics: ["ai-agent", "llm", "automation"],
    updatedAt: "2026-03-18T08:00:00.000Z",
    velocityScore: 96,
  },
  {
    id: 2,
    name: "autogen-lab",
    description: "Multi-agent orchestration patterns for research, collaboration, and autonomous task execution.",
    url: "https://github.com/microsoft/autogen",
    owner: "microsoft",
    ownerAvatarUrl: "https://github.com/microsoft.png",
    stars: 35400,
    forks: 5100,
    language: "Python",
    topics: ["multi-agent", "agent-framework", "research"],
    updatedAt: "2026-03-17T11:20:00.000Z",
    velocityScore: 94,
  },
  {
    id: 3,
    name: "browser-agent",
    description: "Browser automation agent tuned for research, extraction, and repetitive web tasks.",
    url: "https://github.com/browser-use/browser-use",
    owner: "browser-use",
    ownerAvatarUrl: "https://github.com/browser-use.png",
    stars: 22100,
    forks: 2800,
    language: "Python",
    topics: ["browser-automation", "ai-agent", "web"],
    updatedAt: "2026-03-19T05:40:00.000Z",
    velocityScore: 92,
  },
  {
    id: 4,
    name: "crew-ai-playbooks",
    description: "Composable crew workflows for ops, support, sales, and content pipelines.",
    url: "https://github.com/crewAIInc/crewAI",
    owner: "crewAIInc",
    ownerAvatarUrl: "https://github.com/crewAIInc.png",
    stars: 29800,
    forks: 3900,
    language: "Python",
    topics: ["crew", "workflow", "agents"],
    updatedAt: "2026-03-16T14:15:00.000Z",
    velocityScore: 90,
  },
  {
    id: 5,
    name: "langgraph-recipes",
    description: "Stateful agent workflows with branching, retries, and memory patterns.",
    url: "https://github.com/langchain-ai/langgraph",
    owner: "langchain-ai",
    ownerAvatarUrl: "https://github.com/langchain-ai.png",
    stars: 17100,
    forks: 1900,
    language: "Python",
    topics: ["langgraph", "agents", "workflow"],
    updatedAt: "2026-03-18T17:30:00.000Z",
    velocityScore: 88,
  },
  {
    id: 6,
    name: "agent-ui-kit",
    description: "UI primitives for agent dashboards, traces, chat panels, and tool call streams.",
    url: "https://github.com/vercel/ai",
    owner: "vercel",
    ownerAvatarUrl: "https://github.com/vercel.png",
    stars: 15400,
    forks: 1800,
    language: "TypeScript",
    topics: ["agent-ui", "nextjs", "llm"],
    updatedAt: "2026-03-19T09:05:00.000Z",
    velocityScore: 86,
  },
];

export const FALLBACK_AI_NEWS: AINewsFeedItem[] = [
  {
    id: "news-1",
    title: "AI agent frameworks keep expanding into enterprise operations and workflow automation",
    url: "https://news.google.com/",
    source: "Google News",
    publishedAt: "2026-03-19T07:00:00.000Z",
  },
  {
    id: "news-2",
    title: "Open-source agent tooling sees renewed momentum across browser, coding, and research stacks",
    url: "https://news.google.com/",
    source: "Google News",
    publishedAt: "2026-03-18T12:30:00.000Z",
  },
  {
    id: "news-3",
    title: "Teams are pairing model APIs with evals and tracing to make AI agents production-ready",
    url: "https://news.google.com/",
    source: "Google News",
    publishedAt: "2026-03-17T15:10:00.000Z",
  },
  {
    id: "news-4",
    title: "Developer marketplaces are increasingly bundling agent search, verification, and usage signals",
    url: "https://news.google.com/",
    source: "Google News",
    publishedAt: "2026-03-16T10:45:00.000Z",
  },
];
