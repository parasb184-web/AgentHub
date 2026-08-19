import { Agent } from "./types";

/**
 * Catalog expansion for the marketplace.
 *
 * Two groups live here:
 *
 *  - LIVE_AGENTS   ids do NOT start with "mock-", so `/api/sandbox/[id]` performs a
 *                  real POST to `endpointUrl` and returns whatever comes back. These
 *                  point at public, keyless JSON APIs, so the sandbox genuinely executes.
 *  - GENERATED_AGENTS  ids start with "mock-", so the sandbox short-circuits and replays
 *                  `exampleOutput` after simulating `latencyMs`.
 */

const DAY = 86400;
const nowSeconds = Math.floor(Date.now() / 1000);
const ts = (daysAgo: number) => ({ seconds: nowSeconds - daysAgo * DAY, nanoseconds: 0 });

/* ------------------------------------------------------------------ *
 * Live agents — these actually execute in the sandbox.
 * ------------------------------------------------------------------ */

export const LIVE_AGENTS: Agent[] = [
  {
    id: "live-request-inspector",
    name: "Request Echo Inspector",
    description:
      "Live integration probe. POST any JSON payload and get back exactly what the server received — headers, origin, parsed body — so you can verify your agent wiring before pointing it at a paid endpoint. Backed by the public httpbin service.",
    creatorId: "live-user-httpbin",
    creatorUsername: "httpbin",
    endpointUrl: "https://httpbin.org/post",
    capabilityTags: ["debugging", "integration", "automation"],
    supportedLanguages: ["python", "typescript", "node", "go", "bash"],
    latencyMs: 1200,
    costPerCall: 0,
    inputSchema: { type: "object", properties: { text: { type: "string" }, meta: { type: "object" } } },
    outputSchema: {
      type: "object",
      properties: { json: { type: "object" }, headers: { type: "object" }, origin: { type: "string" } },
    },
    exampleInput: { text: "hello from AgentHub", meta: { source: "sandbox" } },
    exampleOutput: { json: { text: "hello from AgentHub" }, origin: "203.0.113.42" },
    version: "1.0.0",
    status: "active",
    trustScore: 97,
    totalCalls: 18420,
    avgLatencyMs: 1180,
    uptimePercent: 99.8,
    rating: 4.7,
    reviewCount: 94,
    createdAt: ts(120),
    updatedAt: ts(3),
    rateLimit: 60,
  },
  {
    id: "live-webhook-validator",
    name: "Webhook Payload Validator",
    description:
      "Send a webhook body and receive a structured breakdown of how a receiving server parses it — form fields, raw body, and the full header set. Useful for debugging delivery problems between two agents. Backed by the public Postman Echo service.",
    creatorId: "live-user-postman",
    creatorUsername: "postman-echo",
    endpointUrl: "https://postman-echo.com/post",
    capabilityTags: ["debugging", "integration", "automation", "testing"],
    supportedLanguages: ["javascript", "node", "python", "ruby"],
    latencyMs: 900,
    costPerCall: 0,
    inputSchema: { type: "object", properties: { event: { type: "string" }, payload: { type: "object" } } },
    outputSchema: {
      type: "object",
      properties: { data: { type: "object" }, headers: { type: "object" }, url: { type: "string" } },
    },
    exampleInput: { event: "agent.completed", payload: { runId: "r-8812", status: "ok" } },
    exampleOutput: { data: { event: "agent.completed" }, url: "https://postman-echo.com/post" },
    version: "1.1.0",
    status: "active",
    trustScore: 95,
    totalCalls: 12760,
    avgLatencyMs: 880,
    uptimePercent: 99.6,
    rating: 4.6,
    reviewCount: 71,
    createdAt: ts(96),
    updatedAt: ts(6),
    rateLimit: 60,
  },
  {
    id: "live-object-store",
    name: "Object Store Writer",
    description:
      "Persists an arbitrary JSON object to a public REST store and returns the generated id and creation timestamp. A genuine write-path smoke test for chains that need to confirm downstream persistence actually happened.",
    creatorId: "live-user-restfulapi",
    creatorUsername: "restful-api-dev",
    endpointUrl: "https://api.restful-api.dev/objects",
    capabilityTags: ["storage", "integration", "automation", "database"],
    supportedLanguages: ["python", "java", "typescript", "go", "c#"],
    latencyMs: 1400,
    costPerCall: 0,
    inputSchema: { type: "object", properties: { name: { type: "string" }, data: { type: "object" } } },
    outputSchema: {
      type: "object",
      properties: { id: { type: "string" }, name: { type: "string" }, createdAt: { type: "string" } },
    },
    exampleInput: { name: "Scan result", data: { repo: "vercel/next.js", agents: 4 } },
    exampleOutput: { id: "ff8081819ff5b110", name: "Scan result", createdAt: "2026-08-19T10:12:04.881Z" },
    version: "1.0.2",
    status: "active",
    trustScore: 93,
    totalCalls: 8340,
    avgLatencyMs: 1360,
    uptimePercent: 99.2,
    rating: 4.5,
    reviewCount: 58,
    createdAt: ts(74),
    updatedAt: ts(9),
    rateLimit: 40,
  },
  {
    id: "live-draft-recorder",
    name: "Draft Post Recorder",
    description:
      "Accepts a title and body, stores it as a draft record, and returns the assigned id. Pairs well as the final node of a content chain when you want to confirm the handoff completed end to end. Backed by the public DummyJSON API.",
    creatorId: "live-user-dummyjson",
    creatorUsername: "dummyjson",
    endpointUrl: "https://dummyjson.com/posts/add",
    capabilityTags: ["content-creation", "integration", "automation", "productivity"],
    supportedLanguages: ["javascript", "typescript", "node", "php"],
    latencyMs: 600,
    costPerCall: 0,
    inputSchema: {
      type: "object",
      properties: { title: { type: "string" }, body: { type: "string" }, userId: { type: "number" } },
    },
    outputSchema: { type: "object", properties: { id: { type: "number" }, title: { type: "string" } } },
    exampleInput: { title: "Weekly agent digest", body: "Five agents shipped this week.", userId: 1 },
    exampleOutput: { id: 252, title: "Weekly agent digest", userId: 1 },
    version: "1.0.0",
    status: "active",
    trustScore: 91,
    totalCalls: 6210,
    avgLatencyMs: 580,
    uptimePercent: 99.4,
    rating: 4.4,
    reviewCount: 43,
    createdAt: ts(58),
    updatedAt: ts(11),
    rateLimit: 80,
  },
  {
    id: "live-catalog-publisher",
    name: "Catalog Item Publisher",
    description:
      "Publishes a product record — title, price, category, description — to a live commerce catalog and returns the created id. A real write endpoint for testing e-commerce automation chains without touching production inventory.",
    creatorId: "live-user-fakestore",
    creatorUsername: "fakestoreapi",
    endpointUrl: "https://fakestoreapi.com/products",
    capabilityTags: ["e-commerce", "integration", "automation", "content-creation"],
    supportedLanguages: ["javascript", "node", "python", "ruby"],
    latencyMs: 700,
    costPerCall: 0,
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
        category: { type: "string" },
      },
    },
    outputSchema: { type: "object", properties: { id: { type: "number" } } },
    exampleInput: {
      title: "Refurbished mechanical keyboard",
      price: 89.99,
      description: "Hot-swappable switches, tested.",
      category: "electronics",
    },
    exampleOutput: { id: 21 },
    version: "1.2.0",
    status: "active",
    trustScore: 89,
    totalCalls: 4980,
    avgLatencyMs: 690,
    uptimePercent: 98.9,
    rating: 4.3,
    reviewCount: 37,
    createdAt: ts(41),
    updatedAt: ts(14),
    rateLimit: 60,
  },
];

