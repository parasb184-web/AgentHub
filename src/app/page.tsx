import { HeroSection } from "@/components/agenthub/HeroSection";
import { SearchSection } from "@/components/agenthub/SearchSection";
import { TrustStrip } from "@/components/agenthub/TrustStrip";
import { FeaturedAgents } from "@/components/agenthub/FeaturedAgents";
import { StrongCTA, Footer } from "@/components/agenthub/StrongCTA";
import { FeatureQuickMenu } from "@/components/agenthub/FeatureRail";
import { CollapsibleRail } from "@/components/agenthub/CollapsibleRail";
import { ScrollGlassReveal } from "@/components/ScrollGlassReveal";
import { StatsStrip } from "@/components/agenthub/StatsStrip";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,76,60,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fafafa_46%,#fafafa_100%)]" />
        <div className="animate-aurora-drift absolute left-[-12%] top-[-6%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(231,76,60,0.18)_0%,rgba(231,76,60,0)_72%)] blur-[110px]" />
        <div className="animate-aurora-drift-reverse absolute right-[-14%] top-[16%] hidden h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_70%)] blur-[120px] md:block" />
        <div className="absolute bottom-[-12%] left-[10%] hidden h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(231,76,60,0.12)_0%,rgba(231,76,60,0)_72%)] blur-[100px] xl:block" />
        <div className="premium-grid absolute inset-0 opacity-[0.08]" />
        <div className="premium-noise absolute inset-0 opacity-[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.1)_48%,rgba(255,255,255,0.6)_100%)]" />
      </div>

      <CollapsibleRail>
        <div className="xl:hidden">
          <div className="px-6 pt-20 md:pt-24 md:px-12 lg:px-20">
            <FeatureQuickMenu className="mb-0" />
          </div>
        </div>

        <div className="flex flex-col">
          <HeroSection variant="cards" />

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[16%] -top-24 h-36 bg-[radial-gradient(circle,rgba(231,76,60,0.24)_0%,rgba(231,76,60,0)_72%)] blur-3xl"
            />
            <SearchSection />
          </div>

          <div className="section-shell lux-border mt-6">
            <TrustStrip />
          </div>

          <ScrollGlassReveal className="relative z-10" delayMs={60}>
            <FeaturedAgents />
          </ScrollGlassReveal>

          <StatsStrip />

          <StrongCTA />

          <Footer />
        </div>
      </CollapsibleRail>
    </div>
  );
}
