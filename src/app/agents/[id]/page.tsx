"use client";

import { useParams } from "next/navigation";
import { useAgent, useAgentReviews } from "@/hooks/useAgent";
import { SandboxPanel } from "@/components/SandboxPanel";
import { SDKSnippet } from "@/components/SDKSnippet";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Server, Shield, Star, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { addReview, checkHasRunSandbox } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CopyrightClaimModal } from "@/components/CopyrightClaimModal";
import Link from "next/link";

const formatReviewDate = (value: { seconds?: number } | undefined) => {
  if (!value?.seconds) return "Recently";
  return new Date(value.seconds * 1000).toLocaleDateString();
};

export default function AgentDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: agent, isLoading } = useAgent(id);
  const { data: reviews = [], refetch: refetchReviews } = useAgentReviews(id);
  const { user } = useAuth();

  const [hasRun, setHasRun] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  useEffect(() => {
    if (user && agent) {
      checkHasRunSandbox(agent.id, user.uid).then(setHasRun);
    }
  }, [user, agent]);

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-[1280px] px-6 py-16 md:px-12 lg:px-20">
        <Skeleton className="h-[400px] w-full rounded-[2rem] bg-black/8" />
      </div>
    );
  }

  if (!agent) {
    return <div className="mt-24 text-center text-[#1a1a2e]">Agent not found.</div>;
  }

  const submitReview = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await addReview(agent.id, user.uid, rating, reviewBody);
      setReviewBody("");
      refetchReviews();
      toast.success("Review submitted!");
    } catch {
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.14),transparent_30%),linear-gradient(180deg,rgba(250,250,252,0.7)_0%,rgba(255,255,255,1)_40%)]" />
      <div className="absolute inset-0 hero-grid opacity-[0.04]" />

      <div className="page-container relative pb-32 pt-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] md:text-5xl">{agent.name}</h1>
              <Badge variant="outline" className="border-black/10 bg-black/[0.03] text-xs font-mono text-[#374151]">
                v{agent.version}
              </Badge>
              <TrustScoreBadge trustScore={agent.trustScore} />
            </div>
            <p className="text-xl leading-relaxed text-[#64748b]">{agent.description}</p>

            <div className="mt-6 flex items-center gap-4 self-start rounded-[1.5rem] border border-black/10 bg-black/[0.02] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <img
                src={`https://github.com/${agent.creatorUsername}.png?size=48`}
                className="h-12 w-12 rounded-full border border-black/10"
                alt=""
              />
              <div>
                <div className="text-sm font-semibold text-[#64748b]">Publisher</div>
                <div className="flex items-center gap-1 font-mono text-base font-bold text-[#ff8c7e]">
                  @{agent.creatorUsername}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-4 lg:w-96">
            <div className="grid grid-cols-2 gap-4 rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#64748b]"><Activity className="h-3.5 w-3.5" /> Requests</div>
                <div className="text-2xl font-mono font-bold text-[#1a1a2e]">{((agent.totalCalls || 0) / 1000).toFixed(1)}k</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#64748b]"><Clock className="h-3.5 w-3.5" /> Avg Latency</div>
                <div className="text-2xl font-mono font-bold text-[#1a1a2e]">{agent.avgLatencyMs || 0}ms</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#64748b]"><Server className="h-3.5 w-3.5" /> Uptime</div>
                <div className="text-2xl font-mono font-bold text-[#4ade80]">{agent.uptimePercent || 0}%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#64748b]"><Star className="h-3.5 w-3.5" /> Rating</div>
                <div className="text-2xl font-mono font-bold text-[#ffd07f]">{agent.rating?.toFixed(1) || "N/A"}/5</div>
              </div>
            </div>

            <Button
              className="h-14 w-full gap-2 bg-[#e74c3c] text-lg font-bold text-white shadow-[0_14px_35px_rgba(231,76,60,0.18)] transition-all hover:bg-[#ff5645]"
              onClick={() => {
                if (!user) {
                  toast("Sign in with GitHub to provision access.");
                  return;
                }
                toast.success("Redirecting to the dashboard to provision API access...");
                setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
              }}
            >
              Provision access for ${agent.costPerCall}/call
            </Button>

            {user ? (
              <button
                type="button"
                onClick={() => setClaimOpen(true)}
                className="flex w-full flex-col items-center gap-1 rounded-xl border border-black/[0.06] bg-black/[0.01] py-3 text-[#64748b] transition-all hover:border-[#e74c3c]/20 hover:text-[#e74c3c]"
              >
                <Shield className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Report</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex w-full flex-col items-center gap-1 rounded-xl border border-black/[0.06] bg-black/[0.01] py-3 text-[#64748b] transition-all hover:border-[#e74c3c]/20 hover:text-[#e74c3c]"
              >
                <Shield className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Report</span>
              </Link>
            )}
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {agent.capabilityTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-black/10 bg-black/[0.03] px-3 py-1 font-mono text-sm text-[#374151]"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-black/10 pt-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-[#1a1a2e]">
              <Terminal className="h-6 w-6 text-[#ff8c7e]" /> Sandbox
            </h3>
            <p className="mb-6 text-[#64748b]">Run this agent in the browser to validate the request contract and inspect the response payload.</p>
            <SandboxPanel agent={agent} />
          </div>

          <div>
            <h3 className="mb-6 flex items-center justify-between text-2xl font-bold text-[#1a1a2e]">
              Integration
              <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-sm font-mono text-[#374151]">
                ${agent.costPerCall}/call
              </span>
            </h3>
            <p className="mb-6 text-[#64748b]">Use the generated examples below to call this agent through the AgentHub API.</p>
            <SDKSnippet agent={agent} />
          </div>
        </div>

        <div className="mt-24 max-w-3xl border-t border-black/10 pt-12">
          <h3 className="mb-8 text-2xl font-bold text-[#1a1a2e]">Ratings and reviews ({agent.reviewCount || 0})</h3>

          {reviews.length === 0 ? (
            <p className="text-[#64748b]">No reviews yet. Run the agent in the sandbox to leave the first review.</p>
          ) : (
            <div className="mb-12 space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-[1.5rem] border border-black/10 bg-black/[0.02] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-[#ffd07f] text-[#ffd07f]" : "text-black/20"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#64748b]">{formatReviewDate(r.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[#1a1a2e]">{r.body}</p>
                </div>
              ))}
            </div>
          )}

          {user && hasRun && (
            <div className="mt-8 rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <h4 className="mb-4 text-lg font-bold text-[#1a1a2e]">Leave a review</h4>
              <div className="mb-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <Star key={v} className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${v <= rating ? "fill-[#ffd07f] text-[#ffd07f]" : "text-black/20"}`} onClick={() => setRating(v)} />
                ))}
              </div>
              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                className="control-shell textarea-shell mb-4 h-24 bg-black/20 text-sm"
                placeholder="Describe response quality, latency, and fit for your use case."
              />
              <Button onClick={submitReview} disabled={submitting || !reviewBody} className="bg-[#e74c3c] text-white hover:bg-[#ff5645]">
                {submitting ? "Submitting..." : "Submit review"}
              </Button>
            </div>
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
      </div>
    </div>
  );
}