/* ------------------------------------------------------------------ *
 * Generated catalog agents — sandbox replays exampleOutput.
 * ------------------------------------------------------------------ */

type Archetype = "text" | "code" | "url" | "doc" | "data" | "image" | "audio" | "query";

interface Spec {
  s: string; // slug
  n: string; // name
  d: string; // description
  t: string[]; // capability tags
  l: string[]; // supported languages
  c: string; // creator username
  k: Archetype;
}

const SCHEMAS: Record<Archetype, { input: any; output: any; exIn: any; exOut: any }> = {
  text: {
    input: { type: "object", properties: { text: { type: "string" }, tone: { type: "string" } } },
    output: { type: "object", properties: { result: { type: "string" }, confidence: { type: "number" } } },
    exIn: { text: "Our Q3 numbers came in slightly under plan.", tone: "neutral" },
    exOut: { result: "Q3 finished marginally below target.", confidence: 0.93 },
  },
  code: {
    input: { type: "object", properties: { code: { type: "string" }, language: { type: "string" } } },
    output: {
      type: "object",
      properties: { issues: { type: "array" }, suggestions: { type: "array" }, severity: { type: "string" } },
    },
    exIn: { code: "function add(a,b){return a+b}", language: "javascript" },
    exOut: { issues: ["Missing parameter types"], suggestions: ["Add explicit number types"], severity: "low" },
  },
  url: {
    input: { type: "object", properties: { url: { type: "string" }, depth: { type: "number" } } },
    output: { type: "object", properties: { summary: { type: "string" }, metadata: { type: "object" } } },
    exIn: { url: "https://example.org/changelog", depth: 1 },
    exOut: { summary: "Release 4.2 adds streaming and fixes 11 bugs.", metadata: { wordCount: 812 } },
  },
  doc: {
    input: { type: "object", properties: { documentUrl: { type: "string" }, fields: { type: "array" } } },
    output: { type: "object", properties: { fields: { type: "object" }, summary: { type: "string" } } },
    exIn: { documentUrl: "https://files.example.org/contract.pdf", fields: ["parties", "term"] },
    exOut: { fields: { parties: ["Acme Ltd", "Globex"], term: "24 months" }, summary: "Standard supply agreement." },
  },
  data: {
    input: { type: "object", properties: { records: { type: "array" }, metric: { type: "string" } } },
    output: { type: "object", properties: { rows: { type: "number" }, insights: { type: "array" } } },
    exIn: { records: [{ region: "APAC", revenue: 41200 }], metric: "revenue" },
    exOut: { rows: 1, insights: ["APAC revenue is 12% above the trailing median."] },
  },
  image: {
    input: { type: "object", properties: { imageUrl: { type: "string" } } },
    output: { type: "object", properties: { labels: { type: "array" }, confidence: { type: "number" } } },
    exIn: { imageUrl: "https://cdn.example.org/frame-004.png" },
    exOut: { labels: ["invoice", "table", "signature"], confidence: 0.88 },
  },
  audio: {
    input: { type: "object", properties: { audioUrl: { type: "string" }, language: { type: "string" } } },
    output: { type: "object", properties: { transcript: { type: "string" }, durationSec: { type: "number" } } },
    exIn: { audioUrl: "https://cdn.example.org/standup.m4a", language: "en" },
    exOut: { transcript: "Blocked on the migration, picking it up after lunch.", durationSec: 47 },
  },
  query: {
    input: { type: "object", properties: { query: { type: "string" }, topK: { type: "number" } } },
    output: { type: "object", properties: { answer: { type: "string" }, sources: { type: "array" } } },
    exIn: { query: "What changed in our refund policy?", topK: 3 },
    exOut: { answer: "Refund window moved from 14 to 30 days.", sources: ["policy-v7.md"] },
  },
};

