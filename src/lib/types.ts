export interface Agent {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorUsername: string;
  endpointUrl: string;
  capabilityTags: string[];
  supportedLanguages: string[];
  latencyMs: number;
  costPerCall: number;
  inputSchema: any;
  outputSchema: any;
  exampleInput: any;
  exampleOutput: any;
  version: string;
  status: "draft" | "active" | "suspended";
  trustScore: number;
  totalCalls?: number;
  avgLatencyMs?: number;
  uptimePercent?: number;
  rating: number;
  reviewCount: number;
  createdAt?: any;
  updatedAt?: any;
  rateLimit?: number;
}

export interface AgentCall {
  id: string;
  agentId: string;
  userId: string | null;
  inputPayload: any;
  outputPayload: any;
  latencyMs: number;
  success: boolean;
  timestamp: any;
}

export interface AgentReview {
  id: string;
  agentId: string;
  userId: string;
  rating: number;
  body: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  githubUsername: string;
  avatarUrl: string;
  createdAt: any; // Firestore Timestamp
}

export interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  label: string;
  lastUsedAt: any | null; // Firestore Timestamp
  createdAt: any; // Firestore Timestamp
  isActive: boolean;
}

export interface RepoScan {
  repoUrl: string;
  result: any;
  agentMatches: any[];
  createdAt: any;
}

export interface Chain {
  id: string;
  name: string;
  userId: string;
  nodes: any[];
  edges: any[];
  schemaMappings: any;
  createdAt: any;
}

export interface CopyrightClaim {
  id: string;
  agentId: string;
  agentName: string;
  reporterId: string;
  reporterUsername: string;
  originalAgentUrl: string;
  description: string;
  evidenceUrl: string;
  relationship: "creator" | "representative";
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: any;
}
