"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AINewsResponse } from "@/lib/homepageFeed";

const fetchNews = async (): Promise<AINewsResponse> => {
  const response = await fetch("/api/ai-news");
  if (!response.ok) {
    throw new Error("Failed to load AI news");
  }
  return response.json();
};

const formatPublishedDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const LatestAINewsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage", "ai-news"],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 15,
  });

  const items = data?.items || [];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(231,76,60,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.02),transparent_38%)]" />

      <div className="relative z-10">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e74c3c]/25 bg-[#e74c3c]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8c7e]">
            <Newspaper className="h-3.5 w-3.5" />
            Market Intelligence
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] md:text-3xl">
            Coverage that matters to builders
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">
            Recent reporting across models, tooling, and platform changes that shape the agent ecosystem.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-[1.5rem] border border-black/8 bg-black/[0.02] p-5 transition-colors hover:border-[#e74c3c]/25 hover:bg-black/[0.03]"
              >
                <div className="space-y-4">
                  <Skeleton className="h-4 w-28 bg-black/8" />
                  <Skeleton className="h-14 w-full bg-black/8" />
                  <Skeleton className="h-4 w-36 bg-black/8" />
                </div>
              </div>
            ))
            : items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-black/8 bg-black/[0.02] p-5 transition-colors hover:border-[#e74c3c]/25 hover:bg-black/[0.03]"
              >
                <div className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Badge variant="outline" className="border-black/10 bg-black/[0.03] font-medium text-[#1a1a2e]">
                      {item.source}
                    </Badge>
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#64748b]">
                      {formatPublishedDate(item.publishedAt)}
                    </span>
                  </div>

                  <p className="flex-1 text-base font-bold leading-7 text-[#1a1a2e]">
                    {item.title}
                  </p>

                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ff8c7e] transition-colors hover:text-[#1a1a2e]"
                  >
                    Open story
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
