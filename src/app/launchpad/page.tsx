import { FeaturePageShell } from "@/components/agenthub/FeaturePageShell";
import { SupplySide } from "@/components/agenthub/SupplySide";
import { Phase2Preview } from "@/components/agenthub/Phase2Preview";
import { ChainingPreview } from "@/components/agenthub/ChainingPreview";
import { ScrollGlassReveal } from "@/components/ScrollGlassReveal";

export default function LaunchpadPage() {
  return (
    <FeaturePageShell
      eyebrow="Launchpad"
      title="Plan launches, pricing, and workflow expansion"
      description="Review the creator tooling available today and preview the workflow features still in development. Launchpad keeps forward-looking product work visible without overstating what is live."
      metrics={[
        { label: "Publish", value: "Live today" },
        { label: "Workflows", value: "Preview" },
        { label: "Creator", value: "Tracked" },
      ]}
      quickLinks={[
        { href: "/publish", label: "Publish an Agent" },
        { href: "/chains", label: "View Workflows" },
        { href: "/dashboard", label: "Open Dashboard" },
      ]}
    >
      <ScrollGlassReveal delayMs={40}>
        <SupplySide />
      </ScrollGlassReveal>
      <ScrollGlassReveal delayMs={80}>
        <Phase2Preview />
      </ScrollGlassReveal>
      <ScrollGlassReveal delayMs={110}>
        <ChainingPreview />
      </ScrollGlassReveal>
    </FeaturePageShell>
  );
}
