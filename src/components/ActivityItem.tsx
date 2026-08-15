"use client";

import { formatDistanceToNow } from "date-fns";

export interface ActivityFeedItem {
  id: string;
  agentName: string;
  repoType: string;
  eventType: string;
  timestamp?: { toDate?: () => Date } | Date | string | null;
}

const getAccentClass = (value: string) => {
  const accents = [
    "bg-[#ff8c7e]",
    "bg-[#4ade80]",
    "bg-[#60a5fa]",
    "bg-[#f59e0b]",
    "bg-[#c084fc]",
  ];

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return accents[Math.abs(hash) % accents.length];
};

const normalizeDate = (value: ActivityFeedItem["timestamp"]) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  if (typeof value === "object" && typeof value.toDate === "function") return value.toDate();
  return new Date();
};

export const ActivityItem = ({ item }: { item: ActivityFeedItem }) => {
  const accent = getAccentClass(item.agentName);
  const timestamp = normalizeDate(item.timestamp);

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3 transition-colors hover:border-[#e74c3c]/20 hover:bg-black/[0.03]">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${accent}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-[#374151]">
          <span className="font-bold text-[#1a1a2e]">{item.agentName}</span>
          {" was "}
          <span className="font-medium text-[#ff8c7e]">{item.eventType}</span>
          {" in a "}
          <span className="font-medium text-[#64748b]">{item.repoType}</span>
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#64748b]">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
