"use client";

import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { FeatureRail } from "./FeatureRail";

export function CollapsibleRail({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasCollapsedRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const sync = () => {
      frameId = 0;
      if (hasCollapsedRef.current) return;
      if (window.scrollY > 80) {
        hasCollapsedRef.current = true;
        setCollapsed(true);
      }
    };

    const onScroll = () => {
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(sync);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      hasCollapsedRef.current = !c;
      return !c;
    });
  }, []);

  return (
    <>
      {/* Content wrapper with dynamic padding */}
      <div
        className="relative z-10"
        style={{ transition: "padding-left 0.4s ease-in-out" }}
      >
        <style>{`
          @media (min-width: 1280px) {
            .rail-content-pad { padding-left: ${collapsed ? "0px" : "288px"}; transition: padding-left 0.4s ease-in-out; }
          }
        `}</style>
        <div className="rail-content-pad">
          {/* Sidebar */}
          <aside
            className="fixed bottom-0 left-0 top-20 z-30 hidden w-[288px] xl:block transition-transform duration-400 ease-in-out"
            style={{
              transform: collapsed ? "translateX(-100%)" : "translateX(0)",
            }}
          >
            <FeatureRail variant="attached" />
          </aside>

          {/* Toggle tab */}
          <button
            type="button"
            onClick={toggle}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden xl:flex items-center gap-1 rounded-r-lg border border-l-0 border-black/10 bg-white/90 backdrop-blur-sm px-2 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-[#64748b] hover:text-[#e74c3c] hover:border-[#e74c3c]/20 transition-all duration-300 shadow-[2px_0_12px_rgba(0,0,0,0.04)]"
            style={{
              transform: collapsed
                ? "translate(0, -50%)"
                : "translate(288px, -50%)",
              transition: "transform 0.4s ease-in-out, color 0.2s, border-color 0.2s",
            }}
            aria-label={collapsed ? "Show navigation" : "Hide navigation"}
          >
            <span style={{ writingMode: "vertical-lr" }}>
              nav
            </span>
            <span className="flex flex-col gap-[2px] ml-0.5">
              {collapsed ? (
                <>
                  <span className="animate-chevron-1 text-[10px]">&rsaquo;</span>
                  <span className="animate-chevron-2 text-[10px]">&rsaquo;</span>
                  <span className="animate-chevron-3 text-[10px]">&rsaquo;</span>
                </>
              ) : (
                <>
                  <span className="animate-chevron-1 text-[10px]">&lsaquo;</span>
                  <span className="animate-chevron-2 text-[10px]">&lsaquo;</span>
                  <span className="animate-chevron-3 text-[10px]">&lsaquo;</span>
                </>
              )}
            </span>
          </button>

          {children}
        </div>
      </div>
    </>
  );
}
