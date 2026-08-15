"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeedItem, ActivityItem } from "@/components/ActivityItem";

const FALLBACK_FEED: ActivityFeedItem[] = [
  {
    id: "fallback-1",
    agentName: "Release Note Pilot",
    repoType: "Next.js app",
    eventType: "deployed",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    agentName: "Model Eval Copilot",
    repoType: "Python ML repo",
    eventType: "started using",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "fallback-3",
    agentName: "Issue Triage Radar",
    repoType: "TypeScript API",
    eventType: "integrated",
    timestamp: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
  },
  {
    id: "fallback-4",
    agentName: "DeckBrief AI",
    repoType: "product ops team",
    eventType: "started using",
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
  },
];

const fetchActivity = async (): Promise<ActivityFeedItem[]> => {
  const response = await fetch("/api/activity");
  if (!response.ok) {
    throw new Error("Failed to load activity feed");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : FALLBACK_FEED;
};

export const LiveFeed = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage", "activity-feed"],
    queryFn: fetchActivity,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    retry: false,
  });

  const items = useMemo(() => (data && data.length > 0 ? data.slice(0, 8) : FALLBACK_FEED), [data]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.09),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.02),transparent_36%)]" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#86efac]">
              <CircleDot className="h-3.5 w-3.5 live-dot" />
              Activity
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1a1a2e]">Marketplace activity</h3>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Recent launches, integrations, and usage events across the marketplace.
            </p>
          </div>
        </div>

        <div className="space-y-3" style={{ maxHeight: 420 }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-20 rounded-2xl bg-black/8" />
              ))
            : items.map((item) => <ActivityItem key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
