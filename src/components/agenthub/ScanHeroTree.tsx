"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, File, Folder } from "lucide-react";

/* ── file tree data ────────────────────────────────────────────── */

type TreeNode = { name: string; type: "folder" | "file"; depth: number };

const tree: TreeNode[] = [
  { name: "src", type: "folder", depth: 0 },
  { name: "components", type: "folder", depth: 1 },
  { name: "Button.tsx", type: "file", depth: 2 },
  { name: "Modal.tsx", type: "file", depth: 2 },
  { name: "Layout.tsx", type: "file", depth: 2 },
  { name: "lib", type: "folder", depth: 1 },
  { name: "utils.ts", type: "file", depth: 2 },
  { name: "api.ts", type: "file", depth: 2 },
  { name: "app", type: "folder", depth: 1 },
  { name: "page.tsx", type: "file", depth: 2 },
  { name: "layout.tsx", type: "file", depth: 2 },
  { name: "package.json", type: "file", depth: 0 },
  { name: "tsconfig.json", type: "file", depth: 0 },
  { name: "README.md", type: "file", depth: 0 },
];

const extColor: Record<string, string> = {
  tsx: "text-[#ff8c7e]",
  ts: "text-[#ff8c7e]",
  json: "text-amber-400",
  md: "text-[#94a3b8]",
  py: "text-emerald-400",
  yml: "text-purple-400",
};

function getExtColor(name: string) {
  const ext = name.split(".").pop() ?? "";
  return extColor[ext] ?? "text-[#64748b]";
}

/* ── component ─────────────────────────────────────────────────── */

const LINE_DELAY = 65;
const SCAN_DELAY = 200;
const HOLD_MS = 2000;
const FADE_MS = 450;

const fileIndices = tree
  .map((node, i) => (node.type === "file" ? i : -1))
  .filter((i) => i !== -1);

type Phase = "reveal" | "scan" | "hold" | "fade";

export function ScanHeroTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  /* cascade reveal state */
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("reveal");
  const [scanIndex, setScanIndex] = useState(0); // index into fileIndices

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "reveal") {
      if (visibleCount < tree.length) {
        timeout = setTimeout(() => setVisibleCount((c) => c + 1), LINE_DELAY);
      } else {
        // all revealed, start scanning
        timeout = setTimeout(() => {
          setPhase("scan");
          setScanIndex(0);
        }, 400);
      }
    } else if (phase === "scan") {
      if (scanIndex < fileIndices.length) {
        timeout = setTimeout(() => setScanIndex((c) => c + 1), SCAN_DELAY);
      } else {
        setPhase("hold");
      }
    } else if (phase === "hold") {
      timeout = setTimeout(() => setPhase("fade"), HOLD_MS);
    } else if (phase === "fade") {
      timeout = setTimeout(() => {
        setPhase("reveal");
        setVisibleCount(0);
        setScanIndex(0);
      }, FADE_MS);
    }

    return () => clearTimeout(timeout);
  }, [visibleCount, phase, scanIndex]);

  /* mouse parallax */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
    setSpotPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div className="mb-10 flex justify-center" style={{ perspective: "800px" }}>
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (!hovering) setHovering(true);
          handleMouseMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-[#fafafa]/95 p-3 font-mono text-xs md:p-6 md:text-sm lg:p-8 lg:text-base"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovering ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          willChange: "transform",
        }}
      >
        {/* spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${spotPos.x}% ${spotPos.y}%, rgba(231,76,60,0.08) 0%, transparent 60%)`,
            opacity: hovering ? 1 : 0,
          }}
        />

        {/* fade edges */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_20px_#ffffff]" />

        {/* tree lines */}
        <div
          className="relative z-10 space-y-1"
          style={{
            opacity: phase === "fade" ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        >
          {tree.map((node, i) => {
            const filePos = fileIndices.indexOf(i);
            const isFile = node.type === "file";
            const scanned = isFile && phase !== "reveal" && filePos < scanIndex;
            const scanning = isFile && phase === "scan" && filePos === scanIndex;

            return (
              <div
                key={`${node.name}-${i}`}
                className="flex items-center gap-2"
                style={{
                  paddingLeft: `${node.depth * 1.25}rem`,
                  opacity: i < visibleCount ? 1 : 0,
                  transform: i < visibleCount ? "translateX(0)" : "translateX(-12px)",
                  transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
                }}
              >
                {node.type === "folder" ? (
                  <>
                    <ChevronRight
                      className="h-3.5 w-3.5 text-[#64748b] transition-transform duration-300"
                      style={{
                        transform: i < visibleCount ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                    <Folder className="h-4 w-4 text-[#e74c3c]/70" />
                    <span className="text-[#1a1a2e]">{node.name}/</span>
                  </>
                ) : (
                  <>
                    <span className="w-3.5" />
                    <File className={`h-4 w-4 ${getExtColor(node.name)}`} />
                    <span className={getExtColor(node.name)}>{node.name}</span>

                    {/* scan status */}
                    {scanning && (
                      <span className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e74c3c] opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e74c3c]" />
                        </span>
                        <span className="text-[#ff8c7e]">scanning</span>
                      </span>
                    )}
                    {scanned && (
                      <span className="ml-auto flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ok
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* title bar dots */}
        <div className="absolute left-3 top-3 md:left-5 md:top-4 flex items-center gap-1.5 md:left-7 md:top-5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#e74c3c]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/40" />
        </div>
      </div>
    </div>
  );
}
