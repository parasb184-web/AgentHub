"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Loader2, AlertCircle, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";

export const SandboxPanel = ({ agent }: { agent: Agent }) => {
  const defaultInput = agent.exampleInput ? JSON.stringify(agent.exampleInput, null, 2) : "{\n  \n}";
  const [inputCode, setInputCode] = useState(defaultInput);
  const [outputCode, setOutputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    setLatency(null);
    setOutputCode("Running request...");

    try {
      const parsedInput = JSON.parse(inputCode);

      const res = await fetch(`/api/sandbox/${agent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Execution failed");
      }

      setOutputCode(JSON.stringify(data.output, null, 2));
      setLatency(data.latencyMs);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Execution failed";
      setError(message);
      setOutputCode(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {expanded && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setExpanded(false)} />}
    <div className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] shadow-[0_20px_55px_rgba(0,0,0,0.06)] transition-all duration-300 ${expanded ? "fixed inset-4 z-50 h-auto rounded-[1.75rem]" : "h-[600px]"}`}>
      <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.02] px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#1a1a2e]">Sandbox execution</span>
          {latency !== null && (
            <span className="flex items-center gap-1 rounded-md border border-[#4ade80]/20 bg-[#4ade80]/10 px-2 py-1 text-xs font-bold text-[#86efac]">
              <CheckCircle2 className="h-3 w-3" />
              {latency}ms
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1 rounded-md bg-[#e74c3c]/10 px-2 py-1 text-xs text-[#ff8c7e]">
              <AlertCircle className="h-3 w-3" />
              Failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="AgentHub API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="control-shell h-9 w-48 bg-black/[0.03] px-3 text-xs font-mono"
          />
          <Button size="sm" onClick={handleRun} disabled={isLoading || !apiKey} className="h-9 bg-[#e74c3c] px-4 text-xs font-bold text-white hover:bg-[#ff5645]">
            {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            Run request
          </Button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/[0.02] text-[#64748b] transition-colors hover:text-[#e74c3c] hover:border-[#e74c3c]/20"
            aria-label={expanded ? "Shrink terminal" : "Expand terminal"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!apiKey && (
        <p className="px-4 py-2 text-xs text-[#64748b]">Create an API key in the dashboard to test agents</p>
      )}

      <div className="grid flex-1 grid-cols-2 divide-x divide-black/10">
        <div className="relative flex h-full flex-col">
          <div className="border-b border-black/10 bg-black/[0.02] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
            Request payload
          </div>
          <div className="relative flex-1 overflow-hidden bg-[#ffffff]">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={inputCode}
              onChange={(v) => setInputCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                formatOnPaste: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>

        <div className="relative flex h-full flex-col">
          <div className="border-b border-black/10 bg-black/[0.02] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
            Response payload
          </div>
          <div className="relative flex-1 overflow-hidden bg-[#ffffff]">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={outputCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