/** Stable hash so every derived stat is deterministic across renders. */
const hash = (value: string): number => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const RATE_LIMITS = [10, 25, 50, 100, 200];

const buildAgent = (spec: Spec, index: number): Agent => {
  const h = hash(spec.s);
  const schema = SCHEMAS[spec.k];
  const latency = 280 + (h % 4200);
  const trust = 68 + (h % 32);

  return {
    id: `mock-gen-${spec.s}`,
    name: spec.n,
    description: spec.d,
    creatorId: `gen-user-${(h % 240) + 1}`,
    creatorUsername: spec.c,
    endpointUrl: `https://api.agenthub.dev/v1/run/mock-gen-${spec.s}`,
    capabilityTags: spec.t,
    supportedLanguages: spec.l,
    latencyMs: latency,
    costPerCall: Math.round(((h % 92) / 100 + 0.01) * 100) / 100,
    inputSchema: schema.input,
    outputSchema: schema.output,
    exampleInput: schema.exIn,
    exampleOutput: schema.exOut,
    version: `${1 + (h % 3)}.${h % 10}.${(h >> 3) % 10}`,
    status: "active",
    trustScore: trust,
    totalCalls: 640 + (h % 248000),
    avgLatencyMs: Math.round(latency * 0.94),
    uptimePercent: Math.round((97 + (h % 30) / 10) * 10) / 10,
    rating: Math.round((3.5 + (h % 15) / 10) * 10) / 10,
    reviewCount: 11 + (h % 880),
    createdAt: ts(3 + ((index * 7) % 330)),
    updatedAt: ts(1 + (h % 30)),
    rateLimit: RATE_LIMITS[h % RATE_LIMITS.length],
  };
};

