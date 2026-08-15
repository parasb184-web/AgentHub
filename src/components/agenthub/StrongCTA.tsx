import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StrongCTA() {
  return (
    <section className="relative w-full px-6 md:px-12 lg:px-20 pt-8">
      <div className="glass-panel w-full rounded-[2rem] px-4 py-6 md:px-6 md:py-8 lg:px-14 lg:py-10">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-[#1a1a2e]">
              <span className="text-shine-orange">Build</span> with <span className="underline decoration-[#e74c3c] decoration-4 underline-offset-8">agents</span> that are ready <br className="hidden md:block" />
              for <span className="text-shine-orange">production</span>.
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-[#64748b]">
              Evaluate agents in one place, compare their contracts and trust signals, and move from discovery to integration without piecing together separate tools.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/agents"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full px-8 sm:w-auto")}
              >
                Explore Agents
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              <Link
                href="/publish"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full px-8 sm:w-auto")}
              >
                Publish an Agent
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full pt-10 md:pt-20 pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[16%] top-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
      <div className="page-container">
        
        <div className="grid grid-cols-2 md:grid-cols-4 md:gap-x-12 gap-y-12 mb-20 text-sm">
          {/* Logo Col */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start pr-4">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-6 h-6 bg-white border border-black/20 rounded-sm flex items-center justify-center relative">
                <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-[#e74c3c]"></div>
                <span className="text-[#1a1a2e] font-mono font-bold text-xs group-hover:text-[#e74c3c] transition-colors pb-px">A</span>
              </div>
              <span className="font-bold tracking-tight text-[#1a1a2e]">AgentHub</span>
            </Link>
            <p className="text-[#64748b] leading-relaxed">
              Discover, validate, and publish AI agents from one platform built for technical teams.
            </p>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col">
            <span className="text-[#1a1a2e] font-bold tracking-tight mb-4">Product</span>
            <Link href="/agents" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Marketplace</Link>
            <Link href="/platform" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Platform</Link>
            <Link href="/signal" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Signal</Link>
            <Link href="/chains" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors">Workflows</Link>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col">
            <span className="text-[#1a1a2e] font-bold tracking-tight mb-4">Developers</span>
            <Link href="/scan" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Repository Scan</Link>
            <Link href="/publish" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Publish</Link>
            <Link href="/dashboard" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Creator Dashboard</Link>
            <Link href="/docs" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors">Documentation</Link>
          </div>

          {/* Links 3 */}
          <div className="flex flex-col">
            <span className="text-[#1a1a2e] font-bold tracking-tight mb-4">Company</span>
            <Link href="/about" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">About</Link>
            <Link href="/blog" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Blog</Link>
            <Link href="/terms" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-3">Terms</Link>
            <Link href="/privacy" className="text-[#64748b] hover:text-[#1a1a2e] transition-colors">Privacy</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748b]">
          <span>© {new Date().getFullYear()} AgentHub Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">GitHub-authenticated access</span>
            <span className="hidden md:inline border-r border-black/10 h-3"></span>
            <span>Agent discovery, validation, and integration</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
