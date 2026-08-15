"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useAgents } from "@/hooks/useAgents";
import { AgentGrid } from "@/components/AgentGrid";
import { DeveloperAnalytics } from "@/components/DeveloperAnalytics";
import { ApiKey } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { CheckCircle2, CloudFog, Key, Plus, Copy, Trash2 } from "lucide-react";

type DashboardApiKey = ApiKey & { rawKey?: string };

export default function DashboardPage() {
  const { user, githubProfile, loading } = useAuth();
  const { data: agents = [], isLoading } = useAgents();
  const [apiKeys, setApiKeys] = useState<DashboardApiKey[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showKeyModal, setShowKeyModal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/keys", { headers: { "x-user-id": user.uid } })
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setApiKeys(d) });
    }
  }, [user]);

  if (loading) return null;

  if (!user || !githubProfile) {
    return (
      <div className="min-h-[70vh] px-6 py-20 text-[#1a1a2e]">
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top,rgba(231,76,60,0.18),transparent_55%),#fafafa] px-8 py-14 text-center shadow-[0_28px_90px_rgba(0,0,0,0.08)]">
          <CloudFog className="mb-5 h-16 w-16 text-[#ff8c7e]" />
          <span className="eyebrow-badge mb-5 inline-flex">
            Creator Dashboard
          </span>
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Sign in to open your creator dashboard</h2>
          <p className="max-w-md text-base leading-7 text-[#64748b]">
            Use GitHub access to manage API keys, review usage, and monitor the performance of your published agents.
          </p>
        </div>
      </div>
    );
  }

  const myAgents = agents.filter(a => a.creatorId === user.uid);
  const totalEarnings = myAgents.reduce((acc, curr) => acc + ((curr.totalCalls || 0) * (curr.costPerCall || 0)), 0);

  const createKey = async () => {
    const r = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": user.uid },
      body: JSON.stringify({ label: newKeyLabel || "Default Key" })
    });
    if (r.ok) {
      const data = await r.json();
      setApiKeys([...apiKeys, { ...data, rawKey: undefined }]);
      setShowKeyModal(data.rawKey);
      setNewKeyLabel("");
    }
  };

  const revokeKey = async (id: string) => {
    await fetch("/api/keys", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": user.uid },
      body: JSON.stringify({ keyId: id })
    });
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, isActive: false } : k));
  };

  return (
    <div className="page-container min-h-screen py-14 text-[#1a1a2e]">
      <div className="mb-12 flex flex-col gap-8 rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.18),transparent_42%),#fafafa] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.08)] lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-6">
          <Image
            src={githubProfile.avatarUrl}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border border-[#e74c3c]/25 object-cover shadow-[0_0_0_6px_rgba(231,76,60,0.08)]"
            alt={`${githubProfile.githubUsername} avatar`}
          />
          <div>
            <span className="eyebrow-badge mb-3 inline-flex">
              Creator Dashboard
            </span>
            <h1 className="text-3xl font-bold md:text-4xl">{githubProfile.githubUsername}</h1>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-sm text-[#64748b]">
              <CheckCircle2 className="h-4 w-4 text-[#ff8c7e]" /> Verified creator account
            </p>
          </div>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#64748b]">
          Review usage, rotate API keys, and monitor the agents you publish from one console.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e74c3c]/50 to-transparent" />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#64748b]">Estimated earnings</p>
          <div className="text-4xl font-mono">${totalEarnings.toFixed(2)}</div>
        </div>
        <div className="group relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e74c3c]/50 to-transparent" />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#64748b]">Published agents</p>
          <div className="text-4xl font-mono">{myAgents.length}</div>
        </div>
        <div className="group relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e74c3c]/50 to-transparent" />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#64748b]">Requests</p>
          <div className="text-4xl font-mono">{myAgents.reduce((a, c) => a + (c.totalCalls || 0), 0).toLocaleString()} <span className="text-sm text-[#64748b]">total</span></div>
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Key className="h-5 w-5 text-[#ff8c7e]" /> API Keys
          </h2>
          <div className="rounded-[1.75rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
            <div className="mb-6 flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Key label</label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={e => setNewKeyLabel(e.target.value)}
                  placeholder="Production app"
                  className="control-shell bg-black/5 text-sm"
                />
              </div>
              <Button onClick={createKey} className="h-11 rounded-xl bg-[#e74c3c] px-5 text-white hover:bg-[#f05a48]">
                <Plus className="w-4 h-4 mr-2" /> Create key
              </Button>
            </div>

            <div className="space-y-2">
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center justify-between rounded-xl border border-black/10 bg-black/[0.03] p-3">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      {k.label} {k.isActive ? <span className="h-2 w-2 rounded-full bg-[#ff8c7e]"></span> : <span className="h-2 w-2 rounded-full bg-[#6f7487]"></span>}
                    </h4>
                    <span className="font-mono text-xs text-[#64748b]">{k.isActive ? `${k.keyPrefix}...` : 'REVOKED'}</span>
                  </div>
                  {k.isActive && (
                    <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)} className="h-8 text-[#ff8c7e] hover:bg-[#e74c3c]/10 hover:text-[#ffc1b7]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold">Published agents</h2>
          {myAgents.length === 0 && !isLoading ? (
            <div className="rounded-[1.75rem] border border-dashed border-[#e74c3c]/25 bg-[linear-gradient(180deg,rgba(231,76,60,0.08),rgba(0,0,0,0.02))] p-10 text-center">
              <h3 className="text-xl font-semibold">No published agents yet</h3>
              <p className="mt-2 text-sm text-[#64748b]">Publish your first agent to start collecting requests, trust signals, and revenue.</p>
              <Link href="/publish" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#e74c3c] px-5 text-sm font-medium text-white hover:bg-[#f05a48]">
                Publish an agent
              </Link>
            </div>
          ) : (
            <AgentGrid agents={myAgents} isLoading={isLoading} />
          )}
        </div>
      </div>

      <DeveloperAnalytics agents={myAgents} />

      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-black/10 bg-white p-6 text-[#1a1a2e] shadow-[0_28px_90px_rgba(0,0,0,0.12)]">
            <h3 className="mb-2 text-xl font-bold">API key created</h3>
            <p className="mb-6 rounded-xl border border-[#e74c3c]/20 bg-[#e74c3c]/10 p-3 text-sm text-[#ffb2a7]">
              Copy and store this key securely. For security reasons, it will only be shown once.
            </p>
            <div className="flex gap-2">
              <input readOnly value={showKeyModal} className="control-shell bg-[#f5f5f7] font-mono text-[#ff8c7e]" />
              <Button onClick={() => {
                navigator.clipboard.writeText(showKeyModal);
                toast("Copied!");
              }} className="h-full py-3 bg-black/10 hover:bg-black/20">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setShowKeyModal(null)} className="mt-6 w-full bg-[#e74c3c] text-white hover:bg-[#f05a48]">Done</Button>
          </div>
        </div>
      )}
    </div>
  );
}
