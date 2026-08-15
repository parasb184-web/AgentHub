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
