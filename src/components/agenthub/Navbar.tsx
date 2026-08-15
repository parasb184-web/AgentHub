"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { topFeatureNavItems } from "@/lib/featureNavigation";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { LogOut } from "lucide-react";

export function AgentHubNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, githubProfile } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const [hoverStyle, setHoverStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    let frameId = 0;

    const syncScrollState = () => {
      frameId = 0;
      const nextScrolled = window.scrollY > 50;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };

    const handleScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncScrollState);
    };

    syncScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavHover = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = e.currentTarget.getBoundingClientRect();
    setHoverStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    });
  }, []);

  const handleNavLeave = useCallback(() => {
    setHoverStyle(null);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-black/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.82))] shadow-[0_14px_40px_rgba(0,0,0,0.06)] backdrop-blur-[16px]" : "border-b border-transparent bg-transparent"}`}>
      <div className="flex h-20 items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white border border-black/20 rounded-sm flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute -top-px -right-px w-2 h-2 bg-[#e74c3c] transition-all duration-300 group-hover:w-2.5 group-hover:h-2.5"></div>
            <span className="text-[#1a1a2e] font-mono font-bold text-lg leading-none group-hover:text-[#e74c3c] transition-colors pb-[2px]">A</span>
          </div>
          <span className="font-bold text-base md:text-lg tracking-[-0.02em] text-[#1a1a2e] transition-colors duration-300 group-hover:text-[#e74c3c]">AgentHub</span>
        </Link>

        <div
          ref={navRef}
          onMouseLeave={handleNavLeave}
          className="hidden md:flex items-center gap-1 text-[14px] font-medium text-[#64748b] relative"
        >
          {/* Sliding hover pill */}
          <div
            className="absolute top-0 h-full rounded-full bg-black/[0.04] transition-all duration-200 ease-out pointer-events-none"
            style={{
              opacity: hoverStyle ? 1 : 0,
              left: hoverStyle ? hoverStyle.left : 0,
              width: hoverStyle ? hoverStyle.width : 0,
            }}
          />

          {topFeatureNavItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={handleNavHover}
                className={cn(
                  "relative rounded-full px-3 py-2 transition-all duration-200 flex items-center gap-1.5",
                  active
                    ? "text-[#e74c3c] font-semibold"
                    : "hover:text-[#1a1a2e]"
                )}
              >
                <item.icon className={cn("h-3.5 w-3.5 transition-transform duration-200", active ? "text-[#e74c3c]" : "opacity-0 scale-75 group-hover:opacity-100")} style={{ opacity: active ? 1 : undefined }} />
                {item.title}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#e74c3c]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2">
                <img
                  src={githubProfile?.avatar_url || `https://github.com/${githubProfile?.login || "ghost"}.png?size=32`}
                  alt=""
                  className="h-7 w-7 rounded-full border border-black/10"
                />
                <span className="text-[13px] font-medium text-[#1a1a2e]">{githubProfile?.login || "Account"}</span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-xs font-medium text-[#64748b] transition-all duration-200 hover:border-[#e74c3c]/30 hover:text-[#e74c3c]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden text-[14px] font-medium text-[#64748b] transition-all duration-200 hover:text-[#e74c3c] sm:block">Sign in</Link>
          )}
          <Link href="/publish" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4 transition-all duration-200 hover:border-[#e74c3c]/30 hover:text-[#e74c3c] hover:shadow-[0_0_12px_rgba(231,76,60,0.1)]")}>
            Publish an Agent
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-black/10 bg-black/[0.02] text-[#64748b] hover:text-[#e74c3c] hover:border-[#e74c3c]/20 transition-all duration-200"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-black/[0.04]",
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)" }}
      >
        <div className="page-container flex flex-col gap-1 py-4">
          {topFeatureNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-[14px] font-medium transition-all duration-200 flex items-center gap-2.5",
                  active
                    ? "bg-[#e74c3c]/5 text-[#e74c3c] border-l-2 border-[#e74c3c]"
                    : "text-[#64748b] hover:bg-black/[0.03] hover:text-[#1a1a2e]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
          {user ? (
            <button
              type="button"
              onClick={() => { signOut(); setMenuOpen(false); }}
              className="rounded-lg px-4 py-3 text-[14px] font-medium text-[#64748b] hover:bg-[#e74c3c]/5 hover:text-[#e74c3c] transition-colors flex items-center gap-2.5 sm:hidden"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-[14px] font-medium text-[#64748b] hover:bg-black/[0.03] hover:text-[#1a1a2e] transition-colors sm:hidden"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
