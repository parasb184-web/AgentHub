"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, GitPullRequest, LayoutTemplate, Star, Users, ArrowRight, Copy, Link2, BadgeCheck } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Agent } from "@/lib/types";

interface RepoPainPoint {
  painPoint: string;
  agentCategory: string;
  specificReason: string;
  estimatedTimeSaved: string;
}

interface RepoDNAResultData {
  ownerRepo?: string;
  repoMeta?: {
    stars?: number;
    contributors?: number;
    openIssues?: number;
    primaryLanguage?: string;
  };
  painPoints?: RepoPainPoint[];
  matchedAgents: Agent[];
}

export function RepoDNAResult({ result }: { result: RepoDNAResultData | null }) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedField, setCopiedField] = useState<"url" | "badge" | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingStep(1), 500);
    const timer2 = setTimeout(() => setLoadingStep(2), 1500);
    const timer3 = setTimeout(() => setLoadingStep(3), 3000);
    const timer4 = setTimeout(() => setLoadingStep(4), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const steps = [
    "Fetching repository metadata...",
    "Inspecting project structure...",
    "Reviewing recent commits...",
    "Matching agent opportunities...",
  ];

  if (!result) {
    return (
      <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] px-6 py-12 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
        <div className="mb-8 h-16 w-16 animate-spin rounded-full border-b-2 border-r-2 border-[#e74c3c]"></div>
        <p className="font-mono text-sm text-[#64748b]">Preparing repository analysis...</p>
      </div>
    );
  }

  const { repoMeta, painPoints, matchedAgents } = result;
  const ownerRepo = result.ownerRepo || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://agenthub.io";
  const shareUrl = ownerRepo ? `${origin}/stack/${ownerRepo}` : "";
  const badgeMarkdown = ownerRepo
    ? `[![AgentHub](${origin}/api/badge/${ownerRepo})](${origin}/stack/${ownerRepo})`
    : "";

  if (loadingStep < 4) {
    return (
      <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] px-6 py-12 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
        <div className="mb-8 h-16 w-16 animate-spin rounded-full border-b-2 border-r-2 border-[#e74c3c]"></div>
        <div className="w-full max-w-sm space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${loadingStep >= idx ? "opacity-100" : "opacity-30"}`}>
              <CheckCircle2 className={`h-5 w-5 ${loadingStep > idx ? "text-[#4ade80]" : "text-[#ff8c7e]"}`} />
              <span className={`font-mono text-sm font-bold ${loadingStep > idx ? "text-[#64748b]" : "text-[#1a1a2e]"}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCopy = async (value: string, field: "url" | "badge") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast("Copied!");
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast("Copy failed");
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-5xl animate-in slide-in-from-bottom-4 fade-in py-12 duration-1000">
      <div className="mb-12 flex flex-wrap gap-6 rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2"><Star className="h-5 w-5 text-[#ffd07f]" /> <span className="font-mono font-bold text-[#1a1a2e]">{repoMeta?.stars} Stars</span></div>
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-[#ff8c7e]" /> <span className="font-mono font-bold text-[#1a1a2e]">{repoMeta?.contributors} Contributors</span></div>
        <div className="flex items-center gap-2"><GitPullRequest className="h-5 w-5 text-[#4ade80]" /> <span className="font-mono font-bold text-[#1a1a2e]">{repoMeta?.openIssues} Open Issues</span></div>
        <div className="flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-[#c084fc]" /> <span className="font-mono font-bold text-[#1a1a2e]">{repoMeta?.primaryLanguage}</span></div>
      </div>

      <div className="space-y-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#1a1a2e]">Recommended agent opportunities</h2>

        {painPoints?.map((pp, idx) => {
          const matchingAgent = matchedAgents.find((a) => a.capabilityTags?.includes(pp.agentCategory));

          return (
            <div key={idx} className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <div className="mb-6 flex items-start justify-between">
                <div className="max-w-3xl">
                  <h3 className="mb-2 text-lg font-bold text-[#1a1a2e]">{pp.painPoint}</h3>
                  <p className="border-l-2 border-black/10 pl-4 text-sm text-[#64748b]">{pp.specificReason}</p>
                </div>
                <div className="whitespace-nowrap rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-3 py-1 text-xs font-bold text-[#86efac]">
                  {pp.estimatedTimeSaved}
                </div>
              </div>

              {matchingAgent ? (
                <div className="border-t border-black/10 pt-4">
                  <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-[#64748b]">Recommended agent</span>
                  <div className="max-w-sm">
                    <AgentCard agent={matchingAgent} />
                  </div>
                </div>
              ) : (
                <div className="border-t border-black/10 pt-4 text-sm font-mono text-[#64748b]">
                  No marketplace match was found yet for &quot;{pp.agentCategory}&quot;.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        {shareUrl ? (
          <div className="w-full rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
            <div className="mb-6 flex items-center gap-2 text-[#ff8c7e]">
              <BadgeCheck className="h-5 w-5" />
              <h3 className="text-xl font-bold text-[#1a1a2e]">Share this repository analysis</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#64748b]">Shareable URL</p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input readOnly value={shareUrl} className="control-shell bg-black/[0.02] text-sm font-medium" />
                  <Button onClick={() => handleCopy(shareUrl, "url")} className="bg-[#e74c3c] font-bold text-white hover:bg-[#ff5645]">
                    {copiedField === "url" ? "Copied!" : "Copy URL"}
                    <Link2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#64748b]">README badge markdown</p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <textarea readOnly value={badgeMarkdown} className="control-shell textarea-shell min-h-24 bg-black/[0.02] font-mono text-sm" />
                  <Button onClick={() => handleCopy(badgeMarkdown, "badge")} variant="outline" className="border-black/10 bg-black/[0.03] font-bold text-[#1a1a2e] hover:bg-black/[0.06]">
                    {copiedField === "badge" ? "Copied!" : "Copy badge"}
                    <Copy className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <a href={shareUrl} className="flex items-center gap-2 rounded-xl bg-[#e74c3c] px-8 py-3 font-bold text-white shadow-[0_14px_35px_rgba(231,76,60,0.28)] transition-all hover:bg-[#ff5645]">
                  Open public stack page <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <button className="flex items-center gap-2 rounded-xl bg-[#e74c3c] px-8 py-3 font-bold text-white shadow-[0_14px_35px_rgba(231,76,60,0.28)] transition-all hover:bg-[#ff5645]">
            Generate public stack page <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
