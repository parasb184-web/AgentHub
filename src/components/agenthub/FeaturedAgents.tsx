"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = ["All", "NLP", "Vision", "Code", "Data", "Automation"] as const;

const agents = [
  { name: "DocExtract Pro", category: "NLP", color: "text-[#ff9b8f] bg-[#e74c3c]/10 border-[#e74c3c]/20", desc: "Extract structured JSON from PDFs and document images with schema-aware field mapping.", input: "PDF or image", output: "Structured JSON", lang: "Python", score: "4.9", price: "$0.005" },
  { name: "CodeMigrator", category: "Code", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", desc: "Modernize legacy repositories with AST-based code transformation and review-ready output.", input: "Repository URL", output: "Patch plan", lang: "Node.js", score: "4.8", price: "$0.012" },
  { name: "VisionClassifier", category: "Vision", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", desc: "Classify visual inputs for inspection, cataloging, and operational monitoring workflows.", input: "Image", output: "Labels and scores", lang: "Python", score: "4.9", price: "$0.002" },
  { name: "SentimentStream", category: "Data", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", desc: "Score high-volume text streams for sentiment and topic changes across market coverage.", input: "Text stream", output: "Scored events", lang: "Go", score: "4.7", price: "$0.001" },
  { name: "WorkflowBot", category: "Automation", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", desc: "Resolve common support requests with structured actions and audit-friendly responses.", input: "Ticket payload", output: "Action plan", lang: "TypeScript", score: "4.6", price: "$0.025" },
  { name: "QueryGenius", category: "Code", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", desc: "Turn natural-language requests into executable SQL aligned to your schema and constraints.", input: "Prompt and schema", output: "SQL query", lang: "Python", score: "4.9", price: "$0.003" }
];

const headingText = "Featured agents";

export function FeaturedAgents() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [visibleCharIndex, setVisibleCharIndex] = useState(headingText.length);
  const [loopCount, setLoopCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const done = loopCount >= 2 && triggered;

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          setVisibleCharIndex(0);
          setLoopCount(0);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || done) {
      if (done) setVisibleCharIndex(headingText.length);
      return;
    }
    const interval = setInterval(() => {
      setVisibleCharIndex((prev) => {
        const next = prev + 1;
        if (next > headingText.length) {
          setLoopCount((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [loopCount, done, triggered]);

  const visibleAgents = useMemo(() => {
    if (activeTab === "All") return agents;
    return agents.filter((agent) => agent.category === activeTab);
  }, [activeTab]);

  return (
    <section className="relative w-full pt-12 md:pt-16 pb-6">
      <div className="page-container">
        
        <div className="flex flex-col mb-12 gap-6">
          <div className="flex items-center gap-4 md:gap-6">
             <img
               src="/assets/images/robot-mascot.png"
               alt="AgentHub mascot"
               className="h-28 w-28 md:h-40 md:w-40 object-contain drop-shadow-lg"
             />
             <div>
             <h2 ref={headingRef} className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#1a1a2e]">
               {done ? headingText : headingText.split("").map((char, i) => (
                 <span
                   key={i}
                   className="inline-block transition-all duration-200"
                   style={{
                     opacity: i < visibleCharIndex ? 1 : 0.1,
                     transform: i < visibleCharIndex ? "translateY(0)" : "translateY(4px)",
                     width: char === " " ? "0.3em" : undefined,
                   }}
                 >
                   {char}
                 </span>
               ))}
             </h2>
             <p className="text-base text-[#64748b] md:text-lg">Representative agents across extraction, code, automation, and analytics. Compare their contract, runtime profile, and pricing before you integrate.</p>
             </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${activeTab === tab ? "border-[#e74c3c]/25 bg-[#e74c3c]/10 text-[#ff8c7e]" : "border-black/10 bg-black/[0.02] text-[#64748b] hover:border-[#e74c3c]/20 hover:text-[#1a1a2e]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleAgents.map((agent) => (
            <div key={agent.name} className="surface-primary group flex h-full flex-col rounded-[1.75rem] p-4 md:p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:border-[#e74c3c]/28 hover:shadow-[0_16px_40px_rgba(231,76,60,0.08)] cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className={cn(agent.color, "transition-transform duration-300 group-hover:scale-110")}>
                  {agent.category}
                </Badge>
                <span className="text-[#64748b] text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-300 group-hover:text-[#e74c3c]">{agent.lang}</span>
              </div>

              <h3 className="text-xl font-bold text-[#1a1a2e] tracking-tight mb-3 transition-colors duration-300 group-hover:text-[#e74c3c]">{agent.name}</h3>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6 flex-grow transition-colors duration-300 group-hover:text-[#374151]">{agent.desc}</p>

              <div className="flex items-center gap-2 mb-6 transition-transform duration-300 group-hover:translate-x-1">
                 <div className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 flex items-center gap-1.5 transition-all duration-300 group-hover:border-[#e74c3c]/15">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#8a8fa8]/40 transition-colors duration-300 group-hover:bg-[#e74c3c]/40"></div>
                   <span className="text-[11px] font-mono text-[#64748b]">In: {agent.input}</span>
                 </div>
                 <svg className="transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                 <div className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 flex items-center gap-1.5 transition-all duration-300 group-hover:border-[#e74c3c]/15">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#e74c3c]"></div>
                   <span className="text-[11px] font-mono text-[#1a1a2e]">Out: {agent.output}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-black/5 mt-auto transition-all duration-300 group-hover:border-[#e74c3c]/10">
                 <div className="flex flex-col">
                   <div className="flex items-center gap-1 mb-1">
                     <svg className="transition-transform duration-300 group-hover:scale-125" width="12" height="12" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                     <span className="text-xs font-bold text-[#1a1a2e]">{agent.score}</span>
                   </div>
                   <span className="text-xs font-mono text-[#64748b]">{agent.price} / call</span>
                 </div>
                 <Link href={`/agents?q=${encodeURIComponent(agent.name)}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full transition-all duration-300 group-hover:bg-[#e74c3c] group-hover:text-white group-hover:border-[#e74c3c]")}>
                   View Agent
                 </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
