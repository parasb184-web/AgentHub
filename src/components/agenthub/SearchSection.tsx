"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_FILTERS = ["Code review", "Document extraction", "Support automation", "Translation", "Analytics"];

export function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const navigateToSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      router.push("/agents");
      return;
    }
    router.push(`/agents?q=${encodeURIComponent(normalized)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToSearch(query);
  };

  return (
    <section className="relative z-20 mt-8 flex w-full justify-center px-6 sm:mt-6">
      <div className="mx-auto w-full max-w-[840px]">
        <div className="glass-panel group relative overflow-hidden rounded-[1.75rem] p-2 md:p-2.5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e74c3c]/0 via-[#e74c3c]/10 to-[#e74c3c]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full ease-in-out"></div>
          
          <form onSubmit={handleSubmit} className="flex items-center rounded-[1.25rem] border border-black/10 bg-white/90 px-3 py-3 md:px-5 md:py-4 transition-all focus-within:border-[#e74c3c]/60 focus-within:shadow-[0_0_20px_rgba(231,76,60,0.15)]">
            <svg className="w-5 h-5 text-[#64748b] mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by capability, language, or integration task"
              className="w-full bg-transparent border-none outline-none text-[#1a1a2e] text-base md:text-lg placeholder:text-[#64748b]/50 font-medium"
            />
            <button type="submit" className={cn(buttonVariants({ size: "sm" }), "ml-4 hidden rounded-full sm:inline-flex")}>
              Search
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {QUICK_FILTERS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigateToSearch(tag)}
                className="rounded-full border border-black/10 bg-[#f0f0f2]/70 px-4 py-1.5 text-xs font-medium text-[#64748b] transition-colors hover:border-[#e74c3c]/28 hover:text-[#1a1a2e]"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center text-[11px] font-mono text-[#64748b]">
            <div className="w-2 h-2 rounded-full bg-[#e74c3c] mr-2 live-dot"></div>
            Search the live catalog
          </div>
        </div>
      </div>
    </section>
  );
}
