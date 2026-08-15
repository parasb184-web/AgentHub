"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Flame, GitFork, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingAgentsResponse } from "@/lib/homepageFeed";

const fetchTrendingAgents = async (): Promise<TrendingAgentsResponse> => {
  const response = await fetch("/api/trending-agents");
  if (!response.ok) {
    throw new Error("Failed to load trending agents");
  }
  return response.json();
};

const formatCompactNumber = (value: number) =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const formatRelativeDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));

export const TrendingAgentsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage", "trending-agents"],
    queryFn: fetchTrendingAgents,
    staleTime: 1000 * 60 * 30,
  });

  const trending = data?.trending || [];
  const picked = data?.picked || [];

  return (
    <section className="w-full py-8 md:py-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
        <div className="relative overflow-visible rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-8 lg:p-10">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.02),transparent_36%)]" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e74c3c]/25 bg-[#e74c3c]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff8c7e]">
                  <Flame className="h-3.5 w-3.5" />
                  Trending Repositories
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-4xl">
                  Repositories with strong recent momentum
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#64748b] md:text-base">
                  A curated view of repositories and tools gaining traction across the agent ecosystem.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                {isLoading
                  ? Array.from({ length: 3 }, (_, index) => (
                    <div
                      key={`picked-${index}`}
                      className="rounded-2xl border border-black/8 bg-black/[0.03] px-4 py-4"
                    >
                      <Skeleton className="h-16 rounded-xl bg-black/8" />
                    </div>
                  ))
                  : picked.slice(0, 3).map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-2xl border border-black/8 bg-black/[0.03] px-4 py-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff8c7e]">
                          Selected
                        </span>
                        <Sparkles className="h-4 w-4 text-[#ff8c7e]" />
                      </div>
                      <p className="line-clamp-1 text-sm font-bold text-[#1a1a2e]">{agent.name}</p>
                      <p className="mt-1 text-xs font-medium text-[#64748b]">
                        {formatCompactNumber(agent.stars)} stars
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={`trend-${index}`}
                    className="group flex flex-col rounded-[1.75rem] border border-black/8 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#e74c3c]/28 hover:bg-black/[0.03]"
                  >
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-2/3 bg-black/8" />
                      <Skeleton className="h-12 w-full bg-black/8" />
                      <Skeleton className="h-10 w-full bg-black/8" />
                    </div>
                  </div>
                ))
                : trending.slice(0, 6).map((agent, index) => (
                  <div
                    key={agent.id}
                    className="group flex flex-col rounded-[1.75rem] border border-black/8 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#e74c3c]/28 hover:bg-black/[0.03]"
                  >
                    <>
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-3 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-[#e74c3c]/25 bg-[#e74c3c]/10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff8c7e]"
                            >
                              #{index + 1} trending
                            </Badge>
                            <Badge variant="outline" className="border-black/10 bg-black/[0.03] font-medium text-[#1a1a2e]">
                              {agent.language}
                            </Badge>
                          </div>
                          <h3 className="line-clamp-1 text-lg font-bold text-[#1a1a2e]">{agent.name}</h3>
                          <p className="mt-1 text-sm font-medium text-[#64748b]">by {agent.owner}</p>
                        </div>
                        <Image
                          src={agent.ownerAvatarUrl}
                          alt={agent.owner}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full border border-black/10 object-cover"
                        />
                      </div>

                      <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#6b7280]">
                        {agent.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {agent.topics.slice(0, 3).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="border-black/10 bg-black/[0.03] text-[11px] text-[#374151]"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-sm">
                        <div>
                          <div className="flex items-center gap-1 font-bold text-[#ffd07f]">
                            <Star className="h-3.5 w-3.5 fill-[#ffd07f] text-[#ffd07f]" />
                            <span>{formatCompactNumber(agent.stars)}</span>
                          </div>
                          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Stars</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 font-bold text-[#ff8c7e]">
                            <GitFork className="h-3.5 w-3.5" />
                            <span>{formatCompactNumber(agent.forks)}</span>
                          </div>
                          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Forks</p>
                        </div>
                        <div>
                          <div className="font-bold text-[#1a1a2e]">{agent.velocityScore}/99</div>
                          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Velocity</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#64748b]">
                          Updated {formatRelativeDate(agent.updatedAt)}
                        </p>
                        <Link
                          href={agent.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#ff8c7e] transition-colors hover:text-[#1a1a2e]"
                        >
                          View repo
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
