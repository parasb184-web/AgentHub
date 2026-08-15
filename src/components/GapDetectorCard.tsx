"use client";

import { AgentCard } from "./AgentCard";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function GapDetectorCard({ gapInfo, onAdd }: { gapInfo: any; onAdd?: () => void }) {
  const { category, agent, impact } = gapInfo;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e74c3c]/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
      <div className="absolute right-0 top-0 z-10 rounded-bl-xl border-b border-l border-[#e74c3c]/20 bg-[#e74c3c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff8c7e]">
        Missing Context
      </div>

      <div className="relative z-0 flex h-full flex-col rounded-[1.4rem] border border-black/8 bg-black/[0.02] p-5">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#1a1a2e]">
            <Zap className="h-4 w-4 text-[#ffd07f]" />
            {category.replace("-", " ")}
          </h3>
          <p className="mt-2 rounded-lg border border-[#4ade80]/18 bg-[#4ade80]/10 p-2 text-sm font-bold text-[#86efac]">
            {impact}
          </p>
        </div>

        <div className="flex-1">
          <AgentCard agent={agent} />
        </div>

        <Button onClick={onAdd} className="group mt-4 w-full border border-black/10 bg-black/[0.03] font-bold text-[#1a1a2e] hover:bg-black/[0.06]">
          {onAdd ? "Add to workflow" : "Review recommendation"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
