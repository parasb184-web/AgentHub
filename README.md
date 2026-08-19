# AgentHub

**Discover, test, and integrate AI agents from one platform.**

AgentHub is a marketplace and testing surface for production-ready AI agents. Browse agents by capability, validate them against a live sandbox before you commit, chain several into a multi-step workflow, and scan any GitHub repository to find where an agent would actually save your team time.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## Features

| Feature | Route | What it does |
| --- | --- | --- |
| **Agent directory** | `/agents` | Browse and filter agents by capability tag, language, latency, and cost. Each agent carries a trust score, rating, and uptime figure. |
| **Live sandbox** | `/agents/[id]` | Fire a real request at an agent's endpoint and inspect the response, latency, and errors before integrating. Requires an API key. |
| **Repo scanner** | `/scan` | Point it at a GitHub repo. It reads the languages, open issues, recent commits, and README, then proposes concrete agent opportunities with an estimated time saved. |
| **Chain studio** | `/chains` | Compose multi-agent workflows on a React Flow canvas, with a schema mapper for wiring one agent's output into the next one's input. |
| **Gap detection** | `/api/gap-detect` | Embeds a repo's languages and tags, finds the nearest already-scanned repos, and surfaces agent categories you are missing. |
| **Semantic search** | `/api/search` | Vector search over agent embeddings, with a synonym layer so "ppt" finds presentation agents. |
| **Publishing flow** | `/publish` | Four-step form to list an agent: basics, technical schema, pricing, and worked examples. |
| **Developer dashboard** | `/dashboard` | Issue and revoke API keys, and view call analytics for agents you own. |
| **Repo stack pages** | `/stack/[owner]/[repo]` | A shareable public page of the agent stack chosen for a repo, with an embeddable SVG badge at `/api/badge/[owner]/[repo]`. |

## Tech stack

- **Framework** — Next.js 16.2 (App Router, Turbopack) with React 19.2
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS 4, shadcn/ui, Base UI, Lucide icons
- **Auth & data** — Firebase Auth (GitHub OAuth) and Cloud Firestore
- **Vector search** — Upstash Vector, with embeddings generated locally by `@xenova/transformers` (`all-MiniLM-L6-v2`), so no embedding API is required
- **Rate limiting** — Upstash Redis via `@upstash/ratelimit`
- **AI** — Anthropic Claude for scan analysis and search reasoning; Google Gemini (`gemini-2.0-flash`) for the AI news digest
- **State & data fetching** — Zustand, TanStack Query, nuqs
- **Charts & canvas** — Recharts, React Flow, Monaco Editor, Shiki

## Getting started

### Prerequisites

- Node.js 20 or newer (developed on 22.19)
- npm 10 or newer

### Install and run

```bash
git clone https://github.com/parasb184-web/AgentHub.git
cd AgentHub
npm install
npm run dev
```

Open <http://localhost:3000>.

> **It runs without any credentials.** Every client falls back to a mock value when its environment variable is missing, so the UI, routing, and static content all work on a clean checkout. What you lose is live data: Firestore reads fail and drop into offline mode, and the AI routes have no key to call. `/api/activity` in particular will hang for roughly 60 seconds without real Firebase credentials, because its seeding writes queue offline instead of failing fast.

### Environment variables

Create `.env.local` in the project root:

```dotenv
# Firebase — safe to expose to the browser
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id

# Server-side secrets — never expose these
ANTHROPIC_API_KEY=your-anthropic-api-key
GEMINI_API_KEY=your-google-ai-api-key
GITHUB_TOKEN=your-github-personal-access-token

UPSTASH_VECTOR_REST_URL=https://your-vector-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-upstash-vector-token
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

| Variable | Required for | Without it |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Auth and all Firestore data | Falls back to `mock-project`; Firestore goes offline |
| `ANTHROPIC_API_KEY` | Repo scan analysis, search reasoning | Claude calls fail; fallback heuristics are used |
| `GEMINI_API_KEY` | `/api/ai-news` digest | News section returns empty |
| `GITHUB_TOKEN` | `/scan`, `/api/github-scan` | Unauthenticated GitHub rate limit (60 req/hr) |
| `UPSTASH_VECTOR_*` | Semantic search, gap detection | Vector queries fail |
| `UPSTASH_REDIS_*` | Sandbox rate limiting | Rate limiting is inert |

`.gitignore` excludes all `.env*` files, so none of this reaches the repository.

## Scripts

```bash
npm run dev     # start the dev server (Turbopack) on :3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

There is also a one-off seeding script at `scripts/preWarm.ts`, which populates the activity feed and pre-scans a few well-known repositories.

## Project structure

