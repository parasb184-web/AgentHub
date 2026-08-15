# Copyright Claim Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a copyright infringement reporting flow on agent detail pages so original creators can file takedown claims against copied agents.

**Architecture:** A modal form on `/agents/[id]` writes claims to a `copyright_claims` Firestore collection. Auth-gated (signed-in users only), one claim per user per agent. No admin UI — claims are reviewed manually in Firestore console.

**Tech Stack:** React, Firebase Auth (via existing `useAuth` hook), Firestore, Tailwind CSS, Lucide icons

---

### Task 1: Add CopyrightClaim Type

**Files:**
- Modify: `src/lib/types.ts` (append after line 82)

- [ ] **Step 1: Add the CopyrightClaim interface**

Add at the end of `src/lib/types.ts`:

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
  createdAt: any;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add CopyrightClaim type definition"
```

---

### Task 2: Add Firestore Functions

**Files:**
- Modify: `src/lib/firestore.ts` (append two new functions)

- [ ] **Step 1: Add `submitCopyrightClaim` function**

Add at the end of `src/lib/firestore.ts`:

```ts
export const submitCopyrightClaim = async (claim: {
  agentId: string;
  agentName: string;
  reporterId: string;
  reporterUsername: string;
  originalAgentUrl: string;
  description: string;
  evidenceUrl: string;
  relationship: "creator" | "representative";
}): Promise<string> => {
  const docRef = await addDoc(collection(db, "copyright_claims"), {
    ...claim,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};
```

- [ ] **Step 2: Add `hasCopyrightClaim` function**

Add after `submitCopyrightClaim` in the same file:

```ts
export const hasCopyrightClaim = async (agentId: string, userId: string): Promise<boolean> => {
  const q = query(
    collection(db, "copyright_claims"),
    where("agentId", "==", agentId),
    where("reporterId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/firestore.ts
git commit -m "feat: add submitCopyrightClaim and hasCopyrightClaim Firestore functions"
```

---

### Task 3: Create CopyrightClaimModal Component

**Files:**
- Create: `src/components/CopyrightClaimModal.tsx`

- [ ] **Step 1: Create the modal component**

Create `src/components/CopyrightClaimModal.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { submitCopyrightClaim, hasCopyrightClaim } from "@/lib/firestore";

interface CopyrightClaimModalProps {
  agentId: string;
  agentName: string;
  open: boolean;
  onClose: () => void;
}

export function CopyrightClaimModal({ agentId, agentName, open, onClose }: CopyrightClaimModalProps) {
  const { user, githubProfile } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [relationship, setRelationship] = useState<"creator" | "representative">("creator");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!open || !user) return;
    setChecking(true);
    hasCopyrightClaim(agentId, user.uid)
      .then((exists) => setAlreadyClaimed(exists))
      .catch(() => setAlreadyClaimed(false))
      .finally(() => setChecking(false));
  }, [open, user, agentId]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!user || !originalUrl.trim() || !description.trim() || !evidenceUrl.trim()) return;
    setSubmitting(true);
    try {
      await submitCopyrightClaim({
        agentId,
        agentName,
        reporterId: user.uid,
        reporterUsername: githubProfile?.login || user.displayName || "unknown",
        originalAgentUrl: originalUrl.trim(),
        description: description.trim(),
        evidenceUrl: evidenceUrl.trim(),
        relationship,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit copyright claim", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = originalUrl.trim() && description.trim() && evidenceUrl.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-panel relative mx-4 w-full max-w-lg rounded-[2rem] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e74c3c]/20 bg-[#e74c3c]/10">
            <Shield className="h-5 w-5 text-[#e74c3c]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1a1a2e]">Report Copyright Infringement</h3>
            <p className="text-xs text-[#64748b]">Against: {agentName}</p>
          </div>
        </div>

        {checking ? (
          <p className="text-sm text-[#64748b]">Checking claim status...</p>
        ) : alreadyClaimed ? (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-700">
            You have already submitted a copyright claim for this agent. We will review it within 48 hours.
          </div>
        ) : submitted ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-700">
            Your claim has been submitted. We'll review it within 48 hours.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1a1a2e]">Your original agent URL or name</label>
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://github.com/... or agent name"
                className="control-shell w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1a1a2e]">Description of infringement</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how this agent infringes on your work"
                className="control-shell textarea-shell w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1a1a2e]">Evidence URL</label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="Link to your original code, docs, or listing"
                className="control-shell w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1a1a2e]">Your relationship to the original work</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as "creator" | "representative")}
                className="control-shell select-shell w-full text-sm"
              >
                <option value="creator">I am the creator</option>
                <option value="representative">I represent the creator</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={submitting || !isValid}
              className="w-full bg-[#e74c3c] text-white hover:bg-[#ff5645]"
            >
              {submitting ? "Submitting..." : "Submit Copyright Claim"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/CopyrightClaimModal.tsx
git commit -m "feat: add CopyrightClaimModal component"
```

---

### Task 4: Integrate into Agent Detail Page

**Files:**
- Modify: `src/app/agents/[id]/page.tsx`

- [ ] **Step 1: Add imports**

Add these imports at the top of `src/app/agents/[id]/page.tsx` (after existing imports):

```tsx
import { Shield } from "lucide-react";
import { CopyrightClaimModal } from "@/components/CopyrightClaimModal";
import Link from "next/link";
```

Note: `Link` and `Shield` may already be imported — check first and only add what's missing.

- [ ] **Step 2: Add state for modal**

Inside the component function, after existing state declarations (near `const [submitting, setSubmitting]`), add:

```tsx
const [claimOpen, setClaimOpen] = useState(false);
```

- [ ] **Step 3: Add the report button and modal after the reviews section**

After the closing `</div>` of the reviews section (line 209), add:

```tsx
        <div className="mt-12 border-t border-black/[0.06] pt-6">
          {user ? (
            <button
              type="button"
              onClick={() => setClaimOpen(true)}
              className="flex items-center gap-2 text-sm text-[#64748b] transition-colors hover:text-[#e74c3c]"
            >
              <Shield className="h-4 w-4" />
              Report Copyright Infringement
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-sm text-[#64748b] transition-colors hover:text-[#e74c3c]">
              <Shield className="h-4 w-4" />
              Sign in to report infringement
            </Link>
          )}
        </div>

        {user && (
          <CopyrightClaimModal
            agentId={agent.id}
            agentName={agent.name}
            open={claimOpen}
            onClose={() => setClaimOpen(false)}
          />
        )}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Manual verification**

1. Visit `/agents/[any-agent-id]` while signed in — "Report Copyright Infringement" link visible below reviews
2. Click it — modal opens with form
3. Fill out form and submit — success message appears
4. Close and reopen — "Already submitted" message shown
5. Visit while signed out — "Sign in to report infringement" shown

- [ ] **Step 6: Commit**

```bash
git add src/app/agents/[id]/page.tsx
git commit -m "feat: integrate copyright claim button and modal into agent detail page"
```
