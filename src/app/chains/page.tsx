"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Workflow } from "lucide-react";

const DEMO_CHAINS = [
  { id: "demo-1", name: "Code Review Pipeline", nodes: [], edges: [], userId: "demo", schemaMappings: {}, createdAt: new Date().toISOString() },
  { id: "demo-2", name: "Bug Triage Workflow", nodes: [], edges: [], userId: "demo", schemaMappings: {}, createdAt: new Date().toISOString() },
];

export default function ChainsPage() {
  const [chains, setChains] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/chains")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChains(data);
        else setChains(DEMO_CHAINS);
      })
      .catch(() => {
        setChains(DEMO_CHAINS);
      });
  }, []);

  return (
    <div className="page-container min-h-screen py-20 text-[#1a1a2e]">
      <div className="mb-12 flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.2),transparent_45%),#fafafa] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.08)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow-badge mb-4 inline-flex">
            Workflows
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Build multi-agent workflows</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#64748b]">
            Combine marketplace agents into reusable execution graphs and save them as shared workflows.
          </p>
        </div>
        <Link href={`/chains/new`}>
          <Button className="flex items-center gap-2 rounded-xl bg-[#e74c3c] px-5 py-6 text-white hover:bg-[#f05a48]">
            <Plus className="w-4 h-4" />
            Create workflow
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chains.length === 0 ? (
          <div className="col-span-full flex flex-col items-center rounded-[1.75rem] border border-dashed border-[#e74c3c]/25 bg-[linear-gradient(180deg,rgba(231,76,60,0.08),rgba(0,0,0,0.02))] py-12 text-center text-[#64748b]">
            <Workflow className="mb-4 h-12 w-12 text-[#ff8c7e]/70" />
            <h3 className="mb-2 text-xl font-semibold">No workflows yet</h3>
            <p>Build your first multi-agent workflow to combine discovery, evaluation, and execution.</p>
          </div>
        ) : (
          chains.map(c => (
            <Link key={c.id} href={`/chains/${c.id}`} className="group relative block overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-[#e74c3c]/35 hover:bg-[#f5f5f7]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e74c3c]/45 to-transparent opacity-0 transition group-hover:opacity-100" />
              <h3 className="text-xl font-bold mb-2">{c.name}</h3>
              <div className="mb-6 flex gap-2 text-sm text-[#64748b]">
                <span>{c.nodes?.length || 0} agents</span>
                <span>•</span>
                <span>{c.edges?.length || 0} connections</span>
              </div>
              <div className="flex -space-x-3">
                {c.nodes?.slice(0, 4).map((n: any, i: number) => (
                  <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e74c3c]/10 text-xs font-bold text-[#e74c3c] shadow-xl">
                    {n.data.agent.name.substring(0, 2).toUpperCase()}
                  </div>
                ))}
                {c.nodes?.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-black/10 flex items-center justify-center text-xs font-bold text-[#1a1a2e] shadow-xl">
                    +{c.nodes.length - 4}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