```
src/
├── app/
│   ├── api/              # 15 route handlers (see below)
│   ├── agents/           # directory + agent detail with sandbox
│   ├── chains/           # multi-agent workflow builder
│   ├── scan/             # GitHub repo scanner
│   ├── stack/            # public per-repo agent stack pages
│   ├── dashboard/        # API keys + analytics (auth required)
│   ├── publish/          # agent submission flow (auth required)
│   └── login/
├── components/
│   ├── agenthub/         # landing page sections
│   ├── ui/               # shadcn/ui primitives
│   └── PublishForm/      # four-step publishing wizard
├── lib/
│   ├── firebase.ts       # app, auth, Firestore init
│   ├── firestore.ts      # typed data access
│   ├── claudeClient.ts   # Anthropic client + Firestore response cache
│   ├── geminiClient.ts   # Gemini client + cache
│   ├── githubClient.ts   # repo metadata, languages, issues, commits
│   ├── vectorSearch.ts   # Upstash Vector queries
│   ├── embeddings.ts     # local transformer embeddings
│   └── types.ts          # shared domain types
├── hooks/
└── proxy.ts              # route guard (Next 16's middleware)
```

### API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/agents` | GET, POST | List and create agents |
| `/api/agents/[id]` | GET, PATCH | Read and update a single agent |
| `/api/chains` | GET, POST | List and create workflows |
| `/api/chains/[id]` | GET, PATCH, DELETE | Manage one workflow |
| `/api/sandbox/[id]` | POST | Execute an agent. **Requires `Authorization: Bearer <key>`**, rate limited |
| `/api/keys` | GET, POST, PATCH | Issue, list, and revoke API keys (SHA-256 hashed at rest) |
| `/api/search` | GET | Semantic agent search |
| `/api/github-scan` | POST | Analyze a repository |
| `/api/gap-detect` | POST | Find missing agent categories |
| `/api/upsert-vector` | POST | Index an agent into Upstash Vector |
| `/api/trending-agents` | GET | Trending list for the homepage |
| `/api/activity` | GET, POST | Live activity feed (seeds on first call) |
| `/api/ai-news` | GET | Gemini-generated AI news digest |
| `/api/badge/[owner]/[repo]` | GET | SVG badge showing a repo's agent count |
| `/api/og` | GET | Dynamic Open Graph images |

### Firestore collections

`agents` · `agent_calls` · `agent_reviews` · `api_keys` · `chains` · `activity_feed` · `repo_scans` · `repo_stacks` · `copyright_claims`

Security rules live in [`firestore.rules`](./firestore.rules).

## Authentication

Sign-in is Firebase GitHub OAuth. `src/proxy.ts` guards `/dashboard` and `/publish`, redirecting unauthenticated visitors to `/login` with a `redirect` parameter so they land back where they started.

Sandbox execution uses a separate mechanism: API keys minted in the dashboard and sent as a Bearer token. Only the SHA-256 hash and a short display prefix are stored, so a key cannot be recovered after it is shown once.

## Deployment

The repo ships configuration for three targets — use whichever you prefer.

<details>
<summary><strong>Firebase App Hosting</strong> (<code>apphosting.yaml</code>)</summary>

1. Create or open a Firebase project on the Blaze plan.
2. In the Firebase console, open **App Hosting** and create a backend.
3. Connect this GitHub repository and deploy the `main` branch from the repo root.
4. In the backend's **Environment** settings, add the plain-text values: all six `NEXT_PUBLIC_FIREBASE_*` variables, plus `UPSTASH_VECTOR_REST_URL` and `UPSTASH_REDIS_REST_URL`.
5. Create these entries in Secret Manager so they match `apphosting.yaml`: `anthropic-api-key`, `upstash-vector-rest-token`, `upstash-redis-rest-token`.
6. Roll out the backend.

`runConfig.maxInstances` is set to 5.

</details>

<details>
<summary><strong>Vercel</strong> (<code>vercel.json</code>)</summary>

Import the repository and add every variable from the table above. A daily cron is configured to hit `/api/activity` at midnight UTC to keep the activity feed fresh.

</details>

<details>
<summary><strong>Render</strong> (<code>render.yaml</code>)</summary>

A free-plan web service is pre-declared with all environment variables marked `sync: false`, so set their values in the Render dashboard.

</details>

## A note on the Next.js version

This project targets Next.js 16, which changed APIs and conventions relative to earlier releases — most visibly, route middleware now lives in `src/proxy.ts` and exports a `proxy()` function rather than `middleware()`. Before making changes, check the bundled docs in `node_modules/next/dist/docs/` rather than relying on older Next.js guides.
