"use client";

import { useState } from "react";
import { toast } from "sonner";

const requestPayload = `{
  "file_url": "https://example.com/invoice.pdf",
  "schema": {
    "invoice_id": "<string>",
    "amount": "<float>"
  }
}`;

const runningPayload = `{
  "status": "running",
  "stage": "extracting invoice fields",
  "progress": 76
}`;

const completePayload = `{
  "data": {
    "invoice_id": "INV-2048X",
    "amount": 1245.50
  },
  "confidence": 0.992
}`;

export function SandboxPreview() {
  const [isRunning, setIsRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const handleRun = () => {
    if (isRunning) return;

    setIsRunning(true);
    window.setTimeout(() => {
      setIsRunning(false);
      setRunCount((count) => count + 1);
      toast.success("Sandbox run completed");
    }, 900);
  };

  const latencyLabel = isRunning ? "~184ms" : `~${120 + runCount * 8}ms`;
  const responsePayload = isRunning ? runningPayload : completePayload;

  return (
    <section className="section-shell w-full py-8 md:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute left-[6%] top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.12)_0%,_rgba(231,76,60,0)_72%)] blur-3xl" />
      <div className="page-container">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="max-w-xl flex-1">
            <span className="section-badge mb-6">Sandbox</span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-4xl">Validate requests before you integrate</h2>
            <p className="mb-8 text-lg leading-relaxed text-[#64748b]">
              Run sample requests against marketplace agents, inspect the response format, and confirm latency before you wire the endpoint into your product.
            </p>
            <ul className="mb-8 space-y-4">
              {["Sample payloads", "Structured response inspection", "Latency verification"].map((item) => (
                <li key={item} className="flex items-center text-sm font-medium text-[#1a1a2e]">
                  <svg className="mr-3 h-4 w-4 text-[#e74c3c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-full flex-1">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-[#f0f0f2] to-[#e8e8ec] opacity-50 blur-xl"></div>
            <div className="glass-panel relative flex flex-col overflow-hidden rounded-[1.9rem] border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between border-b border-black/[0.04] bg-[#f0f0f2] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-black/10"></div>
                    <div className="h-3 w-3 rounded-full bg-black/10"></div>
                    <div className="h-3 w-3 rounded-full bg-black/10"></div>
                  </div>
                  <div className="ml-2 h-4 w-px bg-black/10"></div>
                  <span className="ml-2 font-mono text-xs text-[#1a1a2e]">DocExtract Pro (v1.2)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-[#64748b]">{latencyLabel}</span>
                  <div className="flex items-center gap-1.5 rounded border border-[#4ade80]/20 bg-[#4ade80]/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-[#4ade80]">
                    <div className={`live-dot h-1.5 w-1.5 rounded-full ${isRunning ? "bg-[#e74c3c]" : "bg-[#4ade80]"}`}></div>
                    {isRunning ? "RUNNING" : "LIVE"}
                  </div>
                </div>
              </div>

              <div className="grid h-[320px] grid-cols-1 gap-4 bg-[#fafafa] p-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <span className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#64748b]">Request payload</span>
                  <pre className="flex-1 overflow-hidden whitespace-pre-wrap rounded border border-black/5 bg-[#f0f0f2] p-3 font-mono text-sm font-medium text-[#64748b]">
                    {requestPayload}
                  </pre>
                  <button type="button" onClick={handleRun} disabled={isRunning} className="red-glow-hover mt-4 w-full rounded border border-black/10 bg-[#f0f0f2] py-2 text-xs font-bold uppercase tracking-wider text-[#1a1a2e] transition-colors hover:border-transparent hover:bg-[#e74c3c] hover:text-white disabled:cursor-not-allowed disabled:bg-[#e0e0e4] disabled:text-[#64748b]">
                    {isRunning ? "Running request..." : "Run request"}
                  </button>
                </div>

                <div className="flex flex-col">
                  <span className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                    Response ({isRunning ? "202 Accepted" : "200 OK"})
                  </span>
                  <pre className={`flex-1 overflow-hidden whitespace-pre-wrap rounded border border-black/5 bg-[#f0f0f2] p-3 font-mono text-sm text-[#64748b] transition-all ${isRunning ? "border-[#e74c3c]/30 shadow-[0_0_20px_rgba(231,76,60,0.12)]" : ""}`}>
                    {responsePayload}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
