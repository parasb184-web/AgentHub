"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { collection, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { Agent } from "@/lib/types";

interface AgentCallRecord {
  id: string;
  agentId: string;
  latencyMs: number;
  success: boolean;
  timestamp?: { toDate?: () => Date } | Date;
}

type AgentBreakdownRow = {
  id: string;
  name: string;
  calls: number;
  latency: number;
  trust: number;
  rating: number;
  revenue: number;
};

const numericSortKeys: Exclude<keyof AgentBreakdownRow, "id" | "name">[] = [
  "calls",
  "latency",
  "trust",
  "rating",
  "revenue",
];

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

const normalizeDate = (value?: { toDate?: () => Date } | Date) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "object" && typeof value.toDate === "function") return value.toDate();
  return new Date();
};

export const DeveloperAnalytics = ({ agents }: { agents: Agent[] }) => {
  const [calls, setCalls] = useState<AgentCallRecord[] | null>(null);
  const [callsToday, setCallsToday] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [sortKey, setSortKey] = useState<"name" | "calls" | "latency" | "trust" | "rating" | "revenue">("calls");

  useEffect(() => {
    if (agents.length === 0) {
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setCalls([]);
      setCallsToday(0);
      return;
    }

    const agentIds = agents.map((agent) => agent.id).slice(0, 10);
    const callsQuery = query(collection(db, "agent_calls"), where("agentId", "in", agentIds));

    getDocs(callsQuery)
      .then((snapshot) => {
        const nextCalls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AgentCallRecord, "id">),
        }));
        setCalls(nextCalls);
      })
      .catch(() => setCalls([]));

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const liveQuery = query(
      collection(db, "agent_calls"),
      where("agentId", "in", agentIds),
      where("timestamp", ">=", Timestamp.fromDate(startOfToday))
    );

    const unsubscribe = onSnapshot(
      liveQuery,
      (snapshot) => {
        setCallsToday(snapshot.docs.length);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 1500);
      },
      () => {
        setCallsToday(0);
      }
    );

    return unsubscribe;
  }, [agents]);

  const totals = useMemo(() => {
    const totalCalls = (calls || []).length;
    const avgCost = agents.length
      ? agents.reduce((acc, agent) => acc + (agent.costPerCall || 0), 0) / agents.length
      : 0;
    const revenue = totalCalls * avgCost;
    const avgTrust = agents.length
      ? agents.reduce((acc, agent) => acc + (agent.trustScore || 0), 0) / agents.length
      : 0;

    return { totalCalls, revenue, avgTrust };
  }, [agents, calls]);

  const dailyCalls = useMemo(() => {
    const buckets = Array.from({ length: 14 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - index));
      date.setHours(0, 0, 0, 0);
      return {
        key: date.toDateString(),
        label: formatDayLabel(date),
        count: 0,
      };
    });

    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    (calls || []).forEach((call) => {
      const date = normalizeDate(call.timestamp);
      date.setHours(0, 0, 0, 0);
      const bucket = bucketMap.get(date.toDateString());
      if (bucket) bucket.count += 1;
    });

    return buckets;
  }, [calls]);

  const latencyTrend = useMemo(() => {
    const buckets = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);
      return {
        key: date.toDateString(),
        label: formatDayLabel(date),
        totalLatency: 0,
        count: 0,
      };
    });

    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    (calls || []).forEach((call) => {
      const date = normalizeDate(call.timestamp);
      date.setHours(0, 0, 0, 0);
      const bucket = bucketMap.get(date.toDateString());
      if (bucket) {
        bucket.count += 1;
        bucket.totalLatency += call.latencyMs || 0;
      }
    });

    return buckets.map((bucket) => ({
      label: bucket.label,
      latency: bucket.count ? Math.round(bucket.totalLatency / bucket.count) : 0,
    }));
  }, [calls]);

  const agentBreakdown = useMemo(() => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const rows: AgentBreakdownRow[] = agents.map((agent) => {
      const agentCalls = (calls || []).filter((call) => call.agentId === agent.id);
      const recentCalls = agentCalls.filter((call) => normalizeDate(call.timestamp) >= last7Days);
      const avgLatency = recentCalls.length
        ? Math.round(recentCalls.reduce((acc, call) => acc + (call.latencyMs || 0), 0) / recentCalls.length)
        : 0;
      const revenue = recentCalls.length * (agent.costPerCall || 0);

      return {
        id: agent.id,
        name: agent.name,
        calls: recentCalls.length,
        latency: avgLatency,
        trust: agent.trustScore || 0,
        rating: agent.rating || 0,
        revenue,
      };
    });

    return rows.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      const activeKey = numericSortKeys.find((key) => key === sortKey) ?? "calls";
      return b[activeKey] - a[activeKey];
    });
  }, [agents, calls, sortKey]);

  if (agents.length === 0) {
    return null;
  }

  if (calls === null) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl bg-black/6" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-3xl bg-black/6" />
      </div>
    );
  }

  return (
    <section className="mt-16 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">Usage and revenue</h2>
          <p className="mt-2 text-sm text-muted-foreground">Operational signals across the agents published from your account.</p>
        </div>
        <div className={`rounded-full border px-4 py-2 text-sm ${pulse ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" : "border-black/10 bg-black/[0.03] text-[#374151]"}`}>
          Requests today: {callsToday}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">Requests</p><p className="mt-3 text-3xl font-mono text-[#1a1a2e]">{totals.totalCalls.toLocaleString()}</p></CardContent></Card>
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">Estimated revenue</p><p className="mt-3 text-3xl font-mono text-[#1a1a2e]">${totals.revenue.toFixed(2)}</p></CardContent></Card>
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">Average trust</p><p className="mt-3 text-3xl font-mono text-[#1a1a2e]">{Math.round(totals.avgTrust)}</p></CardContent></Card>
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">Published agents</p><p className="mt-3 text-3xl font-mono text-[#1a1a2e]">{agents.length}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><h3 className="mb-4 text-lg font-semibold text-[#1a1a2e]">Daily requests · last 14 days</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={dailyCalls}><CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} /><XAxis dataKey="label" stroke="rgba(0,0,0,0.45)" /><YAxis stroke="rgba(0,0,0,0.45)" /><Tooltip contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }} /><Bar dataKey="count" fill="#e74c3c" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="border-black/10 bg-transparent"><CardContent className="p-6"><h3 className="mb-4 text-lg font-semibold text-[#1a1a2e]">Latency trend · last 7 days</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={latencyTrend}><CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} /><XAxis dataKey="label" stroke="rgba(0,0,0,0.45)" /><YAxis stroke="rgba(0,0,0,0.45)" /><Tooltip contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }} /><Line type="monotone" dataKey="latency" stroke="#ff8c7e" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></CardContent></Card>
      </div>

      <Card className="border-black/10 bg-transparent">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#1a1a2e]">Per-agent breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-[#6b7280]">
                  {[
                    ["name", "Agent Name"],
                    ["calls", "Requests (7d)"],
                    ["latency", "Avg Latency"],
                    ["trust", "Trust Score"],
                    ["rating", "Rating"],
                    ["revenue", "Revenue"],
                  ].map(([key, label]) => (
                    <th key={key} className="cursor-pointer px-4 py-3 font-medium" onClick={() => setSortKey(key as typeof sortKey)}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agentBreakdown.map((row) => (
                  <tr key={row.id} className="border-b border-black/6 text-[#374151]">
                    <td className="px-4 py-3"><a href={`/agents/${row.id}`} className="hover:text-[#ff8c7e]">{row.name}</a></td>
                    <td className="px-4 py-3">{row.calls}</td>
                    <td className="px-4 py-3">{row.latency} ms</td>
                    <td className="px-4 py-3">{row.trust}</td>
                    <td className="px-4 py-3">{row.rating.toFixed(1)}</td>
                    <td className="px-4 py-3">${row.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
