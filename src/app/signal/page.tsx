import { FeaturePageShell } from "@/components/agenthub/FeaturePageShell";
import { TrendingAgentsSection } from "@/components/TrendingAgentsSection";
import { LatestAINewsSection } from "@/components/LatestAINewsSection";
import { LiveFeed } from "@/components/LiveFeed";
import { ScrollGlassReveal } from "@/components/ScrollGlassReveal";

export default function SignalPage() {
  return (
    <FeaturePageShell
      eyebrow="Signal"
      title="Track activity across the agent ecosystem"
      description="Monitor trending repositories, recent AI news, and marketplace activity in one place. Use this view to follow tooling movement, adoption patterns, and new integration opportunities."
      metrics={[
        { label: "Coverage", value: "3 live views" },
        { label: "Repos", value: "Trending" },
        { label: "Activity", value: "Updated" },
      ]}
      quickLinks={[
        { href: "/agents", label: "Explore Agents" },
        { href: "/scan", label: "Run Repository Scan" },
        { href: "/platform", label: "Open Platform" },
      ]}
    >
      <ScrollGlassReveal delayMs={40}>
        <TrendingAgentsSection />
      </ScrollGlassReveal>
      <ScrollGlassReveal delayMs={80}>
        <section className="section-shell w-full py-8 md:py-10">
          <div className="mx-auto grid max-w-[1280px] gap-6 px-6 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-20">
            <LatestAINewsSection />
            <LiveFeed />
          </div>
        </section>
      </ScrollGlassReveal>
    </FeaturePageShell>
  );
}
