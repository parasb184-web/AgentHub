# Copyright Claim Feature for Agents

## Context
Developers can publish agents on AgentHub. If someone copies another developer's agent, tweaks it slightly, and lists it to earn money, the original creator needs a way to report copyright infringement and request a takedown. This feature adds a "Report Copyright Infringement" flow on the agent detail page, available to signed-in users only.

## Scope
- Copyright claim button on agent detail page
- Modal form for submitting claims
- Firestore storage for claims (manual review, no admin UI yet)
- One claim per user per agent (spam prevention)

## New Type: `CopyrightClaim`

**File:** `src/lib/types.ts`

```ts
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
  createdAt: Timestamp;
}
```

## New Firestore Functions

**File:** `src/lib/firestore.ts`

### `submitCopyrightClaim(claim)`
- Writes to `copyright_claims` collection
- Sets `status: "pending"` and `createdAt: Timestamp.now()`
- Returns the document ID

### `hasCopyrightClaim(agentId, userId): boolean`
- Queries `copyright_claims` where `agentId` matches AND `reporterId` matches
- Returns true if a claim already exists (prevents duplicate submissions)

## New Component: `CopyrightClaimModal`

**File:** `src/components/CopyrightClaimModal.tsx`

Client component with:
- Props: `agentId: string`, `agentName: string`, `open: boolean`, `onClose: () => void`
- Uses Firebase auth to get current user (`reporterId`, `reporterUsername`)
- Form fields:

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Original agent URL/name | `<input>` | Yes | "https://github.com/... or agent name" |
| Description | `<textarea>` | Yes | "Describe how this agent infringes on your work" |
| Evidence URL | `<input>` | Yes | "Link to your original code, docs, or listing" |
| Relationship | `<select>` | Yes | "I am the creator" / "I represent the creator" |

- Submit button calls `submitCopyrightClaim()`
- On success: shows confirmation message "Your claim has been submitted. We'll review it within 48 hours."
- On error: shows error message
- Before showing form: calls `hasCopyrightClaim()` — if true, shows "You have already submitted a claim for this agent" instead of the form

### Styling
- Uses existing `glass-panel` for the modal backdrop
- Form fields use existing `control-shell` CSS class
- Submit button uses existing `buttonVariants({ variant: "default" })`
- Matches site's light theme and red accent colors

## Integration: Agent Detail Page

**File:** `src/app/agents/[id]/page.tsx`

- Add a "Report Copyright Infringement" link below the reviews section
- Styled as a subtle text link with a flag/shield icon (not a primary button)
- If user is signed in: opens `CopyrightClaimModal`
- If user is NOT signed in: shows "Sign in to report infringement" with link to `/login`
- State: `const [claimOpen, setClaimOpen] = useState(false)`

## Firestore Collection: `copyright_claims`

No indexes needed for now — queries are simple (`agentId` + `reporterId`).

Document structure matches the `CopyrightClaim` type above.

## Verification
1. `npm run build` passes
2. Visit `/agents/[any-agent-id]` while signed in — "Report Copyright Infringement" link visible
3. Click it — modal opens with form
4. Submit with valid data — success message shown, claim saved to Firestore
5. Try to submit again — "Already submitted" message shown
6. Visit while signed out — "Sign in to report infringement" shown instead
