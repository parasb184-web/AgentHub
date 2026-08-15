"use client";

import { Agent } from "@/lib/types";
import { AgentCard } from "./AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const AgentGrid = ({ agents, isLoading }: { agents: Agent[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-[26px] border border-black/8 bg-black/[0.03]" />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-black/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,252,0.98))] p-12 text-center">
        <img src="/assets/images/empty_agents.png" alt="No agents found" className="relative -left-2 mb-6 h-auto w-48 opacity-70" />
        <h3 className="mb-2 text-xl font-bold text-[#1a1a2e]">No agents matched this search</h3>
        <p className="max-w-sm text-[#64748b]">Clear the current filters or broaden the query to explore more agents in the marketplace.</p>
        <Link href="/agents" className="mt-5 inline-flex rounded-full border border-black/12 bg-black/[0.02] px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] transition-colors hover:border-[#e74c3c]/40 hover:bg-[#e74c3c]/10">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
