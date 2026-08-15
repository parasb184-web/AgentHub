# Demo/Mock Data Inventory

All locations where dummy, mock, or fallback data is used instead of real data.
Search for `TODO: DEMO` in the codebase to find marked locations.

## 1. Repo Scan Pain Points — `src/app/api/github-scan/route.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 37-129 | `buildFallbackPainPoints()` — returns 5 hardcoded pain points (ML-aware + generic) | Gemini API call fails |
| 240-250 | Catch block calls `buildFallbackPainPoints()` | Gemini error |
| 268-281 | Falls back to `MOCK_AGENTS` ranked by score | No matching agents in Firestore |
| 4 | `import { MOCK_AGENTS }` from dummyData | Always imported |

**To remove:** Delete `buildFallbackPainPoints()`, replace catch block with error response, remove MOCK_AGENTS fallback.

## 2. Mock Agents Database — `src/lib/dummyData.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 5-438 | 17 hardcoded agents (Pull Request Reviewer, Legal Doc Parser, Text2SQL, etc.) | Imported by multiple files |

**To remove:** Delete entire file once Firestore has real agents. Update all importers.

## 3. Agent Listing — `src/lib/firestore.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 9 | `getAgents()` returns `MOCK_AGENTS` when Firestore is empty | No agents in Firestore |
| 14-15 | `getAgentById()` checks MOCK_AGENTS **before** Firestore | Always (eager check) |

**To remove:** Remove MOCK_AGENTS fallback from both functions, return empty array / null.

## 4. Search API — `src/app/api/search/route.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 8 | Imports MOCK_AGENTS | Always |
| 82-95 | `getFallbackResults()` returns top 5 MOCK_AGENTS | Vector search returns 0 results, or Claude ranking fails |
| 128, 142, 160 | Three separate triggers call `getFallbackResults()` | Various failure paths |

**To remove:** Replace `getFallbackResults()` with empty results or error.

## 5. Gap Detector — `src/app/api/gap-detect/route.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 6-14 | `IMPACT_STRINGS` — hardcoded impact messages per category | Always used |
| 48-50 | Default gap categories `["code-review", "test-writing"]` | No gaps found in DB |

**Note:** IMPACT_STRINGS are presentational, not fake data. The default gaps on 48-50 should be removed.

## 6. Activity Feed — `src/components/LiveFeed.tsx`

| Lines | What | Trigger |
|-------|------|---------|
| 9-38 | `FALLBACK_FEED` — 4 hardcoded activity items | API fails or returns empty |

**To remove:** Show empty state or error message instead of fake activity.

## 7. Chains API — `src/app/api/chains/route.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 6-8, 23 | `"demo-user"` fallback for auth | No x-user-id header |

**To remove:** Return 401 unauthorized instead of allowing demo-user.

## 8. Vector Search — `src/lib/vectorSearch.ts`

| Lines | What | Trigger |
|-------|------|---------|
| 5-8 | Mock Upstash URL/token fallback | Env vars missing |

**To remove:** Throw error if env vars missing instead of connecting to mock.

---

## Priority Order for Removal

1. **`firestore.ts` line 14-15** — MOCK_AGENTS checked BEFORE Firestore (eager, always runs)
2. **`firestore.ts` line 9** — returns MOCK_AGENTS when Firestore empty
3. **`github-scan/route.ts`** — fallback pain points + MOCK_AGENTS matching
4. **`search/route.ts`** — search fallback
5. **`dummyData.ts`** — delete last, after all importers are updated
