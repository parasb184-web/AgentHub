"use client";

import { useCallback, useRef, useState } from "react";

/* ── card data ─────────────────────────────────────────────────── */

type FloatingCard = {
  name: string;
  category: string;
  lang: string;
  color: string;
  /** Position as % of container */
  x: number;
  y: number;
  /** Depth layer: 1 = near, 2 = mid, 3 = far */
  depth: 1 | 2 | 3;
  /** Animation delay in seconds */
  delay: number;
};

const cards: FloatingCard[] = [
  { name: "DocExtract", category: "NLP", lang: "Python", color: "border-[#e74c3c]/20 bg-[#e74c3c]/5", x: 8, y: 18, depth: 2, delay: 0 },
  { name: "CodeMigrator", category: "Code", lang: "Node.js", color: "border-emerald-400/20 bg-emerald-400/5", x: 78, y: 12, depth: 1, delay: 1.2 },
  { name: "VisionAI", category: "Vision", lang: "Python", color: "border-purple-400/20 bg-purple-400/5", x: 85, y: 55, depth: 3, delay: 0.6 },
  { name: "SentimentStream", category: "Data", lang: "Go", color: "border-amber-400/20 bg-amber-400/5", x: 5, y: 62, depth: 1, delay: 1.8 },
  { name: "WorkflowBot", category: "Automation", lang: "TypeScript", color: "border-cyan-400/20 bg-cyan-400/5", x: 72, y: 78, depth: 2, delay: 0.3 },
  { name: "QueryGenius", category: "Code", lang: "Python", color: "border-emerald-400/20 bg-emerald-400/5", x: 18, y: 80, depth: 3, delay: 2.1 },
  { name: "TranslateX", category: "NLP", lang: "Rust", color: "border-[#e74c3c]/20 bg-[#e74c3c]/5", x: 55, y: 6, depth: 3, delay: 1.5 },
  { name: "AutoDeploy", category: "Automation", lang: "Go", color: "border-cyan-400/20 bg-cyan-400/5", x: 30, y: 5, depth: 2, delay: 0.9 },
  { name: "DataPipe", category: "Data", lang: "Python", color: "border-amber-400/20 bg-amber-400/5", x: 92, y: 35, depth: 1, delay: 2.4 },
  { name: "ImageGen", category: "Vision", lang: "Python", color: "border-purple-400/20 bg-purple-400/5", x: 2, y: 40, depth: 3, delay: 0.4 },
  { name: "TestRunner", category: "Code", lang: "TypeScript", color: "border-emerald-400/20 bg-emerald-400/5", x: 42, y: 88, depth: 2, delay: 1.7 },
  { name: "LogAnalyzer", category: "Data", lang: "Go", color: "border-amber-400/20 bg-amber-400/5", x: 65, y: 42, depth: 3, delay: 2.8 },
];

const categoryTextColor: Record<string, string> = {
  NLP: "text-[#ff8c7e]",
  Code: "text-emerald-400",
  Vision: "text-purple-400",
  Data: "text-amber-400",
  Automation: "text-cyan-400",
};

const depthScale = { 1: 1.6, 2: 1, 3: 0.5 } as const;
const depthOpacity = { 1: 0.7, 2: 0.55, 3: 0.4 } as const;
const depthSize = { 1: "scale-100", 2: "scale-90", 3: "scale-[0.8]" } as const;

/* ── component ─────────────────────────────────────────────────── */

export function HeroFloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: ((e.clientX - cx) / (rect.width / 2)) * 40,
      y: ((e.clientY - cy) / (rect.height / 2)) * 40,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (!hovering) setHovering(true);
        handleMouseMove(e);
      }}
      onMouseLeave={handleMouseLeave}
      className="pointer-events-auto absolute inset-0 z-[1] overflow-hidden hidden md:block"
    >
      {cards.map((card) => {
        const scale = depthScale[card.depth];
        const tx = offset.x * scale;
        const ty = offset.y * scale;

        return (
          <div
            key={card.name}
            className={`absolute rounded-xl border backdrop-blur-sm px-4 py-3 font-mono text-xs ${card.color} ${depthSize[card.depth]}`}
            style={{
              left: `${card.x}%`,
              top: `${card.y}%`,
              opacity: depthOpacity[card.depth],
              transform: `translate(${tx}px, ${ty}px)`,
              transition: hovering ? "transform 0.15s ease-out" : "transform 0.5s ease-out",
              animation: `float-slow ${4 + card.depth}s ease-in-out infinite`,
              animationDelay: `${card.delay}s`,
              willChange: "transform",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${categoryTextColor[card.category] ?? "text-[#64748b]"}`}>
                {card.category}
              </span>
            </div>
            <div className="text-[#1a1a2e] font-semibold text-sm tracking-tight">{card.name}</div>
            <div className="text-[#64748b] text-[10px] mt-0.5">{card.lang}</div>
          </div>
        );
      })}
    </div>
  );
}
