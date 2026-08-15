"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Agent } from "@/lib/types";
import { codeToHtml } from "shiki";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export const SDKSnippet = ({ agent }: { agent: Agent }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [snippets, setSnippets] = useState<{ py: string; js: string; cur: string }>({ py: "", js: "", cur: "" });

  const inputJson = agent.exampleInput ? JSON.stringify(agent.exampleInput) : "{}";
  const apiKey = user ? "API_KEY_HERE" : "YOUR_API_KEY";

  const pyCode = `import requests

response = requests.post(
    "https://agenthub.io/api/sandbox/${agent.id}",
    headers={"Authorization": "Bearer ${apiKey}"},
    json=${inputJson},
    timeout=10
)
result = response.json()
print(result)`;

  const jsCode = `const response = await fetch(
    "https://agenthub.io/api/sandbox/${agent.id}",
    {
        method: "POST",
        headers: {
            "Authorization": "Bearer ${apiKey}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(${inputJson})
    }
);
const result = await response.json();
console.log(result);`;

  const curlCode = `curl -X POST https://agenthub.io/api/sandbox/${agent.id} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${inputJson}'`;

  useEffect(() => {
    const highlight = async () => {
      const p = await codeToHtml(pyCode, { lang: "python", theme: "github-dark" });
      const j = await codeToHtml(jsCode, { lang: "javascript", theme: "github-dark" });
      const c = await codeToHtml(curlCode, { lang: "bash", theme: "github-dark" });
      setSnippets({ py: p, js: j, cur: c });
    };
    highlight();
  }, [pyCode, jsCode, curlCode]);

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 h-[600px] flex flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] shadow-[0_20px_55px_rgba(0,0,0,0.06)]">
      <Tabs defaultValue="python" className="w-full">
        <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.02] pr-4">
          <TabsList variant="line" className="h-11 bg-transparent p-0">
            <TabsTrigger value="python" className="h-11 rounded-none border-b-2 border-transparent px-4 font-bold text-[#64748b] data-active:border-[#e74c3c] data-active:text-[#ff8c7e]">Python</TabsTrigger>
            <TabsTrigger value="javascript" className="h-11 rounded-none border-b-2 border-transparent px-4 font-bold text-[#64748b] data-active:border-[#e74c3c] data-active:text-[#ff8c7e]">JavaScript</TabsTrigger>
            <TabsTrigger value="curl" className="h-11 rounded-none border-b-2 border-transparent px-4 font-bold text-[#64748b] data-active:border-[#e74c3c] data-active:text-[#ff8c7e]">cURL</TabsTrigger>
          </TabsList>
          <button
            type="button"
            onClick={() => {
              const el = document.querySelector('[data-state="active"][role="tab"]');
              if (!el) return;
              const v = el.getAttribute("data-value");
              if (v === "python") onCopy(pyCode);
              else if (v === "javascript") onCopy(jsCode);
              else onCopy(curlCode);
            }}
            className="text-[#64748b] transition-colors hover:text-[#1a1a2e]"
          >
            {copied ? <Check className="h-4 w-4 text-[#4ade80]" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <TabsContent value="python" className="ui-highlight-container m-0 flex-1 overflow-auto p-4 text-sm" dangerouslySetInnerHTML={{ __html: snippets.py }} />
        <TabsContent value="javascript" className="ui-highlight-container m-0 flex-1 overflow-auto p-4 text-sm" dangerouslySetInnerHTML={{ __html: snippets.js }} />
        <TabsContent value="curl" className="ui-highlight-container m-0 flex-1 overflow-auto p-4 text-sm" dangerouslySetInnerHTML={{ __html: snippets.cur }} />
      </Tabs>
      <style>{`
        .ui-highlight-container pre { background-color: transparent !important; margin: 0; }
        .ui-highlight-container code { font-family: 'JetBrains Mono', monospace; line-height: 1.5; }
      `}</style>
    </div>
  );
};
