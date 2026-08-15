"use client";

import { useState } from "react";
import { ScanSearch, Github } from "lucide-react";
import { Button } from "./ui/button";

export function ScanInput({ onAnalyze }: { onAnalyze: (input: string) => void }) {
  const [input, setInput] = useState("");
  const isGitHubUrl = /github\.com\/[\w.-]+\/[\w.-]+/i.test(input);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="group relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-3 shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
        <textarea
          className="min-h-[180px] w-full resize-none rounded-[1.5rem] border border-black/8 bg-black/[0.02] p-6 font-mono text-lg text-[#1a1a2e] outline-none transition-colors placeholder:text-[#64748b]/65 focus:border-[#e74c3c]/55"
          placeholder="Paste a GitHub repository URL, for example https://github.com/vercel/next.js"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1a1a2e]">
          <Github className="h-4 w-4" />
          GitHub repository
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <p className="text-sm text-[#64748b]">
            AgentHub currently supports public GitHub repository URLs for scan analysis.
          </p>
          {input && (
            <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${isGitHubUrl ? "border-[#4ade80]/20 bg-[#4ade80]/10 text-[#86efac]" : "border-[#e74c3c]/20 bg-[#e74c3c]/10 text-[#ff8c7e]"}`}>
              {isGitHubUrl ? "URL detected" : "Invalid URL"}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!isGitHubUrl}
          onClick={() => onAnalyze(input)}
          className="flex h-12 items-center gap-2 rounded-xl bg-[#e74c3c] px-8 text-base font-semibold text-white hover:bg-[#ff5645]"
        >
          <ScanSearch className="h-5 w-5" />
          Run repository scan
        </Button>
      </div>
    </div>
  );
}
