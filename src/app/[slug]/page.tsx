import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type StaticPageConfig = {
  eyebrow: string;
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  bullets: string[];
};

const redirects: Record<string, string> = {
  marketplace: "/agents",
  sandbox: "/agents",
  chaining: "/chains",
  sdk: "/publish",
};

const pages: Record<string, StaticPageConfig> = {
  docs: {
    eyebrow: "Developer Docs",
    title: "Documentation is coming soon.",
    description:
      "Use the live product routes below to browse the marketplace, run repository scans, publish agents, and build workflows while the documentation hub is prepared.",
    primary: { href: "/platform", label: "Open Platform" },
    secondary: { href: "/scan", label: "Run Repository Scan" },
    bullets: ["Marketplace search", "Repository analysis", "Publishing flow", "Workflow builder"],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Pricing details are coming soon.",
    description:
      "AgentHub uses usage-based pricing. Review per-request pricing in the marketplace and publish flow until the dedicated pricing page is live.",
    primary: { href: "/agents", label: "Browse Marketplace" },
    secondary: { href: "/publish", label: "Review Publish Flow" },
    bullets: ["Usage-based billing", "Cost per request", "Creator analytics", "Live marketplace pricing"],
  },
  blog: {
    eyebrow: "Updates",
    title: "Product updates will be published here.",
    description:
      "Until the editorial feed is live, use the working product routes below to explore the latest marketplace, repository scan, and workflow features.",
    primary: { href: "/agents", label: "Explore Marketplace" },
    secondary: { href: "/chains", label: "Open Workflows" },
    bullets: ["Marketplace updates", "Workflow previews", "Product release notes", "Builder tooling"],
  },
  about: {
    eyebrow: "About AgentHub",
    title: "AgentHub helps teams discover, validate, and integrate AI agents.",
    description:
      "The product brings together marketplace search, repository analysis, sandbox validation, and publishing so teams can evaluate agents from one workflow.",
    primary: { href: "/agents", label: "See the Marketplace" },
    secondary: { href: "/scan", label: "Try Repo Scan" },
    bullets: ["Agent discovery", "Sandbox validation", "Generated SDKs", "Creator tooling"],
  },
  status: {
    eyebrow: "Platform Status",
    title: "Core product routes are available.",
    description:
      "Use the links below to access the main application flows while the dedicated status page is added here.",
    primary: { href: "/agents", label: "Open Marketplace" },
    secondary: { href: "/dashboard", label: "Open Dashboard" },
    bullets: ["Marketplace", "Repository scan", "Publish flow", "Creator dashboard"],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms are coming soon.",
    description:
      "Legal terms will be published here. In the meantime, the live marketplace and platform routes below remain available.",
    primary: { href: "/", label: "Return Home" },
    secondary: { href: "/agents", label: "Browse Agents" },
    bullets: ["Legal route available", "Footer navigation active", "Marketplace access", "Platform access"],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy details are coming soon.",
    description:
      "Privacy details will be published here. Use the live product routes below while this page is completed.",
    primary: { href: "/", label: "Return Home" },
    secondary: { href: "/login", label: "Go to Login" },
    bullets: ["Navigation remains active", "Safe fallback route", "Login access", "Live product links"],
  },
};

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (redirects[slug]) {
    redirect(redirects[slug]);
  }

  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return (
    <section className="relative overflow-hidden bg-white py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,76,60,0.16)_0%,_rgba(255,255,255,0)_35%)]"></div>
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="eyebrow-badge mb-6 inline-flex">
            {page.eyebrow}
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1a1a2e] md:text-6xl">
            {page.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#64748b]">{page.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-[28px] border border-black/8 p-8">
            <div className="mb-6 flex flex-wrap gap-4">
              <Link href={page.primary.href} className="red-glow-hover rounded-[8px] bg-[#e74c3c] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#ff5645]">
                {page.primary.label}
              </Link>
              <Link href={page.secondary.href} className="rounded-[8px] border border-black/15 px-6 py-3 font-semibold text-[#1a1a2e] transition-colors hover:border-black/40 hover:bg-black/[0.04]">
                {page.secondary.label}
              </Link>
            </div>
            <div className="space-y-3">
              {page.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3 text-sm text-[#374151]">
                  <div className="h-2 w-2 rounded-full bg-[#e74c3c]"></div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-[#f5f5f7] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#64748b]">
              Available now
            </div>
            <div className="space-y-4 text-sm leading-7 text-[#374151]">
              <p>Marketplace at <span className="text-[#1a1a2e] font-semibold">/agents</span></p>
              <p>Repository scan at <span className="text-[#1a1a2e] font-semibold">/scan</span></p>
              <p>Workflows at <span className="text-[#1a1a2e] font-semibold">/chains</span></p>
              <p>Publish at <span className="text-[#1a1a2e] font-semibold">/publish</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