const SPECS: Spec[] = [
  // Engineering and code
  { s: "pr-summarizer", n: "Pull Request Summarizer", d: "Condenses a diff of any size into a reviewer-facing summary: what changed, why it likely changed, and which files deserve a closer look.", t: ["code-review", "summarization", "productivity"], l: ["typescript", "python", "go"], c: "difftools", k: "code" },
  { s: "legacy-refactorer", n: "Legacy Code Refactorer", d: "Proposes incremental refactors for aging modules, ordered so each step keeps the test suite green rather than demanding a big-bang rewrite.", t: ["code-generation", "refactoring", "productivity"], l: ["java", "c#", "python", "php"], c: "refactorlab", k: "code" },
  { s: "dependency-planner", n: "Dependency Upgrade Planner", d: "Reads your lockfile and sequences upgrades by blast radius, flagging the breaking changes that actually affect the APIs you call.", t: ["automation", "security", "devops"], l: ["node", "python", "ruby", "rust"], c: "depwatch", k: "data" },
  { s: "api-reference-writer", n: "API Reference Generator", d: "Turns route handlers and type definitions into publishable reference docs, complete with request and response examples pulled from real payloads.", t: ["documentation", "code-generation", "productivity"], l: ["typescript", "go", "python"], c: "docsmith", k: "code" },
  { s: "commit-linter", n: "Commit Message Linter", d: "Rewrites terse commit messages into conventional-commit form, inferring scope and type from the staged diff.", t: ["code-review", "automation", "productivity"], l: ["bash", "node", "python"], c: "gitpolish", k: "code" },
  { s: "ts-migrator", n: "JavaScript to TypeScript Migrator", d: "Migrates modules file by file, inferring types from call sites and leaving explicit TODOs where inference is genuinely ambiguous.", t: ["code-generation", "refactoring", "frontend"], l: ["javascript", "typescript", "node"], c: "typeshift", k: "code" },
  { s: "query-optimizer", n: "Query Plan Optimizer", d: "Reads an EXPLAIN plan and suggests index changes and rewrites, with an estimate of the rows each change would stop scanning.", t: ["database", "analytics", "performance"], l: ["sql", "python", "go"], c: "planwise", k: "code" },
  { s: "regex-composer", n: "Regex Composer", d: "Builds and explains regular expressions from plain-language descriptions, with a generated test table of matching and non-matching cases.", t: ["code-generation", "productivity", "nlp"], l: ["python", "javascript", "go", "rust"], c: "patternforge", k: "text" },
  { s: "codebase-explainer", n: "Codebase Explainer", d: "Answers questions about an unfamiliar repository by tracing call paths, so new joiners can find the code that matters without reading everything.", t: ["documentation", "summarization", "productivity"], l: ["typescript", "python", "java", "go"], c: "onboardly", k: "query" },
  { s: "conflict-resolver", n: "Merge Conflict Resolver", d: "Suggests resolutions for merge conflicts by reading both branches' intent from their commit history rather than guessing from the hunks alone.", t: ["code-review", "automation", "productivity"], l: ["typescript", "python", "java"], c: "mergemate", k: "code" },
  { s: "monorepo-mapper", n: "Monorepo Dependency Mapper", d: "Charts package interdependencies and identifies the cycles and over-shared utilities that keep breaking unrelated builds.", t: ["devops", "analytics", "refactoring"], l: ["typescript", "node", "go"], c: "graphdeps", k: "data" },
  { s: "dead-code-detector", n: "Dead Code Detector", d: "Finds exports, routes, and feature flags nothing reaches any more, cross-checked against production telemetry before it recommends deletion.", t: ["refactoring", "analytics", "productivity"], l: ["typescript", "python", "go", "ruby"], c: "prunebot", k: "code" },
  { s: "i18n-extractor", n: "i18n String Extractor", d: "Pulls hard-coded user-facing strings out of components, replaces them with translation keys, and generates the initial locale file.", t: ["frontend", "automation", "translation"], l: ["typescript", "javascript", "swift", "kotlin"], c: "localekit", k: "code" },
  { s: "stacktrace-analyst", n: "Stack Trace Analyst", d: "Reads a production stack trace, points at the most likely offending frame, and links the commit that introduced it.", t: ["bug-triage", "analysis", "devops"], l: ["java", "python", "node", "go"], c: "traceroot", k: "text" },

  // Testing and QA
  { s: "unit-test-generator", n: "Unit Test Generator", d: "Writes unit tests that target real branch coverage gaps instead of restating the implementation back at you.", t: ["test-writing", "testing", "code-generation"], l: ["typescript", "python", "java", "go"], c: "testwright", k: "code" },
  { s: "e2e-scripter", n: "E2E Scenario Scripter", d: "Converts written acceptance criteria into runnable end-to-end specs with stable selectors and sensible waits.", t: ["testing", "automation", "frontend"], l: ["typescript", "javascript", "python"], c: "flowspec", k: "text" },
  { s: "flaky-detector", n: "Flaky Test Detector", d: "Analyses CI history to separate genuinely flaky tests from tests that only fail when a real regression lands.", t: ["testing", "analytics", "devops"], l: ["python", "typescript", "java"], c: "steadyci", k: "data" },
  { s: "coverage-analyst", n: "Coverage Gap Analyst", d: "Ranks uncovered code by how often it actually runs in production, so you test the risky paths rather than chasing a percentage.", t: ["testing", "analytics", "test-writing"], l: ["typescript", "python", "go", "ruby"], c: "covermap", k: "data" },
  { s: "load-test-planner", n: "Load Test Planner", d: "Derives realistic load profiles from access logs and generates the corresponding k6 or Locust scripts.", t: ["testing", "performance", "devops"], l: ["javascript", "python", "go"], c: "surgelab", k: "data" },
  { s: "a11y-auditor", n: "Accessibility Auditor", d: "Audits rendered markup against WCAG 2.2 and returns fixes as concrete diffs, not just rule identifiers.", t: ["frontend", "testing", "design"], l: ["typescript", "javascript"], c: "inclusiveui", k: "url" },

  // DevOps and infrastructure
  { s: "dockerfile-optimizer", n: "Dockerfile Optimizer", d: "Restructures layers for cache hits and strips build-time tooling out of runtime images, usually cutting image size substantially.", t: ["devops", "performance", "automation"], l: ["bash", "go", "python"], c: "layercraft", k: "code" },
  { s: "k8s-manifest-builder", n: "Kubernetes Manifest Builder", d: "Generates manifests with resource requests derived from observed usage rather than copied from a tutorial.", t: ["devops", "automation", "code-generation"], l: ["go", "python", "bash"], c: "helmsman", k: "data" },
  { s: "terraform-reviewer", n: "Terraform Plan Reviewer", d: "Reviews a plan before apply and calls out the changes that would destroy or recreate stateful resources.", t: ["devops", "security", "code-review"], l: ["go", "python", "bash"], c: "planguard", k: "code" },
  { s: "ci-debugger", n: "CI Pipeline Debugger", d: "Reads failing pipeline logs and isolates the first genuine error, skipping the cascade of downstream noise.", t: ["devops", "bug-triage", "automation"], l: ["bash", "python", "node"], c: "pipefix", k: "text" },
  { s: "log-anomaly-spotter", n: "Log Anomaly Spotter", d: "Learns a service's normal log shape and surfaces the lines that deviate, with the surrounding request context attached.", t: ["devops", "analytics", "security"], l: ["go", "python", "rust"], c: "signalbench", k: "data" },
  { s: "cloud-cost-optimizer", n: "Cloud Cost Optimizer", d: "Correlates billing data with utilisation to find idle capacity and oversized instances, ranked by monthly saving.", t: ["devops", "analytics", "finance"], l: ["python", "go", "typescript"], c: "spendsense", k: "data" },

  // Security
  { s: "secret-scanner", n: "Secret Leak Scanner", d: "Scans diffs and history for credentials, distinguishing live keys from rotated or sample values to keep noise down.", t: ["security", "code-review", "automation"], l: ["go", "python", "typescript"], c: "keyhound", k: "code" },
  { s: "cve-triager", n: "CVE Impact Triager", d: "Checks whether a published CVE reaches your code by tracing whether the vulnerable function is on any live path.", t: ["security", "analysis", "devops"], l: ["python", "java", "node", "rust"], c: "vulnpath", k: "data" },
  { s: "iam-reviewer", n: "IAM Policy Reviewer", d: "Flags over-broad permissions and proposes least-privilege replacements based on the calls the principal actually makes.", t: ["security", "devops", "code-review"], l: ["python", "go", "typescript"], c: "leastpriv", k: "code" },
  { s: "threat-modeler", n: "Threat Model Drafter", d: "Produces a first-pass STRIDE threat model from an architecture description, with mitigations mapped to each trust boundary.", t: ["security", "documentation", "analysis"], l: ["python", "typescript"], c: "threatdraft", k: "text" },
  { s: "phishing-classifier", n: "Phishing Email Classifier", d: "Scores inbound mail for phishing indicators across headers, link reputation, and language patterns, returning an explainable verdict.", t: ["security", "classification", "nlp"], l: ["python", "go", "node"], c: "mailshield", k: "text" },
  { s: "pentest-reporter", n: "Pentest Report Writer", d: "Turns raw scanner output and tester notes into a client-ready report with severity ratings and reproduction steps.", t: ["security", "documentation", "summarization"], l: ["python", "typescript"], c: "redteamdocs", k: "data" },

  // Data and analytics
  { s: "etl-schema-mapper", n: "ETL Schema Mapper", d: "Infers field mappings between mismatched source and target schemas and emits the transformation code to bridge them.", t: ["data-extraction", "automation", "database"], l: ["python", "scala", "sql"], c: "pipeweave", k: "data" },
  { s: "data-quality-profiler", n: "Data Quality Profiler", d: "Profiles a table for nulls, drift, and impossible values, then writes the assertions to stop the same problems recurring.", t: ["analytics", "data-extraction", "testing"], l: ["python", "sql", "scala"], c: "qualitygate", k: "data" },
  { s: "dashboard-narrator", n: "Dashboard Narrator", d: "Writes the paragraph that should sit above a dashboard: what moved this period, by how much, and the most probable cause.", t: ["analytics", "summarization", "content-creation"], l: ["python", "typescript", "r"], c: "chartvoice", k: "data" },
  { s: "cohort-analyst", n: "Cohort Retention Analyst", d: "Builds retention curves by cohort and identifies which acquisition channels produce users who actually stay.", t: ["analytics", "classification", "productivity"], l: ["python", "sql", "r"], c: "cohortiq", k: "data" },
  { s: "anomaly-forecaster", n: "Timeseries Anomaly Forecaster", d: "Separates genuine anomalies from seasonality and known campaign spikes, with a confidence band on every alert.", t: ["analytics", "classification", "automation"], l: ["python", "r", "scala"], c: "driftline", k: "data" },
  { s: "csv-normalizer", n: "CSV Normalizer", d: "Cleans messy spreadsheet exports — inconsistent dates, stray currency symbols, merged headers — into a strict typed schema.", t: ["data-extraction", "automation", "productivity"], l: ["python", "node", "ruby"], c: "tidyrows", k: "data" },
  { s: "entity-resolver", n: "Entity Resolution Engine", d: "Deduplicates customer and company records across systems where names, spellings, and identifiers all disagree.", t: ["data-extraction", "classification", "database"], l: ["python", "java", "scala"], c: "matchcore", k: "data" },
  { s: "ab-test-reader", n: "A/B Test Interpreter", d: "Reads experiment results and states plainly whether the effect is real, underpowered, or an artefact of peeking early.", t: ["analytics", "analysis", "productivity"], l: ["python", "r", "typescript"], c: "experimentiq", k: "data" },

  // Content and marketing
  { s: "blog-outliner", n: "Blog Outline Architect", d: "Researches a topic and returns a structured outline with the argument each section needs to make and sources worth citing.", t: ["content-creation", "marketing", "generative"], l: ["python", "node", "typescript"], c: "outlinehq", k: "query" },
  { s: "seo-content-auditor", n: "SEO Content Auditor", d: "Audits a live page for intent match, internal linking, and heading structure, returning prioritised edits rather than a keyword-density score.", t: ["marketing", "analysis", "content-creation"], l: ["python", "typescript", "php"], c: "rankcraft", k: "url" },
  { s: "ad-copy-variants", n: "Ad Copy Variant Generator", d: "Produces channel-appropriate ad variants within character limits, each testing a distinct angle rather than a reworded hook.", t: ["marketing", "content-creation", "generative"], l: ["node", "python"], c: "copyforge", k: "text" },
  { s: "newsletter-drafter", n: "Newsletter Drafter", d: "Assembles a newsletter from the week's shipped work, keeping a consistent voice and a single clear call to action.", t: ["content-creation", "marketing", "summarization"], l: ["typescript", "node", "python"], c: "sendwell", k: "data" },
  { s: "social-repurposer", n: "Social Post Repurposer", d: "Breaks a long article into platform-native posts, respecting each network's length and tone conventions.", t: ["marketing", "content-creation", "automation"], l: ["node", "python", "typescript"], c: "reshare", k: "text" },
  { s: "brand-voice-enforcer", n: "Brand Voice Enforcer", d: "Checks drafts against a style guide and rewrites the passages that drift, showing what changed and why.", t: ["content-creation", "marketing", "nlp"], l: ["python", "typescript"], c: "tonekeeper", k: "text" },
  { s: "product-description-writer", n: "Product Description Writer", d: "Writes catalogue copy from a spec sheet, leading with the attributes that drive purchase decisions in each category.", t: ["e-commerce", "content-creation", "generative"], l: ["node", "python", "php"], c: "shelfcopy", k: "data" },
  { s: "press-release-drafter", n: "Press Release Drafter", d: "Drafts a release in standard wire format with a quotable executive line and a boilerplate section that stays consistent.", t: ["content-creation", "marketing", "generative"], l: ["python", "node"], c: "newswire", k: "text" },

  // Customer support
  { s: "ticket-router", n: "Support Ticket Router", d: "Classifies inbound tickets by product area and urgency, routing to the queue that can actually resolve them first time.", t: ["customer-support", "classification", "automation"], l: ["python", "node", "ruby"], c: "deskrouter", k: "text" },
  { s: "macro-suggester", n: "Reply Macro Suggester", d: "Recommends the closest existing reply template and adapts it to the specifics of the ticket in front of the agent.", t: ["customer-support", "productivity", "nlp"], l: ["python", "typescript", "ruby"], c: "quickreply", k: "query" },
  { s: "csat-analyst", n: "CSAT Feedback Analyst", d: "Clusters open-text survey responses into themes and quantifies how much each theme drags on the overall score.", t: ["customer-support", "analytics", "summarization"], l: ["python", "r", "typescript"], c: "voicelens", k: "data" },
  { s: "kb-gap-finder", n: "Knowledge Base Gap Finder", d: "Compares resolved tickets against published articles to find the questions your documentation never answers.", t: ["customer-support", "documentation", "analysis"], l: ["python", "node"], c: "docgap", k: "data" },
  { s: "escalation-predictor", n: "Escalation Risk Predictor", d: "Scores live conversations for escalation risk from sentiment trajectory and reply latency, early enough to intervene.", t: ["customer-support", "classification", "analytics"], l: ["python", "go", "node"], c: "calmdesk", k: "text" },

  // Finance
  { s: "invoice-line-extractor", n: "Invoice Line Extractor", d: "Pulls line items, tax, and totals from invoices in any layout and reconciles them against the matching purchase order.", t: ["finance", "data-extraction", "automation"], l: ["python", "java", "node"], c: "ledgerpull", k: "doc" },
  { s: "expense-categorizer", n: "Expense Categorizer", d: "Assigns transactions to the right ledger account, learning the exceptions your finance team keeps correcting by hand.", t: ["finance", "classification", "automation"], l: ["python", "typescript", "java"], c: "bookkeepr", k: "data" },
  { s: "fraud-scorer", n: "Transaction Fraud Scorer", d: "Scores transactions in real time against behavioural baselines and returns the specific factors behind each decision.", t: ["finance", "security", "classification"], l: ["python", "go", "scala"], c: "riskgrid", k: "data" },
  { s: "earnings-summarizer", n: "Earnings Call Summarizer", d: "Summarises a call transcript into guidance changes, analyst concerns, and the questions management sidestepped.", t: ["finance", "summarization", "analysis"], l: ["python", "typescript"], c: "marketbrief", k: "audio" },
  { s: "budget-forecaster", n: "Budget Variance Forecaster", d: "Projects year-end variance from spend to date and flags the cost centres most likely to overrun.", t: ["finance", "analytics", "productivity"], l: ["python", "r", "sql"], c: "forecastly", k: "data" },

  // Legal
  { s: "contract-comparator", n: "Contract Redline Comparator", d: "Diffs two contract versions and reports only the changes that shift risk or obligation, ignoring formatting churn.", t: ["legal", "analysis", "data-extraction"], l: ["python", "java", "typescript"], c: "redlinepro", k: "doc" },
  { s: "clause-matcher", n: "Clause Library Matcher", d: "Matches clauses in an incoming draft to your approved library and highlights every material deviation.", t: ["legal", "classification", "data-extraction"], l: ["python", "node"], c: "clausebank", k: "doc" },
  { s: "compliance-checker", n: "GDPR Compliance Checker", d: "Reviews data flows against GDPR obligations and identifies where a lawful basis or retention limit is missing.", t: ["legal", "security", "analysis"], l: ["python", "typescript", "go"], c: "privacygate", k: "doc" },
  { s: "policy-summarizer", n: "Privacy Policy Summarizer", d: "Reduces a privacy policy to what a reader actually needs: what is collected, who receives it, and how long it is kept.", t: ["legal", "summarization", "nlp"], l: ["python", "node"], c: "plainterms", k: "url" },

  // Healthcare
  { s: "clinical-coder", n: "Clinical Note Coder", d: "Suggests ICD-10 and CPT codes from clinical notes with the supporting phrase attached to every suggestion.", t: ["healthcare", "classification", "data-extraction"], l: ["python", "java"], c: "codeclinic", k: "text" },
  { s: "symptom-triage", n: "Symptom Triage Assistant", d: "Structures reported symptoms into a triage summary for clinician review. Decision support only — never a diagnosis.", t: ["healthcare", "classification", "nlp"], l: ["python", "typescript"], c: "triagepoint", k: "text" },
  { s: "trial-matcher", n: "Clinical Trial Matcher", d: "Matches de-identified patient profiles against trial eligibility criteria and explains each inclusion or exclusion.", t: ["healthcare", "analysis", "classification"], l: ["python", "r"], c: "trialbridge", k: "data" },
  { s: "radiology-drafter", n: "Radiology Report Drafter", d: "Drafts structured findings from imaging metadata and prior reports for a radiologist to verify and sign off.", t: ["healthcare", "computer-vision", "documentation"], l: ["python"], c: "imagescribe", k: "image" },

  // Education
  { s: "quiz-generator", n: "Quiz Generator", d: "Builds assessments from source material with distractors designed around the misconceptions students actually hold.", t: ["education", "generative", "content-creation"], l: ["python", "node", "typescript"], c: "quizforge", k: "doc" },
  { s: "rubric-grader", n: "Rubric Based Grader", d: "Grades free-text answers against a rubric and returns per-criterion feedback a student can act on.", t: ["education", "classification", "nlp"], l: ["python", "java"], c: "markwise", k: "text" },
  { s: "lesson-planner", n: "Lesson Plan Builder", d: "Produces lesson plans mapped to curriculum standards, with timings and differentiation for mixed-ability groups.", t: ["education", "content-creation", "productivity"], l: ["python", "typescript"], c: "planclass", k: "text" },
  { s: "concept-explainer", n: "Concept Explainer", d: "Explains a concept at a chosen reading level, then checks understanding with progressively harder questions.", t: ["education", "summarization", "nlp"], l: ["python", "node"], c: "clearlearn", k: "query" },

  // Design
  { s: "design-token-extractor", n: "Design Token Extractor", d: "Extracts colour, spacing, and type scales from a design file and emits them as themed CSS variables.", t: ["design", "frontend", "automation"], l: ["typescript", "javascript"], c: "tokenpress", k: "url" },
  { s: "wireframe-to-component", n: "Wireframe to Component", d: "Converts a wireframe image into accessible component markup with sensible semantics and responsive behaviour.", t: ["design", "frontend", "code-generation"], l: ["typescript", "javascript"], c: "sketch2code", k: "image" },
  { s: "alt-text-writer", n: "Alt Text Writer", d: "Writes alt text that conveys the purpose an image serves in context, rather than listing everything visible in it.", t: ["design", "computer-vision", "content-creation"], l: ["python", "node", "typescript"], c: "describely", k: "image" },
  { s: "palette-generator", n: "Palette Generator", d: "Generates palettes that hold their contrast ratios in both light and dark themes, with WCAG results for every pairing.", t: ["design", "frontend", "generative"], l: ["typescript", "javascript", "python"], c: "huecheck", k: "text" },

  // Productivity and operations
  { s: "meeting-notes-synth", n: "Meeting Notes Synthesizer", d: "Turns a recording into decisions, owners, and deadlines, separating what was agreed from what was merely discussed.", t: ["productivity", "summarization", "speech-to-text"], l: ["python", "node", "typescript"], c: "notestack", k: "audio" },
  { s: "okr-drafter", n: "OKR Drafter", d: "Drafts objectives and key results from a strategy document, rejecting key results that cannot be measured.", t: ["productivity", "content-creation", "analysis"], l: ["typescript", "python"], c: "goalsmith", k: "doc" },
  { s: "standup-digest", n: "Standup Digest Compiler", d: "Compiles written standups into a digest of progress and blockers, cross-referenced against ticket movement.", t: ["productivity", "summarization", "automation"], l: ["node", "python", "go"], c: "dailyroll", k: "data" },
  { s: "inbox-triage", n: "Inbox Triage Assistant", d: "Sorts mail by what genuinely needs a reply today and drafts responses for the routine cases.", t: ["productivity", "classification", "automation"], l: ["python", "typescript", "node"], c: "zeromail", k: "text" },
  { s: "calendar-optimizer", n: "Calendar Conflict Optimizer", d: "Resolves scheduling conflicts across time zones while protecting each participant's existing blocks of focus time.", t: ["productivity", "automation", "analysis"], l: ["typescript", "python", "go"], c: "timeknit", k: "data" },
  { s: "rfp-responder", n: "RFP Response Drafter", d: "Answers RFP questionnaires from your past submissions and product docs, flagging every answer that needs human review.", t: ["productivity", "content-creation", "summarization"], l: ["python", "typescript"], c: "bidcraft", k: "doc" },
];

export const GENERATED_AGENTS: Agent[] = SPECS.map(buildAgent);

/** Everything appended to the base catalog: 5 live + 80 generated. */
export const EXTRA_AGENTS: Agent[] = [...LIVE_AGENTS, ...GENERATED_AGENTS];
